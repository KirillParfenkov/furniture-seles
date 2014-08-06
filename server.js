var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var methodOverride = require('method-override');
var nconf = require('nconf');
var mysql = require('mysql');
var async = require('async');

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
app.use(serveStatic('/home/parf/Work/Lynx/files'));
app.use(methodOverride());
app.use(function(req, res, next) {
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

app.get('/furnituresByCategory/:categoryId', function( req, res ) {
	pool.query('SELECT * FROM categoryFurnitureLinks WHERE `categoryId` = ?', [req.params.categoryId], function(err, result) {
		if (err) throw err;
		var furnitureIdList = [];
		for ( var i = 0; i < result.length; i++ ) {
			furnitureIdList.push(result[i].furnitureId);
		}
		if ( furnitureIdList.length ) {
			async.parallel({
				furnitures : function( finish ) {
					var sqlRequest = 'SELECT * FROM furnitures WHERE `id` IN (?)';
					pool.query( sqlRequest, [furnitureIdList], function( err, result ) {
						if (err) throw err;
						finish( null, result );
					});
				},
				furnitureIdFileMap : function( finish ) {
					var sqlRequest = 'SELECT * FROM pictureFurnitureLinks WHERE `furnitureId` IN (?)';
					pool.query( sqlRequest, [furnitureIdList], function( err, result ) {
						if (err) throw err;

						var furFileMap = {};
						for ( var i = 0; i < result.length; i++ ) {
							furFileMap[result[i].furnitureId] = furFileMap[result[i].furnitureId] || [];
							furFileMap[result[i].furnitureId].push( result[i].pictureId );
						}

						finish( null, furFileMap );
					});
				},
				furnitureIdAvatarMap : function( finish ) {
					var sqlRequest = 'SELECT furnitureId, pictureId FROM pictureFurnitureLinks, files, types ' + 
					                ' WHERE (`furnitureId` IN (?)) AND (types.name = ?) AND (pictureFurnitureLinks.pictureId = files.id) ' + 
					                ' AND (files.type = types.id)';
					pool.query( sqlRequest, [furnitureIdList, 'avatar'], function( err, result ) {
						if (err) throw err;

						var furAvatarMap = {};
						for ( var i = 0; i < result.length; i++ ) {
							furAvatarMap[result[i].furnitureId] = result[i].pictureId;
						}

						finish( null, furAvatarMap );
					});
				}
			}, function( err, results ) {
				if (err) throw err;
				var furnitures = results.furnitures,
					furnitureIdFileMap = results.furnitureIdFileMap,
					furnitureIdAvatarMap = results.furnitureIdAvatarMap;
				for( var i = 0; i < furnitures.length; i++) {
					furnitures[i].pictures = furnitureIdFileMap[furnitures[i].id];
					furnitures[i].avatar = furnitureIdAvatarMap[furnitures[i].id];
				}
				res.json( furnitures );
			});
		} else {
			res.json( [] );
		}

	});
});

app.get('/furnituresWithImages/:id', function( req, res ) {
	pool.query('SELECT * FROM furnitures WHERE id = ?', [req.params.id], function(err, result) {
		if (err) throw err;

		if ( result.length > 0 ) {
			var furniture = result[0];
			var sqlRequest = 'SELECT files.id, files.name, files.type, files.path FROM pictureFurnitureLinks, files, types ' + 
					        ' WHERE (`furnitureId` = ?) AND (types.name = ?) AND (pictureFurnitureLinks.pictureId = files.id) ' + 
					        ' AND (files.type = types.id)';


			pool.query(sqlRequest, [furniture.id, 'image'], function( err, result ) {
				if (err) throw err;
				furniture.images = result;
				res.json( 200, furniture );
			});


		} else {
			res.json( 400, { error: 'Not Found' } );
		}
	});
});

app.listen(nconf.get('port'), function(){
    console.log('Express server listening on port ' + nconf.get('port'));
});