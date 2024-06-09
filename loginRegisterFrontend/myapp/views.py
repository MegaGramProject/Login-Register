from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
import json
from django.http import HttpResponse




def login(request):
    return render(request, "login.html")

def signUp(request):
    return render(request, "register.html")

@api_view(['POST'])
def ageCheck(request):
    return render(request, "bday.html", request.data)

@api_view(['POST'])
def confirmCode(request):
    context = request.data
    context['email'] = request.GET.get('email', 'N/A')
    context['number'] = request.GET.get('number', 'N/A')
    if context['email'] != 'N/A':
        apiUrl = "http://localhost:8001/sendEmail/"
        data = {'email': context['email']}
        headers = {'Content-Type': 'application/json'}
        response = requests.post(apiUrl, headers=headers, data=json.dumps(data))
        if response.status_code == 200:
            confirmationCode = response.json().get('confirmationCode')
            context['confirmationCode'] = confirmationCode
            return render(request, "confirmCode.html", context)
        else:
            print(f"Failed to send email. Status code: {response.status_code}")
            return HttpResponse("confirmation-code failed")
    
    else:
        apiUrl = f"http://localhost:8001/sendText/{context['number']}"
        headers = {'Accept': 'application/json'}
        response = requests.get(apiUrl, headers=headers)
        if response.status_code == 200:
            confirmationCode = response.json().get('confirmationCode')
            context['confirmationCode'] = confirmationCode
            return render(request, "confirmCode.html", context)
        else:
            print(f"Failed to send email. Status code: {response.status_code}")
            return HttpResponse("confirmation-code failed")
