const BaseModel = require('./BaseModel');

class SocialMediaContent extends BaseModel {
    constructor() {
        super('sm_content');
    }

    async getAll(filters = {}) {
        let query = `
      SELECT c.*, s.client_id, cl.name as client_name 
      FROM ${this.tableName} c
      LEFT JOIN sm_subscriptions s ON c.subscription_id = s.id
      LEFT JOIN clients cl ON s.client_id = cl.id
      WHERE 1=1
    `;
        const params = [];

        if (filters.subscription_id) {
            query += ` AND c.subscription_id = ?`;
            params.push(filters.subscription_id);
        }
        if (filters.content_type) {
            query += ` AND c.content_type = ?`;
            params.push(filters.content_type);
        }
        if (filters.stage) {
            query += ` AND c.stage = ?`;
            params.push(filters.stage);
        }
        if (filters.status) {
            query += ` AND c.status = ?`;
            params.push(filters.status);
        }
        if (filters.month) {
            query += ` AND DATE_FORMAT(c.created_at, '%Y-%m') = ?`;
            params.push(filters.month);
        }

        query += ` ORDER BY c.created_at DESC`;
        const [rows] = await this.db.query(query, params);
        return rows;
    }

    async getBySubscriptionId(subscriptionId) {
        const query = `SELECT * FROM ${this.tableName} WHERE subscription_id = ? ORDER BY created_at DESC`;
        const [rows] = await this.db.query(query, [subscriptionId]);
        return rows;
    }

    async getByStages(subscriptionId) {
        const query = `
      SELECT stage, COUNT(*) as count 
      FROM ${this.tableName} 
      WHERE subscription_id = ? 
      GROUP BY stage
    `;
        const [rows] = await this.db.query(query, [subscriptionId]);
        return rows;
    }

    async getContentUsage(subscriptionId, month = null) {
        let query = `
      SELECT content_type, COUNT(*) as used_count 
      FROM ${this.tableName} 
      WHERE subscription_id = ?
    `;
        const params = [subscriptionId];

        if (month) {
            query += ` AND DATE_FORMAT(created_at, '%Y-%m') = ?`;
            params.push(month);
        } else {
            query += ` AND MONTH(created_at) = MONTH(CURRENT_DATE) AND YEAR(created_at) = YEAR(CURRENT_DATE)`;
        }

        query += ` GROUP BY content_type`;
        const [rows] = await this.db.query(query, params);
        return rows;
    }

    async create(data) {
        const query = `
      INSERT INTO ${this.tableName} 
      (subscription_id, content_type, title, description, stage, scheduled_date, platforms, caption, hashtags, seo_keywords, status, assigned_to) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const [result] = await this.db.query(query, [
            data.subscription_id,
            data.content_type,
            data.title,
            data.description || null,
            data.stage || 'idea',
            data.scheduled_date || null,
            data.platforms || '["instagram"]',
            data.caption || null,
            data.hashtags || null,
            data.seo_keywords || null,
            data.status || 'draft',
            data.assigned_to || null
        ]);
        return { ...data, id: result.insertId };
    }

    async update(id, data) {
        const query = `
      UPDATE ${this.tableName} 
      SET subscription_id=?, content_type=?, title=?, description=?, stage=?, scheduled_date=?, platforms=?, caption=?, hashtags=?, seo_keywords=?, status=?, assigned_to=? 
      WHERE id=?
    `;
        await this.db.query(query, [
            data.subscription_id,
            data.content_type,
            data.title,
            data.description || null,
            data.stage || 'idea',
            data.scheduled_date || null,
            data.platforms || '["instagram"]',
            data.caption || null,
            data.hashtags || null,
            data.seo_keywords || null,
            data.status || 'draft',
            data.assigned_to || null,
            id
        ]);
        return { ...data, id };
    }

    async updateStage(id, newStage, userId = null) {
        // Get current stage
        const current = await this.getById(id);
        if (!current) return false;
        const oldStage = current.stage;

        // Update stage
        await this.db.query(`UPDATE ${this.tableName} SET stage = ? WHERE id = ?`, [newStage, id]);

        // Log to history
        await this.logStageChange(id, oldStage, newStage, userId);

        // Update posted_date if moving to 'posted' stage
        if (newStage === 'posted') {
            await this.db.query(`UPDATE ${this.tableName} SET posted_date = NOW(), status = 'published' WHERE id = ?`, [id]);
        }

        return true;
    }

    async logStageChange(contentId, fromStage, toStage, userId = null) {
        const query = `INSERT INTO sm_content_history (content_id, from_stage, to_stage, changed_by) VALUES (?, ?, ?, ?)`;
        await this.db.query(query, [contentId, fromStage, toStage, userId]);
    }

    async getStuckContent(subscriptionId, daysThreshold = 7) {
        const query = `
      SELECT *, DATEDIFF(NOW(), updated_at) as days_stuck 
      FROM ${this.tableName} 
      WHERE subscription_id = ? 
      AND stage != 'posted' 
      AND DATEDIFF(NOW(), updated_at) > ? 
      ORDER BY days_stuck DESC
    `;
        const [rows] = await this.db.query(query, [subscriptionId, daysThreshold]);
        return rows;
    }

    async getUpcomingScheduled(subscriptionId, limit = 10) {
        const query = `
      SELECT * FROM ${this.tableName} 
      WHERE subscription_id = ? 
      AND scheduled_date IS NOT NULL 
      AND scheduled_date >= CURDATE() 
      ORDER BY scheduled_date ASC 
      LIMIT ${Number(limit)}
    `;
        const [rows] = await this.db.query(query, [subscriptionId]);
        return rows;
    }
}

module.exports = new SocialMediaContent();
