const mysql = require('mysql');
var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'weather_test',
	multipleStatements: true
});
con.connect(function (err) {
	if (err) throw err;
	console.log('Connected to Database!');
});
module.exports = { con };
