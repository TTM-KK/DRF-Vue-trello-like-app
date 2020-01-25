from django.urls import include, path
from rest_framework import routers

from . import views

router_boards = routers.DefaultRouter()
router_boards.register('boards', views.BoardsViewSet)

router_lists = routers.DefaultRouter()
router_lists.register('lists', views.ListsViewSet)

router_tasks = routers.DefaultRouter()
router_tasks.register('tasks', views.TasksViewSet)

app_name = 'apiv1'
urlpatterns = [
    path('trello/', include(router_boards.urls)),
    path('trello/', include(router_lists.urls)),
    path('trello/', include(router_tasks.urls)),
]