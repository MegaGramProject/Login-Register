from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, APIKey
from .serializers import UserSerializer
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from twilio.rest import Client
import ssl
import random
import requests
import os
from google.cloud import kms_v1, spanner
from google.protobuf import duration_pb2, timestamp_pb2
import datetime
import base64
from django.core.management.utils import get_random_secret_key
import hashlib
import json
import redis
import uuid
from datetime import datetime as datetime2

redis_client = redis.Redis(
    host='redis-14251.c261.us-east-1-4.ec2.redns.redis-cloud.com',
    port=14251,
    decode_responses=True,
    username="rishavry",
    password=os.environ.get('AWS_REDIS_PASSWORD')
)

gcloud_mysql_spanner_client = spanner.Client()
instance = gcloud_mysql_spanner_client.instance("mg-ms-sp")
gcloud_mysql_spanner_database = instance.database("megagram")


languages_available_for_translation = set([
    "English",
    "Français",
    "Español",
    "हिंदी",
    "বাংলা",
    "中国人",
    "العربية",
    "Deutsch",
    "Bahasa Indonesia",
    "Italiano",
    "日本語",
    "Русский"
])

language_code_to_long_form_mappings = {
    'en': "English",
    'fr': "Français",
    'es': "Español",
    'hi': "हिंदी",
    'bn': "বাংলা",
    'zh-CN': "中国人",
    'ar': "العربية",
    'de': "Deutsch",
    'id': "Bahasa Indonesia",
    'it': "Italiano",
    'ja': "日本語",
    'ru': "Русский"
}
        

