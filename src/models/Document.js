const BaseModel = require('./BaseModel');

class Document extends BaseModel {
    constructor() {
        super('documents');
    }

    async getByProject(projectId) {
        const query = `SELECT * FROM ${this.tableName} WHERE project_id = ? ORDER BY uploaded_at DESC`;
        const [rows] = await this.db.query(query, [projectId]);
        return rows;
    }

    async create(data) {
        const query = `INSERT INTO ${this.tableName} (project_id, title, file_path, file_type, size_kb) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await this.db.query(query, [
            data.project_id,
            data.title,
            data.file_path,
            data.file_type,
            data.size_kb
        ]);
        return { ...data, id: result.insertId };
    }
}

module.exports = new Document();
