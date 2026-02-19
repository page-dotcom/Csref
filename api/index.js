export default function handler(req, res) {
    res.status(200).json({ 
        status: "success", 
        message: "API Security Server is running optimally." 
    });
}
