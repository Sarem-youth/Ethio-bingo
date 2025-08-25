
# Ethio Bingo Backend Setup

This document provides instructions on how to set up and run the PHP backend, WebSocket server, and Admin Panel for the Ethio Bingo application.

## 1. Server Requirements

- PHP >= 8.1
- MySQL / MariaDB Database
- Composer (for PHP dependency management)
- A web server (Apache or Nginx)
- Shell access (for running the WebSocket server)

## 2. Initial Setup

### Step 1: Clone & Install Dependencies

Place all the provided files onto your server. Then, navigate to the project's root directory in your terminal and install the required PHP libraries using Composer.

```bash
composer install
```

This will install `ratchet`, `php-jwt`, and `phpdotenv`.

### Step 2: Configure Web Server

Configure your web server (Apache/Nginx) to point the document root to the `/public` directory. This is crucial for security, as it prevents direct web access to your application's source code, configuration files, and scripts.

**Example Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/your/project/public;

    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location /api {
        try_files $uri /api/index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock; # Adjust to your PHP-FPM version
    }

    location ~ /\.ht {
        deny all;
    }
}
```

### Step 3: Setup the Database

1.  Connect to your MySQL/MariaDB server.
2.  Create the database using the credentials you have:
    ```sql
    CREATE DATABASE piassanw_etbingo;
    ```
3.  Copy the entire content of `sql.txt` and execute it. This will create all the necessary tables and populate the `bingo_cards` table with 250 unique cards.

### Step 4: Create Environment File

In the root directory of the project, create a file named `.env`. This file will store your sensitive credentials. **Do not commit this file to version control.**

Fill it with your actual data:

```ini
# Database Credentials
DB_HOST="piassabet.com"
DB_NAME="piassanw_etbingo"
DB_USER="piassanw_Sarem"
DB_PASS="@Machete1231"

# JWT Secret Key (generate a long, random string)
JWT_SECRET="YOUR_SUPER_SECRET_RANDOM_KEY_GOES_HERE"
JWT_ISSUER="http://yourdomain.com"
JWT_AUDIENCE="http://yourdomain.com"

# Admin Panel Credentials
ADMIN_USER="your_admin_username"
ADMIN_PASS="your_strong_admin_password"
```

## 3. Running the Application

### API Server

The API server will run automatically through your web server (Apache/Nginx). All API requests are routed through `/public/api/index.php`.

### WebSocket Server

The WebSocket server must be run as a persistent, background process. Open your server's terminal, navigate to the project root, and run the following command:

```bash
php websocket/server.php
```

This will start the server, typically on port 8080. For a production environment, you should use a process manager like `supervisor` or `systemd` to ensure the WebSocket server runs continuously and restarts automatically if it crashes.

**Example Supervisor Configuration (`/etc/supervisor/conf.d/bingo-websocket.conf`):**
```ini
[program:bingo-websocket]
process_name=%(program_name)s
command=php /path/to/your/project/websocket/server.php
autostart=true
autorestart=true
user=www-data ; The user your web server runs as
numprocs=1
redirect_stderr=true
stdout_logfile=/var/log/supervisor/bingo-websocket.log
```
After creating the config, update supervisor:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start bingo-websocket
```

## 4. Accessing the Admin Panel

Navigate to `http://yourdomain.com/admin/`. You will be prompted to log in using the `ADMIN_USER` and `ADMIN_PASS` you defined in your `.env` file.