@api_view(['POST'])
def create_user(request):
    authorization = request.META.get('HTTP_AUTHORIZATION')
    if authorization is not None:
        authorization_parts = authorization.split(" ") # Split the authorization header (Bearer <api_token>)
        if len(authorization_parts) != 2:
            return Response(status=status.HTTP_403_FORBIDDEN)
        api_key_validation_result = validate_api_key('createUser', authorization_parts[1])
        if api_key_validation_result == 'Forbidden':
            return Response(status=status.HTTP_403_FORBIDDEN)
        
            

    if(request.data.get('full_name') and request.data.get('salt') and
    request.data.get('hashed_password') and request.data.get('contact_info') and request.data.get('date_of_birth')):

        client = kms_v1.KeyManagementServiceClient()
        if is_contact_info_taken(client, request.data['contact_info']):
            return Response(status=status.HTTP_409_CONFLICT)

        new_user_data = {
            'username': request.data['username'],
            'full_name': request.data['full_name'],
            'salt': request.data['salt'],
            'hashed_password': request.data['hashed_password'],
            'contact_info': 'TEMPORARY',
            'date_of_birth': 'TEMPORARY',
            'account_based_in': 'TEMPORARY',
            'is_verified': False,
            'is_private': False,
        }

        serializer = UserSerializer(data=new_user_data)
        if serializer.is_valid():
            newly_saved_user = serializer.save()
            newly_saved_user_id = newly_saved_user.id

            new_encryption_key = create_encryption_key(client, 'megagram-428802', 'global', 'usersTableMySQL',
            str(newly_saved_user_id), 70)
            new_encryption_key_name = client.crypto_key_path('megagram-428802', 'global', 'usersTableMySQL',
            str(newly_saved_user_id))

            #Encrypt contact_info for both public and private users
            contact_info_plaintext = request.data['contact_info']
            response = client.encrypt(name=new_encryption_key_name, plaintext=contact_info_plaintext.encode("utf-8"))
            contact_info_encrypted_base64_string = base64.b64encode(response.ciphertext).decode('utf-8')
            new_user_data['contact_info'] = contact_info_encrypted_base64_string

            if(request.data.get('is_private')):
                new_user_data['is_private'] = request.data['is_private']
                is_private = request.data['is_private']
                if(is_private is True):
                    date_of_birth_plaintext = request.data['date_of_birth']
                    response = client.encrypt(name=new_encryption_key_name, plaintext=date_of_birth_plaintext.encode("utf-8"))
                    date_of_birth_encrypted_base64_string = base64.b64encode(response.ciphertext).decode('utf-8')
                    new_user_data['date_of_birth'] = date_of_birth_encrypted_base64_string

                    account_based_in_plaintext = 'N/A'
                    if(request.data.get('account_based_in')):
                        account_based_in_plaintext = request.data['account_based_in']

                    response = client.encrypt(name=new_encryption_key_name,
                    plaintext=account_based_in_plaintext.encode("utf-8"))
                    account_based_in_encrypted_base64_string = base64.b64encode(response.ciphertext).decode('utf-8')
                    new_user_data['account_based_in'] = account_based_in_encrypted_base64_string
                else:
                    new_user_data['date_of_birth'] = request.data['date_of_birth']
                    if request.data.get('account_based_in'):
                        new_user_data['account_based_in'] = request.data['account_based_in']
                    else:
                        new_user_data['account_based_in'] = 'N/A'

            else:
                new_user_data['is_private'] = False
                new_user_data['date_of_birth'] = request.data['date_of_birth']
                if request.data.get('account_based_in'):
                    new_user_data['account_based_in'] = request.data['account_based_in']
                else:
                    new_user_data['account_based_in'] = 'N/A'
            
            if request.data.get('is_verified'):
                new_user_data['is_verified'] = request.data['is_verified']
            else:
                new_user_data['is_verified'] = False
            
            user = User.objects.get(id = newly_saved_user_id)
            serializer2 = UserSerializer(user, data=new_user_data, partial=True)

            if serializer2.is_valid():
                serializer2.save()

                del new_user_data['username']
                new_user_data['id'] = newly_saved_user_id
                new_user_data['created'] = newly_saved_user.created
                redis_client.hset('Usernames and their Info', new_user_data['username'], json.dumps(new_user_data))

                auth_and_refresh_token_for_new_user = generate_tokens_for_new_user(newly_saved_user_id)
                response = Response(newly_saved_user_id)
                response.set_cookie(
                    key='authToken'+newly_saved_user_id,
                    value=auth_and_refresh_token_for_new_user[0],
                    httponly=True,
                    samesite='Strict',
                    max_age=60*45 #45 min
                )
                response.set_cookie(
                    key='refreshToken'+newly_saved_user_id,
                    value=auth_and_refresh_token_for_new_user[1],
                    httponly=True,
                    samesite='Strict',
                    max_age=60*10080 #10,080 min (1 week)
                )
                return response

            return Response(serializer2.errors, status=status.HTTP_400_BAD_REQUEST)
            
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
def update_user(request, id):
    refresh_auth_token = False
    user_authorization_result = validate_user_auth_token(id, request.COOKIES)
    if user_authorization_result == 'Forbidden':
        return Response(status=status.HTTP_403_FORBIDDEN)
    if user_authorization_result.endswith(', but Refresh Auth Token'):
        refresh_auth_token = True

    try:
        user = User.objects.get(id = id)
        original_username = user.username
        client = kms_v1.KeyManagementServiceClient()
        encryption_key_name = client.crypto_key_path('megagram-428802', 'global', 'usersTableMySQL',  str(id))

        update_user_data = {}
        for key in request.data:
            if key=='contact_info':
                contact_info_plaintext = request.data['contact_info']
                response = client.encrypt(name=encryption_key_name, plaintext=contact_info_plaintext.encode("utf-8"))
                contact_info_encrypted_base64_string = base64.b64encode(response.ciphertext).decode('utf-8')
                update_user_data['contact_info'] = contact_info_encrypted_base64_string
            elif key=='date_of_birth':
                if request.data['is_private'] is True or user.is_private is True:
                    date_of_birth_plaintext = request.data['date_of_birth']
                    response = client.encrypt(name=encryption_key_name, plaintext=date_of_birth_plaintext.encode("utf-8"))
                    date_of_birth_encrypted_base64_string = base64.b64encode(response.ciphertext).decode('utf-8')
                    update_user_data['date_of_birth'] = date_of_birth_encrypted_base64_string
                else:
                    update_user_data['date_of_birth'] = request.data['date_of_birth']
            elif key=='account_based_in':
                if request.data['is_private'] is True or user.is_private is True:
                    account_based_in_plaintext = request.data['account_based_in']
                    response = client.encrypt(name=encryption_key_name, plaintext=account_based_in_plaintext.encode("utf-8"))
                    account_based_in_encrypted_base64_string = base64.b64encode(response.ciphertext).decode('utf-8')
                    update_user_data['account_based_in'] = account_based_in_encrypted_base64_string
                else:
                    update_user_data['account_based_in'] = request.data['account_based_in']
            else:
                update_user_data[key] = request.data[key]

        
        current_is_private = user.is_private
        update_is_private = request.data.get('is_private')
        if(current_is_private != update_is_private):
            if(update_is_private is True):
                if 'date_of_birth' not in update_user_data:
                    date_of_birth_plaintext = user.date_of_birth
                    response = client.encrypt(name=encryption_key_name, plaintext=date_of_birth_plaintext.encode("utf-8"))
                    date_of_birth_encrypted_base64_string = base64.b64encode(response.ciphertext).decode('utf-8')
                    update_user_data['date_of_birth'] = date_of_birth_encrypted_base64_string
                if 'account_based_in' not in update_user_data:
                    account_based_in_plaintext = user.account_based_in
                    response = client.encrypt(name=encryption_key_name, plaintext=account_based_in_plaintext.encode("utf-8"))
                    account_based_in_encrypted_base64_string = base64.b64encode(response.ciphertext).decode('utf-8')
                    update_user_data['account_based_in'] = account_based_in_encrypted_base64_string
            else:
                if 'date_of_birth' not in update_user_data:
                    encrypted_date_of_birth = user.date_of_birth
                    date_of_birth_plaintext = decrypt_data(client,
                    'megagram-428802', 'global', 'usersTableMySQL', user.id, base64.b64decode(encrypted_date_of_birth))
                    update_user_data['date_of_birth'] = date_of_birth_plaintext
                if 'account_based_in' not in update_user_data:
                    encrypted_account_based_in = user.account_based_in
                    account_based_in_plaintext = decrypt_data(client,
                    'megagram-428802', 'global', 'usersTableMySQL', user.id, base64.b64decode(encrypted_account_based_in))
                    update_user_data['account_based_in'] = account_based_in_plaintext


        serializer = UserSerializer(user, data=update_user_data, partial=True)
        if serializer.is_valid():
            updated_user = serializer.save()

            updated_user_info = {
                'id': updated_user.id,
                'created': updated_user.created,
                'full_name': updated_user.full_name,
                'salt': updated_user.salt,
                'hashed_password': updated_user.hashed_password,
                'contact_info': updated_user.contact_info,
                'date_of_birth': updated_user.date_of_birth,
                'account_based_in': updated_user.account_based_in,
                'is_verified': updated_user.is_verified,
                'is_private': updated_user.is_private
            }
            if 'username' in request.data: #(if username was changed)
                redis_client.hdel('Usernames and their Info', original_username)
            redis_client.hset('Usernames and their Info', updated_user.username, json.dumps(updated_user_info))

            response = Response(updated_user.id)
            if refresh_auth_token:
                 new_auth_token = refresh_user_auth_token(updated_user.id)
                 response.set_cookie(
                    key='authToken'+id,
                    value=new_auth_token,
                    httponly=True,
                    samesite='Strict',
                    max_age=60*45 #45 min
                )
            return response

    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
