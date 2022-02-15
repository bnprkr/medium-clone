const express = require('express');

const routes = require('./routes');
const { port } = require('./config');

const app = express();

app.use(routes);

app.listen(port, () => console.log(`Listening on port ${port}...`));