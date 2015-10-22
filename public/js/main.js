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
    $messageList.append($('<li>').addClass('message').text(myId + ': ' + text));
  });

  socket.on('message incoming', function(data) {
    $messageList.append($('<li>').addClass('message').text(data.user + ': ' + data.text));
    $messageList[0].scrollTop = $messageList[0].scrollHeight;
  });

  socket.on('user connect', function(data) {
    var userId;

    users = data.users[0];
    userId = data.userId;
    if (!myId) {
      myId = userId
    }

    makeUsersList(users, $userList);
    $messageList.append($('<li>').addClass('message -info').text(userId + ' has joined.'));
  });

  socket.on('user disconnect', function(userId) {
    var index = users.indexOf(userId);
    users.splice(index, 1);
    makeUsersList(users, $userList);
    $messageList.append($('<li>').addClass('message -warn').text(userId + ' has left.'));
  });

  function makeUsersList(users, $userList) {
    var userListHtml = '';

    users.forEach(function(user, i) {
      userListHtml += '<li class="user">' + users[i] + '</li>'
    });

    $userList.html(userListHtml);
  }
})();
