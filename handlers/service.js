const request = require('request');
const mysql = require('mysql');
const { con } = require('../util/db');

exports.startPage = function (req, res) {
	let weatherList = {};
	weatherList.data = { found: false };
	res.render('index.ejs', { weatherList: weatherList });
};

exports.getApiData = function (req, res) {
	let weatherList = {};
	let jsonURL =
		'http://api.openweathermap.org/data/2.5/forecast?q=' +
		req.query.city +
		'&units=metric&appid=e4b8b08c185638b825af37facfe1fabb';
	request(jsonURL, function (error, response, body) {
		// Request is a library that's make HTTP request.
		if (!error && response.statusCode == '200') {
			weatherList = JSON.parse(body); // To make it JSON file.
			weatherList.data = { database: false, found: true };
			res.render('index.ejs', { weatherList: weatherList });
		} else {
			res.redirect('/');
		}
	});
};

exports.getDatabase = function (req, res) {
	let weatherList = {};
	let sql = `SELECT ??, ??, ??, ??, ??, ?? FROM city JOIN temp ON city.c_id = temp.t_city_id JOIN wind ON city.c_id = wind.w_city_id WHERE city.c_id = (SELECT c_id FROM city WHERE c_city_name = ?)`;
	let inserts = ['c_city_name', 't_temp_max', 't_temp_min', 'w_speed', 't_date_time', 'updated_at', req.query.city];
	sql = mysql.format(sql, inserts);
	con.query(sql, function (err, result) {
		if (err) {
			throw err;
		}
		if (result.length == true) {
			weatherList = result[0];
			weatherList.data = { database: true, found: true };
			weatherList.city = { name: result[0].c_city_name };
			res.render('index.ejs', { weatherList: weatherList });
		} else {
			res.redirect('/');
		}
	});
};

exports.postToDatabas = function (req, res) {
	let sql = `SELECT * FROM city WHERE c_city_name = ?`;
	let inserts = [req.body.city];
	sql = mysql.format(sql, inserts);
	con.query(sql, function (err, result) {
		if (err) {
			throw err;
		}
		if (result.length == false) {
			sql = `INSERT INTO city (c_city_name) VALUES (?);
			INSERT INTO temp (t_temp_max, t_temp_min, t_date_time, t_city_id) VALUES (?, ?, ?, (SELECT c_id FROM city WHERE c_city_name = ?)); 
			INSERT INTO wind (w_speed, w_city_id) VALUES (?, (SELECT c_id FROM city WHERE c_city_name = ?));`;
			let inserts = [
				req.body.city,
				req.body.temp_max,
				req.body.temp_min,
				req.body.date_time,
				req.body.city,
				req.body.wind,
				req.body.city
			];
			sql = mysql.format(sql, inserts);
			con.query(sql, function (err, result) {
				if (err) {
					throw err;
				} else {
					console.log('Added to DB');
					res.json({ message: 'Added to DB' });
				}
			});
		} else {
			sql = `UPDATE city SET updated_at = CURRENT_TIMESTAMP WHERE c_city_name = ?;
			UPDATE temp SET t_temp_max = ?, t_temp_min = ?, t_date_time = ? WHERE t_city_id = (SELECT c_id FROM city WHERE c_city_name = ?); 
			UPDATE wind SET w_speed = ? WHERE w_city_id = (SELECT c_id FROM city WHERE c_city_name = ?)`;
			let inserts = [
				req.body.city,
				req.body.temp_max,
				req.body.temp_min,
				req.body.date_time,
				req.body.city,
				req.body.wind,
				req.body.city
			];
			sql = mysql.format(sql, inserts);
			con.query(sql, function (err, result) {
				if (err) {
					throw err;
				} else {
					console.log('DB Updated');
					res.json({ message: 'DB was Updated' });
				}
			});
		}
	});
};
