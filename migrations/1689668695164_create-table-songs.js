/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable("songs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "TEXT",
      notNull: true,
    },
    year: {
      type: "INT",
      notNull: true,
    },
    performer: {
      type: "TEXT",
      notNull: true,
    },
    genre: {
      type: "TEXT",
      notNull: false,
    },
    duration: {
      type: "INT",
      notNull: false,
    },
    inserted_at: {
      type: "TEXT",
      notNull: true,
    },
    updated_at: {
      type: "TEXT",
      notNull: true,
    },
    album_id: {
      type: 'varchar(30)',
      references: '"albums"',
      onDelete: 'cascade',
      onUpdate: 'cascade',
  },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("songs");
};
