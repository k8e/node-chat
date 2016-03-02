var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ts = require('./public/js/timestamp.js');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var userCount = 0;
var users = {};

io.sockets.on('connection', function(client_socket){
  // Received a connection
  client_socket.on('new guy', function(name){
    users[client_socket.id] = {"name" : name};
    // New user added to chat
    userCount=userCount+1;
    logUpdate(users[client_socket.id].name + " joined.");
    io.emit('room update', users);
    io.emit('announcement', "User \"" + name + "\" has joined the chat.");
  });
  client_socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  client_socket.on('disconnect', function(socket){
    // Received a disconnection
    if (users[client_socket.id]) {
      var rmname = users[client_socket.id].name;
      delete users[client_socket.id];
      userCount=userCount-1;
      logUpdate(rmname + " left.");
      io.emit('room update', users);
      io.emit('announcement', "User \"" + rmname + "\" has disconnected.");
    }
    else {
      console.log(">>> False alarm. Nothing happen.");
    }
  });
});

function logUpdate(info) {
  var timestamp = ts.asLog();
  console.log(timestamp + userCount + " online | " + info);
}

http.listen(3000, function(){
  logUpdate("Now listening on *:3000");
});
