from rest_framework import serializers
from .models import User, CsrfToken, UserAuthToken

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class CsrfTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = CsrfToken
        fields = '__all__'


class UserAuthTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAuthToken
        fields = '__all__'