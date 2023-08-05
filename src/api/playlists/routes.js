const routes = (handler) => [
    {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: (request) => handler.getPlaylistSongsByIdHandler(request),
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: (request) => handler.getAllPlaylistsHandler(request),
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: (request, h) => handler.postPlaylistSongByIdHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'POST',
        path: '/playlists',
        handler: (request, h) => handler.postPlaylistHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: (request) => handler.deletePlaylistSongByIdHandler(request),
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: (request) => handler.deletePlaylistByIdHandler(request),
        options: {
            auth: 'openmusic_jwt',
        },
    },
];

module.exports = routes;