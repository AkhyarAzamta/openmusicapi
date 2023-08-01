/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('playlistsongs', {
        id: {
            type: 'varchar(30)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'varchar(30)',
            references: '"playlists"',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
        song_id: {
            type: 'varchar(30)',
            references: '"songs"',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('playlistsongs');
};