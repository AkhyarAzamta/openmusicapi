const ClientError = require('./ClientError');

class NotFoundError extends ClientError {
  constructor(message) {
    // Konstruktor untuk kelas NotFoundError. Menerima pesan error sebagai argumen.
    // Menjalankan konstruktor dari kelas induk (ClientError) dengan pesan error dan kode status 404 (Not Found) yang diberikan
    super(message, 404);
    this.name = 'NotFoundError'; // Menyimpan nama error sebagai 'NotFoundError' pada instance
  }
}

module.exports = NotFoundError;
