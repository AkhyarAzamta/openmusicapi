class SongsHandler {

  constructor(service, validator) {
    this._service = service; // Inisialisasi service yang digunakan untuk berinteraksi dengan data lagu
    this._validator = validator; // Inisialisasi validator yang digunakan untuk validasi payload request
  }

  // Handler untuk menambahkan lagu baru
  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload); // Validasi payload request menggunakan validator

    // Tambahkan lagu menggunakan service dengan data dari request payload
    const songId = await this._service.addSong(request.payload);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dibuat',
      data: { songId }
    });
    response.code(201); // Set kode status response ke 201 (Created)
    return response;
  }

  // Handler untuk mendapatkan daftar lagu berdasarkan query
  async getSongsHandler(request, h) {
    const query = request.query;
    let songs;

    // Cek apakah terdapat query 'title' dan 'performer' pada request
    if ('title' in query && 'performer' in query) {
      songs = await this._service.searchSongByTitleAndPerformer(query['title'], query['performer']);
    }
    else if ('title' in query) {
      // Jika hanya terdapat query 'title'
      songs = await this._service.searchSongByTitle(query['title']);
    }
    else if ('performer' in query) {
      // Jika hanya terdapat query 'performer'
      songs = await this._service.searchSongByPerformer(query['performer']);
    }
    else {
      // Jika tidak terdapat query, ambil semua lagu
      songs = await this._service.getSongs();
    }

    return {
      status: 'success',
      data: { songs }
    };
  }

  // Handler untuk mendapatkan detail lagu berdasarkan ID
  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: { song }
    };
  }

  // Handler untuk memperbarui lagu berdasarkan ID
  async updateSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload); // Validasi payload request menggunakan validator
    const { title, year, performer, genre, duration = 0, albumId = "" } = request.payload;
    const { id } = request.params;

    // Update lagu menggunakan service dengan data dari request payload
    await this._service.updateSongById(id, 
      { 
        title, 
        year, 
        performer, 
        genre, 
        duration, 
        albumId 
      }
    );

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  // Handler untuk menghapus lagu berdasarkan ID
  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    // Hapus lagu menggunakan service berdasarkan ID
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus'
    };
  }
}

module.exports = SongsHandler;
