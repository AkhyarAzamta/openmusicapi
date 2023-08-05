const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { mapAlbumDBToModel } = require('../../utils');
const {InvariantError, NotFoundError} = require('../../exceptions/index');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async getAlbumById(albumId) {
    const queryAlbum = {
      text: 'SELECT * FROM albums WHERE album_id = $1;',
      values: [ albumId ],
    };
    const { rows, rowCount } = await this._pool.query(queryAlbum);
    if (!rowCount) {
      throw new NotFoundError('Album tidak ditemukan.');
    }
    const querySongs = {
      text: 'SELECT s.id as id, s.title, s.performer FROM songs s LEFT JOIN albums a ON s.album_id = a.album_id WHERE s.album_id = $1;',
      values: [ albumId ],
    };
    const resultSongsInAlbum = await this._pool.query(querySongs);
    if (!resultSongsInAlbum.rows.length) {
      return { ...rows.map(mapAlbumDBToModel)[0], songs: [] };
    }
    return { ...rows.map(mapAlbumDBToModel)[0], songs: resultSongsInAlbum.rows };
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING album_id',
      values: [
        id, 
        name, 
        year
      ],
    };
    const { rows } = await this._pool.query(query);
    if (!rows[0].album_id) {
      throw new InvariantError('Album gagal ditambahkan.');
    }
    return rows[0].album_id;
  }

  async deleteAlbumById( albumId ) {
    const query = {
      text: 'DELETE FROM albums WHERE album_id = $1 RETURNING album_id',
      values: [ albumId ],
    };
    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan.');
    }
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE album_id = $3 RETURNING album_id',
      values: [
        name, 
        year, 
        id
      ],
    };
    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan.');
    }
  }

}

module.exports = { AlbumsService };