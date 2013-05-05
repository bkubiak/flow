(function() {
  var App, Klass;

  App = {
    views: {},
    models: {},
    collections: {},
    routers: {}
  };

  Klass = {
    views: {},
    models: {},
    collections: {},
    routers: {}
  };

  window['App'] = App;

  window['Klass'] = Klass;

}).call(this);

(function() {

  Klass.routers.Main = Backbone.Router.extend({
    routes: {
      "domain": "showDomain",
      "dashboard": "showDashboard",
      "pageflows": "showPageflows",
      "pageflows/chart": "showPageflowsChart",
      "pageflows/*category": "showPageflowsDetails",
      "pageviews": "showPageviews",
      "pageviews/chart": "showPageviewsChart",
      "pageviews/*category": "showPageviewsDetails",
      "*notFound": "e404"
    },
    initialize: function(views, models, collections) {
      this.views = views;
      this.models = models;
      this.collections = collections;
    },
    e404: function(path) {
      return this.navigate('/dashboard', {
        trigger: true
      });
    },
    _navigateToDomain: function() {
      return this.navigate('/domain', {
        trigger: true
      });
    },
    showDomain: function() {
      if (!this.models.domain.has('domain')) {
        this.setTitle('Domain');
        return this.views.main.showDomainForm();
      } else {
        return this.navigate('/dashboard', {
          trigger: true
        });
      }
    },
    showDashboard: function() {
      if (!this.models.domain.has('domain')) {
        return this._navigateToDomain();
      }
      this.setTitle('Dashboard');
      return this.views.main.showSection('dashboard');
    },
    showPageflows: function() {
      if (!this.models.domain.has('domain')) {
        return this._navigateToDomain();
      }
      this.setTitle('Pageflows');
      this.views.main.showSection('pageflows');
      return this.views.pageflows.displayAction('viewBasic', {
        model: this.collections.pageflows
      });
    },
    showPageflowsChart: function() {
      if (!this.models.domain.has('domain')) {
        return this._navigateToDomain();
      }
      this.setTitle('Pageflows - chart');
      this.views.main.showSection('pageflows');
      return this.views.pageflows.displayAction('viewChart', {
        model: this.collections.pageflows
      });
    },
    showPageflowsDetails: function(category) {
      if (!this.models.domain.has('domain')) {
        return this._navigateToDomain();
      }
      this.setTitle('Pageflows - details');
      this.views.main.showSection('pageflows');
      return this.views.pageflows.displayAction('viewDetails', {
        model: this.collections.pageflows,
        category: category
      });
    },
    showPageviews: function() {
      if (!this.models.domain.has('domain')) {
        return this._navigateToDomain();
      }
      this.setTitle('Pageviews');
      this.views.main.showSection('pageviews');
      return this.views.pageviews.displayAction('viewBasic', {
        model: this.collections.pageviews
      });
    },
    showPageviewsChart: function() {
      if (!this.models.domain.has('domain')) {
        return this._navigateToDomain();
      }
      this.setTitle('Pageviews - chart');
      this.views.main.showSection('pageviews');
      return this.views.pageviews.displayAction('viewChart', {
        model: this.collections.pageviews
      });
    },
    showPageviewsDetails: function(category) {
      if (!this.models.domain.has('domain')) {
        return this._navigateToDomain();
      }
      this.setTitle('Pageviews - details');
      this.views.main.showSection('pageviews');
      return this.views.pageviews.displayAction('viewDetails', {
        model: this.collections.pageviews,
        category: category
      });
    }
  });

}).call(this);

(function() {

  Klass.models.Domain = Backbone.Model.extend({
    url: '/api/domain',
    idAttribute: '_id'
  });

}).call(this);

