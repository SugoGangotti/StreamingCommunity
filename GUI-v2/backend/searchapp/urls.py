from django.urls import path
from . import views

urlpatterns = [
    path("", views.search_home, name="search_home"),
    path("search/", views.search, name="search"),
    path("download/", views.start_download, name="start_download"),
    path("series-metadata/", views.series_metadata, name="series_metadata"),
    path("add-to-list/", views.add_to_list, name="add_to_list"),
    path("remove-from-list/", views.remove_from_list, name="remove_from_list"),
    path("list/", views.my_list, name="list"),
    path("login/", views.login, name="login"),
    path("settings/", views.settings, name="settings"),
]
