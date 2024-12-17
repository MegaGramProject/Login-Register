import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'login_register_frontend.settings')

application = get_wsgi_application()

# WSGI servers are primarily designed for handling traditional HTTP requests in a synchronous manner.
