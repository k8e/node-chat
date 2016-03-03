var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ts = require('./public/js/timestamp.js');

var clientIp;
var clientAgent;
var userCount = 0;
var users = {};

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  clientIp = req.ip;
  clientAgent = req.headers["user-agent"];
});

io.sockets.on('connection', function(clientSocket){
  // Received a connection
  clientSocket.on('new guy', function(name){
    users[clientSocket.id] = {"name" : name, "ip" : clientIp, "agent": clientAgent};
    // New user added to chat
    userCount=userCount+1;
    logUpdate(users[clientSocket.id].ip + " \"" + users[clientSocket.id].name + "\" joined.");
    io.emit('room update', users);
    io.emit('announcement', "User \"" + name + "\" has joined the chat.");
  });
  clientSocket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  clientSocket.on('disconnect', function(socket){
    // Received a disconnection
    if (users[clientSocket.id]) {
      var remName = users[clientSocket.id].name;
      delete users[clientSocket.id];
      userCount = userCount-1;
      logUpdate(remName + " left.");
      io.emit('room update', users);
      io.emit('announcement', "User \"" + remName + "\" has disconnected.");
    }
    else {
      console.log(">>> False alarm. Nothing happen.");
    }
  });
});

function logUpdate(info) {
  var timeStamp = ts.asLog();
  console.log(timeStamp + userCount + " online | " + info);
}

http.listen(3000, function(){
  logUpdate("Now listening on *:3000");
});
