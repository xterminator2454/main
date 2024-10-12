const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const mime = require('mime');

require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public'));

// Serve HTML form for file upload
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
    const { buffer, originalname } = req.file;
    const githubToken = process.env.GITHUB_TOKEN; // Your GitHub token
    const repoOwner = 'xterminator2454'; // GitHub username
    const repoName = 'animeisworld'; // GitHub repository name
    const randomString = Math.random().toString(36).substring(2, 22);
    const fileMimeType = mime.getType(req.file);

    try {
        // Upload file to GitHub
        const response = await axios.put(
            `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${randomString}`,
            {
                message: `Upload ${randomString}`,
                content: buffer.toString('base64'),
            },
            {
                headers: {
                    Authorization: `token ${githubToken}`,
                    'Content-Type': fileMimeType,
                },
            }
        );

        res.send(`https://static.animeis.world/${randomString}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file to GitHub');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
