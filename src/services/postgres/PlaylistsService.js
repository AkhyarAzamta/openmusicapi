const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const { mapDBToModel } = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistsService {
    constructor(collaborationService) {
        this._pool = new Pool();
        this._collaborationService = collaborationService;
    }

    async addPlaylist({
        name, owner,
    }) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError("Playlist gagal ditambahkan");
        }

        return result.rows[0].id;
    }

    async getPlaylists(owner) {
        const query = {
            text: `SELECT playlists.*, users.username FROM playlists
            LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
            LEFT JOIN users ON playlists.owner = users.id
            WHERE playlists.owner = $1 OR collaborations.user_id = $1
            GROUP BY playlists.id, users.username`,
            values: [owner],
        };

        const result = await this._pool.query(query);
        return result.rows.map(mapDBToModel);
    }

    async getPlaylistById(id) {
        const query = {
            text: `SELECT playlists.*, users.username
            FROM playlists
            LEFT JOIN users ON users.id = playlists.owner
            WHERE playlists.id = $1`,
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("Playlist tidak ditemukan");
        }

        return result.rows.map(mapDBToModel)[0];
    }

    async editPlaylistById(id, {
        title, year, performer, genre, duration,
    }) {
        const updatedAt = new Date().toISOString();
        const query = {
            text: "UPDATE playlists SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id",
            values: [title, year, performer, genre, duration, updatedAt, id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("Gagal memperbarui lagu. Id tidak ditemukan");
        }
    }

    async deletePlaylistById(id) {
        const query = {
            text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("Playlist gagal dihapus. Id tidak ditemukan");
        }
    }

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: "SELECT * FROM playlists WHERE id = $1",
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError("Playlist tidak ditemukan");
        }
        const playlist = result.rows[0];
        if (playlist.owner !== owner) {
            throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            try {
                await this._collaborationService.verifyCollaborator(playlistId, userId);
            } catch {
                throw error;
            }
        }
    }
}

module.exports = PlaylistsService;
