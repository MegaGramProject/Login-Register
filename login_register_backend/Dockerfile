FROM python:3.11-slim

WORKDIR /app

COPY . /app/login_register_backend

RUN pip3 install --no-cache-dir -r /app/login_register_backend/requirements.txt

EXPOSE 8001

CMD ["sh", "-c", \
     "cd /app/login_register_backend && \
      gunicorn --workers 4 --bind 0.0.0.0:8001 login_register_backend.wsgi:application && \
      sleep infinity"]
