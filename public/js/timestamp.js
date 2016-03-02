/**
 * Return a timestamp with the format "m/d/yy h:MM:ss TT"
 * @type {Date}
 */

 module.exports = {
  asLog: function () {
    return "[" + timeStamp() + "] ";
  }
};

function timeStamp() {
// Create a date object with the current time
  var now = new Date();

// Create an array with the current month, day and time
  var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];

// Create an array with the current hour, minute and second
  var hours = leftPad(now.getHours(), 2); // Always display hours with 2 digits
  var time = [ hours, now.getMinutes() ];

// Determine AM or PM suffix based on the hour
  var suffix = ( time[0] < 12 ) ? "AM" : "PM";

// Convert hour from military time
  time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;

// If hour is 0, set it to 12
  time[0] = time[0] || 12;

// If seconds and minutes are less than 10, add a zero
  for ( var i = 1; i < 3; i++ ) {
    if ( time[i] < 10 ) {
      time[i] = "0" + time[i];
    }
  }

// Return the formatted string
  return date.join("-") + " " + time.join(":") + " " + suffix;
}

// Thanks stackoverflow
function leftPad(number, targetLength) {
  var output = number + '';
  while (output.length < targetLength) {
      output = '0' + output;
  }
  return output;
}