(function() {

  Klass.models.Graph = Backbone.Model.extend({
    pageflowsFetched: false,
    pageviewsFetched: false,
    initialize: function(attrs, pageviews, pageflows) {
      this.pageviews = pageviews;
      this.pageflows = pageflows;
    },
    fetch: function(opts) {
      var _this = this;
      this.pageflows.fetch({
        success: function() {
          _this.pageflowsFetched = true;
          if (_this.pageviewsFetched) {
            return opts.success();
          }
        }
      });
      return this.pageviews.fetch({
        success: function() {
          _this.pageviewsFetched = true;
          if (_this.pageflowsFetched) {
            return opts.success();
          }
        }
      });
    },
    getPageflowsMaxCount: function() {
      if (this.pageflowsFetched) {
        return this.pageflows.getMaxCount();
      } else {
        return false;
      }
    },
    getPageviewsMaxCount: function() {
      if (this.pageviewsFetched) {
        return this.pageviews.getMaxCount();
      } else {
        return false;
      }
    },
    getData: function(thresholdAlpha, thresholdBeta, width, height) {
      var arrAddedNodes, arrUrls, data, links, nodes, pageflow, pageflows, pageview, pageviews, rawData, url, viewCount, _i, _j, _len, _len1;
      if (!(this.pageflowsFetched && this.pageviewsFetched)) {
        return false;
      }
      pageflows = this.pageflows.getPageflowsCategory(thresholdAlpha);
      pageviews = this.pageviews.getPageviewsCategory(thresholdBeta);
      arrUrls = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = pageviews.length; _i < _len; _i++) {
          pageview = pageviews[_i];
          _results.push(pageview.get('url'));
        }
        return _results;
      })();
      pageflows = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = pageflows.length; _i < _len; _i++) {
          pageflow = pageflows[_i];
          pageflow = pageflow.toJSON();
          if (arrUrls.indexOf(pageflow.source_url) === -1 || arrUrls.indexOf(pageflow.dest_url) === -1) {
            continue;
          }
          _results.push(pageflow);
        }
        return _results;
      })();
      arrAddedNodes = [];
      nodes = [];
      for (_i = 0, _len = pageflows.length; _i < _len; _i++) {
        pageflow = pageflows[_i];
        if (arrAddedNodes.indexOf(pageflow.source_url) === -1) {
          arrAddedNodes.push(pageflow.source_url);
          viewCount = this.pageviews.get(pageflow.source_url).get('count');
          nodes.push({
            name: pageflow.source_url,
            count: viewCount
          });
        }
        if (arrAddedNodes.indexOf(pageflow.dest_url) === -1) {
          arrAddedNodes.push(pageflow.dest_url);
          viewCount = this.pageviews.get(pageflow.dest_url).get('count');
          nodes.push({
            name: pageflow.dest_url,
            count: viewCount
          });
        }
      }
      for (_j = 0, _len1 = pageviews.length; _j < _len1; _j++) {
        pageview = pageviews[_j];
        url = pageview.get('url');
        if (arrAddedNodes.indexOf(url) === -1) {
          arrAddedNodes.push(url);
          viewCount = pageview.get('count');
          nodes.push({
            name: url,
            count: viewCount
          });
        }
      }
      links = (function() {
        var _k, _len2, _results;
        _results = [];
        for (_k = 0, _len2 = pageflows.length; _k < _len2; _k++) {
          pageflow = pageflows[_k];
          _results.push({
            source: pageflow.source_url,
            target: pageflow.dest_url,
            count: pageflow.count
          });
        }
        return _results;
      })();
      rawData = {
        nodes: nodes,
        links: links
      };
      return data = this.setupRawData(rawData, width, height);
    },
    setupRawData: function(data, width, height) {
      var nodesMap,
        _this = this;
      data.nodes.forEach(function(n) {
        n.x = Math.floor(Math.random() * width);
        n.y = Math.floor(Math.random() * height);
        n.radius = Math.log(n.count) * 1.5;
        return n.group = 0;
      });
      nodesMap = this.mapNodes(data.nodes);
      data.links.forEach(function(l) {
        l.source = nodesMap.get(l.source);
        l.target = nodesMap.get(l.target);
        return l.value = Math.log(l.count) / 1.5;
      });
      return data;
    },
    scc: function(data) {
      var link, node, nodes, nodesMap, sccData, _i, _j, _k, _len, _len1, _len2, _ref;
      nodes = (function() {
        var _i, _len, _ref, _results;
        _ref = data.nodes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          _results.push($.extend({}, node, {
            index: -1,
            lowLink: -1,
            connections: []
          }));
        }
        return _results;
      })();
      nodesMap = this.mapNodes(nodes);
      _ref = data.links;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        for (_j = 0, _len1 = nodes.length; _j < _len1; _j++) {
          node = nodes[_j];
          if (link.source.name === node.name) {
            node.connections.push(nodesMap.get(link.target.name));
          }
        }
      }
      this.index = 0;
      this.stack = [];
      this.sccNodes = [];
      for (_k = 0, _len2 = nodes.length; _k < _len2; _k++) {
        node = nodes[_k];
        if (node.index < 0) {
          this.strongConnect(node);
        }
      }
      return sccData = this.setupSccData(this.sccNodes, data);
    },
    strongConnect: function(node) {
      var innerNodes, stackNode, v, w, _i, _j, _len, _len1, _ref, _ref1;
      node.index = this.index;
      node.lowLink = this.index;
      this.index++;
      this.stack.push(node);
      _ref = node.connections;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        w = _ref[_i];
        v = node;
        if (w.index < 0) {
          this.strongConnect(w);
          v.lowLink = Math.min(v.lowLink, w.lowLink);
        } else {
          _ref1 = this.stack;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            stackNode = _ref1[_j];
            if (stackNode.name === w.name) {
              v.lowLink = Math.min(v.lowLink, w.index);
            }
          }
        }
      }
      if (node.lowLink === node.index) {
        innerNodes = [];
        w = null;
        if (this.stack.length > 0) {
          w = this.stack.pop();
          innerNodes.push(w);
          while (node.name !== w.name) {
            w = this.stack.pop();
            innerNodes.push(w);
          }
        }
        if (innerNodes.length > 0) {
          return this.sccNodes.push(innerNodes);
        }
      }
    },
    setupSccData: function(sccNodes, data) {
      var innerNode, joinedLink, joinedNode, joinedNodesCount, key, link, links, linksMap, nodes, nodesMap, sccNode, sccNodesMap, _i, _j, _k, _len, _len1, _len2, _ref;
      nodes = [];
      links = [];
      joinedNodesCount = 0;
      nodesMap = this.mapNodes(data.nodes);
      sccNodesMap = {};
      linksMap = {};
      for (_i = 0, _len = sccNodes.length; _i < _len; _i++) {
        sccNode = sccNodes[_i];
        if (sccNode.length === 1) {
          nodes.push(nodesMap.get(sccNode[0].name));
        } else {
          joinedNode = {
            name: "joined_node_" + joinedNodesCount,
            innerNames: [],
            count: 0,
            x: sccNode[0].x,
            y: sccNode[0].y,
            group: 1
          };
          for (_j = 0, _len1 = sccNode.length; _j < _len1; _j++) {
            innerNode = sccNode[_j];
            joinedNode.innerNames.push(innerNode.name);
            joinedNode.count += innerNode.count;
            sccNodesMap[innerNode.name] = joinedNode;
          }
          joinedNode.radius = Math.log(joinedNode.count) * 1.5;
          nodes.push(joinedNode);
          joinedNodesCount++;
        }
      }
      nodesMap = this.mapNodes(nodes);
      _ref = data.links;
      for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
        link = _ref[_k];
        joinedLink = {};
        if (sccNodesMap.hasOwnProperty(link.source.name)) {
          joinedLink.source = sccNodesMap[link.source.name];
        } else {
          joinedLink.source = nodesMap.get(link.source.name);
        }
        if (sccNodesMap.hasOwnProperty(link.target.name)) {
          joinedLink.target = sccNodesMap[link.target.name];
        } else {
          joinedLink.target = nodesMap.get(link.target.name);
        }
        if (joinedLink.target.name === joinedLink.source.name) {
          continue;
        }
        joinedLink.count = link.count;
        if (linksMap.hasOwnProperty("" + joinedLink.source.name + "_" + joinedLink.target.name)) {
          joinedLink.count += linksMap["" + joinedLink.source.name + "_" + joinedLink.target.name].count;
          joinedLink.value = Math.log(joinedLink.count) / 1.5;
        } else {
          joinedLink.value = link.value;
        }
        linksMap["" + joinedLink.source.name + "_" + joinedLink.target.name] = joinedLink;
      }
      for (key in linksMap) {
        link = linksMap[key];
        links.push(link);
      }
      return {
        nodes: nodes,
        links: links
      };
    },
    mapNodes: function(nodes) {
      var nodesMap,
        _this = this;
      nodesMap = d3.map();
      nodes.forEach(function(n) {
        return nodesMap.set(n.name, n);
      });
      return nodesMap;
    },
    stackContains: function(stack, node) {
      var stackNode, _i, _len;
      for (_i = 0, _len = stack.length; _i < _len; _i++) {
        stackNode = stack[_i];
        if (stackNode.name === stack.name) {
          return true;
        }
      }
      return false;
    }
  });

}).call(this);

