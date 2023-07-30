const autoBind = require('auto-bind');
const handleError = require("../../exceptions/handleError");

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this); // mem-bind nilai this untuk seluruh method sekaligus
  }
  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const songId = await this._service.addSong(request.payload);
      const response = h.response({
        status: "success",
        message: "Lagu berhasil ditambahkan",
        data: { songId },
      });
      response.code(201);
      return response;
    } catch (error) {
      return handleError(error, h);
    }
  }
  async getSongsHandler(_request, h) {
    try {
      const songs = await this._service.getSongs();
      const songsProps = songs.map((song) => ({
        id: song.id,
        title: song.title,
        performer: song.performer,
      }));
      return {
        status: "success",
        data: { songs: songsProps },
      };
    } catch (error) {
      return handleError(error, h);
    }
  }
  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);
      return {
        status: "success",
        data: { song },
      };
    } catch (error) {
      return handleError(error, h);
    }
  }
  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { id } = request.params;
      await this._service.editSongById(id, request.payload);
      return {
        status: "success",
        message: "Lagu berhasil diperbarui",
      };
    } catch (error) {
      return handleError(error, h);
    }
  }
  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);
      return {
        status: "success",
        message: "Lagu berhasil dihapus",
      };
    } catch (error) {
      return handleError(error, h);
    }
  }
}

module.exports = SongsHandler;
