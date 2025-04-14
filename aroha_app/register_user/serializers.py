from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'password', 'is_active']  # Include is_active field
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        if len(validated_data['password']) < 8:
            raise serializers.ValidationError('Password must be at least 8 characters long.')
        if len(validated_data['password']) > 20:
            raise serializers.ValidationError('Password must not exceed 20 characters.')
        return User.objects.create_user(**validated_data)

class AuthTokenSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(request=self.context.get('request'), email=email, password=password)
        if not user:
            raise serializers.ValidationError('Invalid credentials', code='authorization')
        attrs['user'] = user
        return attrs