(function() {

  Klass.models.Menu = Backbone.Model.extend({
    nav: {
      'dashboard': {
        label: 'Dashboard'
      },
      'pageflows': {
        label: 'Pageflows'
      },
      'pageviews': {
        label: 'Pageviews'
      }
    }
  });

}).call(this);

(function() {

  Klass.models.Pageflow = Backbone.Model.extend({
    urlRoot: '/api/pageflows',
    idAttribute: 'url'
  });

}).call(this);

(function() {

  Klass.models.Pageview = Backbone.Model.extend({
    urlRoot: '/api/pageviews',
    idAttribute: 'url'
  });

}).call(this);

(function() {

  Klass.views.Dashboard = Backbone.View.extend({
    templateName: 'dashboard',
    modelFetched: false,
    coefficientAlpha: 0.2,
    coefficientBeta: 0.2,
    width: 960,
    height: 600,
    layout: 'random',
    scc: false,
    events: {
      'click .layout-container a': 'setLayout',
      'click #scc': 'bindSwitch'
    },
    initialize: function(opts) {
      this.domain = opts.domain;
      this.render();
      this.bindSliders();
      this.tooltip = Tooltip("flow-tooltip", 250);
      return this.placement = new Klass.views.Placement({
        domainName: this.domain.get('domain')
      });
    },
    show: function() {
      var _this = this;
      Backbone.View.prototype.show.call(this);
      if (!this.modelFetched) {
        return this.model.fetch({
          success: function() {
            return _this.onFetch();
          }
        });
      }
    },
    onFetch: function() {
      var _this = this;
      this.modelFetched = true;
      this.thresholdAlpha = this.computeThreshold('alpha');
      this.thresholdBeta = this.computeThreshold('beta');
      this.$('.pageflows-threshold').html(this.thresholdAlpha);
      this.$('.pageviews-threshold').html(this.thresholdBeta);
      return setTimeout(function() {
        return _this.drawChart();
      }, 100);
    },
    computeThreshold: function(type) {
      if (type === 'alpha') {
        return parseInt(Math.pow(this.coefficientAlpha, 4) * this.model.getPageflowsMaxCount());
      } else {
        return parseInt(Math.pow(this.coefficientBeta, 4) * this.model.getPageviewsMaxCount());
      }
    },
    bindSwitch: function(e) {
      var $switch,
        _this = this;
      $switch = $(e.currentTarget);
      if ($switch.hasClass('on')) {
        $switch.find('span.toggle').animate({
          left: -1
        }, 200, function() {
          return $switch.removeClass('on').addClass('off');
        });
        $switch.find('span.off-bg').animate({
          width: 60
        }, 300);
        $switch.find('span.off-text').animate({
          right: -2
        }, 50);
      } else {
        $switch.find('span.toggle').animate({
          left: 44
        }, 200, function() {
          return $switch.removeClass('off').addClass('on');
        });
        $switch.find('span.off-bg').animate({
          width: 0
        }, 100);
        $switch.find('span.off-text').delay(150).animate({
          right: -5
        }, 50);
      }
      this.scc = !this.scc;
      this.$('.scc-container a').toggleClass('enabled');
      return this.drawChart();
    },
    bindSliders: function() {
      var _this = this;
      this.$('#slider-alpha').slider({
        range: 'min',
        animate: true,
        value: 0.2,
        min: 0.01,
        max: 0.99,
        step: 0.01,
        slide: function(event, ui) {
          return _this.$('.slider-alpha-container .coefficient .value').html(ui.value);
        },
        change: function(event, ui) {
          _this.coefficientAlpha = ui.value;
          _this.thresholdAlpha = _this.computeThreshold('alpha');
          _this.$('.pageflows-threshold').html(_this.thresholdAlpha);
          return _this.drawChart();
        }
      });
      return this.$('#slider-beta').slider({
        range: 'min',
        animate: true,
        value: 0.2,
        min: 0.01,
        max: 0.99,
        step: 0.01,
        slide: function(event, ui) {
          return _this.$('.slider-beta-container .coefficient .value').html(ui.value);
        },
        change: function(event, ui) {
          _this.coefficientBeta = ui.value;
          _this.thresholdBeta = _this.computeThreshold('beta');
          _this.$('.pageviews-threshold').html(_this.thresholdBeta);
          return _this.drawChart();
        }
      });
    },
    drawChart: function() {
      var svg;
      this.data = this.model.getData(this.thresholdAlpha, this.thresholdBeta, this.width, this.height);
      if (this.scc) {
        this.data = this.model.scc(this.data);
        console.log(this.data);
      }
      this.$('.nodes-count').html(this.data.nodes.length);
      if (this.force != null) {
        this.force.stop();
      }
      this.force = d3.layout.force().linkDistance(100).size([this.width, this.height]);
      d3.select("#dashboard svg").remove();
      svg = d3.select("#dashboard .chart").append("svg").attr("width", this.width).attr("height", this.height);
      this.linksG = svg.append("g").attr("id", "links");
      this.nodesG = svg.append("g").attr("id", "nodes");
      return this.setLayout(this.layout);
    },
    getTooltipContent: function(node) {
      var content, domain, innerName, link, linkDetails, linkName, linksMaxNumber, name, namesMaxNumber, search, _i, _j, _k, _len, _len1, _len2, _ref, _ref1,
        _this = this;
      domain = this.domain.get('domain');
      search = new RegExp("https?:\/\/" + domain);
      name = node.name !== ("http://" + domain + "/") ? node.name.replace(search, '') : node.name;
      content = '<p class="main">' + name + '</p>';
      content += '<p class="main">pageviews: ' + node.count + '</p>';
      if (node.innerNames != null) {
        content += '<p class="line"></p><p class="main">Joined nodes (' + node.innerNames.length + ')</p>';
        namesMaxNumber = 5;
        _ref = node.innerNames;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          innerName = _ref[_i];
          if (namesMaxNumber === 0) {
            break;
          }
          innerName = innerName !== ("http://" + domain + "/") ? innerName.replace(search, '') : innerName;
          if (innerName.length > 30) {
            innerName = innerName.substr(0, 28) + '...';
          }
          content += '<p class="link">&diams; ' + innerName + '</p>';
          namesMaxNumber--;
        }
        if (node.innerNames.length > 5) {
          content += '<p class="link">...</p>';
        }
      }
      linkDetails = [];
      _ref1 = this.curLinksData;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        link = _ref1[_j];
        if (link.source.name === node.name) {
          linkName = link.target.name !== ("http://" + domain + "/") ? link.target.name.replace(search, '') : link.target.name;
          if (linkName.length > 30) {
            linkName = linkName.substr(0, 28) + '...';
          }
          linkDetails.push({
            name: linkName,
            count: link.count
          });
        }
      }
      if (linkDetails.length) {
        linkDetails = linkDetails.sort(function(a, b) {
          return b.count - a.count;
        });
        content += '<p class="line"></p><p class="main">Links pageflows (' + linkDetails.length + ')</p>';
        linksMaxNumber = 5;
        for (_k = 0, _len2 = linkDetails.length; _k < _len2; _k++) {
          link = linkDetails[_k];
          if (linksMaxNumber === 0) {
            break;
          }
          content += '<p class="link">&diams; ' + link.name + ' &ndash; ' + link.count + '</p>';
          linksMaxNumber--;
        }
        if (linkDetails.length > 5) {
          content += '<p class="link">...</p>';
        }
      }
      return content;
    },
    onMouseOver: function(d) {
      var _this = this;
      this.tooltip.showTooltip(this.getTooltipContent(d), d3.event);
      if (this.link) {
        this.link.style("stroke", function(l) {
          if (l.source === d) {
            return "#fff";
          } else {
            return "#aaa";
          }
        });
        this.link.style("stroke-opacity", function(l) {
          if (l.source === d) {
            return 1.0;
          } else {
            return 0.3;
          }
        });
      }
      return this.node.style("stroke", function(n) {
        if (n.index === d.index) {
          return "#fff";
        } else {
          return "#aaa";
        }
      });
    },
    onMouseOut: function(d) {
      this.tooltip.hideTooltip();
      if (this.link) {
        this.link.style("stroke", "#aaa").style("stroke-opacity", 0.5);
      }
      return this.node.style("stroke", "#ccc");
    },
    updateNodes: function() {
      var nodeColors,
        _this = this;
      nodeColors = d3.scale.category20();
      this.node = this.nodesG.selectAll("circle.node").data(this.curNodesData, function(d) {
        return d.name;
      });
      this.node.enter().append("circle").attr("class", "node").attr("cx", function(d) {
        return d.x;
      }).attr("cy", function(d) {
        return d.y;
      }).attr("r", function(d) {
        return d.radius;
      }).style("fill", function(d) {
        return nodeColors(d.group);
      });
      this.node.on("mouseover", _.bind(this.onMouseOver, this)).on("mouseout", _.bind(this.onMouseOut, this));
      return this.node.exit().remove();
    },
    updateLinks: function() {
      var _this = this;
      this.link = this.linksG.selectAll("line.link").data(this.curLinksData, function(d) {
        return "" + d.source.name + "_" + d.target.name;
      });
      this.link.enter().append("line").attr("class", "link").attr("x1", function(d) {
        return d.source.x;
      }).attr("y1", function(d) {
        return d.source.y;
      }).attr("x2", function(d) {
        return d.target.x;
      }).attr("y2", function(d) {
        return d.target.y;
      }).style("stroke-width", function(d) {
        return d.value;
      });
      return this.link.exit().remove();
    },
    setLayout: function(e) {
      var isEvent, layout,
        _this = this;
      isEvent = typeof e.isDefaultPrevented !== 'undefined';
      if (isEvent) {
        e.preventDefault();
        layout = $(e.currentTarget).attr('id');
      } else {
        layout = e;
      }
      this.layout = layout;
      this.$('.layout-container a').removeClass('active');
      this.$("#" + layout).addClass('active');
      this.force.stop();
      this.force.on('tick', function(e) {
        var k;
        k = e.alpha * 0.1;
        _this.node.each(function(d) {
          var targetPlacement;
          targetPlacement = _this.placement.getPlacement(d.name);
          d.x += (targetPlacement.x - d.x) * k;
          return d.y += (targetPlacement.y - d.y) * k;
        });
        _this.node.attr("cx", function(d) {
          return d.x;
        }).attr("cy", function(d) {
          return d.y;
        });
        if (e.alpha < 0.03) {
          _this.force.stop();
          return _this.updateLinks();
        }
      });
      return this.update();
    },
    update: function() {
      var names, node;
      this.curNodesData = this.data.nodes;
      this.curLinksData = this.data.links;
      names = (function() {
        var _i, _len, _ref, _results;
        _ref = this.curNodesData;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          _results.push(node.name);
        }
        return _results;
      }).call(this);
      if (this.layout === 'radial') {
        this.force.charge(-100);
        this.placement.radialPlacement(names, {
          x: this.width / 2,
          y: this.height / 2
        }, 250, 20, -120);
      } else {
        this.force.charge(-200);
        this.placement.randomPlacement(names, this.width, this.height);
      }
      this.force.nodes(this.curNodesData);
      this.updateNodes();
      this.force.links([]);
      if (this.link) {
        this.link.data([]).exit().remove();
        this.link = null;
      }
      return this.force.start();
    }
  });

}).call(this);

