const Joi = require('joi');
const currentYear = new Date().getFullYear();

const AlbumPayloadSchema = Joi.object({
    name: Joi.string().max(50).required(),
    year: Joi.number().integer().min(1900).max(currentYear).required(),
    cover: Joi.string(),
});


module.exports = { AlbumPayloadSchema };