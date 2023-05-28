from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('home/'),
    path('Compare/'),
    path('compare_raid_triumphs/')
]