def get_full_name(request, username):
    user_info = redis_client.hget('Usernames and their Info', username)
    if user_info is None:
        return Response(status=status.HTTP_404_NOT_FOUND)
    user_info = json.loads(user_info)    
    return Response(user_info['full_name'])


@api_view(['GET'])
def is_account_private(request, username):
    user_info = redis_client.hget('Usernames and their Info', username)
    if user_info is None:
        return Response(status=status.HTTP_404_NOT_FOUND)
    user_info = json.loads(user_info)    
    return Response(user_info['is_private'])


@api_view(['DELETE'])
def remove_user(request, id):
    user_authorization_result = validate_user_auth_token(id, request.COOKIES)
    if user_authorization_result == 'Forbidden':
        return Response(status=status.HTTP_403_FORBIDDEN)

    try:
        user = User.objects.get(id = id)
    except User.DoesNotExist:
        #this code will not be reached because of user-authentication earlier in this function
        pass
    
    user.delete()

    redis_client.hdel('Usernames and their Info', user.username)

    with gcloud_mysql_spanner_database.batch() as batch:
        batch.delete(
            table="userAuthTokens",
            keyset=spanner.KeySet(keys=[[id]])
        )

    response = Response(True, status=status.HTTP_204_NO_CONTENT)
    response.set_cookie(
        key='authToken'+id,
        value='',
        httponly=True,
        samesite='Strict',
        max_age=0
    )
    response.set_cookie(
        key='refreshToken'+id,
        value='',
        httponly=True,
        samesite='Strict',
        max_age=0
    )
    return response


