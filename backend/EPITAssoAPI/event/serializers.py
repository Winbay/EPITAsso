from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format='%d/%m/%Y')
    start_time = serializers.DateTimeField(format='%d/%m/%Y %H:%M:%S')
    end_time = serializers.DateTimeField(format='%d/%m/%Y %H:%M:%S')

    class Meta:
        model = Event
        fields = '__all__'