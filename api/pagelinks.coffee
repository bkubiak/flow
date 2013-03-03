mongo = require 'mongodb'
MongoClient = mongo.MongoClient

config =
	url: "mongodb://localhost:27017/flow"

exports.add = (pagelinks) ->
	MongoClient.connect config.url, (err, db) ->
		if err then return console.log err
	
		collection = db.collection 'pagelinks'
		collection.insert pagelinks, {w:1}, (err, result) ->
			if err then return console.log err
			db.close()

exports.getBasic = (req, res) ->
	domain = req.params.domain
	unless domain.length
		res.json 404, {error: 'no domain'}
		return false
	MongoClient.connect config.url, (err, db) ->
		if err then return console.log err

		collection = db.collection 'pagelinks'
		collection.distinct 'source_url', {domain: domain}, (err, items) ->
			unless items.length
				res.json 404, {error: 'no pagelinks for domain'}
				return false
			result = for item in items
				url: item
			res.json result
			db.close()

exports.getDetails = (req, res) ->
	domain = req.params.domain
	baseUrl = decodeURIComponent req.params.baseUrl
	unless domain.length
		res.json 404, {error: 'no domain'}
		return false
	unless baseUrl.length
		res.json 404, {error: 'no base url'}
		return false
	MongoClient.connect config.url, (err, db) ->
		if err then return console.log err

		collection = db.collection 'pagelinks'
		collection.find({domain: domain, source_url: baseUrl}).toArray (err, items) ->
			unless items.length
				res.json 404, {error: 'no pagelinks for base url'}
				return false
			result =
				url: baseUrl
			result.links = for item in items
				item.dest_url
			res.json result
			db.close()