const handleError = require("../../exceptions/handleError");

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.updateAlbumByIdHandler = this.updateAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
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
      
    } catch (error) {
      return handleError(error, h);
    }
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const { albumId } = request.params;
      const songs = await this._service.getSongByAlbumId(albumId);
      const album = await this._service.getAlbumById(albumId);
      album["songs"] = songs;

      return {
        status: 'success',
        data: { album }
      };
      
    } catch (error) {
      return handleError(error, h);
    }
  }

  async updateAlbumByIdHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const { albumId } = request.params;
      await this._service.updateAlbumById(albumId, { name, year });

      return {
        status: 'success',
        message: 'Berhasil Memperbarui Album',
      };
      
    } catch (error) {
      return handleError(error, h);
    }
  }

  async deleteAlbumByIdHandler(request, h) {
    try {
      const { albumId } = request.params;
      await this._service.deleteAlbumById(albumId);

      return {
        status: 'success',
        message: 'Berhasil Menghapus Album'
      }
      
    } catch (error) {
      return handleError(error, h);
    }
  }
}

module.exports = AlbumsHandler;
