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
    console.log('Connected to database: ' + process.env.DB_NAME);

    connection.query('SHOW TABLES', (error, results) => {
        if (error) {
            console.error('Error listing tables:', error);
        } else {
            console.log('Tables:', results.map(row => Object.values(row)[0]));
        }
        connection.end();
    });
});
