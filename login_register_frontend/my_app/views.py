from django.shortcuts import render


def login(request):
    return render(request, 'Login.html')


def register(request):
    return render(request, 'Register.html')


def age_check(request):
    return render(request, 'AgeCheck.html')


def confirm_code(request):
    return render(request, 'ConfirmCode.html')
        

def not_found(request):
    return render(request, 'NotFound.html')