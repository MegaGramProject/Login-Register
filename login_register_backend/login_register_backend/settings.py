from pathlib import Path
import os
from decouple import config


# BASE_DIR represents the file-path of the grandparent directory(login_register_backend) of this file.
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('DJANGO_SECRET_KEY')


# DEBUG is a boolean which is True if Debug-mode is turned on, False otherwise. It is recommended for it to be False for production.
DEBUG = True


# ALLOWED_HOSTS is a list of strings representing the host/domain names that this Django site can serve.
# This is a security measure to prevent HTTP Host header attacks
ALLOWED_HOSTS = []


INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'my_app',
    'rest_framework',
    'corsheaders',
]


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'login_register_backend.urls'


# In production, you need a WSGI-compatible server(e.g Gunicorn, uWSGI, etc) to serve a Python Django/Flask/etc project.
# When running a production server, you need to explicitly point to the WSGI callable in your wsgi.py file
WSGI_APPLICATION = 'login_register_backend.wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'Megagram',
        'USER': os.environ.get('LOCAL_MYSQL_USERNAME'),
        'PASSWORD': os.environ.get('LOCAL_MYSQL_PASSWORD'),
        'HOST': 'localhost',
        'PORT': '3306',
    }
}


# All models created with Django without an explicitly defined primary key will use a BigAutoField as the default primary key.
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://localhost:3001",
    "http://localhost:8011",
    "http://localhost:8019"
]


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]