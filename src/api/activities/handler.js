class ActivitiesHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
    }

    async getActivitiesByIdHandler(request) {
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;
        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        const activities = await this._service.getActivitiesById(playlistId);
        return {
            status: 'success',
            data: {
                playlistId,
                activities,
            },
        };
    }
}

module.exports = ActivitiesHandler;