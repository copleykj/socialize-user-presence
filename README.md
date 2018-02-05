# User Presence #

This package is a simple, scalable package for keeping track of if your users are online, idle, or offline. While other packages exist that do this same thing, most of them fall flat when it comes to scalability and they lock you into keeping the status data on the profile key of the user record. This package allows you to clean up neatly after an app instance dies and lets you configure what actions to take when the users presence changes state.

## Supporting the Project ##
In the spirit of keeping this and all of the packages in the [Socialize](https://atmospherejs.com/socialize) set alive, I ask that if you find this package useful, please donate to it's development.

Litecoin: LXLBD9sC5dV79eQkwj7tFusUHvJA5nhuD3 / [Patreon](https://www.patreon.com/user?u=4866588) / [Paypal](https://www.paypal.me/copleykj)


## Installation ##
This package does not directly use the `simpl-schema` package, but it depend on the [socialize:user-model](https://github.com/copleykj/socialize-user-model) which uses it and so we need to make sure it's installed as well

```shell
$ meteor npm install --save simpl-schema
$ meteor add socialize:user-presence
```

## Basic Usage ##

```javascript
import { Meteor } from 'meteor/meteor';
import { User } from 'meteor/socialize:user-model';
import { UserPresence } from 'meteor/socialize:user-presence';
import SimpleSchema from 'simpl-schema';

// Schema for the fields where we will store the status data
const StatusSchema = new SimpleSchema({
    status: {
        type: String,
        optional: true,
        allowedValues: ['online', 'idle'],
    },
    lastOnline: {
        type: Date,
        optional: true,
    },
});

// Add the schema to the existing schema currently attached to the User model
User.attachSchema(StatusSchema);

// When a full cleanup is necessary we will unset the status field to show all users as offline
UserPresence.onCleanup(function onCleanup(sessionIds) {
    if (!sessionIds) {
        Meteor.users.update({}, { $unset: { status: true } }, { multi: true });
    }
});

// When a user comes online we set their status to online and set the lastOnline field to the current time
UserPresence.onUserOnline(function onUserOnline(userId) {
    Meteor.users.update(userId, { $set: { status: 'online', lastOnline: new Date() } });
});

// When a user goes idle we'll set their status to indicate this
UserPresence.onUserIdle(function onUserIdle(userId) {
    Meteor.users.update(userId, { $set: { status: 'idle' } });
});

// When a user goes offline we'll unset their status field to indicate offline status
UserPresence.onUserOffline(function onUserOffline(userId) {
    Meteor.users.update(userId, { $unset: { status: true } });
});
```


## Server API ##

The server side API consists of methods which register callbacks to run when a users presence changes. A user is considered online if any session is set to online, idle if all sessions are set to idle, or offline if there are no current sessions for the user.

`UserPresence.onSessionConnected(Fn(connection, userId))` - register a callback to run each time a logged in user makes a connection to the server.

```javascript
UserPresence.onSessionConnected(function (connection) {
  UserSessions.upsert(
    { _id: connection.id, userId: Meteor.userId() },
    { $set: { _id: connection.id, userId: Meteor.userId() }}
  );
});
```

`UserPresence.onSessionDisconnected(Fn(connection, userId))` - register a callback to run each time a logged in user breaks connection to the server.

```javascript
UserPresence.onSessionDisconnected(function (connection, userId) {
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
  ProfilesCollection.update({ _id: userId }, { $set: { status: 'online' } });
});
```

`UserPresence.onUserIdle(Fn(userId, connection))` - register a callback to run when the users status is "Idle" (All sessions are idle)

```javascript
UserPresence.onUserIdle(function (userId) {
  ProfilesCollection.update({ _id: userId }, { $set: { status: 'idle' } });
});
```

`UserPresence.onUserOffline(Fn(userId, connection))` - register a callback to run when the users status is "Offline" (No connected sessions)

```javascript
UserPresence.onUserOffline(function (userId) {
  ProfilesCollection.update({ _id: userId }, { $unset: { status: true } });
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
Meteor.user().setStatusOnline();
```
