from django.shortcuts import render, HttpResponse

def login(request):
    language = request.GET.get('language', 'English')
    context = {
        'language': language
    }
    return render(request, "login.html", context)

def signUp(request):
    language = request.GET.get('language', 'English')
    context = {
        'language': language
    }
    return render(request, "register.html", context)


def ageCheck(request):
    email = request.GET.get('email', 'N/A')
    number = request.GET.get('number', 'N/A')
    context = {
        'email': email,
        'number': number
    }
    return render(request, "bday.html", context)

def emailCheck(request):
    email = request.GET.get('email', 'N/A')
    number = request.GET.get('number', 'N/A')
    context = {
        'email': email,
        'number': number
    }
    #add code for sending the confirmation-code
    return render(request, "emailCheck.html", context)