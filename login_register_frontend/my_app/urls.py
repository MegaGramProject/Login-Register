from django.urls import path
from . import views

urlpatterns = [
    path("login", views.login, name="Log In"),
    path("signUp", views.sign_up, name="Sign Up"),
    path("ageCheck", views.age_check, name="Age Check"),
    path("confirmCode", views.confirm_code, name='Confirm Code')
]