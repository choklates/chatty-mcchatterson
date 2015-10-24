(function() {
  'use strict';

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
    var keys, len, chunk, message, fragment;

    keys = Object.keys(data);
    len = keys.length;
    fragment = document.createDocumentFragment();

    keys.forEach(function(key, i) {
      chunk = data[key];
      if (i === len - 1) {
        chunk.type = '-lastread';
      }

      message = new Message(chunk);
      fragment.appendChild(message)
    });

    $messageList.append(fragment);
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
      message = user + '<br>' + message;
    }
    type = type || '';


    var message = new Message({
      type: type,
      user: user,
      text: message
    });

    $messageList.append(message);
  };

  function Message(data) {
    var fragments, className;

    fragments = {};
    className = (data.type) ? 'message-frame ' + data.type : 'message-frame';

    this.user = data.user;
    this.time = data.time;
    this.text = data.text;

    fragments.li = document.createElement('li');
    fragments.li.className = className;
    fragments.header = document.createElement('div');
    fragments.header.className = 'header';
    fragments.user = document.createElement('span');
    fragments.user.className = 'user';
    fragments.user.textContent = this.user;
    fragments.avatar = document.createElement('div');
    fragments.avatar.className = 'avatar';
    fragments.avatar.dataset.initial = this.user.charAt(0);
    fragments.time = document.createElement('time');
    fragments.time.className = 'time';
    fragments.time.textContent = this.time;
    fragments.text = document.createElement('p');
    fragments.text.className = 'text';
    fragments.text.textContent = this.text;

    fragments.header.appendChild(fragments.user);
    fragments.header.appendChild(fragments.time);
    fragments.li.appendChild(fragments.avatar);
    fragments.li.appendChild(fragments.header);
    fragments.li.appendChild(fragments.text);

    return fragments.li;
  }
})();
