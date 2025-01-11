from pathlib import Path
import os
from dotenv import load_dotenv
from decouple import config

load_dotenv()

# BASE_DIR represents the file-path of the grandparent directory(login_register_backend) of this file.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('LOGIN_REGISTER_FRONTEND_DJANGO_SECRET_KEY')

# SECURITY WARNING: Don't run with debug turned on in production!
DEBUG = False

# ALLOWED_HOSTS is a list of strings representing the host/domain names that this Django site can serve.
# This is a security measure to prevent HTTP Host header attacks
ALLOWED_HOSTS = [
    config('ALLOWED_HOST'),
]


INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'my_app',
]

MIDDLEWARE = [
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'login_register_frontend.urls'

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

WSGI_APPLICATION = 'login_register_frontend.wsgi.application'


STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",  # Compress static-file sizes for efficiency
    },
}

# Absolute path to the directory where collectstatic will collect static files for deployment.
STATIC_ROOT = os.path.join(BASE_DIR, 'my_app', 'static')

# URL to use when referring to static files (where they will be served from)
STATIC_URL = '/loginregister-static/'

# Security settings for production
#SECURE_SSL_REDIRECT = True  # Redirect all HTTP requests to HTTPS
#SECURE_HSTS_SECONDS = 31536000  # Set HTTP Strict Transport Security (HSTS) header to 1 year
#SECURE_HSTS_PRELOAD = True  # Preload HSTS for browsers that support it