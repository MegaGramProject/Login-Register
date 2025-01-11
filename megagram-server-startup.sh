#!/bin/bash

#This start-up script is for the Megagram-servers in the Managed-Instance-Group named 'megagram-server-group'

sudo apt-get update -y
sudo apt-get install -y nginx git

sudo git clone https://github.com/MegaGramProject/NotFound.git
sudo mkdir -p /var/www/html
sudo mv NotFound/ /var/www/html/

sudo systemctl start nginx
sudo systemctl enable nginx

echo "
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    root /var/www/html;

    # Health check endpoint for the load balancer
    location /health {
        return 200 'OK';
        add_header Content-Type text/plain;
    }

    location /loginregister-static/ {
        proxy_pass http://34.172.22.111:8000/loginregister-static/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /loginregister/ {
        proxy_pass http://34.172.22.111:8000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /loginregister/api/ {
        proxy_pass http://35.225.117.2:8001/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

     location / {
        error_page 404 /NotFound/notFound.html;
     }

}
" | sudo tee /etc/nginx/sites-available/default > /dev/null

sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

sudo systemctl restart nginx