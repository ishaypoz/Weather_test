const express = require('express');
const bodyParser = require('body-parser'); // Allow you to read the res.body property ad string.
const { getApiData, getDatabase, postToDatabas, startPage } = require('./handlers/service');
const app = express();

app.use('/static', express.static('./static/')); //for using external JS file in HTML
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', startPage);

app.get('/searchAPI', getApiData);

app.get('/searchDB', getDatabase);

app.post('/postDB', postToDatabas);

app.listen(3000, function () {
	console.log('Connected to Server!');
});
