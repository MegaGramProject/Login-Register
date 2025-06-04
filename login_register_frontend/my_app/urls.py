from . import views

from django.urls import path, re_path


urlpatterns = [
    path('login', views.login, name='Log In Page'),
    path('register', views.register, name='Register Page'),
    path('age-check', views.age_check, name='Age Check Page'),
    path('confirm-code', views.confirm_code, name='Confirm Code Page'),
    re_path(r'.*', views.not_found, name='Not Found Page')
]