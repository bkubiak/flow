# **ValidatorViewDetails** view class responsible for displaying all errors
# of specific page obtained from W3C Markup Validator
Klass.views.ValidatorViewDetails = Backbone.View.extend
	
	templateName: 'validatorViewDetails'
	
	# **initialize** - class constructor
	initialize: (opts) ->
		@page = decodeURIComponent opts.page
		
		if @model.get @page
			@fetched = yes
			@render()
		else
			@fetched = no
			@render()
		
			validationModel = new Klass.models.Validation
				page: @page
		
			validationModel.fetch
				success: =>
					@fetched = yes
					@render()
		
			@model.add validationModel
	
	# **templateHash** - used to pass variables to template
	templateHash: ->
		hash =
			fetched: @fetched
			page: @page
			
		if @fetched
			validationModel = @model.get @page
			validationDetails = @model.get(@page).toJSON()
			
			hash.errors = validationDetails.errors
			hash.errorsLength = validationDetails.errors.length
		
		hash