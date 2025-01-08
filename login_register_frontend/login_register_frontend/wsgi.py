import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'login_register_frontend.settings')

application = get_wsgi_application()

# WSGI servers are primarily designed for synchronous-code deployment