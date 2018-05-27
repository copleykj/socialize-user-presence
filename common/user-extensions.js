export default ({ Meteor, User }) => {
    User.methods({
        setStatusIdle() {
            Meteor.call('updateSessionStatus', 1);
        },
        setStatusOnline() {
            Meteor.call('updateSessionStatus', 2);
        },
    });
};
