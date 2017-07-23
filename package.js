/* global Package */
Package.describe({
    name: 'socialize:user-presence',
    summary: 'Scalable user presence',
    version: '1.0.0',
    git: 'https://github.com/copleykj/socialize-user-presence.git',
});

Package.onUse(function _(api) {
    api.versionsFrom('1.3');
    api.use(['mongo', 'underscore']);
    api.use(['socialize:server-presence@1.0.0', 'socialize:user-model@1.0.0']);

    api.mainModule('server/server.js', 'server');
    api.mainModule('common/common.js');
});
