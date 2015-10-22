var express  = require('express');
var app      = express();
var http     = require('http').Server(app);
var io       = require('socket.io')(http);
var Firebase = require("firebase");

var port = process.env.PORT || 5000;
var ref = new Firebase('https://chatty-mcchatterson.firebaseio.com/');
var refs = {
  history: ref.child('history'),
  users: ref.child('users'),
  rooms: ref.child('rooms')
};

app.set('port', port);

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile('/index.html');
});

io.on('connection', function(socket) {
  var users = [io.sockets.connected].map(function(client) {
    return Object.keys(client);
  });

  refs.history.limitToLast(8).once('value', function(snapshot) {
    io.to(socket.id).emit('history retrieved', snapshot.val());
  });

  io.emit('user connect', {
    users: users,
    userId: socket.id
  });
  console.log('a user connected', socket.id);

  socket.on('message send', function(data) {
    console.log('message: ' + data.text);
    socket.broadcast.emit('message incoming', data);
    refs.history.push(data);
  });

  socket.on('disconnect', function() {
    console.log('a user disconnected', socket.id);
    socket.broadcast.emit('user disconnect', socket.id);
  });
});

http.listen(port, function() {
  console.log('listening on', port);
});
