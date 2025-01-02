from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, CsrfToken, UserAuthToken
from .serializers import UserSerializer, CsrfTokenSerializer, UserAuthTokenSerializer
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from twilio.rest import Client
import ssl
import random
import requests
import os
from google.cloud import kms_v1
from google.protobuf import duration_pb2, timestamp_pb2
import datetime
import base64
from django.core.management.utils import get_random_secret_key
import hashlib
import json

@api_view(['POST'])
def create_user(request):
    #require csrf token
    if(request.data.get('username')):
        csrf_token_cookie = 'createUser'+request.data['username']
        if csrf_token_cookie in request.COOKIES:
            csrf_token_cookie_val = request.COOKIES[csrf_token_cookie]
            try:
                correct_csrf_token = CsrfToken.objects.get(purpose=csrf_token_cookie)
                if correct_csrf_token.hashed_csrf_token != hash_salted_token(csrf_token_cookie_val,
                correct_csrf_token.csrf_token_salt):
                    return Response(status=status.HTTP_403_FORBIDDEN)
            except CsrfToken.DoesNotExist:
                return Response(status=status.HTTP_403_FORBIDDEN)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)
            

    if(request.data.get('username') and request.data.get('full_name') and request.data.get('salt') and
    request.data.get('hashed_password') and request.data.get('contact_info') and request.data.get('date_of_birth')):

        client = kms_v1.KeyManagementServiceClient()
        if contactInfoIsTaken(client, request.data['contact_info']):
            return Response({'message': 'Contact-Info taken by someone else'}, status=status.HTTP_409_CONFLICT)

        new_user_data = {
            'username': request.data['username'],
            'full_name': request.data['full_name'],
            'salt': request.data['salt'],
            'hashed_password': request.data['hashed_password'],
            'contact_info': 'TEMPORARY',
            'date_of_birth': 'TEMPORARY',
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
                #by default is_private is false
                new_user_data['date_of_birth'] = request.data['date_of_birth']
                if request.data.get('account_based_in'):
                    new_user_data['account_based_in'] = request.data['account_based_in']
            
            if request.data.get('is_verified'):
                new_user_data['is_verified'] = request.data['is_verified']
            
            user = User.objects.get(id = newly_saved_user_id)
            serializer2 = UserSerializer(user, data=new_user_data, partial=True)
            if serializer2.is_valid():
                serializer2.save()
                return Response(newly_saved_user_id)
            return Response(serializer2.errors, status=status.HTTP_400_BAD_REQUEST)
            
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
def update_user(request, username):
    #require user-authentication token
    refresh_auth_token = False
    user_auth_token_cookie = 'authToken'+username
    if user_auth_token_cookie in request.COOKIES:
        user_auth_token_cookie_val = request.COOKIES[user_auth_token_cookie]
        try:
            user_id = get_user_id_from_username(username)
            correct_user_token = UserAuthToken.objects.get(user_id=user_id)
        except UserAuthToken.DoesNotExist:
            return Response(status=status.HTTP_403_FORBIDDEN)

        if correct_user_token.hashed_auth_token != hash_salted_token(user_auth_token_cookie_val,
        correct_user_token.auth_token_salt):
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        if correct_user_token.auth_token_expiry <= datetime.datetime.utcnow():
            if correct_user_token.refresh_token_expiry > datetime.datetime.utcnow():
                user_refresh_token_cookie = 'refreshToken'+username
                if user_refresh_token_cookie in request.COOKIES:
                    user_refresh_token_cookie_val = request.COOKIES[user_refresh_token_cookie]
                    if correct_user_token.hashed_refresh_token == hash_salted_token(user_refresh_token_cookie_val,
                    correct_user_token.refresh_token_salt):
                        refresh_auth_token = True
                    else:
                        return Response(status=status.HTTP_403_FORBIDDEN)
                else:
                    return Response(status=status.HTTP_403_FORBIDDEN)
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)

    else:
        return Response(status=status.HTTP_403_FORBIDDEN)

    try:
        user = User.objects.get(username = username)
        client = kms_v1.KeyManagementServiceClient()
        encryption_key_name = client.crypto_key_path('megagram-428802', 'global', 'usersTableMySQL',  str(user.id))

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
        update_is_private = request.data['is_private']
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
            newly_saved_user = serializer.save()
            response = Response(newly_saved_user.id)
            if refresh_auth_token:
                 new_auth_token = refresh_user_auth_token(newly_saved_user.id)
                 response.set_cookie(
                    key='authToken'+username,
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
    try:
        user = User.objects.get(username = username)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    return Response(user.full_name)


@api_view(['GET'])
def is_account_private(request, username):
    try:
        user = User.objects.get(username = username)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    return Response(user.is_private)


@api_view(['DELETE'])
def remove_user(request, username):
    #require user-authentication token
    refresh_auth_token = False
    user_id = -1
    user_auth_token_cookie = 'authToken'+username
    if user_auth_token_cookie in request.COOKIES:
        user_auth_token_cookie_val = request.COOKIES[user_auth_token_cookie]
        try:
            user_id = get_user_id_from_username(username)
            correct_user_token = UserAuthToken.objects.get(user_id=user_id)
        except UserAuthToken.DoesNotExist:
            return Response(status=status.HTTP_403_FORBIDDEN)

        if correct_user_token.hashed_auth_token != hash_salted_token(user_auth_token_cookie_val,
        correct_user_token.auth_token_salt):
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        if correct_user_token.auth_token_expiry <= datetime.datetime.utcnow():
            if correct_user_token.refresh_token_expiry > datetime.datetime.utcnow():
                user_refresh_token_cookie = 'refreshToken'+username
                if user_refresh_token_cookie in request.COOKIES:
                    user_refresh_token_cookie_val = request.COOKIES[user_refresh_token_cookie]
                    if correct_user_token.hashed_refresh_token == hash_salted_token(user_refresh_token_cookie_val,
                    correct_user_token.refresh_token_salt):
                        refresh_auth_token = True
                    else:
                        return Response(status=status.HTTP_403_FORBIDDEN)
                else:
                    return Response(status=status.HTTP_403_FORBIDDEN)
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)

    else:
        return Response(status=status.HTTP_403_FORBIDDEN)

    try:
        user = User.objects.get(username = username)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    user.delete()
    response = Response(status=status.HTTP_204_NO_CONTENT)
    if refresh_auth_token:
        new_auth_token = refresh_user_auth_token(user_id)
        response.set_cookie(
            key='authToken'+username,
            value=new_auth_token,
            httponly=True,
            samesite='Strict',
            max_age=60*45 #45 min
        )
    return response


