const routes = (handler) => [
    {
        method: 'GET',
        path: '/users/{id}',
        handler: (request) => handler.getUserByIdHandler(request),
    },
    {
        method: 'POST',
        path: '/users',
        handler: (request, h) => handler.postUserHandler(request, h),
    },
];

module.exports = routes;