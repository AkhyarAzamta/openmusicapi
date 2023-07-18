require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const songs = require('./api/songs');
const ClientError = require('./exceptions/ClientError');
const { AlbumValidator, SongValidator } = require('./validator/openmusic');
const AlbumService = require('./services/postgres/AlbumService');
const SongService = require('./services/postgres/SongService');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,

    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
      }
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongValidator,
      }
    }
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResposne = h.response({
          status: 'fail',
          message: response.message,
        });

        newResposne.code(response.statusCode);
        return newResposne;
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, dll.
      if (!response.isServer) {
        return h.continue;
      }

      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });

      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;

  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init();
