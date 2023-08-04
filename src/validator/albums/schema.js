const Joi = require('joi');

const currentYear = new Date().getFullYear();

const AlbumPayloadSchema = Joi.object({
    name: Joi.string().max(50).required(),
    year: Joi.number().integer().min(1900).max(currentYear)
        .required(),
    cover: Joi.string(),
});

const AlbumLikesPayloadSchema = Joi.object({
    albumId: Joi.string().max(50).required(),
    userId: Joi.string().max(50).required(),
});

module.exports = { AlbumPayloadSchema, AlbumLikesPayloadSchema };