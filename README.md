# User Presence

This package is a simple, scalable package for keeping track of if your users are online, idle, or offline. While other packages exist that do this same thing, most of them fall flat when it comes to scalability and they lock you into keeping the status data on the profile key of the user record. This package allows you to clean up neatly after an app instance dies and lets you configure what actions to take when the users presence changes state.

>>This is a [Meteor][meteor] package with part of it's code published as a companion NPM package made to work with clients other than Meteor. For example your server is Meteor, but you want to build a React Native app for the client. This allows you to share code between your Meteor server and other clients to give you a competitive advantage when bringing your mobile and web application to market.

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->
- [Supporting The Project](#supporting-the-project)
- [Meteor Installation](#meteor-installation)
- [NPM Installation](#npm-installation)
- [Usage Outside Meteor](#usage-outside-meteor)
  - [React Native](#react-native)
- [Basic Usage](#basic-usage)
- [Server API](#server-api)
- [User Extensions](#user-extensions)
<!-- /TOC -->

## Supporting The Project

Finding the time to maintain FOSS projects can be quite difficult. I am myself responsible for over 30 personal projects across 2 platforms, as well as Multiple others maintained by the [Meteor Community Packages](https://github.com/meteor-community-packages) organization. Therfore, if you appreciate my work, I ask that you either sponsor my work through GitHub, or donate via Paypal or Patreon. Every dollar helps give cause for spending my free time fielding issues, feature requests, pull requests and releasing updates. Info can be found in the "Sponsor this project" section of the [GitHub Repo](https://github.com/copleykj/socialize-user-presence)

## Meteor Installation

This package does not directly use the `simpl-schema` package, but it depend on the [socialize:user-model][user-model] which uses it and so we need to make sure it's installed as well

```shell
meteor npm install --save simpl-schema
meteor add socialize:user-presence
```

## NPM Installation

When using this package with React Native, the dependency tree ensures that `simpl-schema` is loaded so there's no need to install it as when using within Meteor.

```shell
npm install --save @socialize/user-presence
```

## Usage Outside Meteor

The client side parts of this package are published to NPM as `@socialize/cloudinary` for use in front ends outside of Meteor.

When using the npm package you'll need to connect to a server, which hosts the server side Meteor code for your app, using `Meteor.connect` as per the [@socialize/react-native-meteor usage example](https://github.com/copleykj/react-native-meteor#example-usage) documentation.

 ```javascript
Meteor.connect('ws://192.168.X.X:3000/websocket');
 ```

### React Native

When using this package with React Native there is some minor setup required by the `@socialize/react-native-meteor` package. See [@socialize/react-native-meteor react-native](https://github.com/copleykj/react-native-meteor#react-native) for necessary instructions.

## Basic Usage

We first need to configure how presence works on the server. This part won't work in React Native code, so you won't find React Native specific code here.

```javascript
import { Meteor } from 'meteor/meteor';
import { User } from 'meteor/socialize:user-model';
import { UserPresence } from 'meteor/socialize:user-presence';
import SimpleSchema from 'meteor/aldeed:simple-schema';

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

// If `sessionIds` is undefined this signifies we need a fresh start.
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

## Server API

The server side API consists of methods which register callbacks to run when a users presence changes. A user is considered online if any session is set to online, idle if all sessions are set to idle, or offline if there are no current sessions for the user.

`UserPresence.onSessionConnected(Fn(connection, userId))` - register a callback to run each time a logged in user makes a connection to the server.

```javascript
UserPresence.onSessionConnected(function(connection, userId){
    EventLogs.insert({eventType: 'user-connected', userId, connection});
});
```

`UserPresence.onSessionDisconnected(Fn(connection, userId))` - register a callback to run each time a logged in user breaks connection to the server.

```javascript
UserPresence.onSessionDisconnected(function (connection, userId) {
    EventLogs.insert({eventType: 'user-disconnected', userId, connection});
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

## User Extensions

This package provides some extensions onto the User class which comes with socialize:user-model for your convenience. These methods are included in the React Native code and so if using this package in React Native, you'll need to import the package for it to properly extend the `User` class with these methods.

```javascript
import '@socialize/user-presence';
// Now Meteor.user() will return instances of 'User' class with these methods available
```

`User.prototype.setStatusIdle()` - Set the current logged in user for this session to idle.

```javascript
Meteor.user().setStatusIdle();
```

`User.prototype.setStatusOnline()` - Set the current logged in user for this session to online.

```javascript
Meteor.user().setStatusOnline();
```

[meteor]: https://meteor.com
[socialize]: https://atmospherejs.com/socialize
[user-model]: https://github.com/copleykj/socialize-user-model
