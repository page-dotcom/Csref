export default async function handler(req, res) {
    // 1. Aturan CORS (Agar bisa menerima data dari Blogger)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: "Server belum disetting." });
    }

    // 2. Tangkap semua data pengunjung (termasuk Lokasi Vercel)
    const ipAddress = req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const url = req.query.url || 'unknown';
    const referrer = req.query.referrer || 'direct';
    const countryCode = req.headers['x-vercel-ip-country'] || 'Unknown';
    const city = req.headers['x-vercel-ip-city'] || 'Unknown';

    // 3. Simpan ke Supabase
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
                referrer: referrer,
                country_code: countryCode,
                city: city
            })
        });

        if (!response.ok) throw new Error("Gagal menyimpan ke database");

        return res.status(200).json({ success: true, message: "Data terekam." });
    } catch (error) {
        return res.status(500).json({ error: "Gagal memproses analitik." });
    }
}
