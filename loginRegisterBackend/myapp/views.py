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


@api_view(['POST'])
def createUser(request):
    #username, fullName, salt, hashedPassword, contactInfo, dateOfBirth
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
def updateUser(request, username):
    try:
        user = User.objects.get(username = username)
    except user.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






@api_view(['DELETE'])
def removeUser(request, username):
    try:
        user = User.objects.get(username = username)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    user.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)




@api_view(['POST'])
def sendEmail(request):
    email = request.data["email"]
    confirmationCode = random.randint(100000, 999999)
    message = MIMEMultipart("alternative")
    message["Subject"] = f"{confirmationCode} is your Megagram code"
    message["From"] = "megagram664@gmail.com"
    message["To"] = email
    text =f"""\
    Hi, Someone tried to sign up for a Megagram account with {email} If it was you, enter this confirmation code in the website:
    {confirmationCode}
    """
    html =f"""\
    <html>
    <body>
    <img src="https://static.vecteezy.com/system/resources/thumbnails/025/067/762/small_2x/4k-beautiful-colorful-abstract-wallpaper-photo.jpg" alt="Megagram" style="height:5%; width: 15%; object-fit: contain; margin-left:745px;">
    <div style="width: 560px; font-family:Arial; line-height:1.4; font-size:23px; margin-left: 630px;">
        <p>Hi,</p>
        <p></p>Someone tried to sign up for a Megagram account with {email} If it was you, enter this confirmation code in the website:</p>
        <p style="font-weight:bold; font-size: 30px; color:#4b4d4b; text-align: center;">{confirmationCode}</p>
    </div>
    <p style="color:gray; margin-top: 75px; text-align: center; width:777px; margin-left: 500px;">This email is for Megagram Account Registration. This message was sent to {email}.</p>
    </body>
    </html>
    """
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)


    context = ssl.create_default_context()

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login("megagram664@gmail.com", "daqr zlkq vvil exfi")
            server.sendmail("megagram664@gmail.com", email, message.as_string())
            return Response({"confirmationCode": confirmationCode}, status=status.HTTP_201_CREATED)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def sendText(request, number):
    confirmationCode = random.randint(100000, 999999)
    accountSid = os.environ['accountSid']
    authToken = os.environ['authToken']
    client = Client(accountSid, authToken)
    to = number
    messageBody = f"{confirmationCode}\n\nHi, Someone tried to sign up for a Megagram account with {to}. If it was you, enter the confirmation code mentioned at the start: {confirmationCode}"


    try:
        message = client.messages.create(
        body=messageBody,
        from_= os.environ['twilioPhoneNumber'],
        to=to)
        return Response({"confirmationCode": confirmationCode}, status=status.HTTP_201_CREATED)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def doesUserExist(request):
    if request.data.get('username'):
        try:
            user = User.objects.get(username = request.data['username'])
            return Response({"salt": user.salt, "hashedPassword":user.hashedPassword})
        except:
            return Response({"userExists": False})
    
    else:
        try:
            user = User.objects.get(contactInfo = request.data['contactInfo'])
            return Response({"salt": user.salt, "hashedPassword":user.hashedPassword})
        except:
            return Response({"userExists": False})
