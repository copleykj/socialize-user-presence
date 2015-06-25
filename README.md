# User Presence #

This package is a simple, scalable package for keeping track of if your users are online, idle, or offline. While other packages exist that do this same thing, most of them fall flat when it comes to scalability and they lock you into keeping the status data on the profile key of the user record. This package cleans up neatly after an app instance dies and lets you configure what actions to take when the users presence changes state.


## Server API ##

The server side API consists of three methods which register callbacks to run when a users presence changes. A user is considered online if any session is set to online, idle if all sessions are set to idle, or offline if there are no current sessions for the user.

`UserPresence.onSessionConnected(Fn(sessionId, userId))` - register a callback to run each time a logged in user makes a connection to the server.

```javascript
UserPresence.onSessionConnected(function(sessionId, userId){
    Sessions.insert({_id:sessionId, userId:userId});
});
```

`UserPresence.onSessionDisconnected(Fn(sessionId, userId))` - register a callback to run each time a logged in user breaks connection to the server.

```javascript
UserPresence.onSessionDisconnected(function(sessionId, userId){
    Sessions.remove(sessionId);
});
```

`UserPresence.onCleanup(Fn(sessionIds))` - register a callback to run when your application starts fresh or an application instance goes offline. In the even of a fresh start the `sessionIds` parameter will be empty and you should run code for a full cleanup. When a single application instance goes offline, the `sessionIds` parameter will be populated with an array of ids for sessions that were connected to the server that went offline.

```javascript
UserPresence.onCleanup(function(sessionIds){
    if(sessionIds){
        Sessions.remove({_id:{$in:sessionIds}});
    }else{
        Sessions.remove({});
    }
});
```

`UserPresence.onUserOnline(Fn(userId))` - register a callback to run when the users status is "Online" (Any one session is online)

```javascript
UserPresence.onUserOnline(function(userId){
    Meteor.profiles.update({userId:userId}, {$set:{status:"online"}})
});
```

`UserPresence.onUserIdle(Fn(userId))` - register a callback to run when the users status is "Idle" (All sessions are idle)

```javascript
UserPresence.onUserIdle(function(userId){
    Meteor.profiles.update({userId:userId}, {$set:{status:"idle"}})
});
```

`UserPresence.onUserOffline(Fn(userId))` - register a callback to run when the users status is "Offline" (No connected sessions)

```javascript
UserPresence.onUserOffline(function(userId){
    Meteor.profiles.update({userId:userId}, {$unset:{status:true}})
});
```

## User Extensions ##

This package provides some extensions onto the User class which comes with socialize:user-model for your convenience.

`User.prototype.setStatusIdle()` - Set the current logged in user for this session to idle.

```javascript
Meteor.user().setStatusIdle();
```

`User.prototype.setStatusOnline()` - Set the current logged in user for this session to online.

```javascript
Meteor.user.setStatusOnline();
```
