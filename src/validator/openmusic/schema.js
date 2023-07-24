const Joi = require('joi');

// Skema validasi untuk data album
const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(), // Mengharuskan field "name" berupa string dan wajib ada (required)
  year: Joi.number().required(), // Mengharuskan field "year" berupa angka dan wajib ada (required)
});

// Skema validasi untuk data lagu
const SongPayloadSchema = Joi.object({
  title: Joi.string().required(), // Mengharuskan field "title" berupa string dan wajib ada (required)
  year: Joi.number().required(), // Mengharuskan field "year" berupa angka dan wajib ada (required)
  genre: Joi.string().required(), // Mengharuskan field "genre" berupa string dan wajib ada (required)
  performer: Joi.string().required(), // Mengharuskan field "performer" berupa string dan wajib ada (required)
  duration: Joi.number(), // Field "duration" berupa angka, namun tidak wajib ada (opsional)
  albumId: Joi.string(), // Field "albumId" berupa string, namun tidak wajib ada (opsional)
});

// Export modul AlbumPayloadSchema dan SongPayloadSchema agar dapat digunakan di tempat lain
module.exports = { AlbumPayloadSchema, SongPayloadSchema };
