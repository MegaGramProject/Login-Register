from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from django.http import HttpResponse
from .serializers import UserSerializer


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


@api_view(['GET'])
def sendEmail(request, email):
    #add code to send email
    return HttpResponse("send email")

@api_view(['GET'])
def sendText(request, number):
    #add code to send text
    return HttpResponse("send text")
