from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from twilio.rest import Client
import ssl
import random
import os
import requests


@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
def update_user(request, username):
    try:
        user = User.objects.get(username = username)
    except user.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_full_name(request, username):
    try:
        user = User.objects.get(username = username)
    except user.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    return Response(user.full_name)


@api_view(['GET'])
def is_account_private(request, username):
    try:
        user = User.objects.get(username = username)
    except user.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    return Response(user.is_private)


@api_view(['DELETE'])
def remove_user(request, username):
    try:
        user = User.objects.get(username = username)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    user.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def send_email(request):
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
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: start; gap: 1em;">
                <img src="https://static.vecteezy.com/system/resources/thumbnails/025/067/762/small_2x/4k-beautiful-colorful-abstract-wallpaper-photo.jpg" alt="Megagram"
                style="height:13em; width: 40em;">

                <br/>
                
                <div style="display: flex; flex-direction: column; font-family: Arial; width: 42em;">
                    <h2>Hi,</h2>
                    <p style="font-size: 1.1em;">Someone tried to sign up for a Megagram account with {email}. If it was you, enter this confirmation code in the website:</p>
                    <p style="font-weight:bold; font-size: 1.7em; color:#4b4d4b; text-align: center;">{confirmation_code}</p>
                    <small style="color:gray; margin-top: 3em;">This email is for Megagram Account Registration. This message was sent to {email}.</small>
                </div>
            </div>
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
            server.login("megagram664@gmail.com", "daqr zlkq vvil exfi")
            server.sendmail("megagram664@gmail.com", email, message.as_string())
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
    confirmation_code = random.randint(100000, 999999)
    account_sid = os.environ['account_sid']
    auth_token = os.environ['authToken']
    client = Client(account_sid, auth_token)
    to = number
    messageBody = f"{confirmation_code}\n\nHi, Someone tried to sign up for a Megagram account with {to}. If it was you, enter the 6-digit confirmation code mentioned at the start."

    try:
        client.messages.create(
            body=messageBody,
            from_= os.environ['twilioPhoneNumber'],
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

    else:
        try:
            user = User.objects.get(contact_info = request.data['contact_info'])
            return Response(
                {
                    "salt": user.salt,
                    "hashed_password":user.hashed_password,
                    "username":user.username
                }
            )
        except:
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
                "error": "Failed to verify reCAPTCHA"
            }
        )
    

@api_view(['GET'])
def get_usernames_and_full_names_of_all(request):
    users = User.objects.all()
    output = [[user.username, user.full_name] for user in users]
    return Response(output)
        

@api_view(['GET'])
def get_relevant_user_info_from_username(request, username):
    try:
        user = User.objects.get(username = username)
    except user.DoesNotExist:
        return Response(
            {
                'output': 'user does not exist'
            },
            status=status.HTTP_404_NOT_FOUND
        )
    
    return Response(
        {
            'username': user.username,
            'full_name': user.full_name,
            'date_of_birth': user.date_of_birth,
            'created': user.created,
            'is_verified': user.is_verified,
            'account_based_in': user.account_based_in,
            'is_private': user.is_private
        }
    )


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
    try:
        user = User.objects.get(username = username)
    except user.DoesNotExist:
        return Response(
            {
                'output': 'user does not exist'
            },
            status=status.HTTP_404_NOT_FOUND
        )
    
    return Response(
        {
            'username': user.username,
            'full_name': user.full_name,
            'date_of_birth': user.date_of_birth,
            'created': user.created,
            'is_verified': user.is_verified,
            'account_based_in': user.account_based_in,
            'is_private': user.is_private,
            'contact_info': user.contact_info
        }
    )