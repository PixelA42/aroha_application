from django.apps import AppConfig

class ContactarohaConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'contactaroha'

    def ready(self):
        from rest_framework.authtoken.models import Token
