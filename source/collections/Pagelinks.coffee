Klass.collections.Pagelinks = Backbone.Collection.extend

	url: '/api/pagelinks/www.restauracja-laura.pl'
	# url: '/api/pagelinks/www.livechatinc.com'
	model: Klass.models.Pagelink
	fetched: no
	
	fetch: (opts) ->
		opts = opts || {}
		
		if @fetched
			if opts.success?
				opts.success()
		else
			success = opts.success
			opts.success = =>
				@fetched = yes
				success()
			Backbone.Collection.prototype.fetch.call @, opts