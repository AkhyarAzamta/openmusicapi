const autoBind = require('auto-bind');
const handleError = require("../../exceptions/handleError");

class PlaylistsHandler {
    constructor(playlistsService, usersService, validator) {
        this._playlistsService = playlistsService;
        this._validator = validator;
        this._usersService = usersService;
        autoBind(this); // mem-bind nilai this untuk seluruh method sekaligus
    }
    async postPlaylistHandler(request, h) {
        try {
            this._validator.validatePlaylistPayload(request.payload);
            const { name } = request.payload;
            const { id: credentialId } = request.auth.credentials;
            const playlistId = await this._playlistsService.addPlaylist({
                name,
                owner: credentialId,
            });
            const response = h.response({
                status: "success",
                message: "Playlist berhasil ditambahkan",
                data: { playlistId },
            });
            response.code(201);
            return response;
        } catch (error) {
            return handleError(error, h);
        }
    }
    async getPlaylistsHandler(request, h) {
        try {
            const { id: credentialId } = request.auth.credentials;
            const playlists = await this._playlistsService.getPlaylists(credentialId);
            const playlistsProps = playlists.map((playlist) => ({
                id: playlist.id,
                name: playlist.name,
                username: playlist.username,
            }));

            return {
                status: "success",
                data: { playlists: playlistsProps },
            };
        } catch (error) {
            return handleError(error, h);
        }
    }
    async getPlaylistByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;
            await this._playlistsService.verifyPlaylistAccess(id, credentialId);
            const playlist = await this._playlistsService.getPlaylistById(id);
            return {
                status: "success",
                data: { playlist },
            };
        } catch (error) {
            return handleError(error, h);
        }
    }
    async putPlaylistByIdHandler(request, h) {
        try {
            this._validator.validatePlaylistPayload(request.payload);
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;
            await this._playlistsService.verifyPlaylistAccess(id, credentialId);
            await this._playlistsService.editPlaylistById(id, request.payload);
            return {
                status: "success",
                message: "Playlist berhasil diperbarui",
            };
        } catch (error) {
            return handleError(error, h);
        }
    }
    async deletePlaylistByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;
            await this._playlistsService.verifyPlaylistOwner(id, credentialId);
            await this._playlistsService.deletePlaylistById(id);
            return {
                status: "success",
                message: "Playlist berhasil dihapus",
            };
        } catch (error) {
            return handleError(error, h);
        }
    }
}

module.exports = PlaylistsHandler;