(function() {

  Klass.views.Domain = Backbone.View.extend({
    templateName: 'domain',
    events: {
      'submit': 'setDomain'
    },
    initialize: function(opts) {
      return this.render();
    },
    setDomain: function(e) {
      var $input, domain,
        _this = this;
      e.preventDefault();
      $input = this.$('input[type=text]');
      domain = $input.val();
      if (!domain.length) {
        $input.addClass('error').focus();
        return;
      }
      return this.model.save({
        domain: $.trim($input.val())
      }, {
        success: function() {
          $input.val('');
          return _this.navigate('/dashboard', {
            trigger: true
          });
        }
      });
    }
  });

}).call(this);

(function() {

  Klass.views.Main = Backbone.View.extend({
    templateName: 'main',
    events: {
      'click a': 'navigate'
    },
    initialize: function(opts) {
      this.menu = opts.menu, this.domain = opts.domain, this.views = opts.views, this.graph = opts.graph;
      return this.render();
    },
    render: function() {
      Backbone.View.prototype.render.call(this);
      this.views.top = new Klass.views.Top({
        el: this.$('#top'),
        model: this.menu,
        domain: this.domain
      });
      this.renderSections();
      return this.views.domain = new Klass.views.Domain({
        el: this.$('#domain'),
        model: this.domain
      });
    },
    renderSections: function() {
      this.views.dashboard = new Klass.views.Dashboard({
        el: this.$('#content'),
        model: this.graph,
        domain: this.domain
      });
      this.views.pageflows = new Klass.views.Pageflows({
        el: this.$('#content')
      });
      return this.views.pageviews = new Klass.views.Pageviews({
        el: this.$('#content')
      });
    },
    showSection: function(section) {
      this.views.domain.hide();
      this._hideAllSections();
      this.$('#top').show();
      this.menu.set('active', section);
      return this.views[section].show();
    },
    showDomainForm: function() {
      this._hideAllSections();
      this.$('#top').hide();
      return this.views.domain.show();
    },
    _hideAllSections: function() {
      return this.$('#content > .section').hide();
    }
  });

}).call(this);

