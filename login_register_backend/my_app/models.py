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
    

class CsrfToken(models.Model):
    purpose = models.TextField(primary_key=True)
    hashed_csrf_token = models.CharField(max_length=45)
    csrf_token_salt = models.CharField(max_length=45)
    expiration_date = models.DateTimeField()

    class Meta:
        app_label = 'local-psql'
        db_table = 'csrf_tokens'


class UserAuthToken(models.Model):
    user_id = models.IntegerField(db_column='userId', primary_key=True)
    hashed_auth_token = models.CharField(db_column='hashedAuthToken', max_length=45)
    auth_token_salt = models.CharField(db_column='authTokenSalt', max_length=45)
    hashed_refresh_token = models.CharField(db_column='hashedRefreshToken', max_length=45)
    refresh_token_salt = models.CharField(db_column='refreshTokenSalt', max_length=45)
    auth_token_expiry = models.DateTimeField(db_column='authTokenExpiry')
    refresh_token_expiry = models.DateTimeField(db_column='refreshTokenExpiry')

    class Meta:
        app_label = 'google-cloud-mysql'
        db_table = 'userAuthTokens'