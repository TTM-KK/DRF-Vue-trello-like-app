from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status
from django_filters import rest_framework as filters

from .serializers import BoardsSerializer, ListsSerializer, TasksSerializer
from trello.models import Boards, Lists, Tasks


class BoardsViewSet(viewsets.ModelViewSet):
    queryset = Boards.objects.all()
    serializer_class = BoardsSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['owner']

    # methodのオーバーライド
    def create(self, request, *args, **kwargs):
        request.data['owner'] = self.request.user.pk  # 追加
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    # # perform_create()はcreate()が実行されるときに呼ばれる。
    # # save()実行時にDBに保存される。この際にUserオブジェクトなどをかませることができる。
    # def perform_create(self, serializer):
    #     serializer.save(owner=self.request.user)
    #     print('pass this')


class ListsViewSet(viewsets.ModelViewSet):
    queryset = Lists.objects.all()
    serializer_class = ListsSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['board']


class TasksViewSet(viewsets.ModelViewSet):
    queryset = Tasks.objects.all()
    serializer_class = TasksSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['list__id']
