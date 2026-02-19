export default async function handler(req, res) {
    // Pengaturan CORS agar dashboard HTML Anda bisa mengambil data
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: "Server misconfiguration" });
    }

    try {
        // Mengambil semua kolom, urutkan dari yang terbaru, batasi 50 data terakhir
        const response = await fetch(`${supabaseUrl}/rest/v1/analytics?select=*&order=created_at.desc&limit=50`, {
            method: 'GET',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });

        if (!response.ok) throw new Error("Gagal mengambil data dari database");

        const data = await response.json();
        
        // Kirim data ke tampilan HTML
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Gagal memproses analitik" });
    }
}
