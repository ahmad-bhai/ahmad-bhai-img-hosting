const axios = require('axios');

export default async function handler(req, res) {
    // CORS enable karna taake BJS block na ho
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        // Body se image URL nikalna
        const { image } = req.body; 
        
        if (!image) {
            return res.status(400).json({ success: false, message: "No image URL provided" });
        }

        const imgbbKey = 'e6278dbf2b1950c71bf2898cb10580ad';
        
        // ImgBB ko request bhejna
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbKey}&image=${encodeURIComponent(image)}`);

        return res.status(200).json({
            success: true,
            data: {
                url: response.data.data.url,
                delete_url: response.data.data.delete_url
            }
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.response ? JSON.stringify(error.response.data) : error.message 
        });
    }
}
