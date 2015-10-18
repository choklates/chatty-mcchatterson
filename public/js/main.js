'use strict';

var socket,
  $messageList, $messageForm, $messageInput;

socket = io();
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
});
