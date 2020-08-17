/* global Package */
Package.describe({
    name: 'socialize:user-presence',
    summary: 'Scalable user presence',
    version: '1.0.3',
    git: 'https://github.com/copleykj/socialize-user-presence.git',
});

Package.onUse(function _(api) {
    api.versionsFrom('1.10.2');
    api.use(['mongo']);
    api.use(['socialize:server-presence@1.0.2', 'socialize:user-model@1.0.4']);

    api.imply('socialize:user-model');

    api.mainModule('server/server.js', 'server');
    api.mainModule('common/common.js', 'client');
});
