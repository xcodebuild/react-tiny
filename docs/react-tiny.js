require=function(r,e,n){function t(n,o){function i(r){return t(i.resolve(r))}function f(e){return r[n][1][e]||e}if(!e[n]){if(!r[n]){var c="function"==typeof require&&require;if(!o&&c)return c(n,!0);if(u)return u(n,!0);var l=new Error("Cannot find module '"+n+"'");throw l.code="MODULE_NOT_FOUND",l}i.resolve=f;var s=e[n]=new t.Module(n);r[n][0].call(s.exports,i,s,s.exports)}return e[n].exports}function o(r){this.id=r,this.bundle=t,this.exports={}}var u="function"==typeof require&&require;t.isParcelRequire=!0,t.Module=o,t.modules=r,t.cache=e,t.parent=u;for(var i=0;i<n.length;i++)t(n[i]);return t}({8:[function(require,module,exports) {
"use strict";function e(e){var t=document.createElement("div");return t.setAttribute("id","test-container-"+e),t.append=function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:document.body).appendChild(t),t.childNodes[0]},t}Object.defineProperty(exports,"__esModule",{value:!0}),exports.createContainer=e;
},{}],11:[function(require,module,exports) {
"use strict";exports.__esModule=!0,exports.default=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")};
},{}],29:[function(require,module,exports) {

var e=module.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e);
},{}],20:[function(require,module,exports) {
var e=module.exports={version:"2.5.3"};"number"==typeof __e&&(__e=e);
},{}],38:[function(require,module,exports) {
module.exports=function(o){if("function"!=typeof o)throw TypeError(o+" is not a function!");return o};
},{}],30:[function(require,module,exports) {
var r=require("./_a-function");module.exports=function(n,t,u){if(r(n),void 0===t)return n;switch(u){case 1:return function(r){return n.call(t,r)};case 2:return function(r,u){return n.call(t,r,u)};case 3:return function(r,u,e){return n.call(t,r,u,e)}}return function(){return n.apply(t,arguments)}};
},{"./_a-function":38}],37:[function(require,module,exports) {
module.exports=function(o){return"object"==typeof o?null!==o:"function"==typeof o};
},{}],33:[function(require,module,exports) {
var r=require("./_is-object");module.exports=function(e){if(!r(e))throw TypeError(e+" is not an object!");return e};
},{"./_is-object":37}],32:[function(require,module,exports) {
module.exports=function(r){try{return!!r()}catch(r){return!0}};
},{}],24:[function(require,module,exports) {
module.exports=!require("./_fails")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a});
},{"./_fails":32}],39:[function(require,module,exports) {
var e=require("./_is-object"),r=require("./_global").document,t=e(r)&&e(r.createElement);module.exports=function(e){return t?r.createElement(e):{}};
},{"./_is-object":37,"./_global":29}],34:[function(require,module,exports) {
module.exports=!require("./_descriptors")&&!require("./_fails")(function(){return 7!=Object.defineProperty(require("./_dom-create")("div"),"a",{get:function(){return 7}}).a});
},{"./_descriptors":24,"./_fails":32,"./_dom-create":39}],35:[function(require,module,exports) {
var t=require("./_is-object");module.exports=function(r,e){if(!t(r))return r;var o,n;if(e&&"function"==typeof(o=r.toString)&&!t(n=o.call(r)))return n;if("function"==typeof(o=r.valueOf)&&!t(n=o.call(r)))return n;if(!e&&"function"==typeof(o=r.toString)&&!t(n=o.call(r)))return n;throw TypeError("Can't convert object to primitive value")};
},{"./_is-object":37}],25:[function(require,module,exports) {
var e=require("./_an-object"),r=require("./_ie8-dom-define"),t=require("./_to-primitive"),i=Object.defineProperty;exports.f=require("./_descriptors")?Object.defineProperty:function(o,n,u){if(e(o),n=t(n,!0),e(u),r)try{return i(o,n,u)}catch(e){}if("get"in u||"set"in u)throw TypeError("Accessors not supported!");return"value"in u&&(o[n]=u.value),o};
},{"./_an-object":33,"./_ie8-dom-define":34,"./_to-primitive":35,"./_descriptors":24}],36:[function(require,module,exports) {
module.exports=function(e,r){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:r}};
},{}],31:[function(require,module,exports) {
var r=require("./_object-dp"),e=require("./_property-desc");module.exports=require("./_descriptors")?function(t,u,o){return r.f(t,u,e(1,o))}:function(r,e,t){return r[e]=t,r};
},{"./_object-dp":25,"./_property-desc":36,"./_descriptors":24}],23:[function(require,module,exports) {

var e=require("./_global"),r=require("./_core"),n=require("./_ctx"),t=require("./_hide"),i="prototype",u=function(o,c,a){var f,l,s,p=o&u.F,v=o&u.G,h=o&u.S,w=o&u.P,q=o&u.B,y=o&u.W,_=v?r:r[c]||(r[c]={}),d=_[i],F=v?e:h?e[c]:(e[c]||{})[i];for(f in v&&(a=c),a)(l=!p&&F&&void 0!==F[f])&&f in _||(s=l?F[f]:a[f],_[f]=v&&"function"!=typeof F[f]?a[f]:q&&l?n(s,e):y&&F[f]==s?function(e){var r=function(r,n,t){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(r);case 2:return new e(r,n)}return new e(r,n,t)}return e.apply(this,arguments)};return r[i]=e[i],r}(s):w&&"function"==typeof s?n(Function.call,s):s,w&&((_.virtual||(_.virtual={}))[f]=s,o&u.R&&d&&!d[f]&&t(d,f,s)))};u.F=1,u.G=2,u.S=4,u.P=8,u.B=16,u.W=32,u.U=64,u.R=128,module.exports=u;
},{"./_global":29,"./_core":20,"./_ctx":30,"./_hide":31}],19:[function(require,module,exports) {
var e=require("./_export");e(e.S+e.F*!require("./_descriptors"),"Object",{defineProperty:require("./_object-dp").f});
},{"./_export":23,"./_descriptors":24,"./_object-dp":25}],17:[function(require,module,exports) {
require("../../modules/es6.object.define-property");var e=require("../../modules/_core").Object;module.exports=function(r,o,t){return e.defineProperty(r,o,t)};
},{"../../modules/es6.object.define-property":19,"../../modules/_core":20}],15:[function(require,module,exports) {
module.exports={default:require("core-js/library/fn/object/define-property"),__esModule:!0};
},{"core-js/library/fn/object/define-property":17}],12:[function(require,module,exports) {
"use strict";exports.__esModule=!0;var e=require("../core-js/object/define-property"),r=t(e);function t(e){return e&&e.__esModule?e:{default:e}}exports.default=function(){function e(e,t){for(var u=0;u<t.length;u++){var n=t[u];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),(0,r.default)(e,n.key,n)}}return function(r,t,u){return t&&e(r.prototype,t),u&&e(r,u),r}}();
},{"../core-js/object/define-property":15}],7:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("babel-runtime/helpers/classCallCheck"),n=i(e),r=require("babel-runtime/helpers/createClass"),t=i(r);function i(e){return e&&e.__esModule?e:{default:e}}var o={DOM:"DOM"},u=function(){function e(r){var t=r.nodeType,i=r.nodeOrigin,o=r.children;(0,n.default)(this,e),this.nodeType=t,this.nodeOrigin=i,this.children=o}return(0,t.default)(e,[{key:"mount",value:function(){if(this.nodeType===o.DOM){var e=(this.children||[]).map(function(e){return"string"==typeof e?e:e.mount()}).join("");return"<"+this.nodeOrigin+">"+e+"</"+this.nodeOrigin+">"}}}]),e}();function l(e,n){for(var r=arguments.length,t=Array(r>2?r-2:0),i=2;i<r;i++)t[i-2]=arguments[i];if("string"==typeof e)return new u({nodeType:o.DOM,nodeOrigin:e,children:t})}function s(e,n){n.innerHTML=e.mount()}exports.default={createElement:l,render:s};
},{"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12}],5:[function(require,module,exports) {
"use strict";var e=require("./utils"),t=require("../index"),r=n(t);function n(e){return e&&e.__esModule?e:{default:e}}describe("Render",function(){it("<div>test</div> should be render as <div>test</div>",function(){var t=(0,e.createContainer)("render-simple");r.default.render(r.default.createElement("div",null,"test"),t);var n=t.append();expect(n.nodeName.toUpperCase()).toEqual("DIV"),expect(n.innerText).toEqual("test")})});
},{"./utils":8,"../index":7}],3:[function(require,module,exports) {
"use strict";require("./render-spec");
},{"./render-spec":5}],1:[function(require,module,exports) {
"use strict";require("./src/test/index");
},{"./src/test/index":3}]},{},[1])