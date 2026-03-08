import "dotenv/config";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "SchoolManagementSystem";

const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME || "ngwemmben";
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "ngwemmben@gmail.com";
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || "leroy1234";

async function run() {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            connectTimeout: 10000,
        });

        console.log("✅ Connected to:", DB_NAME);

        // ── Step 1: Create table ──────────────────────────────────────────────
        await connection.query(`
            CREATE TABLE IF NOT EXISTS super_admin (
                id            INT          NOT NULL AUTO_INCREMENT,
                name          VARCHAR(100) NOT NULL,
                email         VARCHAR(100) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                phone_number  VARCHAR(30)  DEFAULT NULL,
                created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
                updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY uq_superadmin_email (email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        console.log('📋 Table "super_admin" is ready.');

        // ── Step 2: Check duplicate ───────────────────────────────────────────
        const [rows] = await connection.query(
            "SELECT id FROM super_admin WHERE email = ? LIMIT 1",
            [SUPER_ADMIN_EMAIL]
        );

        if (rows.length > 0) {
            console.log(`⚠️  Super admin "${SUPER_ADMIN_EMAIL}" already exists (id=${rows[0].id}). Nothing to do.`);
            return;
        }

        // ── Step 3: Hash password ─────────────────────────────────────────────
        const hash = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);

        // ── Step 4: Insert ────────────────────────────────────────────────────
        const [result] = await connection.query(
            `INSERT INTO super_admin (name, email, password_hash) VALUES (?, ?, ?)`,
            [SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL, hash]
        );

        console.log("🎉 Super admin seeded successfully!");
        console.log(`   ID    : ${result.insertId}`);
        console.log(`   Name  : ${SUPER_ADMIN_NAME}`);
        console.log(`   Email : ${SUPER_ADMIN_EMAIL}`);
        console.log("   Password is stored as a bcrypt hash (10 salt rounds).");

    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log("🔒 Connection closed.");
        }
    }
}

run();
