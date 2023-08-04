class PlaylistsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
    }

    async postPlaylistHandler(request, h) {
        this._validator.validatePlaylistPayload(request.payload);
        const { name } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        const playlistId = await this._service.addPlaylist({
            name,
            owner: credentialId,
        });

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan.',
            data: {
                playlistId,
            },
        });
        response.code(201);
        return response;
    }

    async postPlaylistSongByIdHandler(request, h) {
        this._validator.validatePlaylistSongPayload(request.payload);
        const { songId } = request.payload;
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        await this._service.checkSongId(songId);
        await this._service.addPlaylistSongById(playlistId, songId);

        // add to playlist activity
        const time = new Date().toISOString();
        await this._service.addToActivity(playlistId, songId, credentialId, 'add', time);

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan.',
        });
        response.code(201);
        return response;
    }

    async getAllPlaylistsHandler(request) {
        const { id: credentialId } = request.auth.credentials;
        const playlists = await this._service.getAllPlaylists(credentialId);
        return {
            status: 'success',
            data: { playlists },
        };
    }

    async getPlaylistSongsByIdHandler(request) {
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        const playlist = await this._service.getPlaylistSongsById(playlistId);
        return {
            status: 'success',
            data: { playlist },
        };
    }

    async deletePlaylistByIdHandler(request) {
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistOwner(playlistId, credentialId);
        await this._service.deletePlaylist(playlistId);
        return {
            status: 'success',
            message: 'Playlist berhasil dihapus.',
        };
    }

    async deletePlaylistSongByIdHandler(request) {
        this._validator.validatePlaylistSongPayload(request.payload);
        const { songId } = request.payload;
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        await this._service.deletePlaylistSongById(playlistId, songId);

        // add to playlist activity
        const time = new Date().toISOString();
        await this._service.addToActivity(playlistId, songId, credentialId, 'delete', time);

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus dari playlist.',
        };
    }
}

module.exports = PlaylistsHandler;