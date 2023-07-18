/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('songs', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      title: {
        type: 'VARCHAR(255)',
        notNull: true,
      },
      year: {
        type: 'integer',
        notNull: true,
      },
      performer: {
        type: 'VARCHAR(100)',
        notNull: true,
      },
      genre: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      duration: {
        type: 'integer',
        notNull: false,
      },
      albumId: {
        type: 'VARCHAR(50)',
        notNull: false,
        default: ""
      }
    });
  };
  
  exports.down = pgm => {
    pgm.dropTable('songs');
  };
  