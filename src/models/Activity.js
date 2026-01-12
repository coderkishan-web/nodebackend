const BaseModel = require('./BaseModel');

class Activity extends BaseModel {
    constructor() {
        super('activity_log');
    }

    async getByProject(projectId) {
        const query = `
      SELECT a.*, u.name as user_name 
      FROM activity_log a 
      LEFT JOIN users u ON a.user_id = u.id 
      WHERE a.project_id = ? 
      ORDER BY a.created_at DESC 
      LIMIT 50
    `;
        const [rows] = await this.db.query(query, [projectId]);
        return rows;
    }

    async create(data) {
        const query = `INSERT INTO ${this.tableName} (project_id, user_id, activity_type, description) VALUES (?, ?, ?, ?)`;
        const [result] = await this.db.query(query, [
            data.project_id,
            data.user_id || null,
            data.activity_type || 'project_update',
            data.description
        ]);
        return { ...data, id: result.insertId };
    }
}

module.exports = new Activity();
