Meteor.publish(null, function(){
    var self = this;
    if(self.userId && self.connection && self.connection.id){
        userConnected(self.connection.id, self.userId, ServerPresence.serverId(), self.connection);
        sessionConnected(self.connection.id);

        self.onStop(function(){
            userDisconnected(self.connection.id, self.userId, self.connection);
            sessionDisconnected(self.connection.id);
        });
    }
    self.ready();
}, {is_auto:true});