@api_view(['POST'])
def send_confirmation_code_email(request):
    authorization = request.META.get('HTTP_AUTHORIZATION')
    if authorization is not None:
        authorization_parts = authorization.split(" ") # Split the authorization header (Bearer <api_token>)
        if len(authorization_parts) != 2:
            return Response(status=status.HTTP_403_FORBIDDEN)
        api_key_validation_result = validate_api_key('sendConfirmationCodeEmail', authorization_parts[1])
        if api_key_validation_result == 'Forbidden':
            return Response(status=status.HTTP_403_FORBIDDEN)

    email = request.data["email"]
    confirmation_code = random.randint(100000, 999999)
    message = MIMEMultipart("alternative")
    message["Subject"] = f"{confirmation_code} is your Megagram code"
    message["From"] = "megagram664@gmail.com"
    message["To"] = email
    summary_text =f"""\
    Hi, Someone tried to sign up for a Megagram account with {email}. If it was you, enter this confirmation code in the website:
    {confirmation_code}
    """
    html =f"""\
    <html>
    <body>
    <img src="https://static.vecteezy.com/system/resources/thumbnails/025/067/762/small_2x/4k-beautiful-colorful-abstract-wallpaper-photo.jpg" alt="Megagram" style="height:13em; width: 36em; object-fit: contain; margin-left:650px;">
    <div style="width: 560px; font-family:Arial; line-height:1.4; font-size:23px; margin-left: 630px;">
        <p>Hi,</p>
        <p></p>Someone tried to sign up for a Megagram account with {email} If it was you, enter this confirmation code in the website:</p>
        <p style="font-weight:bold; font-size: 30px; color:#4b4d4b; text-align: center;">{confirmation_code}</p>
    </div>
    <p style="color:gray; margin-top: 75px; text-align: center; width:777px; margin-left: 500px;">This email is for Megagram Account Registration. This message was sent to {email}.</p>
    </body>
    </html>
    """
    part1 = MIMEText(summary_text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)

    context = ssl.create_default_context()

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(os.environ.get('EMAIL_SENDER_ADDRESS'), os.environ.get('EMAIL_SENDER_AUTH_TOKEN'))
            server.sendmail(os.environ.get('EMAIL_SENDER_ADDRESS'), email, message.as_string())
            return Response(
                {
                    "confirmation_code": confirmation_code
                },
                status=status.HTTP_201_CREATED
            )
                
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def send_confirmation_code_text(request, number):
    authorization = request.META.get('HTTP_AUTHORIZATION')
    if authorization is not None:
        authorization_parts = authorization.split(" ") # Split the authorization header (Bearer <api_token>)
        if len(authorization_parts) != 2:
            return Response(status=status.HTTP_403_FORBIDDEN)
        api_key_validation_result = validate_api_key('sendConfirmationCodeText', authorization_parts[1])
        if api_key_validation_result == 'Forbidden':
            return Response(status=status.HTTP_403_FORBIDDEN)

    confirmation_code = random.randint(100000, 999999)
    account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
    auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
    client = Client(account_sid, auth_token)
    to = number
    messageBody = f'''{confirmation_code}\n\nHi, Someone tried to sign up for a Megagram account with {to}.
    If it was you, enter the 6-digit confirmation code mentioned in the beginning of this message.'''
    try:
        client.messages.create(
            body=messageBody,
            from_= os.environ.get('TWILIO_PHONE_NUMBER'),
            to=to
        )
        return Response(
            {
                "confirmation_code": confirmation_code
            },
            status=status.HTTP_201_CREATED
        )
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def does_user_exist(request):
    if request.data.get('username'):
        authorization = request.META.get('HTTP_AUTHORIZATION')
        if authorization is not None:
            authorization_parts = authorization.split(" ") # Split the authorization header (Bearer <api_token>)
            if len(authorization_parts) != 2:
                return Response(status=status.HTTP_403_FORBIDDEN)
            api_key_validation_result = validate_api_key('doesUsernameExist', authorization_parts[1])
            if api_key_validation_result == 'Forbidden':
                return Response(status=status.HTTP_403_FORBIDDEN)

        try:
            user_info = redis_client.hget('Usernames and their Info', request.data['username'])
            user_info = json.loads(user_info)
            return Response(
                {
                    "salt": user_info['salt'],
                    "hashed_password": user_info['hashed_password']
                }
            )
        except:
            return Response(
                {
                    "user_exists": False
                }
            )

    elif request.data.get('contact_info'):
        authorization = request.META.get('HTTP_AUTHORIZATION')
        if authorization is not None:
            authorization_parts = authorization.split(" ") # Split the authorization header (Bearer <api_token>)
            if len(authorization_parts) != 2:
                return Response(status=status.HTTP_403_FORBIDDEN)
            api_key_validation_result = validate_api_key('doesUserContactInfoExist', authorization_parts[1])
            if api_key_validation_result == 'Forbidden':
                return Response(status=status.HTTP_403_FORBIDDEN)

        contact_info = request.data['contact_info']
        info_for_each_user = redis_client.hgetall('Usernames and their Info')
        client = kms_v1.KeyManagementServiceClient()

        for user_info in info_for_each_user:
            user_info = json.loads(user_info)
            decrypted_contact_info = decrypt_data(
                client,
                'megagram-428802',
                'global',
                'usersTableMySQL',
                user_info['id'],
                base64.b64decode(user_info['contact_info'])
            )
            if contact_info==decrypted_contact_info:
                return Response(
                    {
                        "salt": user_info['salt'],
                        "hashed_password":user_info['hashed_password'],
                        "username":user_info['username']
                    }
                )


        return Response(
            {
                "user_exists": False
            }
        )
    
    else:
        return Response(
            {
                "user_exists": False
            }
        )
    


