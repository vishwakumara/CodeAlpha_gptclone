// app.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (including index.html)
app.use(express.static(path.join(__dirname, 'public')));

// OpenAI API endpoint
const openaiEndpoint = 'https://api.openai.com/v1/completions';

// API Key
const apiKey = process.env.OPENAI_API_KEY;

// POST endpoint to interact with OpenAI API
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    
    try {
        console.log('Message:', message);
        
        const response = await axios.post(openaiEndpoint, {
            prompt: message,
            max_tokens: 50,
            temperature: 0.7,
            stop: '\n',
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('OpenAI API Response:', response.data);
        
        const reply = response.data.choices[0].text.trim();
        res.json({ reply }); // Sending the response in the correct format
    } catch (error) {
        console.error('OpenAI API Error:', error.message);
        if (error.response && error.response.data && error.response.data.error) {
            res.status(500).json({ error: error.response.data.error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
