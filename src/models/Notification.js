const BaseModel = require('./BaseModel');

class Notification extends BaseModel {
    constructor() {
        super('notifications');
    }

    async getByUser(userId) {
        const query = `SELECT * FROM ${this.tableName} WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`;
        const [rows] = await this.db.query(query, [userId]);
        return rows;
    }

    async getUnreadCount(userId) {
        const query = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE user_id = ? AND is_read = FALSE`;
        const [rows] = await this.db.query(query, [userId]);
        return rows[0].count;
    }

    async create(data) {
        const query = `INSERT INTO ${this.tableName} (user_id, title, message, type, link) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await this.db.query(query, [
            data.user_id,
            data.title,
            data.message || null,
            data.type || 'info',
            data.link || null
        ]);
        return { ...data, id: result.insertId };
    }

    async markAsRead(id) {
        const query = `UPDATE ${this.tableName} SET is_read = TRUE WHERE id = ?`;
        const [result] = await this.db.query(query, [id]);
        return result.affectedRows > 0;
    }

    async markAllAsRead(userId) {
        const query = `UPDATE ${this.tableName} SET is_read = TRUE WHERE user_id = ?`;
        const [result] = await this.db.query(query, [userId]);
        return result.affectedRows > 0;
    }
}

module.exports = new Notification();
