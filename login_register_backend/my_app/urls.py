from django.urls import path
from . import views

urlpatterns = [
    path("createUser", views.create_user, name="Create User"),
    path("updateUser/<str:username>", views.update_user, name="Update User"),
    path("removeUser/<str:username>", views.remove_user, name="Remove User"),
    path("sendEmail", views.send_email, name='Send Email'),
    path("sendText/<str:number>", views.send_text, name='Send Text'),
    path("doesUserExist", views.does_user_exist, name="Does User Exist?"),
    path("verifyCaptcha", views.verify_captcha, name="Verify Captcha"),
    path("getFullName/<str:username>", views.get_full_name, name="Get Full Name"),
    path("isAccountPrivate/<str:username>", views.is_account_private, name="Is Account Private?"),
    path("getUsernamesAndFullNamesOfAll", views.get_usernames_and_full_names_of_all, name="Get Usernames and Full-Names of All"),
    path("getRelevantUserInfoFromUsername/<str:username>", views.get_relevant_user_info_from_username, name="Get Relevant User-Info from Username"),
    path("getRelevantUserInfoOfMultipleUsers", views.get_relevant_user_info_of_multiple_users, name="Get Relevant User-Info Of Multiple Users"),
    path("getRelevantUserInfoFromUsernameIncludingContactInfo/<str:username>", views.get_relevant_user_info_from_username_including_contact_info, name="Get Relevant User-Info From Username(including Contact-Info)")
]