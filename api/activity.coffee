url = require 'url'
mongo = require 'mongodb'
MongoClient = mongo.MongoClient

config =
	url: "mongodb://localhost:27017/flow"

exports.add = (req, res) ->
	res.send 200
	query = req.query
	
	#matches = query.url.match /^https?:\/\/([^\/]+)/
	urlObj = url.parse query.url
	domain = urlObj.hostname
	
	MongoClient.connect config.url, (err, db) ->
		if err then return console.log err
		
		# increment pageview
		pageview =
			domain: domain
			url: query.url

		collection = db.collection 'pageviews'
		collection.update pageview, {$inc: count: 1}, {upsert: yes}, (err, result) ->
			if err then return console.log err
		
		# increment pagesflow if not starting point
		if query.ref.length
			pageflow =
				domain: domain
				source_url: query.ref
				dest_url: query.url

			collection = db.collection 'pageflows'
			collection.update pageflow, {$inc: count: 1}, {upsert: yes}, (err, result) ->
				if err then return console.log err