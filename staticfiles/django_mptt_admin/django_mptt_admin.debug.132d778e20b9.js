/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 591:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

exports.Q = parse;
__webpack_unused_export__ = serialize;

/**
 * Module variables.
 * @private
 */

var __toString = Object.prototype.toString

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */

function parse(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {}
  var opt = options || {};
  var dec = opt.decode || decode;

  var index = 0
  while (index < str.length) {
    var eqIdx = str.indexOf('=', index)

    // no more cookie pairs
    if (eqIdx === -1) {
      break
    }

    var endIdx = str.indexOf(';', index)

    if (endIdx === -1) {
      endIdx = str.length
    } else if (endIdx < eqIdx) {
      // backtrack on prior semicolon
      index = str.lastIndexOf(';', eqIdx - 1) + 1
      continue
    }

    var key = str.slice(index, eqIdx).trim()

    // only assign once
    if (undefined === obj[key]) {
      var val = str.slice(eqIdx + 1, endIdx).trim()

      // quoted values
      if (val.charCodeAt(0) === 0x22) {
        val = val.slice(1, -1)
      }

      obj[key] = tryDecode(val, dec);
    }

    index = endIdx + 1
  }

  return obj;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */

function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;

  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;

    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError('option maxAge is invalid')
    }

    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    var expires = opt.expires

    if (!isDate(expires) || isNaN(expires.valueOf())) {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + expires.toUTCString()
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.priority) {
    var priority = typeof opt.priority === 'string'
      ? opt.priority.toLowerCase()
      : opt.priority

    switch (priority) {
      case 'low':
        str += '; Priority=Low'
        break
      case 'medium':
        str += '; Priority=Medium'
        break
      case 'high':
        str += '; Priority=High'
        break
      default:
        throw new TypeError('option priority is invalid')
    }
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string'
      ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      case 'none':
        str += '; SameSite=None';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

/**
 * URL-decode string value. Optimized to skip native call when no %.
 *
 * @param {string} str
 * @returns {string}
 */

function decode (str) {
  return str.indexOf('%') !== -1
    ? decodeURIComponent(str)
    : str
}

/**
 * URL-encode value.
 *
 * @param {string} str
 * @returns {string}
 */

function encode (val) {
  return encodeURIComponent(val)
}

/**
 * Determine if value is a Date.
 *
 * @param {*} val
 * @private
 */

function isDate (val) {
  return __toString.call(val) === '[object Date]' ||
    val instanceof Date
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}


/***/ }),