@api_view(['POST'])
def send_email(request):
    #require csrf token
    if(request.data.get('email')):
        csrf_token_cookie = 'sendEmail'+request.data['email']
        if csrf_token_cookie in request.COOKIES:
            csrf_token_cookie_val = request.COOKIES[csrf_token_cookie]
            try:
                correct_csrf_token = CsrfToken.objects.get(purpose=csrf_token_cookie)
                if correct_csrf_token.hashed_csrf_token != hash_salted_token(csrf_token_cookie_val, correct_csrf_token.csrf_token_salt):
                    return Response(status=status.HTTP_403_FORBIDDEN)
            except CsrfToken.DoesNotExist:
                return Response(status=status.HTTP_403_FORBIDDEN)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)

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
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def send_text(request, number):
    #require csrf token
    csrf_token_cookie = 'sendText'+number
    if csrf_token_cookie in request.COOKIES:
        csrf_token_cookie_val = request.COOKIES[csrf_token_cookie]
        try:
            correct_csrf_token = CsrfToken.objects.get(purpose=csrf_token_cookie)
            if correct_csrf_token.hashed_csrf_token != hash_salted_token(csrf_token_cookie_val,
            correct_csrf_token.csrf_token_salt):
                return Response(status=status.HTTP_403_FORBIDDEN)
        except CsrfToken.DoesNotExist:
            return Response(status=status.HTTP_403_FORBIDDEN)
    else:
        return Response(status=status.HTTP_403_FORBIDDEN)


    confirmation_code = random.randint(100000, 999999)
    account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
    auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
    client = Client(account_sid, auth_token)
    to = number
    messageBody = f'''{confirmation_code}\n\nHi, Someone tried to sign up for a Megagram account with {to}.
    If it was you, enter the 6-digit confirmation code mentioned at the start.'''
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
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def does_user_exist(request):
    if request.data.get('username'):
        #require csrf token
        csrf_token_cookie = 'doesUserExist'+request.data['username']
        if csrf_token_cookie in request.COOKIES:
            csrf_token_cookie_val = request.COOKIES[csrf_token_cookie]
            try:
                correct_csrf_token = CsrfToken.objects.get(purpose=csrf_token_cookie)
                if correct_csrf_token.hashed_csrf_token != hash_salted_token(csrf_token_cookie_val,
                correct_csrf_token.csrf_token_salt):
                    return Response(status=status.HTTP_403_FORBIDDEN)
            except CsrfToken.DoesNotExist:
                return Response(status=status.HTTP_403_FORBIDDEN)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)
            
        try:
            user = User.objects.get(username = request.data['username'])
            return Response(
                {
                    "salt": user.salt,
                    "hashed_password":user.hashed_password
                }
            )
        except:
            return Response(
                {
                    "user_exists": False
                }
            )

    elif request.data.get('contact_info'):
        #require csrf token
        csrf_token_cookie = 'doesUserExist'+request.data['contact_info']
        if csrf_token_cookie in request.COOKIES:
            csrf_token_cookie_val = request.COOKIES[csrf_token_cookie]
            try:
                correct_csrf_token = CsrfToken.objects.get(purpose=csrf_token_cookie)
                if correct_csrf_token.hashed_csrf_token != hash_salted_token(csrf_token_cookie_val,
                correct_csrf_token.csrf_token_salt):
                    return Response(status=status.HTTP_403_FORBIDDEN)
            except CsrfToken.DoesNotExist:
                return Response(status=status.HTTP_403_FORBIDDEN)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

        contact_info = request.data['contact_info']
        users = list(User.objects.values_list('id', 'contact_info'))
        client = kms_v1.KeyManagementServiceClient()

        for user in users:
            decrypted_contact_info = decrypt_data(
                client,
                'megagram-428802',
                'global',
                'usersTableMySQL',
                user[0],
                base64.b64decode(user[1])
            )
            if contact_info==decrypted_contact_info:
                user_object = User.objects.get(id = user[0])
                return Response(
                    {
                        "salt": user_object.salt,
                        "hashed_password":user_object.hashed_password,
                        "username":user_object.username
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
        return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)
    

@api_view(['GET'])
def get_usernames_and_full_names_of_all(request):
    users = User.objects.all()
    output = [[user.username, user.full_name] for user in users]
    return Response(output)
        

@api_view(['GET'])
def get_relevant_user_info_from_username(request, username):
    #require user-authentication token
    refresh_auth_token = False
    user_id = -1
    user_auth_token_cookie = 'authToken'+username
    if user_auth_token_cookie in request.COOKIES:
        user_auth_token_cookie_val = request.COOKIES[user_auth_token_cookie]
        try:
            user_id = get_user_id_from_username(username)
            correct_user_token = UserAuthToken.objects.get(user_id=user_id)
        except UserAuthToken.DoesNotExist:
            return Response(status=status.HTTP_403_FORBIDDEN)

        if correct_user_token.hashed_auth_token != hash_salted_token(user_auth_token_cookie_val,
        correct_user_token.auth_token_salt):
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        if correct_user_token.auth_token_expiry <= datetime.datetime.utcnow():
            if correct_user_token.refresh_token_expiry > datetime.datetime.utcnow():
                user_refresh_token_cookie = 'refreshToken'+username
                if user_refresh_token_cookie in request.COOKIES:
                    user_refresh_token_cookie_val = request.COOKIES[user_refresh_token_cookie]
                    if correct_user_token.hashed_refresh_token == hash_salted_token(user_refresh_token_cookie_val,
                    correct_user_token.refresh_token_salt):
                        refresh_auth_token = True
                    else:
                        return Response(status=status.HTTP_403_FORBIDDEN)
                else:
                    return Response(status=status.HTTP_403_FORBIDDEN)
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)

    else:
        return Response(status=status.HTTP_403_FORBIDDEN)

    try:
        user = User.objects.get(username = username)
    except User.DoesNotExist:
        return Response(
            {
                'output': 'user does not exist'
            },
            status=status.HTTP_404_NOT_FOUND
        )
    
    decrypted_date_of_birth = ""
    decrypted_account_based_in = ""

    if user.is_private:
        client = kms_v1.KeyManagementServiceClient()

        encrypted_date_of_birth = user.date_of_birth
        decrypted_date_of_birth = decrypt_data(
            client,
            'megagram-428802',
            'global',
            'usersTableMySQL',
            user.id,
            base64.b64decode(user.date_of_birth)
        )

        encrypted_account_based_in = user.account_based_in
        decrypted_account_based_in = decrypt_data(
            client,
            'megagram-428802',
            'global',
            'usersTableMySQL',
            user.id,
            base64.b64decode(user.account_based_in)
        )

    else:
        decrypted_date_of_birth = user.date_of_birth
        decrypted_account_based_in = user.account_based_in
    
    response = Response(
        {
            'username': user.username,
            'full_name': user.full_name,
            'date_of_birth': decrypted_date_of_birth,
            'created': user.created,
            'is_verified': user.is_verified,
            'account_based_in': decrypted_account_based_in,
            'is_private': user.is_private
        }
    )
    if refresh_auth_token:
        new_auth_token = refresh_user_auth_token(user_id)
        response.set_cookie(
            key='authToken'+username,
            value=new_auth_token,
            httponly=True,
            samesite='Strict',
            max_age=60*45 #45 min
        )

    return response

