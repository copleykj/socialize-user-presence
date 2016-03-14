Package.describe({
    name: 'socialize:user-presence',
    summary: 'Scalable user presence',
    version: '0.3.4',
    git: 'https://github.com/copleykj/socialize-user-presence.git'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0.2.1');
    api.use(['mongo', 'underscore']);
    api.use('socialize:server-presence@0.1.3');
    api.use('socialize:user-model@0.1.7', ['server', 'client'], {weak:true});

    api.addFiles('common/collection.js');

    api.addFiles(['server/publications.js', 'server/user-presence.js', 'server/server.js'], 'server');

    api.export('UserPresence', 'server');
});
