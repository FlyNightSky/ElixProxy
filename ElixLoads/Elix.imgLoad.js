const express = require('express');
const axios = require('axios');
const app = express();
const port = 8081;

// Proxy endpoint
app.get('/ElixImg', async (req, res) => {
  try {
    const url = req.query.url;
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    // Set the Content-Type header based on the original response
    res.set('Content-Type', response.headers['content-type']);

    // Send the image data back to the client
    res.send(response.data);
  } catch (error) {
    console.error('Error retrieving the image:', error);
    res.status(500).send('Error retrieving the image.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Image proxy server is running on http://localhost:${port}`);
});
