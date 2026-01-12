const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    connection.query('SELECT * FROM sm_plans', (error, results) => {
        if (error) {
            console.error('Error fetching plans:', error);
        } else {
            console.log('Plans in DB:', results);
        }
        connection.end();
    });
});
