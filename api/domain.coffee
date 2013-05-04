mongo = require 'mongodb'
MongoClient = mongo.MongoClient
url = require 'url'

config =
	url: "mongodb://localhost:27017/flow"

# **get** - gets currently set domain name
exports.get = (req, res) ->
	MongoClient.connect config.url, (err, db) ->
		if err then return console.log err

		collection = db.collection 'domain'
		collection.find().toArray (err, items) ->
			unless items.length
				res.json 404, {error: 'no domain'}
				return false
			res.json items[0]
			db.close()

# **set** - sets domain name
exports.set = (req, res) ->
	domain = req.body.domain
	unless domain.length
		res.json 404, {error: 'no domain'}
		return false
	MongoClient.connect config.url, (err, db) ->
		if err then return console.log err

		collection = db.collection 'domain'
		collection.insert {domain: domain}, {w:1}, (err, result) ->
			if err then return console.log err
			res.json result[0]
			db.close()

# **remove** - unsets domain name
exports.remove = (req, res) ->
	MongoClient.connect config.url, (err, db) ->
		if err then return console.log err

		collection = db.collection 'domain'
		collection.remove {}, {w:0}
		res.json {}
		db.close()