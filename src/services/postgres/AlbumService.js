const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const albumId = 'album-' + nanoid(16);
    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3) RETURNING id",
      values: [albumId, name, year],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSongByAlbumId(albumId) {
    const query = {
      text: "SELECT id, title, performer FROM songs WHERE albumId = $1",
      values: [albumId],
    };
    const result = await this._pool.query(query);
    // console.log(result.rowCount)
    return result.rows;
  }

  async getAlbumById(albumId) {
    const queryAlbum = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
  };
  const resultAlbum = await this._pool.query(queryAlbum);
  if (!resultAlbum.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
  }
  const querySong = {
      text: 'SELECT * FROM songs WHERE "album_id" = $1',
      values: [albumId],
  };
  const resultSong = await this._pool.query(querySong);
  console.log(resultAlbum)
  
  return {album: resultAlbum.rows[0], songs: resultSong.rows};
  }

  async updateAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE albums SET name=$1, year=$2 WHERE id=$3 RETURNING id",
      values: [name, year, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumService;
