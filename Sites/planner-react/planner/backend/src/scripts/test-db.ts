import pool from '../database';
import { RowDataPacket } from 'mysql2';

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('✅ Database connected!', rows);

    // Check users table
    const [users] = await pool.query<RowDataPacket[]>('SELECT * FROM users LIMIT 5');
    console.log('\n📊 Users in database:');
    console.table(users);

    // Check if password column exists
    const [columns] = await pool.query<RowDataPacket[]>(
      'SHOW COLUMNS FROM users WHERE Field = "password"'
    );
    
    if (columns.length > 0) {
      console.log('\n✅ Password column exists!');
      console.log(columns[0]);
    } else {
      console.log('\n❌ Password column does NOT exist!');
      console.log('Run this SQL: ALTER TABLE users ADD COLUMN password VARCHAR(255);');
    }

    // Check a specific user
    console.log('\n🔍 Enter a nick to check:');
    const testNick = 'planner-admin'; // Replace with actual nick
    const [testUser] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, nick, password, veduci FROM users WHERE nick = ?',
      [testNick]
    );
    
    if (testUser.length > 0) {
      console.log(`\n✅ Found user: ${testNick}`);
      console.log('Has password:', testUser[0].password ? 'YES' : 'NO');
      console.log('Password hash:', testUser[0].password?.substring(0, 20) + '...');
    } else {
      console.log(`\n❌ User ${testNick} not found`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Database error:', error);
    process.exit(1);
  }
}

testConnection();