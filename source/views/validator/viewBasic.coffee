# **ValidatorViewBasic** view class responsible for displaying a few pages to validate
Klass.views.ValidatorViewBasic = Backbone.View.extend
	
	templateName: 'validatorViewBasic'
	
	isEmpty: no
	
	# **initialize** - class constructor
	initialize: (opts) ->
		@model.fetch
			success: =>
				@isEmpty = no
				@render()
			error: =>
				@isEmpty = yes
				@render()
		
	
	# **templateHash** - used to pass variables to template
	templateHash: ->
		pages = @model.getMostPopularPages()
		pagesDetails = for page in pages
			details = page.toJSON()
			details.encodedUrl = encodeURIComponent details.url
			details
		
		isEmpty: @isEmpty
		pages: pagesDetails
