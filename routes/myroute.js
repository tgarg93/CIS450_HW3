/**
 * New node file
 */

var MongoClient = require('mongodb').MongoClient;

function getResults(db, days, hours, callback) {
	var query = {}
	var strOpen = "hours." + days + ".open"
	var strClose = "hours." + days + ".close"
	var start = hours.split("-")[0].trim()
	var end = hours.split("-")[1].trim()
	query[strOpen] = {
		$gt: start
	}
	
	query[strClose] = {
		$gt: end
	}
	var cursor = db.collection('business').find(query);
	var results = [];
	cursor.each(function(err, doc) {
		if (doc != null) {
			results.push(doc.name);
		} else {
			callback(results);
		}
	});
};

function generateResponse(req, res) {
	console.log(req.query);
	var days = req.query.days
	var hours = req.query.hours
	// The url to connect to the mongodb instance
	var url = 'mongodb://cis550student:cis550hw3@ds051933.mongolab.com:51933/cis550hw3';
	MongoClient.connect(url, function(err, db) {
		// If there is an error, log the error and render the error page 
		if(err != null) {
			console.log("Connection to server failed.");
			db.close();
			res.render('error', {
				message: "Connection to server failed.",
				error: err
			});
		}
		// If there is no error while connecting, proceed further
		else {
			console.log("Connected correctly to server.");
			getResults(db, days, hours, function(results) {
				db.close();
				res.render('yourwork.ejs', {results: results});
			});
		}
	});
}

exports.displayResponse = function(req, res){
	generateResponse(req, res);
};