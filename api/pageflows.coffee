mongo = require 'mongodb'
MongoClient = mongo.MongoClient

config =
	url: "mongodb://localhost:27017/flow"

# **get** - gets all pageflows and their details from database
exports.get = (req, res) ->
	domain = req.params.domain
	unless domain.length
		res.json 404, {error: 'no domain'}
		return false
	MongoClient.connect config.url, (err, db) ->
		if err then return console.log err

		collection = db.collection 'pageflows'
		collection.find({domain: domain}).toArray (err, items) ->
			unless items.length
				res.json 404, {error: 'no pageflows for domain'}
				return false
			res.json items
			db.close()