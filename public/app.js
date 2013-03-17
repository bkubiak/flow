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
      "pagelinks": "showPagelinks",
      "pagelinks/*baseUrl": "showPagelinksDetails",
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
    },
    showPagelinks: function() {
      if (!this.models.domain.has('domain')) {
        return this._navigateToDomain();
      }
      this.setTitle('Pagelinks');
      this.views.main.showSection('pagelinks');
      return this.views.pagelinks.displayAction('viewBasic', {
        model: this.collections.pagelinks
      });
    },
    showPagelinksDetails: function(baseUrl) {
      if (!this.models.domain.has('domain')) {
        return this._navigateToDomain();
      }
      this.setTitle('Pagelinks - details');
      this.views.main.showSection('pagelinks');
      return this.views.pagelinks.displayAction('viewDetails', {
        model: this.collections.pagelinks,
        baseUrl: baseUrl
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
      },
      'pagelinks': {
        label: 'Pagelinks'
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

  Klass.models.Pagelink = Backbone.Model.extend({
    urlRoot: '/api/pagelinks/www.restauracja-laura.pl',
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
    coefficientApha: 0.2,
    coefficientBeta: 0.2,
    thresholdAlpha: 2,
    thresholdBeta: 42,
    pageflowsFetched: false,
    pageviewsFetched: false,
    modelFetched: false,
    initialize: function(opts) {
      this.pageflows = opts.pageflows, this.pageviews = opts.pageviews;
      this.render();
      return this.bindSliders();
    },
    show: function() {
      var _this = this;
      Backbone.View.prototype.show.call(this);
      if (!this.modelFetched) {
        this.pageflows.fetch({
          success: function() {
            _this.pageflowsFetched = true;
            if (_this.pageviewsFetched) {
              _this.drawChart();
              return _this.modelFetched = true;
            }
          }
        });
        return this.pageviews.fetch({
          success: function() {
            _this.pageviewsFetched = true;
            if (_this.pageflowsFetched) {
              _this.drawChart();
              return _this.modelFetched = true;
            }
          }
        });
      }
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
          _this.coefficientApha = ui.value;
          _this.thresholdAlpha = parseInt(Math.pow(_this.coefficientApha, 4) * _this.pageflows.getMaxCount());
          _this.$('.slider-alpha-container .threshold .value').html(_this.thresholdAlpha);
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
          _this.thresholdBeta = parseInt(Math.pow(_this.coefficientBeta, 4) * _this.pageviews.getMaxCount());
          _this.$('.slider-beta-container .threshold .value').html(_this.thresholdBeta);
          return _this.drawChart();
        }
      });
    },
    drawChart: function() {
      var color, force, graph, height, link, node, svg, tooltip, width,
        _this = this;
      width = 960;
      height = 500;
      color = d3.scale.category20();
      force = d3.layout.force().charge(-120).linkDistance(100).size([width, height]);
      d3.select("#dashboard svg").remove();
      d3.select(".tooltip").remove();
      svg = d3.select("#dashboard").append("svg").attr("width", width).attr("height", height);
      graph = this.getData();
      console.log(graph);
      force.nodes(graph.nodes).links(graph.links).start();
      link = svg.selectAll(".link").data(graph.links).enter().append("line").attr("class", "link").style("stroke-width", function(d) {
        return Math.sqrt(d.value);
      });
      node = svg.selectAll(".node").data(graph.nodes).enter().append("circle").attr("class", "node").attr("r", 5).style("fill", function(d) {
        return color(d.group);
      }).call(force.drag);
      tooltip = Tooltip("flow-tooltip", 200);
      return force.on("tick", function() {
        link.attr("x1", function(d) {
          return d.source.x;
        }).attr("y1", function(d) {
          return d.source.y;
        }).attr("x2", function(d) {
          return d.target.x;
        }).attr("y2", function(d) {
          return d.target.y;
        });
        node.attr("cx", function(d) {
          return d.x;
        }).attr("cy", function(d) {
          return d.y;
        });
        node.on("mouseover", function(d, i) {
          var content, name;
          name = d.name.length > 30 ? d.name.substr(0, 15) + '...' + d.name.substr(d.name.length - 15) : d.name;
          content = '<p class="main">' + name + '</span></p>';
          console.log(d);
          content += '<p class="main">pageviews: ' + d.count + '</span></p>';
          tooltip.showTooltip(content, d3.event);
          link.style("stroke", function(l) {
            if (l.source === d || l.target === d) {
              return "#fff";
            } else {
              return "#aaa";
            }
          });
          link.style("stroke-opacity", function(l) {
            if (l.source === d || l.target === d) {
              return 1.0;
            } else {
              return 0.3;
            }
          });
          return node.style("stroke", function(n) {
            if (n.index === d.index) {
              return "#fff";
            } else {
              return "#aaa";
            }
          });
        });
        return node.on("mouseout", function(d, i) {
          tooltip.hideTooltip();
          link.style("stroke", "#aaa").style("stroke-opacity", 0.5);
          return node.style("stroke", "#fff");
        });
      });
    },
    getData: function() {
      var arrNodes, flow, item, links, nodes, pageflow, pageflows, pageview, pageviews, urls, _i, _len;
      pageflows = this.pageflows.getPageflowsCategory(this.thresholdAlpha);
      pageviews = this.pageviews.getPageviewsCategory(this.thresholdBeta);
      urls = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = pageviews.length; _i < _len; _i++) {
          pageview = pageviews[_i];
          _results.push(pageview.get('url'));
        }
        return _results;
      })();
      flow = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = pageflows.length; _i < _len; _i++) {
          pageflow = pageflows[_i];
          pageflow = pageflow.toJSON();
          if (urls.indexOf(pageflow.source_url) === -1 || urls.indexOf(pageflow.dest_url) === -1) {
            continue;
          }
          _results.push(pageflow);
        }
        return _results;
      })();
      nodes = [];
      arrNodes = [];
      for (_i = 0, _len = flow.length; _i < _len; _i++) {
        item = flow[_i];
        if (arrNodes.indexOf(item.source_url) === -1) {
          nodes.push({
            name: item.source_url,
            count: this.pageviews.get(item.source_url).get('count')
          });
          arrNodes.push(item.source_url);
        }
        if (arrNodes.indexOf(item.dest_url) === -1) {
          nodes.push({
            name: item.dest_url,
            count: this.pageviews.get(item.dest_url).get('count')
          });
          arrNodes.push(item.dest_url);
        }
      }
      links = (function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = flow.length; _j < _len1; _j++) {
          item = flow[_j];
          _results.push({
            source: arrNodes.indexOf(item.source_url),
            target: arrNodes.indexOf(item.dest_url),
            value: 1
          });
        }
        return _results;
      })();
      return {
        nodes: nodes,
        links: links
      };
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
      this.menu = opts.menu, this.domain = opts.domain, this.views = opts.views, this.collections = opts.collections;
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
        pageviews: this.collections.pageviews,
        pageflows: this.collections.pageflows
      });
      this.views.pageflows = new Klass.views.Pageflows({
        el: this.$('#content'),
        model: this.collections.pageflows
      });
      this.views.pageviews = new Klass.views.Pageviews({
        el: this.$('#content')
      });
      return this.views.pagelinks = new Klass.views.Pagelinks({
        el: this.$('#content')
      });
    },
    showSection: function(section, opts) {
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
      d3.select("svg").remove();
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

  Klass.views.PagelinksViewBasic = Backbone.View.extend({
    templateName: 'pagelinksViewBasic',
    initialize: function(opts) {
      var _this = this;
      return this.model.fetch({
        success: function() {
          return _this.render();
        }
      });
    }
  });

}).call(this);

