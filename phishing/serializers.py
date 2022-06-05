from pyexpat import model
#from attr import field
from rest_framework import serializers
from .models import Fish


class FishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fish
        fields = '__all__'