const BaseModel = require('./BaseModel');

class User extends BaseModel {
    constructor() {
        super('users');
    }

    async create(name, email, passwordHash, role = 'admin', clientId = null) {
        const [result] = await this.db.query(
            `INSERT INTO ${this.tableName} (name, email, password_hash, role, client_id) VALUES (?, ?, ?, ?, ?)`,
            [name, email, passwordHash, role, clientId]
        );
        return result.insertId;
    }

    async findByEmail(email) {
        const [rows] = await this.db.query(`SELECT * FROM ${this.tableName} WHERE email = ?`, [email]);
        return rows[0];
    }

    async findById(id) {
        const [rows] = await this.db.query(
            `SELECT id, name, email, role, client_id, created_at FROM ${this.tableName} WHERE id = ?`,
            [id]
        );
        return rows[0];
    }
}

module.exports = new User();
