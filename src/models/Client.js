const BaseModel = require('./BaseModel');

class Client extends BaseModel {
    constructor() {
        super('clients');
    }

    async getAll() {
        const query = `
      SELECT c.*, COUNT(p.id) as project_count 
      FROM clients c 
      LEFT JOIN projects p ON c.id = p.client_id 
      GROUP BY c.id 
      ORDER BY c.created_at DESC
    `;
        const [rows] = await this.db.query(query);
        return rows;
    }

    async create(data) {
        const query = `INSERT INTO ${this.tableName} (name, contact_person, email, phone, industry, services, status, source, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await this.db.query(query, [
            data.name,
            data.contact_person || null,
            data.email || null,
            data.phone || null,
            data.industry || null,
            data.services || null,
            data.status || 'Lead',
            data.source || null,
            data.notes || null
        ]);
        return { ...data, id: result.insertId };
    }

    async update(id, data) {
        const query = `UPDATE ${this.tableName} SET name=?, contact_person=?, email=?, phone=?, industry=?, services=?, status=?, source=?, notes=? WHERE id=?`;
        await this.db.query(query, [
            data.name,
            data.contact_person || null,
            data.email || null,
            data.phone || null,
            data.industry || null,
            data.services || null,
            data.status || 'Lead',
            data.source || null,
            data.notes || null,
            id
        ]);
        return { ...data, id };
    }
}

module.exports = new Client();
