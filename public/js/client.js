var socket = io();
var name = " ";
var signedIn = false;
var autoScroll = true;

/////////////////////////////
// SOCKETS
/////////////////////////////

socket.on('connect', function(){
  socket.emit('idk');
});
socket.on('announcement', function(msg){
  $('#messages').append($("<li class='list-group-item announcement'>").text(">>> " + msg));
});
socket.on('room update', function(users){
  $('#users').empty();
  for (var id in users) {
    $('#users').append($("<li class='list-group-item'>").text(users[id].name));
  }
});
socket.on('chat message', function(msg){
  $('#messages').append($("<li class='list-group-item'>").html( "<span class='username'>" + msg.user + ":</span> " + msg.message ));
  if (autoScroll) {
    $('html, body').animate({ scrollTop: $('#end').offset().top });
  }
});

/////////////////////////////
// FORM HANDLING
/////////////////////////////

$('form').submit(function(event){
  if(signedIn) {
    // Send message
    var msg = $('#user_input').val();
    autoScroll = true; // Re-enable auto-scroll
    $("#scroll-down").css("display", "none");
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

/////////////////////////////
// SCROLL HANDLING
/////////////////////////////

$(function() {
  // Detect user scrolls
  $('body').bind('touchmove', function(e) {
    disableAutoScroll(e); // Disable auto-scroll
  });
  // Detect user scroll via keypress
  $(document).keydown(function(e) {
    if(e.which == 33        // page up
       || e.which == 34     // page dn
       || e.which == 38     // up
       || e.which == 40     // down
       || (e.ctrlKey && e.which == 36)     // ctrl + home
       || (e.ctrlKey && e.which == 35)     // ctrl + end
      ) {
        disableAutoScroll(e); // Disable auto-scroll
    }
  });
  // Mouse scrolls (Mozilla/Webkit)
  if(window.addEventListener) {
      document.addEventListener('DOMMouseScroll', disableAutoScroll, false);
  }
  // Scrolls in IE/OPERA etc
  document.onmousewheel = disableAutoScroll;
});

function disableAutoScroll(e) {
  // Disable autoscroll
  autoScroll = false;
  $('#scroll-down').css("display", "block");
}

// Re-enable autoscroll on clicking the button
$('#scroll-down').click(function() {
  $('html, body').animate({ scrollTop: $('#end').offset().top }, 'slow');
  autoScroll = true;
  $('#scroll-down').css("display", "none");
});
