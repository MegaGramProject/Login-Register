from django.db import models

class APIKey(models.Model):
    purpose = models.TextField(primary_key=True)
    hashed_api_key = models.CharField(max_length=45)
    api_key_salt = models.CharField(max_length=45)
    expiration = models.DateTimeField()

    class Meta:
        app_label = 'local-psql'
        db_table = 'api_keys'