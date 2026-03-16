import csv
import requests
from django.core.management.base import BaseCommand
from apps.words.models import Word, Kanji, Compound

JISHO_WORD_API = "https://jisho.org/api/v1/search/words?keyword="
JISHO_KANJI_API = "https://jisho.org/api/v1/search/kanji/"

class Command(BaseCommand):
    help = "Import words or kanji details from CSV using Jisho API"

    def add_arguments(self, parser):
        parser.add_argument('--csv', type=str, help='Path to CSV file')

    def handle(self, *args, **options):
        csv_path = options['csv']
        with open(csv_path, encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                term = row.get("Word/Kanji").strip()
                if not term:
                    continue

                # Detect Kanji or Word
                if len(term) == 1:
                    self.import_kanji(term)
                else:
                    self.import_word(term)

    def import_word(self, term):
        res = requests.get(JISHO_WORD_API + term)
        if res.status_code != 200:
            return
        data = res.json()

        if not data["data"]:
            return

        info = data["data"][0]
        japanese = info["japanese"][0]
        senses = info["senses"][0]

        word = Word.objects.create(
            text=japanese.get("word", term),
            reading=japanese.get("reading", ""),
            meaning=", ".join(senses["english_definitions"]),
            part_of_speech=", ".join(senses["parts_of_speech"]),
            jlpt_level=info["jlpt"][0] if info["jlpt"] else "",
            audio_url=self.extract_audio(info),
            example_jp=self.extract_example_sentence(term),
            example_en=self.extract_example_translation(term),
            is_kanji=False
        )
        print(f"✅ Added Word: {word.text}")

    def import_kanji(self, term):
        res = requests.get(f"https://kanjiapi.dev/v1/kanji/{term}")
        if res.status_code != 200:
            return
        data = res.json()

        kanji = Kanji.objects.create(
            character=term,
            meaning=", ".join(data.get("meanings", [])),
            onyomi=", ".join(data.get("on_readings", [])),
            kunyomi=", ".join(data.get("kun_readings", [])),
            stroke_count=data.get("stroke_count", 0),
            jlpt_level=f"N{data.get('jlpt', '')}" if data.get("jlpt") else "",
            stroke_order_url=f"https://raw.githubusercontent.com/davidluzgouveia/kanji-stroke-order/master/kanji/{term}.gif"
        )
        print(f"✅ Added Kanji: {kanji.character}")

    def extract_audio(self, info):
        # Sometimes audio is in the extra fields of Jisho JSON
        if "audio" in info:
            audio_list = info.get("audio", [])
            if audio_list:
                return audio_list[0].get("uri")
        return ""

    def extract_example_sentence(self, term):
        # Optional: later you can use Tatoeba API for real example sentences
        return ""

    def extract_example_translation(self, term):
        return ""
