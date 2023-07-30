const autoBind = require('auto-bind');
const handleError = require("../../exceptions/handleError");

class CollaborationsHandler {
    constructor(collaborationsService, playlistsService, validator) {
        this._collaborationsService = collaborationsService;
        this._playlistsService = playlistsService;
        this._validator = validator;
        autoBind(this); // mem-bind nilai this untuk seluruh method sekaligus
    }
    async postCollaborationHandler(request, h) {
        try {
            this._validator.validateCollaborationPayload(request.payload);
            const { id: credentialId } = request.auth.credentials;
            const { playlistId, userId } = request.payload;
            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
            const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);
            const response = h.response({
                status: "success",
                message: "Kolaborasi berhasil ditambahkan",
                data: { collaborationId, },
            });
            response.code(201);
            return response;
        } catch (error) {
            return handleError(error, h);
        }
    }
    async deleteCollaborationHandler(request, h) {
        try {
            this._validator.validateCollaborationPayload(request.payload);
            const { id: credentialId } = request.auth.credentials;
            const { playlistId, userId } = request.payload;
            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
            await this._collaborationsService.deleteCollaboration(playlistId, userId);
            return {
                status: "success",
                message: "Kolaborasi berhasil dihapus",
            };
        } catch (error) {
            return handleError(error, h);
        }
    }
}

module.exports = CollaborationsHandler;
