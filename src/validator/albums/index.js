const InvariantError = require('../../exceptions/InvariantError');
const { AlbumPayloadSchema, AlbumLikesPayloadSchema } = require('./schema');

const AlbumsValidator = {
    validateAlbumPayload: (payload) => {
        const validationResult = AlbumPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },

    validateAlbumLikesPayload: (payload) => {
        const validationResult = AlbumLikesPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = { AlbumsValidator };