@api_view(['POST'])
def verify_captcha(request):
    data = {
        'secret': request.data['secret'],
        'response': request.data['response']
    }
    
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    
    encoded_data = "&".join([f"{key}={value}" for key, value in data.items()])

    try:
        response = requests.post("https://www.google.com/recaptcha/api/siteverify", data=encoded_data, headers=headers)
        if response.ok:
            if response.json()['success']:
                return Response(
                    {
                        "verified": True
                    }
                )
            else:
                return Response(
                    {
                        "verified": False
                    }
                )
        else:
            return Response(
                    {
                        "verified": False
                    }
                )
    except:
        return Response(
            {
                "verified": False
            }
        )
    

@api_view(['GET'])
def get_usernames_and_full_names_of_all(request):
    authorization = request.META.get('HTTP_AUTHORIZATION')
    if authorization is not None:
        authorization_parts = authorization.split(" ") # Split the authorization header (Bearer <api_token>)
        if len(authorization_parts) != 2:
            return Response(status=status.HTTP_403_FORBIDDEN)
        api_key_validation_result = validate_api_key('getUsernamesAndFullNamesOfAll', authorization_parts[1])
        if api_key_validation_result == 'Forbidden':
            return Response(status=status.HTTP_403_FORBIDDEN)
    
    info_for_each_user = redis_client.hgetall('Usernames and their Info')
    output = []
    for username in info_for_each_user:
        user_info = json.loads(info_for_each_user[username])
        output.append([username, user_info['full_name']])
    return Response(output)
        

@api_view(['GET'])
def get_relevant_user_info_from_username(request, username):
    authorization = request.META.get('HTTP_AUTHORIZATION')
    if authorization is not None:
        authorization_parts = authorization.split(" ") # Split the authorization header (Bearer <api_token>)
        if len(authorization_parts) != 2:
            return Response(status=status.HTTP_403_FORBIDDEN)
        api_key_validation_result = validate_api_key('getRelevantUserInfoFromUsername', authorization_parts[1])
        if api_key_validation_result == 'Forbidden':
            return Response(status=status.HTTP_403_FORBIDDEN)

    user_info = redis_client.hget('Usernames and their Info', username)
    user_info = json.loads(user_info)
    
    decrypted_date_of_birth = ""
    decrypted_account_based_in = ""

    if user_info['is_private']:
        client = kms_v1.KeyManagementServiceClient()

        encrypted_date_of_birth = user_info['date_of_birth']
        decrypted_date_of_birth = decrypt_data(
            client,
            'megagram-428802',
            'global',
            'usersTableMySQL',
            user_info['id'],
            base64.b64decode(user_info['date_of_birth'])
        )

        encrypted_account_based_in = user_info['account_based_in']
        decrypted_account_based_in = decrypt_data(
            client,
            'megagram-428802',
            'global',
            'usersTableMySQL',
            user_info['id'],
            base64.b64decode(user_info['account_based_in'])
        )

    else:
        decrypted_date_of_birth = user_info['date_of_birth']
        decrypted_account_based_in = user_info['account_based_in']
    
    return Response(
        {
            'username': user_info['username'],
            'full_name': user_info['full_name'],
            'date_of_birth': decrypted_date_of_birth,
            'created': user_info['created'],
            'is_verified': user_info['is_verified'],
            'account_based_in': decrypted_account_based_in,
            'is_private': user_info['is_private']
        }
    )

