
export default ({ Mongo }) => {
    const UserSessions = new Mongo.Collection('presence:user-sessions');

    return UserSessions;
};
