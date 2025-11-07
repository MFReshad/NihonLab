from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Fields to display in the list view
    list_display = (
        'id', 'email', 'first_name', 'last_name', 'avatar_url', 
        'registration_method', 'is_active', 'is_staff', 'is_superuser', 'date_joined'
    )

    # Fields to filter by
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'registration_method')

    # Fields to search
    search_fields = ('email', 'first_name', 'last_name')

    # Field used as username
    ordering = ('email',)

    # Fields shown in the user detail page
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'avatar_url')}),
        # ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('date_joined', 'last_login')}),
        ('Registration', {'fields': ('registration_method',)}),
    )

    readonly_fields = ('date_joined',)

    # Fields for adding a new user via admin
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser')}
        ),
    )
