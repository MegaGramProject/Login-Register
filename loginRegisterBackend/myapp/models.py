from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=30)
    fullName = models.CharField(max_length=30)
    salt = models.CharField(max_length=50)
    hashedPassword = models.CharField(max_length=128)
    contactInfo = models.CharField(max_length=60)
    dateOfBirth = models.CharField(max_length=9)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
    