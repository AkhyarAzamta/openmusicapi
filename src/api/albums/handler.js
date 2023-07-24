class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  // Handler untuk menambahkan album baru
  async postAlbumHandler(request, h) {
    // Validasi payload request
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;
    // Tambahkan album menggunakan service
    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil diperbarui',
      data: { albumId }
    });
    response.code(201);
    return response
  }

  // Handler untuk mendapatkan detail album berdasarkan ID
  async getAlbumByIdHandler(request, h) {
    const { albumId } = request.params;
    // Dapatkan lagu-lagu dari album menggunakan service
    const songs = await this._service.getSongByAlbumId(albumId);
    // Dapatkan detail album menggunakan service
    const album = await this._service.getAlbumById(albumId);

    // Tambahkan lagu-lagu ke dalam data album
    album["songs"] = songs;

    return {
      status: 'success',
      data: { album }
    };
  }

  // Handler untuk memperbarui album berdasarkan ID
  async updateAlbumByIdHandler(request, h) {
    // Validasi payload request
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;
    const { albumId } = request.params;

    // Update album menggunakan service
    await this._service.updateAlbumById(albumId, { name, year });

    return {
      status: 'success',
      message: 'Berhasil Memperbarui Album',
    };
  }

  // Handler untuk menghapus album berdasarkan ID
  async deleteAlbumByIdHandler(request, h) {
    const { albumId } = request.params;

    // Hapus album menggunakan service
    await this._service.deleteAlbumById(albumId);

    return {
      status: 'success',
      message: 'Berhasil Menghapus Album'
    }
  }
}

module.exports = AlbumsHandler;
