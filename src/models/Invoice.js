const BaseModel = require('./BaseModel');

class Invoice extends BaseModel {
    constructor() {
        super('invoices');
    }

    async getAll() {
        const query = `
      SELECT i.*, c.name as client_name, p.title as project_title 
      FROM invoices i 
      LEFT JOIN clients c ON i.client_id = c.id 
      LEFT JOIN projects p ON i.project_id = p.id
      ORDER BY i.issued_date DESC
    `;
        const [rows] = await this.db.query(query);
        return rows;
    }

    async getById(id) {
        const query = `
      SELECT i.*, c.name as client_name, p.title as project_title 
      FROM invoices i 
      LEFT JOIN clients c ON i.client_id = c.id 
      LEFT JOIN projects p ON i.project_id = p.id
      WHERE i.id = ?
    `;
        const [rows] = await this.db.query(query, [id]);
        return rows[0];
    }

    async create(data) {
        const query = `INSERT INTO ${this.tableName} (client_id, project_id, invoice_number, amount, status, due_date, issued_date, pdf_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await this.db.query(query, [
            data.client_id || null,
            data.project_id || null,
            data.invoice_number || null,
            data.amount || 0,
            data.status || 'Draft',
            data.due_date || null,
            data.issued_date || null,
            data.pdf_link || null
        ]);
        return { ...data, id: result.insertId };
    }

    async update(id, data) {
        const query = `UPDATE ${this.tableName} SET client_id=?, project_id=?, invoice_number=?, amount=?, status=?, due_date=?, issued_date=?, pdf_link=? WHERE id=?`;
        await this.db.query(query, [
            data.client_id || null,
            data.project_id || null,
            data.invoice_number || null,
            data.amount || 0,
            data.status || 'Draft',
            data.due_date || null,
            data.issued_date || null,
            data.pdf_link || null,
            id
        ]);
        return { ...data, id };
    }
}

module.exports = new Invoice();
