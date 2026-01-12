const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

const plans = [
    {
        plan_name: 'Basic Plan',
        plan_price: 15000,
        posts_limit: 12,
        carousels_limit: 2,
        reels_limit: 4,
        stories_limit: 0, // Unlimited
        blogs_limit: 0,
        features: JSON.stringify(['12 Posts', '2 Carousels', '4 Reels', 'Unlimited Stories', 'Community Management']),
        is_active: 1
    },
    {
        plan_name: 'Standard Plan',
        plan_price: 25000,
        posts_limit: 20,
        carousels_limit: 4,
        reels_limit: 8,
        stories_limit: 0,
        blogs_limit: 2,
        features: JSON.stringify(['20 Posts', '4 Carousels', '8 Reels', 'Unlimited Stories', '2 Blogs', 'Community Management', 'Monthly Report']),
        is_active: 1
    },
    {
        plan_name: 'Premium Plan',
        plan_price: 40000,
        posts_limit: 30,
        carousels_limit: 8,
        reels_limit: 12,
        stories_limit: 0,
        blogs_limit: 4,
        features: JSON.stringify(['30 Posts', '8 Carousels', '12 Reels', 'Unlimited Stories', '4 Blogs', 'Community Management', 'Weekly Report', 'Ad Management']),
        is_active: 1
    }
];

connection.connect((err) => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log('Seeding plans...');

    const query = `
    INSERT INTO sm_plans 
    (plan_name, plan_price, posts_limit, carousels_limit, reels_limit, stories_limit, blogs_limit, features, is_active) 
    VALUES ?
  `;

    const values = plans.map(p => [
        p.plan_name, p.plan_price, p.posts_limit, p.carousels_limit, p.reels_limit, p.stories_limit, p.blogs_limit, p.features, p.is_active
    ]);

    connection.query(query, [values], (error, results) => {
        if (error) {
            console.error('Error seeding plans:', error);
        } else {
            console.log(`Seeded ${results.affectedRows} plans.`);
        }
        connection.end();
    });
});
