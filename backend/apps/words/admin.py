from django.contrib import admin

# Register your models here.
from .models import Word, Kanji, Compound

admin.site.register(Word)
admin.site.register(Kanji)
admin.site.register(Compound)