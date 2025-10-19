import mysql from 'mysql2/promise';
// import bcrypt from 'bcrypt'; // ← use if you update the password column length

export default async function handler(req, res) {
  // Security + CORS headers (same as your format)
  res.setHeader('x-content-type-options', 'nosniff');
  res.setHeader('Access-Control-Allow-Origin', '*'); // limit in prod
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST for creating a player
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // Expecting these from the PlayerCreate form
  const {
    firstName,  // maps to First_name
    lastName,   // maps to Last_name
    username,   // maps to username
    email,      // maps to email
    password,   // maps to password (plaintext per your schema)
  } = req.body || {};

  // Basic validation (mirror your frontend expectations)
  if (!firstName?.trim() || !lastName?.trim() || !username?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  let connection;
  try {
    // Connect — keep the same “format” (env-based) you used
    // If you don’t want env vars, you can hardcode these here.
    connection = await mysql.createConnection({
      host: process.env.DBHOST || '127.0.0.1',
      user: process.env.DBUSER || 'root',
      password: process.env.DBPASS || 'NumberSixNumber777',
      database: process.env.DBNAME || 'ALNSdb',
      port: process.env.DBPORT ? Number(process.env.DBPORT) : 3306,
      // ssl: process.env.DB_SSL_CA ? { ca: Buffer.from(process.env.DB_SSL_CA, 'base64') } : false,
      connectTimeout: 5000,
    });

    // Check for duplicate email or username
    const [dups] = await connection.execute(
      'SELECT idPlayer FROM player WHERE email = ? OR username = ? LIMIT 1',
      [email, username]
    );
    if (dups.length > 0) {
      return res.status(409).json({ success: false, error: 'Email or username already exists' });
    }

    // If you upgrade the column and want to hash, do it here:
    // const hashed = await bcrypt.hash(password, 10);

    // Insert the new player (column names exactly as given)
    const [result] = await connection.execute(
      `INSERT INTO player (username, email, password, First_name, Last_name)
       VALUES (?, ?, ?, ?, ?)`,
      [username, email, /* hashed */ password, firstName, lastName]
    );

    return res.status(201).json({
      success: true,
      message: 'Player created successfully',
      idPlayer: result.insertId,
    });
  } catch (error) {
    console.error('❌ API Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error' });
  } finally {
    if (connection) {
      try { await connection.end(); } catch {}
    }
  }
}
