Meteor.methods({
    // 0 = offline
    // 1 = idle
    // 2 = online
    updateSessionStatus: function(status){
        if(this.userId && (status === 1 || status === 2)){
            UserSessions.update(this.connection.id, {$set:{status:status}});
            determineStatus(this.userId, this.connection);
        }
    }
});
