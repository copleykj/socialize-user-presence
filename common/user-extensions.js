if (Package['socialize:user-model']) {
  User.prototype.setStatusIdle = function() {
      Meteor.call('updateSessionStatus', 1);
  };

  User.prototype.setStatusOnline = function() {
      Meteor.call('updateSessionStatus', 2);
  };
}
