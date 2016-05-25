var socket = io();
var name = " ";
var signedIn = false;

socket.on('connect', function(){
  socket.emit('idk');
});
socket.on('announcement', function(msg){
  $('#messages').append($("<li class='list-group-item announcement'>").text(">>> " + msg + " <<<"));
});
socket.on('room update', function(users){
  $('#users').empty();
  for (var id in users) {
    $('#users').append($("<li class='list-group-item'>").text(users[id].name));
  }
});
socket.on('chat message', function(msg){
  $('#messages').append($("<li class='list-group-item'>").html( "<span class='username'>" + msg.user + ":</span> " + msg.message ));
});

$('form').submit(function(event){
  if(signedIn) {
    // Send message
    var msg = $('#user_input').val();
    socket.emit('chat message', {'user': name, 'message': msg} );
  }
  else {
    // Sign in new user
    name = $('#user_input').val();
    socket.emit('login', name);
    $('#user_input').attr('placeholder', '');
    $('#action_btn').attr('value', 'Enter');
    signedIn = true;
  }
  $('#user_input').val('');
  return false; // Don't actually perform a form submission
});
