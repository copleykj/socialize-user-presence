/* eslint-disable import/no-unresolved */
import Meteor, { Mongo } from '@socialize/react-native-meteor';
import { User } from '@socialize/user-model';
/* eslint-enable import/no-unresolved */

import construct from './common/collection.js';
import extendUser from './common/user-extensions.js';

extendUser({ Meteor, User });
export const UserSessions = construct({ Mongo });
