var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile('/index.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');

  // everyone except certain socket
  // socket.broadcast.emit('hi');
  
  socket.on('chat message', function(message) {
    console.log('message: ' + message);
    io.emit('chat message', message);
  });

  socket.on('disconnect', function() {
    console.log('a user disconnected');
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});