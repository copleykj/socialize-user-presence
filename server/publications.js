Meteor.publish(null, function(){
    var self = this;
    if(self.userId && self.connection){
        userConnected(self.userId, ServerPresence.serverId(), self.connection);


        self.onStop(function(){
            userDisconnected(self.connection, self.userId);
        });
    }
    self.ready();
}, {is_auto:true});
