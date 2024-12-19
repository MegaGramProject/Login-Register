from django.urls import path, re_path
from . import views

urlpatterns = [
    path("login", views.login, name="Log In"),
    path("signup", views.sign_up, name="Sign Up"),
    path("ageCheck", views.age_check, name="Age Check"),
    path("confirmCode", views.confirm_code, name='Confirm Code'),
    path("anythingExceptTheAbove", views.not_found, name="Not Found"),
    re_path(r".*", views.not_found, name="Not Found")
]