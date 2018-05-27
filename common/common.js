/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { User } from 'meteor/socialize:user-model';
import { Mongo } from 'meteor/mongo';
/* eslint-enable import/no-unresolved */

import construct from './collection.js';
import extendUser from './user-extensions.js';

extendUser({ Meteor, User });
export const UserSessions = construct({ Mongo });
