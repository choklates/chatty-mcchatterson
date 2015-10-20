var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var port    = process.env.PORT || 5000;

app.set('port', port);

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile('/index.html');
});

io.on('connection', function(socket) {
  var users = [io.sockets.connected].map(function(client) {
    return Object.keys(client);
  });

  io.emit('user connect', {
    users: users,
    userId: socket.id
  });
  console.log('a user connected', socket.id);

  // everyone except certain socket
  // socket.broadcast.emit('hi');
  
  socket.on('chat message', function(message) {
    console.log('message: ' + message);
    io.emit('chat message', message);
  });

  socket.on('disconnect', function() {
    console.log('a user disconnected', socket.id);
    io.emit('user disconnect', socket.id);
  });
});

http.listen(port, function() {
  console.log('listening on', port);
});
