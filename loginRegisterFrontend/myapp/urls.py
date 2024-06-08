from django.urls import path
from . import views

urlpatterns = [
    path("login", views.login, name="Log In"),
    path("signUp", views.signUp, name="Sign Up"),
    path("ageCheck", views.ageCheck, name="Age Check"),
    path("emailCheck", views.emailCheck, name='Email Check')
]