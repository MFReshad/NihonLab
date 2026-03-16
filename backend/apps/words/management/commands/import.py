import csv
import requests
import time
from django.core.management.base import BaseCommand
from apps.words.models import Word, Kanji, Compound

try:
    import pykakasi
    KAKASI_AVAILABLE = True
except ImportError:
    KAKASI_AVAILABLE = False
    print("Warning: pykakasi not installed. Install with: pip install pykakasi")
    print("Furigana will not be generated for example sentences.")

JISHO_WORD_API = "https://jisho.org/api/v1/search/words?keyword="
JISHO_SCRAPE_URL = "https://jisho.org/search/"
KANJI_API = "https://kanjiapi.dev/v1/kanji/"
TATOEBA_API = "https://tatoeba.org/en/api_v0/search?from=jpn&to=eng&query="

class Command(BaseCommand):
    def __init__(self):
        super().__init__()
        if KAKASI_AVAILABLE:
            self.kakasi = pykakasi.kakasi()
        else:
            self.kakasi = None

    def add_arguments(self, parser):
        parser.add_argument('--csv', type=str, help='Path to CSV file')

    def handle(self, *args, **options):
        csv_path = options['csv']
        
        if not csv_path:
            self.stdout.write(self.style.ERROR('Please provide a CSV file path using --csv'))
            return
            
        try:
            with open(csv_path, encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    term = row.get("Word/Kanji", "").strip()
                    if not term:
                        continue

                    # Detect Kanji or Word
                    if len(term) == 1 and self.is_kanji(term):
                        self.import_kanji(term)
                    else:
                        self.import_word(term)
                    
                    # Be nice to APIs - small delay between requests
                    time.sleep(0.5)
                    
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'File not found: {csv_path}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))

    def is_kanji(self, char):
        """Check if character is a kanji"""
        code = ord(char)
        return (0x4E00 <= code <= 0x9FFF) or (0x3400 <= code <= 0x4DBF)

    def import_word(self, term):
        """Import word with audio and examples"""
        try:
            # Check if word already exists
            if Word.objects.filter(text=term).exists():
                self.stdout.write(self.style.WARNING(f'⚠️  Word already exists: {term}'))
                return

            # Get basic info from Jisho API
            res = requests.get(JISHO_WORD_API + term, timeout=10)
            if res.status_code != 200:
                self.stdout.write(self.style.ERROR(f'❌ Failed to fetch word: {term}'))
                return
                
            data = res.json()
            if not data.get("data"):
                self.stdout.write(self.style.WARNING(f'⚠️  No data found for: {term}'))
                return

            info = data["data"][0]
            japanese = info.get("japanese", [{}])[0]
            senses = info.get("senses", [{}])[0]

            # Get audio by scraping Jisho page
            audio_url = self.get_audio_from_jisho(term)
            
            # Get example sentence from Tatoeba
            example_jp, example_en = self.get_example_from_tatoeba(term)

            # Create word
            word = Word.objects.create(
                text=japanese.get("word", term),
                reading=japanese.get("reading", ""),
                meaning="; ".join(senses.get("english_definitions", [])),
                part_of_speech=", ".join(senses.get("parts_of_speech", [])),
                jlpt_level=info.get("jlpt", [""])[0] if info.get("jlpt") else "",
                audio_url=audio_url,
                example_jp=example_jp,
                example_en=example_en,
                is_kanji=False
            )
            
            # Create compound relationships with kanji
            self.create_compounds(word)
            
            self.stdout.write(self.style.SUCCESS(f'✅ Added Word: {word.text}'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error importing word {term}: {str(e)}'))

    def import_kanji(self, term):
        """Import kanji character"""
        try:
            # Check if kanji already exists
            if Kanji.objects.filter(character=term).exists():
                self.stdout.write(self.style.WARNING(f'⚠️  Kanji already exists: {term}'))
                return

            res = requests.get(f"{KANJI_API}{term}", timeout=10)
            if res.status_code != 200:
                self.stdout.write(self.style.ERROR(f'❌ Failed to fetch kanji: {term}'))
                return
                
            data = res.json()

            # Construct stroke order URL
            stroke_order_url = self.get_stroke_order_url(term)

            kanji = Kanji.objects.create(
                character=term,
                meaning=", ".join(data.get("meanings", [])),
                onyomi=", ".join(data.get("on_readings", [])),
                kunyomi=", ".join(data.get("kun_readings", [])),
                stroke_count=data.get("stroke_count", 0),
                jlpt_level=f"N{data.get('jlpt', '')}" if data.get("jlpt") else "",
                stroke_order_url=stroke_order_url
            )
            
            self.stdout.write(self.style.SUCCESS(f'✅ Added Kanji: {kanji.character}'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error importing kanji {term}: {str(e)}'))

    def get_audio_from_jisho(self, term):
        """Scrape audio URL from Jisho page"""
        try:
            # Use Jisho search page
            url = f"{JISHO_SCRAPE_URL}{term}"
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            res = requests.get(url, headers=headers, timeout=10)
            
            if res.status_code == 200:
                # Look for audio URLs in the page HTML
                if 'cloudfront.net/audio/' in res.text:
                    # Extract the MP3 URL
                    import re
                    pattern = r'(https://d1vjc5dkcd3yh2\.cloudfront\.net/audio/[a-f0-9]+\.mp3)'
                    match = re.search(pattern, res.text)
                    if match:
                        return match.group(1)
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'⚠️  Could not fetch audio for {term}: {str(e)}'))
        
        return ""

    def get_example_from_tatoeba(self, term):
        """Get example sentence from Tatoeba API and add furigana"""
        try:
            res = requests.get(f"{TATOEBA_API}{term}", timeout=10)
            if res.status_code == 200:
                data = res.json()
                results = data.get("results", [])
                
                if results:
                    # Get the first result
                    result = results[0]
                    japanese_text = result.get("text", "")
                    
                    # Add furigana to the Japanese text
                    japanese_with_furigana = self.add_furigana(japanese_text)
                    
                    # Get English translation
                    translations = result.get("translations", [[]])
                    english_text = ""
                    if translations and len(translations[0]) > 0:
                        english_text = translations[0][0].get("text", "")
                    
                    return japanese_with_furigana, english_text
                    
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'⚠️  Could not fetch example for {term}: {str(e)}'))
        
        return "", ""
    
    def add_furigana(self, text):
        """Add furigana (reading) to Japanese text using pykakasi"""
        if not self.kakasi or not text:
            return text
        
        try:
            result = self.kakasi.convert(text)
            formatted_text = ""
            
            for item in result:
                original = item['orig']
                reading = item['hira']
                
                # Only add ruby tags if the reading is different from original
                # (meaning it's kanji, not already hiragana/katakana)
                if original != reading and self.contains_kanji(original):
                    formatted_text += f'<ruby>{original}<rt>{reading}</rt></ruby>'
                else:
                    formatted_text += original
            
            return formatted_text
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'⚠️  Error adding furigana: {str(e)}'))
            return text
    
    def contains_kanji(self, text):
        """Check if text contains any kanji characters"""
        for char in text:
            code = ord(char)
            if (0x4E00 <= code <= 0x9FFF) or (0x3400 <= code <= 0x4DBF):
                return True
        return False

    def get_stroke_order_url(self, kanji):
        """Get stroke order diagram URL"""
        # Try multiple sources
        urls = [
            f"https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji/{ord(kanji):x}.svg",
            f"https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/{ord(kanji):05x}.svg",
        ]
        
        # Return the first one (you can add validation if needed)
        return urls[1]  # KanjiVG is more reliable

    def create_compounds(self, word):
        """Create Compound relationships between word and its kanji"""
        try:
            text = word.text
            
            # Find all kanji in the word
            for i, char in enumerate(text):
                if self.is_kanji(char):
                    # Get or skip if kanji doesn't exist
                    try:
                        kanji = Kanji.objects.get(character=char)
                    except Kanji.DoesNotExist:
                        continue
                    
                    # Determine position
                    if i == 0:
                        position = "start"
                    elif i == len(text) - 1:
                        position = "end"
                    else:
                        position = "contain"
                    
                    # Create compound if it doesn't exist
                    Compound.objects.get_or_create(
                        kanji=kanji,
                        word=word,
                        defaults={'position': position}
                    )
                    
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'⚠️  Error creating compounds: {str(e)}'))