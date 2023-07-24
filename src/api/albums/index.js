const AlbumsHandler = require('./handler');
const routes = require('./routes');

// Ekspor modul yang akan digunakan oleh server Hapi
module.exports = {
  name: 'albums', // Nama plugin yang akan digunakan dalam server Hapi
  version: '1.0.0', // Versi plugin
  register: async (server, { service, validator }) => {
    const albumsHandler = new AlbumsHandler(service, validator); // Inisialisasi objek AlbumsHandler
    server.route(routes(albumsHandler)); // Terdaftarkan rute-rute yang ada ke dalam server Hapi
  }
}
