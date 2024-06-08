from django.shortcuts import render

def login(request):
    return render(request, "login.html")

def signUp(request):
    return render(request, "register.html")


def ageCheck(request):
    return render(request, "bday.html")

def confirmCode(request):
    email = request.GET.get('email', 'N/A')
    number = request.GET.get('number', 'N/A')
    context = {
        'email': email,
        'number': number
    }
    '''
    Code for sending confirmation code
    
    '''
    return render(request, "confirmCode.html", context)