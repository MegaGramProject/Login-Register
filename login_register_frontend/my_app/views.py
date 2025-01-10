from django.shortcuts import render
import requests
import json
from django.http import HttpResponse
import os

def login(request):
    return render(request, "login.html")


def sign_up(request):
    return render(request, "register.html")


def age_check(request):
    return render(request, "bday.html")


def confirm_code(request):
    context = {}
    context['EMAIL'] = request.GET.get('email', 'N/A')
    context['NUMBER'] = request.GET.get('number', 'N/A')
    
    if context['EMAIL'] != 'N/A':
        api_url = "http://34.111.89.101/loginregister/api/sendConfirmationCodeEmail"
        data = {'email': context['EMAIL']}
        headers = {'Content-Type': 'application/json'}
        response = requests.post(api_url, headers=headers, data=json.dumps(data))
        if response.status_code == 201:
            CORRECT_CODE_VALUE = response.json().get('confirmation_code')
            context['CORRECT_CODE_VALUE'] = CORRECT_CODE_VALUE
            return render(request, "confirmCode.html", context)
        else:
            return HttpResponse("The server failed to email you the confirmation-code.")
    
    elif context['NUMBER'] != 'N/A':
        api_url = f"http://34.111.89.101/loginregister/api/sendConfirmationCodeText/{context['NUMBER']}"
        headers = {'Content-Type': 'application/json'}
        response = requests.post(api_url, headers=headers)
        if response.status_code == 201:
            CORRECT_CODE_VALUE = response.json().get('confirmation_code')
            context['CORRECT_CODE_VALUE'] = CORRECT_CODE_VALUE
            return render(request, "confirmCode.html", context)
        else:
            return HttpResponse("The server failed to text you the confirmation-code.")
    
    else:
        return render(request, "notFound.html")
        

def not_found(request):
    return render(request, "notFound.html")