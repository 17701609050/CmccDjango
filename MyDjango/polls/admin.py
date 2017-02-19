from django.contrib import admin
from polls.models import Poll
from polls.models import Choice

#class PollAdmin(admin.TabularInline):
#    fieldsets = [
#                (None, {'fields': ['question']}),
#                ('Date information', {'fields': ['pub_date'], 'classes': ['collapse']}),
#            ]
    
class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 2
    
    
class PollAdmin(admin.ModelAdmin):
    list_display = ('question', 'pub_date', 'was_published_recently')
    fieldsets = [
    (None, {'fields': ['question']}),
    ('Date information', {'fields': ['pub_date'], 'classes': ['collapse']}),
    ]
    inlines = [ChoiceInline]
    list_filter = ['pub_date']
    search_fields = ['question']
admin.site.register(Poll, PollAdmin)
#admin.site.register(Choice)
# Register your models here.
