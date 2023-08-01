/* eslint-disable no-undef */
require("dotenv").config();

// mengimpor dotenv dan menjalankan konfigurasinya

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");

// const ClientError = require("./exceptions/ClientError");
const ClientError = require('../src/exceptions/ClientError');
const NotFoundError = require('../src/exceptions/NotFoundError');
const AuthorizationError = require('../src/exceptions/AuthorizationError');
const AuthenticationError = require('../src/exceptions/AuthenticationError');
// songs
const songs = require("./api/songs");
const SongsService = require("./services/postgres/SongService");
const SongsValidator = require("./validator/song");

// albums
const albums = require("./api/albums");
const AlbumsService = require("./services/postgres/AlbumService");
const AlbumsValidator = require("./validator/album");

// users
const users = require("./api/users");
const UsersService = require("./services/postgres/UsersService");
const UsersValidator = require("./validator/user");

// authentications
const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentication");

// collaborations
const collaborations = require("./api/collaborations");
const CollaborationsService = require("./services/postgres/CollaborationsService");
const CollaborationsValidator = require("./validator/collaboration");

// playlists
const playlists = require("./api/playlists");
const PlaylistsService = require("./services/postgres/PlaylistsService");
const PlaylistsValidator = require("./validator/playlist");

// playlistsongs
const playlistsongs = require("./api/playlistsongs");
const PlaylistsongsService = require("./services/postgres/PlaylistsSongService");
const PlaylistsongsValidator = require("./validator/playlistsong");

const init = async () => {
    const collaborationsService = new CollaborationsService();
    const albumsService = new AlbumsService();
    const songsService = new SongsService();
    const usersService = new UsersService();
    const authenticationsService = new AuthenticationsService();
    const playlistsService = new PlaylistsService(collaborationsService);
    const playlistsongsService = new PlaylistsongsService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ["*"],
            },
        },
    });

    // registrasi plugin eksternal
    await server.register([
        {
            plugin: Jwt,
        },
    ]);

    // mendefinisikan strategy otentikasi jwt
    server.auth.strategy("playlistsapp_jwt", "jwt", {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });

    await server.register([
        {
            plugin: albums,
            options: {
                service: albumsService,
                validator: AlbumsValidator,
            },
        },
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongsValidator,
            },
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator,
            },
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            },
        },
        {
            plugin: collaborations,
            options: {
                collaborationsService,
                playlistsService,
                validator: CollaborationsValidator,
            },
        },
        {
            plugin: playlists,
            options: {
                playlistsService,
                usersService,
                validator: PlaylistsValidator,
            },
        },
        {
            plugin: playlistsongs,
            options: {
                playlistsongsService,
                playlistsService,
                validator: PlaylistsongsValidator,
            },
        },
    ]);

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;
        if (response instanceof Error) {

            if (response instanceof NotFoundError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: 'Data tidak ditemukan',
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }

            if (response instanceof AuthorizationError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: 'Anda tidak berhak mengakses resource ini',
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }

            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: 'Gagal karena request tidak sesuai',
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }

            if (response instanceof AuthenticationError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: 'Anda dibatasi untuk mengakses resource ini',
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }

            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: 'Gagal karena refresh token tidak valid',
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }

            if (!response.isServer) {
                return h.continue;
            }

            const newResponse = h.response({
                status: 'error',
                message: 'terjadi kegagalan pada server kami',
            });

            console.log(response);
            console.log(response.message);

            newResponse.code(500);
            return newResponse;
        }
        return h.continue;
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
