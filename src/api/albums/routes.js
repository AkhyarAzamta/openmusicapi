const routes = (handler) => [
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (request) => handler.getAlbumByIdHandler(request),
  },
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.postAlbumLikesByIdHandler(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'POST',
    path: '/albums',
    handler: (request, h) => handler.postAlbumHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (request) => handler.putAlbumByIdHandler(request),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (request) => handler.deleteAlbumByIdHandler(request),
  },
];

module.exports = routes;