@api_view(['POST'])
def get_relevant_user_info_of_multiple_users(request):
    if(request.data.get('listOfUsers')):
        list_of_users = request.data['listOfUsers']
        user_info_mappings = {}
        for user in list_of_users:
            if(user not in user_info_mappings):
                user_object = User.objects.get(username = user)
                user_info_mappings[user] = {
                    'full_name': user_object.full_name,
                    'is_verified': user_object.is_verified,
                    'is_private': user_object.is_private
                }
        
        return Response(user_info_mappings)
    
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_relevant_user_info_from_username_including_contact_info(request, username):
    #require user-authentication token
    refresh_auth_token = False
    user_id = -1
    user_auth_token_cookie = 'authToken'+username
    if user_auth_token_cookie in request.COOKIES:
        user_auth_token_cookie_val = request.COOKIES[user_auth_token_cookie]
        try:
            user_id = get_user_id_from_username(username)
            correct_user_token = UserAuthToken.objects.get(user_id=user_id)
        except UserAuthToken.DoesNotExist:
            return Response(status=status.HTTP_403_FORBIDDEN)

        if correct_user_token.hashed_auth_token != hash_salted_token(user_auth_token_cookie_val,
        correct_user_token.auth_token_salt):
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        if correct_user_token.auth_token_expiry <= datetime.datetime.utcnow():
            if correct_user_token.refresh_token_expiry > datetime.datetime.utcnow():
                user_refresh_token_cookie = 'refreshToken'+username
                if user_refresh_token_cookie in request.COOKIES:
                    user_refresh_token_cookie_val = request.COOKIES[user_refresh_token_cookie]
                    if correct_user_token.hashed_refresh_token == hash_salted_token(user_refresh_token_cookie_val,
                    correct_user_token.refresh_token_salt):
                        refresh_auth_token = True
                    else:
                        return Response(status=status.HTTP_403_FORBIDDEN)
                else:
                    return Response(status=status.HTTP_403_FORBIDDEN)
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)

    else:
        return Response(status=status.HTTP_403_FORBIDDEN)

    try:
        user = User.objects.get(username = username)
    except User.DoesNotExist:
        return Response(
            {
                'output': 'user does not exist'
            },
            status=status.HTTP_404_NOT_FOUND
        )
    

    client = kms_v1.KeyManagementServiceClient()
 
    encrypted_contact_info = user.contact_info
    decrypted_contact_info = decrypt_data(
        client,
        'megagram-428802',
        'global',
        'usersTableMySQL',
        user.id,
        base64.b64decode(user.contact_info)
    )
    decrypted_account_based_in = ""
    decrypted_date_of_birth = ""

    if user.is_private:
        encrypted_date_of_birth = user.date_of_birth
        decrypted_date_of_birth = decrypt_data(
            client,
            'megagram-428802',
            'global',
            'usersTableMySQL',
            user.id,
            base64.b64decode(user.date_of_birth)
        )

        encrypted_account_based_in = user.account_based_in
        decrypted_account_based_in = decrypt_data(
            client,
            'megagram-428802',
            'global',
            'usersTableMySQL',
            user.id,
            base64.b64decode(user.account_based_in)
        )

    else:
        decrypted_account_based_in = user.account_based_in
        decrypted_date_of_birth = user.date_of_birth

    response = Response(
        {
            'username': user.username,
            'full_name': user.full_name,
            'date_of_birth': decrypted_date_of_birth,
            'created': user.created,
            'is_verified': user.is_verified,
            'account_based_in': decrypted_account_based_in,
            'is_private': user.is_private,
            'contact_info': decrypted_contact_info
        }
    )

    if refresh_auth_token:
        new_auth_token = refresh_user_auth_token(user_id)
        response.set_cookie(
            key='authToken'+username,
            value=new_auth_token,
            httponly=True,
            samesite='Strict',
            max_age=60*45 #45 min
        )
    return response

