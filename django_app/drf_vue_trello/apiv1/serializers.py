from rest_framework import serializers

from trello.models import Boards, Lists, Tasks


class BoardsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Boards
        fields = ['id', 'owner', 'name', 'order']


class ListsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lists
        fields = ['id', 'board', 'name', 'order']


class TasksSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tasks
        fields = ['id', 'list', 'title', 'completed', 'order']
