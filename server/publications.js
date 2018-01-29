/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { ServerPresence } from 'meteor/socialize:server-presence';

/* eslint-enable import/no-unresolved */

import { userConnected, sessionConnected, userDisconnected, sessionDisconnected } from './user-presence.js';

Meteor.publish(null, function userPresenceSessionConnected() {
    if (this.userId && this.connection && this.connection.id) {
        userConnected(this.connection.id, this.userId, ServerPresence.serverId(), this.connection);
        sessionConnected(this.connection, this.userId);

        this.onStop(() => {
            userDisconnected(this.connection.id, this.userId, this.connection);
            sessionDisconnected(this.connection, this.userId);
        });
    }
    this.ready();
}, { is_auto: true });
