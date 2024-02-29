const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.use(express.static('front-end'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});