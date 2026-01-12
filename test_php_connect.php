<?php
$host = getenv('DB_HOST') ?: '127.0.0.1';
$port = getenv('DB_PORT') ?: '3306';
$db   = 'weblyst_1_admin_clientMGT';
$user = 'weblyst_1_management';
$pass = 'Kishanshinde@08';

echo "Testing PHP connection to $host:$port...\n";

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$db";
    $pdo = new PDO($dsn, $user, $pass);
    echo "Connected successfully to MySQL!";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
