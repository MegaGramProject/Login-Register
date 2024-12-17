from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
import json
from django.http import HttpResponse


def login(request):
    return render(request, "login.html")


def sign_up(request):
    return render(request, "register.html")


def age_check(request):
    return render(request, "bday.html")


def confirm_code(request):
    context = {}
    context['email'] = request.GET.get('email', 'N/A')
    context['number'] = request.GET.get('number', 'N/A')
    if context['email'] != 'N/A':
        api_url = "http://localhost:8001/sendEmail/"
        data = {'email': context['email']}
        headers = {'Content-Type': 'application/json'}
        response = requests.post(api_url, headers=headers, data=json.dumps(data))
        if response.status_code == 201:
            confirmation_code = response.json().get('confirmationCode')
            context['confirmation_code'] = confirmation_code
            return render(request, "confirmCode.html", context)
        else:
            return HttpResponse("confirmation-code failed")
    
    else:
        api_url = f"http://localhost:8001/sendText/{context['number']}"
        headers = {'Accept': 'application/json'}
        response = requests.get(api_url, headers=headers)
        if response.status_code == 201:
            confirmation_code = response.json().get('confirmation_code')
            context['confirmation_code'] = confirmation_code
            return render(request, "confirmCode.html", context)
        else:
            return HttpResponse("confirmation-code failed")
