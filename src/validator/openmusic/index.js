const InvariantError = require('../../exceptions/InvariantError');
const { AlbumPayloadSchema, SongPayloadSchema } = require('./schema');

// Validator untuk data album
const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    // Validasi payload menggunakan AlbumPayloadSchema yang telah diimpor sebelumnya
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      // Jika terdapat error dalam validasi, lempar InvariantError dengan pesan error yang sesuai
      throw new InvariantError(validationResult.error.message);
    }
  }
}

// Validator untuk data lagu
const SongValidator = {
  validateSongPayload: (payload) => {
    // Validasi payload menggunakan SongPayloadSchema yang telah diimpor sebelumnya
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      // Jika terdapat error dalam validasi, lempar InvariantError dengan pesan error yang sesuai
      throw new InvariantError(validationResult.error.message);
    }
  }
}

// Export modul AlbumValidator dan SongValidator agar dapat digunakan di tempat lain
module.exports = { AlbumValidator, SongValidator };
