/* eslint-disable import/no-unresolved */
import { Mongo } from 'meteor/mongo';

/* eslint-enable import/no-unresolved */

/* eslint-disable import/prefer-default-export */
export const UserSessions = new Mongo.Collection('presence:user-sessions');
