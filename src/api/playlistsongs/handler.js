const autoBind = require('auto-bind');
const handleError = require("../../exceptions/handleError");

class PlaylistsongsHandler {
    constructor(playlistsongsService, playlistsService, validator) {
        this._playlistsongsService = playlistsongsService;
        this._playlistsService = playlistsService;
        this._validator = validator;
        autoBind(this); // mem-bind nilai this untuk seluruh method sekaligus
    }
    async postPlaylistsongHandler(request, h) {
        try {
            this._validator.validatePlaylistsongPayload(request.payload);
            const { id: credentialId } = request.auth.credentials;
            const { songId } = request.payload;
            const { id: playlistId } = request.params;
            await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
            const playlistsongId = await this._playlistsongsService.addPlaylistsong(songId, playlistId);
            const response = h.response({
                status: "success",
                message: "Lagu berhasil ditambahkan",
                data: { playlistsongId },
            });
            response.code(201);
            return response;
        } catch (error) {
            return handleError(error, h);
        }
    }
    async getPlaylistsongByIdHandler(request, h) {
        try {
            const { id: credentialId } = request.auth.credentials;
            const { id: playlistId } = request.params;
            await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
            const playlistsongs = await this._playlistsongsService.getPlaylistsongById(playlistId);
            const playlistsongsProps = playlistsongs.map((playlistsong) => ({
                id: playlistsong.id,
                title: playlistsong.title,
                performer: playlistsong.performer,
            }));
            return {
                status: "success",
                data: {
                    songs: playlistsongsProps,
                },
            };
        } catch (error) {
            return handleError(error, h);
        }
    }
    async deletePlaylistsongHandler(request, h) {
        try {
            this._validator.validatePlaylistsongPayload(request.payload);
            const { id: credentialId } = request.auth.credentials;
            const { songId } = request.payload;
            const { id: playlistId } = request.params;
            await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
            await this._playlistsongsService.deletePlaylistsong(songId, playlistId);
            return {
                status: "success",
                message: "Lagu berhasil dihapus",
            };
        } catch (error) {
            return handleError(error, h);
        }
    }
}

module.exports = PlaylistsongsHandler;
