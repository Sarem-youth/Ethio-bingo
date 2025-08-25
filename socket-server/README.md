Socket.IO server for Ethio Bingo

What this does
- Runs a Socket.IO server that accepts client connections.
- Exposes an HTTP POST /broadcast endpoint secured by a JWT shared secret so your PHP backend can trigger real-time events.

Quick start
1. Install dependencies: npm install
2. Run: SOCKET_PORT=3000 JWT_SECRET=your_jwt_secret node index.js

From PHP, call /broadcast:
- Create a JWT signed with the same JWT_SECRET. Payload can include identifying claims.
- POST JSON: { "room": "game-123", "event": "number", "data": { "num": 5 } }
- Set header Authorization: Bearer <token>

This gives you an easy path to use Socket.IO without running Ratchet on cPanel. Run this on a small VPS or provided hosting that supports Node.js.
