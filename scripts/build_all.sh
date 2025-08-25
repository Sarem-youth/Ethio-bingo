#!/usr/bin/env bash
set -euo pipefail

# This script automates a production build on Ubuntu/Debian.
# Run as root or with sudo from project root (/var/www/ethio-bingo).

PROJECT_DIR=$(pwd)
WEB_USER=www-data

apt-get update
apt-get install -y curl git unzip nginx build-essential ca-certificates

# PHP and required extensions
apt-get install -y php php-cli php-fpm php-mbstring php-xml php-curl php-json php-zip php-mysql

# Node.js (use NodeSource) and npm
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  apt-get install -y nodejs
fi

# Composer
if ! command -v composer >/dev/null 2>&1; then
  EXPECTED_SIGNATURE="$(curl -s https://composer.github.io/installer.sig)"
  php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
  php -r "if (hash_file('sha384', 'composer-setup.php') === '$EXPECTED_SIGNATURE') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); exit(1); }"
  php composer-setup.php --install-dir=/usr/local/bin --filename=composer
  php -r "unlink('composer-setup.php');"
fi

cd "$PROJECT_DIR"

echo "Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

echo "Building frontend..."
npm ci
npm run build

# Move built frontend into public/ (Vite outputs to dist/)
if [ -d "$PROJECT_DIR/dist" ]; then
  echo "Publishing frontend to public/"
  rm -rf "$PROJECT_DIR/public"/* || true
  mkdir -p "$PROJECT_DIR/public"
  cp -r "$PROJECT_DIR/dist/." "$PROJECT_DIR/public/"
fi

echo "Setting permissions..."
chown -R $WEB_USER:$WEB_USER "$PROJECT_DIR"
find "$PROJECT_DIR" -type d -exec chmod 755 {} \;
find "$PROJECT_DIR" -type f -exec chmod 644 {} \;

echo "Installing and starting socket server with pm2..."
npm --prefix socket-server ci
# ensure pm2 is available
npm install -g pm2 || true
pm2 stop ethio-bingo-socket || true
pm2 start deploy/pm2.ecosystem.config.js --only ethio-bingo-socket
pm2 save

echo "Reload nginx"
systemctl reload nginx || true

echo "Build complete."