@api_view(['POST'])
def get_relevant_user_info_of_multiple_users(request):
    authorization = request.META.get('HTTP_AUTHORIZATION')
    if authorization is not None:
        authorization_parts = authorization.split(" ") # Split the authorization header (Bearer <api_token>)
        if len(authorization_parts) != 2:
            return Response(status=status.HTTP_403_FORBIDDEN)
        api_key_validation_result = validate_api_key('getRelevantUserInfoOfMultipleUsers', authorization_parts[1])
        if api_key_validation_result == 'Forbidden':
            return Response(status=status.HTTP_403_FORBIDDEN)

    if(request.data.get('list_of_usernames')):
        set_of_usernames = set(request.data['list_of_usernames'])
        user_info_mappings = {}
        for username in set_of_usernames:
            user_info = redis_client.hget('Usernames and their Info', username)
            if user_info is not None:
                user_info = json.loads(user_info)
                user_info_mappings[username] = {
                    'full_name': user_info['full_name'],
                    'is_verified': user_info['is_verified'],
                    'is_private': user_info['is_private']
                }
        
        return Response(user_info_mappings)
    
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_relevant_user_info_from_username_including_contact_info(request, username):
    authorization = request.META.get('HTTP_AUTHORIZATION')
    if authorization is not None:
        authorization_parts = authorization.split(" ") # Split the authorization header (Bearer <api_token>)
        if len(authorization_parts) != 2:
            return Response(status=status.HTTP_403_FORBIDDEN)
        api_key_validation_result = validate_api_key('getRelevantUserInfoFromUsernameIncludingContactInfo',
        authorization_parts[1])
        if api_key_validation_result == 'Forbidden':
            return Response(status=status.HTTP_403_FORBIDDEN)

    user_info = redis_client.hget('Usernames and their Info', username)
    user_info = json.loads(user_info)
    
    client = kms_v1.KeyManagementServiceClient()
 
    encrypted_contact_info = user_info['contact_info']
    decrypted_contact_info = decrypt_data(
        client,
        'megagram-428802',
        'global',
        'usersTableMySQL',
        user_info['id'],
        base64.b64decode(user_info['contact_info'])
    )
    decrypted_account_based_in = ""
    decrypted_date_of_birth = ""

    if user.is_private:
        encrypted_date_of_birth = user_info['date_of_birth']
        decrypted_date_of_birth = decrypt_data(
            client,
            'megagram-428802',
            'global',
            'usersTableMySQL',
            user_info['id'],
            base64.b64decode(user_info['date_of_birth'])
        )

        encrypted_account_based_in = user_info['account_based_in']
        decrypted_account_based_in = decrypt_data(
            client,
            'megagram-428802',
            'global',
            'usersTableMySQL',
            user_info['id'],
            base64.b64decode(user_info['account_based_in'])
        )

    else:
        decrypted_account_based_in = user_info['account_based_in']
        decrypted_date_of_birth = user_info['date_of_birth']

    return Response(
        {
            'username': user_info['username'],
            'full_name': user_info['full_name'],
            'date_of_birth': decrypted_date_of_birth,
            'created': user_info['created'],
            'is_verified': user_info['is_verified'],
            'account_based_in': decrypted_account_based_in,
            'is_private': user_info['is_private'],
            'contact_info': decrypted_contact_info
        }
    )

@api_view(['POST'])
def translate_texts_with_rapid_api(request):
    if (request.data.get('input_texts') and request.data.get('source_lang_shortened_code') and
    request.data.get('target_lang_shortened_code') and request.data.get('DEEP_TRANSLATE_API_KEY')):

        if os.environ.get('DEEP_TRANSLATE_API_KEY') != request.data['DEEP_TRANSLATE_API_KEY']:
            return Response(status=status.HTTP_403_FORBIDDEN)

        data = {
            'source': request.data['source_lang_shortened_code'],
            'target': request.data['target_lang_shortened_code']
        };
        headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
            'x-rapidapi-key': request.data['DEEP_TRANSLATE_API_KEY']
        }

        proper_hash_name = f"Translations from {language_code_to_long_form_mappings[data['source']]} to {language_code_to_long_form_mappings[data['target']]}"
        inverse_hash_name = f"Translations from {language_code_to_long_form_mappings[data['target']]} to {language_code_to_long_form_mappings[data['source']]}"
        output =  []
        for text in request.data['input_texts']:
            try: 
                data['q'] = text
                response = requests.post("https://deep-translate1.p.rapidapi.com/language/translate/v2", data=json.dumps(data),
                headers=headers)
                if response.ok:
                    translated_text = response.json()['data']['translations']['translatedText']
                    output.append(translated_text)
                    redis_client.hset(proper_hash_name, text, translated_text)
                    redis_client.hset(inverse_hash_name, translated_text, text)
                else:
                    output.append(text)

            except:
                output.append(text)
        
        return Response(output)

    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_redis_cached_language_translations(request, source_lang, target_lang):
    authorization = request.META.get('HTTP_AUTHORIZATION')
    if authorization is not None:
        authorization_parts = authorization.split(" ") # Split the authorization header (Bearer <api_token>)
        if len(authorization_parts) != 2:
            return Response(status=status.HTTP_403_FORBIDDEN)
        api_key_validation_result = validate_api_key('getRedisCachedLanguageTranslations', authorization_parts[1])
        if api_key_validation_result == 'Forbidden':
            return Response(status=status.HTTP_403_FORBIDDEN)

    if source_lang not in languages_available_for_translation or target_lang not in languages_available_for_translation:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    proper_hash_name = f"Translations from {source_lang} to {target_lang}"
    inverse_hash_name = f"Translations from {target_lang} to {source_lang}"

    if redis_client.exists(proper_hash_name):
        return Response(redis_client.hgetall(proper_hash_name)) 
    else:
        redis_client.hset(
            proper_hash_name,
            mapping={
                'placeholder%Key': 'placeholder%Value'
            },
        )
        redis_client.hset(
            inverse_hash_name,
            mapping={
                'placeholder%Key': 'placeholder%Value'
            },
        )
        return Response({})


