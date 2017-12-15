/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

/* eslint-enable import/no-unresolved */

import { determineStatus, UserPresence } from './user-presence.js';
import { UserSessions } from '../common/collection.js';

import './publications.js';
import '../common/user-extensions.js';

Meteor.methods({
    updateSessionStatus(status) {
        check(status, Match.Integer);
        if (this.userId && (status === 1 || status === 2)) {
            UserSessions.update(this.connection.id, { $set: { status } });
            determineStatus(this.userId);
        }
    },
});

/* eslint-disable import/prefer-default-export */
export { UserPresence };
