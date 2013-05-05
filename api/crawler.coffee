httpLib = require 'http'
urlLib = require 'url'
asyncLib = require 'async'

regexes =
	url: /^((http:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/i
	contentType: /^text\/html/i
	bodyTag: /<body[^>]*>((?:.|[\n\r])*)<\/body>/im
	aTag: /<a\s*(?:^href)*\s*href=\"([^\"]*)\"\s*(?:^href)*\s*>/img
	hashPart: /#.*$/
	trailingSlash: /\/$/
	
scannedUrls = []

exports.run = (req, res) ->
	getLinksQueue.push 'http://www.restauracja-laura.pl'
	# getLinksQueue.push 'http://www.livechatinc.com'
	
	getLinksQueue.drain = ->
		setTimeout =>
			if getLinksQueue.length() is 0
				res.json {scannedUrls:scannedUrls.length}
		, 1000

getLinksQueue = asyncLib.queue (baseUrl, callback) ->
	# don't scan url for the second time
	if scannedUrls.indexOf(baseUrl) >= 0
		return callback()
	scannedUrls.push baseUrl
	
	# don't make a request if url has wrong format
	unless regexes.url.test baseUrl
		return callback()
		
	httpLib.get baseUrl, (res) ->
		# follow redirection
		if (res.statusCode is 301 or res.statusCode is 302) and res.headers.location.length
			getLinksQueue.push res.headers.location
			return callback()
		
		# stop scanning page due to invalid status code or content type
		unless res.statusCode is 200 and res.headers['content-type'].length and regexes.contentType.test res.headers['content-type']
			return callback()
		
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
			
			pagelinks = buildPagelinks baseUrl, links
			
			# add pagelinks to DB
			
			
			for pagelink in pagelinks
				getLinksQueue.push pagelink.dest_url
			
			# console.log 'scanned url: ' + baseUrl
			callback()
, 10

buildPagelinks = (baseUrl, links) ->
	baseUrlObj = urlLib.parse baseUrl
	
	collectedChildUrls = []
	
	for link in links
		# build the url
		childUrl = urlLib.resolve(baseUrl, link)
		
		# format urls properly
		childUrl = childUrl.replace(regexes.hashPart, '').replace(regexes.trailingSlash, '').toLowerCase()
		baseUrl = baseUrl.replace(regexes.trailingSlash, '').toLowerCase()
		
		# drop link that:
		# - is the same as the url being scanned or
		# - appears for the second time
		# - is external link
		if childUrl is baseUrl or collectedChildUrls.indexOf(childUrl) >= 0 or
		childUrl.indexOf("http://#{baseUrlObj.hostname}") is -1
			continue
		
		collectedChildUrls.push childUrl
		
		domain: baseUrlObj.hostname
		source_url: baseUrl
		dest_url: childUrl
	
	
	