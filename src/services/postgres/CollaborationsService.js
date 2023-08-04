const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CollaborationsService {
    constructor() {
        this._pool = new Pool();
    }

    async addCollaboration(playlistId, userId) {
        const id = `collab-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, userId],
        };
        const { rows, rowCount } = await this._pool.query(query);

        if (!rowCount) {
            throw new InvariantError('Kolaborasi gagal ditambahkan.');
        }

        return rows[0].id;
    }

    async deleteCollaboration(playlistId, userId) {
        const query = {
            text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
            values: [playlistId, userId],
        };
        const { rows, rowCount } = await this._pool.query(query);

        if (!rowCount) {
            throw new InvariantError('Kolaborasi gagal dihapus.');
        }

        return rows[0].id;
    }

    async verifyCollaborator(playlistId, userId) {
        const query = {
            text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
            values: [playlistId, userId],
        };
        const { rows, rowCount } = await this._pool.query(query);

        if (!rowCount) {
            throw new InvariantError('Kolaborasi gagal diverifikasi.');
        }

        return rows[0].id;
    }

    async validateCollaboratorId(userId) {
        const query = {
            text: 'SELECT username from users WHERE user_id = $1',
            values: [userId],
        };
        const { rowCount } = await this._pool.query(query);

        if (!rowCount) {
            throw new NotFoundError('Kolaborasi gagal ditambahkan. Id user tidak ditemukan.');
        }
    }
}

module.exports = { CollaborationsService };