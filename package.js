/* global Package */
Package.describe({
    name: 'socialize:user-presence',
    summary: 'Scalable user presence',
    version: '2.0.0',
    git: 'https://github.com/copleykj/socialize-user-presence.git',
});

Package.onUse(function _(api) {
    api.versionsFrom(['2.8.1', '3.0']);
    api.use(['mongo']);
    api.use(['socialize:server-presence@1.1.0', 'socialize:user-model@2.0.0']);

    api.imply('socialize:user-model');

    api.mainModule('server/server.js', 'server');
    api.mainModule('common/common.js', 'client');
});
