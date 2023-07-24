const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumService {
  constructor() {
    // Konstruktor kelas AlbumService.
    // Inisialisasi koneksi database pool menggunakan PostgreSQL dengan bantuan 'pg' library
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    // Method untuk menambahkan album baru ke database.
    // Menggunakan nanoid untuk menghasilkan id unik dengan panjang 16 karakter
    const id = nanoid(16);
    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3) RETURNING id",
      values: [id, name, year],
    };

    // Menjalankan query untuk menambahkan album baru ke database menggunakan koneksi pool
    const result = await this._pool.query(query);

    // Jika id album tidak berhasil dihasilkan, lempar InvariantError
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    // Mengembalikan id album yang berhasil ditambahkan
    return result.rows[0].id;
  }

  async getSongByAlbumId(id) {
    // Method untuk mendapatkan daftar lagu berdasarkan id album dari database
    const query = {
      text: "SELECT id, title, performer FROM songs WHERE \"albumId\"=$1",
      values: [id],
    };

    // Menjalankan query untuk mendapatkan daftar lagu berdasarkan id album menggunakan koneksi pool
    const result = await this._pool.query(query);

    // Mengembalikan hasil query berupa array daftar lagu
    return result.rows;
  }

  async getAlbumById(id) {
    // Method untuk mendapatkan detail album berdasarkan id dari database
    const query = {
      text: "SELECT * FROM albums WHERE id=$1",
      values: [id],
    };

    // Menjalankan query untuk mendapatkan detail album berdasarkan id menggunakan koneksi pool
    const result = await this._pool.query(query);

    // Jika album tidak ditemukan (result.rows.length = 0), lempar NotFoundError
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    // Mengembalikan hasil query berupa detail album
    return result.rows[0];
  }

  async updateAlbumById(id, { name, year }) {
    // Method untuk memperbarui detail album berdasarkan id di database
    const query = {
      text: "UPDATE albums SET name=$1, year=$2 WHERE id=$3 RETURNING id",
      values: [name, year, id],
    };

    // Menjalankan query untuk memperbarui detail album berdasarkan id menggunakan koneksi pool
    const result = await this._pool.query(query);

    // Jika album dengan id yang diberikan tidak ditemukan (result.rows.length = 0), lempar NotFoundError
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    // Method untuk menghapus album berdasarkan id dari database
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    // Menjalankan query untuk menghapus album berdasarkan id menggunakan koneksi pool
    const result = await this._pool.query(query);

    // Jika album dengan id yang diberikan tidak ditemukan (result.rows.length = 0), lempar NotFoundError
    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumService;
