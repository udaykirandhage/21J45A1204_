const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/numbers", async (req, res) => {
  try {
    
    
    if (!req.query.url) {
      res.status(400).json({ error: 'Missing "url" query parameter' });
      return;
    }

    const urls = Array.isArray(req.query.url) ? req.query.url : [req.query.url];

    const responses = [];
    await Promise.all(
      urls.map(async (url) => {
        try {
          const response = await axios.get(url);
          if (response.status === 200) {
            responses.push(response.data.numbers);
          } else {
            console.log(`Invalid response from ${url}: ${response.status}`);
          }
        } catch (error) {
          console.log(`Error while fetching ${url}: ${error.message}`);
        }
      })
    );
    const numbers = [
      ...new Set(responses.flatMap((response) => response)),
    ].sort((a, b) => a - b);

    const result = { numbers: numbers };

    res.send(result);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

module.exports = router;
