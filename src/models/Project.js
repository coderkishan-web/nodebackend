const BaseModel = require('./BaseModel');

class Project extends BaseModel {
    constructor() {
        super('projects');
    }

    async getAll() {
        const query = `
      SELECT p.*, c.name as client_name 
      FROM projects p 
      LEFT JOIN clients c ON p.client_id = c.id 
      ORDER BY p.created_at DESC
    `;
        const [rows] = await this.db.query(query);
        return rows;
    }

    async getByClientId(clientId) {
        const query = `SELECT * FROM ${this.tableName} WHERE client_id = ? ORDER BY created_at DESC`;
        const [rows] = await this.db.query(query, [clientId]);
        return rows;
    }

    async create(data) {
        const query = `INSERT INTO ${this.tableName} (client_id, title, description, status, start_date, end_date, budget) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await this.db.query(query, [
            data.client_id || null,
            data.title,
            data.description || null,
            data.status || 'Planning',
            data.start_date || null,
            data.end_date || null,
            data.budget || null
        ]);
        return { ...data, id: result.insertId };
    }

    async update(id, data) {
        const query = `UPDATE ${this.tableName} SET client_id=?, title=?, description=?, status=?, start_date=?, end_date=?, budget=? WHERE id=?`;
        await this.db.query(query, [
            data.client_id || null,
            data.title,
            data.description || null,
            data.status || 'Planning',
            data.start_date || null,
            data.end_date || null,
            data.budget || null,
            id
        ]);
        return { ...data, id };
    }
}

module.exports = new Project();
