const PORT = process.env.PORT || 5000;
const server = require('./pages-server').server;

const users = {};

const io = require('socket.io')(server);
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

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
