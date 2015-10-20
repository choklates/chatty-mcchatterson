'use strict';

var socket, users,
  $userList, $messageList, $messageForm, $messageInput;

socket = io();
$userList = $('.js-user-list');
$messageList = $('.js-message-list');
$messageForm = $('.js-message-form');
$messageInput = $messageForm.find('.js-input');

$messageForm.on('submit', function(e) {
  e.preventDefault();

  socket.emit('chat message', $messageInput.val());
  $messageInput.val('');
});

socket.on('chat message', function(message) {
  $messageList.append($('<li>').addClass('message').text(message));
  $messageList[0].scrollTop = $messageList[0].scrollHeight;
});

socket.on('user connect', function(data) {
  var userId;

  users = data.users[0];
  userId = data.userId;

  makeUsersList(users, $userList);
  $messageList.append($('<li>').addClass('message -info').text(userId + ' has joined.'));
});

socket.on('user disconnect', function(userId) {
  var index = users.indexOf(userId);
  users.splice(index, 1);
  makeUsersList(users, $userList);
  $messageList.append($('<li>').addClass('message -info').text(userId + ' has left.'));
});

function makeUsersList(users, $userList) {
  var userListHtml = '';

  users.forEach(function(user, i) {
    userListHtml += '<li class="user">' + users[i] + '</li>'
  });

  $userList.html(userListHtml);
}