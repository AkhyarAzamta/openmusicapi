exports.up = (pgm) => {
    pgm.createTable('playlist_songs', {
        playlistsongs_id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'playlists',
            onDelete: 'CASCADE',
        },
        id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'songs',
            onDelete: 'CASCADE',
        },
    });

    pgm.addConstraint('playlist_songs', 'unique_playlist_id_and_song_id', 'UNIQUE(playlist_id, id)');
};

exports.down = (pgm) => {
    pgm.dropTable('playlist_songs');
};