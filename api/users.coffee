mongo = require 'mongodb'
MongoClient = mongo.MongoClient

config =
	url: "mongodb://localhost:27017/flow"

#getAll
#getOne
#remove
#update
#add

exports.getAll = (req, res) ->
	MongoClient.connect config.url, (err, db) ->
		if err then return console.log err

		collection = db.collection 'users'
		collection.find().toArray (err, items) ->
			unless items.length
				res.json 404, {error: 'no goals'}
				return false
			res.json items

exports.getOne = (req, res) ->
	MongoClient.connect config.url, (err, db) ->
		if err then return console.log err

		collection = db.collection 'users'
		id = parseInt req.params.id, 10
		collection.findOne {id: id}, (err, item) ->
			unless item?
				res.json 404, {error: 'no goal'}
				return false
			res.json item