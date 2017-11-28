/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';

/* eslint-enable import/no-unresolved */

import UserPresence, { determineStatus } from './user-presence.js';
import { UserSessions } from '../common/collection.js';

import './publications.js';
import '../common/user-extensions.js';

Meteor.methods({
    updateSessionStatus(status) {
        if (this.userId && (status === 1 || status === 2)) {
            UserSessions.update(this.connection.id, { $set: { status } });
            determineStatus(this.userId);
        }
    },
});

/* eslint-disable import/prefer-default-export */
export { UserPresence };