@api_view(['GET'])
def getCSRFToken(request, purpose):  
    csrf_token = get_random_secret_key()
    csrf_token_salt = generate_token(32)
    new_csrf_token = {
        'expiration_date': datetime.datetime.utcnow() + datetime.timedelta(seconds=60),
        'hashed_csrf_token': hash_salted_token(csrf_token, csrf_token_salt),
        'csrf_token_salt': csrf_token_salt,
        'purpose': purpose
    }

    serializer = CsrfTokenSerializer(data=new_csrf_token)
    if serializer.is_valid():
        serializer.save()

    response = Response()
    response.set_cookie(
        key=purpose,
        value=csrf_token,
        httponly=True,
        samesite='Strict',
        max_age=60
    )

    return response

@api_view(['POST'])
def translate_text_with_rapid_api(request):
    if (request.data.get('input_text') and request.data.get('source_lang_shortened_code') and
    request.data.get('target_lang_shortened_code') and request.data.get('DEEP_TRANSLATE_API_KEY')):
        data = {
            'q': request.data['input_text'],
            'source': request.data['source_lang_shortened_code'],
            'target': request.data['target_lang_shortened_code']
        };

        headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
            'x-rapidapi-key': request.data['DEEP_TRANSLATE_API_KEY']
        }

        try: 
            response = requests.post("https://deep-translate1.p.rapidapi.com/language/translate/v2", data=json.dumps(data),
            headers=headers)
            if response.ok:
                return Response(response.json()['data']['translations']['translatedText'])
            else:
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except:
            return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)

    return Response(status=status.HTTP_400_BAD_REQUEST)


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
    


