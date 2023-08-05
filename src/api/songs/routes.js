const routes = (handler) => [
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: (request) => handler.getSongByIdHandler(request),
  },
  {
    method: 'GET',
    path: '/songs',
    handler: (request) => handler.getSongsHandler(request),
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: (request) => handler.editSongByIdHandler(request),
  },
  {
    method: 'POST',
    path: '/songs',
    handler: (request, h) => handler.postSongHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: (request) => handler.deleteSongByIdHandler(request),
  },
];

module.exports = routes;