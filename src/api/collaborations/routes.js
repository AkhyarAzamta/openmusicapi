const routes = (handler) => [
    {
        method: 'DELETE',
        path: '/collaborations',
        handler: handler.deleteCollaborationHandler,
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'POST',
        path: '/collaborations',
        handler: (request, h) => handler.postCollaborationHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
];

module.exports = routes;
