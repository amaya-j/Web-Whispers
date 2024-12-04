require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Add this console.log to check if the API key is loaded correctly
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
console.log('OpenAI API Key:', OPENAI_API_KEY);

app.post('/api/ask', async (req, res) => {
  const { question, pageData } = req.body;

  if (!question || !pageData) {
    return res.status(400).json({ error: 'Missing question or page data.' });
  }

  try {
    const prompt = generatePrompt(question, pageData);

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an assistant that answers questions about webpage content.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const answer = response.data.choices[0].message.content.trim();
    res.json({ answer });
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to get response from OpenAI API.' });
  }
});

function generatePrompt(question, pageData) {
  return `The following is content from a web page:

Title: ${pageData.title}
URL: ${pageData.url}
Content: ${pageData.text}

Based on the above content, please answer the following question:

${question}`;
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
