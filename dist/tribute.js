(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Tribute = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require("./utils");

var _utils2 = _interopRequireDefault(_utils);

var _TributeEvents = require("./TributeEvents");

var _TributeEvents2 = _interopRequireDefault(_TributeEvents);

var _TributeMenuEvents = require("./TributeMenuEvents");

var _TributeMenuEvents2 = _interopRequireDefault(_TributeMenuEvents);

var _TributeRange = require("./TributeRange");

var _TributeRange2 = _interopRequireDefault(_TributeRange);

var _TributeSearch = require("./TributeSearch");

var _TributeSearch2 = _interopRequireDefault(_TributeSearch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tribute = function () {
    function Tribute(_ref) {
        var _this = this;

        var _ref$values = _ref.values,
            values = _ref$values === undefined ? null : _ref$values,
            _ref$iframe = _ref.iframe,
            iframe = _ref$iframe === undefined ? null : _ref$iframe,
            _ref$selectClass = _ref.selectClass,
            selectClass = _ref$selectClass === undefined ? 'highlight' : _ref$selectClass,
            _ref$trigger = _ref.trigger,
            trigger = _ref$trigger === undefined ? '@' : _ref$trigger,
            _ref$selectTemplate = _ref.selectTemplate,
            selectTemplate = _ref$selectTemplate === undefined ? null : _ref$selectTemplate,
            _ref$menuItemTemplate = _ref.menuItemTemplate,
            menuItemTemplate = _ref$menuItemTemplate === undefined ? null : _ref$menuItemTemplate,
            _ref$lookup = _ref.lookup,
            lookup = _ref$lookup === undefined ? 'key' : _ref$lookup,
            _ref$fillAttr = _ref.fillAttr,
            fillAttr = _ref$fillAttr === undefined ? 'value' : _ref$fillAttr,
            _ref$collection = _ref.collection,
            collection = _ref$collection === undefined ? null : _ref$collection,
            _ref$menuContainer = _ref.menuContainer,
            menuContainer = _ref$menuContainer === undefined ? null : _ref$menuContainer,
            _ref$noMatchTemplate = _ref.noMatchTemplate,
            noMatchTemplate = _ref$noMatchTemplate === undefined ? null : _ref$noMatchTemplate,
            _ref$requireLeadingSp = _ref.requireLeadingSpace,
            requireLeadingSpace = _ref$requireLeadingSp === undefined ? true : _ref$requireLeadingSp,
            _ref$allowSpaces = _ref.allowSpaces,
            allowSpaces = _ref$allowSpaces === undefined ? false : _ref$allowSpaces,
            _ref$replaceTextSuffi = _ref.replaceTextSuffix,
            replaceTextSuffix = _ref$replaceTextSuffi === undefined ? null : _ref$replaceTextSuffi;

        _classCallCheck(this, Tribute);

        this.menuSelected = 0;
        this.current = {};
        this.inputEvent = false;
        this.isActive = false;
        this.menuContainer = menuContainer;
        this.allowSpaces = allowSpaces;
        this.replaceTextSuffix = replaceTextSuffix;

        if (values) {
            this.collection = [{
                // symbol that starts the lookup
                trigger: trigger,

                iframe: iframe,

                selectClass: selectClass,

                // function called on select that retuns the content to insert
                selectTemplate: (selectTemplate || Tribute.defaultSelectTemplate).bind(this),

                // function called that returns content for an item
                menuItemTemplate: (menuItemTemplate || Tribute.defaultMenuItemTemplate).bind(this),

                // function called when menu is empty, disables hiding of menu.
                noMatchTemplate: function (t) {
                    if (typeof t === 'function') {
                        return t.bind(_this);
                    }

                    return null;
                }(noMatchTemplate),

                // column to search against in the object
                lookup: lookup,

                // column that contains the content to insert by default
                fillAttr: fillAttr,

                // array of objects or a function returning an array of objects
                values: values,

                requireLeadingSpace: requireLeadingSpace
            }];
        } else if (collection) {
            this.collection = collection.map(function (item) {
                return {
                    trigger: item.trigger || trigger,
                    iframe: item.iframe || iframe,
                    selectClass: item.selectClass || selectClass,
                    selectTemplate: (item.selectTemplate || Tribute.defaultSelectTemplate).bind(_this),
                    menuItemTemplate: (item.menuItemTemplate || Tribute.defaultMenuItemTemplate).bind(_this),
                    // function called when menu is empty, disables hiding of menu.
                    noMatchTemplate: function (t) {
                        if (typeof t === 'function') {
                            return t.bind(_this);
                        }

                        return null;
                    }(noMatchTemplate),
                    lookup: item.lookup || lookup,
                    fillAttr: item.fillAttr || fillAttr,
                    values: item.values,
                    requireLeadingSpace: item.requireLeadingSpace
                };
            });
        } else {
            throw new Error('[Tribute] No collection specified.');
        }

        new _TributeRange2.default(this);
        new _TributeEvents2.default(this);
        new _TributeMenuEvents2.default(this);
        new _TributeSearch2.default(this);
    }

    _createClass(Tribute, [{
        key: "triggers",
        value: function triggers() {
            return this.collection.map(function (config) {
                return config.trigger;
            });
        }
    }, {
        key: "attach",
        value: function attach(el) {
            if (!el) {
                throw new Error('[Tribute] Must pass in a DOM node or NodeList.');
            }

            // Check if it is a jQuery collection
            if (typeof jQuery !== 'undefined' && el instanceof jQuery) {
                el = el.get();
            }

            // Is el an Array/Array-like object?
            if (el.constructor === NodeList || el.constructor === HTMLCollection || el.constructor === Array) {
                var length = el.length;
                for (var i = 0; i < length; ++i) {
                    this._attach(el[i]);
                }
            } else {
                this._attach(el);
            }
        }
    }, {
        key: "_attach",
        value: function _attach(el) {
            if (el.hasAttribute('data-tribute')) {
                console.warn('Tribute was already bound to ' + el.nodeName);
            }

            this.ensureEditable(el);
            this.events.bind(el);
            el.setAttribute('data-tribute', true);
        }
    }, {
        key: "ensureEditable",
        value: function ensureEditable(element) {
            if (Tribute.inputTypes().indexOf(element.nodeName) === -1) {
                if (element.contentEditable) {
                    element.contentEditable = true;
                } else {
                    throw new Error('[Tribute] Cannot bind to ' + element.nodeName);
                }
            }
        }
    }, {
        key: "createMenu",
        value: function createMenu() {
            var wrapper = this.range.getDocument().createElement('div'),
                ul = this.range.getDocument().createElement('ul');

            wrapper.className = 'tribute-container';
            wrapper.appendChild(ul);

            if (this.menuContainer) {
                return this.menuContainer.appendChild(wrapper);
            }

            return this.range.getDocument().body.appendChild(wrapper);
        }
    }, {
        key: "showMenuFor",
        value: function showMenuFor(element, scrollTo) {
            var _this2 = this;

            // Only proceed if menu isn't already shown for the current element & mentionText
            if (this.isActive && this.current.element === element && this.current.mentionText === this.currentMentionTextSnapshot) {
                return;
            }
            this.currentMentionTextSnapshot = this.current.mentionText;

            // create the menu if it doesn't exist.
            if (!this.menu) {
                this.menu = this.createMenu();
                this.menuEvents.bind(this.menu);
            }

            this.isActive = true;
            this.menuSelected = 0;

            if (!this.current.mentionText) {
                this.current.mentionText = '';
            }

            var processValues = function processValues(values) {
                // Tribute may not be active any more by the time the value callback returns
                if (!_this2.isActive) {
                    return;
                }
                var items = _this2.search.filter(_this2.current.mentionText, values, {
                    pre: '<span>',
                    post: '</span>',
                    extract: function extract(el) {
                        if (typeof _this2.current.collection.lookup === 'string') {
                            return el[_this2.current.collection.lookup];
                        } else if (typeof _this2.current.collection.lookup === 'function') {
                            return _this2.current.collection.lookup(el);
                        } else {
                            throw new Error('Invalid lookup attribute, lookup must be string or function.');
                        }
                    }
                });

                _this2.current.filteredItems = items;

                var ul = _this2.menu.querySelector('ul');

                if (!items.length) {
                    var noMatchEvent = new CustomEvent('tribute-no-match', { detail: _this2.menu });
                    _this2.current.element.dispatchEvent(noMatchEvent);
                    if (!_this2.current.collection.noMatchTemplate) {
                        _this2.hideMenu();
                    } else {
                        ul.innerHTML = _this2.current.collection.noMatchTemplate();
                    }

                    return;
                }

                ul.innerHTML = '';

                items.forEach(function (item, index) {
                    var li = _this2.range.getDocument().createElement('li');
                    li.setAttribute('data-index', index);
                    li.addEventListener('mouseenter', function (e) {
                        var li = e.target;
                        var index = li.getAttribute('data-index');
                        _this2.events.setActiveLi(index);
                    });
                    if (_this2.menuSelected === index) {
                        li.className = _this2.current.collection.selectClass;
                    }
                    li.innerHTML = _this2.current.collection.menuItemTemplate(item);
                    ul.appendChild(li);
                });

                _this2.range.positionMenuAtCaret(scrollTo);
            };

            if (typeof this.current.collection.values === 'function') {
                this.current.collection.values(this.current.mentionText, processValues);
            } else {
                processValues(this.current.collection.values);
            }
        }
    }, {
        key: "hideMenu",
        value: function hideMenu() {
            if (this.menu) {
                this.menu.style.cssText = 'display: none;';
                this.isActive = false;
                this.menuSelected = 0;
                this.current = {};
            }
        }
    }, {
        key: "selectItemAtIndex",
        value: function selectItemAtIndex(index) {
            index = parseInt(index);
            if (typeof index !== 'number') return;
            var item = this.current.filteredItems[index];
            var content = this.current.collection.selectTemplate(item);
            this.replaceText(content);
        }
    }, {
        key: "replaceText",
        value: function replaceText(content) {
            this.range.replaceTriggerText(content, true, true);
        }
    }, {
        key: "_append",
        value: function _append(collection, newValues, replace) {
            if (typeof collection.values === 'function') {
                throw new Error('Unable to append to values, as it is a function.');
            } else if (!replace) {
                collection.values = collection.values.concat(newValues);
            } else {
                collection.values = newValues;
            }
        }
    }, {
        key: "append",
        value: function append(collectionIndex, newValues, replace) {
            var index = parseInt(collectionIndex);
            if (typeof index !== 'number') throw new Error('please provide an index for the collection to update.');

            var collection = this.collection[index];

            this._append(collection, newValues, replace);
        }
    }, {
        key: "appendCurrent",
        value: function appendCurrent(newValues, replace) {
            if (this.isActive) {
                this._append(this.current.collection, newValues, replace);
            } else {
                throw new Error('No active state. Please use append instead and pass an index.');
            }
        }
    }], [{
        key: "defaultSelectTemplate",
        value: function defaultSelectTemplate(item) {
            if (this.range.isContentEditable(this.current.element)) {
                return '<span class="tribute-mention">' + (this.current.collection.trigger + item.original[this.current.collection.fillAttr]) + '</span>';
            }

            return this.current.collection.trigger + item.original[this.current.collection.fillAttr];
        }
    }, {
        key: "defaultMenuItemTemplate",
        value: function defaultMenuItemTemplate(matchItem) {
            return matchItem.string;
        }
    }, {
        key: "inputTypes",
        value: function inputTypes() {
            return ['TEXTAREA', 'INPUT'];
        }
    }]);

    return Tribute;
}();

exports.default = Tribute;
module.exports = exports["default"];

},{"./TributeEvents":2,"./TributeMenuEvents":3,"./TributeRange":4,"./TributeSearch":5,"./utils":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TributeEvents = function () {
    function TributeEvents(tribute) {
        _classCallCheck(this, TributeEvents);

        this.tribute = tribute;
        this.tribute.events = this;
    }

    _createClass(TributeEvents, [{
        key: 'bind',
        value: function bind(element) {
            element.addEventListener('keydown', this.keydown.bind(element, this), false);
            element.addEventListener('keyup', this.keyup.bind(element, this), false);
            element.addEventListener('input', this.input.bind(element, this), false);
        }
    }, {
        key: 'keydown',
        value: function keydown(instance, event) {
            if (instance.shouldDeactivate(event)) {
                instance.tribute.isActive = false;
            }

            var element = this;
            instance.commandEvent = false;

            TributeEvents.keys().forEach(function (o) {
                if (o.key === event.keyCode) {
                    instance.commandEvent = true;
                    instance.callbacks()[o.value.toLowerCase()](event, element);
                }
            });
        }
    }, {
        key: 'input',
        value: function input(instance, event) {
            instance.inputEvent = true;
            instance.keyup.call(this, instance, event);
        }
    }, {
        key: 'click',
        value: function click(instance, event) {
            var tribute = instance.tribute;

            if (tribute.menu && tribute.menu.contains(event.target)) {
                var li = event.target;
                while (li.nodeName.toLowerCase() !== 'li') {
                    li = li.parentNode;
                    if (!li || li === tribute.menu) {
                        throw new Error('cannot find the <li> container for the click');
                    }
                }
                tribute.selectItemAtIndex(li.getAttribute('data-index'));
                tribute.hideMenu();
            } else if (tribute.current.element) {
                tribute.hideMenu();
            }
        }
    }, {
        key: 'keyup',
        value: function keyup(instance, event) {
            var _this = this;

            if (instance.inputEvent) {
                instance.inputEvent = false;
            }
            instance.updateSelection(this);

            if (event.keyCode === 27) return;

            if (!instance.tribute.isActive) {
                var _ret = function () {
                    var keyCode = instance.getKeyCode(instance, _this, event);

                    if (isNaN(keyCode) || !keyCode) return {
                            v: void 0
                        };

                    var trigger = instance.tribute.triggers().find(function (trigger) {
                        return trigger.charCodeAt(0) === keyCode;
                    });

                    if (typeof trigger !== 'undefined') {
                        instance.callbacks().triggerChar(event, _this, trigger);
                    }
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            }

            if (instance.tribute.current.trigger && instance.commandEvent === false || instance.tribute.isActive && event.keyCode === 8) {
                instance.tribute.showMenuFor(this, true);
            }
        }
    }, {
        key: 'shouldDeactivate',
        value: function shouldDeactivate(event) {
            if (!this.tribute.isActive) return false;

            if (this.tribute.current.mentionText.length === 0) {
                var eventKeyPressed = false;
                TributeEvents.keys().forEach(function (o) {
                    if (event.keyCode === o.key) eventKeyPressed = true;
                });

                return !eventKeyPressed;
            }

            return false;
        }
    }, {
        key: 'getKeyCode',
        value: function getKeyCode(instance, el, event) {
            var char = void 0;
            var tribute = instance.tribute;
            var info = tribute.range.getTriggerInfo(false, false, true, tribute.allowSpaces);

            if (info) {
                return info.mentionTriggerChar.charCodeAt(0);
            } else {
                return false;
            }
        }
    }, {
        key: 'updateSelection',
        value: function updateSelection(el) {
            this.tribute.current.element = el;
            var info = this.tribute.range.getTriggerInfo(false, false, true, this.tribute.allowSpaces);

            if (info) {
                this.tribute.current.selectedPath = info.mentionSelectedPath;
                this.tribute.current.mentionText = info.mentionText;
                this.tribute.current.selectedOffset = info.mentionSelectedOffset;
            }
        }
    }, {
        key: 'callbacks',
        value: function callbacks() {
            var _this2 = this;

            return {
                triggerChar: function triggerChar(e, el, trigger) {
                    var tribute = _this2.tribute;
                    tribute.current.trigger = trigger;

                    var collectionItem = tribute.collection.find(function (item) {
                        return item.trigger === trigger;
                    });

                    tribute.current.collection = collectionItem;
                    if (tribute.inputEvent) tribute.showMenuFor(el, true);
                },
                enter: function enter(e, el) {
                    // choose selection
                    if (_this2.tribute.isActive) {
                        e.preventDefault();
                        setTimeout(function () {
                            _this2.tribute.selectItemAtIndex(_this2.tribute.menuSelected);
                            _this2.tribute.hideMenu();
                        }, 0);
                    }
                },
                escape: function escape(e, el) {
                    if (_this2.tribute.isActive) {
                        e.preventDefault();
                        _this2.tribute.hideMenu();
                    }
                },
                tab: function tab(e, el) {
                    // choose first match
                    _this2.callbacks().enter(e, el);
                },
                up: function up(e, el) {
                    // navigate up ul
                    if (_this2.tribute.isActive) {
                        e.preventDefault();
                        var count = _this2.tribute.current.filteredItems.length,
                            selected = _this2.tribute.menuSelected;

                        if (count > selected && selected > 0) {
                            _this2.tribute.menuSelected--;
                            _this2.setActiveLi();
                        } else if (selected === 0) {
                            _this2.tribute.menuSelected = count - 1;
                            _this2.setActiveLi();
                            _this2.tribute.menu.scrollTop = _this2.tribute.menu.scrollHeight;
                        }
                    }
                },
                down: function down(e, el) {
                    // navigate down ul
                    if (_this2.tribute.isActive) {
                        e.preventDefault();
                        var count = _this2.tribute.current.filteredItems.length - 1,
                            selected = _this2.tribute.menuSelected;

                        if (count > selected) {
                            _this2.tribute.menuSelected++;
                            _this2.setActiveLi();
                        } else if (count === selected) {
                            _this2.tribute.menuSelected = 0;
                            _this2.setActiveLi();
                            _this2.tribute.menu.scrollTop = 0;
                        }
                    }
                },
                delete: function _delete(e, el) {
                    if (_this2.tribute.isActive && _this2.tribute.current.mentionText.length < 1) {
                        _this2.tribute.hideMenu();
                    } else if (_this2.tribute.isActive) {
                        _this2.tribute.showMenuFor(el);
                    }
                }
            };
        }
    }, {
        key: 'setActiveLi',
        value: function setActiveLi(index) {
            var lis = this.tribute.menu.querySelectorAll('li'),
                length = lis.length >>> 0;

            // get heights
            var menuFullHeight = this.getFullHeight(this.tribute.menu),
                liHeight = this.getFullHeight(lis[0]);

            if (index) this.tribute.menuSelected = index;

            for (var i = 0; i < length; i++) {
                var li = lis[i];
                if (i === this.tribute.menuSelected) {
                    var offset = liHeight * (i + 1);
                    var scrollTop = this.tribute.menu.scrollTop;
                    var totalScroll = scrollTop + menuFullHeight;

                    if (offset > totalScroll) {
                        this.tribute.menu.scrollTop += liHeight;
                    } else if (offset < totalScroll) {
                        this.tribute.menu.scrollTop -= liHeight;
                    }

                    li.className = this.tribute.current.collection.selectClass;
                } else {
                    li.className = '';
                }
            }
        }
    }, {
        key: 'getFullHeight',
        value: function getFullHeight(elem, includeMargin) {
            var height = elem.getBoundingClientRect().height;

            if (includeMargin) {
                var style = elem.currentStyle || window.getComputedStyle(elem);
                return height + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
            }

            return height;
        }
    }], [{
        key: 'keys',
        value: function keys() {
            return [{
                key: 9,
                value: 'TAB'
            }, {
                key: 8,
                value: 'DELETE'
            }, {
                key: 13,
                value: 'ENTER'
            }, {
                key: 27,
                value: 'ESCAPE'
            }, {
                key: 38,
                value: 'UP'
            }, {
                key: 40,
                value: 'DOWN'
            }];
        }
    }]);

    return TributeEvents;
}();

exports.default = TributeEvents;
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TributeMenuEvents = function () {
    function TributeMenuEvents(tribute) {
        _classCallCheck(this, TributeMenuEvents);

        this.tribute = tribute;
        this.tribute.menuEvents = this;
        this.menu = this.tribute.menu;
    }

    _createClass(TributeMenuEvents, [{
        key: 'bind',
        value: function bind(menu) {
            var _this = this;

            menu.addEventListener('keydown', this.tribute.events.keydown.bind(this.menu, this), false);
            this.tribute.range.getDocument().addEventListener('click', this.tribute.events.click.bind(null, this), false);
            window.addEventListener('resize', this.debounce(function () {
                if (_this.tribute.isActive) {
                    _this.tribute.showMenuFor(_this.tribute.current.element, true);
                }
            }, 300, false));

            if (this.menuContainer) {
                this.menuContainer.addEventListener('scroll', this.debounce(function () {
                    if (_this.tribute.isActive) {
                        _this.tribute.showMenuFor(_this.tribute.current.element, false);
                    }
                }, 300, false), false);
            } else {
                window.onscroll = this.debounce(function () {
                    if (_this.tribute.isActive) {
                        _this.tribute.showMenuFor(_this.tribute.current.element, false);
                    }
                }, 300, false);
            }
        }
    }, {
        key: 'debounce',
        value: function debounce(func, wait, immediate) {
            var _this2 = this,
                _arguments = arguments;

            var timeout;
            return function () {
                var context = _this2,
                    args = _arguments;
                var later = function later() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        }
    }]);

    return TributeMenuEvents;
}();

exports.default = TributeMenuEvents;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Thanks to https://github.com/jeff-collins/ment.io
var TributeRange = function () {
    function TributeRange(tribute) {
        _classCallCheck(this, TributeRange);

        this.tribute = tribute;
        this.tribute.range = this;
    }

    _createClass(TributeRange, [{
        key: 'getDocument',
        value: function getDocument() {
            var iframe = void 0;
            if (this.tribute.current.collection) {
                iframe = this.tribute.current.collection.iframe;
            }

            if (!iframe) {
                return document;
            }

            return iframe.contentWindow.document;
        }
    }, {
        key: 'positionMenuAtCaret',
        value: function positionMenuAtCaret(scrollTo) {
            var _this = this;

            var context = this.tribute.current,
                coordinates = void 0;
            var info = this.getTriggerInfo(false, false, true, this.tribute.allowSpaces);

            if (info !== undefined) {
                if (!this.isContentEditable(context.element)) {
                    coordinates = this.getTextAreaOrInputUnderlinePosition(this.getDocument().activeElement, info.mentionPosition);
                } else {
                    coordinates = this.getContentEditableCaretPosition(info.mentionPosition);
                }

                // Move the button into place.
                this.tribute.menu.style.cssText = 'top: ' + coordinates.top + 'px;\n                                       left: ' + coordinates.left + 'px;\n                                       position: absolute;\n                                       zIndex: 10000;\n                                       display: block;';

                setTimeout(function () {
                    if (scrollTo) _this.scrollIntoView(_this.getDocument().activeElement);
                }, 0);
            } else {
                this.tribute.menu.style.cssText = 'display: none';
            }
        }
    }, {
        key: 'selectElement',
        value: function selectElement(targetElement, path, offset) {
            var range = void 0;
            var elem = targetElement;

            if (path) {
                for (var i = 0; i < path.length; i++) {
                    elem = elem.childNodes[path[i]];
                    if (elem === undefined) {
                        return;
                    }
                    while (elem.length < offset) {
                        offset -= elem.length;
                        elem = elem.nextSibling;
                    }
                    if (elem.childNodes.length === 0 && !elem.length) {
                        elem = elem.previousSibling;
                    }
                }
            }
            var sel = this.getWindowSelection();

            range = this.getDocument().createRange();
            range.setStart(elem, offset);
            range.setEnd(elem, offset);
            range.collapse(true);

            try {
                sel.removeAllRanges();
            } catch (error) {}

            sel.addRange(range);
            targetElement.focus();
        }
    }, {
        key: 'resetSelection',
        value: function resetSelection(targetElement, path, offset) {
            if (!this.isContentEditable(targetElement)) {
                if (targetElement !== this.getDocument().activeElement) {
                    targetElement.focus();
                }
            } else {
                this.selectElement(targetElement, path, offset);
            }
        }
    }, {
        key: 'replaceTriggerText',
        value: function replaceTriggerText(text, requireLeadingSpace, hasTrailingSpace) {
            var context = this.tribute.current;
            this.resetSelection(context.element, context.selectedPath, context.selectedOffset);

            var info = this.getTriggerInfo(true, hasTrailingSpace, requireLeadingSpace, this.tribute.allowSpaces);

            // Create the event
            var replaceEvent = new CustomEvent('tribute-replaced', {
                detail: text
            });

            if (info !== undefined) {
                if (!this.isContentEditable(context.element)) {
                    var myField = this.getDocument().activeElement;
                    var textSuffix = typeof this.tribute.replaceTextSuffix == 'string' ? this.tribute.replaceTextSuffix : ' ';
                    text += textSuffix;
                    var startPos = info.mentionPosition;
                    var endPos = info.mentionPosition + info.mentionText.length + textSuffix.length;
                    myField.value = myField.value.substring(0, startPos) + text + myField.value.substring(endPos, myField.value.length);
                    myField.selectionStart = startPos + text.length;
                    myField.selectionEnd = startPos + text.length;
                } else {
                    // add a space to the end of the pasted text
                    var _textSuffix = typeof this.tribute.replaceTextSuffix == 'string' ? this.tribute.replaceTextSuffix : '\xA0';
                    text += _textSuffix;
                    this.pasteHtml(text, info.mentionPosition, info.mentionPosition + info.mentionText.length + 1);
                }

                context.element.dispatchEvent(replaceEvent);
            }
        }
    }, {
        key: 'pasteHtml',
        value: function pasteHtml(html, startPos, endPos) {
            var range = void 0,
                sel = void 0;
            sel = this.getWindowSelection();
            range = this.getDocument().createRange();
            range.setStart(sel.anchorNode, startPos);
            range.setEnd(sel.anchorNode, endPos);
            range.deleteContents();

            var el = this.getDocument().createElement('div');
            el.innerHTML = html;
            var frag = this.getDocument().createDocumentFragment(),
                node = void 0,
                lastNode = void 0;
            while (node = el.firstChild) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    }, {
        key: 'getWindowSelection',
        value: function getWindowSelection() {
            if (this.tribute.collection.iframe) {
                return this.tribute.collection.iframe.contentWindow.getSelection();
            }

            return window.getSelection();
        }
    }, {
        key: 'getNodePositionInParent',
        value: function getNodePositionInParent(element) {
            if (element.parentNode === null) {
                return 0;
            }

            for (var i = 0; i < element.parentNode.childNodes.length; i++) {
                var node = element.parentNode.childNodes[i];

                if (node === element) {
                    return i;
                }
            }
        }
    }, {
        key: 'getContentEditableSelectedPath',
        value: function getContentEditableSelectedPath() {
            // content editable
            var sel = this.getWindowSelection();
            var selected = sel.anchorNode;
            var path = [];
            var offset = void 0;

            if (selected != null) {
                var i = void 0;
                var ce = selected.contentEditable;
                while (selected !== null && ce !== 'true') {
                    i = this.getNodePositionInParent(selected);
                    path.push(i);
                    selected = selected.parentNode;
                    if (selected !== null) {
                        ce = selected.contentEditable;
                    }
                }
                path.reverse();

                // getRangeAt may not exist, need alternative
                offset = sel.getRangeAt(0).startOffset;

                return {
                    selected: selected,
                    path: path,
                    offset: offset
                };
            }
        }
    }, {
        key: 'getTextPrecedingCurrentSelection',
        value: function getTextPrecedingCurrentSelection() {
            var context = this.tribute.current,
                text = '';

            if (!this.isContentEditable(context.element)) {
                var textComponent = this.getDocument().activeElement;
                var startPos = textComponent.selectionStart;
                if (textComponent.value && startPos >= 0) {
                    text = textComponent.value.substring(0, startPos);
                }
            } else {
                var selectedElem = this.getWindowSelection().anchorNode;

                if (selectedElem != null) {
                    var workingNodeContent = selectedElem.textContent;
                    var selectStartOffset = this.getWindowSelection().getRangeAt(0).startOffset;

                    if (workingNodeContent && selectStartOffset >= 0) {
                        text = workingNodeContent.substring(0, selectStartOffset);
                    }
                }
            }

            return text;
        }
    }, {
        key: 'getTriggerInfo',
        value: function getTriggerInfo(menuAlreadyActive, hasTrailingSpace, requireLeadingSpace, allowSpaces) {
            var _this2 = this;

            var ctx = this.tribute.current;
            var selected = void 0,
                path = void 0,
                offset = void 0;

            if (!this.isContentEditable(ctx.element)) {
                selected = this.getDocument().activeElement;
            } else {
                // content editable
                var selectionInfo = this.getContentEditableSelectedPath();

                if (selectionInfo) {
                    selected = selectionInfo.selected;
                    path = selectionInfo.path;
                    offset = selectionInfo.offset;
                }
            }

            var effectiveRange = this.getTextPrecedingCurrentSelection();

            if (effectiveRange !== undefined && effectiveRange !== null) {
                var _ret = function () {
                    var mostRecentTriggerCharPos = -1;
                    var triggerChar = void 0;

                    _this2.tribute.collection.forEach(function (config) {
                        var c = config.trigger;
                        var idx = config.requireLeadingSpace ? _this2.lastIndexWithLeadingSpace(effectiveRange, c) : effectiveRange.lastIndexOf(c);

                        if (idx > mostRecentTriggerCharPos) {
                            mostRecentTriggerCharPos = idx;
                            triggerChar = c;
                            requireLeadingSpace = config.requireLeadingSpace;
                        }
                    });

                    if (mostRecentTriggerCharPos >= 0 && (mostRecentTriggerCharPos === 0 || !requireLeadingSpace || /[\xA0\s]/g.test(effectiveRange.substring(mostRecentTriggerCharPos - 1, mostRecentTriggerCharPos)))) {
                        var currentTriggerSnippet = effectiveRange.substring(mostRecentTriggerCharPos + 1, effectiveRange.length);

                        triggerChar = effectiveRange.substring(mostRecentTriggerCharPos, mostRecentTriggerCharPos + 1);
                        var firstSnippetChar = currentTriggerSnippet.substring(0, 1);
                        var leadingSpace = currentTriggerSnippet.length > 0 && (firstSnippetChar === ' ' || firstSnippetChar === '\xA0');
                        if (hasTrailingSpace) {
                            currentTriggerSnippet = currentTriggerSnippet.trim();
                        }

                        var regex = allowSpaces ? /[^\S ]/g : /[\xA0\s]/g;

                        if (!leadingSpace && (menuAlreadyActive || !regex.test(currentTriggerSnippet))) {
                            return {
                                v: {
                                    mentionPosition: mostRecentTriggerCharPos,
                                    mentionText: currentTriggerSnippet,
                                    mentionSelectedElement: selected,
                                    mentionSelectedPath: path,
                                    mentionSelectedOffset: offset,
                                    mentionTriggerChar: triggerChar
                                }
                            };
                        }
                    }
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            }
        }
    }, {
        key: 'lastIndexWithLeadingSpace',
        value: function lastIndexWithLeadingSpace(str, char) {
            var reversedStr = str.split('').reverse().join('');
            var index = -1;

            for (var cidx = 0, len = str.length; cidx < len; cidx++) {
                var firstChar = cidx === str.length - 1;
                var leadingSpace = /\s/.test(reversedStr[cidx + 1]);
                var match = char === reversedStr[cidx];

                if (match && (firstChar || leadingSpace)) {
                    index = str.length - 1 - cidx;
                    break;
                }
            }

            return index;
        }
    }, {
        key: 'isContentEditable',
        value: function isContentEditable(element) {
            return element.nodeName !== 'INPUT' && element.nodeName !== 'TEXTAREA';
        }
    }, {
        key: 'getTextAreaOrInputUnderlinePosition',
        value: function getTextAreaOrInputUnderlinePosition(element, position) {
            var properties = ['direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'fontSizeAdjust', 'lineHeight', 'fontFamily', 'textAlign', 'textTransform', 'textIndent', 'textDecoration', 'letterSpacing', 'wordSpacing'];

            var isFirefox = window.mozInnerScreenX !== null;

            var div = this.getDocument().createElement('div');
            div.id = 'input-textarea-caret-position-mirror-div';
            this.getDocument().body.appendChild(div);

            var style = div.style;
            var computed = window.getComputedStyle ? getComputedStyle(element) : element.currentStyle;

            style.whiteSpace = 'pre-wrap';
            if (element.nodeName !== 'INPUT') {
                style.wordWrap = 'break-word';
            }

            // position off-screen
            style.position = 'absolute';
            style.visibility = 'hidden';

            // transfer the element's properties to the div
            properties.forEach(function (prop) {
                style[prop] = computed[prop];
            });

            if (isFirefox) {
                style.width = parseInt(computed.width) - 2 + 'px';
                if (element.scrollHeight > parseInt(computed.height)) style.overflowY = 'scroll';
            } else {
                style.overflow = 'hidden';
            }

            div.textContent = element.value.substring(0, position);

            if (element.nodeName === 'INPUT') {
                div.textContent = div.textContent.replace(/\s/g, ' ');
            }

            var span = this.getDocument().createElement('span');
            span.textContent = element.value.substring(position) || '.';
            div.appendChild(span);

            var rect = element.getBoundingClientRect();
            var doc = document.documentElement;
            var windowLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
            var windowTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

            var coordinates = {
                top: rect.top + windowTop + span.offsetTop + parseInt(computed.borderTopWidth) + parseInt(computed.fontSize) - element.scrollTop,
                left: rect.left + windowLeft + span.offsetLeft + parseInt(computed.borderLeftWidth)
            };

            this.getDocument().body.removeChild(div);

            return coordinates;
        }
    }, {
        key: 'getContentEditableCaretPosition',
        value: function getContentEditableCaretPosition(selectedNodePosition) {
            var markerTextChar = '﻿';
            var markerEl = void 0,
                markerId = 'sel_' + new Date().getTime() + '_' + Math.random().toString().substr(2);
            var range = void 0;
            var sel = this.getWindowSelection();
            var prevRange = sel.getRangeAt(0);

            range = this.getDocument().createRange();
            range.setStart(sel.anchorNode, selectedNodePosition);
            range.setEnd(sel.anchorNode, selectedNodePosition);

            range.collapse(false);

            // Create the marker element containing a single invisible character using DOM methods and insert it
            markerEl = this.getDocument().createElement('span');
            markerEl.id = markerId;
            markerEl.appendChild(this.getDocument().createTextNode(markerTextChar));
            range.insertNode(markerEl);
            sel.removeAllRanges();
            sel.addRange(prevRange);

            var rect = markerEl.getBoundingClientRect();
            var doc = document.documentElement;
            var windowLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
            var windowTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            var coordinates = {
                left: rect.left + windowLeft,
                top: rect.top + markerEl.offsetHeight + windowTop
            };

            markerEl.parentNode.removeChild(markerEl);
            return coordinates;
        }
    }, {
        key: 'scrollIntoView',
        value: function scrollIntoView(elem) {
            var reasonableBuffer = 20,
                clientRect = void 0;
            var maxScrollDisplacement = 100;
            var e = elem;

            while (clientRect === undefined || clientRect.height === 0) {
                clientRect = e.getBoundingClientRect();

                if (clientRect.height === 0) {
                    e = e.childNodes[0];
                    if (e === undefined || !e.getBoundingClientRect) {
                        return;
                    }
                }
            }

            var elemTop = clientRect.top;
            var elemBottom = elemTop + clientRect.height;

            if (elemTop < 0) {
                window.scrollTo(0, window.pageYOffset + clientRect.top - reasonableBuffer);
            } else if (elemBottom > window.innerHeight) {
                var maxY = window.pageYOffset + clientRect.top - reasonableBuffer;

                if (maxY - window.pageYOffset > maxScrollDisplacement) {
                    maxY = window.pageYOffset + maxScrollDisplacement;
                }

                var targetY = window.pageYOffset - (window.innerHeight - elemBottom);

                if (targetY > maxY) {
                    targetY = maxY;
                }

                window.scrollTo(0, targetY);
            }
        }
    }]);

    return TributeRange;
}();

exports.default = TributeRange;
module.exports = exports['default'];

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Thanks to https://github.com/mattyork/fuzzy
var TributeSearch = function () {
    function TributeSearch(tribute) {
        _classCallCheck(this, TributeSearch);

        this.tribute = tribute;
        this.tribute.search = this;
    }

    _createClass(TributeSearch, [{
        key: 'simpleFilter',
        value: function simpleFilter(pattern, array) {
            var _this = this;

            return array.filter(function (string) {
                return _this.test(pattern, string);
            });
        }
    }, {
        key: 'test',
        value: function test(pattern, string) {
            return this.match(pattern, string) !== null;
        }
    }, {
        key: 'match',
        value: function match(pattern, string, opts) {
            opts = opts || {};
            var patternIdx = 0,
                result = [],
                len = string.length,
                totalScore = 0,
                currScore = 0,
                pre = opts.pre || '',
                post = opts.post || '',
                compareString = opts.caseSensitive && string || string.toLowerCase(),
                ch = void 0,
                compareChar = void 0;

            pattern = opts.caseSensitive && pattern || pattern.toLowerCase();

            var patternCache = this.traverse(compareString, pattern, 0, 0, []);
            if (!patternCache) {
                return null;
            }

            return {
                rendered: this.render(string, patternCache.cache, pre, post),
                score: patternCache.score
            };
        }
    }, {
        key: 'traverse',
        value: function traverse(string, pattern, stringIndex, patternIndex, patternCache) {
            // if the pattern search at end
            if (pattern.length === patternIndex) {

                // calculate socre and copy the cache containing the indices where it's found
                return {
                    score: this.calculateScore(patternCache),
                    cache: patternCache.slice()
                };
            }

            // if string at end or remaining pattern > remaining string
            if (string.length === stringIndex || pattern.length - patternIndex > string.length - stringIndex) {
                return undefined;
            }

            var c = pattern[patternIndex];
            var index = string.indexOf(c, stringIndex);
            var best = void 0,
                temp = void 0;

            while (index > -1) {
                patternCache.push(index);
                temp = this.traverse(string, pattern, index + 1, patternIndex + 1, patternCache);
                patternCache.pop();

                // if downstream traversal failed, return best answer so far
                if (!temp) {
                    return best;
                }

                if (!best || best.score < temp.score) {
                    best = temp;
                }

                index = string.indexOf(c, index + 1);
            }

            return best;
        }
    }, {
        key: 'calculateScore',
        value: function calculateScore(patternCache) {
            var score = 0;
            var temp = 1;

            patternCache.forEach(function (index, i) {
                if (i > 0) {
                    if (patternCache[i - 1] + 1 === index) {
                        temp += temp + 1;
                    } else {
                        temp = 1;
                    }
                }

                score += temp;
            });

            return score;
        }
    }, {
        key: 'render',
        value: function render(string, indices, pre, post) {
            var rendered = string.substring(0, indices[0]);

            indices.forEach(function (index, i) {
                rendered += pre + string[index] + post + string.substring(index + 1, indices[i + 1] ? indices[i + 1] : string.length);
            });

            return rendered;
        }
    }, {
        key: 'filter',
        value: function filter(pattern, arr, opts) {
            var _this2 = this;

            opts = opts || {};
            return arr.reduce(function (prev, element, idx, arr) {
                var str = element;

                if (opts.extract) {
                    str = opts.extract(element);

                    if (!str) {
                        // take care of undefineds / nulls / etc.
                        str = '';
                    }
                }

                var rendered = _this2.match(pattern, str, opts);

                if (rendered != null) {
                    prev[prev.length] = {
                        string: rendered.rendered,
                        score: rendered.score,
                        index: idx,
                        original: element
                    };
                }

                return prev;
            }, []).sort(function (a, b) {
                var compare = b.score - a.score;
                if (compare) return compare;
                return a.index - b.index;
            });
        }
    }]);

    return TributeSearch;
}();

exports.default = TributeSearch;
module.exports = exports['default'];

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Tribute = require("./Tribute");

var _Tribute2 = _interopRequireDefault(_Tribute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _Tribute2.default; /**
                                     * Tribute.js
                                     * Native ES6 JavaScript @mention Plugin
                                     **/

module.exports = exports["default"];

},{"./Tribute":1}],7:[function(require,module,exports){
'use strict';

if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

if (window && typeof window.CustomEvent !== "function") {
    var CustomEvent = function CustomEvent(event, params) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    };

    if (typeof window.Event !== 'undefined') {
        CustomEvent.prototype = window.Event.prototype;
    }

    window.CustomEvent = CustomEvent;
}

},{}]},{},[6])(6)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvVHJpYnV0ZS5qcyIsInNyYy9UcmlidXRlRXZlbnRzLmpzIiwic3JjL1RyaWJ1dGVNZW51RXZlbnRzLmpzIiwic3JjL1RyaWJ1dGVSYW5nZS5qcyIsInNyYy9UcmlidXRlU2VhcmNoLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztJQUVNLE87QUFDRiwyQkFlRztBQUFBOztBQUFBLCtCQWRDLE1BY0Q7QUFBQSxZQWRDLE1BY0QsK0JBZFUsSUFjVjtBQUFBLCtCQWJDLE1BYUQ7QUFBQSxZQWJDLE1BYUQsK0JBYlUsSUFhVjtBQUFBLG9DQVpDLFdBWUQ7QUFBQSxZQVpDLFdBWUQsb0NBWmUsV0FZZjtBQUFBLGdDQVhDLE9BV0Q7QUFBQSxZQVhDLE9BV0QsZ0NBWFcsR0FXWDtBQUFBLHVDQVZDLGNBVUQ7QUFBQSxZQVZDLGNBVUQsdUNBVmtCLElBVWxCO0FBQUEseUNBVEMsZ0JBU0Q7QUFBQSxZQVRDLGdCQVNELHlDQVRvQixJQVNwQjtBQUFBLCtCQVJDLE1BUUQ7QUFBQSxZQVJDLE1BUUQsK0JBUlUsS0FRVjtBQUFBLGlDQVBDLFFBT0Q7QUFBQSxZQVBDLFFBT0QsaUNBUFksT0FPWjtBQUFBLG1DQU5DLFVBTUQ7QUFBQSxZQU5DLFVBTUQsbUNBTmMsSUFNZDtBQUFBLHNDQUxDLGFBS0Q7QUFBQSxZQUxDLGFBS0Qsc0NBTGlCLElBS2pCO0FBQUEsd0NBSkMsZUFJRDtBQUFBLFlBSkMsZUFJRCx3Q0FKbUIsSUFJbkI7QUFBQSx5Q0FIQyxtQkFHRDtBQUFBLFlBSEMsbUJBR0QseUNBSHVCLElBR3ZCO0FBQUEsb0NBRkMsV0FFRDtBQUFBLFlBRkMsV0FFRCxvQ0FGZSxLQUVmO0FBQUEseUNBREMsaUJBQ0Q7QUFBQSxZQURDLGlC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QyxDQUFKLEVBQTZDO0FBQ3pDLHVCQUFPLEtBQVA7QUFDSDtBQUNKO0FBQ0QsZUFBTyxTQUFQO0FBQ0gsS0FuQkQ7QUFvQkg7O0FBRUQsSUFBSSxVQUFVLE9BQU8sT0FBTyxXQUFkLEtBQThCLFVBQTVDLEVBQXdEO0FBQUEsUUFDN0MsV0FENkMsR0FDdEQsU0FBUyxXQUFULENBQXFCLEtBQXJCLEVBQTRCLE1BQTVCLEVBQW9DO0FBQ2xDLGlCQUFTLFVBQVU7QUFDakIscUJBQVMsS0FEUTtBQUVqQix3QkFBWSxLQUZLO0FBR2pCLG9CQUFRO0FBSFMsU0FBbkI7QUFLQSxZQUFJLE1BQU0sU0FBUyxXQUFULENBQXFCLGFBQXJCLENBQVY7QUFDQSxZQUFJLGVBQUosQ0FBb0IsS0FBcEIsRUFBMkIsT0FBTyxPQUFsQyxFQUEyQyxPQUFPLFVBQWxELEVBQThELE9BQU8sTUFBckU7QUFDQSxlQUFPLEdBQVA7QUFDRCxLQVZxRDs7QUFZdkQsUUFBSSxPQUFPLE9BQU8sS0FBZCxLQUF3QixXQUE1QixFQUF5QztBQUN2QyxvQkFBWSxTQUFaLEdBQXdCLE9BQU8sS0FBUCxDQUFhLFNBQXJDO0FBQ0Q7O0FBRUEsV0FBTyxXQUFQLEdBQXFCLFdBQXJCO0FBQ0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFRyaWJ1dGVVdGlscyBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IFRyaWJ1dGVFdmVudHMgZnJvbSBcIi4vVHJpYnV0ZUV2ZW50c1wiO1xuaW1wb3J0IFRyaWJ1dGVNZW51RXZlbnRzIGZyb20gXCIuL1RyaWJ1dGVNZW51RXZlbnRzXCI7XG5pbXBvcnQgVHJpYnV0ZVJhbmdlIGZyb20gXCIuL1RyaWJ1dGVSYW5nZVwiO1xuaW1wb3J0IFRyaWJ1dGVTZWFyY2ggZnJvbSBcIi4vVHJpYnV0ZVNlYXJjaFwiO1xuXG5jbGFzcyBUcmlidXRlIHtcbiAgICBjb25zdHJ1Y3Rvcih7XG4gICAgICAgIHZhbHVlcyA9IG51bGwsXG4gICAgICAgIGlmcmFtZSA9IG51bGwsXG4gICAgICAgIHNlbGVjdENsYXNzID0gJ2hpZ2hsaWdodCcsXG4gICAgICAgIHRyaWdnZXIgPSAnQCcsXG4gICAgICAgIHNlbGVjdFRlbXBsYXRlID0gbnVsbCxcbiAgICAgICAgbWVudUl0ZW1UZW1wbGF0ZSA9IG51bGwsXG4gICAgICAgIGxvb2t1cCA9ICdrZXknLFxuICAgICAgICBmaWxsQXR0ciA9ICd2YWx1ZScsXG4gICAgICAgIGNvbGxlY3Rpb24gPSBudWxsLFxuICAgICAgICBtZW51Q29udGFpbmVyID0gbnVsbCxcbiAgICAgICAgbm9NYXRjaFRlbXBsYXRlID0gbnVsbCxcbiAgICAgICAgcmVxdWlyZUxlYWRpbmdTcGFjZSA9IHRydWUsXG4gICAgICAgIGFsbG93U3BhY2VzID0gZmFsc2UsXG4gICAgICAgIHJlcGxhY2VUZXh0U3VmZml4ID0gbnVsbCxcbiAgICB9KSB7XG5cbiAgICAgICAgdGhpcy5tZW51U2VsZWN0ZWQgPSAwXG4gICAgICAgIHRoaXMuY3VycmVudCA9IHt9XG4gICAgICAgIHRoaXMuaW5wdXRFdmVudCA9IGZhbHNlXG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZVxuICAgICAgICB0aGlzLm1lbnVDb250YWluZXIgPSBtZW51Q29udGFpbmVyXG4gICAgICAgIHRoaXMuYWxsb3dTcGFjZXMgPSBhbGxvd1NwYWNlc1xuICAgICAgICB0aGlzLnJlcGxhY2VUZXh0U3VmZml4ID0gcmVwbGFjZVRleHRTdWZmaXhcblxuICAgICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb24gPSBbe1xuICAgICAgICAgICAgICAgIC8vIHN5bWJvbCB0aGF0IHN0YXJ0cyB0aGUgbG9va3VwXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogdHJpZ2dlcixcblxuICAgICAgICAgICAgICAgIGlmcmFtZTogaWZyYW1lLFxuXG4gICAgICAgICAgICAgICAgc2VsZWN0Q2xhc3M6IHNlbGVjdENsYXNzLFxuXG4gICAgICAgICAgICAgICAgLy8gZnVuY3Rpb24gY2FsbGVkIG9uIHNlbGVjdCB0aGF0IHJldHVucyB0aGUgY29udGVudCB0byBpbnNlcnRcbiAgICAgICAgICAgICAgICBzZWxlY3RUZW1wbGF0ZTogKHNlbGVjdFRlbXBsYXRlIHx8IFRyaWJ1dGUuZGVmYXVsdFNlbGVjdFRlbXBsYXRlKS5iaW5kKHRoaXMpLFxuXG4gICAgICAgICAgICAgICAgLy8gZnVuY3Rpb24gY2FsbGVkIHRoYXQgcmV0dXJucyBjb250ZW50IGZvciBhbiBpdGVtXG4gICAgICAgICAgICAgICAgbWVudUl0ZW1UZW1wbGF0ZTogKG1lbnVJdGVtVGVtcGxhdGUgfHwgVHJpYnV0ZS5kZWZhdWx0TWVudUl0ZW1UZW1wbGF0ZSkuYmluZCh0aGlzKSxcblxuICAgICAgICAgICAgICAgIC8vIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIG1lbnUgaXMgZW1wdHksIGRpc2FibGVzIGhpZGluZyBvZiBtZW51LlxuICAgICAgICAgICAgICAgIG5vTWF0Y2hUZW1wbGF0ZTogKHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0LmJpbmQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgICAgICAgICAgfSkobm9NYXRjaFRlbXBsYXRlKSxcblxuICAgICAgICAgICAgICAgIC8vIGNvbHVtbiB0byBzZWFyY2ggYWdhaW5zdCBpbiB0aGUgb2JqZWN0XG4gICAgICAgICAgICAgICAgbG9va3VwOiBsb29rdXAsXG5cbiAgICAgICAgICAgICAgICAvLyBjb2x1bW4gdGhhdCBjb250YWlucyB0aGUgY29udGVudCB0byBpbnNlcnQgYnkgZGVmYXVsdFxuICAgICAgICAgICAgICAgIGZpbGxBdHRyOiBmaWxsQXR0cixcblxuICAgICAgICAgICAgICAgIC8vIGFycmF5IG9mIG9iamVjdHMgb3IgYSBmdW5jdGlvbiByZXR1cm5pbmcgYW4gYXJyYXkgb2Ygb2JqZWN0c1xuICAgICAgICAgICAgICAgIHZhbHVlczogdmFsdWVzLFxuXG4gICAgICAgICAgICAgICAgcmVxdWlyZUxlYWRpbmdTcGFjZTogcmVxdWlyZUxlYWRpbmdTcGFjZSxcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5jb2xsZWN0aW9uID0gY29sbGVjdGlvbi5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcjogaXRlbS50cmlnZ2VyIHx8IHRyaWdnZXIsXG4gICAgICAgICAgICAgICAgICAgIGlmcmFtZTogaXRlbS5pZnJhbWUgfHwgaWZyYW1lLFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RDbGFzczogaXRlbS5zZWxlY3RDbGFzcyB8fCBzZWxlY3RDbGFzcyxcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0VGVtcGxhdGU6IChpdGVtLnNlbGVjdFRlbXBsYXRlIHx8IFRyaWJ1dGUuZGVmYXVsdFNlbGVjdFRlbXBsYXRlKS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBtZW51SXRlbVRlbXBsYXRlOiAoaXRlbS5tZW51SXRlbVRlbXBsYXRlIHx8IFRyaWJ1dGUuZGVmYXVsdE1lbnVJdGVtVGVtcGxhdGUpLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIC8vIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIG1lbnUgaXMgZW1wdHksIGRpc2FibGVzIGhpZGluZyBvZiBtZW51LlxuICAgICAgICAgICAgICAgICAgICBub01hdGNoVGVtcGxhdGU6ICh0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0LmJpbmQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSkobm9NYXRjaFRlbXBsYXRlKSxcbiAgICAgICAgICAgICAgICAgICAgbG9va3VwOiBpdGVtLmxvb2t1cCB8fCBsb29rdXAsXG4gICAgICAgICAgICAgICAgICAgIGZpbGxBdHRyOiBpdGVtLmZpbGxBdHRyIHx8IGZpbGxBdHRyLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IGl0ZW0udmFsdWVzLFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlTGVhZGluZ1NwYWNlOiBpdGVtLnJlcXVpcmVMZWFkaW5nU3BhY2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbVHJpYnV0ZV0gTm8gY29sbGVjdGlvbiBzcGVjaWZpZWQuJylcbiAgICAgICAgfVxuXG4gICAgICAgIG5ldyBUcmlidXRlUmFuZ2UodGhpcylcbiAgICAgICAgbmV3IFRyaWJ1dGVFdmVudHModGhpcylcbiAgICAgICAgbmV3IFRyaWJ1dGVNZW51RXZlbnRzKHRoaXMpXG4gICAgICAgIG5ldyBUcmlidXRlU2VhcmNoKHRoaXMpXG4gICAgfVxuXG4gICAgc3RhdGljIGRlZmF1bHRTZWxlY3RUZW1wbGF0ZShpdGVtKSB7XG4gICAgICBpZiAodGhpcy5yYW5nZS5pc0NvbnRlbnRFZGl0YWJsZSh0aGlzLmN1cnJlbnQuZWxlbWVudCkpIHtcbiAgICAgICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwidHJpYnV0ZS1tZW50aW9uXCI+JyArICh0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi50cmlnZ2VyICsgaXRlbS5vcmlnaW5hbFt0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5maWxsQXR0cl0pICsgJzwvc3Bhbj4nO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24udHJpZ2dlciArIGl0ZW0ub3JpZ2luYWxbdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24uZmlsbEF0dHJdO1xuICAgIH1cblxuICAgIHN0YXRpYyBkZWZhdWx0TWVudUl0ZW1UZW1wbGF0ZShtYXRjaEl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoSXRlbS5zdHJpbmdcbiAgICB9XG5cbiAgICBzdGF0aWMgaW5wdXRUeXBlcygpIHtcbiAgICAgICAgcmV0dXJuIFsnVEVYVEFSRUEnLCAnSU5QVVQnXVxuICAgIH1cblxuICAgIHRyaWdnZXJzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLm1hcChjb25maWcgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZy50cmlnZ2VyXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYXR0YWNoKGVsKSB7XG4gICAgICAgIGlmICghZWwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignW1RyaWJ1dGVdIE11c3QgcGFzcyBpbiBhIERPTSBub2RlIG9yIE5vZGVMaXN0LicpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBpZiBpdCBpcyBhIGpRdWVyeSBjb2xsZWN0aW9uXG4gICAgICAgIGlmICh0eXBlb2YgalF1ZXJ5ICE9PSAndW5kZWZpbmVkJyAmJiBlbCBpbnN0YW5jZW9mIGpRdWVyeSkge1xuICAgICAgICAgICAgZWwgPSBlbC5nZXQoKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSXMgZWwgYW4gQXJyYXkvQXJyYXktbGlrZSBvYmplY3Q/XG4gICAgICAgIGlmIChlbC5jb25zdHJ1Y3RvciA9PT0gTm9kZUxpc3QgfHwgZWwuY29uc3RydWN0b3IgPT09IEhUTUxDb2xsZWN0aW9uIHx8IGVsLmNvbnN0cnVjdG9yID09PSBBcnJheSkge1xuICAgICAgICAgICAgbGV0IGxlbmd0aCA9IGVsLmxlbmd0aFxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2F0dGFjaChlbFtpXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2F0dGFjaChlbClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9hdHRhY2goZWwpIHtcbiAgICAgICAgaWYgKGVsLmhhc0F0dHJpYnV0ZSgnZGF0YS10cmlidXRlJykpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignVHJpYnV0ZSB3YXMgYWxyZWFkeSBib3VuZCB0byAnICsgZWwubm9kZU5hbWUpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVuc3VyZUVkaXRhYmxlKGVsKVxuICAgICAgICB0aGlzLmV2ZW50cy5iaW5kKGVsKVxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdHJpYnV0ZScsIHRydWUpXG4gICAgfVxuXG4gICAgZW5zdXJlRWRpdGFibGUoZWxlbWVudCkge1xuICAgICAgICBpZiAoVHJpYnV0ZS5pbnB1dFR5cGVzKCkuaW5kZXhPZihlbGVtZW50Lm5vZGVOYW1lKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmNvbnRlbnRFZGl0YWJsZSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuY29udGVudEVkaXRhYmxlID0gdHJ1ZVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1tUcmlidXRlXSBDYW5ub3QgYmluZCB0byAnICsgZWxlbWVudC5ub2RlTmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZU1lbnUoKSB7XG4gICAgICAgIGxldCB3cmFwcGVyID0gdGhpcy5yYW5nZS5nZXREb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICAgICAgdWwgPSB0aGlzLnJhbmdlLmdldERvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgndWwnKVxuXG4gICAgICAgIHdyYXBwZXIuY2xhc3NOYW1lID0gJ3RyaWJ1dGUtY29udGFpbmVyJ1xuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHVsKVxuXG4gICAgICAgIGlmICh0aGlzLm1lbnVDb250YWluZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1lbnVDb250YWluZXIuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJhbmdlLmdldERvY3VtZW50KCkuYm9keS5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICAgIH1cblxuICAgIHNob3dNZW51Rm9yKGVsZW1lbnQsIHNjcm9sbFRvKSB7XG4gICAgICAgIC8vIE9ubHkgcHJvY2VlZCBpZiBtZW51IGlzbid0IGFscmVhZHkgc2hvd24gZm9yIHRoZSBjdXJyZW50IGVsZW1lbnQgJiBtZW50aW9uVGV4dFxuICAgICAgICBpZiAodGhpcy5pc0FjdGl2ZSAmJiB0aGlzLmN1cnJlbnQuZWxlbWVudCA9PT0gZWxlbWVudCAmJiB0aGlzLmN1cnJlbnQubWVudGlvblRleHQgPT09IHRoaXMuY3VycmVudE1lbnRpb25UZXh0U25hcHNob3QpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnRNZW50aW9uVGV4dFNuYXBzaG90ID0gdGhpcy5jdXJyZW50Lm1lbnRpb25UZXh0XG5cbiAgICAgICAgLy8gY3JlYXRlIHRoZSBtZW51IGlmIGl0IGRvZXNuJ3QgZXhpc3QuXG4gICAgICAgIGlmICghdGhpcy5tZW51KSB7XG4gICAgICAgICAgICB0aGlzLm1lbnUgPSB0aGlzLmNyZWF0ZU1lbnUoKVxuICAgICAgICAgICAgdGhpcy5tZW51RXZlbnRzLmJpbmQodGhpcy5tZW51KVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IHRydWVcbiAgICAgICAgdGhpcy5tZW51U2VsZWN0ZWQgPSAwXG5cbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnQubWVudGlvblRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5tZW50aW9uVGV4dCA9ICcnXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9jZXNzVmFsdWVzID0gKHZhbHVlcykgPT4ge1xuICAgICAgICAgICAgLy8gVHJpYnV0ZSBtYXkgbm90IGJlIGFjdGl2ZSBhbnkgbW9yZSBieSB0aGUgdGltZSB0aGUgdmFsdWUgY2FsbGJhY2sgcmV0dXJuc1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgaXRlbXMgPSB0aGlzLnNlYXJjaC5maWx0ZXIodGhpcy5jdXJyZW50Lm1lbnRpb25UZXh0LCB2YWx1ZXMsIHtcbiAgICAgICAgICAgICAgICBwcmU6ICc8c3Bhbj4nLFxuICAgICAgICAgICAgICAgIHBvc3Q6ICc8L3NwYW4+JyxcbiAgICAgICAgICAgICAgICBleHRyYWN0OiAoZWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5sb29rdXAgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxbdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24ubG9va3VwXVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5sb29rdXAgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5sb29rdXAoZWwpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgbG9va3VwIGF0dHJpYnV0ZSwgbG9va3VwIG11c3QgYmUgc3RyaW5nIG9yIGZ1bmN0aW9uLicpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQuZmlsdGVyZWRJdGVtcyA9IGl0ZW1zXG5cbiAgICAgICAgICAgIGxldCB1bCA9IHRoaXMubWVudS5xdWVyeVNlbGVjdG9yKCd1bCcpXG5cbiAgICAgICAgICAgIGlmICghaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5vTWF0Y2hFdmVudCA9IG5ldyBDdXN0b21FdmVudCgndHJpYnV0ZS1uby1tYXRjaCcsIHsgZGV0YWlsOiB0aGlzLm1lbnUgfSlcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQuZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5vTWF0Y2hFdmVudClcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY3VycmVudC5jb2xsZWN0aW9uLm5vTWF0Y2hUZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGVNZW51KClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB1bC5pbm5lckhUTUwgPSB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5ub01hdGNoVGVtcGxhdGUoKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1bC5pbm5lckhUTUwgPSAnJ1xuXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBsaSA9IHRoaXMucmFuZ2UuZ2V0RG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdsaScpXG4gICAgICAgICAgICAgICAgbGkuc2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JywgaW5kZXgpXG4gICAgICAgICAgICAgICAgbGkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICBsZXQgbGkgPSBlLnRhcmdldDtcbiAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IGxpLmdldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcpXG4gICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5zZXRBY3RpdmVMaShpbmRleClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1lbnVTZWxlY3RlZCA9PT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgbGkuY2xhc3NOYW1lID0gdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24uc2VsZWN0Q2xhc3NcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGkuaW5uZXJIVE1MID0gdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24ubWVudUl0ZW1UZW1wbGF0ZShpdGVtKVxuICAgICAgICAgICAgICAgIHVsLmFwcGVuZENoaWxkKGxpKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgdGhpcy5yYW5nZS5wb3NpdGlvbk1lbnVBdENhcmV0KHNjcm9sbFRvKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi52YWx1ZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLnZhbHVlcyh0aGlzLmN1cnJlbnQubWVudGlvblRleHQsIHByb2Nlc3NWYWx1ZXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9jZXNzVmFsdWVzKHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLnZhbHVlcylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhpZGVNZW51KCkge1xuICAgICAgICBpZiAodGhpcy5tZW51KSB7XG4gICAgICAgICAgICB0aGlzLm1lbnUuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBub25lOydcbiAgICAgICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZVxuICAgICAgICAgICAgdGhpcy5tZW51U2VsZWN0ZWQgPSAwXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSB7fVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VsZWN0SXRlbUF0SW5kZXgoaW5kZXgpIHtcbiAgICAgICAgaW5kZXggPSBwYXJzZUludChpbmRleClcbiAgICAgICAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVyblxuICAgICAgICBsZXQgaXRlbSA9IHRoaXMuY3VycmVudC5maWx0ZXJlZEl0ZW1zW2luZGV4XVxuICAgICAgICBsZXQgY29udGVudCA9IHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLnNlbGVjdFRlbXBsYXRlKGl0ZW0pXG4gICAgICAgIHRoaXMucmVwbGFjZVRleHQoY29udGVudClcbiAgICB9XG5cbiAgICByZXBsYWNlVGV4dChjb250ZW50KSB7XG4gICAgICAgIHRoaXMucmFuZ2UucmVwbGFjZVRyaWdnZXJUZXh0KGNvbnRlbnQsIHRydWUsIHRydWUpXG4gICAgfVxuXG4gICAgX2FwcGVuZChjb2xsZWN0aW9uLCBuZXdWYWx1ZXMsIHJlcGxhY2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb2xsZWN0aW9uLnZhbHVlcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gYXBwZW5kIHRvIHZhbHVlcywgYXMgaXQgaXMgYSBmdW5jdGlvbi4nKVxuICAgICAgICB9IGVsc2UgaWYgKCFyZXBsYWNlKSB7XG4gICAgICAgICAgICBjb2xsZWN0aW9uLnZhbHVlcyA9IGNvbGxlY3Rpb24udmFsdWVzLmNvbmNhdChuZXdWYWx1ZXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2xsZWN0aW9uLnZhbHVlcyA9IG5ld1ZhbHVlc1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXBwZW5kKGNvbGxlY3Rpb25JbmRleCwgbmV3VmFsdWVzLCByZXBsYWNlKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHBhcnNlSW50KGNvbGxlY3Rpb25JbmRleClcbiAgICAgICAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHRocm93IG5ldyBFcnJvcigncGxlYXNlIHByb3ZpZGUgYW4gaW5kZXggZm9yIHRoZSBjb2xsZWN0aW9uIHRvIHVwZGF0ZS4nKVxuXG4gICAgICAgIGxldCBjb2xsZWN0aW9uID0gdGhpcy5jb2xsZWN0aW9uW2luZGV4XVxuXG4gICAgICAgIHRoaXMuX2FwcGVuZChjb2xsZWN0aW9uLCBuZXdWYWx1ZXMsIHJlcGxhY2UpXG4gICAgfVxuXG4gICAgYXBwZW5kQ3VycmVudChuZXdWYWx1ZXMsIHJlcGxhY2UpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuX2FwcGVuZCh0aGlzLmN1cnJlbnQuY29sbGVjdGlvbiwgbmV3VmFsdWVzLCByZXBsYWNlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhY3RpdmUgc3RhdGUuIFBsZWFzZSB1c2UgYXBwZW5kIGluc3RlYWQgYW5kIHBhc3MgYW4gaW5kZXguJylcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVHJpYnV0ZTtcbiIsImNsYXNzIFRyaWJ1dGVFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKHRyaWJ1dGUpIHtcbiAgICAgICAgdGhpcy50cmlidXRlID0gdHJpYnV0ZVxuICAgICAgICB0aGlzLnRyaWJ1dGUuZXZlbnRzID0gdGhpc1xuICAgIH1cblxuICAgIHN0YXRpYyBrZXlzKCkge1xuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgIGtleTogOSxcbiAgICAgICAgICAgIHZhbHVlOiAnVEFCJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6IDgsXG4gICAgICAgICAgICB2YWx1ZTogJ0RFTEVURSdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAxMyxcbiAgICAgICAgICAgIHZhbHVlOiAnRU5URVInXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogMjcsXG4gICAgICAgICAgICB2YWx1ZTogJ0VTQ0FQRSdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAzOCxcbiAgICAgICAgICAgIHZhbHVlOiAnVVAnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogNDAsXG4gICAgICAgICAgICB2YWx1ZTogJ0RPV04nXG4gICAgICAgIH1dXG4gICAgfVxuXG4gICAgYmluZChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsXG4gICAgICAgICAgICB0aGlzLmtleWRvd24uYmluZChlbGVtZW50LCB0aGlzKSwgZmFsc2UpXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLFxuICAgICAgICAgICAgdGhpcy5rZXl1cC5iaW5kKGVsZW1lbnQsIHRoaXMpLCBmYWxzZSlcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsXG4gICAgICAgICAgICB0aGlzLmlucHV0LmJpbmQoZWxlbWVudCwgdGhpcyksIGZhbHNlKVxuICAgIH1cblxuICAgIGtleWRvd24oaW5zdGFuY2UsIGV2ZW50KSB7XG4gICAgICAgIGlmIChpbnN0YW5jZS5zaG91bGREZWFjdGl2YXRlKGV2ZW50KSkge1xuICAgICAgICAgICAgaW5zdGFuY2UudHJpYnV0ZS5pc0FjdGl2ZSA9IGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXNcbiAgICAgICAgaW5zdGFuY2UuY29tbWFuZEV2ZW50ID0gZmFsc2VcblxuICAgICAgICBUcmlidXRlRXZlbnRzLmtleXMoKS5mb3JFYWNoKG8gPT4ge1xuICAgICAgICAgICAgaWYgKG8ua2V5ID09PSBldmVudC5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2UuY29tbWFuZEV2ZW50ID0gdHJ1ZVxuICAgICAgICAgICAgICAgIGluc3RhbmNlLmNhbGxiYWNrcygpW28udmFsdWUudG9Mb3dlckNhc2UoKV0oZXZlbnQsIGVsZW1lbnQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgaW5wdXQoaW5zdGFuY2UsIGV2ZW50KSB7XG4gICAgICAgIGluc3RhbmNlLmlucHV0RXZlbnQgPSB0cnVlXG4gICAgICAgIGluc3RhbmNlLmtleXVwLmNhbGwodGhpcywgaW5zdGFuY2UsIGV2ZW50KVxuICAgIH1cblxuICAgIGNsaWNrKGluc3RhbmNlLCBldmVudCkge1xuICAgICAgICBsZXQgdHJpYnV0ZSA9IGluc3RhbmNlLnRyaWJ1dGVcblxuICAgICAgICBpZiAodHJpYnV0ZS5tZW51ICYmIHRyaWJ1dGUubWVudS5jb250YWlucyhldmVudC50YXJnZXQpKSB7XG4gICAgICAgICAgICBsZXQgbGkgPSBldmVudC50YXJnZXRcbiAgICAgICAgICAgIHdoaWxlIChsaS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9PSAnbGknKSB7XG4gICAgICAgICAgICAgICAgbGkgPSBsaS5wYXJlbnROb2RlXG4gICAgICAgICAgICAgICAgaWYgKCFsaSB8fCBsaSA9PT0gdHJpYnV0ZS5tZW51KSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGZpbmQgdGhlIDxsaT4gY29udGFpbmVyIGZvciB0aGUgY2xpY2snKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyaWJ1dGUuc2VsZWN0SXRlbUF0SW5kZXgobGkuZ2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JykpXG4gICAgICAgICAgICB0cmlidXRlLmhpZGVNZW51KClcbiAgICAgICAgfSBlbHNlIGlmICh0cmlidXRlLmN1cnJlbnQuZWxlbWVudCkge1xuICAgICAgICAgICAgdHJpYnV0ZS5oaWRlTWVudSgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBrZXl1cChpbnN0YW5jZSwgZXZlbnQpIHtcbiAgICAgICAgaWYgKGluc3RhbmNlLmlucHV0RXZlbnQpIHtcbiAgICAgICAgICAgIGluc3RhbmNlLmlucHV0RXZlbnQgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGluc3RhbmNlLnVwZGF0ZVNlbGVjdGlvbih0aGlzKVxuXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAyNykgcmV0dXJuXG5cbiAgICAgICAgaWYgKCFpbnN0YW5jZS50cmlidXRlLmlzQWN0aXZlKSB7XG4gICAgICAgICAgICBsZXQga2V5Q29kZSA9IGluc3RhbmNlLmdldEtleUNvZGUoaW5zdGFuY2UsIHRoaXMsIGV2ZW50KVxuXG4gICAgICAgICAgICBpZiAoaXNOYU4oa2V5Q29kZSkgfHwgIWtleUNvZGUpIHJldHVyblxuXG4gICAgICAgICAgICBsZXQgdHJpZ2dlciA9IGluc3RhbmNlLnRyaWJ1dGUudHJpZ2dlcnMoKS5maW5kKHRyaWdnZXIgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cmlnZ2VyLmNoYXJDb2RlQXQoMCkgPT09IGtleUNvZGVcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdHJpZ2dlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZS5jYWxsYmFja3MoKS50cmlnZ2VyQ2hhcihldmVudCwgdGhpcywgdHJpZ2dlcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbnN0YW5jZS50cmlidXRlLmN1cnJlbnQudHJpZ2dlciAmJiBpbnN0YW5jZS5jb21tYW5kRXZlbnQgPT09IGZhbHNlXG4gICAgICAgICAgICB8fCBpbnN0YW5jZS50cmlidXRlLmlzQWN0aXZlICYmIGV2ZW50LmtleUNvZGUgPT09IDgpIHtcbiAgICAgICAgICBpbnN0YW5jZS50cmlidXRlLnNob3dNZW51Rm9yKHRoaXMsIHRydWUpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG91bGREZWFjdGl2YXRlKGV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy50cmlidXRlLmlzQWN0aXZlKSByZXR1cm4gZmFsc2VcblxuICAgICAgICBpZiAodGhpcy50cmlidXRlLmN1cnJlbnQubWVudGlvblRleHQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBsZXQgZXZlbnRLZXlQcmVzc2VkID0gZmFsc2VcbiAgICAgICAgICAgIFRyaWJ1dGVFdmVudHMua2V5cygpLmZvckVhY2gobyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IG8ua2V5KSBldmVudEtleVByZXNzZWQgPSB0cnVlXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXR1cm4gIWV2ZW50S2V5UHJlc3NlZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgZ2V0S2V5Q29kZShpbnN0YW5jZSwgZWwsIGV2ZW50KSB7XG4gICAgICAgIGxldCBjaGFyXG4gICAgICAgIGxldCB0cmlidXRlID0gaW5zdGFuY2UudHJpYnV0ZVxuICAgICAgICBsZXQgaW5mbyA9IHRyaWJ1dGUucmFuZ2UuZ2V0VHJpZ2dlckluZm8oZmFsc2UsIGZhbHNlLCB0cnVlLCB0cmlidXRlLmFsbG93U3BhY2VzKVxuXG4gICAgICAgIGlmIChpbmZvKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5mby5tZW50aW9uVHJpZ2dlckNoYXIuY2hhckNvZGVBdCgwKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVTZWxlY3Rpb24oZWwpIHtcbiAgICAgICAgdGhpcy50cmlidXRlLmN1cnJlbnQuZWxlbWVudCA9IGVsXG4gICAgICAgIGxldCBpbmZvID0gdGhpcy50cmlidXRlLnJhbmdlLmdldFRyaWdnZXJJbmZvKGZhbHNlLCBmYWxzZSwgdHJ1ZSwgdGhpcy50cmlidXRlLmFsbG93U3BhY2VzKVxuXG4gICAgICAgIGlmIChpbmZvKSB7XG4gICAgICAgICAgICB0aGlzLnRyaWJ1dGUuY3VycmVudC5zZWxlY3RlZFBhdGggPSBpbmZvLm1lbnRpb25TZWxlY3RlZFBhdGhcbiAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5jdXJyZW50Lm1lbnRpb25UZXh0ID0gaW5mby5tZW50aW9uVGV4dFxuICAgICAgICAgICAgdGhpcy50cmlidXRlLmN1cnJlbnQuc2VsZWN0ZWRPZmZzZXQgPSBpbmZvLm1lbnRpb25TZWxlY3RlZE9mZnNldFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FsbGJhY2tzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHJpZ2dlckNoYXI6IChlLCBlbCwgdHJpZ2dlcikgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0cmlidXRlID0gdGhpcy50cmlidXRlXG4gICAgICAgICAgICAgICAgdHJpYnV0ZS5jdXJyZW50LnRyaWdnZXIgPSB0cmlnZ2VyXG5cbiAgICAgICAgICAgICAgICBsZXQgY29sbGVjdGlvbkl0ZW0gPSB0cmlidXRlLmNvbGxlY3Rpb24uZmluZChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0udHJpZ2dlciA9PT0gdHJpZ2dlclxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICB0cmlidXRlLmN1cnJlbnQuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb25JdGVtXG4gICAgICAgICAgICAgICAgaWYgKHRyaWJ1dGUuaW5wdXRFdmVudCkgdHJpYnV0ZS5zaG93TWVudUZvcihlbCwgdHJ1ZSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnRlcjogKGUsIGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY2hvb3NlIHNlbGVjdGlvblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyaWJ1dGUuaXNBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLnNlbGVjdEl0ZW1BdEluZGV4KHRoaXMudHJpYnV0ZS5tZW51U2VsZWN0ZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUuaGlkZU1lbnUoKVxuICAgICAgICAgICAgICAgICAgICB9LCAwKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlc2NhcGU6IChlLCBlbCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyaWJ1dGUuaXNBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5oaWRlTWVudSgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRhYjogKGUsIGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY2hvb3NlIGZpcnN0IG1hdGNoXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsYmFja3MoKS5lbnRlcihlLCBlbClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cDogKGUsIGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gbmF2aWdhdGUgdXAgdWxcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50cmlidXRlLmlzQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgICBsZXQgY291bnQgPSB0aGlzLnRyaWJ1dGUuY3VycmVudC5maWx0ZXJlZEl0ZW1zLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkID0gdGhpcy50cmlidXRlLm1lbnVTZWxlY3RlZFxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb3VudCA+IHNlbGVjdGVkICYmIHNlbGVjdGVkID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLm1lbnVTZWxlY3RlZC0tXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUxpKClcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5tZW51U2VsZWN0ZWQgPSBjb3VudCAtIDFcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUxpKClcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudS5zY3JvbGxUb3AgPSB0aGlzLnRyaWJ1dGUubWVudS5zY3JvbGxIZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkb3duOiAoZSwgZWwpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBuYXZpZ2F0ZSBkb3duIHVsXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHJpYnV0ZS5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvdW50ID0gdGhpcy50cmlidXRlLmN1cnJlbnQuZmlsdGVyZWRJdGVtcy5sZW5ndGggLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQgPSB0aGlzLnRyaWJ1dGUubWVudVNlbGVjdGVkXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvdW50ID4gc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5tZW51U2VsZWN0ZWQrK1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVMaSgpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY291bnQgPT09IHNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudVNlbGVjdGVkID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVMaSgpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudS5zY3JvbGxUb3AgPSAwXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVsZXRlOiAoZSwgZWwpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50cmlidXRlLmlzQWN0aXZlICYmIHRoaXMudHJpYnV0ZS5jdXJyZW50Lm1lbnRpb25UZXh0Lmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLmhpZGVNZW51KClcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudHJpYnV0ZS5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUuc2hvd01lbnVGb3IoZWwpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0QWN0aXZlTGkoaW5kZXgpIHtcbiAgICAgICAgbGV0IGxpcyA9IHRoaXMudHJpYnV0ZS5tZW51LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyksXG4gICAgICAgICAgICBsZW5ndGggPSBsaXMubGVuZ3RoID4+PiAwXG5cbiAgICAgICAgLy8gZ2V0IGhlaWdodHNcbiAgICAgICAgbGV0IG1lbnVGdWxsSGVpZ2h0ID0gdGhpcy5nZXRGdWxsSGVpZ2h0KHRoaXMudHJpYnV0ZS5tZW51KSxcbiAgICAgICAgICAgIGxpSGVpZ2h0ID0gdGhpcy5nZXRGdWxsSGVpZ2h0KGxpc1swXSlcblxuICAgICAgICBpZiAoaW5kZXgpIHRoaXMudHJpYnV0ZS5tZW51U2VsZWN0ZWQgPSBpbmRleDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbGkgPSBsaXNbaV1cbiAgICAgICAgICAgIGlmIChpID09PSB0aGlzLnRyaWJ1dGUubWVudVNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgbGV0IG9mZnNldCA9IGxpSGVpZ2h0ICogKGkrMSlcbiAgICAgICAgICAgICAgICBsZXQgc2Nyb2xsVG9wID0gdGhpcy50cmlidXRlLm1lbnUuc2Nyb2xsVG9wXG4gICAgICAgICAgICAgICAgbGV0IHRvdGFsU2Nyb2xsID0gc2Nyb2xsVG9wICsgbWVudUZ1bGxIZWlnaHRcblxuICAgICAgICAgICAgICAgIGlmIChvZmZzZXQgPiB0b3RhbFNjcm9sbCkge1xuICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLm1lbnUuc2Nyb2xsVG9wICs9IGxpSGVpZ2h0XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvZmZzZXQgPCB0b3RhbFNjcm9sbCkge1xuICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLm1lbnUuc2Nyb2xsVG9wIC09IGxpSGVpZ2h0XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGkuY2xhc3NOYW1lID0gdGhpcy50cmlidXRlLmN1cnJlbnQuY29sbGVjdGlvbi5zZWxlY3RDbGFzc1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaS5jbGFzc05hbWUgPSAnJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RnVsbEhlaWdodChlbGVtLCBpbmNsdWRlTWFyZ2luKSB7XG4gICAgICBsZXQgaGVpZ2h0ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHRcblxuICAgICAgaWYgKGluY2x1ZGVNYXJnaW4pIHtcbiAgICAgICAgbGV0IHN0eWxlID0gZWxlbS5jdXJyZW50U3R5bGUgfHwgd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbSlcbiAgICAgICAgcmV0dXJuIGhlaWdodCArIHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luVG9wKSArIHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luQm90dG9tKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaGVpZ2h0XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFRyaWJ1dGVFdmVudHM7XG4iLCJjbGFzcyBUcmlidXRlTWVudUV2ZW50cyB7XG4gICAgY29uc3RydWN0b3IodHJpYnV0ZSkge1xuICAgICAgICB0aGlzLnRyaWJ1dGUgPSB0cmlidXRlXG4gICAgICAgIHRoaXMudHJpYnV0ZS5tZW51RXZlbnRzID0gdGhpc1xuICAgICAgICB0aGlzLm1lbnUgPSB0aGlzLnRyaWJ1dGUubWVudVxuICAgIH1cblxuICAgIGJpbmQobWVudSkge1xuICAgICAgICBtZW51LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLFxuICAgICAgICAgICAgdGhpcy50cmlidXRlLmV2ZW50cy5rZXlkb3duLmJpbmQodGhpcy5tZW51LCB0aGlzKSwgZmFsc2UpXG4gICAgICAgIHRoaXMudHJpYnV0ZS5yYW5nZS5nZXREb2N1bWVudCgpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcbiAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5ldmVudHMuY2xpY2suYmluZChudWxsLCB0aGlzKSwgZmFsc2UpXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmRlYm91bmNlKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRyaWJ1dGUuaXNBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUuc2hvd01lbnVGb3IodGhpcy50cmlidXRlLmN1cnJlbnQuZWxlbWVudCwgdHJ1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMzAwLCBmYWxzZSkpXG5cbiAgICAgICAgaWYgKHRoaXMubWVudUNvbnRhaW5lcikge1xuICAgICAgICAgICAgdGhpcy5tZW51Q29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuZGVib3VuY2UoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyaWJ1dGUuaXNBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLnNob3dNZW51Rm9yKHRoaXMudHJpYnV0ZS5jdXJyZW50LmVsZW1lbnQsIGZhbHNlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDMwMCwgZmFsc2UpLCBmYWxzZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5vbnNjcm9sbCA9IHRoaXMuZGVib3VuY2UoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyaWJ1dGUuaXNBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLnNob3dNZW51Rm9yKHRoaXMudHJpYnV0ZS5jdXJyZW50LmVsZW1lbnQsIGZhbHNlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDMwMCwgZmFsc2UpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgICAgICB2YXIgdGltZW91dFxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGFyZ3MgPSBhcmd1bWVudHNcbiAgICAgICAgICAgIHZhciBsYXRlciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbFxuICAgICAgICAgICAgICAgIGlmICghaW1tZWRpYXRlKSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dFxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpXG4gICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdClcbiAgICAgICAgICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgVHJpYnV0ZU1lbnVFdmVudHM7XG4iLCIvLyBUaGFua3MgdG8gaHR0cHM6Ly9naXRodWIuY29tL2plZmYtY29sbGlucy9tZW50LmlvXG5jbGFzcyBUcmlidXRlUmFuZ2Uge1xuICAgIGNvbnN0cnVjdG9yKHRyaWJ1dGUpIHtcbiAgICAgICAgdGhpcy50cmlidXRlID0gdHJpYnV0ZVxuICAgICAgICB0aGlzLnRyaWJ1dGUucmFuZ2UgPSB0aGlzXG4gICAgfVxuXG4gICAgZ2V0RG9jdW1lbnQoKSB7XG4gICAgICAgIGxldCBpZnJhbWVcbiAgICAgICAgaWYgKHRoaXMudHJpYnV0ZS5jdXJyZW50LmNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmcmFtZSA9IHRoaXMudHJpYnV0ZS5jdXJyZW50LmNvbGxlY3Rpb24uaWZyYW1lXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlmcmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnRcbiAgICB9XG5cbiAgICBwb3NpdGlvbk1lbnVBdENhcmV0KHNjcm9sbFRvKSB7XG4gICAgICAgIGxldCBjb250ZXh0ID0gdGhpcy50cmlidXRlLmN1cnJlbnQsXG4gICAgICAgICAgICBjb29yZGluYXRlc1xuICAgICAgICBsZXQgaW5mbyA9IHRoaXMuZ2V0VHJpZ2dlckluZm8oZmFsc2UsIGZhbHNlLCB0cnVlLCB0aGlzLnRyaWJ1dGUuYWxsb3dTcGFjZXMpXG5cbiAgICAgICAgaWYgKGluZm8gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzQ29udGVudEVkaXRhYmxlKGNvbnRleHQuZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlcyA9IHRoaXMuZ2V0VGV4dEFyZWFPcklucHV0VW5kZXJsaW5lUG9zaXRpb24odGhpcy5nZXREb2N1bWVudCgpLmFjdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgIGluZm8ubWVudGlvblBvc2l0aW9uKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXMgPSB0aGlzLmdldENvbnRlbnRFZGl0YWJsZUNhcmV0UG9zaXRpb24oaW5mby5tZW50aW9uUG9zaXRpb24pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE1vdmUgdGhlIGJ1dHRvbiBpbnRvIHBsYWNlLlxuICAgICAgICAgICAgdGhpcy50cmlidXRlLm1lbnUuc3R5bGUuY3NzVGV4dCA9IGB0b3A6ICR7Y29vcmRpbmF0ZXMudG9wfXB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJHtjb29yZGluYXRlcy5sZWZ0fXB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4OiAxMDAwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO2BcblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHNjcm9sbFRvKSB0aGlzLnNjcm9sbEludG9WaWV3KHRoaXMuZ2V0RG9jdW1lbnQoKS5hY3RpdmVFbGVtZW50KVxuICAgICAgICAgICAgfSwgMClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5tZW51LnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZSdcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGVjdEVsZW1lbnQodGFyZ2V0RWxlbWVudCwgcGF0aCwgb2Zmc2V0KSB7XG4gICAgICAgIGxldCByYW5nZVxuICAgICAgICBsZXQgZWxlbSA9IHRhcmdldEVsZW1lbnRcblxuICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZWxlbSA9IGVsZW0uY2hpbGROb2Rlc1twYXRoW2ldXVxuICAgICAgICAgICAgICAgIGlmIChlbGVtID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdoaWxlIChlbGVtLmxlbmd0aCA8IG9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgLT0gZWxlbS5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgZWxlbSA9IGVsZW0ubmV4dFNpYmxpbmdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVsZW0uY2hpbGROb2Rlcy5sZW5ndGggPT09IDAgJiYgIWVsZW0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW0gPSBlbGVtLnByZXZpb3VzU2libGluZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgc2VsID0gdGhpcy5nZXRXaW5kb3dTZWxlY3Rpb24oKVxuXG4gICAgICAgIHJhbmdlID0gdGhpcy5nZXREb2N1bWVudCgpLmNyZWF0ZVJhbmdlKClcbiAgICAgICAgcmFuZ2Uuc2V0U3RhcnQoZWxlbSwgb2Zmc2V0KVxuICAgICAgICByYW5nZS5zZXRFbmQoZWxlbSwgb2Zmc2V0KVxuICAgICAgICByYW5nZS5jb2xsYXBzZSh0cnVlKVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKClcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XG5cbiAgICAgICAgc2VsLmFkZFJhbmdlKHJhbmdlKVxuICAgICAgICB0YXJnZXRFbGVtZW50LmZvY3VzKClcbiAgICB9XG5cbiAgICByZXNldFNlbGVjdGlvbih0YXJnZXRFbGVtZW50LCBwYXRoLCBvZmZzZXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQ29udGVudEVkaXRhYmxlKHRhcmdldEVsZW1lbnQpKSB7XG4gICAgICAgICAgICBpZiAodGFyZ2V0RWxlbWVudCAhPT0gdGhpcy5nZXREb2N1bWVudCgpLmFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRFbGVtZW50LmZvY3VzKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0RWxlbWVudCh0YXJnZXRFbGVtZW50LCBwYXRoLCBvZmZzZXQpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXBsYWNlVHJpZ2dlclRleHQodGV4dCwgcmVxdWlyZUxlYWRpbmdTcGFjZSwgaGFzVHJhaWxpbmdTcGFjZSkge1xuICAgICAgICBsZXQgY29udGV4dCA9IHRoaXMudHJpYnV0ZS5jdXJyZW50XG4gICAgICAgIHRoaXMucmVzZXRTZWxlY3Rpb24oY29udGV4dC5lbGVtZW50LCBjb250ZXh0LnNlbGVjdGVkUGF0aCwgY29udGV4dC5zZWxlY3RlZE9mZnNldClcblxuICAgICAgICBsZXQgaW5mbyA9IHRoaXMuZ2V0VHJpZ2dlckluZm8odHJ1ZSwgaGFzVHJhaWxpbmdTcGFjZSwgcmVxdWlyZUxlYWRpbmdTcGFjZSwgdGhpcy50cmlidXRlLmFsbG93U3BhY2VzKVxuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgZXZlbnRcbiAgICAgICAgbGV0IHJlcGxhY2VFdmVudCA9IG5ldyBDdXN0b21FdmVudCgndHJpYnV0ZS1yZXBsYWNlZCcsIHtcbiAgICAgICAgICAgIGRldGFpbDogdGV4dFxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChpbmZvICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0NvbnRlbnRFZGl0YWJsZShjb250ZXh0LmVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgbGV0IG15RmllbGQgPSB0aGlzLmdldERvY3VtZW50KCkuYWN0aXZlRWxlbWVudFxuICAgICAgICAgICAgICAgIGxldCB0ZXh0U3VmZml4ID0gdHlwZW9mIHRoaXMudHJpYnV0ZS5yZXBsYWNlVGV4dFN1ZmZpeCA9PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICA/IHRoaXMudHJpYnV0ZS5yZXBsYWNlVGV4dFN1ZmZpeFxuICAgICAgICAgICAgICAgICAgICA6ICcgJ1xuICAgICAgICAgICAgICAgIHRleHQgKz0gdGV4dFN1ZmZpeFxuICAgICAgICAgICAgICAgIGxldCBzdGFydFBvcyA9IGluZm8ubWVudGlvblBvc2l0aW9uXG4gICAgICAgICAgICAgICAgbGV0IGVuZFBvcyA9IGluZm8ubWVudGlvblBvc2l0aW9uICsgaW5mby5tZW50aW9uVGV4dC5sZW5ndGggKyB0ZXh0U3VmZml4Lmxlbmd0aFxuICAgICAgICAgICAgICAgIG15RmllbGQudmFsdWUgPSBteUZpZWxkLnZhbHVlLnN1YnN0cmluZygwLCBzdGFydFBvcykgKyB0ZXh0ICtcbiAgICAgICAgICAgICAgICAgICAgbXlGaWVsZC52YWx1ZS5zdWJzdHJpbmcoZW5kUG9zLCBteUZpZWxkLnZhbHVlLmxlbmd0aClcbiAgICAgICAgICAgICAgICBteUZpZWxkLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRQb3MgKyB0ZXh0Lmxlbmd0aFxuICAgICAgICAgICAgICAgIG15RmllbGQuc2VsZWN0aW9uRW5kID0gc3RhcnRQb3MgKyB0ZXh0Lmxlbmd0aFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBhZGQgYSBzcGFjZSB0byB0aGUgZW5kIG9mIHRoZSBwYXN0ZWQgdGV4dFxuICAgICAgICAgICAgICAgIGxldCB0ZXh0U3VmZml4ID0gdHlwZW9mIHRoaXMudHJpYnV0ZS5yZXBsYWNlVGV4dFN1ZmZpeCA9PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICA/IHRoaXMudHJpYnV0ZS5yZXBsYWNlVGV4dFN1ZmZpeFxuICAgICAgICAgICAgICAgICAgICA6ICdcXHhBMCdcbiAgICAgICAgICAgICAgICB0ZXh0ICs9IHRleHRTdWZmaXhcbiAgICAgICAgICAgICAgICB0aGlzLnBhc3RlSHRtbCh0ZXh0LCBpbmZvLm1lbnRpb25Qb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgaW5mby5tZW50aW9uUG9zaXRpb24gKyBpbmZvLm1lbnRpb25UZXh0Lmxlbmd0aCArIDEpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnRleHQuZWxlbWVudC5kaXNwYXRjaEV2ZW50KHJlcGxhY2VFdmVudClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBhc3RlSHRtbChodG1sLCBzdGFydFBvcywgZW5kUG9zKSB7XG4gICAgICAgIGxldCByYW5nZSwgc2VsXG4gICAgICAgIHNlbCA9IHRoaXMuZ2V0V2luZG93U2VsZWN0aW9uKClcbiAgICAgICAgcmFuZ2UgPSB0aGlzLmdldERvY3VtZW50KCkuY3JlYXRlUmFuZ2UoKVxuICAgICAgICByYW5nZS5zZXRTdGFydChzZWwuYW5jaG9yTm9kZSwgc3RhcnRQb3MpXG4gICAgICAgIHJhbmdlLnNldEVuZChzZWwuYW5jaG9yTm9kZSwgZW5kUG9zKVxuICAgICAgICByYW5nZS5kZWxldGVDb250ZW50cygpXG5cbiAgICAgICAgbGV0IGVsID0gdGhpcy5nZXREb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIGVsLmlubmVySFRNTCA9IGh0bWxcbiAgICAgICAgbGV0IGZyYWcgPSB0aGlzLmdldERvY3VtZW50KCkuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuICAgICAgICAgICAgbm9kZSwgbGFzdE5vZGVcbiAgICAgICAgd2hpbGUgKChub2RlID0gZWwuZmlyc3RDaGlsZCkpIHtcbiAgICAgICAgICAgIGxhc3ROb2RlID0gZnJhZy5hcHBlbmRDaGlsZChub2RlKVxuICAgICAgICB9XG4gICAgICAgIHJhbmdlLmluc2VydE5vZGUoZnJhZylcblxuICAgICAgICAvLyBQcmVzZXJ2ZSB0aGUgc2VsZWN0aW9uXG4gICAgICAgIGlmIChsYXN0Tm9kZSkge1xuICAgICAgICAgICAgcmFuZ2UgPSByYW5nZS5jbG9uZVJhbmdlKClcbiAgICAgICAgICAgIHJhbmdlLnNldFN0YXJ0QWZ0ZXIobGFzdE5vZGUpXG4gICAgICAgICAgICByYW5nZS5jb2xsYXBzZSh0cnVlKVxuICAgICAgICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpXG4gICAgICAgICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRXaW5kb3dTZWxlY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnRyaWJ1dGUuY29sbGVjdGlvbi5pZnJhbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyaWJ1dGUuY29sbGVjdGlvbi5pZnJhbWUuY29udGVudFdpbmRvdy5nZXRTZWxlY3Rpb24oKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRTZWxlY3Rpb24oKVxuICAgIH1cblxuICAgIGdldE5vZGVQb3NpdGlvbkluUGFyZW50KGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudC5wYXJlbnROb2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBub2RlID0gZWxlbWVudC5wYXJlbnROb2RlLmNoaWxkTm9kZXNbaV1cblxuICAgICAgICAgICAgaWYgKG5vZGUgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q29udGVudEVkaXRhYmxlU2VsZWN0ZWRQYXRoKCkge1xuICAgICAgICAvLyBjb250ZW50IGVkaXRhYmxlXG4gICAgICAgIGxldCBzZWwgPSB0aGlzLmdldFdpbmRvd1NlbGVjdGlvbigpXG4gICAgICAgIGxldCBzZWxlY3RlZCA9IHNlbC5hbmNob3JOb2RlXG4gICAgICAgIGxldCBwYXRoID0gW11cbiAgICAgICAgbGV0IG9mZnNldFxuXG4gICAgICAgIGlmIChzZWxlY3RlZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgaVxuICAgICAgICAgICAgbGV0IGNlID0gc2VsZWN0ZWQuY29udGVudEVkaXRhYmxlXG4gICAgICAgICAgICB3aGlsZSAoc2VsZWN0ZWQgIT09IG51bGwgJiYgY2UgIT09ICd0cnVlJykge1xuICAgICAgICAgICAgICAgIGkgPSB0aGlzLmdldE5vZGVQb3NpdGlvbkluUGFyZW50KHNlbGVjdGVkKVxuICAgICAgICAgICAgICAgIHBhdGgucHVzaChpKVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkID0gc2VsZWN0ZWQucGFyZW50Tm9kZVxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBjZSA9IHNlbGVjdGVkLmNvbnRlbnRFZGl0YWJsZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhdGgucmV2ZXJzZSgpXG5cbiAgICAgICAgICAgIC8vIGdldFJhbmdlQXQgbWF5IG5vdCBleGlzdCwgbmVlZCBhbHRlcm5hdGl2ZVxuICAgICAgICAgICAgb2Zmc2V0ID0gc2VsLmdldFJhbmdlQXQoMCkuc3RhcnRPZmZzZXRcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZDogc2VsZWN0ZWQsXG4gICAgICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IG9mZnNldFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0VGV4dFByZWNlZGluZ0N1cnJlbnRTZWxlY3Rpb24oKSB7XG4gICAgICAgIGxldCBjb250ZXh0ID0gdGhpcy50cmlidXRlLmN1cnJlbnQsXG4gICAgICAgICAgICB0ZXh0ID0gJydcblxuICAgICAgICBpZiAoIXRoaXMuaXNDb250ZW50RWRpdGFibGUoY29udGV4dC5lbGVtZW50KSkge1xuICAgICAgICAgICAgbGV0IHRleHRDb21wb25lbnQgPSB0aGlzLmdldERvY3VtZW50KCkuYWN0aXZlRWxlbWVudFxuICAgICAgICAgICAgbGV0IHN0YXJ0UG9zID0gdGV4dENvbXBvbmVudC5zZWxlY3Rpb25TdGFydFxuICAgICAgICAgICAgaWYgKHRleHRDb21wb25lbnQudmFsdWUgJiYgc3RhcnRQb3MgPj0gMCkge1xuICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0Q29tcG9uZW50LnZhbHVlLnN1YnN0cmluZygwLCBzdGFydFBvcylcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHNlbGVjdGVkRWxlbSA9IHRoaXMuZ2V0V2luZG93U2VsZWN0aW9uKCkuYW5jaG9yTm9kZVxuXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRFbGVtICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgd29ya2luZ05vZGVDb250ZW50ID0gc2VsZWN0ZWRFbGVtLnRleHRDb250ZW50XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdFN0YXJ0T2Zmc2V0ID0gdGhpcy5nZXRXaW5kb3dTZWxlY3Rpb24oKS5nZXRSYW5nZUF0KDApLnN0YXJ0T2Zmc2V0XG5cbiAgICAgICAgICAgICAgICBpZiAod29ya2luZ05vZGVDb250ZW50ICYmIHNlbGVjdFN0YXJ0T2Zmc2V0ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9IHdvcmtpbmdOb2RlQ29udGVudC5zdWJzdHJpbmcoMCwgc2VsZWN0U3RhcnRPZmZzZXQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRleHRcbiAgICB9XG5cbiAgICBnZXRUcmlnZ2VySW5mbyhtZW51QWxyZWFkeUFjdGl2ZSwgaGFzVHJhaWxpbmdTcGFjZSwgcmVxdWlyZUxlYWRpbmdTcGFjZSwgYWxsb3dTcGFjZXMpIHtcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMudHJpYnV0ZS5jdXJyZW50XG4gICAgICAgIGxldCBzZWxlY3RlZCwgcGF0aCwgb2Zmc2V0XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzQ29udGVudEVkaXRhYmxlKGN0eC5lbGVtZW50KSkge1xuICAgICAgICAgICAgc2VsZWN0ZWQgPSB0aGlzLmdldERvY3VtZW50KCkuYWN0aXZlRWxlbWVudFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY29udGVudCBlZGl0YWJsZVxuICAgICAgICAgICAgbGV0IHNlbGVjdGlvbkluZm8gPSB0aGlzLmdldENvbnRlbnRFZGl0YWJsZVNlbGVjdGVkUGF0aCgpXG5cbiAgICAgICAgICAgIGlmIChzZWxlY3Rpb25JbmZvKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQgPSBzZWxlY3Rpb25JbmZvLnNlbGVjdGVkXG4gICAgICAgICAgICAgICAgcGF0aCA9IHNlbGVjdGlvbkluZm8ucGF0aFxuICAgICAgICAgICAgICAgIG9mZnNldCA9IHNlbGVjdGlvbkluZm8ub2Zmc2V0XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZWZmZWN0aXZlUmFuZ2UgPSB0aGlzLmdldFRleHRQcmVjZWRpbmdDdXJyZW50U2VsZWN0aW9uKClcblxuICAgICAgICBpZiAoZWZmZWN0aXZlUmFuZ2UgIT09IHVuZGVmaW5lZCAmJiBlZmZlY3RpdmVSYW5nZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IG1vc3RSZWNlbnRUcmlnZ2VyQ2hhclBvcyA9IC0xXG4gICAgICAgICAgICBsZXQgdHJpZ2dlckNoYXJcblxuICAgICAgICAgICAgdGhpcy50cmlidXRlLmNvbGxlY3Rpb24uZm9yRWFjaChjb25maWcgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjID0gY29uZmlnLnRyaWdnZXJcbiAgICAgICAgICAgICAgICBsZXQgaWR4ID0gY29uZmlnLnJlcXVpcmVMZWFkaW5nU3BhY2UgP1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleFdpdGhMZWFkaW5nU3BhY2UoZWZmZWN0aXZlUmFuZ2UsIGMpIDpcbiAgICAgICAgICAgICAgICAgICAgZWZmZWN0aXZlUmFuZ2UubGFzdEluZGV4T2YoYylcblxuICAgICAgICAgICAgICAgIGlmIChpZHggPiBtb3N0UmVjZW50VHJpZ2dlckNoYXJQb3MpIHtcbiAgICAgICAgICAgICAgICAgICAgbW9zdFJlY2VudFRyaWdnZXJDaGFyUG9zID0gaWR4XG4gICAgICAgICAgICAgICAgICAgIHRyaWdnZXJDaGFyID0gY1xuICAgICAgICAgICAgICAgICAgICByZXF1aXJlTGVhZGluZ1NwYWNlID0gY29uZmlnLnJlcXVpcmVMZWFkaW5nU3BhY2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBpZiAobW9zdFJlY2VudFRyaWdnZXJDaGFyUG9zID49IDAgJiZcbiAgICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgICAgIG1vc3RSZWNlbnRUcmlnZ2VyQ2hhclBvcyA9PT0gMCB8fFxuICAgICAgICAgICAgICAgICAgICAhcmVxdWlyZUxlYWRpbmdTcGFjZSB8fFxuICAgICAgICAgICAgICAgICAgICAvW1xceEEwXFxzXS9nLnRlc3QoXG4gICAgICAgICAgICAgICAgICAgICAgICBlZmZlY3RpdmVSYW5nZS5zdWJzdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9zdFJlY2VudFRyaWdnZXJDaGFyUG9zIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3N0UmVjZW50VHJpZ2dlckNoYXJQb3MpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFRyaWdnZXJTbmlwcGV0ID0gZWZmZWN0aXZlUmFuZ2Uuc3Vic3RyaW5nKG1vc3RSZWNlbnRUcmlnZ2VyQ2hhclBvcyArIDEsXG4gICAgICAgICAgICAgICAgICAgIGVmZmVjdGl2ZVJhbmdlLmxlbmd0aClcblxuICAgICAgICAgICAgICAgIHRyaWdnZXJDaGFyID0gZWZmZWN0aXZlUmFuZ2Uuc3Vic3RyaW5nKG1vc3RSZWNlbnRUcmlnZ2VyQ2hhclBvcywgbW9zdFJlY2VudFRyaWdnZXJDaGFyUG9zICsgMSlcbiAgICAgICAgICAgICAgICBsZXQgZmlyc3RTbmlwcGV0Q2hhciA9IGN1cnJlbnRUcmlnZ2VyU25pcHBldC5zdWJzdHJpbmcoMCwgMSlcbiAgICAgICAgICAgICAgICBsZXQgbGVhZGluZ1NwYWNlID0gY3VycmVudFRyaWdnZXJTbmlwcGV0Lmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RTbmlwcGV0Q2hhciA9PT0gJyAnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFNuaXBwZXRDaGFyID09PSAnXFx4QTAnXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICBpZiAoaGFzVHJhaWxpbmdTcGFjZSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VHJpZ2dlclNuaXBwZXQgPSBjdXJyZW50VHJpZ2dlclNuaXBwZXQudHJpbSgpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IHJlZ2V4ID0gYWxsb3dTcGFjZXMgPyAvW15cXFMgXS9nIDogL1tcXHhBMFxcc10vZztcblxuICAgICAgICAgICAgICAgIGlmICghbGVhZGluZ1NwYWNlICYmIChtZW51QWxyZWFkeUFjdGl2ZSB8fCAhKHJlZ2V4LnRlc3QoY3VycmVudFRyaWdnZXJTbmlwcGV0KSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZW50aW9uUG9zaXRpb246IG1vc3RSZWNlbnRUcmlnZ2VyQ2hhclBvcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbnRpb25UZXh0OiBjdXJyZW50VHJpZ2dlclNuaXBwZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW50aW9uU2VsZWN0ZWRFbGVtZW50OiBzZWxlY3RlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbnRpb25TZWxlY3RlZFBhdGg6IHBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW50aW9uU2VsZWN0ZWRPZmZzZXQ6IG9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbnRpb25UcmlnZ2VyQ2hhcjogdHJpZ2dlckNoYXJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxhc3RJbmRleFdpdGhMZWFkaW5nU3BhY2UgKHN0ciwgY2hhcikge1xuICAgICAgICBsZXQgcmV2ZXJzZWRTdHIgPSBzdHIuc3BsaXQoJycpLnJldmVyc2UoKS5qb2luKCcnKVxuICAgICAgICBsZXQgaW5kZXggPSAtMVxuXG4gICAgICAgIGZvciAobGV0IGNpZHggPSAwLCBsZW4gPSBzdHIubGVuZ3RoOyBjaWR4IDwgbGVuOyBjaWR4KyspIHtcbiAgICAgICAgICAgIGxldCBmaXJzdENoYXIgPSBjaWR4ID09PSBzdHIubGVuZ3RoIC0gMVxuICAgICAgICAgICAgbGV0IGxlYWRpbmdTcGFjZSA9IC9cXHMvLnRlc3QocmV2ZXJzZWRTdHJbY2lkeCArIDFdKVxuICAgICAgICAgICAgbGV0IG1hdGNoID0gY2hhciA9PT0gcmV2ZXJzZWRTdHJbY2lkeF1cblxuICAgICAgICAgICAgaWYgKG1hdGNoICYmIChmaXJzdENoYXIgfHwgbGVhZGluZ1NwYWNlKSkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gc3RyLmxlbmd0aCAtIDEgLSBjaWR4XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbmRleFxuICAgIH1cblxuICAgIGlzQ29udGVudEVkaXRhYmxlKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQubm9kZU5hbWUgIT09ICdJTlBVVCcgJiYgZWxlbWVudC5ub2RlTmFtZSAhPT0gJ1RFWFRBUkVBJ1xuICAgIH1cblxuICAgIGdldFRleHRBcmVhT3JJbnB1dFVuZGVybGluZVBvc2l0aW9uKGVsZW1lbnQsIHBvc2l0aW9uKSB7XG4gICAgICAgIGxldCBwcm9wZXJ0aWVzID0gWydkaXJlY3Rpb24nLCAnYm94U2l6aW5nJywgJ3dpZHRoJywgJ2hlaWdodCcsICdvdmVyZmxvd1gnLFxuICAgICAgICAgICAgJ292ZXJmbG93WScsICdib3JkZXJUb3BXaWR0aCcsICdib3JkZXJSaWdodFdpZHRoJyxcbiAgICAgICAgICAgICdib3JkZXJCb3R0b21XaWR0aCcsICdib3JkZXJMZWZ0V2lkdGgnLCAncGFkZGluZ1RvcCcsXG4gICAgICAgICAgICAncGFkZGluZ1JpZ2h0JywgJ3BhZGRpbmdCb3R0b20nLCAncGFkZGluZ0xlZnQnLFxuICAgICAgICAgICAgJ2ZvbnRTdHlsZScsICdmb250VmFyaWFudCcsICdmb250V2VpZ2h0JywgJ2ZvbnRTdHJldGNoJyxcbiAgICAgICAgICAgICdmb250U2l6ZScsICdmb250U2l6ZUFkanVzdCcsICdsaW5lSGVpZ2h0JywgJ2ZvbnRGYW1pbHknLFxuICAgICAgICAgICAgJ3RleHRBbGlnbicsICd0ZXh0VHJhbnNmb3JtJywgJ3RleHRJbmRlbnQnLFxuICAgICAgICAgICAgJ3RleHREZWNvcmF0aW9uJywgJ2xldHRlclNwYWNpbmcnLCAnd29yZFNwYWNpbmcnXG4gICAgICAgIF1cblxuICAgICAgICBsZXQgaXNGaXJlZm94ID0gKHdpbmRvdy5tb3pJbm5lclNjcmVlblggIT09IG51bGwpXG5cbiAgICAgICAgbGV0IGRpdiA9IHRoaXMuZ2V0RG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICBkaXYuaWQgPSAnaW5wdXQtdGV4dGFyZWEtY2FyZXQtcG9zaXRpb24tbWlycm9yLWRpdidcbiAgICAgICAgdGhpcy5nZXREb2N1bWVudCgpLmJvZHkuYXBwZW5kQ2hpbGQoZGl2KVxuXG4gICAgICAgIGxldCBzdHlsZSA9IGRpdi5zdHlsZVxuICAgICAgICBsZXQgY29tcHV0ZWQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSA/IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkgOiBlbGVtZW50LmN1cnJlbnRTdHlsZVxuXG4gICAgICAgIHN0eWxlLndoaXRlU3BhY2UgPSAncHJlLXdyYXAnXG4gICAgICAgIGlmIChlbGVtZW50Lm5vZGVOYW1lICE9PSAnSU5QVVQnKSB7XG4gICAgICAgICAgICBzdHlsZS53b3JkV3JhcCA9ICdicmVhay13b3JkJ1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcG9zaXRpb24gb2ZmLXNjcmVlblxuICAgICAgICBzdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSdcbiAgICAgICAgc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nXG5cbiAgICAgICAgLy8gdHJhbnNmZXIgdGhlIGVsZW1lbnQncyBwcm9wZXJ0aWVzIHRvIHRoZSBkaXZcbiAgICAgICAgcHJvcGVydGllcy5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICAgICAgc3R5bGVbcHJvcF0gPSBjb21wdXRlZFtwcm9wXVxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChpc0ZpcmVmb3gpIHtcbiAgICAgICAgICAgIHN0eWxlLndpZHRoID0gYCR7KHBhcnNlSW50KGNvbXB1dGVkLndpZHRoKSAtIDIpfXB4YFxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuc2Nyb2xsSGVpZ2h0ID4gcGFyc2VJbnQoY29tcHV0ZWQuaGVpZ2h0KSlcbiAgICAgICAgICAgICAgICBzdHlsZS5vdmVyZmxvd1kgPSAnc2Nyb2xsJ1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuICAgICAgICB9XG5cbiAgICAgICAgZGl2LnRleHRDb250ZW50ID0gZWxlbWVudC52YWx1ZS5zdWJzdHJpbmcoMCwgcG9zaXRpb24pXG5cbiAgICAgICAgaWYgKGVsZW1lbnQubm9kZU5hbWUgPT09ICdJTlBVVCcpIHtcbiAgICAgICAgICAgIGRpdi50ZXh0Q29udGVudCA9IGRpdi50ZXh0Q29udGVudC5yZXBsYWNlKC9cXHMvZywgJ8KgJylcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzcGFuID0gdGhpcy5nZXREb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgICBzcGFuLnRleHRDb250ZW50ID0gZWxlbWVudC52YWx1ZS5zdWJzdHJpbmcocG9zaXRpb24pIHx8ICcuJ1xuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoc3BhbilcblxuICAgICAgICBsZXQgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgbGV0IGRvYyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxuICAgICAgICBsZXQgd2luZG93TGVmdCA9ICh3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jLnNjcm9sbExlZnQpIC0gKGRvYy5jbGllbnRMZWZ0IHx8IDApXG4gICAgICAgIGxldCB3aW5kb3dUb3AgPSAod2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvYy5zY3JvbGxUb3ApIC0gKGRvYy5jbGllbnRUb3AgfHwgMClcblxuICAgICAgICBsZXQgY29vcmRpbmF0ZXMgPSB7XG4gICAgICAgICAgICB0b3A6IHJlY3QudG9wICsgd2luZG93VG9wICsgc3Bhbi5vZmZzZXRUb3AgKyBwYXJzZUludChjb21wdXRlZC5ib3JkZXJUb3BXaWR0aCkgKyBwYXJzZUludChjb21wdXRlZC5mb250U2l6ZSkgLSBlbGVtZW50LnNjcm9sbFRvcCxcbiAgICAgICAgICAgIGxlZnQ6IHJlY3QubGVmdCArIHdpbmRvd0xlZnQgKyBzcGFuLm9mZnNldExlZnQgKyBwYXJzZUludChjb21wdXRlZC5ib3JkZXJMZWZ0V2lkdGgpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdldERvY3VtZW50KCkuYm9keS5yZW1vdmVDaGlsZChkaXYpXG5cbiAgICAgICAgcmV0dXJuIGNvb3JkaW5hdGVzXG4gICAgfVxuXG4gICAgZ2V0Q29udGVudEVkaXRhYmxlQ2FyZXRQb3NpdGlvbihzZWxlY3RlZE5vZGVQb3NpdGlvbikge1xuICAgICAgICBsZXQgbWFya2VyVGV4dENoYXIgPSAn77u/J1xuICAgICAgICBsZXQgbWFya2VyRWwsIG1hcmtlcklkID0gYHNlbF8ke25ldyBEYXRlKCkuZ2V0VGltZSgpfV8ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoKS5zdWJzdHIoMil9YFxuICAgICAgICBsZXQgcmFuZ2VcbiAgICAgICAgbGV0IHNlbCA9IHRoaXMuZ2V0V2luZG93U2VsZWN0aW9uKClcbiAgICAgICAgbGV0IHByZXZSYW5nZSA9IHNlbC5nZXRSYW5nZUF0KDApXG5cbiAgICAgICAgcmFuZ2UgPSB0aGlzLmdldERvY3VtZW50KCkuY3JlYXRlUmFuZ2UoKVxuICAgICAgICByYW5nZS5zZXRTdGFydChzZWwuYW5jaG9yTm9kZSwgc2VsZWN0ZWROb2RlUG9zaXRpb24pXG4gICAgICAgIHJhbmdlLnNldEVuZChzZWwuYW5jaG9yTm9kZSwgc2VsZWN0ZWROb2RlUG9zaXRpb24pXG5cbiAgICAgICAgcmFuZ2UuY29sbGFwc2UoZmFsc2UpXG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBtYXJrZXIgZWxlbWVudCBjb250YWluaW5nIGEgc2luZ2xlIGludmlzaWJsZSBjaGFyYWN0ZXIgdXNpbmcgRE9NIG1ldGhvZHMgYW5kIGluc2VydCBpdFxuICAgICAgICBtYXJrZXJFbCA9IHRoaXMuZ2V0RG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgbWFya2VyRWwuaWQgPSBtYXJrZXJJZFxuICAgICAgICBtYXJrZXJFbC5hcHBlbmRDaGlsZCh0aGlzLmdldERvY3VtZW50KCkuY3JlYXRlVGV4dE5vZGUobWFya2VyVGV4dENoYXIpKVxuICAgICAgICByYW5nZS5pbnNlcnROb2RlKG1hcmtlckVsKVxuICAgICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKClcbiAgICAgICAgc2VsLmFkZFJhbmdlKHByZXZSYW5nZSlcblxuICAgICAgICBsZXQgcmVjdCA9IG1hcmtlckVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgIGxldCBkb2MgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcbiAgICAgICAgbGV0IHdpbmRvd0xlZnQgPSAod2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvYy5zY3JvbGxMZWZ0KSAtIChkb2MuY2xpZW50TGVmdCB8fCAwKVxuICAgICAgICBsZXQgd2luZG93VG9wID0gKHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2Muc2Nyb2xsVG9wKSAtIChkb2MuY2xpZW50VG9wIHx8IDApXG4gICAgICAgIGxldCBjb29yZGluYXRlcyA9IHtcbiAgICAgICAgICAgIGxlZnQ6IHJlY3QubGVmdCArIHdpbmRvd0xlZnQsXG4gICAgICAgICAgICB0b3A6IHJlY3QudG9wICsgbWFya2VyRWwub2Zmc2V0SGVpZ2h0ICsgd2luZG93VG9wXG4gICAgICAgIH1cblxuICAgICAgICBtYXJrZXJFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG1hcmtlckVsKVxuICAgICAgICByZXR1cm4gY29vcmRpbmF0ZXNcbiAgICB9XG5cbiAgICBzY3JvbGxJbnRvVmlldyhlbGVtKSB7XG4gICAgICAgIGxldCByZWFzb25hYmxlQnVmZmVyID0gMjAsXG4gICAgICAgICAgICBjbGllbnRSZWN0XG4gICAgICAgIGxldCBtYXhTY3JvbGxEaXNwbGFjZW1lbnQgPSAxMDBcbiAgICAgICAgbGV0IGUgPSBlbGVtXG5cbiAgICAgICAgd2hpbGUgKGNsaWVudFJlY3QgPT09IHVuZGVmaW5lZCB8fCBjbGllbnRSZWN0LmhlaWdodCA9PT0gMCkge1xuICAgICAgICAgICAgY2xpZW50UmVjdCA9IGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgICAgICAgICAgaWYgKGNsaWVudFJlY3QuaGVpZ2h0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZSA9IGUuY2hpbGROb2Rlc1swXVxuICAgICAgICAgICAgICAgIGlmIChlID09PSB1bmRlZmluZWQgfHwgIWUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBlbGVtVG9wID0gY2xpZW50UmVjdC50b3BcbiAgICAgICAgbGV0IGVsZW1Cb3R0b20gPSBlbGVtVG9wICsgY2xpZW50UmVjdC5oZWlnaHRcblxuICAgICAgICBpZiAoZWxlbVRvcCA8IDApIHtcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCB3aW5kb3cucGFnZVlPZmZzZXQgKyBjbGllbnRSZWN0LnRvcCAtIHJlYXNvbmFibGVCdWZmZXIpXG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbUJvdHRvbSA+IHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgICAgICAgbGV0IG1heFkgPSB3aW5kb3cucGFnZVlPZmZzZXQgKyBjbGllbnRSZWN0LnRvcCAtIHJlYXNvbmFibGVCdWZmZXJcblxuICAgICAgICAgICAgaWYgKG1heFkgLSB3aW5kb3cucGFnZVlPZmZzZXQgPiBtYXhTY3JvbGxEaXNwbGFjZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBtYXhZID0gd2luZG93LnBhZ2VZT2Zmc2V0ICsgbWF4U2Nyb2xsRGlzcGxhY2VtZW50XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB0YXJnZXRZID0gd2luZG93LnBhZ2VZT2Zmc2V0IC0gKHdpbmRvdy5pbm5lckhlaWdodCAtIGVsZW1Cb3R0b20pXG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRZID4gbWF4WSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFkgPSBtYXhZXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCB0YXJnZXRZKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFRyaWJ1dGVSYW5nZTtcbiIsIi8vIFRoYW5rcyB0byBodHRwczovL2dpdGh1Yi5jb20vbWF0dHlvcmsvZnV6enlcbmNsYXNzIFRyaWJ1dGVTZWFyY2gge1xuICAgIGNvbnN0cnVjdG9yKHRyaWJ1dGUpIHtcbiAgICAgICAgdGhpcy50cmlidXRlID0gdHJpYnV0ZVxuICAgICAgICB0aGlzLnRyaWJ1dGUuc2VhcmNoID0gdGhpc1xuICAgIH1cblxuICAgIHNpbXBsZUZpbHRlcihwYXR0ZXJuLCBhcnJheSkge1xuICAgICAgICByZXR1cm4gYXJyYXkuZmlsdGVyKHN0cmluZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZXN0KHBhdHRlcm4sIHN0cmluZylcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICB0ZXN0KHBhdHRlcm4sIHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXRjaChwYXR0ZXJuLCBzdHJpbmcpICE9PSBudWxsXG4gICAgfVxuXG4gICAgbWF0Y2gocGF0dGVybiwgc3RyaW5nLCBvcHRzKSB7XG4gICAgICAgIG9wdHMgPSBvcHRzIHx8IHt9XG4gICAgICAgIGxldCBwYXR0ZXJuSWR4ID0gMCxcbiAgICAgICAgICAgIHJlc3VsdCA9IFtdLFxuICAgICAgICAgICAgbGVuID0gc3RyaW5nLmxlbmd0aCxcbiAgICAgICAgICAgIHRvdGFsU2NvcmUgPSAwLFxuICAgICAgICAgICAgY3VyclNjb3JlID0gMCxcbiAgICAgICAgICAgIHByZSA9IG9wdHMucHJlIHx8ICcnLFxuICAgICAgICAgICAgcG9zdCA9IG9wdHMucG9zdCB8fCAnJyxcbiAgICAgICAgICAgIGNvbXBhcmVTdHJpbmcgPSBvcHRzLmNhc2VTZW5zaXRpdmUgJiYgc3RyaW5nIHx8IHN0cmluZy50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgY2gsIGNvbXBhcmVDaGFyXG5cbiAgICAgICAgcGF0dGVybiA9IG9wdHMuY2FzZVNlbnNpdGl2ZSAmJiBwYXR0ZXJuIHx8IHBhdHRlcm4udG9Mb3dlckNhc2UoKVxuXG4gICAgICAgIGxldCBwYXR0ZXJuQ2FjaGUgPSB0aGlzLnRyYXZlcnNlKGNvbXBhcmVTdHJpbmcsIHBhdHRlcm4sIDAsIDAsIFtdKVxuICAgICAgICBpZiAoIXBhdHRlcm5DYWNoZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZW5kZXJlZDogdGhpcy5yZW5kZXIoc3RyaW5nLCBwYXR0ZXJuQ2FjaGUuY2FjaGUsIHByZSwgcG9zdCksXG4gICAgICAgICAgICBzY29yZTogcGF0dGVybkNhY2hlLnNjb3JlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0cmF2ZXJzZShzdHJpbmcsIHBhdHRlcm4sIHN0cmluZ0luZGV4LCBwYXR0ZXJuSW5kZXgsIHBhdHRlcm5DYWNoZSkge1xuICAgICAgICAvLyBpZiB0aGUgcGF0dGVybiBzZWFyY2ggYXQgZW5kXG4gICAgICAgIGlmIChwYXR0ZXJuLmxlbmd0aCA9PT0gcGF0dGVybkluZGV4KSB7XG5cbiAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBzb2NyZSBhbmQgY29weSB0aGUgY2FjaGUgY29udGFpbmluZyB0aGUgaW5kaWNlcyB3aGVyZSBpdCdzIGZvdW5kXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNjb3JlOiB0aGlzLmNhbGN1bGF0ZVNjb3JlKHBhdHRlcm5DYWNoZSksXG4gICAgICAgICAgICAgICAgY2FjaGU6IHBhdHRlcm5DYWNoZS5zbGljZSgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiBzdHJpbmcgYXQgZW5kIG9yIHJlbWFpbmluZyBwYXR0ZXJuID4gcmVtYWluaW5nIHN0cmluZ1xuICAgICAgICBpZiAoc3RyaW5nLmxlbmd0aCA9PT0gc3RyaW5nSW5kZXggfHwgcGF0dGVybi5sZW5ndGggLSBwYXR0ZXJuSW5kZXggPiBzdHJpbmcubGVuZ3RoIC0gc3RyaW5nSW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjID0gcGF0dGVybltwYXR0ZXJuSW5kZXhdXG4gICAgICAgIGxldCBpbmRleCA9IHN0cmluZy5pbmRleE9mKGMsIHN0cmluZ0luZGV4KVxuICAgICAgICBsZXQgYmVzdCwgdGVtcFxuXG4gICAgICAgIHdoaWxlIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICBwYXR0ZXJuQ2FjaGUucHVzaChpbmRleClcbiAgICAgICAgICAgIHRlbXAgPSB0aGlzLnRyYXZlcnNlKHN0cmluZywgcGF0dGVybiwgaW5kZXggKyAxLCBwYXR0ZXJuSW5kZXggKyAxLCBwYXR0ZXJuQ2FjaGUpXG4gICAgICAgICAgICBwYXR0ZXJuQ2FjaGUucG9wKClcblxuICAgICAgICAgICAgLy8gaWYgZG93bnN0cmVhbSB0cmF2ZXJzYWwgZmFpbGVkLCByZXR1cm4gYmVzdCBhbnN3ZXIgc28gZmFyXG4gICAgICAgICAgICBpZiAoIXRlbXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmVzdFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWJlc3QgfHwgYmVzdC5zY29yZSA8IHRlbXAuc2NvcmUpIHtcbiAgICAgICAgICAgICAgICBiZXN0ID0gdGVtcFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbmRleCA9IHN0cmluZy5pbmRleE9mKGMsIGluZGV4ICsgMSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBiZXN0XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlU2NvcmUocGF0dGVybkNhY2hlKSB7XG4gICAgICAgIGxldCBzY29yZSA9IDBcbiAgICAgICAgbGV0IHRlbXAgPSAxXG5cbiAgICAgICAgcGF0dGVybkNhY2hlLmZvckVhY2goKGluZGV4LCBpKSA9PiB7XG4gICAgICAgICAgICBpZiAoaSA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAocGF0dGVybkNhY2hlW2kgLSAxXSArIDEgPT09IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAgKz0gdGVtcCArIDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAgPSAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY29yZSArPSB0ZW1wXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHNjb3JlXG4gICAgfVxuXG4gICAgcmVuZGVyKHN0cmluZywgaW5kaWNlcywgcHJlLCBwb3N0KSB7XG4gICAgICAgIHZhciByZW5kZXJlZCA9IHN0cmluZy5zdWJzdHJpbmcoMCwgaW5kaWNlc1swXSlcblxuICAgICAgICBpbmRpY2VzLmZvckVhY2goKGluZGV4LCBpKSA9PiB7XG4gICAgICAgICAgICByZW5kZXJlZCArPSBwcmUgKyBzdHJpbmdbaW5kZXhdICsgcG9zdCArXG4gICAgICAgICAgICAgICAgc3RyaW5nLnN1YnN0cmluZyhpbmRleCArIDEsIChpbmRpY2VzW2kgKyAxXSkgPyBpbmRpY2VzW2kgKyAxXSA6IHN0cmluZy5sZW5ndGgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHJlbmRlcmVkXG4gICAgfVxuXG4gICAgZmlsdGVyKHBhdHRlcm4sIGFyciwgb3B0cykge1xuICAgICAgICBvcHRzID0gb3B0cyB8fCB7fVxuICAgICAgICByZXR1cm4gYXJyXG4gICAgICAgICAgICAucmVkdWNlKChwcmV2LCBlbGVtZW50LCBpZHgsIGFycikgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBzdHIgPSBlbGVtZW50XG5cbiAgICAgICAgICAgICAgICBpZiAob3B0cy5leHRyYWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHN0ciA9IG9wdHMuZXh0cmFjdChlbGVtZW50KVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghc3RyKSB7IC8vIHRha2UgY2FyZSBvZiB1bmRlZmluZWRzIC8gbnVsbHMgLyBldGMuXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgPSAnJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IHJlbmRlcmVkID0gdGhpcy5tYXRjaChwYXR0ZXJuLCBzdHIsIG9wdHMpXG5cbiAgICAgICAgICAgICAgICBpZiAocmVuZGVyZWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBwcmV2W3ByZXYubGVuZ3RoXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZzogcmVuZGVyZWQucmVuZGVyZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29yZTogcmVuZGVyZWQuc2NvcmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogaWR4LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBwcmV2XG4gICAgICAgICAgICB9LCBbXSlcblxuICAgICAgICAuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgbGV0IGNvbXBhcmUgPSBiLnNjb3JlIC0gYS5zY29yZVxuICAgICAgICAgICAgaWYgKGNvbXBhcmUpIHJldHVybiBjb21wYXJlXG4gICAgICAgICAgICByZXR1cm4gYS5pbmRleCAtIGIuaW5kZXhcbiAgICAgICAgfSlcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRyaWJ1dGVTZWFyY2g7IiwiLyoqXG4qIFRyaWJ1dGUuanNcbiogTmF0aXZlIEVTNiBKYXZhU2NyaXB0IEBtZW50aW9uIFBsdWdpblxuKiovXG5cbmltcG9ydCBUcmlidXRlIGZyb20gXCIuL1RyaWJ1dGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgVHJpYnV0ZTtcbiIsImlmICghQXJyYXkucHJvdG90eXBlLmZpbmQpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uKHByZWRpY2F0ZSkge1xuICAgICAgICBpZiAodGhpcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkucHJvdG90eXBlLmZpbmQgY2FsbGVkIG9uIG51bGwgb3IgdW5kZWZpbmVkJylcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncHJlZGljYXRlIG11c3QgYmUgYSBmdW5jdGlvbicpXG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxpc3QgPSBPYmplY3QodGhpcylcbiAgICAgICAgdmFyIGxlbmd0aCA9IGxpc3QubGVuZ3RoID4+PiAwXG4gICAgICAgIHZhciB0aGlzQXJnID0gYXJndW1lbnRzWzFdXG4gICAgICAgIHZhciB2YWx1ZVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhbHVlID0gbGlzdFtpXVxuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpLCBsaXN0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG59XG5cbmlmICh3aW5kb3cgJiYgdHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCAhPT0gXCJmdW5jdGlvblwiKSB7XG4gIGZ1bmN0aW9uIEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMpIHtcbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwge1xuICAgICAgYnViYmxlczogZmFsc2UsXG4gICAgICBjYW5jZWxhYmxlOiBmYWxzZSxcbiAgICAgIGRldGFpbDogdW5kZWZpbmVkXG4gICAgfVxuICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKVxuICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbClcbiAgICByZXR1cm4gZXZ0XG4gIH1cblxuIGlmICh0eXBlb2Ygd2luZG93LkV2ZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgQ3VzdG9tRXZlbnQucHJvdG90eXBlID0gd2luZG93LkV2ZW50LnByb3RvdHlwZVxuIH1cblxuICB3aW5kb3cuQ3VzdG9tRXZlbnQgPSBDdXN0b21FdmVudFxufSJdfQ==
