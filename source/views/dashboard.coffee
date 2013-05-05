# **Dashboard** view class responsible for *Dashboard* section with graph
Klass.views.Dashboard = Backbone.View.extend
	
	templateName: 'dashboard'
	
	modelFetched: no
	
	coefficientAlpha: 0.2
	coefficientBeta: 0.2
	width: 960
	height: 600	
	layout: 'random'
	scc: no

	events:
		'click .layout-container a': 'setLayout'
		'click #scc': 'bindSwitch'
	
	# **initialize** - class constructor
	initialize: (opts) ->
		{@domain} = opts
		
		
		@render()
		@bindSliders()
		@tooltip = Tooltip("flow-tooltip", 250)
		@placement = new Klass.views.Placement {domainName: @domain.get('domain')}
	
	# **show** - shows section and ensures that model is fetched
	show: ->
		Backbone.View.prototype.show.call @
		
		unless @modelFetched
			@model.fetch
				success: => @onFetch()
	
	# **onFetch** - draws chart
	onFetch: ->
		@modelFetched = yes
		@thresholdAlpha = @computeThreshold 'alpha'
		@thresholdBeta = @computeThreshold 'beta'
		@$('.pageflows-threshold').html @thresholdAlpha
		@$('.pageviews-threshold').html @thresholdBeta
		setTimeout =>
			@drawChart()
		, 100
	
	# **computeThreshold** - computes specific threshold
	#
	# * `type` - threshold type, can be *alpha* or *beta*
	computeThreshold: (type) ->
		if type is 'alpha'
			parseInt Math.pow(@coefficientAlpha,4) * @model.getPageflowsMaxCount()
		else
			parseInt Math.pow(@coefficientBeta,4) * @model.getPageviewsMaxCount()
	
	# **bindSwitch** - enables/disables strongly connected components algorithm and draws chart
	#
	# * `e` - user's event
	bindSwitch: (e) ->
		$switch = $(e.currentTarget)

		if $switch.hasClass 'on'
			$switch.find('span.toggle').animate {left: -1}, 200, =>
				$switch.removeClass('on').addClass('off')
			$switch.find('span.off-bg').animate {width: 60}, 300
			$switch.find('span.off-text').animate {right: -2}, 50
		else
			$switch.find('span.toggle').animate {left: 44}, 200, =>
				$switch.removeClass('off').addClass('on')
			$switch.find('span.off-bg').animate {width: 0}, 100
			$switch.find('span.off-text').delay(150).animate {right: -5}, 50
		
		@scc = not @scc
		@$('.scc-container a').toggleClass('enabled')
		@drawChart()
	
	# **bindSliders** - creates sliders and binds callbacks to them
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
				@coefficientAlpha = ui.value
				@thresholdAlpha = @computeThreshold 'alpha'
				@$('.pageflows-threshold').html @thresholdAlpha
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
				@thresholdBeta = @computeThreshold 'beta'
				@$('.pageviews-threshold').html @thresholdBeta
				@drawChart()
	
	# **drawChart** - gets necessary data and draws chart
	drawChart: ->
		@data = @model.getData @thresholdAlpha, @thresholdBeta, @width, @height
		console.log @data
		if @scc
			@data = @model.scc @data
		
		
		@$('.nodes-count').html @data.nodes.length
		
		@force.stop() if @force?
		@force = d3.layout.force().linkDistance(100).size([@width, @height])
		d3.select("#dashboard svg").remove()

		svg = d3.select("#dashboard .chart").append("svg").attr("width", @width).attr("height", @height)
		
		@linksG = svg.append("g").attr("id", "links")
		@nodesG = svg.append("g").attr("id", "nodes")
		
		@setLayout @layout
				
	
	# **getTooltipContent** - builds node's tooltip content
	#
	# * `node` - node's details
	getTooltipContent: (node) ->
		domain = @domain.get 'domain'
		search = new RegExp "https?:\/\/#{domain}"
		name = unless node.name is "http://#{domain}/" then node.name.replace search, '' else node.name
		
		content = '<p class="main">' + name + '</p>'
		content += '<p class="main">pageviews: ' + node.count + '</p>'
		
		if node.innerNames?
			content += '<p class="line"></p><p class="main">Joined nodes (' + node.innerNames.length + ')</p>'
			namesMaxNumber = 5
			for innerName in node.innerNames
				if namesMaxNumber is 0
					break
				innerName = unless innerName is "http://#{domain}/" then innerName.replace search, '' else innerName
				if innerName.length > 30 then innerName = innerName.substr(0, 28)+'...'
				content += '<p class="link">&diams; ' + innerName + '</p>'
				namesMaxNumber--
			if node.innerNames.length > 5 then content += '<p class="link">...</p>'
		
		linkDetails = []	
		for link in @curLinksData
			if link.source.name is node.name
				linkName = unless link.target.name is "http://#{domain}/" then link.target.name.replace search, '' else link.target.name
				if linkName.length > 30 then linkName = linkName.substr(0, 28)+'...'
				linkDetails.push
					name: linkName
					count: link.count
		
		if linkDetails.length
			linkDetails = linkDetails.sort (a,b) => b.count - a.count
			content += '<p class="line"></p><p class="main">Links pageflows (' + linkDetails.length + ')</p>'
			linksMaxNumber = 5
			for link in linkDetails
				if linksMaxNumber is 0
					break
				content += '<p class="link">&diams; ' + link.name + ' &ndash; ' + link.count + '</p>'
				linksMaxNumber--
			if linkDetails.length > 5 then content += '<p class="link">...</p>'
		
		content
	
	# **onMouseOver** - shows tooltip when hovering mouse pointer over a node
	#
	# * `d` - node's details
	onMouseOver: (d) ->
		@tooltip.showTooltip(@getTooltipContent(d),d3.event)
		
		if @link
			@link.style "stroke", (l) =>
				if l.source == d then "#fff" else "#aaa"
			@link.style "stroke-opacity", (l) =>
				if l.source == d then 1.0 else 0.3
		@node.style "stroke", (n) =>
			if n.index == d.index then "#fff" else "#aaa"
	
	# **onMouseOut** - hides tooltip when mouse pointer is out
	#
	# * `d` - node's details
	onMouseOut: (d) ->
		@tooltip.hideTooltip()
		
		if @link
			@link.style("stroke", "#aaa").style("stroke-opacity", 0.5)
		@node.style("stroke","#ccc")
	
	
	# **updateNodes** - resets nodes
	updateNodes: ->
		nodeColors = d3.scale.category20()
		
		@node = @nodesG.selectAll("circle.node").data(@curNodesData, (d) -> d.name)

		@node.enter().append("circle")
			.attr("class", "node")
			.attr("cx", (d) => d.x)
			.attr("cy", (d) => d.y)
			.attr("r", (d) => d.radius)
			.style("fill", (d) => nodeColors(d.group))

		@node.on("mouseover", _.bind(@onMouseOver,@))
			.on("mouseout", _.bind(@onMouseOut,@))

		@node.exit().remove()
	
	# **updateLinks** - resets links
	updateLinks: ->
		@link = @linksG.selectAll("line.link").data(@curLinksData, (d) -> "#{d.source.name}_#{d.target.name}")
			
		@link.enter().append("line")
			.attr("class", "link")
			.attr("x1", (d) -> d.source.x)
			.attr("y1", (d) -> d.source.y)
			.attr("x2", (d) -> d.target.x)
			.attr("y2", (d) -> d.target.y)
			.style("stroke-width", (d) => d.value)

		@link.exit().remove()
	
	# **setLayout** - sets chosen (in passed event) layout
	#
	# * `e` - user's event
	setLayout: (e) ->
		isEvent = typeof(e.isDefaultPrevented) isnt 'undefined'
		
		if isEvent
			e.preventDefault()	
			layout = $(e.currentTarget).attr 'id'
		else
			layout = e
		
		@layout = layout
		
		@$('.layout-container a').removeClass 'active'
		@$("##{layout}").addClass 'active'
		
		@force.stop()
		
		@force.on('tick', (e) =>
			k = e.alpha * 0.1
			@node.each (d) =>
				targetPlacement = @placement.getPlacement(d.name)
				d.x += (targetPlacement.x - d.x) * k
				d.y += (targetPlacement.y - d.y) * k
		
			@node.attr("cx", (d) -> d.x).attr("cy", (d) -> d.y)

			if e.alpha < 0.03
				@force.stop()
				@updateLinks()
		)
		
		@update()
		
	
	# **update** - updates graph
	update: ->
		@curNodesData = @data.nodes
		@curLinksData = @data.links
		
		names = for node in @curNodesData
			node.name

		if @layout is 'radial'
			@force.charge(-100)
			@placement.radialPlacement(names, {x: @width / 2, y: @height / 2}, 250, 20, -120)
		else
			@force.charge(-200)
			@placement.randomPlacement(names, @width, @height)
	
		# reset nodes in force layout
		@force.nodes(@curNodesData)
		@updateNodes()

		@force.links([])
		if @link
			@link.data([]).exit().remove()
			@link = null

		@force.start()
			
	