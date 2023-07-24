class ClientError extends Error {
  constructor(message, statusCode = 400) {
    // Konstruktor untuk kelas ClientError. Menerima pesan error dan kode status HTTP sebagai argumen (default: 400 - Bad Request)
    super(message); // Memanggil konstruktor dari kelas induk (Error) dengan pesan error yang diberikan
    this.statusCode = statusCode; // Menyimpan kode status HTTP yang diberikan sebagai properti statusCode pada instance
    this.name = 'ClientError'; // Menyimpan nama error sebagai 'ClientError' pada instance
  }
}

module.exports = ClientError;
