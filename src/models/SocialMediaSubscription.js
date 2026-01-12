const BaseModel = require('./BaseModel');

class SocialMediaSubscription extends BaseModel {
    constructor() {
        super('sm_subscriptions');
    }

    async getAll() {
        const query = `
      SELECT s.*, c.name as client_name, p.plan_name, p.plan_price,
             p.posts_limit, p.carousels_limit, p.reels_limit, p.stories_limit, p.blogs_limit
      FROM ${this.tableName} s
      LEFT JOIN clients c ON s.client_id = c.id
      LEFT JOIN sm_plans p ON s.plan_id = p.id
      ORDER BY s.created_at DESC
    `;
        const [rows] = await this.db.query(query);
        return rows;
    }

    async getById(id) {
        const query = `
      SELECT s.*, c.name as client_name, c.email as client_email,
             p.plan_name, p.plan_price, p.currency,
             p.posts_limit, p.carousels_limit, p.reels_limit, p.stories_limit, p.blogs_limit
      FROM ${this.tableName} s
      LEFT JOIN clients c ON s.client_id = c.id
      LEFT JOIN sm_plans p ON s.plan_id = p.id
      WHERE s.id = ?
    `;
        const [rows] = await this.db.query(query, [id]);
        return rows[0];
    }

    async getActiveByClientId(clientId) {
        const query = `
      SELECT s.*, c.name as client_name,
             p.plan_name, p.plan_price, p.currency,
             p.posts_limit, p.carousels_limit, p.reels_limit, p.stories_limit, p.blogs_limit
      FROM ${this.tableName} s
      LEFT JOIN clients c ON s.client_id = c.id
      LEFT JOIN sm_plans p ON s.plan_id = p.id
      WHERE s.client_id = ? AND s.status = 'active'
      ORDER BY s.created_at DESC
      LIMIT 1
    `;
        const [rows] = await this.db.query(query, [clientId]);
        return rows[0];
    }

    async create(data) {
        const query = `
      INSERT INTO ${this.tableName} 
      (client_id, plan_id, start_date, end_date, billing_cycle, auto_renew, status, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const [result] = await this.db.query(query, [
            data.client_id,
            data.plan_id,
            data.start_date,
            data.end_date,
            data.billing_cycle || 'monthly',
            data.auto_renew !== undefined ? data.auto_renew : true,
            data.status || 'active',
            data.notes || null
        ]);
        return { ...data, id: result.insertId };
    }

    async update(id, data) {
        const query = `
      UPDATE ${this.tableName} 
      SET client_id=?, plan_id=?, start_date=?, end_date=?, billing_cycle=?, auto_renew=?, status=?, notes=? 
      WHERE id=?
    `;
        await this.db.query(query, [
            data.client_id,
            data.plan_id,
            data.start_date,
            data.end_date,
            data.billing_cycle || 'monthly',
            data.auto_renew !== undefined ? data.auto_renew : true,
            data.status || 'active',
            data.notes || null,
            id
        ]);
        return { ...data, id };
    }

    async cancel(id) {
        const query = `UPDATE ${this.tableName} SET status = 'cancelled' WHERE id = ?`;
        const [result] = await this.db.query(query, [id]);
        return result.affectedRows > 0;
    }

    async getByClientId(clientId) {
        const query = `
      SELECT s.*, p.plan_name, p.plan_price
      FROM ${this.tableName} s
      LEFT JOIN sm_plans p ON s.plan_id = p.id
      WHERE s.client_id = ?
      ORDER BY s.created_at DESC
    `;
        const [rows] = await this.db.query(query, [clientId]);
        return rows;
    }
}

module.exports = new SocialMediaSubscription();
