const BaseModel = require('./BaseModel');

class Mockup extends BaseModel {
    constructor() {
        super('mockups');
    }

    async findAll() {
        const query = `SELECT * FROM ${this.tableName} ORDER BY created_at DESC`;
        const [rows] = await this.db.query(query);
        return rows;
    }

    async findBySlug(slug) {
        const query = `SELECT * FROM ${this.tableName} WHERE slug = ?`;
        const [rows] = await this.db.query(query, [slug]);
        return rows[0];
    }

    async create(data) {
        const query = `
      INSERT INTO ${this.tableName} (project_id, title, description, features, tags, tool, figmaLink, mockupLink, previewImage, previewImageSS, slug, status, visibility) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const [result] = await this.db.query(query, [
            data.project_id || null,
            data.title,
            data.description || null,
            data.features || null,
            data.tags || null,
            data.tool || null,
            data.figmaLink || null,
            data.mockupLink || null,
            data.previewImage || null,
            data.previewImageSS || null,
            data.slug,
            data.status || 'Draft',
            data.visibility || 'Internal'
        ]);
        return result.insertId;
    }

    async update(id, data) {
        const query = `
      UPDATE ${this.tableName} 
      SET project_id=?, title=?, description=?, features=?, tags=?, tool=?, figmaLink=?, mockupLink=?, previewImage=?, previewImageSS=?, slug=?, status=?, visibility=? 
      WHERE id=?
    `;
        await this.db.query(query, [
            data.project_id || null,
            data.title,
            data.description || null,
            data.features || null,
            data.tags || null,
            data.tool || null,
            data.figmaLink || null,
            data.mockupLink || null,
            data.previewImage || null,
            data.previewImageSS || null,
            data.slug,
            data.status || 'Draft',
            data.visibility || 'Internal',
            id
        ]);
        return true;
    }
}

module.exports = new Mockup();
