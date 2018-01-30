# User Presence #

This package is a simple, scalable package for keeping track of if your users are online, idle, or offline. While other packages exist that do this same thing, most of them fall flat when it comes to scalability and they lock you into keeping the status data on the profile key of the user record. This package cleans up neatly after an app instance dies and lets you configure what actions to take when the users presence changes state.

## Supporting the Project ##
In the spirit of keeping this and all of the packages in the [Socialize](https://atmospherejs.com/socialize) set alive, I ask that if you find this package useful, please donate to it's development.

Litecoin: LXLBD9sC5dV79eQkwj7tFusUHvJA5nhuD3 / [Patreon](https://www.patreon.com/user?u=4866588) / [Paypal](https://www.paypal.me/copleykj)


## Installation ##

```shell
meteor add socialize:user-presence
```


## Server API ##

The server side API consists of methods which register callbacks to run when a users presence changes. A user is considered online if any session is set to online, idle if all sessions are set to idle, or offline if there are no current sessions for the user.

`UserPresence.onSessionConnected(Fn(connection, userId))` - register a callback to run each time a logged in user makes a connection to the server.

```javascript
UserPresence.onSessionConnected(function(connection, userId){
    Sessions.insert({_id:connection.id, userId});
});
```

`UserPresence.onSessionDisconnected(Fn(connection, userId))` - register a callback to run each time a logged in user breaks connection to the server.

```javascript
UserPresence.onSessionDisconnected(function (connection) {
  UserSessions.remove(connection.id);
});
```

`UserPresence.onCleanup(Fn())` - register a callback to run when your application starts fresh without any other instances running. T

```javascript
UserPresence.onCleanup(function () {
  Meteor.users.update({}, { $unset: { status: true } }, { multi: true });
});
```

`UserPresence.onUserOnline(Fn(userId, connection))` - register a callback to run when the users status is "Online" (Any one session is online).

```javascript
UserPresence.onUserOnline(function (userId) {
  ProfilesCollection.update({ userId }, { $set: { status: 'online' } });
});
```

`UserPresence.onUserIdle(Fn(userId, connection))` - register a callback to run when the users status is "Idle" (All sessions are idle)

```javascript
UserPresence.onUserIdle(function (userId) {
  ProfilesCollection.update({ userId }, { $set: { status: 'idle' } });
});
```

`UserPresence.onUserOffline(Fn(userId, connection))` - register a callback to run when the users status is "Offline" (No connected sessions)

```javascript
UserPresence.onUserOffline(function (userId) {
  ProfilesCollection.update({ userId }, { $unset: { status: true } });
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
