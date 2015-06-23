# User Presence #

This package is a simple, scalable package for keeping track of if your users are online, idle, or offline. While other packages exist that do this same thing, most of them fall flat when it comes to scalability and they lock you into keeping the status data on the profile key of the user record. This package cleans up neatly after an app instance dies and lets you configure what actions to take when the users presence changes state.


## Server API ##

The server side API consists of three methods which register callbacks to run when a users presence changes. A user is considered online if any session is set to online, idle if all sessions are set to idle, or offline if there are no current sessions for the user.

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

`User.prototype.setStatusOnline()` - Set the current logged in user for this session to online.
