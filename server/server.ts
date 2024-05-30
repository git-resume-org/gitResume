// server.js

const express = require('express');
const path = require('path');

const PORT = 8080;

const app = express();

app.use(express.json());

  app.listen(PORT, () => {
    console.log('\n\n');
    console.log(`Server listening on port: ${PORT}...`);
    console.log('\n\n');
});
