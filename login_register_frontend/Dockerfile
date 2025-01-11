FROM python:3.11-slim

WORKDIR /app

COPY ./login_register_frontend/ /app/login_register_frontend/login_register_frontend
COPY ./my_app/ /app/login_register_frontend/my_app
COPY ./manage.py /app/login_register_frontend
COPY ./requirements.txt /app

RUN pip3 install --no-cache-dir -r /app/requirements.txt

EXPOSE 8000

CMD ["sh", "-c", \
     "cd /app/login_register_frontend && \
     gunicorn --workers 4 --bind 0.0.0.0:8000 login_register_frontend.wsgi:application && \
     sleep infinity"]

