const { mapDBToAlbumSongService } = require('../../utils/index')
const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
      this._validator.validateAlbumPayload(request.payload);
      const { name = 'unknown', year } = request.payload;
      const albumId = await this._service.addAlbum({ name, year });
      const response = h.response({
        status: 'success',
        message: 'Album berhasil diperbarui',
        data: { albumId }
      });
      response.code(201);
      return response;
  }

  async getAlbumByIdHandler(request, h) {
    const {albumId} = request.params;
    const album = await this._service.getAlbumById(albumId);
    const resultAlbum = mapDBToAlbumSongService(album.album, album.songs);
    const response = h.response({
        status: 'success',
        data: {
            album: resultAlbum,
        },
    });
    return response;
  }

  async updateAlbumByIdHandler(request, h) {
    const albumValidated = this._validator.validateAlbumPayload(request.payload);
    const {albumId} = request.params;
    await this._service.updateAlbumById(albumId, albumValidated);
    const response = h.response({
        status: 'success',
        message: 'Album berhasil diperbarui',
    });
    return response;
  }

  async deleteAlbumByIdHandler(request, h) {
    const {albumId} = request.params;
    await this._service.deleteAlbumById(albumId);
    const response = h.response({
        status: 'success',
        message: 'Album berhasil dihapus',
    });
    return response;
  }
}

module.exports = AlbumsHandler;
