import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'login_register_backend.settings')

application = get_asgi_application()

# ASGI servers are primarily designed for asynchronous-code deployment