from rest_framework import serializers

class PositionSerializer(serializers.Serializer):
    name = serializers.CharField()
    positions = serializers.ListField(child=serializers.FloatField())
