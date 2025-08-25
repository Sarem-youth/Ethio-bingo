Production deployment guide — Ethio Bingo

This document contains step-by-step instructions to perform a production-ready build and deploy on a Linux VPS (recommended). A short cPanel section is included at the end.

Prerequisites (VPS)
- Ubuntu 20.04+ (or Debian). Root or sudo user.
- Your `.env` file placed in project root (/var/www/ethio-bingo or similar).
- MySQL database reachable (you provided piassabet.com). Ensure network access.

High-level steps
1. Upload project to server (git clone or SFTP) into /var/www/ethio-bingo
2. Create `.env` in project root with production values (DB_HOST, DB_NAME, DB_USER, DB_PASS, JWT_SECRET, ADMIN_USER, ADMIN_PASS, SOCKET_SERVER_URL)
3. Run the build script (below) to install PHP & Node deps, build frontend, and start Socket server under pm2
4. Configure Nginx to serve the app and proxy Socket.IO (example Nginx config included)
5. Import `sql.txt` into MySQL (one-time)

Quick commands (Ubuntu, run as sudo or root)
1) Upload files and `.env` then run:

    cd /var/www/ethio-bingo
    chmod +x scripts/build_all.sh
    sudo ./scripts/build_all.sh

2) Import DB (if not already):

    mysql -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME < sql.txt

3) Install and enable Nginx site using `deploy/nginx.conf` (place in /etc/nginx/sites-available/ethio-bingo and symlink to sites-enabled) then reload Nginx.

What `scripts/build_all.sh` does
- Installs required system packages (php-cli, php-fpm, php-mbstring, php-xml, php-curl, unzip, curl, nodejs, npm)
- Installs Composer if missing
- Runs `composer install --no-dev --optimize-autoloader`
- Runs `npm ci` and `npm run build` for the frontend
- Runs `npm ci` in `socket-server` and starts socket-server with pm2
- Sets file permissions for web user

Notes about cPanel
- If you use cPanel shared hosting, you may not be able to run Node or background processes. In that case:
  - Use a small VPS for the Socket.IO server (recommended). Keep PHP/API on cPanel.
  - Or use a hosted realtime provider (Pusher, Ably) and modify `SocketClient.php` to call that API instead.

Support
If you want, I will prepare an automated systemd unit and a Let's Encrypt nginx configuration next.
