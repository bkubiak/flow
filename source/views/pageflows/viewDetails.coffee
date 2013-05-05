# **PageflowsViewDetails** view class responsible for displaying all pageflows
# that belongs to specific category
Klass.views.PageflowsViewDetails = Backbone.View.extend
	
	templateName: 'pageflowsViewDetails'
	
	# **initialize** - class constructor
	initialize: (opts) ->
		{category} = opts
		
		unless /^(1|6|11|51|101|501|1001)-(5|10|50|100|500|1000|oo)$/.test category
			@navigate '/pageflows'
			return
		
		bounds = category.split '-'
		@bound =
			lower: bounds[0]
			upper: if bounds[1] is 'oo' then null else bounds[1]
		
		@model.fetch
			success: => @render()
	
	# **templateHash** - used to pass variables to template
	templateHash: ->
		upperBound = if @bound.upper is null then "&infin;" else @bound.upper
		pageflowsModels = @model.getPageflowsCategory @bound.lower, @bound.upper
		pageflows = for pageflowModel in pageflowsModels
			pageflowModel.toJSON()
		pageflows: pageflows
		bounds: "#{@bound.lower}-#{upperBound}"