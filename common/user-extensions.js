/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { User } from 'meteor/socialize:user-model';

/* eslint-enable import/no-unresolved */

User.methods({
    setStatusIdle() {
        Meteor.call('updateSessionStatus', 1);
    },
    setStatusOnline() {
        Meteor.call('updateSessionStatus', 2);
    },
});
