const express = require('express');
const next = require('next');
const { Server } = require('socket.io');
const client = require('socket.io-client');
const data = require('./src/pages/data.json');

const port = process.env.POER || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const httpServer = server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });

  const serverIo = new Server(httpServer);
  serverIo.on('connect', (socket) => {
    console.log('connect');
    socket.on('send-data', (d) => {
      console.log('send-data', d);
      const filterData = data.filter(
        (dd) => dd.category == d.category && dd.type == d.type
      );
      serverIo.emit('update-data', filterData);
    });
  });

  const clientIo = client.connect('http://localhost:4000');
  clientIo.on('connect', (socket) => {
    console.log('connect-client');
    clientIo.on('message', (data) => {
      console.log('message');
      clientIo.emit('update-data', data);
    });

    clientIo.on('exit', (msg) => {
      clientIo.disconnect();
    });
  });
});
