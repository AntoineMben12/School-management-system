import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    }
);

// Test the connection on startup
try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
} catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Please check your .env configuration:');
    console.error(`  DB_HOST: ${process.env.DB_HOST}`);
    console.error(`  DB_USER: ${process.env.DB_USER}`);
    console.error(`  DB_NAME: ${process.env.DB_NAME}`);
}

export default pool;