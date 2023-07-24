/* eslint-disable camelcase */

exports.up = pgm => {
  // Fungsi "up" ini akan dijalankan saat migrasi dijalankan untuk meng-upgrade database.
  // Fungsi ini bertanggung jawab untuk membuat tabel "songs" beserta kolom-kolomnya.
  pgm.createTable('songs', {
    // Kolom "id" sebagai primary key dengan tipe data VARCHAR(50).
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    // Kolom "title" dengan tipe data VARCHAR(255) dan wajib diisi (notNull: true).
    title: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    // Kolom "year" dengan tipe data integer dan wajib diisi (notNull: true).
    year: {
      type: 'integer',
      notNull: true,
    },
    // Kolom "performer" dengan tipe data VARCHAR(100) dan wajib diisi (notNull: true).
    performer: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    // Kolom "genre" dengan tipe data VARCHAR(50) dan wajib diisi (notNull: true).
    genre: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    // Kolom "duration" dengan tipe data integer dan opsional diisi (notNull: false).
    duration: {
      type: 'integer',
      notNull: false,
    },
    // Kolom "albumId" dengan tipe data VARCHAR(50), opsional diisi (notNull: false), dan memiliki nilai default "".
    albumId: {
      type: 'VARCHAR(50)',
      notNull: false,
      default: ""
    }
  });
};

exports.down = pgm => {
  // Fungsi "down" ini akan dijalankan saat migrasi dijalankan untuk meng-downgrade database.
  // Fungsi ini bertanggung jawab untuk menghapus tabel "songs" jika migrasi harus dibatalkan atau di-rollback.
  pgm.dropTable('songs');
};
