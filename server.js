var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var methodOverride = require('method-override');
var nconf = require('nconf');
var mysql = require('mysql');

nconf.argv()
	.env()
	.file({file: './config.json'});

var pool = mysql.createPool({
	connectionLimit : nconf.get('database:connectionLimit'),
	host : nconf.get('database:uri'),
	database: nconf.get('database:name'),
	user: nconf.get('database:user'),
	password: nconf.get('database:password')

});

var getRequest = 'SELECT * FROM ??';
var getByIdREquest = 'SELECT * FROM ?? WHERE id = ?'
var postRequest = 'INSERT INTO ?? SET ?';
var updateRequest = 'UPDATE ?? SET ? WHERE id = ?';
var deleteRequest = 'DELETE FROM ?? WHERE id = ?';

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(serveStatic('public'));
app.use(methodOverride());
app.use(function(req, res, next) {
	console.log(req.headers.origin);
	res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', 'http://localhost:8000')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
	next();
});

app.get('/api', function (req, res) {
    res.send('API is running');
});

app.get('/api/:table', function(req, res) {
	pool.query(getRequest, [ req.params.table], function(err, rows, fields) {
		if (err) {
			res.json( 400, { error: 'SQL error' });
		} else {
			res.json( rows );
		}
	});
});

app.post('/api/:table', function(req, res) {
	var row = req.body;
	pool.query(postRequest, [req.params.table, row], function (err, result) {
		if (err) {
			res.json(400, {error: 'SQL error'});
		} else {
			row.id = result.insertId;
			res.json( row );
		}
	});
});

app.get('/api/:table/:id', function(req, res) {
	pool.query(getByIdREquest, [req.params.table, req.params.id], function(err, rows, fields) {
		if (err) {
			res.json( 400, { error: 'SQL error' });
		} else {
			res.json(rows[0]);
		}
	});
});

app.put('/api/:table/:id', function(req, res) {
	var row = req.body;
	pool.query(updateRequest, [req.params.table, row, req.params.id], function( err, result ) {
		if ( err ) {
			res.json( 400, {error: 'SQL error'} );
		} else {
			res.json( row );
		}
	});
});

app.delete('/api/:table/:id', function(req, res) {
	pool.query(deleteRequest, [req.params.table, req.params.id], function( err, result) {
		if ( err ) {
			res.json( 400, {error: 'SQL error'} );
		} else {
			res.json( result );
		}
	});
});

app.listen(nconf.get('port'), function(){
    console.log('Express server listening on port ' + nconf.get('port'));
});