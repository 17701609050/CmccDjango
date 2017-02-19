from django.contrib import admin
from login.models import User

class UserAdmin(admin.ModelAdmin):
    list_display = ('username','password')

admin.site.register(User, UserAdmin)
# Register your models here.
