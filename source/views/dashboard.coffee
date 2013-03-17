Klass.views.Dashboard = Backbone.View.extend
	
	templateName: 'dashboard'
	
	coefficientApha: 0.2
	coefficientBeta: 0.2
	thresholdAlpha: 2
	thresholdBeta: 42
	
	pageflowsFetched: no
	pageviewsFetched: no
	modelFetched: no
	
	initialize: (opts) ->
		{@pageflows, @pageviews} = opts
		
		@render()
		@bindSliders()
	
	
	show: ->
		Backbone.View.prototype.show.call @
		
		unless @modelFetched
			@pageflows.fetch
				success: =>
					@pageflowsFetched = yes
					if @pageviewsFetched
						@drawChart()
						@modelFetched = yes
		
			@pageviews.fetch
				success: =>
					@pageviewsFetched = yes
					if @pageflowsFetched
						@drawChart()
						@modelFetched = yes
	
	bindSliders: ->
		@$('#slider-alpha').slider
			range: 'min'
			animate: yes
			value: 0.2
			min: 0.01
			max: 0.99
			step: 0.01
			slide: (event, ui) =>
				@$('.slider-alpha-container .coefficient .value').html ui.value
			change: (event, ui) =>
				@coefficientApha = ui.value
				@thresholdAlpha = parseInt Math.pow(@coefficientApha,4) * @pageflows.getMaxCount()
				@$('.slider-alpha-container .threshold .value').html @thresholdAlpha
				@drawChart()
		
		@$('#slider-beta').slider
			range: 'min'
			animate: yes
			value: 0.2
			min: 0.01
			max: 0.99
			step: 0.01
			slide: (event, ui) =>
				@$('.slider-beta-container .coefficient .value').html ui.value
			change: (event, ui) =>
				@coefficientBeta = ui.value
				@thresholdBeta = parseInt Math.pow(@coefficientBeta,4) * @pageviews.getMaxCount()
				@$('.slider-beta-container .threshold .value').html @thresholdBeta
				@drawChart()
	
	drawChart: ->
		width = 960
		height = 500
		
		color = d3.scale.category20()
		
		force = d3.layout.force().charge(-120).linkDistance(100).size([width, height])
		d3.select("#dashboard svg").remove()
		d3.select(".tooltip").remove()
		svg = d3.select("#dashboard").append("svg").attr("width", width).attr("height", height)
		
		graph = @getData()
		console.log graph

		force.nodes(graph.nodes).links(graph.links).start()

		link = svg.selectAll(".link").data(graph.links).enter()
			.append("line").attr("class", "link").style "stroke-width", (d) =>
				Math.sqrt d.value

		node = svg.selectAll(".node").data(graph.nodes).enter().append("circle")
			.attr("class", "node").attr("r", 5).style "fill", (d) =>
				color d.group
			.call(force.drag)

		# node.append("title").text (d) =>
		# 	d.name
		
		tooltip = Tooltip("flow-tooltip", 200)
		
		force.on "tick", =>
			link.attr("x1", (d) => d.source.x)
				.attr("y1", (d) => d.source.y)
				.attr("x2", (d) => d.target.x)
				.attr("y2", (d) => d.target.y)
		
			node.attr("cx", (d) => d.x)
				.attr("cy", (d) => d.y)
		
			node.on "mouseover", (d,i) =>
				name = if d.name.length > 30 then d.name.substr(0,15)+'...'+d.name.substr(d.name.length-15) else d.name
				content = '<p class="main">' + name + '</span></p>'
				console.log d
				content += '<p class="main">pageviews: ' + d.count + '</span></p>'
				tooltip.showTooltip(content,d3.event)
				
				link.style "stroke", (l) =>
					if l.source == d or l.target == d then "#fff" else "#aaa"
				link.style "stroke-opacity", (l) =>
					if l.source == d or l.target == d then 1.0 else 0.3
				node.style "stroke", (n) =>
					if n.index == d.index then "#fff" else "#aaa"
				
			node.on "mouseout", (d, i) =>
				tooltip.hideTooltip()
				
				link.style("stroke", "#aaa").style("stroke-opacity", 0.5)
				node.style("stroke","#fff")
		
	
	getData: ->
		pageflows = @pageflows.getPageflowsCategory @thresholdAlpha
		
		pageviews = @pageviews.getPageviewsCategory @thresholdBeta
		
		urls = for pageview in pageviews
			pageview.get 'url'
		
		flow = for pageflow in pageflows
			pageflow = pageflow.toJSON()
			if urls.indexOf(pageflow.source_url) is -1 or urls.indexOf(pageflow.dest_url) is -1
				continue
			pageflow
		
		nodes = []
		arrNodes = []
		for item in flow
			if arrNodes.indexOf(item.source_url) is -1
				nodes.push
					name: item.source_url
					count: @pageviews.get(item.source_url).get('count')
				arrNodes.push item.source_url
			if arrNodes.indexOf(item.dest_url) is -1
				nodes.push
					name: item.dest_url
					count: @pageviews.get(item.dest_url).get('count')
				arrNodes.push item.dest_url

		links = for item in flow
			source: arrNodes.indexOf(item.source_url)
			target: arrNodes.indexOf(item.dest_url)
			value: 1

		nodes: nodes
		links: links
	