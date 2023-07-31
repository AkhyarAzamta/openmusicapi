// eslint-disable-next-line camelcase
/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    year: {
      type: 'integer',
      notNull: true,
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('albums'); 
};
