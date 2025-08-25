Game API (minimal)

Files:
- `api.php` - POST endpoints: `?action=start` (body: { stake_level_id }) and `?action=call` (body: { game_id })
- `test_notify.php` - CLI helper to start a game and call numbers (uses APP_BASE_URL env or http://localhost)

How to test:

1. Ensure `.env` on server has `SOCKET_SERVER_URL` set to your socket app (e.g. https://socket.piassabet.com)
2. Start a game:
   curl -X POST "https://your.domain/api.php?action=start" -H "Content-Type: application/json" -d '{"stake_level_id":1}'
3. Call a number:
   curl -X POST "https://your.domain/api.php?action=call" -H "Content-Type: application/json" -d '{"game_id":123}'

Quick local script (on server):
  php test_notify.php
