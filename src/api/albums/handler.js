class AlbumsHandler {

  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil dibuat',
      data: {
        albumId,
      }
    });
    response.code(201);
    return response
  }

  async getAlbumByIdHandler(request, h) {
    const { albumId } = request.params;

    const album = await this._service.getAlbumById(albumId);
    const songs = await this._service.getSongByAlbumId(albumId);

    album["songs"] = songs;

    return {
      status: 'success',
      data: {
        album,
      }
    };
  }

  async updateAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;
    const { albumId } = request.params;

    await this._service.updateAlbumById(albumId, { name, year });

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request, h) {
    const { albumId } = request.params;

    await this._service.deleteAlbumById(albumId);

    return {
      status: 'success',
      message: 'Album berhasil dihapus'
    }
  }
}

module.exports = AlbumsHandler;
