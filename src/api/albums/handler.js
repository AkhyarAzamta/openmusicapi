const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const albumId = await this._service.addAlbum({ name, year });
      const response = h.response({
        status: 'success',
        message: 'Album berhasil diperbarui',
        data: { albumId }
      });
      response.code(201);
      return response;
  }

  async getAlbumByIdHandler(request) {
      const { albumId } = request.params;
      const songs = await this._service.getSongByAlbumId(albumId);
      const album = await this._service.getAlbumById(albumId);
      album["songs"] = songs;

      return {
        status: 'success',
        data: { album }
      };
  }

  async updateAlbumByIdHandler(request) {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const { albumId } = request.params;
      await this._service.updateAlbumById(albumId, { name, year });
      return {
        status: 'success',
        message: 'Berhasil Memperbarui Album',
      };
  }

  async deleteAlbumByIdHandler(request) {
      const { albumId } = request.params;
      await this._service.deleteAlbumById(albumId);
      return {
        status: 'success',
        message: 'Berhasil Menghapus Album'
      }
  }
}

module.exports = AlbumsHandler;
