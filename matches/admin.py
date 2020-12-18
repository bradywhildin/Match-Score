from django.contrib import admin
from .models import MatchRequest, Match, Block

admin.site.register(MatchRequest)
admin.site.register(Match)
admin.site.register(Block)
