
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
buf.push('<div id="dashboard" class="section"><div class="slider"></div><p class="slider-result">ratio: <span class="value">0.50</span></p><p class="placeholder">Dashboard</p></div>');
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
jade.templates["pagelinks"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="pagelinks" class="section"><h2>Pagelinks</h2><div class="tile"></div><a href="/pagelinks" class="back">back to pagelinks</a></div>');
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
jade.templates["section1"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="section1" class="section"><p>This is sample content of section 1</p></div>');
}
return buf.join("");
}
jade.templates["section2"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="section2" class="section"><p>This is sample content of section 2</p></div>');
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