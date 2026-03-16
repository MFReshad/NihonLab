from django.db import models

# Create your models here.
class Word(models.Model):
    text = models.CharField(max_length=50)
    reading = models.CharField(max_length=100, blank=True)
    meaning = models.TextField()
    part_of_speech = models.CharField(max_length=100, blank=True)
    jlpt_level = models.CharField(max_length=10, blank=True)
    audio_url = models.URLField(blank=True)
    example_jp = models.TextField(blank=True)
    example_en = models.TextField(blank=True)
    is_kanji = models.BooleanField(default=False)

    def __str__(self):
        return self.text
    
class Kanji(models.Model):
    character = models.CharField(max_length=5)
    meaning = models.TextField()
    onyomi = models.CharField(max_length=100, blank=True)
    kunyomi = models.CharField(max_length=100, blank=True)
    stroke_count = models.IntegerField(default=0)
    stroke_order_url = models.URLField(blank=True)
    jlpt_level = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return self.character

class Compound(models.Model):
    kanji = models.ForeignKey(Kanji, on_delete=models.CASCADE, related_name='compounds')
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    position = models.CharField(max_length=10, choices=[("start","start"),("end","end"),("contain","contain")])