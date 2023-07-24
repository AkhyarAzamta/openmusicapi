const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  constructor(message) {
    // Konstruktor untuk kelas InvariantError. Menerima pesan error sebagai argumen.
    super(message); // Memanggil konstruktor dari kelas induk (ClientError) dengan pesan error yang diberikan
    this.name = 'InvariantError'; // Menyimpan nama error sebagai 'InvariantError' pada instance
  }
}

module.exports = InvariantError;
