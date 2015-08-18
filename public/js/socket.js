var name = prompt("What is your name?", "Enter name here.");
var socket = io();
socket.on('connect', function(){
  socket.emit('new guy', name);
});
socket.on('chat message', function(msg){
  $('#messages').append($('<li class="list-group-item">').text(msg));
});
$('form').submit(function(){
  socket.emit('chat message', name + ": " + $('#m').val());
  $('#m').val('');
  return false;
});
