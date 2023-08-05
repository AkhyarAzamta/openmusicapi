const Joi = require('joi');

const PlaylistSongPayloadSchema = Joi.object({
    songId: Joi.string().max(50).required(),
});

const PlaylistPayloadSchema = Joi.object({
    name: Joi.string().required(),
});

module.exports = { 
    PlaylistSongPayloadSchema,
    PlaylistPayloadSchema, 
};