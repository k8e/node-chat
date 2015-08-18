var name = prompt("What is your name?", "Enter name here.");
var socket = io();
socket.on('connect', function(){
  socket.emit('new guy', name);
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
$('form').submit(function(){
  var msg = $('#m').val();
  socket.emit('chat message', {'user': name, 'message': msg} );
  $('#m').val('');
  return false;
});
