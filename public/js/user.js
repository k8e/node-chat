// Export the User
module.exports = User;

var totalCount = 0

// User "class"
function User(name, ip) {
  this.name = name;
  this.ip = ip;
  totalCount++;
}

User.prototype.getName = function() {
  return this.name;
};

User.prototype.getIp = function() {
  return this.ip;
};

User.getCount = function() {
  return totalCount;
};
