// Fungsi routes yang menerima parameter 'handler'
const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    // Handler untuk rute POST /albums
    handler: (request, h) => handler.postAlbumHandler(request, h),
  },
  {
    method: 'GET',
    path: '/albums/{albumId}',
    // Handler untuk rute GET /albums/{albumId}
    handler: (request, h) => handler.getAlbumByIdHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/albums/{albumId}',
    // Handler untuk rute PUT /albums/{albumId}
    handler: (request, h) => handler.updateAlbumByIdHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/albums/{albumId}',
    // Handler untuk rute DELETE /albums/{albumId}
    handler: (request, h) => handler.deleteAlbumByIdHandler(request, h),
  }
]

// Ekspor fungsi routes yang akan digunakan pada berkas lain
module.exports = routes;
