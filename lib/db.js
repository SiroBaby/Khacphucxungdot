// lib/db.ts
import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: 'mysql-2604166c-vaa-a7df.a.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_OJenyhkEQHh52umQY9Y',
    database: 'defaultdb',
    port: 19104,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default db;