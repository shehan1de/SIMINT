const express = require('express');
const router = express.Router();
const generateCypher = require('../services/geminiService');
const runCypherQuery = require('../services/neo4jService');
const History = require('../models/History');

router.post('/query', async (req, res) => {
  const { phrase } = req.body;

  if (!phrase) return res.status(400).json({ error: "Missing user phrase" });

  try {
    const cypher = await generateCypher(phrase);
    const results = await runCypherQuery(cypher);

    const historyEntry = new History({
      userInput: phrase,
      cypherQuery: cypher,
      results: results,
      timestamp: new Date()
    });
    await historyEntry.save();

    res.json({ cypher, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    const history = await History.find().sort({ timestamp: -1 }).limit(50);
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});


module.exports = router;
