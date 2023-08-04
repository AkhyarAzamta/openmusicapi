const routes = (handler) => [
    {
        method: 'GET',
        path: '/playlists/{id}/activities',
        handler: (request) => handler.getActivitiesByIdHandler(request),
        options: {
            auth: 'openmusic_jwt',
        },
    },
];

module.exports = routes;