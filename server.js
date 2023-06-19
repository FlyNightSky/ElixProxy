const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const port = 8080;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Web proxy endpoint
app.get('/Elix', async (req, res) => {
  try {
    const url = req.query.url;
    const response = await axios.get(url);

    // Extract the content type from the response headers
    const contentType = response.headers['content-type'];

    // Check if the response is HTML
    if (contentType.includes('text/html')) {
      const html = response.data;
      const $ = cheerio.load(html);

      // Rewrite HTML links
      $('a[href]').each((_, element) => {
        const link = $(element);
        const href = link.attr('href');
        if (href && !href.startsWith('#')) {
          const absoluteUrl = new URL(href, url).href;
          link.attr('href', `/Elix?url=${encodeURIComponent(absoluteUrl)}`);
        }
      });

      // Rewrite <img> tags
      $('img[src]').each((_, element) => {
        const img = $(element);
        const src = img.attr('src');
        if (src) {
          const absoluteUrl = new URL(src, url).href;
          img.attr('src', `/ElixImg?url=${encodeURIComponent(absoluteUrl)}`);
        }
      });

      // Rewrite <link> tags for CSS files
      $('link[rel="stylesheet"]').each((_, element) => {
        const link = $(element);
        const href = link.attr('href');
        if (href) {
          const absoluteUrl = new URL(href, url).href;
          link.attr('href', `/ElixCss?url=${encodeURIComponent(absoluteUrl)}`);
        }
      });

      // Send the modified HTML back to the client
      res.send($.html());
    } else {
      // Pass through non-HTML content
      res.set(response.headers);
      res.send(response.data);
    }
  } catch (error) {
    console.error('Error retrieving the URL:', error);
    res.status(500).send('Error retrieving the URL.');
  }
});

// Image proxy endpoint
app.get('/ElixImg', async (req, res) => {
  try {
    const imageUrl = req.query.url;
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    res.set('Content-Type', imageResponse.headers['content-type']);
    res.send(imageResponse.data);
  } catch (error) {
    console.error('Error retrieving the image:', error);
    res.status(500).send('Error retrieving the image.');
  }
});

// CSS proxy endpoint
app.get('/ElixCss', async (req, res) => {
  try {
    const cssUrl = req.query.url;
    const cssResponse = await axios.get(cssUrl);

    res.set('Content-Type', 'text/css');
    res.send(cssResponse.data);
  } catch (error) {
    console.error('Error retrieving the CSS:', error);
    res.status(500).send('Error retrieving the CSS.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Web proxy server is running on http://localhost:${port}`);
});
