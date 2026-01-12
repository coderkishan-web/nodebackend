const db = require('../config/db');

class AnalyticsController {
    async getRevenueByMonth(req, res) {
        try {
            const query = `
        SELECT 
            month,
            SUM(amount) as revenue,
            SUM(invoice_count) as invoice_count
        FROM (
            SELECT 
                DATE_FORMAT(issued_date, '%Y-%m') as month,
                SUM(amount) as amount,
                COUNT(*) as invoice_count
            FROM invoices 
            WHERE status = 'Paid' AND issued_date IS NOT NULL
            GROUP BY month
            
            UNION ALL
            
            SELECT 
                DATE_FORMAT(updated_at, '%Y-%m') as month,
                SUM(budget) as amount,
                0 as invoice_count
            FROM projects 
            WHERE status = 'Completed' AND updated_at IS NOT NULL
            GROUP BY month
        ) AS combined_revenue
        GROUP BY month
        ORDER BY month DESC
        LIMIT 12
      `;
            const [rows] = await db.query(query);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching revenue data', error: err.message });
        }
    }

    async getProjectsByStatus(req, res) {
        try {
            const query = `SELECT status, COUNT(*) as count FROM projects GROUP BY status`;
            const [rows] = await db.query(query);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching project stats', error: err.message });
        }
    }

    async getInvoicesByStatus(req, res) {
        try {
            const query = `SELECT status, COUNT(*) as count, SUM(amount) as total FROM invoices GROUP BY status`;
            const [rows] = await db.query(query);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching invoice stats', error: err.message });
        }
    }

    async getTopClients(req, res) {
        try {
            const query = `
        SELECT 
            c.name,
            COUNT(DISTINCT p.id) as project_count,
            COALESCE(SUM(i.amount), 0) + COALESCE(SUM(CASE WHEN p.status = 'Completed' THEN p.budget ELSE 0 END), 0) as total_revenue
        FROM clients c
        LEFT JOIN projects p ON c.id = p.client_id
        LEFT JOIN invoices i ON c.id = i.client_id AND i.status = 'Paid'
        GROUP BY c.id, c.name
        ORDER BY total_revenue DESC
        LIMIT 10
      `;
            const [rows] = await db.query(query);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching top clients', error: err.message });
        }
    }
}

module.exports = new AnalyticsController();
