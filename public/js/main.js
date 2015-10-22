'use strict';

(function() {
  var socket, users, myId,
    $userList, $messageList, $messageForm, $messageInput;

  socket = io();
  $userList = $('.js-user-list');
  $messageList = $('.js-message-list');
  $messageForm = $('.js-message-form');
  $messageInput = $messageForm.find('.js-input');

  $messageForm.on('submit', function(e) {
    var text;

    e.preventDefault();
    text = $messageInput.val();

    socket.emit('message send', {
      user: myId,
      text: text,
    });

    $messageInput.val('');
    addMessage(text, myId);
  });

  socket.on('message incoming', function(data) {
    addMessage(data.text, data.user);
    $messageList[0].scrollTop = $messageList[0].scrollHeight;
  });

  socket.on('user connect', function(data) {
    var userId;

    users = data.users[0];
    userId = data.userId;
    if (!myId) {
      myId = userId
    }

    makeUsersList(users);
    addMessage(userId + ' has joined.', null, '-info');
  });

  socket.on('user disconnect', function(userId) {
    var index = users.indexOf(userId);
    users.splice(index, 1);
    makeUsersList(users);
    addMessage(userId + ' has left.', null, '-warn');
  });

  var makeUsersList = function(users) {
    var userListHtml = '';

    users.forEach(function(user, i) {
      userListHtml += '<li class="user">' + users[i] + '</li>'
    });

    $userList.html(userListHtml);
  };

  var addMessage = function(message, user, type) {
    if (user) {
      message = user + ': ' + message;
    }
    type = type || '';

    $messageList.append($('<li>').addClass('message ' + type).text(message));
  };
})();
