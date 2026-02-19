export default async function handler(req, res) {
    // 1. Setup CORS agar Blogger diizinkan mengirim data analitik ke API ini
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Ambil kunci rahasia dari brankas Vercel
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: "Server misconfiguration: Missing credentials" });
    }

    // 3. Tangkap data pengunjung secara otomatis dari sistem Vercel
    const ipAddress = req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    // Tangkap URL halaman Blogger dan Referrer yang dikirim dari script frontend
    const url = req.query.url || 'unknown';
    const referrer = req.query.referrer || 'direct';

    // 4. Kirim data ke database Supabase menggunakan native Fetch API
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/analytics`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                url: url,
                ip_address: ipAddress,
                user_agent: userAgent,
                referrer: referrer
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        return res.status(200).json({ success: true, message: "Analytics recorded" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to process analytics" });
    }
}
