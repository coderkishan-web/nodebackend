const BaseModel = require('./BaseModel');

class Requirement extends BaseModel {
    constructor() {
        super('requirements');
    }

    async getByProjectId(projectId) {
        const query = `SELECT * FROM ${this.tableName} WHERE project_id = ? ORDER BY id ASC`;
        const [rows] = await this.db.query(query, [projectId]);
        return rows;
    }

    async create(data) {
        const query = `INSERT INTO ${this.tableName} (project_id, description, type, status) VALUES (?, ?, ?, ?)`;
        const [result] = await this.db.query(query, [
            data.project_id,
            data.description,
            data.type || 'In-Scope',
            data.status || 'Pending'
        ]);
        return { ...data, id: result.insertId };
    }

    async update(id, data) {
        const query = `UPDATE ${this.tableName} SET project_id=?, description=?, type=?, status=? WHERE id=?`;
        await this.db.query(query, [
            data.project_id,
            data.description,
            data.type,
            data.status,
            id
        ]);
        return { ...data, id };
    }
}

module.exports = new Requirement();
