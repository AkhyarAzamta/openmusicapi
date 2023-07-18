const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');


class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = nanoid(16);
    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, year, performer, genre, duration, albumId],
    }

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query("SELECT id, title, performer FROM songs");
    return result.rows;
  }

  async searchSongByTitle(value) {
    const query = {
      text: "SELECT id, title, performer FROM songs WHERE title ILIKE '%' || $1 || '%'",
      values: [value]
    }

    const result = await this._pool.query(query);
    return result.rows;

  }

  async searchSongByPerformer(value) {
    const query = {
      text: "SELECT id, title, performer FROM songs WHERE performer ILIKE '%' || $1 || '%'",
      values: [value]
    }

    const result = await this._pool.query(query);
    return result.rows;
  }

  async searchSongByTitleAndPerformer(title, performer) {
    const query = {
      text: "SELECT id, title, performer FROM songs WHERE title ILIKE '%' || $1 || '%' AND performer ILIKE '%' || $2 || '%'",
      values: [title, performer]
    }

    const result = await this._pool.query(query);
    return result.rows;

  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan')
    }

    return result.rows[0];
  }

  async updateSongById(id, { title, year, performer, genre, duration, albumId }) {
    const query = {
      text: "UPDATE songs SET title=$1, year=$2, performer=$3, genre=$4, duration=$5, \"albumId\"= $6 WHERE id=$7 RETURNING id",
      values: [title, year, performer, genre, duration, albumId, id],
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui Lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongService;