(function() {

  Klass.views.PageflowsViewBasic = Backbone.View.extend({
    templateName: 'pageflowsViewBasic',
    isEmpty: false,
    initialize: function(opts) {
      var _this = this;
      return this.model.fetch({
        success: function() {
          _this.isEmpty = false;
          return _this.render();
        },
        error: function() {
          _this.isEmpty = true;
          return _this.render();
        }
      });
    },
    templateHash: function() {
      return {
        isEmpty: this.isEmpty,
        cat1Count: this.model.getPageflowsCategory(1, 5).length,
        cat2Count: this.model.getPageflowsCategory(6, 10).length,
        cat3Count: this.model.getPageflowsCategory(11, 50).length,
        cat4Count: this.model.getPageflowsCategory(51, 100).length,
        cat5Count: this.model.getPageflowsCategory(101, 500).length,
        cat6Count: this.model.getPageflowsCategory(501, 1000).length,
        cat7Count: this.model.getPageflowsCategory(1001).length
      };
    }
  });

}).call(this);

(function() {

  Klass.views.PageflowsViewChart = Backbone.View.extend({
    templateName: 'pageflowsViewChart',
    isEmpty: false,
    initialize: function(opts) {
      var _this = this;
      return this.model.fetch({
        success: function() {
          _this.isEmpty = false;
          _this.render();
          return _this.drawChart();
        },
        error: function() {
          _this.isEmpty = true;
          return _this.render();
        }
      });
    },
    templateHash: function() {
      return {
        isEmpty: this.isEmpty
      };
    },
    drawChart: function() {
      var area, data, height, margin, svg, width, x, xAxis, y, yAxis,
        _this = this;
      width = 750;
      height = 400;
      margin = {
        top: 75,
        right: 75,
        bottom: 75,
        left: 75
      };
      x = d3.scale.linear().range([0, width]);
      y = d3.scale.linear().range([height, 0]);
      xAxis = d3.svg.axis().scale(x).orient("bottom");
      yAxis = d3.svg.axis().scale(y).orient("left");
      area = d3.svg.area().x(function(d) {
        return x(d.index);
      }).y0(height).y1(function(d) {
        return y(d.count);
      });
      d3.select("#pageflows svg").remove();
      svg = d3.select("#pageflows .pageflows-chart").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      data = this.getData();
      x.domain([
        0, d3.max(data, function(d) {
          return d.index;
        })
      ]);
      y.domain([
        0, d3.max(data, function(d) {
          return d.count;
        })
      ]);
      svg.append("path").datum(data).attr("class", "area").attr("d", area);
      svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis).append("text").text("index").attr("x", width).attr("y", 40).style("fill", "#888").style("text-anchor", "end");
      return svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 20).attr("dy", "5px").text("pageflow count").style("fill", "#888").style("text-anchor", "end");
    },
    getData: function() {
      var index, pageflow, pageflows, pageflowsModel, pageflowsModels, _i, _len, _results;
      pageflowsModels = this.model.getPageflowsCategory(2, this.model.at(this.model.length - 2).get('count'));
      pageflows = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = pageflowsModels.length; _i < _len; _i++) {
          pageflowsModel = pageflowsModels[_i];
          _results.push(pageflowsModel.toJSON());
        }
        return _results;
      })();
      _results = [];
      for (index = _i = 0, _len = pageflows.length; _i < _len; index = ++_i) {
        pageflow = pageflows[index];
        _results.push({
          count: pageflow.count,
          index: index
        });
      }
      return _results;
    }
  });

}).call(this);

