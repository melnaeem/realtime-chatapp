const PORT = process.env.PORT || 5000;
const socketPORT = process.env.socketPORT || 3000;

const io = require('socket.io')(socketPORT);

const server = require('./pages-server');

const users = {};

server.server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
  });

  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', {
      name: users[socket.id],
      message
    });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });
})
