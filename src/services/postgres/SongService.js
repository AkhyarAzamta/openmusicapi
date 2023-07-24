const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongService {
  constructor() {
    // Konstruktor kelas SongService.
    // Inisialisasi koneksi database pool menggunakan PostgreSQL dengan bantuan 'pg' library
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    // Method untuk menambahkan lagu baru ke database.
    // Menggunakan nanoid untuk menghasilkan id unik dengan panjang 16 karakter
    const id = nanoid(16);
    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [
        id, 
        title, 
        year, 
        performer, 
        genre, 
        duration, 
        albumId
      ],
    };

    // Menjalankan query untuk menambahkan lagu baru ke database menggunakan koneksi pool
    const result = await this._pool.query(query);

    // Jika id lagu tidak berhasil dihasilkan, lempar InvariantError
    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    // Mengembalikan id lagu yang berhasil ditambahkan
    return result.rows[0].id;
  }

  async getSongs() {
    // Method untuk mendapatkan daftar semua lagu dari database
    const result = await this._pool.query("SELECT id, title, performer FROM songs");
    return result.rows;
  }

  async searchSongByTitle(value) {
    // Method untuk mencari lagu berdasarkan judul (title) dari database
    const query = {
      text: "SELECT id, title, performer FROM songs WHERE title ILIKE '%' || $1 || '%'",
      values: [value]
    };

    // Menjalankan query untuk mencari lagu berdasarkan judul menggunakan koneksi pool
    const result = await this._pool.query(query);
    return result.rows;
  }

  async searchSongByPerformer(value) {
    // Method untuk mencari lagu berdasarkan penyanyi (performer) dari database
    const query = {
      text: "SELECT id, title, performer FROM songs WHERE performer ILIKE '%' || $1 || '%'",
      values: [value]
    };

    // Menjalankan query untuk mencari lagu berdasarkan penyanyi menggunakan koneksi pool
    const result = await this._pool.query(query);
    return result.rows;
  }

  async searchSongByTitleAndPerformer(title, performer) {
    // Method untuk mencari lagu berdasarkan judul (title) dan penyanyi (performer) dari database
    const query = {
      text: "SELECT id, title, performer FROM songs WHERE title ILIKE '%' || $1 || '%' AND performer ILIKE '%' || $2 || '%'",
      values: [
        title, 
        performer
      ]
    };

    // Menjalankan query untuk mencari lagu berdasarkan judul dan penyanyi menggunakan koneksi pool
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(id) {
    // Method untuk mendapatkan detail lagu berdasarkan id dari database
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };

    // Menjalankan query untuk mendapatkan detail lagu berdasarkan id menggunakan koneksi pool
    const result = await this._pool.query(query);

    // Jika lagu dengan id yang diberikan tidak ditemukan (result.rows.length = 0), lempar NotFoundError
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan')
    }

    // Mengembalikan hasil query berupa detail lagu
    return result.rows[0];
  }

  async updateSongById(id, { title, year, performer, genre, duration, albumId }) {
    // Method untuk memperbarui detail lagu berdasarkan id di database
    const query = {
      text: "UPDATE songs SET title=$1, year=$2, performer=$3, genre=$4, duration=$5, \"albumId\"= $6 WHERE id=$7 RETURNING id",
      values: [
        title, 
        year, 
        performer, 
        genre, 
        duration, 
        albumId, 
        id
      ],
    };

    // Menjalankan query untuk memperbarui detail lagu berdasarkan id menggunakan koneksi pool
    const result = await this._pool.query(query);

    // Jika lagu dengan id yang diberikan tidak ditemukan (result.rows.length = 0), lempar NotFoundError
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui Lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    // Method untuk menghapus lagu berdasarkan id dari database
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    // Menjalankan query untuk menghapus lagu berdasarkan id menggunakan koneksi pool
    const result = await this._pool.query(query);

    // Jika lagu dengan id yang diberikan tidak ditemukan (result.rows.length = 0), lempar NotFoundError
    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongService;
