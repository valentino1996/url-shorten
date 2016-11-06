var express = require ("express");
var mongoose = require ("mongoose");
var valid = require ("url-valid");

var app = express();

var i;

mongoose.connect("mongodb://test:test@ds053156.mlab.com:53156/mongodb-test-valentino", function (err) {
	
	if (err) {
		console.log('Unable to connect to the mongoDB server. Error:', err);
	}
	
	else {
		console.log('Connection established');
	}
});

mongoose.connection.once("open", function(err){
	
	if(err){
		console.log(err);
		mongoose.disconnect();
	}
	
	else{
		
		var snippetSchema = mongoose.Schema({
			urls : {type: String, unique: true},
			shortUrl : {type: Number, unique: true}
		});
		
		var ShortUrl = mongoose.model('ShortUrl', snippetSchema);
	}
	
	app.get("/", function(req, res){
		res.send("add a parameter");
	});

	app.get("/:url", function(req, res){
	
		var url = req.params.url;
		console.log(url);
		
		if(!isNaN(Number(url))){
			
			ShortUrl.findOne({shortUrl: url}, function(err, result){
				
				if(err){
					console.log(err);
					mongoose.disconnect();
					return;
				}
				
				res.redirect(result.urls);
					
			});
			
		}
		
		else {
		
			url =  'http://' + req.params.url;
	
			valid(url, function (err, valid) {
			
				if (err) {
					console.log(err);
					return;
				}
			
				console.log(valid);
				
				i = Math.floor(Math.random()*1000+1);
		
				ShortUrl.create({ urls: url, shortUrl: i }, function(err, snippet) {
		
					if (err || !snippet) {
						console.error("Could not create a short url");
						return;
					}
		
					console.log("Short url created");
					//res.json(i);
					
				});
				
				ShortUrl.findOne({urls: url}, function(err, result){
					
					if(err){
						console.log(err);
						mongoose.disconnect();
						return;
					}
					
					res.json(result.shortUrl);
					
				});
			
			});
		}

	});
	
});

app.listen(process.env.PORT||8080);