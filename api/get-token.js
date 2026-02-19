const crypto = require('crypto');

export default function handler(req, res) {
    // 1. Pengaturan CORS agar Blogger diizinkan mengakses API ini
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Tangani request "preflight" dari browser
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Buat token CSRF acak
    const csrfToken = crypto.randomBytes(32).toString('hex');
    
    // 3. Simpan Cookie. SameSite=None wajib untuk lintas domain (Blogger ke Vercel)
    res.setHeader('Set-Cookie', `server_token=${csrfToken}; Path=/; HttpOnly; Secure; SameSite=None`);
    
    // 4. Kirim token ke Blogger
    res.status(200).json({ csrf_token: csrfToken });
}
