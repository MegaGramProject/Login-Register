from django.db import models


class User(models.Model):
    username = models.CharField(max_length=30, unique=True)
    fullName = models.CharField(max_length=30)
    salt = models.CharField(max_length=50)
    hashedPassword = models.CharField(max_length=128)
    contactInfo = models.CharField(max_length=320, unique=True)
    dateOfBirth = models.CharField(max_length=9)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
    