(function() {

  Klass.views.PageflowsViewDetails = Backbone.View.extend({
    templateName: 'pageflowsViewDetails',
    initialize: function(opts) {
      var bounds, category,
        _this = this;
      category = opts.category;
      if (!/^(1|6|11|51|101|501|1001)-(5|10|50|100|500|1000|oo)$/.test(category)) {
        this.navigate('/pageflows');
        return;
      }
      bounds = category.split('-');
      this.bound = {
        lower: bounds[0],
        upper: bounds[1] === 'oo' ? null : bounds[1]
      };
      return this.model.fetch({
        success: function() {
          return _this.render();
        }
      });
    },
    templateHash: function() {
      var pageflowModel, pageflows, pageflowsModels;
      pageflowsModels = this.model.getPageflowsCategory(this.bound.lower, this.bound.upper);
      pageflows = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = pageflowsModels.length; _i < _len; _i++) {
          pageflowModel = pageflowsModels[_i];
          _results.push(pageflowModel.toJSON());
        }
        return _results;
      })();
      return {
        pageflows: pageflows,
        bounds: "" + this.bound.lower + "-" + this.bound.upper
      };
    }
  });

}).call(this);

(function() {

  Klass.views.Pageflows = Backbone.View.extend({
    templateName: 'pageflows',
    action: null,
    initialize: function(opts) {
      this.render();
      return this.views = {};
    },
    displayAction: function(action, opts) {
      var cls;
      if (this.views[this.action] != null) {
        this.views[this.action].remove();
      }
      this.action = action;
      if (this.action === 'viewDetails' || this.action === 'viewChart') {
        this.$('.back').show();
      } else {
        this.$('.back').hide();
      }
      opts = opts || {};
      opts.el = this.$('.tile');
      cls = action.substr(0, 1).toUpperCase() + action.substr(1);
      return this.views[action] = new Klass.views["Pageflows" + cls](opts);
    }
  });

}).call(this);

(function() {

  Klass.views.PageviewsViewBasic = Backbone.View.extend({
    templateName: 'pageviewsViewBasic',
    isEmpty: false,
    initialize: function(opts) {
      var _this = this;
      return this.model.fetch({
        success: function() {
          _this.isEmpty = false;
          return _this.render();
        },
        error: function() {
          _this.isEmpty = true;
          return _this.render();
        }
      });
    },
    templateHash: function() {
      return {
        isEmpty: this.isEmpty,
        cat1Count: this.model.getPageviewsCategory(1, 5).length,
        cat2Count: this.model.getPageviewsCategory(6, 10).length,
        cat3Count: this.model.getPageviewsCategory(11, 50).length,
        cat4Count: this.model.getPageviewsCategory(51, 100).length,
        cat5Count: this.model.getPageviewsCategory(101, 500).length,
        cat6Count: this.model.getPageviewsCategory(501, 1000).length,
        cat7Count: this.model.getPageviewsCategory(1001).length
      };
    }
  });

}).call(this);

