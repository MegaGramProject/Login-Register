from django.db import models


class User(models.Model):
    username = models.CharField(max_length=30, unique=True)
    full_name = models.CharField(db_name='fullName', max_length=30)
    salt = models.CharField(max_length=50)
    hashed_password = models.CharField(db_name='hashedPassword', max_length=128)
    contact_info = models.CharField(db_name='contactInfo', max_length=320)
    date_of_birth = models.CharField(db_name='dateOfBirth', max_length=9)
    created = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(db_name='isVerified', default=False)
    is_private = models.BooleanField(db_name='isPrivate', default=False)
    account_based_in = models.CharField(db_name='accountBasedIn', max_length=320, default="")

    def __str__(self):
        return self.username
    