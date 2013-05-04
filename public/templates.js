
jade = (function(exports){
/*!
 * Jade - runtime
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Lame Array.isArray() polyfill for now.
 */

if (!Array.isArray) {
  Array.isArray = function(arr){
    return '[object Array]' == Object.prototype.toString.call(arr);
  };
}

/**
 * Lame Object.keys() polyfill for now.
 */

if (!Object.keys) {
  Object.keys = function(obj){
    var arr = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  }
}

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    ac = ac.filter(nulls);
    bc = bc.filter(nulls);
    a['class'] = ac.concat(bc).join(' ');
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function nulls(val) {
  return val != null;
}

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 * @api private
 */

exports.attrs = function attrs(obj, escaped){
  var buf = []
    , terse = obj.terse;

  delete obj.terse;
  var keys = Object.keys(obj)
    , len = keys.length;

  if (len) {
    buf.push('');
    for (var i = 0; i < len; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('boolean' == typeof val || null == val) {
        if (val) {
          terse
            ? buf.push(key)
            : buf.push(key + '="' + key + '"');
        }
      } else if (0 == key.indexOf('data') && 'string' != typeof val) {
        buf.push(key + "='" + JSON.stringify(val) + "'");
      } else if ('class' == key && Array.isArray(val)) {
        buf.push(key + '="' + exports.escape(val.join(' ')) + '"');
      } else if (escaped && escaped[key]) {
        buf.push(key + '="' + exports.escape(val) + '"');
      } else {
        buf.push(key + '="' + val + '"');
      }
    }
  }

  return buf.join(' ');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  return String(html)
    .replace(/&(?!(\w+|\#\d+);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno){
  if (!filename) throw err;

  var context = 3
    , str = require('fs').readFileSync(filename, 'utf8')
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

  return exports;

})({});

jade.templates = {};
jade.render = function(node, template, data) {
  var tmp = jade.templates[template](data);
  node.innerHTML = tmp;
};

jade.templates["dashboard"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="dashboard" class="section"><div class="details"><p>Nodes: <span class="nodes-count"> </span></p><p>Pageflows count: &ge; <span class="pageflows-threshold"></span></p><p>Pageviews count: &ge; <span class="pageviews-threshold"></span></p></div><div class="slider-alpha-container"><div id="slider-alpha" class="slider"></div><p class="coefficient">Pageflows - alpha: <span class="value">0.2</span></p></div><div class="slider-beta-container"><div id="slider-beta" class="slider"></div><p class="coefficient">Pageviews - beta: <span class="value">0.2</span></p></div><div class="layout-container"><a id="random" href="" class="active">Random</a><a id="radial" href="">Radial</a><p class="desc">Layout</p></div><div class="scc-container"><button id="scc" class="switch off"><span class="toggle"></span><span class="on">ON</span><span class="off-bg"></span><span class="off-text">OFF</span></button><p class="desc">SCC</p></div><div class="chart"><svg></svg></div></div>');
}
return buf.join("");
}
jade.templates["domain"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<form><p>Flow</p><div class="i"><input type="text" placeholder="Enter domain"/></div><button><span>Start</span></button></form>');
}
return buf.join("");
}
jade.templates["main"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="flow"><div id="top"></div><div id="content"></div><div id="domain"></div></div>');
}
return buf.join("");
}
jade.templates["pageflows"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="pageflows" class="section"><h1>Pageflows</h1><div class="tile"></div><a href="/pageflows" class="back">back to pageflows</a></div>');
}
return buf.join("");
}
jade.templates["pageflowsViewBasic"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="pageflows-basic">');
if ( isEmpty)
{
buf.push('<p>There are no records</p>');
}
else
{
buf.push('<p>pageflows - categories list</p><ul><li><a href="/pageflows/1-5">1&ndash;5 count (' + escape((interp = cat1Count) == null ? '' : interp) + ' entries)</a></li><li><a href="/pageflows/6-10">6&ndash;10 count (' + escape((interp = cat2Count) == null ? '' : interp) + ' entries)</a></li><li><a href="/pageflows/11-50">11&ndash;50 count (' + escape((interp = cat3Count) == null ? '' : interp) + ' entries)</a></li><li><a href="/pageflows/51-100">51&ndash;100 count (' + escape((interp = cat4Count) == null ? '' : interp) + ' entries)</a></li><li><a href="/pageflows/101-500">101&ndash;500 count (' + escape((interp = cat5Count) == null ? '' : interp) + ' entries)</a></li><li><a href="/pageflows/501-1000">501&ndash;1000 count (' + escape((interp = cat6Count) == null ? '' : interp) + ' entries)</a></li><li><a href="/pageflows/1001-oo">1001&ndash;&infin; count (' + escape((interp = cat7Count) == null ? '' : interp) + ' entries)</a></li></ul><p><a href="/pageflows/chart">Display chart</a></p>');
}
buf.push('</div>');
}
return buf.join("");
}
jade.templates["pageflowsViewChart"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="pageflows-chart">');
if ( isEmpty)
{
buf.push('<p>There are no records</p>');
}
buf.push('</div>');
}
return buf.join("");
}
jade.templates["pageflowsViewDetails"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="pageflows-details"><p>Pages with ' + escape((interp = bounds) == null ? '' : interp) + ' pageflows</p><ul>');
// iterate pageflows
;(function(){
  if ('number' == typeof pageflows.length) {

    for (var $index = 0, $$l = pageflows.length; $index < $$l; $index++) {
      var pageflow = pageflows[$index];

buf.push('<li><p>' + escape((interp = pageflow.count) == null ? '' : interp) + ' &ndash; ' + escape((interp = pageflow.source_url) == null ? '' : interp) + ' &rarr; ' + escape((interp = pageflow.dest_url) == null ? '' : interp) + '</p></li>');
    }

  } else {
    var $$l = 0;
    for (var $index in pageflows) {
      $$l++;      var pageflow = pageflows[$index];

buf.push('<li><p>' + escape((interp = pageflow.count) == null ? '' : interp) + ' &ndash; ' + escape((interp = pageflow.source_url) == null ? '' : interp) + ' &rarr; ' + escape((interp = pageflow.dest_url) == null ? '' : interp) + '</p></li>');
    }

  }
}).call(this);

buf.push('</ul></div>');
}
return buf.join("");
}
jade.templates["pagelinks"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="pagelinks" class="section"><h1>Pagelinks</h1><div class="tile"></div><a href="/pagelinks" class="back">back to pagelinks</a></div>');
}
return buf.join("");
}
jade.templates["pagelinksViewBasic"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="pagelinks-basic"><p>Pagelinks - url list</p><ul>');
// iterate urls
;(function(){
  if ('number' == typeof urls.length) {

    for (var $index = 0, $$l = urls.length; $index < $$l; $index++) {
      var url = urls[$index];

buf.push('<li><a');
buf.push(attrs({ 'href':('/pagelinks/' + (url.encodedUrl) + '') }, {"href":true}));
buf.push('>' + escape((interp = url.url) == null ? '' : interp) + '</a></li>');
    }

  } else {
    var $$l = 0;
    for (var $index in urls) {
      $$l++;      var url = urls[$index];

buf.push('<li><a');
buf.push(attrs({ 'href':('/pagelinks/' + (url.encodedUrl) + '') }, {"href":true}));
buf.push('>' + escape((interp = url.url) == null ? '' : interp) + '</a></li>');
    }

  }
}).call(this);

buf.push('</ul></div>');
}
return buf.join("");
}
jade.templates["pagelinksViewDetails"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="pagelinks-details"><p>Pagelinks - links for ' + escape((interp = url) == null ? '' : interp) + '</p><ul>');
// iterate links
;(function(){
  if ('number' == typeof links.length) {

    for (var $index = 0, $$l = links.length; $index < $$l; $index++) {
      var link = links[$index];

buf.push('<li><p>' + escape((interp = link) == null ? '' : interp) + '</p></li>');
    }

  } else {
    var $$l = 0;
    for (var $index in links) {
      $$l++;      var link = links[$index];

buf.push('<li><p>' + escape((interp = link) == null ? '' : interp) + '</p></li>');
    }

  }
}).call(this);

buf.push('</ul></div>');
}
return buf.join("");
}
jade.templates["pageviews"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="pageviews" class="section"><h1>Pageviews</h1><div class="tile"></div><a href="/pageviews" class="back">back to pageviews</a></div>');
}
return buf.join("");
}
jade.templates["pageviewsViewBasic"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="pageviews-basic">');
if ( isEmpty)
{
buf.push('<p>There are no records</p>');
}
else
{
buf.push('<p>pageviews - categories list</p><ul><li><a href="/pageviews/1-5">1&ndash;5 count (' + escape((interp = cat1Count) == null ? '' : interp) + ' entries)</a></li><li><a href="/pageviews/6-10">6&ndash;10 count (' + escape((interp = cat2Count) == null ? '' : interp) + ' entries)</a></li><li><a href="/pageviews/11-50">11&ndash;50 count (' + escape((interp = cat3Count) == null ? '' : interp) + ' entries)</a></li><li><a href="/pageviews/51-100">51&ndash;100 count (' + escape((interp = cat4Count) == null ? '' : interp) + ' entries)</a></li><li><a href="/pageviews/101-500">101&ndash;500 count (' + escape((interp = cat5Count) == null ? '' : interp) + ' entries)</a></li><li><a href="/pageviews/501-1000">501&ndash;1000 count (' + escape((interp = cat6Count) == null ? '' : interp) + ' entries)</a></li><li><a href="/pageviews/1001-oo">1001&ndash;&infin; count (' + escape((interp = cat7Count) == null ? '' : interp) + ' entries)</a></li></ul><p><a href="/pageviews/chart">Display chart</a></p>');
}
buf.push('</div>');
}
return buf.join("");
}
jade.templates["pageviewsViewChart"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="pageviews-chart">');
if ( isEmpty)
{
buf.push('<p>There are no records</p>');
}
buf.push('</div>');
}
return buf.join("");
}
jade.templates["pageviewsViewDetails"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="pageviews-details"><p>Pages with ' + escape((interp = bounds) == null ? '' : interp) + ' pageviews</p><ul>');
// iterate pageviews
;(function(){
  if ('number' == typeof pageviews.length) {

    for (var $index = 0, $$l = pageviews.length; $index < $$l; $index++) {
      var pageview = pageviews[$index];

buf.push('<li><p>' + escape((interp = pageview.count) == null ? '' : interp) + ' &ndash; ' + escape((interp = pageview.url) == null ? '' : interp) + '</p></li>');
    }

  } else {
    var $$l = 0;
    for (var $index in pageviews) {
      $$l++;      var pageview = pageviews[$index];

buf.push('<li><p>' + escape((interp = pageview.count) == null ? '' : interp) + ' &ndash; ' + escape((interp = pageview.url) == null ? '' : interp) + '</p></li>');
    }

  }
}).call(this);

buf.push('</ul></div>');
}
return buf.join("");
}
jade.templates["top"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div><ul class="menu">');
// iterate menu
;(function(){
  if ('number' == typeof menu.length) {

    for (var key = 0, $$l = menu.length; key < $$l; key++) {
      var val = menu[key];

buf.push('<li');
buf.push(attrs({ 'data-section':('' + (key) + '') }, {"data-section":true}));
buf.push('><a');
buf.push(attrs({ 'href':('/' + (key) + '') }, {"href":true}));
buf.push('>' + escape((interp = val.label) == null ? '' : interp) + '</a></li>');
    }

  } else {
    var $$l = 0;
    for (var key in menu) {
      $$l++;      var val = menu[key];

buf.push('<li');
buf.push(attrs({ 'data-section':('' + (key) + '') }, {"data-section":true}));
buf.push('><a');
buf.push(attrs({ 'href':('/' + (key) + '') }, {"href":true}));
buf.push('>' + escape((interp = val.label) == null ? '' : interp) + '</a></li>');
    }

  }
}).call(this);

buf.push('</ul><div class="domain"><p>' + escape((interp = domain) == null ? '' : interp) + '<a href="#" class="delete">×</a></p></div></div>');
}
return buf.join("");
}