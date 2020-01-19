const express = require('express');
const bodyParser = require('body-parser');
require('./src/database/connection');
const Routes = require('./src/routes/routes');
const Relationship = require('./src/models/Relationships');

let app = express();

const PORT = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.json({message: 'Hello! Server is working fine.. Make a request to API'});
});
app.use('/api', Routes);

app.listen(PORT);
