export default function handler(req, res) {
    // 1. Pengaturan CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    
    // 2. Ambil token dari URL dan token dari Cookie
    const { token, dest } = req.query; 
    const cookies = req.headers.cookie || '';
    const cookieMatch = cookies.match(/server_token=([^;]+)/);
    const serverToken = cookieMatch ? cookieMatch[1] : null;

    // 3. Validasi Keamanan (Error diset dalam bahasa Inggris)
    if (!token || !serverToken || token !== serverToken) {
        return res.status(403).send('Access Denied: Invalid or expired security token.');
    }

    if (!dest) {
        return res.status(400).send('Error: Destination link is missing.');
    }

    try {
        // 4. Decode tujuan dari format Base64 string ke URL asli
        const decodedUrl = Buffer.from(dest, 'base64').toString('utf-8');
        
        // 5. Eksekusi Redirect!
        res.redirect(302, decodedUrl);
    } catch (e) {
        res.status(400).send('Error: Invalid Base64 string format.');
    }
}
