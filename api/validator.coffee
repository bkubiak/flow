httpLib = require 'http'

# **validate** - validates specific page againts W3C validator
exports.validate = (req, res) ->
	url = req.params.url
	unless url.length
		res.json 404, {error: 'no url'}
		return false
	
	# samples URLs:
	# url = 'http://www.livechatinc.com/'
	# url = 'http://validator.w3.org/'
	
	options =
		host: 'validator.w3.org'
		path: "/check?uri=#{url}&output=json"
		headers:
			"User-Agent": 'flow'
	
	httpLib.get options, (results) ->
		
		json = ''
		results.on 'data', (chunk) => json += chunk
		results.on 'end', =>
			json = JSON.parse json
			messages = []
			if json.messages? and json.messages.length > 0
				for message in json.messages
					messages.push message.message
			res.json
				page: url
				errors: messages
