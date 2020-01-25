from django.contrib import admin
from .models import Boards, Lists, Tasks
# Register your models here.

admin.site.register(Boards)
admin.site.register(Lists)
admin.site.register(Tasks)
