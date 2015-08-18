var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var userCount = 0;
var users = {};

io.sockets.on('connection', function(client_socket){
  console.log('>>> * Received connection. *');
  //console.log(client_socket);
  client_socket.on('new guy', function(name){
    users[client_socket.id] = {"name" : name};
    console.log('>>> Added new user: ' + users[client_socket.id].name);
    userCount=userCount+1;
    console.log('>>>  ' + userCount + ' users online.');
    console.log(users);
    io.emit('room update', users);
    io.emit('chat message', ">>> User \"" + name + "\" has joined the chat <<<");
  });
  client_socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  client_socket.on('disconnect', function(socket){
    console.log('>>> * Received disconnection. *');
    if (users[client_socket.id]) {
      var rmname = users[client_socket.id].name;
      delete users[client_socket.id];
      userCount=userCount-1;
      console.log('>>> Removed user: ' + rmname);
      console.log('>>>  ' + userCount + ' users online.');
      console.log(users);
      io.emit('room update', users);
      io.emit('chat message', ">>> User \"" + rmname + "\" has disconnected <<<");
    }
    else {
      console.log(">>> False alarm. Nothing happen.");
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