(function() {

  Klass.views.PageviewsViewChart = Backbone.View.extend({
    templateName: 'pageviewsViewChart',
    isEmpty: false,
    initialize: function(opts) {
      var _this = this;
      return this.model.fetch({
        success: function() {
          _this.isEmpty = false;
          _this.render();
          return _this.drawChart();
        },
        error: function() {
          _this.isEmpty = true;
          return _this.render();
        }
      });
    },
    templateHash: function() {
      return {
        isEmpty: this.isEmpty
      };
    },
    drawChart: function() {
      var area, data, height, margin, svg, width, x, xAxis, y, yAxis,
        _this = this;
      width = 750;
      height = 400;
      margin = {
        top: 75,
        right: 75,
        bottom: 75,
        left: 75
      };
      x = d3.scale.linear().range([0, width]);
      y = d3.scale.linear().range([height, 0]);
      xAxis = d3.svg.axis().scale(x).orient("bottom");
      yAxis = d3.svg.axis().scale(y).orient("left");
      area = d3.svg.area().x(function(d) {
        return x(d.index);
      }).y0(height).y1(function(d) {
        return y(d.count);
      });
      d3.select("#pageviews svg").remove();
      svg = d3.select("#pageviews .pageviews-chart").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      data = this.getData();
      x.domain([
        0, d3.max(data, function(d) {
          return d.index;
        })
      ]);
      y.domain([
        0, d3.max(data, function(d) {
          return d.count;
        })
      ]);
      svg.append("path").datum(data).attr("class", "area").attr("d", area);
      svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis).append("text").text("index").attr("x", width).attr("y", 40).style("fill", "#888").style("text-anchor", "end");
      return svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 20).attr("dy", "5px").text("pageview count").style("fill", "#888").style("text-anchor", "end");
    },
    getData: function() {
      var index, pageview, pageviews, pageviewsModel, pageviewsModels, _i, _len, _results;
      pageviewsModels = this.model.getPageviewsCategory(2, this.model.at(this.model.length - 2).get('count'));
      pageviews = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = pageviewsModels.length; _i < _len; _i++) {
          pageviewsModel = pageviewsModels[_i];
          _results.push(pageviewsModel.toJSON());
        }
        return _results;
      })();
      _results = [];
      for (index = _i = 0, _len = pageviews.length; _i < _len; index = ++_i) {
        pageview = pageviews[index];
        _results.push({
          count: pageview.count,
          index: index
        });
      }
      return _results;
    }
  });

}).call(this);

(function() {

  Klass.views.PageviewsViewDetails = Backbone.View.extend({
    templateName: 'pageviewsViewDetails',
    initialize: function(opts) {
      var bounds, category,
        _this = this;
      category = opts.category;
      if (!/^(1|6|11|51|101|501|1001)-(5|10|50|100|500|1000|oo)$/.test(category)) {
        this.navigate('/pageviews');
        return;
      }
      bounds = category.split('-');
      this.bound = {
        lower: bounds[0],
        upper: bounds[1] === 'oo' ? null : bounds[1]
      };
      return this.model.fetch({
        success: function() {
          return _this.render();
        }
      });
    },
    templateHash: function() {
      var pageviewModel, pageviews, pageviewsModels;
      pageviewsModels = this.model.getPageviewsCategory(this.bound.lower, this.bound.upper);
      pageviews = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = pageviewsModels.length; _i < _len; _i++) {
          pageviewModel = pageviewsModels[_i];
          _results.push(pageviewModel.toJSON());
        }
        return _results;
      })();
      return {
        pageviews: pageviews,
        bounds: "" + this.bound.lower + "-" + this.bound.upper
      };
    }
  });

}).call(this);

(function() {

  Klass.views.Pageviews = Backbone.View.extend({
    templateName: 'pageviews',
    action: null,
    initialize: function(opts) {
      this.render();
      return this.views = {};
    },
    displayAction: function(action, opts) {
      var cls;
      if (this.views[this.action] != null) {
        this.views[this.action].remove();
      }
      this.action = action;
      if (this.action === 'viewDetails' || this.action === 'viewChart') {
        this.$('.back').show();
      } else {
        this.$('.back').hide();
      }
      opts = opts || {};
      opts.el = this.$('.tile');
      cls = action.substr(0, 1).toUpperCase() + action.substr(1);
      return this.views[action] = new Klass.views["Pageviews" + cls](opts);
    }
  });

}).call(this);

