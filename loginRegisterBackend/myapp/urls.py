from django.urls import path
from . import views

urlpatterns = [
    path("createUser/", views.createUser, name="Create User"),
    path("updateUser/<str:username>", views.updateUser, name="Update User"),
    path("removeUser/<str:username>", views.removeUser, name="Remove User"),
    path("sendEmail/", views.sendEmail, name='Send Email'),
    path("sendText/<str:number>", views.sendText, name='Send Text'),
    path("doesUserExist/", views.doesUserExist, name="Does User Exist")
    
]