/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { ServerPresence } from 'meteor/socialize:server-presence';

/* eslint-enable import/no-unresolved */

import { UserSessions } from '../common/common.js';

try {
    UserSessions.createIndexAsync({ userId: 1 });
    UserSessions.createIndexAsync({ serverId: 1 });
    UserSessions.createIndexAsync({ sessionId: 1 });
} catch (e) {
    throw new Meteor.Error('Failed to initialize indexes for socialize:user-presence');
}

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
    for (const sessionFunction of sessionConnectedFunctions) {
        sessionFunction(connection, userId);
    }
};

UserPresence.onSessionDisconnected = (sessionDisconnectedFunction) => {
    if (typeof sessionDisconnectedFunction === 'function') {
        sessionDisconnectedFunctions.push(sessionDisconnectedFunction);
    } else {
        throw new Meteor.Error('Not A Function', 'UserPresence.onSessionDisconnected requires function as parameter');
    }
};

export const sessionDisconnected = (connection, userId) => {
    for (const sessionFunction of sessionDisconnectedFunctions) {
        sessionFunction(connection, userId);
    }
};


UserPresence.onUserOnline = (userOnlineFunction) => {
    if (typeof userOnlineFunction === 'function') {
        userOnlineFunctions.push(userOnlineFunction);
    } else {
        throw new Meteor.Error('Not A Function', 'UserPresence.onUserOnline requires function as parameter');
    }
};

const userOnline = (userId, connection) => {
    for (const onlineFunction of userOnlineFunctions) {
        onlineFunction(userId, connection);
    }
};

UserPresence.onUserIdle = (userIdleFunction) => {
    if (typeof userIdleFunction === 'function') {
        userIdleFunctions.push(userIdleFunction);
    } else {
        throw new Meteor.Error('Not A Function', 'UserPresence.onUserIdle requires function as parameter');
    }
};

const userIdle = (userId, connection) => {
    for (const idleFunction of userIdleFunctions) {
        idleFunction(userId, connection);
    }
};

UserPresence.onUserOffline = (userOfflineFunction) => {
    if (typeof userOfflineFunction === 'function') {
        userOfflineFunctions.push(userOfflineFunction);
    } else {
        throw new Meteor.Error('Not A Function', 'UserPresence.onUserOffline requires function as parameter');
    }
};

const userOffline = (userId, connection) => {
    for (const offlineFunction of userOfflineFunctions) {
        offlineFunction(userId, connection);
    }
};

export const determineStatus = async (userId, connection) => {
    let status = 0;
    const sessions = UserSessions.find({ userId }, { projection: { status: 1 } });
    const sessionFull = await sessions.fetchAsync();

    if (sessionFull.length > 0) {
        status = 1;
        for (const session of sessionFull) {
            if (session.status === 2) {
                status = 2;
            }
        }
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

export const userConnected = async (sessionId, userId, serverId, connection) => {
    await UserSessions.insertAsync({ serverId, userId, _id: sessionId, status: 2 });
    await determineStatus(userId, connection);
};

export const userDisconnected = async (sessionId, userId, connection) => {
    await UserSessions.removeAsync(sessionId);
    await determineStatus(userId, connection);
};


UserPresence.onCleanup = (cleanupFunction) => {
    if (typeof cleanupFunction === 'function') {
        cleanupFunctions.push(cleanupFunction);
    } else {
        throw new Meteor.Error('Not A Function', 'UserPresence.onCleanup requires function as parameter');
    }
};

const cleanup = (sessionIds) => {
    for (const cleanupFunction of cleanupFunctions) {
        cleanupFunction(sessionIds);
    };
};

ServerPresence.onCleanup(async (serverId) => {
    if (serverId) {
        const sessions = await UserSessions.find({ serverId }, { projection: { userId: true } }).fetchAsync();
        const sessionIds = sessions.map((session) => {
            userDisconnected(session._id, session.userId, null);
            return session._id;
        });
        cleanup(sessionIds);
    } else {
        cleanup();
        UserSessions.removeAsync({});
    }
});