(function() {

  Klass.views.Placement = Backbone.View.extend({
    currentAngle: 0,
    initialize: function(opts) {
      return this.domainName = opts.domainName, opts;
    },
    getPlacement: function(key) {
      var value;
      value = this.values.get(key);
      if (!this.values.has(key)) {
        value = place(key);
      }
      return value;
    },
    randomPlacement: function(keys, width, height) {
      var _this = this;
      this.values = d3.map();
      return keys.forEach(function(k) {
        return _this.values.set(k, {
          x: Math.floor(Math.random() * width),
          y: Math.floor(Math.random() * height)
        });
      });
    },
    radialPlacement: function(keys, center, radius, increment, start) {
      var firstCircleCount, firstCircleKeys, homepage, secondCircleKeys,
        _this = this;
      this.currentAngle = start;
      this.values = d3.map();
      homepage = "http://" + this.domainName + "/";
      this.values.set(homepage, center);
      keys.splice(keys.indexOf(homepage), 1);
      firstCircleCount = 360 / increment;
      if (keys.length < firstCircleCount) {
        increment = 360 / keys.length;
      }
      firstCircleKeys = keys.slice(0, firstCircleCount);
      firstCircleKeys.forEach(function(k) {
        return _this.placeOnCircle(k, center, radius, increment);
      });
      secondCircleKeys = keys.slice(firstCircleCount);
      radius = radius + radius / 1.8;
      increment = 360 / secondCircleKeys.length;
      return secondCircleKeys.forEach(function(k) {
        return _this.placeOnCircle(k, center, radius, increment);
      });
    },
    placeOnCircle: function(key, center, radius, increment) {
      this.values.set(key, {
        x: center.x + radius * Math.cos(this.currentAngle * Math.PI / 180),
        y: center.y + radius * Math.sin(this.currentAngle * Math.PI / 180)
      });
      return this.currentAngle += increment;
    }
  });

}).call(this);

(function() {

  Klass.views.Top = Backbone.View.extend({
    templateName: 'top',
    events: {
      'click .delete': 'deleteDomain'
    },
    initialize: function(opts) {
      this.domain = opts.domain;
      this.render();
      this.model.on('change:active', this.setActive, this);
      return this.domain.on('change:domain', this.render, this);
    },
    templateHash: function() {
      return {
        menu: this.model.nav,
        domain: this.domain.get('domain')
      };
    },
    setActive: function() {
      var active;
      this.$('li.active').removeClass('active');
      active = this.model.get('active');
      return this.$("li[data-section=" + active + "]").addClass('active');
    },
    deleteDomain: function(e) {
      var _this = this;
      e.preventDefault();
      return this.domain.destroy({
        success: function() {
          _this.domain.clear();
          return _this.navigate('/domain');
        }
      });
    }
  });

}).call(this);

(function() {

  Klass.collections.Pageflows = Backbone.Collection.extend({
    model: Klass.models.Pageflow,
    fetched: null,
    url: function() {
      return "/api/pageflows/" + (this.domain.get('domain'));
    },
    initialize: function(attrs, domain) {
      this.domain = domain;
    },
    comparator: function(pageflow) {
      return pageflow.get('count');
    },
    fetch: function(opts) {
      var success,
        _this = this;
      opts = opts || {};
      if (this.fetched === this.domain.get('domain')) {
        if (opts.success != null) {
          return opts.success();
        }
      } else {
        success = opts.success;
        opts.success = function() {
          _this.fetched = _this.domain.get('domain');
          return success();
        };
        return Backbone.Collection.prototype.fetch.call(this, opts);
      }
    },
    getPageflowsCategory: function(lowerBound, upperBound) {
      var _this = this;
      return this.filter(function(pageflow) {
        if (upperBound != null) {
          return pageflow.get('count') >= lowerBound && pageflow.get('count') <= upperBound;
        } else {
          return pageflow.get('count') >= lowerBound;
        }
      });
    },
    getMaxCount: function() {
      return this.last().get('count');
    }
  });

}).call(this);

(function() {

  Klass.collections.Pageviews = Backbone.Collection.extend({
    model: Klass.models.Pageview,
    fetched: null,
    url: function() {
      return "/api/pageviews/" + (this.domain.get('domain'));
    },
    initialize: function(attrs, domain) {
      this.domain = domain;
    },
    comparator: function(pageview) {
      return pageview.get('count');
    },
    fetch: function(opts) {
      var success,
        _this = this;
      opts = opts || {};
      if (this.fetched === this.domain.get('domain')) {
        if (opts.success != null) {
          return opts.success();
        }
      } else {
        success = opts.success;
        opts.success = function() {
          _this.fetched = _this.domain.get('domain');
          return success();
        };
        return Backbone.Collection.prototype.fetch.call(this, opts);
      }
    },
    getPageviewsCategory: function(lowerBound, upperBound) {
      var _this = this;
      return this.filter(function(pageview) {
        if (upperBound != null) {
          return pageview.get('count') >= lowerBound && pageview.get('count') <= upperBound;
        } else {
          return pageview.get('count') >= lowerBound;
        }
      });
    },
    getMaxCount: function() {
      return this.last().get('count');
    }
  });

}).call(this);

(function() {

  App.templates = function(name) {
    return jade.templates[name];
  };

  App.initModels = function() {
    this.models.domain = new Klass.models.Domain();
    this.models.menu = new Klass.models.Menu({});
    this.collections.pageviews = new Klass.collections.Pageviews({}, this.models.domain);
    this.collections.pageflows = new Klass.collections.Pageflows({}, this.models.domain);
    return this.models.graph = new Klass.models.Graph({}, this.collections.pageviews, this.collections.pageflows);
  };

  App.init = function() {
    var _this = this;
    this.initModels();
    return this.models.domain.fetch().always(function() {
      _this.views.main = new Klass.views.Main({
        el: 'body',
        menu: _this.models.menu,
        domain: _this.models.domain,
        graph: _this.models.graph,
        views: _this.views
      });
      _this.routers.main = new Klass.routers.Main(_this.views, _this.models, _this.collections);
      return Backbone.history.start({
        pushState: true
      });
    });
  };

  $(function() {
    return App.init();
  });

}).call(this);
