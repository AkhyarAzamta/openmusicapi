const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const { mapDBToSongPlaylist } = require("../../utils");
// const NotFoundError = require("../../exceptions/NotFoundError");

class PlaylistsSongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylistsong(songId, playlistId) {
        const id = `playlistsong-${nanoid(16)}`;
        const query = {
            text: "INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id",
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError("Lagu gagal ditambahkan");
        }
        return result.rows[0].id;
    }

    async getPlaylistsongById(playlistId) {
        const queryPlaylist = {
            text: `SELECT playlists.id, playlists.name, users.username FROM playlists
            LEFT JOIN users on playlists.owner = users.id
            WHERE playlists.id = $1`,
            values: [playlistId],
        };
        const querySong = {
            text: `SELECT songs.id, songs.title, songs.performer FROM playlistsongs
            JOIN songs on playlistsongs.song_id = songs.id
            WHERE playlist_id = $1`,
            values: [playlistId],
        };

        const resultPlaylist = await this._pool.query(queryPlaylist);
        const resultSongs = await this._pool.query(querySong);

        return mapDBToSongPlaylist(resultPlaylist.rows[0], resultSongs.rows);
    }

    async deletePlaylistsong(songId, playlistId) {
        const query = {
            text: "DELETE FROM playlistsongs WHERE song_id = $1 AND playlist_id = $2 RETURNING id",
            values: [songId, playlistId],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new InvariantError("Lagu gagal dihapus");
        }
    }

    async verifyCollaborator(songId, playlistId) {
        const query = {
            text: "SELECT * FROM playlistsongs WHERE song_id = $1 AND playlist_id = $2",
            values: [songId, playlistId],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new InvariantError("Lagu gagal diverifikasi");
        }
    }
}

module.exports = PlaylistsSongsService;
