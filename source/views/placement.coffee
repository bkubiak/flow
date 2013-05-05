# **Placement** view class responsible for placement of nodes in graph
Klass.views.Placement = Backbone.View.extend

	currentAngle: 0
	
	# **initialize** - class constructor
	initialize: (opts) ->
		{@domainName} = opts
	
	# **getPlacement** - gets coordinates for specified node
	#
	# * `key` - node's id
	getPlacement: (key) ->
		value = @values.get(key)
		if !@values.has(key)
			value = place(key)
		value
	
	# **randomPlacement** - responsible for random placement of nodes
	#
	# * `keys` - nodes' ids
	# * `width` - graph layout width
	# * `height` - graph layout height
	randomPlacement: (keys, width, height) ->
		@values = d3.map()
		
		keys.forEach (k) =>
			@values.set k,
				x: Math.floor(Math.random()*width)
				y: Math.floor(Math.random()*height)
		
	
	# **radialPlacement** - responsible for radial placement of nodes
	#
	# * `keys` - nodes' ids
	# * `center` - graph layout center
	# * `radius` - first circle radius
	# * `increment` - increment angle value
	# * `start` - start angle value
	radialPlacement: (keys, center, radius, increment, start) ->
		@currentAngle = start
		
		@values = d3.map()

		# place homepage in the center if there is homepage
		homepage = "http://#{@domainName}/"
		unless keys.indexOf(homepage) is -1
			@values.set homepage, center
			keys.splice keys.indexOf(homepage), 1
		
		# number of keys to go in first circle
		firstCircleCount = 360 / increment

		# if we don't have enough keys, modify increment
		# so that they all fit in one circle
		if keys.length < firstCircleCount
			increment = 360 / keys.length

		# set locations for inner circle
		firstCircleKeys = keys.slice(0,firstCircleCount)
		firstCircleKeys.forEach (k) => @placeOnCircle(k, center, radius, increment)

		# set locations for outer circle
		secondCircleKeys = keys.slice(firstCircleCount)

		# setup outer circle
		radius = radius + radius / 1.8
		increment = 360 / secondCircleKeys.length

		secondCircleKeys.forEach (k) => @placeOnCircle(k, center, radius, increment)
	
	# **placeOnCircle** - computes coordinates for a node to place it on a circle
	#
	# * `key` - node's id
	# * `center` - graph layout center
	# * `radius` - first circle radius
	# * `increment` - increment angle value
	placeOnCircle: (key, center, radius, increment) ->
		@values.set key,
			x: (center.x + radius * Math.cos(@currentAngle * Math.PI / 180))
			y: (center.y + radius * Math.sin(@currentAngle * Math.PI / 180))

		@currentAngle += increment