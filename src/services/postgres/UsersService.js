const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { InvariantError, AuthenticationError } = require('../../exceptions/index');

class UsersService {
    constructor() {
        this._pool = new Pool();
    }

    async verifyNewUsername(username) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [ username ],
        };
        const { rowCount } = await this._pool.query(query);
        if (rowCount) {
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
        }
    }

    async addUser({ username, password, fullname }) {
        await this.verifyNewUsername(username);
        const id = `user-${nanoid(16)}`;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING user_id',
            values: [
                id, 
                username, 
                hashedPassword, 
                fullname
            ],
        };
        const { rows, rowCount } = await this._pool.query(query);
        if (!rowCount) {
            throw new InvariantError('User gagal ditambahkan');
        }
        return rows[0].user_id;
    }

    async verifyUserCredential(username, password) {
        const query = {
            text: 'SELECT user_id, password FROM users WHERE username = $1',
            values: [ username ],
        };
        const { rows, rowCount } = await this._pool.query(query);
        if (!rowCount) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah.');
        }
        const { user_id: id, password: hashedPassword } = rows[0];
        const match = await bcrypt.compare(password, hashedPassword);
        if (!match) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah.');
        }
        return id;
    }
}

module.exports = { UsersService };