const db = require('../config/db');

class BaseModel {
    constructor(tableName) {
        this.tableName = tableName;
        this.db = db;
    }

    async getAll() {
        const [rows] = await this.db.query(`SELECT * FROM ${this.tableName}`);
        return rows;
    }

    async getById(id) {
        const [rows] = await this.db.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
        return rows[0];
    }

    async delete(id) {
        const [result] = await this.db.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = BaseModel;
