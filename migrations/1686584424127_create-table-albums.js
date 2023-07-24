// eslint-disable-next-line camelcase
/* eslint-disable camelcase */

// Ekspor fungsi 'up' yang digunakan untuk mendefinisikan migrasi ke atas
exports.up = pgm => {
  // Membuat tabel 'albums'
  pgm.createTable('albums', {
    // Kolom 'id' dengan tipe VARCHAR(50) sebagai primary key
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    // Kolom 'name' dengan tipe VARCHAR(255) dan tidak boleh null (notNull: true)
    name: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    // Kolom 'year' dengan tipe integer dan tidak boleh null (notNull: true)
    year: {
      type: 'integer',
      notNull: true,
    },
  });
};

// Ekspor fungsi 'down' yang digunakan untuk mendefinisikan migrasi ke bawah
exports.down = pgm => {
  // Menghapus tabel 'albums'
  pgm.droptTable('albums'); // Teks 'droptTable' seharusnya 'dropTable', kemungkinan ada kesalahan ketik
};