(function() {

  Klass.views.PagelinksViewDetails = Backbone.View.extend({
    templateName: 'pagelinksViewDetails',
    initialize: function(opts) {
      var baseUrl;
      baseUrl = opts.baseUrl;
      this.baseUrl = decodeURIComponent(baseUrl);
      return this.model.fetch({
        success: _.bind(this.fetch, this)
      });
    },
    fetch: function() {
      var pagelink,
        _this = this;
      pagelink = this.model.get(this.baseUrl);
      if (!pagelink) {
        this.navigate('/pagelinks');
        return;
      }
      return pagelink.fetch({
        success: function() {
          return _this.render();
        }
      });
    },
    templateHash: function() {
      return this.model.get(this.baseUrl).toJSON();
    }
  });

}).call(this);

(function() {

  Klass.views.Pagelinks = Backbone.View.extend({
    templateName: 'pagelinks',
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
      if (this.action === 'viewDetails') {
        this.$('.back').show();
      } else {
        this.$('.back').hide();
      }
      opts = opts || {};
      opts.el = this.$('.tile');
      cls = action.substr(0, 1).toUpperCase() + action.substr(1);
      return this.views[action] = new Klass.views["Pagelinks" + cls](opts);
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
      d3.select("svg").remove();
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

  Klass.collections.Pagelinks = Backbone.Collection.extend({
    url: '/api/pagelinks/www.restauracja-laura.pl',
    model: Klass.models.Pagelink,
    fetched: false,
    fetch: function(opts) {
      var success,
        _this = this;
      opts = opts || {};
      if (this.fetched) {
        if (opts.success != null) {
          return opts.success();
        }
      } else {
        success = opts.success;
        opts.success = function() {
          _this.fetched = true;
          return success();
        };
        return Backbone.Collection.prototype.fetch.call(this, opts);
      }
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
    this.collections.pagelinks = new Klass.collections.Pagelinks();
    this.collections.pageviews = new Klass.collections.Pageviews({}, this.models.domain);
    return this.collections.pageflows = new Klass.collections.Pageflows({}, this.models.domain);
  };

  App.init = function() {
    var _this = this;
    this.initModels();
    return this.models.domain.fetch().always(function() {
      _this.views.main = new Klass.views.Main({
        el: 'body',
        menu: _this.models.menu,
        domain: _this.models.domain,
        views: _this.views,
        collections: _this.collections
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
