module.exports = {
  apps: [
    {
      name: 'ethio-bingo-socket',
      script: './socket-server/index.js',
      cwd: '/var/www/ethio-bingo',
      env: {
        SOCKET_PORT: process.env.SOCKET_PORT || 3000,
        JWT_SECRET: process.env.JWT_SECRET || 'replace-me'
      }
    }
  ]
};
