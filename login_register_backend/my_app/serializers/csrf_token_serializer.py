from rest_framework import serializers
from ..models import CsrfToken

class CsrfTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = CsrfToken
        fields = '__all__'
