const routes = (handler) => [
    {
        method: 'PUT',
        path: '/authentications',
        handler: (request) => handler.putAuthenticationHandler(request),
    },
    {
        method: 'POST',
        path: '/authentications',
        handler: (request, h) => handler.postAuthenticationHandler(request, h),
    },
    {
        method: 'DELETE',
        path: '/authentications',
        handler: (request) => handler.deleteAuthenticationHandler(request),
    },
];

module.exports = routes;