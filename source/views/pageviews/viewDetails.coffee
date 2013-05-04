# **PageviewsViewDetails** view class responsible for displaying all pageviews
# that belongs to specific category
Klass.views.PageviewsViewDetails = Backbone.View.extend
	
	templateName: 'pageviewsViewDetails'
	
	# **initialize** - class constructor
	initialize: (opts) ->
		{category} = opts

		unless /^(1|6|11|51|101|501|1001)-(5|10|50|100|500|1000|oo)$/.test category
			@navigate '/pageviews'
			return
		
		bounds = category.split '-'
		@bound =
			lower: bounds[0]
			upper: if bounds[1] is 'oo' then null else bounds[1]
		
		@model.fetch
			success: => @render()
	
	# **templateHash** - used to pass variables to template
	templateHash: ->
		pageviewsModels = @model.getPageviewsCategory @bound.lower, @bound.upper
		pageviews = for pageviewModel in pageviewsModels
			pageviewModel.toJSON()
		pageviews: pageviews
		bounds: "#{@bound.lower}-#{@bound.upper}"