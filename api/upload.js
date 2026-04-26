const axios = require('axios');
const FormData = require('form-data');
const multiparty = require('multiparty');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const form = new multiparty.Form();
    
    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ success: false, message: 'Form parse error' });

        try {
            const file = files.image[0];
            const imgbbKey = 'e6278dbf2b1950c71bf2898cb10580ad'; // 🔥 Secure Backend Key

            const formData = new FormData();
            // Buffer ko base64 mein convert karke ImgBB ko bhejna
            const fs = require('fs');
            const imageBuffer = fs.readFileSync(file.path);
            formData.append('image', imageBuffer.toString('base64'));

            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, formData, {
                headers: formData.getHeaders()
            });

            res.status(200).json({
                success: true,
                url: response.data.data.url,
                delete_url: response.data.data.delete_url
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'ImgBB API Error' });
        }
    });
}
