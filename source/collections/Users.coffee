Klass.collections.Users = Backbone.Collection.extend

	url: '/api/users'
	model: Klass.models.User
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