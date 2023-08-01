const autoBind = require('auto-bind');

class PlaylistsongsHandler {
    constructor(playlistsongsService, playlistsService, validator) {
        this._playlistsongsService = playlistsongsService;
        this._playlistsService = playlistsService;
        this._validator = validator;
        autoBind(this); 
    }
    async postPlaylistsongHandler(request, h) {
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
        }
    async getPlaylistsongByIdHandler(request) {
        const { id: credentialId } = request.auth.credentials;
        const { id: playlistId } = request.params;
        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
        const playlistsongs = await this._playlistsongsService.getPlaylistsongById(playlistId);
            // const playlistsongsProps = playlistsongs.map((playlistsong) => ({
            //     id: playlistsong.id,
            //     title: playlistsong.title,
            //     performer: playlistsong.performer,
            // }));
            return {
                status: "success",
                data: playlistsongs,
            };
        }
    async deletePlaylistsongHandler(request) {
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
    }
}

module.exports = PlaylistsongsHandler;
