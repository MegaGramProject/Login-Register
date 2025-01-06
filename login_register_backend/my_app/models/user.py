from django.db import models

class User(models.Model):
    id = models.BigAutoField(primary_key = True)
    username = models.CharField(max_length=30, unique=True)
    full_name = models.CharField(db_column='fullName', max_length=50)
    salt = models.CharField(max_length=30)
    hashed_password = models.CharField(db_column='hashedPassword', max_length=60)
    contact_info = models.TextField(db_column='contactInfo')
    date_of_birth = models.TextField(db_column='dateOfBirth')
    created = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(db_column='isVerified')
    is_private = models.BooleanField(db_column='isPrivate')
    account_based_in = models.TextField(db_column='accountBasedIn')

    class Meta:
        app_label = 'default' #(local-mysql)
        db_table = 'users'