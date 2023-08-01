/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('collaborations', {
        id: {
            type: 'varchar(30)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'varchar(30)',
            references: '"playlists"',
            onDelete: 'cascade',
            onUpdate: 'cascade',
            unique: true,
        },
        user_id: {
            type: 'varchar(30)',
            references: '"users"',
            onDelete: 'cascade',
            onUpdate: 'cascade',
            unique: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('collaborations');
};