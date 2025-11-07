from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'avatar_url',
            'registration_method',
            'is_active',
            'date_joined'
        ]
        read_only_fields = ['id', 'date_joined', 'registration_method']
    
    def to_representation(self, instance):
        """Customize the output representation"""
        data = super().to_representation(instance)
        # Add full name
        data['full_name'] = instance.get_full_name()
        return data