def create_encryption_key(client, project_id, location_id, key_ring_id, key_id, rotation_period_days):
    key_ring_name = client.key_ring_path(project_id, location_id, key_ring_id)

    rotation_period = datetime.timedelta(days=rotation_period_days)

    now = datetime.datetime.utcnow()
    next_rotation = now + rotation_period

    next_rotation_timestamp = timestamp_pb2.Timestamp()
    next_rotation_timestamp.FromDatetime(next_rotation)

    rotation_period_duration = duration_pb2.Duration(seconds=int(rotation_period.total_seconds()))

    key = {
        "purpose": kms_v1.CryptoKey.CryptoKeyPurpose.ENCRYPT_DECRYPT,
        "next_rotation_time": next_rotation_timestamp,
        "rotation_period": rotation_period_duration,
    }

    created_key = client.create_crypto_key(
        parent=key_ring_name,
        crypto_key_id=key_id,
        crypto_key=key,
    )

    return created_key



def decrypt_data(client, project_id, location_id, key_ring_id, key_id, encrypted_data):
    key_name = client.crypto_key_path(project_id, location_id, key_ring_id, key_id)
    response = client.decrypt(name=key_name, ciphertext=encrypted_data)
    decrypted_data = response.plaintext.decode("utf-8")
    return decrypted_data


#No need to store versions in database!
def list_key_versions(client, project_id, location_id, key_ring_id, key_id):
    key_name = client.crypto_key_path(project_id, location_id, key_ring_id, key_id)

    versions = client.list_crypto_key_versions(parent=key_name)

    print("Key Versions:")
    for version in versions:
        print(f"Version ID: {version.name}, State: {version.state}, Creation Time: {version.create_time}")
    


def is_contact_info_taken(client, contact_info):
    info_for_each_user = redis_client.hgetall('Usernames and their Info')

    for username in info_for_each_user:
        user_info = json.loads(info_for_each_user[username])
        decrypted_contact_info = decrypt_data(
            client,
            'megagram-428802',
            'global',
            'usersTableMySQL',
            user_info['id'],
            base64.b64decode(user_info['contact_info'])
        )
        if contact_info==decrypted_contact_info:
            return True

    return False


def generate_token(byte_length):
    random_bytes = os.urandom(byte_length)
    return base64.b64encode(random_bytes).decode('utf-8')

def hash_salted_token(token, salt):
    hash_object = hashlib.sha256()
    hash_object.update((token+salt).encode('utf-8'))
    hashed_bytes = hash_object.digest()
    base64_string_output = base64.b64encode(hashed_bytes).decode('utf-8')
    return base64_string_output

def refresh_user_auth_token(user_id):
    new_auth_token = generate_token(100)
    new_auth_token_salt = generate_token(32)    

    refresh_user_auth_token_statement = """
    UPDATE userAuthTokens
    SET authTokenSalt = @newAuthTokenSalt,
        hashedAuthToken = @newHashedAuthToken,
        authTokenExpiry = @newAuthTokenExpiry
    WHERE userId = @userId
    """

    with gcloud_mysql_spanner_database.transaction() as transaction:
        transaction.execute_update(
            refresh_user_auth_token_statement,
            parameters={
                "newAuthTokenSalt": new_auth_token_salt,
                "newHashedAuthToken": hash_salted_token(new_auth_token, new_auth_token_salt),
                "newAuthTokenExpiry": datetime.datetime.utcnow() + datetime.timedelta(minutes=45),
                "userId": user_id
            }
        )

    return new_auth_token

def get_user_id_from_username(username):
    user_info = redis_client.hget('Usernames and their Info', username)
    if user_info is None:
        return -1
    user_info = json.loads(user_info)
    return user_info['id']

