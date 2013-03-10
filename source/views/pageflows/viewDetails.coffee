Klass.views.PageflowsViewDetails = Backbone.View.extend
	
	templateName: 'pageflowsViewDetails'
	
	initialize: (opts) ->
		{category} = opts
		
		unless /^(1|6|11|51|101|501|1001)-(5|10|50|100|500|1000|oo)$/.test category
			@navigate '/pageflows'
			return
		
		bounds = category.split '-'
		@bound =
			lower: bounds[0]
			upper: bounds[1]
		
		@model.fetch
			success: => @render()
	
	templateHash: ->
		pageflowsModels = @model.getPageflowsCategory @bound.lower, @bound.upper
		pageflows = for pageflowModel in pageflowsModels
			pageflowModel.toJSON()
		pageflows: pageflows
		bounds: "#{@bound.lower}-#{@bound.upper}"