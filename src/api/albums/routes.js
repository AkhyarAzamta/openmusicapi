const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (request, h) => handler.postAlbumHandler(request, h),
  },
  {
    method: 'GET',
    path: '/albums/{albumId}',
    handler: (request, h) => handler.getAlbumByIdHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/albums/{albumId}',
    handler: (request, h) => handler.updateAlbumByIdHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/albums/{albumId}',
    handler: (request, h) => handler.deleteAlbumByIdHandler(request, h),
  }
]

module.exports = routes;
