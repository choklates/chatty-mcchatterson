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

  socket.on('user connect', function(data) {
    var userId;

    users = data.users[0];
    userId = data.userId;
    if (!myId) {
      myId = userId;
    } else {
      addMessage(userId + ' has joined.', null, '-info');
    }

    makeUsersList(users);
  });

  socket.on('history retrieved', function(data) {
    var html, keys, len, message, className;

    html = '';
    keys = Object.keys(data);
    len = keys.length;
    className = '';

    keys.forEach(function(key, i) {
      message = data[key];
      if (i === len - 1) {
        className = '-lastread';
      }

      html += '<li class="message ' + className + '">' + message.user + ': ' + message.text + '</li>';
    });

    $messageList.append(html);
  });

  socket.on('message incoming', function(data) {
    addMessage(data.text, data.user);
    $messageList[0].scrollTop = $messageList[0].scrollHeight;
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
