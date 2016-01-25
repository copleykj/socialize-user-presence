Meteor.methods({
    updateSessionStatus: function(status){
        if(this.userId && (status === 1 || status === 2)){
            UserSessions.update(this.connection.id, {$set:{status:status}});
            determineStatus(this.userId);
        }
    }
});