def contactInfoIsTaken(client, contact_info):
    users = list(User.objects.values_list('id', 'contact_info'))

    for user in users:
        decrypted_contact_info = decrypt_data(
            client,
            'megagram-428802',
            'global',
            'usersTableMySQL',
            user[0],
            base64.b64decode(user[1])
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
    base64_encoded = base64.b64encode(hashed_bytes).decode('utf-8')
    return base64_encoded


def refresh_user_auth_token(user_id):
    new_auth_token = generate_token(100)
    new_auth_token_salt = generate_token(32)
    user_auth_token_to_refresh = UserAuthToken.objects.get(user_id = user_id)
    updated_user_auth_token = {
        'auth_token_salt': new_auth_token_salt,
        'hashed_auth_token': hash_salted_token(new_auth_token, new_auth_token_salt),
        'auth_token_expiry': datetime.datetime.utcnow() + datetime.timedelta(minutes=45),
    }

    serializer = UserAuthTokenSerializer(user_auth_token_to_refresh, data=updated_user_auth_token, partial=True)
    if serializer.is_valid():
        serializer.save()

    return new_auth_token


def get_user_id_from_username(username):
    user_id = User.objects.get(username=username).id
    return user_id


def get_username_from_user_id(user_id):
    username = User.objects.get(id=user_id).username
    return username

