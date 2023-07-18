class SongsHandler {

  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { title, year, performer, genre, duration = 0, albumId = "" } = request.payload;
    const songId = await this._service.addSong({ title, year, performer, genre, duration, albumId });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dibuat',
      data: {
        songId,
      }
    });
    response.code(201);
    return response
  }

  async getSongsHandler(request, h) {
    const query = request.query;
    let songs;

    if ('title' in query && 'performer' in query) {
      songs = await this._service.searchSongByTitleAndPerformer(query['title'], query['performer']);
    }
    else if ('title' in query) {
      songs = await this._service.searchSongByTitle(query['title']);
    }
    else if ('performer' in query) {
      songs = await this._service.searchSongByPerformer(query['performer']);
    }
    else {
      songs = await this._service.getSongs();
    }

    return {
      status: 'success',
      data: {
        songs,
      }
    }
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;

    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: {
        song,
      }
    };
  }

  async updateSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { title, year, performer, genre, duration = 0, albumId = "" } = request.payload;
    const { id } = request.params;

    await this._service.updateSongById(id, { title, year, performer, genre, duration, albumId });

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus'
    }
  }
}

module.exports = SongsHandler;
