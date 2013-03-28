Klass.models.Graph = Backbone.Model.extend
	
	pageflowsFetched: no
	pageviewsFetched: no
	
	initialize: (attrs, @pageviews, @pageflows) ->
	
	fetch: (opts) ->
		@pageflows.fetch
			success: =>
				@pageflowsFetched = yes
				if @pageviewsFetched then opts.success()
	
		@pageviews.fetch
			success: =>
				@pageviewsFetched = yes
				if @pageflowsFetched then opts.success()
	
	getPageflowsMaxCount: ->
		if @pageflowsFetched then @pageflows.getMaxCount() else no
	
	getPageviewsMaxCount: ->
		if @pageviewsFetched then @pageviews.getMaxCount() else no
	
	
	
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
	
	
	# extend data for radius, x & y pos, value;
	# also source and target points to node instead of name
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
			l.value = Math.log(l.count)/1.5

		data



	
	# implementation of Tarjan's strongly connected components algorithm
	scc: (data) ->
		nodes = for node in data.nodes
			# if node.name is 'http://www.livechatinc.com/' or node.name is 'https://www.livechatinc.com/signup/' then continue
			$.extend {}, node,
				index: -1
				lowLink: -1
				connections: []
		
		nodesMap = @mapNodes nodes

		for link in data.links
			for node in nodes
				if link.source.name is node.name
					# unless link.target.name is 'http://www.livechatinc.com/' or link.target.name is 'https://www.livechatinc.com/signup/'
					node.connections.push nodesMap.get(link.target.name)

		@index = 0
		@stack = []
		@sccNodes = []

		for node in nodes
			if node.index < 0
				@strongConnect node

		sccData = @setupSccData @sccNodes, data

	
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
				joinedLink.value = Math.log(joinedLink.count)/1.5
			else
				joinedLink.value = link.value
			
			linksMap["#{joinedLink.source.name}_#{joinedLink.target.name}"] = joinedLink
		
		for key, link of linksMap
			links.push link
		
		nodes: nodes
		links: links
	
	
	
	
	# helper - map node name's to node objects (d3.map of names -> nodes)
	mapNodes: (nodes) ->
		nodesMap = d3.map()
		nodes.forEach (n) =>
			nodesMap.set(n.name, n)
		nodesMap

	# helper - check if nodes stack contains specified node
	stackContains: (stack, node) ->
		for stackNode in stack
			if stackNode.name is stack.name
				return yes
		no
	
	
	
	
	
	
	