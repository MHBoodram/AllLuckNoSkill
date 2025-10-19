import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  // Security + CORS headers
  res.setHeader('x-content-type-options', 'nosniff');
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow all (limit in prod)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // Get input data
  const { identifier, password } = req.body || {};

  if (!identifier?.trim() || !password) {
    return res.status(400).json({ success: false, error: 'Missing credentials' });
  }

  let conn;
  try {
    // Connect to your MySQL database
    conn = await mysql.createConnection({
      host: process.env.DBHOST,
      user: process.env.DBUSER,
      password: process.env.DBPASS,
      database: process.env.DBNAME,
      port: process.env.DBPORT ? Number(process.env.DBPORT) : 3306,
      connectTimeout: 5000,
    });

    console.log('✅ Connected to database');

    // Search for player by username or email
    const [rows] = await conn.execute(
      'SELECT idPlayer, username, email, password, First_name, Last_name FROM player WHERE username = ? OR email = ? LIMIT 1',
      [identifier, identifier]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: 'No account found with that username or email' });
    }

    const user = rows[0];

    // Compare plain-text passwords directly
    if (user.password !== password) {
      return res.status(401).json({ success: false, error: 'Incorrect password' });
    }

    // Success: send user info
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        idPlayer: user.idPlayer,
        username: user.username,
        email: user.email,
        firstName: user.First_name,
        lastName: user.Last_name,
      },
    });
  } catch (error) {
    console.error('❌ Login API error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    if (conn) {
      try {
        await conn.end();
      } catch {}
    }
  }
}
