// lib/db.ts
import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: 'mysql-2cf4bf9-vaa-a7df.d.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_jyk7o5oNmYWo_jV5EtR',
    database: 'defaultdb',
    port: 19104,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default db;