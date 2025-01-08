from django.shortcuts import render
import requests
import json
from django.http import HttpResponse
import os

def login(request):
    return render(request, "login.html", {
        'DEEP_TRANSLATE_API_KEY': os.environ.get('DEEP_TRANSLATE_API_KEY'),
        'GOOGLE_RECAPTCHA_SECRET': os.environ.get('GOOGLE_RECAPTCHA_SECRET'),
        'DOES_USERNAME_EXIST_API_KEY': os.environ.get('DOES_USERNAME_EXIST_API_KEY'),
        'DOES_USER_CONTACT_INFO_EXIST_API_KEY': os.environ.get('DOES_USER_CONTACT_INFO_EXIST_API_KEY'),
        'GET_REDIS_CACHED_LANGUAGE_TRANSLATIONS_API_KEY': os.environ.get('GET_REDIS_CACHED_LANGUAGE_TRANSLATIONS_API_KEY')
    })


def sign_up(request):
    return render(request, "register.html", {
        'DEEP_TRANSLATE_API_KEY': os.environ.get('DEEP_TRANSLATE_API_KEY'),
        'DOES_USERNAME_EXIST_API_KEY': os.environ.get('DOES_USERNAME_EXIST_API_KEY'),
        'DOES_USER_CONTACT_INFO_EXIST_API_KEY': os.environ.get('DOES_USER_CONTACT_INFO_EXIST_API_KEY')
    })


def age_check(request):
    return render(request, "bday.html", {
        'DEEP_TRANSLATE_API_KEY': os.environ.get('DEEP_TRANSLATE_API_KEY'),
    })


def confirm_code(request):
    context = {
        'DEEP_TRANSLATE_API_KEY': os.environ.get('DEEP_TRANSLATE_API_KEY'),
        'EMAIL_CONFIRMATION_CODE_API_KEY': os.environ.get('EMAIL_CONFIRMATION_CODE_API_KEY'),
        'TEXT_CONFIRMATION_CODE_API_KEY': os.environ.get('TEXT_CONFIRMATION_CODE_API_KEY'),
        'CREATE_USER_API_KEY': os.environ.get('CREATE_USER_API_KEY')
    }
    context['EMAIL'] = request.GET.get('email', 'N/A')
    context['NUMBER'] = request.GET.get('number', 'N/A')
    
    if context['EMAIL'] != 'N/A':
        api_url = "http://34.111.89.101/loginregister/api/sendConfirmationCodeEmail"
        data = {'email': context['EMAIL']}
        headers = {'Content-Type': 'application/json',
        'Authorization': f'Bearer {os.environ.get('EMAIL_CONFIRMATION_CODE_API_KEY')}'}
        response = requests.post(api_url, headers=headers, data=json.dumps(data))
        if response.status_code == 201:
            CORRECT_CODE_VALUE = response.json().get('confirmation_code')
            context['CORRECT_CODE_VALUE'] = CORRECT_CODE_VALUE
            return render(request, "confirmCode.html", context)
        else:
            return HttpResponse("confirmation-code failed")
    
    elif context['NUMBER'] != 'N/A':
        api_url = f"http://34.111.89.101/loginregister/api/sendConfirmationCodeText/{context['NUMBER']}"
        headers = {'Content-Type': 'application/json',
        'Authorization': f'Bearer {os.environ.get('TEXT_CONFIRMATION_CODE_API_KEY')}'}
        response = requests.post(api_url, headers=headers)
        if response.status_code == 201:
            CORRECT_CODE_VALUE = response.json().get('confirmation_code')
            context['CORRECT_CODE_VALUE'] = CORRECT_CODE_VALUE
            return render(request, "confirmCode.html", context)
        else:
            return HttpResponse("confirmation-code failed")
    
    else:
        return render(request, "notFound.html")
        

def not_found(request):
    return render(request, "notFound.html")