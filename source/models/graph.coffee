# **Graph** model class responsible for managing data (nodes and links) to draw a graph
Klass.models.Graph = Backbone.Model.extend
	
	pageflowsFetched: no
	pageviewsFetched: no
	
	# **initialize** - class constructor
	#
	# * `attrs` - initial attributes
	# * `pageviews` - pageviews model
	# * `pageflows`- pageflows model
	initialize: (attrs, @pageviews, @pageflows) ->
	
	# **fetch** - tries to fetch pageviews and pageflows from api
	#
	# * `opts` - optional param containing *success* callback
	fetch: (opts) ->
		@pageflows.fetch
			success: =>
				@pageflowsFetched = yes
				if @pageviewsFetched then opts.success()
	
		@pageviews.fetch
			success: =>
				@pageviewsFetched = yes
				if @pageflowsFetched then opts.success()
	
	# **getPageflowsMaxCount** - gets the biggest count value of pageflows
	getPageflowsMaxCount: ->
		if @pageflowsFetched then @pageflows.getMaxCount() else no
	
	# **getPageviewsMaxCount** - gets the biggest count value of pageviews
	getPageviewsMaxCount: ->
		if @pageviewsFetched then @pageviews.getMaxCount() else no
	
	
	
	# **getData** - gets data from pageviews and pageflows collections,
	# processes it and passes to *setupRawData* function
	#
	# * `thresholdAlpha` - threshold alpha related to pageflows
	# * `thresholdBeta` - threshold beta related to pageviews
	# * `width` - width of the graph layer
	# * `height` - height of the graph layer
	getData: (thresholdAlpha, thresholdBeta, width, height) ->
		unless @pageflowsFetched and @pageviewsFetched
			return no
		
		pageflows = @pageflows.getPageflowsCategory thresholdAlpha

		pageviews = @pageviews.getPageviewsCategory thresholdBeta

		arrUrls = for pageview in pageviews
			pageview.get 'url'

		pageflows = for pageflow in pageflows
			pageflow = pageflow.toJSON()
			# skip connections without nodes
			if arrUrls.indexOf(pageflow.source_url) is -1 or arrUrls.indexOf(pageflow.dest_url) is -1
				continue
			pageflow


		arrAddedNodes = []
		nodes = []

		# add nodes with connections only
		for pageflow in pageflows
			if arrAddedNodes.indexOf(pageflow.source_url) is -1
				arrAddedNodes.push pageflow.source_url
				viewCount = @pageviews.get(pageflow.source_url).get 'count'

				nodes.push
					name: pageflow.source_url
					count: viewCount

			if arrAddedNodes.indexOf(pageflow.dest_url) is -1
				arrAddedNodes.push pageflow.dest_url
				viewCount = @pageviews.get(pageflow.dest_url).get 'count'

				nodes.push
					name: pageflow.dest_url
					count: viewCount


		# add the rest of the nodes
		for pageview in pageviews
			url = pageview.get 'url'
			if arrAddedNodes.indexOf(url) is -1
				arrAddedNodes.push url
				viewCount = pageview.get 'count'

				nodes.push
					name: url
					count: viewCount

		links = for pageflow in pageflows
			source: pageflow.source_url
			target: pageflow.dest_url
			count: pageflow.count

		rawData =
			nodes: nodes
			links: links
		
		data = @setupRawData rawData, width, height
	
	# **setupRawData** - processes raw data obtained from api
	#
	# * `data` - data to set up
	# * `width` - width of the graph layer
	# * `height` - height of the graph layer
	setupRawData: (data, width, height) ->
		data.nodes.forEach (n) =>
			# set initial x/y to values within the width/height of the visualization
			n.x = Math.floor(Math.random()*width)
			n.y = Math.floor(Math.random()*height)

			n.radius = Math.log(n.count)*1.5
			
			n.group = 0

		# id's -> node objects
		nodesMap = @mapNodes(data.nodes)

		# switch links to point to node objects instead of id's
		data.links.forEach (l) =>
			l.source = nodesMap.get(l.source)
			l.target = nodesMap.get(l.target)
			l.value = Math.log(l.count) / 1.5

		data



	
	# **scc** - implements Tarjan's strongly connected components algorithm
	#
	# * `data` - raw data containing single nodes and links
	scc: (data) ->
		nodes = for node in data.nodes
			$.extend {}, node,
				index: -1
				lowLink: -1
				connections: []
		
		nodesMap = @mapNodes nodes

		for link in data.links
			for node in nodes
				if link.source.name is node.name
					node.connections.push nodesMap.get(link.target.name)

		@index = 0
		@stack = []
		@sccNodes = []

		for node in nodes
			if node.index < 0
				@strongConnect node

		sccData = @setupSccData @sccNodes, data

	
	# **strongConnect** - starts finding new strongly connected component
	#
	# * `node` - node details with linked nodes references
	strongConnect: (node) ->
		node.index = @index
		node.lowLink = @index
		@index++
		@stack.push node

		for w in node.connections
			v = node
			if w.index < 0
				@strongConnect w
				v.lowLink = Math.min v.lowLink, w.lowLink
			else
				for stackNode in @stack
					if stackNode.name is w.name
						v.lowLink = Math.min v.lowLink, w.index

		if node.lowLink is node.index
			innerNodes = []
			w = null
			
			if @stack.length > 0
				w = @stack.pop()
				innerNodes.push w
				until node.name is w.name
					w = @stack.pop()
					innerNodes.push w
			
			if innerNodes.length > 0
				@sccNodes.push innerNodes
	
	
	# **setupSccData** - processes data obtained from strongly connected compontents algorithm
	#
	# * `sccNodes` - raw nodes obtained from scc algorithm; must be adjusted
	# * `data` - raw data containing single nodes and links; used to generate new links for scc nodes
	setupSccData: (sccNodes, data) ->
		nodes = []
		links = []
		joinedNodesCount = 0
		nodesMap = @mapNodes data.nodes
		sccNodesMap = {}
		linksMap = {}
		
		for sccNode in sccNodes
			if sccNode.length is 1
				nodes.push nodesMap.get(sccNode[0].name)
			else
				joinedNode =
					name: "joined_node_#{joinedNodesCount}"
					innerNames: []
					count: 0
					x: sccNode[0].x
					y: sccNode[0].y
					group: 1
					
				for innerNode in sccNode
					joinedNode.innerNames.push innerNode.name
					joinedNode.count += innerNode.count
					
					sccNodesMap[innerNode.name] = joinedNode
					
				joinedNode.radius = Math.log(joinedNode.count)*1.5
				
				nodes.push joinedNode
				joinedNodesCount++
		
		
		nodesMap = @mapNodes nodes
		
		for link in data.links
			joinedLink = {}
			if sccNodesMap.hasOwnProperty(link.source.name)
				joinedLink.source = sccNodesMap[link.source.name]
			else
				joinedLink.source = nodesMap.get(link.source.name)
			if sccNodesMap.hasOwnProperty(link.target.name)
				joinedLink.target = sccNodesMap[link.target.name]
			else
				joinedLink.target = nodesMap.get(link.target.name)
			
			if joinedLink.target.name is joinedLink.source.name
				continue
			
			joinedLink.count = link.count
			
			if linksMap.hasOwnProperty("#{joinedLink.source.name}_#{joinedLink.target.name}")
				joinedLink.count += linksMap["#{joinedLink.source.name}_#{joinedLink.target.name}"].count
				joinedLink.value = Math.log(joinedLink.count) / 1.5
			else
				joinedLink.value = link.value
			
			linksMap["#{joinedLink.source.name}_#{joinedLink.target.name}"] = joinedLink
		
		for key, link of linksMap
			links.push link
		
		nodes: nodes
		links: links
	
	
	
	
	# **mapNodes** - helper function, maps node name's to node objects (d3.map of names -> nodes)
	#
	# * `nodes` - nodes' details
	mapNodes: (nodes) ->
		nodesMap = d3.map()
		nodes.forEach (n) =>
			nodesMap.set(n.name, n)
		nodesMap

	# **stackContains** - helper function, checks if nodes stack contains specified node
	#
	# * `stack` - stack of nodes
	# * `node` - node's details
	stackContains: (stack, node) ->
		for stackNode in stack
			if stackNode.name is stack.name
				return yes
		no
