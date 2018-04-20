/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { ServerPresence } from 'meteor/socialize:server-presence';

/* eslint-enable import/no-unresolved */

import { UserSessions } from '../common/common.js';

UserSessions._ensureIndex({ userId: 1 });
UserSessions._ensureIndex({ serverId: 1 });
UserSessions._ensureIndex({ sessionId: 1 });

const cleanupFunctions = [];
const userOnlineFunctions = [];
const userOfflineFunctions = [];
const userIdleFunctions = [];
const sessionConnectedFunctions = [];
const sessionDisconnectedFunctions = [];

/* eslint-disable import/prefer-default-export */
export const UserPresence = {};

UserPresence.onSessionConnected = (sessionConnectedFunction) => {
    if (typeof sessionConnectedFunction === 'function') {
        sessionConnectedFunctions.push(sessionConnectedFunction);
    } else {
        throw new Meteor.Error('Not A Function', 'UserPresence.onSessionConnected requires function as parameter');
    }
};

export const sessionConnected = (connection, userId) => {
    sessionConnectedFunctions.forEach((sessionFunction) => {
        sessionFunction(connection, userId);
    });
};

UserPresence.onSessionDisconnected = (sessionDisconnectedFunction) => {
    if (typeof sessionDisconnectedFunction === 'function') {
        sessionDisconnectedFunctions.push(sessionDisconnectedFunction);
    } else {
        throw new Meteor.Error('Not A Function', 'UserPresence.onSessionDisconnected requires function as parameter');
    }
};

export const sessionDisconnected = (connection, userId) => {
    sessionDisconnectedFunctions.forEach((sessionFunction) => {
        sessionFunction(connection, userId);
    });
};


UserPresence.onUserOnline = (userOnlineFunction) => {
    if (typeof userOnlineFunction === 'function') {
        userOnlineFunctions.push(userOnlineFunction);
    } else {
        throw new Meteor.Error('Not A Function', 'UserPresence.onUserOnline requires function as parameter');
    }
};

const userOnline = (userId, connection) => {
    userOnlineFunctions.forEach((onlineFunction) => {
        onlineFunction(userId, connection);
    });
};

UserPresence.onUserIdle = (userIdleFunction) => {
    if (typeof userIdleFunction === 'function') {
        userIdleFunctions.push(userIdleFunction);
    } else {
        throw new Meteor.Error('Not A Function', 'UserPresence.onUserIdle requires function as parameter');
    }
};

const userIdle = (userId, connection) => {
    userIdleFunctions.forEach((idleFunction) => {
        idleFunction(userId, connection);
    });
};

UserPresence.onUserOffline = (userOfflineFunction) => {
    if (typeof userOfflineFunction === 'function') {
        userOfflineFunctions.push(userOfflineFunction);
    } else {
        throw new Meteor.Error('Not A Function', 'UserPresence.onUserOffline requires function as parameter');
    }
};

const userOffline = (userId, connection) => {
    userOfflineFunctions.forEach((offlineFunction) => {
        offlineFunction(userId, connection);
    });
};

export const determineStatus = (userId, connection) => {
    let status = 0;
    const sessions = UserSessions.find({ userId }, { fields: { status: 1 } });
    const sessionCount = sessions.fetch().length;

    if (sessionCount > 0) {
        status = 1;
        sessions.forEach((session) => {
            if (session.status === 2) {
                status = 2;
            }
        });
    }

    switch (status) {
        case 1:
            userIdle(userId, connection);
            break;
        case 2:
            userOnline(userId, connection);
            break;
        default:
            userOffline(userId, connection);
            break;
    }
};

export const userConnected = (sessionId, userId, serverId, connection) => {
    UserSessions.insert({ serverId, userId, _id: sessionId, status: 2 });
    determineStatus(userId, connection);
};

export const userDisconnected = (sessionId, userId, connection) => {
    UserSessions.remove(sessionId);
    determineStatus(userId, connection);
};


UserPresence.onCleanup = (cleanupFunction) => {
    if (typeof cleanupFunction === 'function') {
        cleanupFunctions.push(cleanupFunction);
    } else {
        throw new Meteor.Error('Not A Function', 'UserPresence.onCleanup requires function as parameter');
    }
};

const cleanup = (sessionIds) => {
    cleanupFunctions.forEach((cleanupFunction) => {
        cleanupFunction(sessionIds);
    });
};

ServerPresence.onCleanup((serverId) => {
    if (serverId) {
        const sessionIds = UserSessions.find({ serverId }, { fields: { userId: true } }).map((session) => {
            userDisconnected(session._id, session.userId, null);
            return session._id;
        });
        cleanup(sessionIds);
    } else {
        cleanup();
        UserSessions.remove({});
    }
});
