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
    pgm.addConstraint("playlistsongs", "unique_playlist_id_and_song_id", "UNIQUE(playlist_id, song_id)");
    pgm.addConstraint("playlistsongs", "fk_playlistsongs.playlist_id_playlists.id", "FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE");
    pgm.addConstraint("playlistsongs", "fk_playlistsongs.song_id_songs.id", "FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE");
};



exports.down = (pgm) => {
    pgm.dropTable('playlistsongs');
};