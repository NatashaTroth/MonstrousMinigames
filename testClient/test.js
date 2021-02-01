
const io = require('socket.io-client');


  const socket = io("ws://localhost:5000", {
    secure: true, reconnection: true, rejectUnauthorized: false,
    reconnectionDelayMax: 10000,
    query: {
      auth: "123"
    }
  })
  socket.emit('position', 5)
