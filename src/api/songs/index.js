const SongsHandler = require('./handler'); // Import kelas SongsHandler yang berisi logika pengelolaan lagu
const routes = require('./routes'); // Import fungsi routes yang berisi definisi rute endpoint untuk lagu

module.exports = {
  name: 'songs', // Nama plugin untuk menyimpan data lagu
  version: '1.0.0', // Versi plugin
  register: async (server, { service, validator }) => {
    // Fungsi register yang akan dieksekusi saat plugin ini diregistrasi di server Hapi

    const songsHandler = new SongsHandler(service, validator); // Inisialisasi instance dari kelas SongsHandler dengan service dan validator yang diberikan
    server.route(routes(songsHandler)); // Daftarkan rute-rute endpoint untuk lagu ke dalam server Hapi dengan menggunakan fungsi routes yang mengambil instance songsHandler sebagai argumen
  }
}
