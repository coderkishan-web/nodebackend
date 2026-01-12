const BaseModel = require('./BaseModel');

class SocialMediaPlan extends BaseModel {
    constructor() {
        super('sm_plans');
    }

    async getActivePlans() {
        const query = `SELECT * FROM ${this.tableName} WHERE is_active = TRUE ORDER BY display_order ASC`;
        const [rows] = await this.db.query(query);
        return rows;
    }

    async getAll() {
        const query = `SELECT * FROM ${this.tableName} ORDER BY display_order ASC`;
        const [rows] = await this.db.query(query);
        return rows;
    }

    async create(data) {
        const query = `
      INSERT INTO ${this.tableName} 
      (plan_name, plan_price, currency, posts_limit, carousels_limit, reels_limit, stories_limit, blogs_limit, description, is_active, display_order) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const [result] = await this.db.query(query, [
            data.plan_name,
            data.plan_price,
            data.currency || 'INR',
            data.posts_limit || 0,
            data.carousels_limit || 0,
            data.reels_limit || 0,
            data.stories_limit || 0,
            data.blogs_limit || 0,
            data.description || null,
            data.is_active !== undefined ? data.is_active : true,
            data.display_order || 0
        ]);
        return { ...data, id: result.insertId };
    }

    async update(id, data) {
        const query = `
      UPDATE ${this.tableName} 
      SET plan_name=?, plan_price=?, currency=?, posts_limit=?, carousels_limit=?, reels_limit=?, stories_limit=?, blogs_limit=?, description=?, is_active=?, display_order=? 
      WHERE id=?
    `;
        await this.db.query(query, [
            data.plan_name,
            data.plan_price,
            data.currency || 'INR',
            data.posts_limit || 0,
            data.carousels_limit || 0,
            data.reels_limit || 0,
            data.stories_limit || 0,
            data.blogs_limit || 0,
            data.description || null,
            data.is_active !== undefined ? data.is_active : true,
            data.display_order || 0,
            id
        ]);
        return { ...data, id };
    }

    async softDelete(id) {
        const query = `UPDATE ${this.tableName} SET is_active = FALSE WHERE id = ?`;
        const [result] = await this.db.query(query, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new SocialMediaPlan();
