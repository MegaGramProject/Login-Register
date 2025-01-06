from django.db import models

class CsrfToken(models.Model):
    purpose = models.TextField(primary_key=True)
    hashed_csrf_token = models.CharField(max_length=45)
    csrf_token_salt = models.CharField(max_length=45)
    expiration_date = models.DateTimeField()

    class Meta:
        app_label = 'local-psql'
        db_table = 'csrf_tokens'