def generate_tokens_for_new_user(user_id):
    new_auth_token = generate_token(100)
    new_auth_token_salt = generate_token(32)
    new_hashed_auth_token = hash_salted_token(new_auth_token, new_auth_token_salt)
    new_auth_token_expiry = datetime.datetime.utcnow() + datetime.timedelta(minutes=45)
    
    new_refresh_token = generate_token(100)
    new_refresh_token_salt = generate_token(32)
    new_hashed_refresh_token = hash_salted_token(new_refresh_token, new_refresh_token_salt)
    new_refresh_token_expiry = datetime.datetime.utcnow() + datetime.timedelta(minutes=10080) #10,080 min = 1 week

    insert_new_user_auth_token_statement = """
        INSERT INTO userAuthTokens (
            userId, 
            hashedAuthToken, 
            authTokenSalt, 
            hashedRefreshToken, 
            refreshTokenSalt, 
            authTokenExpiry,
            refreshTokenExpiry
        ) VALUES (
            @newUserId, 
            @newHashedAuthToken, 
            @newAuthTokenSalt, 
            @newHashedRefreshToken, 
            @newRefreshTokenSalt, 
            @newAuthTokenExpiry,
            @newRefreshTokenExpiry
        )
    """



    with gcloud_mysql_spanner_database.transaction() as transaction:
        transaction.execute_update(
            insert_new_user_auth_token_statement,
            parameters={
                "newUserId": user_id,
                "newHashedAuthToken": new_hashed_auth_token,
                "newAuthTokenSalt": new_auth_token_salt,
                "newHashedRefreshToken": new_hashed_refresh_token,
                "newRefreshTokenSalt": new_refresh_token_salt,
                "newAuthTokenExpiry": new_auth_token_expiry,
                "newRefreshTokenExpiry": new_refresh_token_expiry,
            }
        )
    
    return [new_auth_token, new_refresh_token]


def validate_user_auth_token(id, request_cookies):
    user_auth_token_cookie = 'authToken'+id
    if user_auth_token_cookie in request_cookies:
        user_auth_token_cookie_val = request_cookies[user_auth_token_cookie]
        with gcloud_mysql_spanner_database.snapshot() as snapshot:            
            results = snapshot.execute_sql(
                "SELECT * FROM userAuthTokens WHERE userId = @id",
                params={"id": id},
                param_types={"id": spanner.param_types.INTEGER},
            )

            column_names_in_correct_order = ["userId", "hashedAuthToken", "authTokenSalt", "hashedRefreshToken",
            "refreshTokenSalt", "authTokenExpiry", "refreshTokenExpiry"]

            rows = []
            for row in results:
                rows.append(row)

            if len(rows) == 0:
                return 'Forbidden'

            correct_user_token = rows[0]
            correct_user_token = dict(zip(column_names_in_correct_order, correct_user_token))
            correct_user_token["authTokenExpiry"] = datetime2.fromisoformat(
            correct_user_token["authTokenExpiry"].isoformat())
            correct_user_token["refreshTokenExpiry"] = datetime2.fromisoformat(
            correct_user_token["refreshTokenExpiry"].isoformat())
        
            if correct_user_token['authTokenExpiry'] <= datetime.datetime.utcnow():
                if correct_user_token['refreshTokenExpiry'] > datetime.datetime.utcnow():
                    user_refresh_token_cookie = 'refreshToken'+id
                    if user_refresh_token_cookie in request_cookies:
                        user_refresh_token_cookie_val = request_cookies[user_refresh_token_cookie]
                        if correct_user_token['hashedRefreshToken'] == hash_salted_token(user_refresh_token_cookie_val,
                        correct_user_token['refreshTokenSalt']):
                            return 'Allowed, but Refresh Auth Token'
                        else:
                            return 'Forbidden'
                    else:
                        return 'Forbidden'
                else:
                    return 'Forbidden'
            
            if correct_user_token['hashedAuthToken'] != hash_salted_token(user_auth_token_cookie_val,
            correct_user_token['authTokenSalt']):
                return 'Forbidden'
            
        return 'Allowed'

    else:
        return 'Forbidden'

def validate_api_key(api_endpoint, provided_api_key):
    try:
        correct_api_key = APIKey.objects.get(purpose=api_endpoint)
    except APIKey.DoesNotExist:
        return 'Forbidden'
        
    if (correct_api_key.expiration <= datetime.datetime.utcnow() or
    correct_api_key.hashed_api_key != hash_salted_token(provided_api_key,
    correct_api_key.api_key_salt)):
        return 'Forbidden'
    
    return 'Allowed'

