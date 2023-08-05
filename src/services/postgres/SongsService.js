const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { mapSongsDBToModel } = require('../../utils');
const { InvariantError, NotFoundError } = require('../../exceptions/index');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongs(title = '', performer = '') {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2',
      values: [`%${title}%`, `%${performer}%`],
    };
    const { rows } = await this._pool.query(query);
    return rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [ id ],
    };
    const { rows, rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return rows.map(mapSongsDBToModel)[0];
  }

  async addSong({
    title, 
    year, 
    genre, 
    performer, 
    duration, 
    albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [
        id, 
        title, 
        year, 
        genre, 
        performer, 
        duration, 
        albumId
      ],
    };
    const { rows } = await this._pool.query(query);
    if (!rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan.');
    }
    return rows[0].id;
  }

  async editSongById(id, {
    title, 
    year, 
    genre, 
    performer, 
    duration, 
    albumId,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [
        title, 
        year, 
        genre, 
        performer, 
        duration, 
        albumId, 
        id
      ],
    };
    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan.');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [ id ],
    };
    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }

}

module.exports = { SongsService };