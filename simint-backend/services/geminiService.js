const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function generateCypher(userCommand) {
  const prompt = fs.readFileSync('prompt.txt', 'utf8');
  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      },
      {
        role: "model",
        parts: [{ text: "Okay, I understand. From now on, I will generate the Cypher query that fulfills the natural language command or requirement you provide." }]
      },
      {
        role: "user",
        parts: [{ text: userCommand }]
      }
    ]
  };

  const response = await axios.post(GEMINI_URL, body);
  let cypher = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  
  cypher = cleanCypherQuery(cypher);
  
  return cypher;
}

async function cleanCypherQuery(rawQuery) {
  return rawQuery
    .replace(/```(cypher)?/g, '')
    .trim();
}

module.exports = generateCypher;