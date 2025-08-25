const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const morgan = require('morgan');

const PORT = process.env.SOCKET_PORT ? parseInt(process.env.SOCKET_PORT, 10) : 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET','POST'] }
});

io.on('connection', (socket) => {
  console.log('client connected', socket.id);
  socket.on('join', (room) => {
    socket.join(room);
  });
});

// Simple root and health endpoints so cPanel health checks succeed
app.get('/', (req, res) => {
  res.type('html');
  res.send('<!doctype html><html><head><title>Ethio Bingo Socket</title></head><body><h1>Socket server running</h1></body></html>');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// HTTP endpoint that PHP can call to broadcast to clients.
// It expects an Authorization: Bearer <token> where token is a JWT encoded with the same JWT_SECRET
app.post('/broadcast', (req, res) => {
  const auth = req.headers['authorization'] || '';
  const m = auth.match(/^Bearer\s+(.*)$/i);
  if (!m) return res.status(401).json({ error: 'missing_token' });
  const token = m[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // payload may include allowed rooms or claims
    const { room, event = 'broadcast', data } = req.body;
    if (room) {
      io.to(room).emit(event, data);
    } else {
      io.emit(event, data);
    }
    return res.json({ ok: true, payload });
  } catch (err) {
    return res.status(401).json({ error: 'invalid_token', details: err.message });
  }
});

server.listen(PORT, () => console.log(`Socket server listening on ${PORT}`));
