const mysql = require('mysql2');
//const dotenv = require('dotenv').config();

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'NumberSixNumber777',
    database: 'ALNSdb',
    port: '3306',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if(err){
        console.error("Error getting database connection:",err);
        return;
    }
    console.log("Connected to MySQL database");
});

module.exports = pool;