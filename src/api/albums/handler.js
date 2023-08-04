class AlbumHandler {
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
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;
    const { id } = request.params;
    await this._service.editAlbumById(id, { name, year });
    return {
      status: 'success',
      message: 'Album berhasil diperbarui.',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus.',
    };
  }

  async postAlbumLikesByIdHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this._validator.validateAlbumLikesPayload({ albumId, userId });
    await this._service.searchAlbumById(albumId);

    const like = await this._service.searchAlbumLikeById(albumId, userId);

    if (!like) {
      await this._service.addAlbumLike(albumId, userId);
      const response = h.response({
        status: 'success',
        message: 'Berhasil menyukai album.',
      });
      response.code(201);
      return response;
    }

    await this._service.deleteAlbumLike(albumId, userId);
    const response = h.response({
      status: 'success',
      message: 'Berhasil membatalkan menyukai album.',
    });
    response.code(201);
    return response;
  }

  async getAlbumLikesByIdHandler(request, h) {
    const { id: albumId } = request.params;
    await this._service.searchAlbumById(albumId);
    const { isCache, likeCount } = await this._service.getAlbumLikesById(albumId);
    const response = h.response({
      status: 'success',
      data: {
        likes: likeCount,
      },
    });
    if (isCache) {
      response.header('X-Data-Source', 'cache');
    }
    return response;
  }
}

module.exports = AlbumHandler;