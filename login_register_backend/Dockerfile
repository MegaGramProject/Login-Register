FROM python:3.11-slim

WORKDIR /app

COPY ./login_register_backend/ /app/login_register_backend/login_register_backend
COPY ./my_app/ /app/login_register_backend/my_app
COPY ./manage.py /app/login_register_backend
COPY ./requirements.txt /app

RUN pip3 install --no-cache-dir -r /app/requirements.txt

EXPOSE 8001

CMD ["sh", "-c", \
     "cd /app/login_register_backend && \
      gunicorn --workers 4 --bind 0.0.0.0:8001 login_register_backend.wsgi:application && \
      sleep infinity"]