/***/ 631:
/***/ (() => {

/*
JqTree 1.7.5

Copyright 2023 Marco Braak

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
@license

*/
var jqtree=function(e){"use strict";function t(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function n(e){for(var n=1;n<arguments.length;n++){var i=null!=arguments[n]?arguments[n]:{};n%2?t(Object(i),!0).forEach((function(t){s(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):t(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}function i(e){return i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i(e)}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,y(i.key),i)}}function l(e,t,n){return t&&o(e.prototype,t),n&&o(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function s(e,t,n){return(t=y(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&d(e,t)}function u(e){return u=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},u(e)}function d(e,t){return d=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},d(e,t)}function h(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function c(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,i=u(e);if(t){var r=u(this).constructor;n=Reflect.construct(i,arguments,r)}else n=i.apply(this,arguments);return function(e,t){if(t&&("object"==typeof t||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return h(e)}(this,n)}}function v(){return v="undefined"!=typeof Reflect&&Reflect.get?Reflect.get.bind():function(e,t,n){var i=function(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=u(e)););return e}(e,t);if(i){var r=Object.getOwnPropertyDescriptor(i,t);return r.get?r.get.call(arguments.length<3?e:n):r.value}},v.apply(this,arguments)}function f(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var i,r,o,l,s=[],a=!0,u=!1;try{if(o=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;a=!1}else for(;!(a=(i=o.call(n)).done)&&(s.push(i.value),s.length!==t);a=!0);}catch(e){u=!0,r=e}finally{try{if(!a&&null!=n.return&&(l=n.return(),Object(l)!==l))return}finally{if(u)throw r}}return s}}(e,t)||g(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function g(e,t){if(e){if("string"==typeof e)return p(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?p(e,t):void 0}}function p(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,i=new Array(t);n<t;n++)i[n]=e[n];return i}function m(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=g(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var i=0,r=function(){};return{s:r,n:function(){return i>=e.length?{done:!0}:{done:!1,value:e[i++]}},e:function(e){throw e},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,l=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return l=e.done,e},e:function(e){s=!0,o=e},f:function(){try{l||null==n.return||n.return()}finally{if(s)throw o}}}}function y(e){var t=function(e,t){if("object"!=typeof e||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var i=n.call(e,t||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:String(t)}var S=function(e){return"object"===i(e)&&"children"in e&&e.children instanceof Array},k=function(e){return e[e.Before=1]="Before",e[e.After=2]="After",e[e.Inside=3]="Inside",e[e.None=4]="None",e}({}),N={before:k.Before,after:k.After,inside:k.Inside,none:k.None},D=function(e){for(var t in N)if(Object.prototype.hasOwnProperty.call(N,t)&&N[t]===e)return t;return""},b=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:e;r(this,e),s(this,"id",void 0),s(this,"name",void 0),s(this,"children",void 0),s(this,"parent",void 0),s(this,"idMapping",void 0),s(this,"tree",void 0),s(this,"nodeClass",void 0),s(this,"load_on_demand",void 0),s(this,"is_open",void 0),s(this,"element",void 0),s(this,"is_loading",void 0),s(this,"isEmptyFolder",void 0),this.name="",this.load_on_demand=!1,this.isEmptyFolder=null!=t&&S(t)&&0===t.children.length,this.setData(t),this.children=[],this.parent=null,n&&(this.idMapping=new Map,this.tree=this,this.nodeClass=i)}return l(e,[{key:"setData",value:function(e){if(e)if("string"==typeof e)this.name=e;else if("object"===i(e))for(var t in e)if(Object.prototype.hasOwnProperty.call(e,t)){var n=e[t];"label"===t||"name"===t?"string"==typeof n&&(this.name=n):"children"!==t&&"parent"!==t&&(this[t]=n)}}},{key:"loadFromData",value:function(e){this.removeChildren();var t,n=m(e);try{for(n.s();!(t=n.n()).done;){var i=t.value,r=this.createNode(i);this.addChild(r),S(i)&&r.loadFromData(i.children)}}catch(e){n.e(e)}finally{n.f()}return this}},{key:"addChild",value:function(e){this.children.push(e),e.setParent(this)}},{key:"addChildAtPosition",value:function(e,t){this.children.splice(t,0,e),e.setParent(this)}},{key:"removeChild",value:function(e){e.removeChildren(),this.doRemoveChild(e)}},{key:"getChildIndex",value:function(e){return this.children.indexOf(e)}},{key:"hasChildren",value:function(){return 0!==this.children.length}},{key:"isFolder",value:function(){return this.hasChildren()||this.load_on_demand}},{key:"iterate",value:function(e){!function t(n,i){if(n.children){var r,o=m(n.children);try{for(o.s();!(r=o.n()).done;){var l=r.value;e(l,i)&&l.hasChildren()&&t(l,i+1)}}catch(e){o.e(e)}finally{o.f()}}}(this,0)}},{key:"moveNode",value:function(e,t,n){if(!e.parent||e.isParentOf(t))return!1;switch(e.parent.doRemoveChild(e),n){case k.After:return!!t.parent&&(t.parent.addChildAtPosition(e,t.parent.getChildIndex(t)+1),!0);case k.Before:return!!t.parent&&(t.parent.addChildAtPosition(e,t.parent.getChildIndex(t)),!0);case k.Inside:return t.addChildAtPosition(e,0),!0;default:return!1}}},{key:"getData",value:function(){var e=function e(t){return t.map((function(t){var n={};for(var i in t)if(-1===["parent","children","element","idMapping","load_on_demand","nodeClass","tree","isEmptyFolder"].indexOf(i)&&Object.prototype.hasOwnProperty.call(t,i)){var r=t[i];n[i]=r}return t.hasChildren()&&(n.children=e(t.children)),n}))};return e(arguments.length>0&&void 0!==arguments[0]&&arguments[0]?[this]:this.children)}},{key:"getNodeByName",value:function(e){return this.getNodeByCallback((function(t){return t.name===e}))}},{key:"getNodeByNameMustExist",value:function(e){var t=this.getNodeByCallback((function(t){return t.name===e}));if(!t)throw"Node with name ".concat(e," not found");return t}},{key:"getNodeByCallback",value:function(e){var t=null;return this.iterate((function(n){return!t&&(!e(n)||(t=n,!1))})),t}},{key:"addAfter",value:function(e){if(this.parent){var t=this.createNode(e),n=this.parent.getChildIndex(this);return this.parent.addChildAtPosition(t,n+1),t.loadChildrenFromData(e),t}return null}},{key:"addBefore",value:function(e){if(this.parent){var t=this.createNode(e),n=this.parent.getChildIndex(this);return this.parent.addChildAtPosition(t,n),t.loadChildrenFromData(e),t}return null}},{key:"addParent",value:function(e){if(this.parent){var t=this.createNode(e);this.tree&&t.setParent(this.tree);var n,i=this.parent,r=m(i.children);try{for(r.s();!(n=r.n()).done;){var o=n.value;t.addChild(o)}}catch(e){r.e(e)}finally{r.f()}return i.children=[],i.addChild(t),t}return null}},{key:"remove",value:function(){this.parent&&(this.parent.removeChild(this),this.parent=null)}},{key:"append",value:function(e){var t=this.createNode(e);return this.addChild(t),t.loadChildrenFromData(e),t}},{key:"prepend",value:function(e){var t=this.createNode(e);return this.addChildAtPosition(t,0),t.loadChildrenFromData(e),t}},{key:"isParentOf",value:function(e){for(var t=e.parent;t;){if(t===this)return!0;t=t.parent}return!1}},{key:"getLevel",value:function(){for(var e=0,t=this;t.parent;)e+=1,t=t.parent;return e}},{key:"getNodeById",value:function(e){return this.idMapping.get(e)||null}},{key:"addNodeToIndex",value:function(e){null!=e.id&&this.idMapping.set(e.id,e)}},{key:"removeNodeFromIndex",value:function(e){null!=e.id&&this.idMapping.delete(e.id)}},{key:"removeChildren",value:function(){var e=this;this.iterate((function(t){var n;return null===(n=e.tree)||void 0===n||n.removeNodeFromIndex(t),!0})),this.children=[]}},{key:"getPreviousSibling",value:function(){if(this.parent){var e=this.parent.getChildIndex(this)-1;return e>=0&&this.parent.children[e]||null}return null}},{key:"getNextSibling",value:function(){if(this.parent){var e=this.parent.getChildIndex(this)+1;return e<this.parent.children.length&&this.parent.children[e]||null}return null}},{key:"getNodesByProperty",value:function(e,t){return this.filter((function(n){return n[e]===t}))}},{key:"filter",value:function(e){var t=[];return this.iterate((function(n){return e(n)&&t.push(n),!0})),t}},{key:"getNextNode",value:function(){if((!(arguments.length>0&&void 0!==arguments[0])||arguments[0])&&this.hasChildren())return this.children[0]||null;if(this.parent){var e=this.getNextSibling();return e||this.parent.getNextNode(!1)}return null}},{key:"getNextVisibleNode",value:function(){if(this.hasChildren()&&this.is_open)return this.children[0]||null;if(this.parent){var e=this.getNextSibling();return e||this.parent.getNextNode(!1)}return null}},{key:"getPreviousNode",value:function(){if(this.parent){var e=this.getPreviousSibling();return e?e.hasChildren()?e.getLastChild():e:this.getParent()}return null}},{key:"getPreviousVisibleNode",value:function(){if(this.parent){var e=this.getPreviousSibling();return e?e.hasChildren()&&e.is_open?e.getLastChild():e:this.getParent()}return null}},{key:"getParent",value:function(){return this.parent&&this.parent.parent?this.parent:null}},{key:"getLastChild",value:function(){if(this.hasChildren()){var e=this.children[this.children.length-1];return e?e.hasChildren()&&e.is_open?null==e?void 0:e.getLastChild():e:null}return null}},{key:"initFromData",value:function(e){var t,n=this,i=function(e){var t,i=m(e);try{for(i.s();!(t=i.n()).done;){var r=t.value,o=n.createNode();o.initFromData(r),n.addChild(o)}}catch(e){i.e(e)}finally{i.f()}};t=e,n.setData(t),S(t)&&t.children.length&&i(t.children)}},{key:"setParent",value:function(e){var t;this.parent=e,this.tree=e.tree,null===(t=this.tree)||void 0===t||t.addNodeToIndex(this)}},{key:"doRemoveChild",value:function(e){var t;this.children.splice(this.getChildIndex(e),1),null===(t=this.tree)||void 0===t||t.removeNodeFromIndex(e)}},{key:"getNodeClass",value:function(){var t;return this.nodeClass||(null==this||null===(t=this.tree)||void 0===t?void 0:t.nodeClass)||e}},{key:"createNode",value:function(e){return new(this.getNodeClass())(e)}},{key:"loadChildrenFromData",value:function(e){S(e)&&e.children.length&&this.loadFromData(e.children)}}]),e}(),_=function(){function e(t){r(this,e),s(this,"hitAreas",void 0),s(this,"isDragging",void 0),s(this,"currentItem",void 0),s(this,"hoveredArea",void 0),s(this,"treeWidget",void 0),s(this,"dragElement",void 0),s(this,"previousGhost",void 0),s(this,"openFolderTimer",void 0),this.treeWidget=t,this.hoveredArea=null,this.hitAreas=[],this.isDragging=!1,this.currentItem=null}return l(e,[{key:"mouseCapture",value:function(e){var t=jQuery(e.target);if(!this.mustCaptureElement(t))return null;if(this.treeWidget.options.onIsMoveHandle&&!this.treeWidget.options.onIsMoveHandle(t))return null;var n=this.treeWidget._getNodeElement(t);return n&&this.treeWidget.options.onCanMove&&(this.treeWidget.options.onCanMove(n.node)||(n=null)),this.currentItem=n,null!=this.currentItem}},{key:"mouseStart",value:function(e){var t;if(!this.currentItem||void 0===e.pageX||void 0===e.pageY)return!1;this.refresh();var n=jQuery(e.target).offset(),i=n?n.left:0,r=n?n.top:0,o=this.currentItem.node;return this.dragElement=new E(o.name,e.pageX-i,e.pageY-r,this.treeWidget.element,null===(t=this.treeWidget.options.autoEscape)||void 0===t||t),this.isDragging=!0,this.currentItem.$element.addClass("jqtree-moving"),!0}},{key:"mouseDrag",value:function(e){if(!this.currentItem||!this.dragElement||void 0===e.pageX||void 0===e.pageY)return!1;this.dragElement.move(e.pageX,e.pageY);var t=this.findHoveredArea(e.pageX,e.pageY);return t&&this.canMoveToArea(t)?(t.node.isFolder()||this.stopOpenFolderTimer(),this.hoveredArea!==t&&(this.hoveredArea=t,this.mustOpenFolderTimer(t)?this.startOpenFolderTimer(t.node):this.stopOpenFolderTimer(),this.updateDropHint())):(this.removeDropHint(),this.stopOpenFolderTimer(),this.hoveredArea=t),t||this.treeWidget.options.onDragMove&&this.treeWidget.options.onDragMove(this.currentItem.node,e.originalEvent),!0}},{key:"mouseStop",value:function(e){this.moveItem(e),this.clear(),this.removeHover(),this.removeDropHint(),this.removeHitAreas();var t=this.currentItem;return this.currentItem&&(this.currentItem.$element.removeClass("jqtree-moving"),this.currentItem=null),this.isDragging=!1,!this.hoveredArea&&t&&this.treeWidget.options.onDragStop&&this.treeWidget.options.onDragStop(t.node,e.originalEvent),!1}},{key:"refresh",value:function(){this.removeHitAreas(),this.currentItem&&(this.generateHitAreas(),this.currentItem=this.treeWidget._getNodeElementForNode(this.currentItem.node),this.isDragging&&this.currentItem.$element.addClass("jqtree-moving"))}},{key:"generateHitAreas",value:function(){if(this.currentItem){var e=new w(this.treeWidget.tree,this.currentItem.node,this.getTreeDimensions().bottom);this.hitAreas=e.generate()}else this.hitAreas=[]}},{key:"mustCaptureElement",value:function(e){return!e.is("input,select,textarea")}},{key:"canMoveToArea",value:function(e){if(!this.treeWidget.options.onCanMoveTo)return!0;if(!this.currentItem)return!1;var t=D(e.position);return this.treeWidget.options.onCanMoveTo(this.currentItem.node,e.node,t)}},{key:"removeHitAreas",value:function(){this.hitAreas=[]}},{key:"clear",value:function(){this.dragElement&&(this.dragElement.remove(),this.dragElement=null)}},{key:"removeDropHint",value:function(){this.previousGhost&&this.previousGhost.remove()}},{key:"removeHover",value:function(){this.hoveredArea=null}},{key:"findHoveredArea",value:function(e,t){var n=this.getTreeDimensions();if(e<n.left||t<n.top||e>n.right||t>n.bottom)return null;for(var i=0,r=this.hitAreas.length;i<r;){var o=i+r>>1,l=this.hitAreas[o];if(!l)return null;if(t<l.top)r=o;else{if(!(t>l.bottom))return l;i=o+1}}return null}},{key:"mustOpenFolderTimer",value:function(e){var t=e.node;return t.isFolder()&&!t.is_open&&e.position===k.Inside}},{key:"updateDropHint",value:function(){if(this.hoveredArea){this.removeDropHint();var e=this.treeWidget._getNodeElementForNode(this.hoveredArea.node);this.previousGhost=e.addDropHint(this.hoveredArea.position)}}},{key:"startOpenFolderTimer",value:function(e){var t=this;this.stopOpenFolderTimer();var n=this.treeWidget.options.openFolderDelay;!1!==n&&(this.openFolderTimer=window.setTimeout((function(){t.treeWidget._openNode(e,t.treeWidget.options.slide,(function(){t.refresh(),t.updateDropHint()}))}),n))}},{key:"stopOpenFolderTimer",value:function(){this.openFolderTimer&&(clearTimeout(this.openFolderTimer),this.openFolderTimer=null)}},{key:"moveItem",value:function(e){var t=this;if(this.currentItem&&this.hoveredArea&&this.hoveredArea.position!==k.None&&this.canMoveToArea(this.hoveredArea)){var n=this.currentItem.node,i=this.hoveredArea.node,r=this.hoveredArea.position,o=n.parent;r===k.Inside&&(this.hoveredArea.node.is_open=!0);var l=function(){t.treeWidget.tree.moveNode(n,i,r),t.treeWidget.element.empty(),t.treeWidget._refreshElements(null)};this.treeWidget._triggerEvent("tree.move",{move_info:{moved_node:n,target_node:i,position:D(r),previous_parent:o,do_move:l,original_event:e.originalEvent}}).isDefaultPrevented()||l()}}},{key:"getTreeDimensions",value:function(){var e=this.treeWidget.element.offset();if(e){var t=this.treeWidget.element,n=t.width()||0,i=t.height()||0,r=e.left+this.treeWidget._getScrollLeft();return{left:r,top:e.top,right:r+n,bottom:e.top+i+16}}return{left:0,top:0,right:0,bottom:0}}}]),e}(),w=function(e){a(n,e);var t=c(n);function n(e,i,o){var l;return r(this,n),s(h(l=t.call(this,e)),"currentNode",void 0),s(h(l),"treeBottom",void 0),s(h(l),"positions",void 0),s(h(l),"lastTop",void 0),l.currentNode=i,l.treeBottom=o,l}return l(n,[{key:"generate",value:function(){return this.positions=[],this.lastTop=0,this.iterate(),this.generateHitAreas(this.positions)}},{key:"generateHitAreas",value:function(e){var t,n,i,r=null!==(t=null===(n=e[0])||void 0===n?void 0:n.top)&&void 0!==t?t:0,o=[],l=[],s=m(e);try{for(s.s();!(i=s.n()).done;){var a=i.value;a.top!==r&&o.length&&(this.generateHitAreasForGroup(l,o,r,a.top),r=a.top,o=[]),o.push(a)}}catch(e){s.e(e)}finally{s.f()}return this.generateHitAreasForGroup(l,o,r,this.treeBottom),l}},{key:"handleOpenFolder",value:function(e,t){if(e===this.currentNode){var n=this.getTop(t),i=t.height()||0;return this.addPosition(e,k.None,n),i>5&&this.addPosition(e,k.None,n+i-5),!1}return e.children[0]!==this.currentNode&&this.addPosition(e,k.Inside,this.getTop(t)),!0}},{key:"handleClosedFolder",value:function(e,t,n){var i=this.getTop(n);e===this.currentNode?this.addPosition(e,k.None,i):(this.addPosition(e,k.Inside,i),t!==this.currentNode&&this.addPosition(e,k.After,i))}},{key:"handleFirstNode",value:function(e){e!==this.currentNode&&this.addPosition(e,k.Before,this.getTop(jQuery(e.element)))}},{key:"handleAfterOpenFolder",value:function(e,t){e===this.currentNode||t===this.currentNode?this.addPosition(e,k.None,this.lastTop):this.addPosition(e,k.After,this.lastTop)}},{key:"handleNode",value:function(e,t,n){var i=this.getTop(n);e===this.currentNode?this.addPosition(e,k.None,i):this.addPosition(e,k.Inside,i),t===this.currentNode||e===this.currentNode?this.addPosition(e,k.None,i):this.addPosition(e,k.After,i)}},{key:"getTop",value:function(e){var t=e.offset();return t?t.top:0}},{key:"addPosition",value:function(e,t,n){var i={top:n,bottom:0,node:e,position:t};this.positions.push(i),this.lastTop=n}},{key:"generateHitAreasForGroup",value:function(e,t,n,i){for(var r=Math.min(t.length,4),o=Math.round((i-n)/r),l=n,s=0;s<r;){var a=t[s];a&&a.position!==k.None&&e.push({top:l,bottom:l+o,node:a.node,position:a.position}),l+=o,s+=1}}}]),n}(function(){function e(t){r(this,e),s(this,"tree",void 0),this.tree=t}return l(e,[{key:"iterate",value:function(){var e=this,t=!0;!function n(i,r){var o=(i.is_open||!i.element)&&i.hasChildren(),l=null;if(i.element){if(!(l=jQuery(i.element)).is(":visible"))return;t&&(e.handleFirstNode(i),t=!1),i.hasChildren()?i.is_open?e.handleOpenFolder(i,l)||(o=!1):e.handleClosedFolder(i,r,l):e.handleNode(i,r,l)}if(o){var s=i.children.length;i.children.forEach((function(e,t){var r=i.children[t];if(r)if(t===s-1)n(r,null);else{var o=i.children[t+1];o&&n(r,o)}})),i.is_open&&l&&e.handleAfterOpenFolder(i,r)}}(this.tree,null)}}]),e}()),E=function(){function e(t,n,i,o,l){r(this,e),s(this,"offsetX",void 0),s(this,"offsetY",void 0),s(this,"$element",void 0),this.offsetX=n,this.offsetY=i,this.$element=jQuery("<span>").addClass("jqtree-title jqtree-dragging"),l?this.$element.text(t):this.$element.html(t),this.$element.css("position","absolute"),o.append(this.$element)}return l(e,[{key:"move",value:function(e,t){this.$element.offset({left:e-this.offsetX,top:t-this.offsetY})}},{key:"remove",value:function(){this.$element.remove()}}]),e}(),C=function(e){return e?"true":"false"},T=function(){function e(t){r(this,e),s(this,"openedIconElement",void 0),s(this,"closedIconElement",void 0),s(this,"treeWidget",void 0),this.treeWidget=t,this.openedIconElement=this.createButtonElement(t.options.openedIcon||"+"),this.closedIconElement=this.createButtonElement(t.options.closedIcon||"-")}return l(e,[{key:"render",value:function(e){e&&e.parent?this.renderFromNode(e):this.renderFromRoot()}},{key:"renderFromRoot",value:function(){var e=this.treeWidget.element;e.empty(),e[0]&&this.createDomElements(e[0],this.treeWidget.tree.children,!0,1)}},{key:"renderFromNode",value:function(e){var t=jQuery(e.element),n=this.createLi(e,e.getLevel());this.attachNodeData(e,n),t.after(n),t.remove(),e.children&&this.createDomElements(n,e.children,!1,e.getLevel()+1)}},{key:"createDomElements",value:function(e,t,n,i){var r=this.createUl(n);e.appendChild(r);var o,l=m(t);try{for(l.s();!(o=l.n()).done;){var s=o.value,a=this.createLi(s,i);r.appendChild(a),this.attachNodeData(s,a),s.hasChildren()&&this.createDomElements(a,s.children,!1,i+1)}}catch(e){l.e(e)}finally{l.f()}}},{key:"attachNodeData",value:function(e,t){e.element=t,jQuery(t).data("node",e)}},{key:"createUl",value:function(e){var t,n;e?(t="jqtree-tree",n="tree",this.treeWidget.options.rtl&&(t+=" jqtree-rtl")):(t="",n="group"),this.treeWidget.options.dragAndDrop&&(t+=" jqtree-dnd");var i=document.createElement("ul");return i.className="jqtree_common ".concat(t),i.setAttribute("role",n),i}},{key:"createLi",value:function(e,t){var n=Boolean(this.treeWidget.selectNodeHandler.isNodeSelected(e)),i=e.isFolder()||e.isEmptyFolder&&this.treeWidget.options.showEmptyFolder?this.createFolderLi(e,t,n):this.createNodeLi(e,t,n);return this.treeWidget.options.onCreateLi&&this.treeWidget.options.onCreateLi(e,jQuery(i),n),i}},{key:"setTreeItemAriaAttributes",value:function(e,t,n,i){e.setAttribute("aria-label",t),e.setAttribute("aria-level","".concat(n)),e.setAttribute("aria-selected",C(i)),e.setAttribute("role","treeitem")}},{key:"createFolderLi",value:function(e,t,n){var i=this.getButtonClasses(e),r=this.getFolderClasses(e,n),o=e.is_open?this.openedIconElement:this.closedIconElement,l=document.createElement("li");l.className="jqtree_common ".concat(r),l.setAttribute("role","none");var s=document.createElement("div");s.className="jqtree-element jqtree_common",s.setAttribute("role","none"),l.appendChild(s);var a=document.createElement("a");a.className=i,o&&a.appendChild(o.cloneNode(!0)),this.treeWidget.options.buttonLeft&&s.appendChild(a);var u=this.createTitleSpan(e.name,n,!0,t);return u.setAttribute("aria-expanded",C(e.is_open)),s.appendChild(u),this.treeWidget.options.buttonLeft||s.appendChild(a),l}},{key:"createNodeLi",value:function(e,t,n){var i=["jqtree_common"];n&&i.push("jqtree-selected");var r=i.join(" "),o=document.createElement("li");o.className=r,o.setAttribute("role","none");var l=document.createElement("div");l.className="jqtree-element jqtree_common",l.setAttribute("role","none"),o.appendChild(l);var s=this.createTitleSpan(e.name,n,!1,t);return l.appendChild(s),o}},{key:"createTitleSpan",value:function(e,t,n,i){var r=document.createElement("span"),o="jqtree-title jqtree_common";if(n&&(o+=" jqtree-title-folder"),o+=" jqtree-title-button-".concat(this.treeWidget.options.buttonLeft?"left":"right"),r.className=o,t){var l=this.treeWidget.options.tabIndex;void 0!==l&&r.setAttribute("tabindex","".concat(l))}return this.setTreeItemAriaAttributes(r,e,i,t),this.treeWidget.options.autoEscape?r.textContent=e:r.innerHTML=e,r}},{key:"getButtonClasses",value:function(e){var t=["jqtree-toggler","jqtree_common"];return e.is_open||t.push("jqtree-closed"),this.treeWidget.options.buttonLeft?t.push("jqtree-toggler-left"):t.push("jqtree-toggler-right"),t.join(" ")}},{key:"getFolderClasses",value:function(e,t){var n=["jqtree-folder"];return e.is_open||n.push("jqtree-closed"),t&&n.push("jqtree-selected"),e.is_loading&&n.push("jqtree-loading"),n.join(" ")}},{key:"createButtonElement",value:function(e){if("string"==typeof e){var t=document.createElement("div");return t.innerHTML=e,document.createTextNode(t.innerHTML)}return jQuery(e)[0]}}]),e}(),j=function(){function e(t){r(this,e),s(this,"treeWidget",void 0),this.treeWidget=t}return l(e,[{key:"loadFromUrl",value:function(e,t,n){var i=this;if(e){var r=this.getDomElement(t);this.addLoadingClass(r),this.notifyLoading(!0,t,r);var o=function(){i.removeLoadingClass(r),i.notifyLoading(!1,t,r)};this.submitRequest(e,(function(e){o(),i.treeWidget.loadData(i.parseData(e),t),n&&"function"==typeof n&&n()}),(function(e){o(),i.treeWidget.options.onLoadFailed&&i.treeWidget.options.onLoadFailed(e)}))}}},{key:"addLoadingClass",value:function(e){e&&e.addClass("jqtree-loading")}},{key:"removeLoadingClass",value:function(e){e&&e.removeClass("jqtree-loading")}},{key:"getDomElement",value:function(e){return e?jQuery(e.element):this.treeWidget.element}},{key:"notifyLoading",value:function(e,t,n){this.treeWidget.options.onLoading&&this.treeWidget.options.onLoading(e,t,n),this.treeWidget._triggerEvent("tree.loading_data",{isLoading:e,node:t,$el:n})}},{key:"submitRequest",value:function(e,t,i){var r,o=n({method:"GET",cache:!1,dataType:"json",success:t,error:i},"string"==typeof e?{url:e}:e);o.method=(null===(r=o.method)||void 0===r?void 0:r.toUpperCase())||"GET",jQuery.ajax(o)}},{key:"parseData",value:function(e){var t=this.treeWidget.options.dataFilter,n="string"==typeof e?JSON.parse(e):e;return t?t(n):n}}]),e}(),I=function(){function e(t){var n=this;r(this,e),s(this,"treeWidget",void 0),s(this,"handleKeyDown",(function(t){if(!n.canHandleKeyboard())return!0;var i=n.treeWidget.getSelectedNode();if(!i)return!0;switch(t.which){case e.DOWN:return n.moveDown(i);case e.UP:return n.moveUp(i);case e.RIGHT:return n.moveRight(i);case e.LEFT:return n.moveLeft(i);default:return!0}})),this.treeWidget=t,t.options.keyboardSupport&&jQuery(document).on("keydown.jqtree",this.handleKeyDown)}return l(e,[{key:"deinit",value:function(){jQuery(document).off("keydown.jqtree")}},{key:"moveDown",value:function(e){return this.selectNode(e.getNextVisibleNode())}},{key:"moveUp",value:function(e){return this.selectNode(e.getPreviousVisibleNode())}},{key:"moveRight",value:function(e){return!e.isFolder()||(e.is_open?this.selectNode(e.getNextVisibleNode()):(this.treeWidget.openNode(e),!1))}},{key:"moveLeft",value:function(e){return e.isFolder()&&e.is_open?(this.treeWidget.closeNode(e),!1):this.selectNode(e.getParent())}},{key:"selectNode",value:function(e){return!e||(this.treeWidget.selectNode(e),!1)}},{key:"canHandleKeyboard",value:function(){return!!this.treeWidget.options.keyboardSupport&&this.treeWidget.selectNodeHandler.isFocusOnTree()}}]),e}();s(I,"LEFT",37),s(I,"UP",38),s(I,"RIGHT",39),s(I,"DOWN",40);var H=function(e,t){var n=function(){return"simple_widget_".concat(t)},r=function(e,t){var n=jQuery.data(e,t);return n&&n instanceof F?n:null},o=function(t,i){var o,l=n(),s=m(t.get());try{for(s.s();!(o=s.n()).done;){var a=o.value;if(!r(a,l)){var u=new e(a,i);jQuery.data(a,l)||jQuery.data(a,l,u),u.init()}}}catch(e){s.e(e)}finally{s.f()}return t};jQuery.fn[t]=function(t){if(!t)return o(this,null);if("object"===i(t))return o(this,t);if("string"==typeof t&&"_"!==t[0]){var l=t;if("destroy"===l)return function(e){var t,i=n(),o=m(e.get());try{for(o.s();!(t=o.n()).done;){var l=t.value,s=r(l,i);s&&s.destroy(),jQuery.removeData(l,i)}}catch(e){o.e(e)}finally{o.f()}}(this);if("get_widget_class"===l)return e;for(var s=arguments.length,a=new Array(s>1?s-1:0),u=1;u<s;u++)a[u-1]=arguments[u];return function(e,t,i){var r,o=null,l=m(e.get());try{for(l.s();!(r=l.n()).done;){var s=r.value,a=jQuery.data(s,n());if(a&&a instanceof F){var u=a[t];u&&"function"==typeof u&&(o=u.apply(a,i))}}}catch(e){l.e(e)}finally{l.f()}return o}(this,l,a)}}},F=function(){function e(t,i){r(this,e),s(this,"options",void 0),s(this,"$el",void 0),this.$el=jQuery(t);var o=this.constructor.defaults;this.options=n(n({},o),i)}return l(e,[{key:"destroy",value:function(){this.deinit()}},{key:"init",value:function(){}},{key:"deinit",value:function(){}}],[{key:"register",value:function(e,t){H(e,t)}}]),e}();s(F,"defaults",{});var W=function(e){return{pageX:e.pageX,pageY:e.pageY,target:e.target,originalEvent:e}},A=function(e,t){return{pageX:e.pageX,pageY:e.pageY,target:e.target,originalEvent:t}},P=function(e){a(n,e);var t=c(n);function n(){var e;r(this,n);for(var i=arguments.length,o=new Array(i),l=0;l<i;l++)o[l]=arguments[l];return s(h(e=t.call.apply(t,[this].concat(o))),"isMouseStarted",void 0),s(h(e),"mouseDownInfo",void 0),s(h(e),"mouseDelayTimer",void 0),s(h(e),"isMouseDelayMet",void 0),s(h(e),"mouseDown",(function(t){0===t.button&&(e.handleMouseDown(W(t))&&t.cancelable&&t.preventDefault())})),s(h(e),"mouseMove",(function(t){e.handleMouseMove(t,W(t))})),s(h(e),"mouseUp",(function(t){e.handleMouseUp(W(t))})),s(h(e),"touchStart",(function(t){if(t&&!(t.touches.length>1)){var n=t.changedTouches[0];n&&e.handleMouseDown(A(n,t))}})),s(h(e),"touchMove",(function(t){if(t&&!(t.touches.length>1)){var n=t.changedTouches[0];n&&e.handleMouseMove(t,A(n,t))}})),s(h(e),"touchEnd",(function(t){if(t&&!(t.touches.length>1)){var n=t.changedTouches[0];n&&e.handleMouseUp(A(n,t))}})),e}return l(n,[{key:"init",value:function(){var e=this.$el.get(0);e&&(e.addEventListener("mousedown",this.mouseDown,{passive:!1}),e.addEventListener("touchstart",this.touchStart,{passive:!1})),this.isMouseStarted=!1,this.mouseDelayTimer=null,this.isMouseDelayMet=!1,this.mouseDownInfo=null}},{key:"deinit",value:function(){var e=this.$el.get(0);e&&(e.removeEventListener("mousedown",this.mouseDown,{passive:!1}),e.removeEventListener("touchstart",this.touchStart,{passive:!1})),this.removeMouseMoveEventListeners()}},{key:"handleMouseDown",value:function(e){return this.isMouseStarted&&this.handleMouseUp(e),this.mouseDownInfo=e,!!this.mouseCapture(e)&&(this.handleStartMouse(),!0)}},{key:"handleStartMouse",value:function(){document.addEventListener("mousemove",this.mouseMove,{passive:!1}),document.addEventListener("touchmove",this.touchMove,{passive:!1}),document.addEventListener("mouseup",this.mouseUp,{passive:!1}),document.addEventListener("touchend",this.touchEnd,{passive:!1});var e=this.getMouseDelay();e?this.startMouseDelayTimer(e):this.isMouseDelayMet=!0}},{key:"startMouseDelayTimer",value:function(e){var t=this;this.mouseDelayTimer&&clearTimeout(this.mouseDelayTimer),this.mouseDelayTimer=window.setTimeout((function(){t.mouseDownInfo&&(t.isMouseDelayMet=!0)}),e),this.isMouseDelayMet=!1}},{key:"handleMouseMove",value:function(e,t){if(this.isMouseStarted)return this.mouseDrag(t),void(e.cancelable&&e.preventDefault());this.isMouseDelayMet&&(this.mouseDownInfo&&(this.isMouseStarted=!1!==this.mouseStart(this.mouseDownInfo)),this.isMouseStarted?(this.mouseDrag(t),e.cancelable&&e.preventDefault()):this.handleMouseUp(t))}},{key:"handleMouseUp",value:function(e){this.removeMouseMoveEventListeners(),this.isMouseDelayMet=!1,this.mouseDownInfo=null,this.isMouseStarted&&(this.isMouseStarted=!1,this.mouseStop(e))}},{key:"removeMouseMoveEventListeners",value:function(){document.removeEventListener("mousemove",this.mouseMove,{passive:!1}),document.removeEventListener("touchmove",this.touchMove,{passive:!1}),document.removeEventListener("mouseup",this.mouseUp,{passive:!1}),document.removeEventListener("touchend",this.touchEnd,{passive:!1})}}]),n}(F),O=function(){function e(t){r(this,e),s(this,"treeWidget",void 0),s(this,"_supportsLocalStorage",void 0),this.treeWidget=t}return l(e,[{key:"saveState",value:function(){var e=JSON.stringify(this.getState());this.treeWidget.options.onSetStateFromStorage?this.treeWidget.options.onSetStateFromStorage(e):this.supportsLocalStorage()&&localStorage.setItem(this.getKeyName(),e)}},{key:"getStateFromStorage",value:function(){var e=this.loadFromStorage();return e?this.parseState(e):null}},{key:"getState",value:function(){var e,t,n=this;return{open_nodes:(t=[],n.treeWidget.tree.iterate((function(e){return e.is_open&&e.id&&e.hasChildren()&&t.push(e.id),!0})),t),selected_node:(e=[],n.treeWidget.getSelectedNodes().forEach((function(t){null!=t.id&&e.push(t.id)})),e)}}},{key:"setInitialState",value:function(e){if(e){var t=!1;return e.open_nodes&&(t=this.openInitialNodes(e.open_nodes)),e.selected_node&&(this.resetSelection(),this.selectInitialNodes(e.selected_node)),t}return!1}},{key:"setInitialStateOnDemand",value:function(e,t){e?this.doSetInitialStateOnDemand(e.open_nodes,e.selected_node,t):t()}},{key:"getNodeIdToBeSelected",value:function(){var e=this.getStateFromStorage();return e&&e.selected_node&&e.selected_node[0]||null}},{key:"parseState",value:function(e){var t,n=JSON.parse(e);return n&&n.selected_node&&("number"==typeof(t=n.selected_node)&&t%1==0)&&(n.selected_node=[n.selected_node]),n}},{key:"loadFromStorage",value:function(){return this.treeWidget.options.onGetStateFromStorage?this.treeWidget.options.onGetStateFromStorage():this.supportsLocalStorage()?localStorage.getItem(this.getKeyName()):null}},{key:"openInitialNodes",value:function(e){var t,n=!1,i=m(e);try{for(i.s();!(t=i.n()).done;){var r=t.value,o=this.treeWidget.getNodeById(r);o&&(o.load_on_demand?n=!0:o.is_open=!0)}}catch(e){i.e(e)}finally{i.f()}return n}},{key:"selectInitialNodes",value:function(e){var t,n=0,i=m(e);try{for(i.s();!(t=i.n()).done;){var r=t.value,o=this.treeWidget.getNodeById(r);o&&(n+=1,this.treeWidget.selectNodeHandler.addToSelection(o))}}catch(e){i.e(e)}finally{i.f()}return 0!==n}},{key:"resetSelection",value:function(){var e=this.treeWidget.selectNodeHandler;e.getSelectedNodes().forEach((function(t){e.removeFromSelection(t)}))}},{key:"doSetInitialStateOnDemand",value:function(e,t,n){var i=this,r=0,o=e,l=function(){var e,l=[],a=m(o);try{for(a.s();!(e=a.n()).done;){var u=e.value,d=i.treeWidget.getNodeById(u);d?d.is_loading||(d.load_on_demand?s(d):i.treeWidget._openNode(d,!1,null)):l.push(u)}}catch(e){a.e(e)}finally{a.f()}o=l,i.selectInitialNodes(t)&&i.treeWidget._refreshElements(null),0===r&&n()},s=function(e){r+=1,i.treeWidget._openNode(e,!1,(function(){r-=1,l()}))};l()}},{key:"getKeyName",value:function(){return"string"==typeof this.treeWidget.options.saveState?this.treeWidget.options.saveState:"tree"}},{key:"supportsLocalStorage",value:function(){return null==this._supportsLocalStorage&&(this._supportsLocalStorage=function(){if(null==localStorage)return!1;try{var e="_storage_test";sessionStorage.setItem(e,"value"),sessionStorage.removeItem(e)}catch(e){return!1}return!0}()),this._supportsLocalStorage}}]),e}(),L=function(){function e(t){var n=t.$container,i=t.refreshHitAreas;r(this,e),s(this,"$container",void 0),s(this,"horizontalScrollDirection",void 0),s(this,"horizontalScrollTimeout",void 0),s(this,"refreshHitAreas",void 0),s(this,"scrollParentBottom",void 0),s(this,"scrollParentTop",void 0),s(this,"verticalScrollTimeout",void 0),s(this,"verticalScrollDirection",void 0),this.$container=n,this.refreshHitAreas=i}return l(e,[{key:"checkHorizontalScrolling",value:function(e){var t=this.getNewHorizontalScrollDirection(e);this.horizontalScrollDirection!==t&&(this.horizontalScrollDirection=t,null!=this.horizontalScrollTimeout&&window.clearTimeout(this.verticalScrollTimeout),t&&(this.horizontalScrollTimeout=window.setTimeout(this.scrollHorizontally.bind(this),40)))}},{key:"checkVerticalScrolling",value:function(e){var t=this.getNewVerticalScrollDirection(e);this.verticalScrollDirection!==t&&(this.verticalScrollDirection=t,null!=this.verticalScrollTimeout&&(window.clearTimeout(this.verticalScrollTimeout),this.verticalScrollTimeout=void 0),t&&(this.verticalScrollTimeout=window.setTimeout(this.scrollVertically.bind(this),40)))}},{key:"getScrollLeft",value:function(){return this.$container.scrollLeft()||0}},{key:"scrollToY",value:function(e){this.$container.get(0).scrollTop=e}},{key:"stopScrolling",value:function(){this.horizontalScrollDirection=void 0,this.verticalScrollDirection=void 0,this.scrollParentTop=void 0,this.scrollParentBottom=void 0}},{key:"getNewHorizontalScrollDirection",value:function(e){var t=this.$container.offset();if(t){var n=this.$container.get(0),i=t.left+n.clientWidth,r=t.left;return e>i-20?"right":e<r+20?"left":void 0}}},{key:"getNewVerticalScrollDirection",value:function(e){return e<this.getScrollParentTop()?"top":e>this.getScrollParentBottom()?"bottom":void 0}},{key:"scrollHorizontally",value:function(){if(this.horizontalScrollDirection){var e="left"===this.horizontalScrollDirection?-20:20;this.$container.get(0).scrollBy({left:e,top:0,behavior:"instant"}),this.refreshHitAreas(),setTimeout(this.scrollHorizontally.bind(this),40)}}},{key:"scrollVertically",value:function(){if(this.verticalScrollDirection){var e="top"===this.verticalScrollDirection?-20:20;this.$container.get(0).scrollBy({left:0,top:e,behavior:"instant"}),this.refreshHitAreas(),setTimeout(this.scrollVertically.bind(this),40)}}},{key:"getScrollParentTop",value:function(){var e;null==this.scrollParentTop&&(this.scrollParentTop=(null===(e=this.$container.offset())||void 0===e?void 0:e.top)||0);return this.scrollParentTop}},{key:"getScrollParentBottom",value:function(){var e;null==this.scrollParentBottom&&(this.scrollParentBottom=this.getScrollParentTop()+(null!==(e=this.$container.innerHeight())&&void 0!==e?e:0));return this.scrollParentBottom}}]),e}(),M=function(){function e(t,n){r(this,e),s(this,"$element",void 0),s(this,"horizontalScrollDirection",void 0),s(this,"horizontalScrollTimeout",void 0),s(this,"refreshHitAreas",void 0),s(this,"verticalScrollDirection",void 0),s(this,"verticalScrollTimeout",void 0),s(this,"documentScrollHeight",void 0),s(this,"documentScrollWidth",void 0),this.$element=t,this.refreshHitAreas=n}return l(e,[{key:"checkHorizontalScrolling",value:function(e){var t=this.getNewHorizontalScrollDirection(e);this.horizontalScrollDirection!==t&&(this.horizontalScrollDirection=t,null!=this.horizontalScrollTimeout&&window.clearTimeout(this.horizontalScrollTimeout),t&&(this.horizontalScrollTimeout=window.setTimeout(this.scrollHorizontally.bind(this),40)))}},{key:"checkVerticalScrolling",value:function(e){var t=this.getNewVerticalScrollDirection(e);this.verticalScrollDirection!==t&&(this.verticalScrollDirection=t,null!=this.verticalScrollTimeout&&(window.clearTimeout(this.verticalScrollTimeout),this.verticalScrollTimeout=void 0),t&&(this.verticalScrollTimeout=window.setTimeout(this.scrollVertically.bind(this),40)))}},{key:"getScrollLeft",value:function(){return document.documentElement.scrollLeft}},{key:"scrollToY",value:function(e){var t=this.$element.offset(),n=t?t.top:0;jQuery(document).scrollTop(e+n)}},{key:"stopScrolling",value:function(){this.horizontalScrollDirection=void 0,this.verticalScrollDirection=void 0,this.documentScrollHeight=void 0,this.documentScrollWidth=void 0}},{key:"getNewHorizontalScrollDirection",value:function(e){var t=e-(jQuery(document).scrollLeft()||0)<20;return e>(jQuery(window).width()||0)-20&&this.canScrollRight()?"right":t?"left":void 0}},{key:"canScrollRight",value:function(){var e=document.documentElement;return e.scrollLeft+e.clientWidth<this.getDocumentScrollWidth()}},{key:"canScrollDown",value:function(){var e=document.documentElement;return e.scrollTop+e.clientHeight<this.getDocumentScrollHeight()}},{key:"getDocumentScrollHeight",value:function(){return null==this.documentScrollHeight&&(this.documentScrollHeight=document.documentElement.scrollHeight),this.documentScrollHeight}},{key:"getDocumentScrollWidth",value:function(){return null==this.documentScrollWidth&&(this.documentScrollWidth=document.documentElement.scrollWidth),this.documentScrollWidth}},{key:"getNewVerticalScrollDirection",value:function(e){var t=jQuery(document).scrollTop()||0;return e-t<20?"top":(jQuery(window).height()||0)-(e-t)<20&&this.canScrollDown()?"bottom":void 0}},{key:"scrollHorizontally",value:function(){if(this.horizontalScrollDirection){var e="left"===this.horizontalScrollDirection?-20:20;window.scrollBy({left:e,top:0,behavior:"instant"}),this.refreshHitAreas(),setTimeout(this.scrollHorizontally.bind(this),40)}}},{key:"scrollVertically",value:function(){if(this.verticalScrollDirection){var e="top"===this.verticalScrollDirection?-20:20;window.scrollBy({left:0,top:e,behavior:"instant"}),this.refreshHitAreas(),setTimeout(this.scrollVertically.bind(this),40)}}}]),e}(),B=function(e){for(var t=0,n=["overflow","overflow-y"];t<n.length;t++){var i=n[t],r=e.css(i);if("auto"===r||"scroll"===r)return!0}return!1},x=function(e,t){var n,i=function(e){if(B(e))return e;var t,n=m(e.parents().get());try{for(n.s();!(t=n.n()).done;){var i=t.value,r=jQuery(i);if(B(r))return r}}catch(e){n.e(e)}finally{n.f()}return null}(e);return null!=i&&i.length&&"HTML"!==(null===(n=i[0])||void 0===n?void 0:n.tagName)?new L({$container:i,refreshHitAreas:t,$treeElement:e}):new M(e,t)},$=function(){function e(t){r(this,e),s(this,"treeWidget",void 0),s(this,"scrollParent",void 0),this.treeWidget=t,this.scrollParent=void 0}return l(e,[{key:"checkScrolling",value:function(e){this.checkVerticalScrolling(e),this.checkHorizontalScrolling(e)}},{key:"stopScrolling",value:function(){this.getScrollParent().stopScrolling()}},{key:"scrollToY",value:function(e){this.getScrollParent().scrollToY(e)}},{key:"getScrollLeft",value:function(){return this.getScrollParent().getScrollLeft()}},{key:"checkVerticalScrolling",value:function(e){null!=e.pageY&&this.getScrollParent().checkVerticalScrolling(e.pageY)}},{key:"checkHorizontalScrolling",value:function(e){null!=e.pageX&&this.getScrollParent().checkHorizontalScrolling(e.pageX)}},{key:"getScrollParent",value:function(){return this.scrollParent||(this.scrollParent=x(this.treeWidget.$el,this.treeWidget.refreshHitAreas.bind(this.treeWidget))),this.scrollParent}}]),e}(),q=function(){function e(t){r(this,e),s(this,"treeWidget",void 0),s(this,"selectedNodes",void 0),s(this,"selectedSingleNode",void 0),this.treeWidget=t,this.selectedNodes=new Set,this.clear()}return l(e,[{key:"getSelectedNode",value:function(){var e=this.getSelectedNodes();return e.length&&e[0]||!1}},{key:"getSelectedNodes",value:function(){var e=this;if(this.selectedSingleNode)return[this.selectedSingleNode];var t=[];return this.selectedNodes.forEach((function(n){var i=e.treeWidget.getNodeById(n);i&&t.push(i)})),t}},{key:"getSelectedNodesUnder",value:function(e){if(this.selectedSingleNode)return e.isParentOf(this.selectedSingleNode)?[this.selectedSingleNode]:[];var t=[];for(var n in this.selectedNodes)if(Object.prototype.hasOwnProperty.call(this.selectedNodes,n)){var i=this.treeWidget.getNodeById(n);i&&e.isParentOf(i)&&t.push(i)}return t}},{key:"isNodeSelected",value:function(e){return null!=e.id?this.selectedNodes.has(e.id):!!this.selectedSingleNode&&this.selectedSingleNode.element===e.element}},{key:"clear",value:function(){this.selectedNodes.clear(),this.selectedSingleNode=null}},{key:"removeFromSelection",value:function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];null==e.id?this.selectedSingleNode&&e.element===this.selectedSingleNode.element&&(this.selectedSingleNode=null):(this.selectedNodes.delete(e.id),n&&e.iterate((function(){return null!=e.id&&t.selectedNodes.delete(e.id),!0})))}},{key:"addToSelection",value:function(e){null!=e.id?this.selectedNodes.add(e.id):this.selectedSingleNode=e}},{key:"isFocusOnTree",value:function(){var e=document.activeElement;return Boolean(e&&"SPAN"===e.tagName&&this.treeWidget._containsElement(e))}}]),e}(),U=function(){function e(t,n){r(this,e),s(this,"node",void 0),s(this,"$element",void 0),s(this,"treeWidget",void 0),this.init(t,n)}return l(e,[{key:"init",value:function(e,t){if(this.node=e,this.treeWidget=t,!e.element){var n=this.treeWidget.element.get(0);n&&(e.element=n)}e.element&&(this.$element=jQuery(e.element))}},{key:"addDropHint",value:function(e){return this.mustShowBorderDropHint(e)?new Q(this.$element,this.treeWidget._getScrollLeft()):new R(this.node,this.$element,e)}},{key:"select",value:function(e){var t;this.getLi().addClass("jqtree-selected");var n=this.getSpan();n.attr("tabindex",null!==(t=this.treeWidget.options.tabIndex)&&void 0!==t?t:null),n.attr("aria-selected","true"),e&&n.trigger("focus")}},{key:"deselect",value:function(){this.getLi().removeClass("jqtree-selected");var e=this.getSpan();e.removeAttr("tabindex"),e.attr("aria-selected","false"),e.trigger("blur")}},{key:"getUl",value:function(){return this.$element.children("ul:first")}},{key:"getSpan",value:function(){return this.$element.children(".jqtree-element").find("span.jqtree-title")}},{key:"getLi",value:function(){return this.$element}},{key:"mustShowBorderDropHint",value:function(e){return e===k.Inside}}]),e}(),z=function(e){a(n,e);var t=c(n);function n(){return r(this,n),t.apply(this,arguments)}return l(n,[{key:"open",value:function(e){var t=this,n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"fast";if(!this.node.is_open){this.node.is_open=!0;var r=this.getButton();r.removeClass("jqtree-closed"),r.html("");var o=r.get(0);if(o){var l=this.treeWidget.renderer.openedIconElement;if(l){var s=l.cloneNode(!0);o.appendChild(s)}}var a=function(){t.getLi().removeClass("jqtree-closed"),t.getSpan().attr("aria-expanded","true"),e&&e(t.node),t.treeWidget._triggerEvent("tree.open",{node:t.node})};n?this.getUl().slideDown(i,a):(this.getUl().show(),a())}}},{key:"close",value:function(){var e=this,t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"fast";if(this.node.is_open){this.node.is_open=!1;var i=this.getButton();i.addClass("jqtree-closed"),i.html("");var r=i.get(0);if(r){var o=this.treeWidget.renderer.closedIconElement;if(o){var l=o.cloneNode(!0);r.appendChild(l)}}var s=function(){e.getLi().addClass("jqtree-closed"),e.getSpan().attr("aria-expanded","false"),e.treeWidget._triggerEvent("tree.close",{node:e.node})};t?this.getUl().slideUp(n,s):(this.getUl().hide(),s())}}},{key:"mustShowBorderDropHint",value:function(e){return!this.node.is_open&&e===k.Inside}},{key:"getButton",value:function(){return this.$element.children(".jqtree-element").find("a.jqtree-toggler")}}]),n}(U),Q=function(){function e(t,n){r(this,e),s(this,"$hint",void 0);var i=t.children(".jqtree-element"),o=t.width()||0,l=Math.max(o+n-4,0),a=i.outerHeight()||0,u=Math.max(a-4,0);this.$hint=jQuery('<span class="jqtree-border"></span>'),i.append(this.$hint),this.$hint.css({width:l,height:u})}return l(e,[{key:"remove",value:function(){this.$hint.remove()}}]),e}(),R=function(){function e(t,n,i){r(this,e),s(this,"$element",void 0),s(this,"node",void 0),s(this,"$ghost",void 0),this.$element=n,this.node=t,this.$ghost=jQuery('<li class="jqtree_common jqtree-ghost"><span class="jqtree_common jqtree-circle"></span>\n            <span class="jqtree_common jqtree-line"></span></li>'),i===k.After?this.moveAfter():i===k.Before?this.moveBefore():i===k.Inside&&(t.isFolder()&&t.is_open?this.moveInsideOpenFolder():this.moveInside())}return l(e,[{key:"remove",value:function(){this.$ghost.remove()}},{key:"moveAfter",value:function(){this.$element.after(this.$ghost)}},{key:"moveBefore",value:function(){this.$element.before(this.$ghost)}},{key:"moveInsideOpenFolder",value:function(){var e,t=null===(e=this.node.children[0])||void 0===e?void 0:e.element;t&&jQuery(t).before(this.$ghost)}},{key:"moveInside",value:function(){this.$element.after(this.$ghost),this.$ghost.addClass("jqtree-inside")}}]),e}(),V="Node parameter is empty",Y="Parameter is empty: ",G=function(e){a(o,e);var t=c(o);function o(){var e;r(this,o);for(var n=arguments.length,i=new Array(n),l=0;l<n;l++)i[l]=arguments[l];return s(h(e=t.call.apply(t,[this].concat(i))),"element",void 0),s(h(e),"tree",void 0),s(h(e),"dndHandler",void 0),s(h(e),"renderer",void 0),s(h(e),"dataLoader",void 0),s(h(e),"scrollHandler",void 0),s(h(e),"selectNodeHandler",void 0),s(h(e),"isInitialized",void 0),s(h(e),"saveStateHandler",void 0),s(h(e),"keyHandler",void 0),s(h(e),"handleClick",(function(t){var n=e.getClickTarget(t.target);if(n)if("button"===n.type)e.toggle(n.node,e.options.slide),t.preventDefault(),t.stopPropagation();else if("label"===n.type){var i=n.node;e._triggerEvent("tree.click",{node:i,click_event:t}).isDefaultPrevented()||e.doSelectNode(i)}})),s(h(e),"handleDblclick",(function(t){var n=e.getClickTarget(t.target);"label"===(null==n?void 0:n.type)&&e._triggerEvent("tree.dblclick",{node:n.node,click_event:t})})),s(h(e),"handleContextmenu",(function(t){var n=jQuery(t.target).closest("ul.jqtree-tree .jqtree-element");if(n.length){var i=e.getNode(n);if(i)return t.preventDefault(),t.stopPropagation(),e._triggerEvent("tree.contextmenu",{node:i,click_event:t}),!1}return null})),e}return l(o,[{key:"toggle",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;if(!e)throw Error(V);var n=null!=t?t:this.options.slide;return e.is_open?this.closeNode(e,n):this.openNode(e,n),this.element}},{key:"getTree",value:function(){return this.tree}},{key:"selectNode",value:function(e,t){return this.doSelectNode(e,t),this.element}},{key:"getSelectedNode",value:function(){return this.selectNodeHandler.getSelectedNode()}},{key:"toJson",value:function(){return JSON.stringify(this.tree.getData())}},{key:"loadData",value:function(e,t){return this.doLoadData(e,t),this.element}},{key:"loadDataFromUrl",value:function(e,t,n){return"string"==typeof e?this.doLoadDataFromUrl(e,t,null!=n?n:null):this.doLoadDataFromUrl(null,e,t),this.element}},{key:"reload",value:function(e){return this.doLoadDataFromUrl(null,null,e),this.element}},{key:"refresh",value:function(){return this._refreshElements(null),this.element}},{key:"getNodeById",value:function(e){return this.tree.getNodeById(e)}},{key:"getNodeByName",value:function(e){return this.tree.getNodeByName(e)}},{key:"getNodeByNameMustExist",value:function(e){return this.tree.getNodeByNameMustExist(e)}},{key:"getNodesByProperty",value:function(e,t){return this.tree.getNodesByProperty(e,t)}},{key:"getNodeByHtmlElement",value:function(e){return this.getNode(jQuery(e))}},{key:"getNodeByCallback",value:function(e){return this.tree.getNodeByCallback(e)}},{key:"openNode",value:function(e,t,n){var i=this;if(!e)throw Error(V);var r=function(){var e,r,o;("function"==typeof t?(e=t,r=null):(r=t,e=n),null==r)&&(r=null!==(o=i.options.slide)&&void 0!==o&&o);return[r,e]}(),o=f(r,2),l=o[0],s=o[1];return this._openNode(e,l,s),this.element}},{key:"closeNode",value:function(e,t){if(!e)throw Error(V);var n=null!=t?t:this.options.slide;return(e.isFolder()||e.isEmptyFolder)&&(new z(e,this).close(n,this.options.animationSpeed),this.saveState()),this.element}},{key:"isDragging",value:function(){return this.dndHandler.isDragging}},{key:"refreshHitAreas",value:function(){return this.dndHandler.refresh(),this.element}},{key:"addNodeAfter",value:function(e,t){var n=t.addAfter(e);return n&&this._refreshElements(t.parent),n}},{key:"addNodeBefore",value:function(e,t){if(!t)throw Error(Y+"existingNode");var n=t.addBefore(e);return n&&this._refreshElements(t.parent),n}},{key:"addParentNode",value:function(e,t){if(!t)throw Error(Y+"existingNode");var n=t.addParent(e);return n&&this._refreshElements(n.parent),n}},{key:"removeNode",value:function(e){if(!e)throw Error(V);if(!e.parent)throw Error("Node has no parent");this.selectNodeHandler.removeFromSelection(e,!0);var t=e.parent;return e.remove(),this._refreshElements(t),this.element}},{key:"appendNode",value:function(e,t){var n=t||this.tree,i=n.append(e);return this._refreshElements(n),i}},{key:"prependNode",value:function(e,t){var n=null!=t?t:this.tree,i=n.prepend(e);return this._refreshElements(n),i}},{key:"updateNode",value:function(e,t){if(!e)throw Error(V);var n="object"===i(t)&&t.id&&t.id!==e.id;return n&&this.tree.removeNodeFromIndex(e),e.setData(t),n&&this.tree.addNodeToIndex(e),"object"===i(t)&&t.children&&t.children instanceof Array&&(e.removeChildren(),t.children.length&&e.loadFromData(t.children)),this._refreshElements(e),this.element}},{key:"isSelectedNodeInSubtree",value:function(e){var t=this.getSelectedNode();return!!t&&(e===t||e.isParentOf(t))}},{key:"moveNode",value:function(e,t,n){if(!e)throw Error(V);if(!t)throw Error(Y+"targetNode");var i=N[n];return void 0!==i&&(this.tree.moveNode(e,t,i),this._refreshElements(null)),this.element}},{key:"getStateFromStorage",value:function(){return this.saveStateHandler.getStateFromStorage()}},{key:"addToSelection",value:function(e,t){if(!e)throw Error(V);return this.selectNodeHandler.addToSelection(e),this._getNodeElementForNode(e).select(void 0===t||t),this.saveState(),this.element}},{key:"getSelectedNodes",value:function(){return this.selectNodeHandler.getSelectedNodes()}},{key:"isNodeSelected",value:function(e){if(!e)throw Error(V);return this.selectNodeHandler.isNodeSelected(e)}},{key:"removeFromSelection",value:function(e){if(!e)throw Error(V);return this.selectNodeHandler.removeFromSelection(e),this._getNodeElementForNode(e).deselect(),this.saveState(),this.element}},{key:"scrollToNode",value:function(e){var t,n,i,r;if(!e)throw Error(V);var o=(null!==(t=null===(n=jQuery(e.element).offset())||void 0===n?void 0:n.top)&&void 0!==t?t:0)-(null!==(i=null===(r=this.$el.offset())||void 0===r?void 0:r.top)&&void 0!==i?i:0);return this.scrollHandler.scrollToY(o),this.element}},{key:"getState",value:function(){return this.saveStateHandler.getState()}},{key:"setState",value:function(e){return this.saveStateHandler.setInitialState(e),this._refreshElements(null),this.element}},{key:"setOption",value:function(e,t){return this.options[e]=t,this.element}},{key:"moveDown",value:function(){var e=this.getSelectedNode();return e&&this.keyHandler.moveDown(e),this.element}},{key:"moveUp",value:function(){var e=this.getSelectedNode();return e&&this.keyHandler.moveUp(e),this.element}},{key:"getVersion",value:function(){return"1.7.5"}},{key:"_triggerEvent",value:function(e,t){var n=jQuery.Event(e,t);return this.element.trigger(n),n}},{key:"_openNode",value:function(e){var t=this,n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],i=arguments.length>2?arguments[2]:void 0,r=function(e,n,i){new z(e,t).open(i,n,t.options.animationSpeed)};if(e.isFolder()||e.isEmptyFolder)if(e.load_on_demand)this.loadFolderOnDemand(e,n,i);else{for(var o=e.parent;o;)o.parent&&r(o,!1,null),o=o.parent;r(e,n,i),this.saveState()}}},{key:"_refreshElements",value:function(e){var t=this.selectNodeHandler.isFocusOnTree(),n=!!e&&this.isSelectedNodeInSubtree(e);this.renderer.render(e),n&&this.selectCurrentNode(t),this._triggerEvent("tree.refresh")}},{key:"_getNodeElementForNode",value:function(e){return e.isFolder()?new z(e,this):new U(e,this)}},{key:"_getNodeElement",value:function(e){var t=this.getNode(e);return t?this._getNodeElementForNode(t):null}},{key:"_containsElement",value:function(e){var t=this.getNode(jQuery(e));return null!=t&&t.tree===this.tree}},{key:"_getScrollLeft",value:function(){return this.scrollHandler.getScrollLeft()}},{key:"init",value:function(){v(u(o.prototype),"init",this).call(this),this.element=this.$el,this.isInitialized=!1,this.options.rtl=this.getRtlOption(),null==this.options.closedIcon&&(this.options.closedIcon=this.getDefaultClosedIcon()),this.renderer=new T(this),this.dataLoader=new j(this),this.saveStateHandler=new O(this),this.selectNodeHandler=new q(this),this.dndHandler=new _(this),this.scrollHandler=new $(this),this.keyHandler=new I(this),this.initData(),this.element.on("click",this.handleClick),this.element.on("dblclick",this.handleDblclick),this.options.useContextMenu&&this.element.on("contextmenu",this.handleContextmenu)}},{key:"deinit",value:function(){this.element.empty(),this.element.off(),this.keyHandler.deinit(),this.tree=new b({},!0),v(u(o.prototype),"deinit",this).call(this)}},{key:"mouseCapture",value:function(e){return!!this.options.dragAndDrop&&this.dndHandler.mouseCapture(e)}},{key:"mouseStart",value:function(e){return!!this.options.dragAndDrop&&this.dndHandler.mouseStart(e)}},{key:"mouseDrag",value:function(e){if(this.options.dragAndDrop){var t=this.dndHandler.mouseDrag(e);return this.scrollHandler.checkScrolling(e),t}return!1}},{key:"mouseStop",value:function(e){return!!this.options.dragAndDrop&&(this.scrollHandler.stopScrolling(),this.dndHandler.mouseStop(e))}},{key:"getMouseDelay",value:function(){var e;return null!==(e=this.options.startDndDelay)&&void 0!==e?e:0}},{key:"initData",value:function(){this.options.data?this.doLoadData(this.options.data,null):this.getDataUrlInfo(null)?this.doLoadDataFromUrl(null,null,null):this.doLoadData([],null)}},{key:"getDataUrlInfo",value:function(e){var t,n=this,r=this.options.dataUrl||this.element.data("url"),o=function(t){if(null!=e&&e.id){var i={node:e.id};t.data=i}else{var r=n.getNodeIdToBeSelected();if(r){var o={selected_node:r};t.data=o}}};return"function"==typeof r?r(e):"string"==typeof r?(o(t={url:r}),t):r&&"object"===i(r)?(o(r),r):null}},{key:"getNodeIdToBeSelected",value:function(){return this.options.saveState?this.saveStateHandler.getNodeIdToBeSelected():null}},{key:"initTree",value:function(e){var t=this,n=function(){t.isInitialized||(t.isInitialized=!0,t._triggerEvent("tree.init"))};if(this.options.nodeClass){this.tree=new this.options.nodeClass(null,!0,this.options.nodeClass),this.selectNodeHandler.clear(),this.tree.loadFromData(e);var i=this.setInitialState();this._refreshElements(null),i?this.setInitialStateOnDemand(n):n()}}},{key:"setInitialState",value:function(){var e=this,t=f(function(){if(e.options.saveState){var t=e.saveStateHandler.getStateFromStorage();return t?[!0,e.saveStateHandler.setInitialState(t)]:[!1,!1]}return[!1,!1]}(),2),n=t[0],i=t[1];return n||(i=function(){if(!1===e.options.autoOpen)return!1;var t=e.getAutoOpenMaxLevel(),n=!1;return e.tree.iterate((function(e,i){return e.load_on_demand?(n=!0,!1):!!e.hasChildren()&&(e.is_open=!0,i!==t)})),n}()),i}},{key:"setInitialStateOnDemand",value:function(e){var t,n,i,r,o=this;(function(){if(o.options.saveState){var t=o.saveStateHandler.getStateFromStorage();return!!t&&(o.saveStateHandler.setInitialStateOnDemand(t,e),!0)}return!1})()||(t=o.getAutoOpenMaxLevel(),n=0,i=function(e){n+=1,o._openNode(e,!1,(function(){n-=1,r()}))},(r=function(){o.tree.iterate((function(e,n){return e.load_on_demand?(e.is_loading||i(e),!1):(o._openNode(e,!1,null),n!==t)})),0===n&&e()})())}},{key:"getAutoOpenMaxLevel",value:function(){return!0===this.options.autoOpen?-1:"number"==typeof this.options.autoOpen?this.options.autoOpen:"string"==typeof this.options.autoOpen?parseInt(this.options.autoOpen,10):0}},{key:"getClickTarget",value:function(e){var t=jQuery(e),n=t.closest(".jqtree-toggler");if(n.length){var i=this.getNode(n);if(i)return{type:"button",node:i}}else{var r=t.closest(".jqtree-element");if(r.length){var o=this.getNode(r);if(o)return{type:"label",node:o}}}return null}},{key:"getNode",value:function(e){var t=e.closest("li.jqtree_common");return 0===t.length?null:t.data("node")}},{key:"saveState",value:function(){this.options.saveState&&this.saveStateHandler.saveState()}},{key:"selectCurrentNode",value:function(e){var t=this.getSelectedNode();if(t){var n=this._getNodeElementForNode(t);n&&n.select(e)}}},{key:"deselectCurrentNode",value:function(){var e=this.getSelectedNode();e&&this.removeFromSelection(e)}},{key:"getDefaultClosedIcon",value:function(){return this.options.rtl?"&#x25c0;":"&#x25ba;"}},{key:"getRtlOption",value:function(){if(null!=this.options.rtl)return this.options.rtl;var e=this.element.data("rtl");return null!==e&&!1!==e&&void 0!==e}},{key:"doSelectNode",value:function(e,t){var i=this,r=function(){i.options.saveState&&i.saveStateHandler.saveState()};if(!e)return this.deselectCurrentNode(),void r();var o=n(n({},{mustSetFocus:!0,mustToggle:!0}),t||{});if(i.options.onCanSelectNode?!0===i.options.selectable&&i.options.onCanSelectNode(e):!0===i.options.selectable){if(this.selectNodeHandler.isNodeSelected(e))o.mustToggle&&(this.deselectCurrentNode(),this._triggerEvent("tree.select",{node:null,previous_node:e}));else{var l=this.getSelectedNode()||null;this.deselectCurrentNode(),this.addToSelection(e,o.mustSetFocus),this._triggerEvent("tree.select",{node:e,deselected_node:l}),(s=e.parent)&&s.parent&&!s.is_open&&i.openNode(s,!1)}var s;r()}}},{key:"doLoadData",value:function(e,t){e&&(t?(this.deselectNodes(t),this.loadSubtree(e,t)):this.initTree(e),this.isDragging()&&this.dndHandler.refresh()),this._triggerEvent("tree.load_data",{tree_data:e,parent_node:t})}},{key:"deselectNodes",value:function(e){var t,n=m(this.selectNodeHandler.getSelectedNodesUnder(e));try{for(n.s();!(t=n.n()).done;){var i=t.value;this.selectNodeHandler.removeFromSelection(i)}}catch(e){n.e(e)}finally{n.f()}}},{key:"loadSubtree",value:function(e,t){t.loadFromData(e),t.load_on_demand=!1,t.is_loading=!1,this._refreshElements(t)}},{key:"doLoadDataFromUrl",value:function(e,t,n){var i=e||this.getDataUrlInfo(t);this.dataLoader.loadFromUrl(i,t,n)}},{key:"loadFolderOnDemand",value:function(e){var t=this,n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],i=arguments.length>2?arguments[2]:void 0;e.is_loading=!0,this.doLoadDataFromUrl(null,e,(function(){t._openNode(e,n,i)}))}}]),o}(P);return s(G,"defaults",{animationSpeed:"fast",autoEscape:!0,autoOpen:!1,buttonLeft:!0,closedIcon:void 0,data:void 0,dataFilter:void 0,dataUrl:void 0,dragAndDrop:!1,keyboardSupport:!0,nodeClass:b,onCanMove:void 0,onCanMoveTo:void 0,onCanSelectNode:void 0,onCreateLi:void 0,onDragMove:void 0,onDragStop:void 0,onGetStateFromStorage:void 0,onIsMoveHandle:void 0,onLoadFailed:void 0,onLoading:void 0,onSetStateFromStorage:void 0,openedIcon:"&#x25bc;",openFolderDelay:500,rtl:void 0,saveState:!1,selectable:!0,showEmptyFolder:!1,slide:!0,startDndDelay:300,tabIndex:0,useContextMenu:!0}),F.register(G,"tree"),e.JqTreeWidget=G,e}({});
//# sourceMappingURL=tree.jquery.js.b22a4446333f.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// EXTERNAL MODULE: ./node_modules/.pnpm/jqtree@1.7.5_jquery@3.7.1/node_modules/jqtree/tree.jquery.js
var tree_jquery = __webpack_require__(631);
;// CONCATENATED MODULE: ./node_modules/.pnpm/spin.js@4.1.1/node_modules/spin.js/spin.js
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var defaults = {
    lines: 12,
    length: 7,
    width: 5,
    radius: 10,
    scale: 1.0,
    corners: 1,
    color: '#000',
    fadeColor: 'transparent',
    animation: 'spinner-line-fade-default',
    rotate: 0,
    direction: 1,
    speed: 1,
    zIndex: 2e9,
    className: 'spinner',
    top: '50%',
    left: '50%',
    shadow: '0 0 1px transparent',
    position: 'absolute',
};
var Spinner = /** @class */ (function () {
    function Spinner(opts) {
        if (opts === void 0) { opts = {}; }
        this.opts = __assign(__assign({}, defaults), opts);
    }
    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target by calling
     * stop() internally.
     */
    Spinner.prototype.spin = function (target) {
        this.stop();
        this.el = document.createElement('div');
        this.el.className = this.opts.className;
        this.el.setAttribute('role', 'progressbar');
        css(this.el, {
            position: this.opts.position,
            width: 0,
            zIndex: this.opts.zIndex,
            left: this.opts.left,
            top: this.opts.top,
            transform: "scale(" + this.opts.scale + ")",
        });
        if (target) {
            target.insertBefore(this.el, target.firstChild || null);
        }
        drawLines(this.el, this.opts);
        return this;
    };
    /**
     * Stops and removes the Spinner.
     * Stopped spinners may be reused by calling spin() again.
     */
    Spinner.prototype.stop = function () {
        if (this.el) {
            if (typeof requestAnimationFrame !== 'undefined') {
                cancelAnimationFrame(this.animateId);
            }
            else {
                clearTimeout(this.animateId);
            }
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
            this.el = undefined;
        }
        return this;
    };
    return Spinner;
}());

/**
 * Sets multiple style properties at once.
 */
function css(el, props) {
    for (var prop in props) {
        el.style[prop] = props[prop];
    }
    return el;
}
/**
 * Returns the line color from the given string or array.
 */
function getColor(color, idx) {
    return typeof color == 'string' ? color : color[idx % color.length];
}
/**
 * Internal method that draws the individual lines.
 */
function drawLines(el, opts) {
    var borderRadius = (Math.round(opts.corners * opts.width * 500) / 1000) + 'px';
    var shadow = 'none';
    if (opts.shadow === true) {
        shadow = '0 2px 4px #000'; // default shadow
    }
    else if (typeof opts.shadow === 'string') {
        shadow = opts.shadow;
    }
    var shadows = parseBoxShadow(shadow);
    for (var i = 0; i < opts.lines; i++) {
        var degrees = ~~(360 / opts.lines * i + opts.rotate);
        var backgroundLine = css(document.createElement('div'), {
            position: 'absolute',
            top: -opts.width / 2 + "px",
            width: (opts.length + opts.width) + 'px',
            height: opts.width + 'px',
            background: getColor(opts.fadeColor, i),
            borderRadius: borderRadius,
            transformOrigin: 'left',
            transform: "rotate(" + degrees + "deg) translateX(" + opts.radius + "px)",
        });
        var delay = i * opts.direction / opts.lines / opts.speed;
        delay -= 1 / opts.speed; // so initial animation state will include trail
        var line = css(document.createElement('div'), {
            width: '100%',
            height: '100%',
            background: getColor(opts.color, i),
            borderRadius: borderRadius,
            boxShadow: normalizeShadow(shadows, degrees),
            animation: 1 / opts.speed + "s linear " + delay + "s infinite " + opts.animation,
        });
        backgroundLine.appendChild(line);
        el.appendChild(backgroundLine);
    }
}
function parseBoxShadow(boxShadow) {
    var regex = /^\s*([a-zA-Z]+\s+)?(-?\d+(\.\d+)?)([a-zA-Z]*)\s+(-?\d+(\.\d+)?)([a-zA-Z]*)(.*)$/;
    var shadows = [];
    for (var _i = 0, _a = boxShadow.split(','); _i < _a.length; _i++) {
        var shadow = _a[_i];
        var matches = shadow.match(regex);
        if (matches === null) {
            continue; // invalid syntax
        }
        var x = +matches[2];
        var y = +matches[5];
        var xUnits = matches[4];
        var yUnits = matches[7];
        if (x === 0 && !xUnits) {
            xUnits = yUnits;
        }
        if (y === 0 && !yUnits) {
            yUnits = xUnits;
        }
        if (xUnits !== yUnits) {
            continue; // units must match to use as coordinates
        }
        shadows.push({
            prefix: matches[1] || '',
            x: x,
            y: y,
            xUnits: xUnits,
            yUnits: yUnits,
            end: matches[8],
        });
    }
    return shadows;
}
/**
 * Modify box-shadow x/y offsets to counteract rotation
 */
function normalizeShadow(shadows, degrees) {
    var normalized = [];
    for (var _i = 0, shadows_1 = shadows; _i < shadows_1.length; _i++) {
        var shadow = shadows_1[_i];
        var xy = convertOffset(shadow.x, shadow.y, degrees);
        normalized.push(shadow.prefix + xy[0] + shadow.xUnits + ' ' + xy[1] + shadow.yUnits + shadow.end);
    }
    return normalized.join(', ');
}
function convertOffset(x, y, degrees) {
    var radians = degrees * Math.PI / 180;
    var sin = Math.sin(radians);
    var cos = Math.cos(radians);
    return [
        Math.round((x * cos + y * sin) * 1000) / 1000,
        Math.round((-x * sin + y * cos) * 1000) / 1000,
    ];
}

// EXTERNAL MODULE: ./node_modules/.pnpm/cookie@0.5.0/node_modules/cookie/index.js
var cookie = __webpack_require__(591);
;// CONCATENATED MODULE: ./django_mptt_admin.ts




// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access

function initTree($tree, _ref) {
  var animationSpeed = _ref.animationSpeed,
    autoOpen = _ref.autoOpen,
    autoEscape = _ref.autoEscape,
    csrfCookieName = _ref.csrfCookieName,
    dragAndDrop = _ref.dragAndDrop,
    hasAddPermission = _ref.hasAddPermission,
    hasChangePermission = _ref.hasChangePermission,
    mouseDelay = _ref.mouseDelay,
    rtl = _ref.rtl;
  var errorNode = null;
  var baseUrl = "http://example.com";
  var insertAtUrl = new URL($tree.data("insert_at_url"), baseUrl);
  function createLi(node, $li, isSelected) {
    // Create edit link
    var $title = $li.find(".jqtree-title");
    insertAtUrl.searchParams.set("insert_at", "".concat(node.id));
    var insertUrlString = insertAtUrl.toString().substring(baseUrl.length);
    var tabindex = isSelected ? "0" : "-1";
    var editCaption = hasChangePermission ? gettext("edit") : gettext("view");
    $title.after("<a href=\"".concat(node.url, "\" class=\"edit\" tabindex=\"").concat(tabindex, "\">(").concat(editCaption, ")</a>"), hasAddPermission ? "<a href=\"".concat(insertUrlString, "\" class=\"edit\" tabindex=\"").concat(tabindex, "\">(").concat(gettext("add"), ")</a>") : "");
  }
  function getCsrfToken() {
    function getFromMiddleware() {
      return document.querySelector('[name="csrfmiddlewaretoken"]').value;
    }
    function getFromCookie() {
      if (!csrfCookieName) {
        return null;
      } else {
        return cookie/* parse */.Q(document.cookie)[csrfCookieName];
      }
    }
    return getFromCookie() || getFromMiddleware();
  }
  function handleMove(eventParam) {
    var e = eventParam;
    var info = e.move_info;
    var data = {
      target_id: info.target_node.id,
      position: info.position
    };
    var $el = jQuery(info.moved_node.element);
    handleLoading(true, null, $el);
    removeErrorMessage();
    e.preventDefault();
    void jQuery.ajax({
      type: "POST",
      url: info.moved_node.move_url,
      data: data,
      beforeSend: function beforeSend(xhr) {
        // Set Django csrf token
        xhr.setRequestHeader("X-CSRFToken", getCsrfToken());
      },
      success: function success() {
        info.do_move();
        handleLoading(false, null, $el);
      },
      error: function error() {
        handleLoading(false, null, $el);
        var $node = $el.find(".jqtree-element");
        $node.append("<span class=\"mptt-admin-error\">".concat(gettext("move failed"), "</span>"));
        errorNode = info.moved_node;
      }
    });
    function removeErrorMessage() {
      if (errorNode) {
        jQuery(errorNode.element).find(".mptt-admin-error").remove();
        errorNode = null;
      }
    }
  }
  function handleLoadFailed() {
    $tree.html(gettext("Error while loading the data from the server"));
  }
  var spinners = {};
  function handleLoading(isLoading, node, $el) {
    function getNodeId() {
      if (!node) {
        return "__root__";
      } else {
        return node.id;
      }
    }
    function getContainer() {
      if (node) {
        return $el.find(".jqtree-element")[0];
      } else {
        return $el[0];
      }
    }
    var nodeId = getNodeId();
    if (isLoading) {
      spinners[nodeId] = new Spinner().spin(getContainer());
    } else {
      var spinner = spinners[nodeId];
      if (spinner) {
        spinner.stop();
        spinners[nodeId] = null;
      }
    }
  }
  function handleSelect(eventParam) {
    var e = eventParam;
    var node = e.node,
      deselected_node = e.deselected_node;
    if (deselected_node) {
      // deselected node: remove tabindex
      jQuery(deselected_node.element).find(".edit").attr("tabindex", -1);
    }
    if (node) {
      // selected: add tabindex
      jQuery(node.element).find(".edit").attr("tabindex", 0);
    }
  }
  var treeOptions = {
    autoOpen: autoOpen,
    autoEscape: autoEscape,
    buttonLeft: rtl,
    closedIcon: rtl ? "&#x25c0;" : "&#x25ba;",
    dragAndDrop: dragAndDrop && hasChangePermission,
    onCreateLi: createLi,
    onLoadFailed: handleLoadFailed,
    onLoading: handleLoading,
    saveState: $tree.data("save_state"),
    useContextMenu: Boolean($tree.data("use_context_menu"))
  };
  if (animationSpeed !== null) {
    treeOptions["animationSpeed"] = animationSpeed;
  }
  if (mouseDelay != null) {
    treeOptions["startDndDelay"] = mouseDelay;
  }
  $tree.tree(treeOptions);
  $tree.on("tree.move", handleMove);
  $tree.on("tree.select", handleSelect);
}
jQuery(function () {
  var $tree = jQuery("#tree");
  if ($tree.length) {
    var animationSpeed = $tree.data("tree-animation-speed");
    var autoOpen = $tree.data("auto_open");
    var autoEscape = Boolean($tree.data("autoescape"));
    var hasAddPermission = Boolean($tree.data("has-add-permission"));
    var hasChangePermission = Boolean($tree.data("has-change-permission"));
    var mouseDelay = $tree.data("tree-mouse-delay");
    var dragAndDrop = $tree.data("drag-and-drop");
    var rtl = $tree.data("rtl") === "1";
    var csrfCookieName = $tree.data("csrf-cookie-name");
    initTree($tree, {
      animationSpeed: animationSpeed,
      autoOpen: autoOpen,
      autoEscape: autoEscape,
      csrfCookieName: csrfCookieName,
      dragAndDrop: dragAndDrop,
      hasAddPermission: hasAddPermission,
      hasChangePermission: hasChangePermission,
      mouseDelay: mouseDelay,
      rtl: rtl
    });
  }
});
})();

/******/ })()
;
//# sourceMappingURL=django_mptt_admin.debug.js.3700ee8792b7.map