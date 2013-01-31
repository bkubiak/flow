http = require 'http'
urlLib = require 'url'
mongo = require 'mongodb'
MongoClient = mongo.MongoClient

config =
	url: "mongodb://localhost:27017/flow"

regexes =
	url: /^((http:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/i
	contentType: /^text\/html/i
	bodyTag: /<body[^>]*>((?:.|[\n\r])*)<\/body>/im
	aTag: /<a\s*(?:^href)*\s*href=\"([^\"]*)\"\s*(?:^href)*\s*>/img
	hashPart: /#.*$/
	trailingSlash: /\/$/
	
scannedUrls = []

exports.run = (req, res) ->
	res.send 200
	getLinks 'http://www.restauracja-laura.pl'
	# getLinks 'http://www.livechatinc.com'

getLinks = (url, callback) ->
	# don't scan url for the second time
	if scannedUrls.indexOf(url) >= 0
		return false
	scannedUrls.push url
	
	# don't make a request if url has wrong format
	unless regexes.url.test url
		return false
		
	http.get url, (res) ->
		# follow redirection
		if (res.statusCode is 301 or res.statusCode is 302) and res.headers.location.length
			getLinks res.headers.location
			return true
		
		# stop scanning page due to invalid status code or content type
		unless res.statusCode is 200 and res.headers['content-type'].length and regexes.contentType.test res.headers['content-type']
			return false
		
		html = ''
		
		# get html content
		res.on 'data', (chunk) -> html += chunk
		res.on 'end', ->
			matches = html.match regexes.bodyTag
			body = matches[1]

			links = []
			
			# get links from <a> tag within a body tag
			while matches = regexes.aTag.exec(body)
				links.push matches[1]
				
			urlObj = urlLib.parse url

			collectedChildUrls = []
			pagelinks = for link in links
				# build the url
				childUrl = urlLib.resolve(url, link)
				
				# format urls properly
				childUrl = childUrl.replace(regexes.hashPart, '').replace(regexes.trailingSlash, '').toLowerCase()
				url = url.replace(regexes.trailingSlash, '').toLowerCase()
				
				# drop link that:
				# - is the same as the url being scanned or
				# - appears for the second time
				# - is external link
				if childUrl is url or collectedChildUrls.indexOf(childUrl) >= 0 or
				childUrl.indexOf("http://#{urlObj.hostname}") is -1
					continue
				
				collectedChildUrls.push childUrl
				
				domain: urlObj.hostname
				source_url: url
				dest_url: childUrl
			
			# addLinks pagelinks
			
			console.log 'scanned url: ' + url
			console.log 'added pagelinks: ' + pagelinks.length
			
			# recursive call
			for childUrl in collectedChildUrls
				getLinks childUrl
	

addLinks = (pagelinks) ->
	MongoClient.connect config.url, (err, db) ->
		if err then return console.log err
	
	collection = db.collection 'pagelinks'
	# collection.update pagelinks, {$inc: count: 1}, {upsert: yes}, (err, result) ->
	# 	if err then return console.log err