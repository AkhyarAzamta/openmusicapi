const routes = (handler) => [
  {
    method: 'POST', // Metode HTTP POST untuk menambahkan lagu baru
    path: '/songs', // Rute endpoint untuk menambahkan lagu baru
    handler: (request, h) => handler.postSongHandler(request, h), // Handler untuk menangani permintaan POST ke endpoint /songs. Akan menjalankan fungsi postSongHandler dari instance handler yang diberikan.
  },
  {
    method: 'GET', // Metode HTTP GET untuk mendapatkan daftar lagu atau lagu berdasarkan query
    path: '/songs', // Rute endpoint untuk mendapatkan daftar lagu atau lagu berdasarkan query
    handler: (request, h) => handler.getSongsHandler(request, h), // Handler untuk menangani permintaan GET ke endpoint /songs. Akan menjalankan fungsi getSongsHandler dari instance handler yang diberikan.
  },
  {
    method: 'GET', // Metode HTTP GET untuk mendapatkan lagu berdasarkan ID
    path: '/songs/{id}', // Rute endpoint untuk mendapatkan lagu berdasarkan ID
    handler: (request, h) => handler.getSongByIdHandler(request, h), // Handler untuk menangani permintaan GET ke endpoint /songs/{id}. Akan menjalankan fungsi getSongByIdHandler dari instance handler yang diberikan.
  },
  {
    method: 'PUT', // Metode HTTP PUT untuk memperbarui lagu berdasarkan ID
    path: '/songs/{id}', // Rute endpoint untuk memperbarui lagu berdasarkan ID
    handler: (request, h) => handler.updateSongByIdHandler(request, h), // Handler untuk menangani permintaan PUT ke endpoint /songs/{id}. Akan menjalankan fungsi updateSongByIdHandler dari instance handler yang diberikan.
  },
  {
    method: 'DELETE', // Metode HTTP DELETE untuk menghapus lagu berdasarkan ID
    path: '/songs/{id}', // Rute endpoint untuk menghapus lagu berdasarkan ID
    handler: (request, h) => handler.deleteSongByIdHandler(request, h), // Handler untuk menangani permintaan DELETE ke endpoint /songs/{id}. Akan menjalankan fungsi deleteSongByIdHandler dari instance handler yang diberikan.
  }
];

module.exports = routes;
