const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
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

    try {
        // Upload file to GitHub
        const response = await axios.put(
            `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${originalname}`,
            {
                message: `Upload ${originalname}`,
                content: buffer.toString('base64'),
            },
            {
                headers: {
                    Authorization: `token ${githubToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.send(`File uploaded to GitHub: ${response.data.content.html_url}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file to GitHub');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
