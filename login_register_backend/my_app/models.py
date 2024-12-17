from django.db import models


class User(models.Model):
    username = models.CharField(max_length=30, unique=True)
    full_name = models.CharField(db_column='fullName', max_length=30)
    salt = models.CharField(max_length=50)
    hashed_password = models.CharField(db_column='hashedPassword', max_length=128)
    contact_info = models.CharField(db_column='contactInfo', max_length=320)
    date_of_birth = models.CharField(db_column='dateOfBirth', max_length=9)
    created = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(db_column='isVerified', default=False)
    is_private = models.BooleanField(db_column='isPrivate', default=False)
    account_based_in = models.CharField(db_column='accountBasedIn', max_length=320, default="")

    def __str__(self):
        return self.username
    
    class Meta:
        db_table = 'users'
    