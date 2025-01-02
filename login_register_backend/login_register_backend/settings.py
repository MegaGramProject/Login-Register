from pathlib import Path
import os


# BASE_DIR represents the file-path of the grandparent directory(login_register_backend) of this file.
BASE_DIR = Path(__file__).resolve().parent.parent


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('LOGIN_REGISTER_BACKEND_DJANGO_SECRET_KEY', 'dev-placeholder')


# DEBUG is a boolean which is True if Debug-mode is turned on, False otherwise. It is supposed to be False for production.
DEBUG = True


# ALLOWED_HOSTS is a list of strings representing the host/domain names that this Django site can serve.
# This is a security measure to prevent HTTP Host header attacks
ALLOWED_HOSTS = [
    os.environ.get('ALLOWED_HOST'),
    'localhost'
]


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
        'USER': os.environ.get('LOCAL_MYSQL_USER'),
        'PASSWORD': os.environ.get('LOCAL_MYSQL_PASSWORD'),
        'HOST': 'localhost',
        'POST': 3306
    },

    'local-psql': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'Megagram',
        'USER': os.environ.get('LOCAL_PSQL_USER'),
        'PASSWORD': os.environ.get('LOCAL_PSQL_PASSWORD'),
        'HOST': 'localhost',
        'PORT': 5432,
    },
    
    'google-cloud-mysql': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'Megagram',
        'USER': os.environ.get('GOOGLE_CLOUD_MYSQL_USER'),
        'PASSWORD': os.environ.get('GOOGLE_CLOUD_MYSQL_PASSWORD'),
        'HOST': os.environ.get('GOOGLE_CLOUD_MYSQL_HOST'),
        'PORT': 3306
    },
}

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

DATABASE_ROUTERS = ['my_app.database_router.DatabaseRouter']

# Security settings for production
SECURE_SSL_REDIRECT = False  # Redirect all HTTP requests to HTTPS
CSRF_COOKIE_SECURE = True  # Ensure the CSRF cookie is only sent over HTTPS
SESSION_COOKIE_SECURE = True  # Ensure the session cookie is only sent over HTTPS
SECURE_HSTS_SECONDS = 31536000  # Set HTTP Strict Transport Security (HSTS) header to 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True  # Apply HSTS to all subdomains
SECURE_HSTS_PRELOAD = True  # Preload HSTS for browsers that support it
SECURE_BROWSER_XSS_FILTER = True  # Enable the browser's XSS filter
X_FRAME_OPTIONS = 'DENY'  # Prevent clickjacking by denying the page to be framed
X_CONTENT_TYPE_OPTIONS = 'nosniff'  # Prevent browsers from interpreting files as a different MIME type