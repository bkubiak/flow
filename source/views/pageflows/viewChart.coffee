# **PageflowsViewChart** view class responsible for displaying pageflows
# distrubution chart
Klass.views.PageflowsViewChart = Backbone.View.extend
	
	templateName: 'pageflowsViewChart'
	
	isEmpty: no
	
	# **initialize** - class constructor
	initialize: (opts) ->
		@model.fetch
			success: =>
				@isEmpty = no
				@render()
				@drawChart()
			error: =>
				@isEmpty = yes
				@render()
	
	# **templateHash** - used to pass variables to template
	templateHash: ->
		isEmpty: @isEmpty
	
	# **drawChart** - draws distribution chart
	drawChart: ->
		width = 750
		height = 400
		margin = {top: 75, right: 75, bottom: 75, left: 75}
		x = d3.scale.linear().range [0, width]
		y = d3.scale.linear().range [height, 0]
		
		xAxis = d3.svg.axis().scale(x).orient "bottom"
		yAxis = d3.svg.axis().scale(y).orient "left"
		
		area = d3.svg.area()
			.x((d) => x d.index)
			.y0(height)
			.y1((d) => y d.count)
		
		d3.select("#pageflows svg").remove()
		svg = d3.select("#pageflows .pageflows-chart").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		
		data = @getData()
		
		x.domain [0, d3.max(data, (d) => d.index )]
		y.domain [0, d3.max(data, (d) => d.count )]

		svg.append("path").datum(data).attr("class", "area").attr("d", area)
			
		svg.append("g").attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")").call(xAxis)
			.append("text").text("index").attr("x",width).attr("y", 40)
			.style("fill","#888").style("text-anchor", "end")
			
		svg.append("g").attr("class", "y axis").call(yAxis)
			.append("text").attr("transform", "rotate(-90)")
			.attr("y", 20).attr("dy", "5px").text("pageflow count")
			.style("fill","#888").style("text-anchor", "end")
	
	# **getData** - gets necessary data from model
	getData: ->
		pageflowsModels = @model.getPageflowsCategory(2, @model.at(@model.length-2).get('count'))
		pageflows = for pageflowsModel in pageflowsModels
			pageflowsModel.toJSON()
		
		for pageflow, index in pageflows
			count: pageflow.count
			index: index