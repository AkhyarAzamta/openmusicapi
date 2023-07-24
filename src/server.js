// Memuat konfigurasi environment dari file .env
require('dotenv').config();

// Memuat library Hapi.js
const Hapi = require('@hapi/hapi');

// Memuat modul untuk fitur albums dan songs
const albums = require('./api/albums');
const songs = require('./api/songs');

// Memuat class untuk penanganan error dari klien (ClientError)
const ClientError = require('./exceptions/ClientError');

// Memuat validator untuk skema validasi album dan lagu (AlbumValidator, SongValidator)
const { AlbumValidator, SongValidator } = require('./validator/openmusic');

// Memuat kelas service untuk mengakses data album dan lagu dari database Postgres (AlbumService, SongService)
const AlbumService = require('./services/postgres/AlbumService');
const SongService = require('./services/postgres/SongService');

// Fungsi inisialisasi server
const init = async () => {
  // Membuat instance dari AlbumService dan SongService
  const albumService = new AlbumService();
  const songService = new SongService();

  // Membuat instance dari server Hapi.js
  const server = Hapi.server({
    port: process.env.PORT, // Menggunakan port yang diambil dari environment variable
    host: process.env.HOST, // Menggunakan host yang diambil dari environment variable

    routes: {
      cors: {
        origin: ['*'], // Mengizinkan semua origin untuk melakukan CORS request
      },
    },
  });

  // Melakukan registrasi plugin untuk fitur albums dan songs
  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService, // Menggunakan instance AlbumService sebagai service
        validator: AlbumValidator, // Menggunakan AlbumValidator sebagai validator
      }
    },
    {
      plugin: songs,
      options: {
        service: songService, // Menggunakan instance SongService sebagai service
        validator: SongValidator, // Menggunakan SongValidator sebagai validator
      }
    }
  ]);

  // Menambahkan extention point pada server untuk penanganan error
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      // Penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });

        newResponse.code(response.statusCode);
        return newResponse;
      }

      // Mempertahankan penanganan client error oleh Hapi secara native, seperti 404, dll.
      if (!response.isServer) {
        return h.continue;
      }

      // Penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami',
      });

      newResponse.code(500);
      return newResponse;
    }

    // Jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  // Memulai server
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
}

// Jalankan inisialisasi server
init();
