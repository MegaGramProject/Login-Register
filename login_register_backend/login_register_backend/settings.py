from pathlib import Path
import os
import pymysql

pymysql.install_as_MySQLdb()


# BASE_DIR represents the file-path of the grandparent directory(login_register_backend) of this file.
BASE_DIR = Path(__file__).resolve().parent.parent


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('LOGIN_REGISTER_BACKEND_DJANGO_SECRET_KEY')


# DEBUG is a boolean which is True if Debug-mode is turned on, False otherwise. It is supposed to be False for production.
DEBUG = False

# ALLOWED_HOSTS is a list of strings representing the host/domain names that this Django site can serve.
# This is a security measure to prevent HTTP Host header attacks
ALLOWED_HOSTS = [
    os.environ.get('ALLOWED_HOST')
]


INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'my_app',
    'rest_framework',
    'corsheaders',
    'django_ratelimit',
]


MIDDLEWARE = [
    'django_ratelimit.middleware.RatelimitMiddleware',
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
        'USER': os.environ.get('LOCAL_MYSQL_USER'),
        'PASSWORD': os.environ.get('LOCAL_MYSQL_PASSWORD'),
        'HOST': os.environ.get('LOCAL_MYSQL_HOST_VIA_NGROK'),
        'POST': 3306
    }
}

CORS_ALLOWED_ORIGINS = [
    "http://34.111.89.101:80",
]


CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': f"redis://rishavry:{os.environ.get('AWS_REDIS_PASSWORD')}@redis-14251.c261.us-east-1-4.ec2.redns.redis-cloud.com:14251",
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}


RATELIMIT_USE_CACHE = 'default'


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

# Security settings for production
#SECURE_SSL_REDIRECT = True  # Redirect all HTTP requests to HTTPS
#SECURE_HSTS_SECONDS = 31536000  # Set HTTP Strict Transport Security (HSTS) header to 1 year
#SECURE_HSTS_PRELOAD = True  # Preload HSTS for browsers that support it