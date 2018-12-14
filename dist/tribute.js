(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Tribute = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
            replaceTextSuffix = _ref$replaceTextSuffi === undefined ? null : _ref$replaceTextSuffi,
            _ref$positionMenu = _ref.positionMenu,
            positionMenu = _ref$positionMenu === undefined ? true : _ref$positionMenu;

        _classCallCheck(this, Tribute);

        this.menuSelected = 0;
        this.current = {};
        this.inputEvent = false;
        this.isActive = false;
        this.menuContainer = menuContainer;
        this.allowSpaces = allowSpaces;
        this.replaceTextSuffix = replaceTextSuffix;
        this.positionMenu = positionMenu;
        this.hasTrailingSpace = false;

        if (values) {
            this.collection = [{
                // symbol that starts the lookup
                trigger: trigger,

                // is it wrapped in an iframe
                iframe: iframe,

                // class applied to selected item
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

                    return noMatchTemplate;
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
                element.tributeMenu = this.menu;
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

                _this2.range.positionMenuAtCaret(scrollTo);

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
            };

            if (typeof this.current.collection.values === 'function') {
                this.current.collection.values(this.current.mentionText, processValues);
            } else {
                processValues(this.current.collection.values);
            }
        }
    }, {
        key: "showMenuForCollection",
        value: function showMenuForCollection(element, collectionIndex) {
            if (element !== document.activeElement) {
                this.placeCaretAtEnd(element);
            }

            this.current.collection = this.collection[collectionIndex || 0];
            this.current.externalTrigger = true;
            this.current.element = element;

            if (element.isContentEditable) this.insertTextAtCursor(this.current.collection.trigger);else this.insertAtCaret(element, this.current.collection.trigger);

            this.showMenuFor(element);
        }

        // TODO: make sure this works for inputs/textareas

    }, {
        key: "placeCaretAtEnd",
        value: function placeCaretAtEnd(el) {
            el.focus();
            if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
                var range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(false);
                textRange.select();
            }
        }

        // for contenteditable

    }, {
        key: "insertTextAtCursor",
        value: function insertTextAtCursor(text) {
            var sel, range, html;
            sel = window.getSelection();
            range = sel.getRangeAt(0);
            range.deleteContents();
            var textNode = document.createTextNode(text);
            range.insertNode(textNode);
            range.selectNodeContents(textNode);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }

        // for regular inputs

    }, {
        key: "insertAtCaret",
        value: function insertAtCaret(textarea, text) {
            var scrollPos = textarea.scrollTop;
            var caretPos = textarea.selectionStart;

            var front = textarea.value.substring(0, caretPos);
            var back = textarea.value.substring(textarea.selectionEnd, textarea.value.length);
            textarea.value = front + text + back;
            caretPos = caretPos + text.length;
            textarea.selectionStart = caretPos;
            textarea.selectionEnd = caretPos;
            textarea.focus();
            textarea.scrollTop = scrollPos;
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
        value: function selectItemAtIndex(index, originalEvent) {
            index = parseInt(index);
            if (typeof index !== 'number') return;
            var item = this.current.filteredItems[index];
            var content = this.current.collection.selectTemplate(item);
            if (content !== null) this.replaceText(content, originalEvent, item);
        }
    }, {
        key: "replaceText",
        value: function replaceText(content, originalEvent, item) {
            this.range.replaceTriggerText(content, true, true, originalEvent, item);
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
    }, {
        key: "detach",
        value: function detach(el) {
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
                    this._detach(el[i]);
                }
            } else {
                this._detach(el);
            }
        }
    }, {
        key: "_detach",
        value: function _detach(el) {
            var _this3 = this;

            this.events.unbind(el);
            if (el.tributeMenu) {
                this.menuEvents.unbind(el.tributeMenu);
            }

            setTimeout(function () {
                el.removeAttribute('data-tribute');
                _this3.isActive = false;
                if (el.tributeMenu) {
                    el.tributeMenu.remove();
                }
            });
        }
    }], [{
        key: "defaultSelectTemplate",
        value: function defaultSelectTemplate(item) {
            if (typeof item === 'undefined') return null;
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
            element.boundKeydown = this.keydown.bind(element, this);
            element.boundKeyup = this.keyup.bind(element, this);
            element.boundInput = this.input.bind(element, this);

            element.addEventListener('keydown', element.boundKeydown, false);
            element.addEventListener('keyup', element.boundKeyup, false);
            element.addEventListener('input', element.boundInput, false);
        }
    }, {
        key: 'unbind',
        value: function unbind(element) {
            element.removeEventListener('keydown', element.boundKeydown, false);
            element.removeEventListener('keyup', element.boundKeyup, false);
            element.removeEventListener('input', element.boundInput, false);

            delete element.boundKeydown;
            delete element.boundKeyup;
            delete element.boundInput;
        }
    }, {
        key: 'keydown',
        value: function keydown(instance, event) {
            if (instance.shouldDeactivate(event)) {
                instance.tribute.isActive = false;
                instance.tribute.hideMenu();
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
                event.preventDefault();
                event.stopPropagation();
                while (li.nodeName.toLowerCase() !== 'li') {
                    li = li.parentNode;
                    if (!li || li === tribute.menu) {
                        throw new Error('cannot find the <li> container for the click');
                    }
                }
                tribute.selectItemAtIndex(li.getAttribute('data-index'), event);
                tribute.hideMenu();

                // TODO: should fire with externalTrigger and target is outside of menu
            } else if (tribute.current.element && !tribute.current.externalTrigger) {
                tribute.current.externalTrigger = false;
                setTimeout(function () {
                    return tribute.hideMenu();
                });
            }
        }
    }, {
        key: 'keyup',
        value: function keyup(instance, event) {
            if (instance.inputEvent) {
                instance.inputEvent = false;
            }
            instance.updateSelection(this);

            if (event.keyCode === 27) return;

            if (!instance.tribute.allowSpaces && instance.tribute.hasTrailingSpace) {
                instance.tribute.hasTrailingSpace = false;
                instance.commandEvent = true;
                instance.callbacks()["space"](event, this);
                return;
            }

            if (!instance.tribute.isActive) {
                var keyCode = instance.getKeyCode(instance, this, event);

                if (isNaN(keyCode) || !keyCode) return;

                var trigger = instance.tribute.triggers().find(function (trigger) {
                    return trigger.charCodeAt(0) === keyCode;
                });

                if (typeof trigger !== 'undefined') {
                    instance.callbacks().triggerChar(event, this, trigger);
                }
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
            var info = tribute.range.getTriggerInfo(false, tribute.hasTrailingSpace, true, tribute.allowSpaces);

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
            var info = this.tribute.range.getTriggerInfo(false, this.tribute.hasTrailingSpace, true, this.tribute.allowSpaces);

            if (info) {
                this.tribute.current.selectedPath = info.mentionSelectedPath;
                this.tribute.current.mentionText = info.mentionText;
                this.tribute.current.selectedOffset = info.mentionSelectedOffset;
            }
        }
    }, {
        key: 'callbacks',
        value: function callbacks() {
            var _this = this;

            return {
                triggerChar: function triggerChar(e, el, trigger) {
                    var tribute = _this.tribute;
                    tribute.current.trigger = trigger;

                    var collectionItem = tribute.collection.find(function (item) {
                        return item.trigger === trigger;
                    });

                    tribute.current.collection = collectionItem;
                    if (tribute.inputEvent) tribute.showMenuFor(el, true);
                },
                enter: function enter(e, el) {
                    // choose selection
                    if (_this.tribute.isActive) {
                        e.preventDefault();
                        e.stopPropagation();
                        setTimeout(function () {
                            _this.tribute.selectItemAtIndex(_this.tribute.menuSelected, e);
                            _this.tribute.hideMenu();
                        }, 0);
                    }
                },
                escape: function escape(e, el) {
                    if (_this.tribute.isActive) {
                        e.preventDefault();
                        e.stopPropagation();
                        _this.tribute.isActive = false;
                        _this.tribute.hideMenu();
                    }
                },
                tab: function tab(e, el) {
                    // choose first match
                    _this.callbacks().enter(e, el);
                },
                space: function space(e, el) {
                    if (_this.tribute.isActive && !_this.tribute.allowSpaces) {
                        e.stopPropagation();
                        setTimeout(function () {
                            _this.tribute.hideMenu();
                            _this.tribute.isActive = false;
                        }, 0);
                    }
                },
                up: function up(e, el) {
                    // navigate up ul
                    if (_this.tribute.isActive) {
                        e.preventDefault();
                        e.stopPropagation();
                        var count = _this.tribute.current.filteredItems.length,
                            selected = _this.tribute.menuSelected;

                        if (count > selected && selected > 0) {
                            _this.tribute.menuSelected--;
                            _this.setActiveLi();
                        } else if (selected === 0) {
                            _this.tribute.menuSelected = count - 1;
                            _this.setActiveLi();
                            _this.tribute.menu.scrollTop = _this.tribute.menu.scrollHeight;
                        }
                    }
                },
                down: function down(e, el) {
                    // navigate down ul
                    if (_this.tribute.isActive) {
                        e.preventDefault();
                        e.stopPropagation();
                        var count = _this.tribute.current.filteredItems.length - 1,
                            selected = _this.tribute.menuSelected;

                        if (count > selected) {
                            _this.tribute.menuSelected++;
                            _this.setActiveLi();
                        } else if (count === selected) {
                            _this.tribute.menuSelected = 0;
                            _this.setActiveLi();
                            _this.tribute.menu.scrollTop = 0;
                        }
                    }
                },
                delete: function _delete(e, el) {
                    if (_this.tribute.isActive && _this.tribute.current.mentionText.length < 1) {
                        _this.tribute.hideMenu();
                    } else if (_this.tribute.isActive) {
                        _this.tribute.showMenuFor(el);
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

            menu.menuKeydownEvent = this.tribute.events.keydown.bind(this.menu, this);
            this.menuClickEvent = this.tribute.events.click.bind(null, this);
            this.menuContainerScrollEvent = this.debounce(function () {
                if (_this.tribute.isActive) {
                    _this.tribute.showMenuFor(_this.tribute.current.element, false);
                }
            }, 300, false);
            this.windowResizeEvent = this.debounce(function () {
                if (_this.tribute.isActive) {
                    _this.tribute.range.positionMenuAtCaret(true);
                }
            }, 300, false);

            // fixes IE11 issues with mouseup
            this.tribute.range.getDocument().addEventListener('MSPointerUp', this.menuClickEvent, false);
            menu.addEventListener('keydown', this.menuKeydownEvent, false);
            this.tribute.range.getDocument().addEventListener('mouseup', this.menuClickEvent, false);
            window.addEventListener('resize', this.windowResizeEvent);

            if (this.menuContainer) {
                this.menuContainer.addEventListener('scroll', this.menuContainerScrollEvent, false);
            } else {
                window.addEventListener('scroll', this.menuContainerScrollEvent);
            }
        }
    }, {
        key: 'unbind',
        value: function unbind(menu) {
            menu.removeEventListener('keydown', menu.menuKeydownEvent, false);
            delete menu.menuKeydownEvent;
            this.tribute.range.getDocument().removeEventListener('mouseup', this.menuClickEvent, false);
            this.tribute.range.getDocument().removeEventListener('MSPointerUp', this.menuClickEvent, false);
            window.removeEventListener('resize', this.windowResizeEvent);

            if (this.menuContainer) {
                this.menuContainer.removeEventListener('scroll', this.menuContainerScrollEvent, false);
            } else {
                window.removeEventListener('scroll', this.menuContainerScrollEvent);
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

            var info = this.getTriggerInfo(false, this.tribute.hasTrailingSpace, true, this.tribute.allowSpaces);

            if (typeof info !== 'undefined') {

                if (!this.tribute.positionMenu) {
                    this.tribute.menu.style.cssText = 'display: block;';
                    return;
                }

                if (!this.isContentEditable(context.element)) {
                    coordinates = this.getTextAreaOrInputUnderlinePosition(this.tribute.current.element, info.mentionPosition);
                } else {
                    coordinates = this.getContentEditableCaretPosition(info.mentionPosition);
                }

                this.tribute.menu.style.cssText = 'top: ' + coordinates.top + 'px;\n                                     left: ' + coordinates.left + 'px;\n                                     right: ' + coordinates.right + 'px;\n                                     bottom: ' + coordinates.bottom + 'px;\n                                     position: absolute;\n                                     zIndex: 10000;\n                                     display: block;';

                if (coordinates.left === 'auto') {
                    this.tribute.menu.style.left = 'auto';
                }

                if (coordinates.top === 'auto') {
                    this.tribute.menu.style.top = 'auto';
                }

                if (scrollTo) this.scrollIntoView();

                window.setTimeout(function () {
                    var menuDimensions = {
                        width: _this.tribute.menu.offsetWidth,
                        height: _this.tribute.menu.offsetHeight
                    };
                    var menuIsOffScreen = _this.isMenuOffScreen(coordinates, menuDimensions);

                    var menuIsOffScreenHorizontally = window.innerWidth > menuDimensions.width && (menuIsOffScreen.left || menuIsOffScreen.right);
                    var menuIsOffScreenVertically = window.innerHeight > menuDimensions.height && (menuIsOffScreen.top || menuIsOffScreen.bottom);
                    if (menuIsOffScreenHorizontally || menuIsOffScreenVertically) {
                        _this.tribute.menu.style.cssText = 'display: none';
                        _this.positionMenuAtCaret(scrollTo);
                    }
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
                if (targetElement !== this.tribute.current.element) {
                    targetElement.focus();
                }
            } else {
                this.selectElement(targetElement, path, offset);
            }
        }
    }, {
        key: 'replaceTriggerText',
        value: function replaceTriggerText(text, requireLeadingSpace, hasTrailingSpace, originalEvent, item) {
            var context = this.tribute.current;
            this.resetSelection(context.element, context.selectedPath, context.selectedOffset);

            var info = this.getTriggerInfo(true, hasTrailingSpace, requireLeadingSpace, this.tribute.allowSpaces);

            // Create the event
            var replaceEvent = new CustomEvent('tribute-replaced', {
                detail: {
                    item: item,
                    event: originalEvent
                }
            });

            if (info !== undefined) {
                if (!this.isContentEditable(context.element)) {
                    var myField = this.tribute.current.element;
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
        value: function getContentEditableSelectedPath(ctx) {
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
                var textComponent = this.tribute.current.element;
                if (textComponent) {
                    var startPos = textComponent.selectionStart;
                    if (textComponent.value && startPos >= 0) {
                        text = textComponent.value.substring(0, startPos);
                    }
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
                selected = this.tribute.current.element;
            } else {
                var selectionInfo = this.getContentEditableSelectedPath(ctx);

                if (selectionInfo) {
                    selected = selectionInfo.selected;
                    path = selectionInfo.path;
                    offset = selectionInfo.offset;
                }
            }

            var effectiveRange = this.getTextPrecedingCurrentSelection();

            if (effectiveRange !== undefined && effectiveRange !== null) {
                var mostRecentTriggerCharPos = -1;
                var triggerChar = void 0;

                this.tribute.collection.forEach(function (config) {
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

                    this.tribute.hasTrailingSpace = regex.test(currentTriggerSnippet);

                    if (!leadingSpace && (menuAlreadyActive || !regex.test(currentTriggerSnippet))) {
                        return {
                            mentionPosition: mostRecentTriggerCharPos,
                            mentionText: currentTriggerSnippet,
                            mentionSelectedElement: selected,
                            mentionSelectedPath: path,
                            mentionSelectedOffset: offset,
                            mentionTriggerChar: triggerChar
                        };
                    }
                }
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
        key: 'isMenuOffScreen',
        value: function isMenuOffScreen(coordinates, menuDimensions) {
            var menuTop = typeof coordinates.top === 'number' ? coordinates.top : coordinates.bottom - menuDimensions.height;
            var menuRight = typeof coordinates.right === 'number' ? coordinates.right : coordinates.left + menuDimensions.width;
            var menuBottom = typeof coordinates.bottom === 'number' ? coordinates.bottom : coordinates.top + menuDimensions.height;
            var menuLeft = typeof coordinates.left === 'number' ? coordinates.left : coordinates.right - menuDimensions.width;

            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            var doc = document.documentElement;
            var windowLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
            var windowTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

            return {
                top: menuTop < Math.floor(windowTop),
                right: menuRight > Math.ceil(windowLeft + windowWidth),
                bottom: menuBottom > Math.ceil(windowTop + windowHeight),
                left: menuLeft < Math.floor(windowLeft)
            };
        }
    }, {
        key: 'getMenuDimensions',
        value: function getMenuDimensions() {
            // Width of the menu depends of its contents and position
            // We must check what its width would be without any obstruction
            // This way, we can achieve good positioning for flipping the menu
            var dimensions = {
                width: null,
                height: null
            };

            this.tribute.menu.style.cssText = 'top: 0px;\n                                 left: 0px;\n                                 position: fixed;\n                                 zIndex: 10000;\n                                 display: block;\n                                 visibility; hidden;';
            dimensions.width = this.tribute.menu.offsetWidth;
            dimensions.height = this.tribute.menu.offsetHeight;

            this.tribute.menu.style.cssText = 'display: none;';

            return dimensions;
        }
    }, {
        key: 'getTextAreaOrInputUnderlinePosition',
        value: function getTextAreaOrInputUnderlinePosition(element, position, flipped) {
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

            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;

            var menuDimensions = this.getMenuDimensions();
            var menuIsOffScreen = this.isMenuOffScreen(coordinates, menuDimensions);

            if (menuIsOffScreen.horizontally) {
                coordinates.right = windowWidth - coordinates.left;
                coordinates.left = 'auto';
            }

            var parentHeight = this.tribute.menuContainer ? this.tribute.menuContainer.offsetHeight : this.getDocument().body.offsetHeight;

            if (menuIsOffScreen.vertically) {
                var parentRect = this.tribute.menuContainer ? this.tribute.menuContainer.getBoundingClientRect() : this.getDocument().body.getBoundingClientRect();
                var scrollStillAvailable = parentHeight - (windowHeight - parentRect.top);

                coordinates.bottom = scrollStillAvailable + (windowHeight - rect.top - span.offsetTop);
                coordinates.top = 'auto';
            }

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
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;

            var menuDimensions = this.getMenuDimensions();
            var menuIsOffScreen = this.isMenuOffScreen(coordinates, menuDimensions);

            if (menuIsOffScreen.right) {
                coordinates.left = 'auto';
                coordinates.right = windowWidth - rect.left - windowLeft;
            }

            var parentRect = this.tribute.menuContainer ? this.tribute.menuContainer.getBoundingClientRect() : this.getDocument().body.getBoundingClientRect();
            var parentHeight = this.tribute.menuContainer ? this.tribute.menuContainer.offsetHeight : this.getDocument().body.offsetHeight;

            if (menuIsOffScreen.bottom) {
                var scrollStillAvailable = parentHeight - (windowHeight - parentRect.top);

                windowLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
                windowTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
                coordinates.top = 'auto';
                coordinates.bottom = scrollStillAvailable + (windowHeight - rect.top);
            }

            menuIsOffScreen = this.isMenuOffScreen(coordinates, menuDimensions);
            if (menuIsOffScreen.left) {
                if (windowWidth > menuDimensions.width) {
                    coordinates.left = 'auto';
                    coordinates.right = parentRect.right - windowLeft - windowWidth;
                } else {
                    coordinates.left = windowLeft;
                    delete coordinates.right;
                }
            }
            if (menuIsOffScreen.top) {
                if (windowHeight > menuDimensions.height) {
                    coordinates.top = 'auto';
                    coordinates.bottom = parentRect.bottom - windowTop - windowHeight;
                } else {
                    coordinates.top = windowTop;
                    delete coordinates.bottom;
                }
            }

            markerEl.parentNode.removeChild(markerEl);
            return coordinates;
        }
    }, {
        key: 'scrollIntoView',
        value: function scrollIntoView(elem) {
            var reasonableBuffer = 20,
                clientRect = void 0;
            var maxScrollDisplacement = 100;
            var e = this.menu;

            if (typeof e === 'undefined') return;

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

                // calculate score and copy the cache containing the indices where it's found
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvVHJpYnV0ZS5qcyIsInNyYy9UcmlidXRlRXZlbnRzLmpzIiwic3JjL1RyaWJ1dGVNZW51RXZlbnRzLmpzIiwic3JjL1RyaWJ1dGVSYW5nZS5qcyIsInNyYy9UcmlidXRlU2VhcmNoLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztJQUVNLE87QUFDRiwyQkFnQkc7QUFBQTs7QUFBQSwrQkFmQyxNQWVEO0FBQUEsWUFmQyxNQWVELCtCQWZVLElBZVY7QUFBQSwrQkFkQyxNQWNEO0FBQUEsWUFkQyxNQWNELCtCQWRVLElBY1Y7QUFBQSxvQ0FiQyxXQWFEO0FBQUEsWUFiQyxXQWFELG9DQWJlLFdBYWY7QUFBQSxnQ0FaQyxPQVlEO0FBQUEsWUFaQyxPQVlELGdDQVpXLEdBWVg7QUFBQSx1Q0FYQyxjQVdEO0FBQUEsWUFYQyxjQVdELHVDQVhrQixJQVdsQjtBQUFBLHlDQVZDLGdCQVVEO0FBQUEsWUFWQyxnQkFVRCx5Q0FWb0IsSUFVcEI7QUFBQSwrQkFUQyxNQVNEO0FBQUEsWUFUQyxNQVNELCtCQVRVLEtBU1Y7QUFBQSxpQ0FSQyxRQVFEO0FBQUEsWUFSQyxRQVFELGlDQVJZLE9BUVo7QUFBQSxtQ0FQQyxVQU9EO0FBQUEsWUFQQyxVQU9ELG1DQVBjLElBT2Q7QUFBQSxzQ0FOQyxhQU1EO0FBQUEsWUFOQyxhQU1ELHNDQU5pQixJQU1qQjtBQUFBLHdDQUxDLGVBS0Q7QUFBQSxZQUxDLGVBS0Qsd0NBTG1CLElBS25CO0FBQUEseUNBSkMsbUJBSUQ7QUFBQSxZQUpDLG1CQUlELHlDQUp1QixJQUl2QjtBQUFBLG9DQUhDLFdBR0Q7QUFBQSxZQUhDLFdBR0Qsb0NBSGUsS0FHZjtBQUFBLHlDQUZDLGlCQUVEO0FBQUEsWUFGQyxp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QUNELEtBVnFEOztBQVl2RCxRQUFJLE9BQU8sT0FBTyxLQUFkLEtBQXdCLFdBQTVCLEVBQXlDO0FBQ3ZDLG9CQUFZLFNBQVosR0FBd0IsT0FBTyxLQUFQLENBQWEsU0FBckM7QUFDRDs7QUFFQSxXQUFPLFdBQVAsR0FBcUIsV0FBckI7QUFDRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBUcmlidXRlVXRpbHMgZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBUcmlidXRlRXZlbnRzIGZyb20gXCIuL1RyaWJ1dGVFdmVudHNcIjtcbmltcG9ydCBUcmlidXRlTWVudUV2ZW50cyBmcm9tIFwiLi9UcmlidXRlTWVudUV2ZW50c1wiO1xuaW1wb3J0IFRyaWJ1dGVSYW5nZSBmcm9tIFwiLi9UcmlidXRlUmFuZ2VcIjtcbmltcG9ydCBUcmlidXRlU2VhcmNoIGZyb20gXCIuL1RyaWJ1dGVTZWFyY2hcIjtcblxuY2xhc3MgVHJpYnV0ZSB7XG4gICAgY29uc3RydWN0b3Ioe1xuICAgICAgICB2YWx1ZXMgPSBudWxsLFxuICAgICAgICBpZnJhbWUgPSBudWxsLFxuICAgICAgICBzZWxlY3RDbGFzcyA9ICdoaWdobGlnaHQnLFxuICAgICAgICB0cmlnZ2VyID0gJ0AnLFxuICAgICAgICBzZWxlY3RUZW1wbGF0ZSA9IG51bGwsXG4gICAgICAgIG1lbnVJdGVtVGVtcGxhdGUgPSBudWxsLFxuICAgICAgICBsb29rdXAgPSAna2V5JyxcbiAgICAgICAgZmlsbEF0dHIgPSAndmFsdWUnLFxuICAgICAgICBjb2xsZWN0aW9uID0gbnVsbCxcbiAgICAgICAgbWVudUNvbnRhaW5lciA9IG51bGwsXG4gICAgICAgIG5vTWF0Y2hUZW1wbGF0ZSA9IG51bGwsXG4gICAgICAgIHJlcXVpcmVMZWFkaW5nU3BhY2UgPSB0cnVlLFxuICAgICAgICBhbGxvd1NwYWNlcyA9IGZhbHNlLFxuICAgICAgICByZXBsYWNlVGV4dFN1ZmZpeCA9IG51bGwsXG4gICAgICAgIHBvc2l0aW9uTWVudSA9IHRydWUsXG4gICAgfSkge1xuXG4gICAgICAgIHRoaXMubWVudVNlbGVjdGVkID0gMFxuICAgICAgICB0aGlzLmN1cnJlbnQgPSB7fVxuICAgICAgICB0aGlzLmlucHV0RXZlbnQgPSBmYWxzZVxuICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2VcbiAgICAgICAgdGhpcy5tZW51Q29udGFpbmVyID0gbWVudUNvbnRhaW5lclxuICAgICAgICB0aGlzLmFsbG93U3BhY2VzID0gYWxsb3dTcGFjZXNcbiAgICAgICAgdGhpcy5yZXBsYWNlVGV4dFN1ZmZpeCA9IHJlcGxhY2VUZXh0U3VmZml4XG4gICAgICAgIHRoaXMucG9zaXRpb25NZW51ID0gcG9zaXRpb25NZW51XG4gICAgICAgIHRoaXMuaGFzVHJhaWxpbmdTcGFjZSA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgICAgIHRoaXMuY29sbGVjdGlvbiA9IFt7XG4gICAgICAgICAgICAgICAgLy8gc3ltYm9sIHRoYXQgc3RhcnRzIHRoZSBsb29rdXBcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiB0cmlnZ2VyLFxuXG4gICAgICAgICAgICAgICAgLy8gaXMgaXQgd3JhcHBlZCBpbiBhbiBpZnJhbWVcbiAgICAgICAgICAgICAgICBpZnJhbWU6IGlmcmFtZSxcblxuICAgICAgICAgICAgICAgIC8vIGNsYXNzIGFwcGxpZWQgdG8gc2VsZWN0ZWQgaXRlbVxuICAgICAgICAgICAgICAgIHNlbGVjdENsYXNzOiBzZWxlY3RDbGFzcyxcblxuICAgICAgICAgICAgICAgIC8vIGZ1bmN0aW9uIGNhbGxlZCBvbiBzZWxlY3QgdGhhdCByZXR1bnMgdGhlIGNvbnRlbnQgdG8gaW5zZXJ0XG4gICAgICAgICAgICAgICAgc2VsZWN0VGVtcGxhdGU6IChzZWxlY3RUZW1wbGF0ZSB8fCBUcmlidXRlLmRlZmF1bHRTZWxlY3RUZW1wbGF0ZSkuYmluZCh0aGlzKSxcblxuICAgICAgICAgICAgICAgIC8vIGZ1bmN0aW9uIGNhbGxlZCB0aGF0IHJldHVybnMgY29udGVudCBmb3IgYW4gaXRlbVxuICAgICAgICAgICAgICAgIG1lbnVJdGVtVGVtcGxhdGU6IChtZW51SXRlbVRlbXBsYXRlIHx8IFRyaWJ1dGUuZGVmYXVsdE1lbnVJdGVtVGVtcGxhdGUpLmJpbmQodGhpcyksXG5cbiAgICAgICAgICAgICAgICAvLyBmdW5jdGlvbiBjYWxsZWQgd2hlbiBtZW51IGlzIGVtcHR5LCBkaXNhYmxlcyBoaWRpbmcgb2YgbWVudS5cbiAgICAgICAgICAgICAgICBub01hdGNoVGVtcGxhdGU6ICh0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdC5iaW5kKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9NYXRjaFRlbXBsYXRlXG4gICAgICAgICAgICAgICAgfSkobm9NYXRjaFRlbXBsYXRlKSxcblxuICAgICAgICAgICAgICAgIC8vIGNvbHVtbiB0byBzZWFyY2ggYWdhaW5zdCBpbiB0aGUgb2JqZWN0XG4gICAgICAgICAgICAgICAgbG9va3VwOiBsb29rdXAsXG5cbiAgICAgICAgICAgICAgICAvLyBjb2x1bW4gdGhhdCBjb250YWlucyB0aGUgY29udGVudCB0byBpbnNlcnQgYnkgZGVmYXVsdFxuICAgICAgICAgICAgICAgIGZpbGxBdHRyOiBmaWxsQXR0cixcblxuICAgICAgICAgICAgICAgIC8vIGFycmF5IG9mIG9iamVjdHMgb3IgYSBmdW5jdGlvbiByZXR1cm5pbmcgYW4gYXJyYXkgb2Ygb2JqZWN0c1xuICAgICAgICAgICAgICAgIHZhbHVlczogdmFsdWVzLFxuXG4gICAgICAgICAgICAgICAgcmVxdWlyZUxlYWRpbmdTcGFjZTogcmVxdWlyZUxlYWRpbmdTcGFjZSxcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5jb2xsZWN0aW9uID0gY29sbGVjdGlvbi5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcjogaXRlbS50cmlnZ2VyIHx8IHRyaWdnZXIsXG4gICAgICAgICAgICAgICAgICAgIGlmcmFtZTogaXRlbS5pZnJhbWUgfHwgaWZyYW1lLFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RDbGFzczogaXRlbS5zZWxlY3RDbGFzcyB8fCBzZWxlY3RDbGFzcyxcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0VGVtcGxhdGU6IChpdGVtLnNlbGVjdFRlbXBsYXRlIHx8IFRyaWJ1dGUuZGVmYXVsdFNlbGVjdFRlbXBsYXRlKS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBtZW51SXRlbVRlbXBsYXRlOiAoaXRlbS5tZW51SXRlbVRlbXBsYXRlIHx8IFRyaWJ1dGUuZGVmYXVsdE1lbnVJdGVtVGVtcGxhdGUpLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIC8vIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIG1lbnUgaXMgZW1wdHksIGRpc2FibGVzIGhpZGluZyBvZiBtZW51LlxuICAgICAgICAgICAgICAgICAgICBub01hdGNoVGVtcGxhdGU6ICh0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0LmJpbmQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSkobm9NYXRjaFRlbXBsYXRlKSxcbiAgICAgICAgICAgICAgICAgICAgbG9va3VwOiBpdGVtLmxvb2t1cCB8fCBsb29rdXAsXG4gICAgICAgICAgICAgICAgICAgIGZpbGxBdHRyOiBpdGVtLmZpbGxBdHRyIHx8IGZpbGxBdHRyLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IGl0ZW0udmFsdWVzLFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlTGVhZGluZ1NwYWNlOiBpdGVtLnJlcXVpcmVMZWFkaW5nU3BhY2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbVHJpYnV0ZV0gTm8gY29sbGVjdGlvbiBzcGVjaWZpZWQuJylcbiAgICAgICAgfVxuXG4gICAgICAgIG5ldyBUcmlidXRlUmFuZ2UodGhpcylcbiAgICAgICAgbmV3IFRyaWJ1dGVFdmVudHModGhpcylcbiAgICAgICAgbmV3IFRyaWJ1dGVNZW51RXZlbnRzKHRoaXMpXG4gICAgICAgIG5ldyBUcmlidXRlU2VhcmNoKHRoaXMpXG4gICAgfVxuXG4gICAgc3RhdGljIGRlZmF1bHRTZWxlY3RUZW1wbGF0ZShpdGVtKSB7XG4gICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICd1bmRlZmluZWQnKSByZXR1cm4gbnVsbDtcbiAgICAgIGlmICh0aGlzLnJhbmdlLmlzQ29udGVudEVkaXRhYmxlKHRoaXMuY3VycmVudC5lbGVtZW50KSkge1xuICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJ0cmlidXRlLW1lbnRpb25cIj4nICsgKHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLnRyaWdnZXIgKyBpdGVtLm9yaWdpbmFsW3RoaXMuY3VycmVudC5jb2xsZWN0aW9uLmZpbGxBdHRyXSkgKyAnPC9zcGFuPic7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi50cmlnZ2VyICsgaXRlbS5vcmlnaW5hbFt0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5maWxsQXR0cl07XG4gICAgfVxuXG4gICAgc3RhdGljIGRlZmF1bHRNZW51SXRlbVRlbXBsYXRlKG1hdGNoSXRlbSkge1xuICAgICAgICByZXR1cm4gbWF0Y2hJdGVtLnN0cmluZ1xuICAgIH1cblxuICAgIHN0YXRpYyBpbnB1dFR5cGVzKCkge1xuICAgICAgICByZXR1cm4gWydURVhUQVJFQScsICdJTlBVVCddXG4gICAgfVxuXG4gICAgdHJpZ2dlcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24ubWFwKGNvbmZpZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlnLnRyaWdnZXJcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhdHRhY2goZWwpIHtcbiAgICAgICAgaWYgKCFlbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbVHJpYnV0ZV0gTXVzdCBwYXNzIGluIGEgRE9NIG5vZGUgb3IgTm9kZUxpc3QuJylcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGlmIGl0IGlzIGEgalF1ZXJ5IGNvbGxlY3Rpb25cbiAgICAgICAgaWYgKHR5cGVvZiBqUXVlcnkgIT09ICd1bmRlZmluZWQnICYmIGVsIGluc3RhbmNlb2YgalF1ZXJ5KSB7XG4gICAgICAgICAgICBlbCA9IGVsLmdldCgpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBJcyBlbCBhbiBBcnJheS9BcnJheS1saWtlIG9iamVjdD9cbiAgICAgICAgaWYgKGVsLmNvbnN0cnVjdG9yID09PSBOb2RlTGlzdCB8fCBlbC5jb25zdHJ1Y3RvciA9PT0gSFRNTENvbGxlY3Rpb24gfHwgZWwuY29uc3RydWN0b3IgPT09IEFycmF5KSB7XG4gICAgICAgICAgICBsZXQgbGVuZ3RoID0gZWwubGVuZ3RoXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXR0YWNoKGVsW2ldKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fYXR0YWNoKGVsKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2F0dGFjaChlbCkge1xuICAgICAgICBpZiAoZWwuaGFzQXR0cmlidXRlKCdkYXRhLXRyaWJ1dGUnKSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdUcmlidXRlIHdhcyBhbHJlYWR5IGJvdW5kIHRvICcgKyBlbC5ub2RlTmFtZSlcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZW5zdXJlRWRpdGFibGUoZWwpXG4gICAgICAgIHRoaXMuZXZlbnRzLmJpbmQoZWwpXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS10cmlidXRlJywgdHJ1ZSlcbiAgICB9XG5cbiAgICBlbnN1cmVFZGl0YWJsZShlbGVtZW50KSB7XG4gICAgICAgIGlmIChUcmlidXRlLmlucHV0VHlwZXMoKS5pbmRleE9mKGVsZW1lbnQubm9kZU5hbWUpID09PSAtMSkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuY29udGVudEVkaXRhYmxlKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5jb250ZW50RWRpdGFibGUgPSB0cnVlXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignW1RyaWJ1dGVdIENhbm5vdCBiaW5kIHRvICcgKyBlbGVtZW50Lm5vZGVOYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlTWVudSgpIHtcbiAgICAgICAgbGV0IHdyYXBwZXIgPSB0aGlzLnJhbmdlLmdldERvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgICB1bCA9IHRoaXMucmFuZ2UuZ2V0RG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCd1bCcpXG5cbiAgICAgICAgd3JhcHBlci5jbGFzc05hbWUgPSAndHJpYnV0ZS1jb250YWluZXInXG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodWwpXG5cbiAgICAgICAgaWYgKHRoaXMubWVudUNvbnRhaW5lcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWVudUNvbnRhaW5lci5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmFuZ2UuZ2V0RG9jdW1lbnQoKS5ib2R5LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gICAgfVxuXG4gICAgc2hvd01lbnVGb3IoZWxlbWVudCwgc2Nyb2xsVG8pIHtcbiAgICAgICAgLy8gT25seSBwcm9jZWVkIGlmIG1lbnUgaXNuJ3QgYWxyZWFkeSBzaG93biBmb3IgdGhlIGN1cnJlbnQgZWxlbWVudCAmIG1lbnRpb25UZXh0XG4gICAgICAgIGlmICh0aGlzLmlzQWN0aXZlICYmIHRoaXMuY3VycmVudC5lbGVtZW50ID09PSBlbGVtZW50ICYmIHRoaXMuY3VycmVudC5tZW50aW9uVGV4dCA9PT0gdGhpcy5jdXJyZW50TWVudGlvblRleHRTbmFwc2hvdCkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3VycmVudE1lbnRpb25UZXh0U25hcHNob3QgPSB0aGlzLmN1cnJlbnQubWVudGlvblRleHRcblxuICAgICAgICAvLyBjcmVhdGUgdGhlIG1lbnUgaWYgaXQgZG9lc24ndCBleGlzdC5cbiAgICAgICAgaWYgKCF0aGlzLm1lbnUpIHtcbiAgICAgICAgICAgIHRoaXMubWVudSA9IHRoaXMuY3JlYXRlTWVudSgpXG4gICAgICAgICAgICBlbGVtZW50LnRyaWJ1dGVNZW51ID0gdGhpcy5tZW51XG4gICAgICAgICAgICB0aGlzLm1lbnVFdmVudHMuYmluZCh0aGlzLm1lbnUpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZVxuICAgICAgICB0aGlzLm1lbnVTZWxlY3RlZCA9IDBcblxuICAgICAgICBpZiAoIXRoaXMuY3VycmVudC5tZW50aW9uVGV4dCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Lm1lbnRpb25UZXh0ID0gJydcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb2Nlc3NWYWx1ZXMgPSAodmFsdWVzKSA9PiB7XG4gICAgICAgICAgICAvLyBUcmlidXRlIG1heSBub3QgYmUgYWN0aXZlIGFueSBtb3JlIGJ5IHRoZSB0aW1lIHRoZSB2YWx1ZSBjYWxsYmFjayByZXR1cm5zXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGl0ZW1zID0gdGhpcy5zZWFyY2guZmlsdGVyKHRoaXMuY3VycmVudC5tZW50aW9uVGV4dCwgdmFsdWVzLCB7XG4gICAgICAgICAgICAgICAgcHJlOiAnPHNwYW4+JyxcbiAgICAgICAgICAgICAgICBwb3N0OiAnPC9zcGFuPicsXG4gICAgICAgICAgICAgICAgZXh0cmFjdDogKGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24ubG9va3VwID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsW3RoaXMuY3VycmVudC5jb2xsZWN0aW9uLmxvb2t1cF1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24ubG9va3VwID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24ubG9va3VwKGVsKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGxvb2t1cCBhdHRyaWJ1dGUsIGxvb2t1cCBtdXN0IGJlIHN0cmluZyBvciBmdW5jdGlvbi4nKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50LmZpbHRlcmVkSXRlbXMgPSBpdGVtc1xuXG5cbiAgICAgICAgICAgIGxldCB1bCA9IHRoaXMubWVudS5xdWVyeVNlbGVjdG9yKCd1bCcpXG5cbiAgICAgICAgICAgIHRoaXMucmFuZ2UucG9zaXRpb25NZW51QXRDYXJldChzY3JvbGxUbylcblxuICAgICAgICAgICAgaWYgKCFpdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsZXQgbm9NYXRjaEV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCd0cmlidXRlLW5vLW1hdGNoJywgeyBkZXRhaWw6IHRoaXMubWVudSB9KVxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudC5lbGVtZW50LmRpc3BhdGNoRXZlbnQobm9NYXRjaEV2ZW50KVxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24ubm9NYXRjaFRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZU1lbnUoKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHVsLmlubmVySFRNTCA9IHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLm5vTWF0Y2hUZW1wbGF0ZSgpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHVsLmlubmVySFRNTCA9ICcnXG5cbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGxpID0gdGhpcy5yYW5nZS5nZXREb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2xpJylcbiAgICAgICAgICAgICAgICBsaS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnLCBpbmRleClcbiAgICAgICAgICAgICAgICBsaS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgIGxldCBsaSA9IGUudGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gbGkuZ2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JylcbiAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNldEFjdGl2ZUxpKGluZGV4KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWVudVNlbGVjdGVkID09PSBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBsaS5jbGFzc05hbWUgPSB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5zZWxlY3RDbGFzc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsaS5pbm5lckhUTUwgPSB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5tZW51SXRlbVRlbXBsYXRlKGl0ZW0pXG4gICAgICAgICAgICAgICAgdWwuYXBwZW5kQ2hpbGQobGkpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi52YWx1ZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLnZhbHVlcyh0aGlzLmN1cnJlbnQubWVudGlvblRleHQsIHByb2Nlc3NWYWx1ZXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9jZXNzVmFsdWVzKHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLnZhbHVlcylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3dNZW51Rm9yQ29sbGVjdGlvbihlbGVtZW50LCBjb2xsZWN0aW9uSW5kZXgpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgIT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGxhY2VDYXJldEF0RW5kKGVsZW1lbnQpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbltjb2xsZWN0aW9uSW5kZXggfHwgMF1cbiAgICAgICAgdGhpcy5jdXJyZW50LmV4dGVybmFsVHJpZ2dlciA9IHRydWVcbiAgICAgICAgdGhpcy5jdXJyZW50LmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgICAgaWYgKGVsZW1lbnQuaXNDb250ZW50RWRpdGFibGUpXG4gICAgICAgICAgICB0aGlzLmluc2VydFRleHRBdEN1cnNvcih0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi50cmlnZ2VyKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLmluc2VydEF0Q2FyZXQoZWxlbWVudCwgdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24udHJpZ2dlcilcblxuICAgICAgICB0aGlzLnNob3dNZW51Rm9yKGVsZW1lbnQpXG4gICAgfVxuXG4gICAgLy8gVE9ETzogbWFrZSBzdXJlIHRoaXMgd29ya3MgZm9yIGlucHV0cy90ZXh0YXJlYXNcbiAgICBwbGFjZUNhcmV0QXRFbmQoZWwpIHtcbiAgICAgICAgZWwuZm9jdXMoKTtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuZ2V0U2VsZWN0aW9uICE9IFwidW5kZWZpbmVkXCJcbiAgICAgICAgICAgICAgICAmJiB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlUmFuZ2UgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdmFyIHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgICAgIHJhbmdlLnNlbGVjdE5vZGVDb250ZW50cyhlbCk7XG4gICAgICAgICAgICByYW5nZS5jb2xsYXBzZShmYWxzZSk7XG4gICAgICAgICAgICB2YXIgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgICAgICAgc2VsLmFkZFJhbmdlKHJhbmdlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQuYm9keS5jcmVhdGVUZXh0UmFuZ2UgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdmFyIHRleHRSYW5nZSA9IGRvY3VtZW50LmJvZHkuY3JlYXRlVGV4dFJhbmdlKCk7XG4gICAgICAgICAgICB0ZXh0UmFuZ2UubW92ZVRvRWxlbWVudFRleHQoZWwpO1xuICAgICAgICAgICAgdGV4dFJhbmdlLmNvbGxhcHNlKGZhbHNlKTtcbiAgICAgICAgICAgIHRleHRSYW5nZS5zZWxlY3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZvciBjb250ZW50ZWRpdGFibGVcbiAgICBpbnNlcnRUZXh0QXRDdXJzb3IodGV4dCkge1xuICAgICAgICB2YXIgc2VsLCByYW5nZSwgaHRtbDtcbiAgICAgICAgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgICByYW5nZSA9IHNlbC5nZXRSYW5nZUF0KDApO1xuICAgICAgICByYW5nZS5kZWxldGVDb250ZW50cygpO1xuICAgICAgICB2YXIgdGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KTtcbiAgICAgICAgcmFuZ2UuaW5zZXJ0Tm9kZSh0ZXh0Tm9kZSk7XG4gICAgICAgIHJhbmdlLnNlbGVjdE5vZGVDb250ZW50cyh0ZXh0Tm9kZSlcbiAgICAgICAgcmFuZ2UuY29sbGFwc2UoZmFsc2UpXG4gICAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKVxuICAgICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpXG4gICAgfVxuXG4gICAgLy8gZm9yIHJlZ3VsYXIgaW5wdXRzXG4gICAgaW5zZXJ0QXRDYXJldCh0ZXh0YXJlYSwgdGV4dCkge1xuICAgICAgICB2YXIgc2Nyb2xsUG9zID0gdGV4dGFyZWEuc2Nyb2xsVG9wO1xuICAgICAgICB2YXIgY2FyZXRQb3MgPSB0ZXh0YXJlYS5zZWxlY3Rpb25TdGFydDtcblxuICAgICAgICB2YXIgZnJvbnQgPSAodGV4dGFyZWEudmFsdWUpLnN1YnN0cmluZygwLCBjYXJldFBvcyk7XG4gICAgICAgIHZhciBiYWNrID0gKHRleHRhcmVhLnZhbHVlKS5zdWJzdHJpbmcodGV4dGFyZWEuc2VsZWN0aW9uRW5kLCB0ZXh0YXJlYS52YWx1ZS5sZW5ndGgpO1xuICAgICAgICB0ZXh0YXJlYS52YWx1ZSA9IGZyb250ICsgdGV4dCArIGJhY2s7XG4gICAgICAgIGNhcmV0UG9zID0gY2FyZXRQb3MgKyB0ZXh0Lmxlbmd0aDtcbiAgICAgICAgdGV4dGFyZWEuc2VsZWN0aW9uU3RhcnQgPSBjYXJldFBvcztcbiAgICAgICAgdGV4dGFyZWEuc2VsZWN0aW9uRW5kID0gY2FyZXRQb3M7XG4gICAgICAgIHRleHRhcmVhLmZvY3VzKCk7XG4gICAgICAgIHRleHRhcmVhLnNjcm9sbFRvcCA9IHNjcm9sbFBvcztcbiAgICB9XG5cbiAgICBoaWRlTWVudSgpIHtcbiAgICAgICAgaWYgKHRoaXMubWVudSkge1xuICAgICAgICAgICAgdGhpcy5tZW51LnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZTsnXG4gICAgICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2VcbiAgICAgICAgICAgIHRoaXMubWVudVNlbGVjdGVkID0gMFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0ge31cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGVjdEl0ZW1BdEluZGV4KGluZGV4LCBvcmlnaW5hbEV2ZW50KSB7XG4gICAgICAgIGluZGV4ID0gcGFyc2VJbnQoaW5kZXgpXG4gICAgICAgIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm5cbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLmN1cnJlbnQuZmlsdGVyZWRJdGVtc1tpbmRleF1cbiAgICAgICAgbGV0IGNvbnRlbnQgPSB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5zZWxlY3RUZW1wbGF0ZShpdGVtKVxuICAgICAgICBpZiAoY29udGVudCAhPT0gbnVsbCkgdGhpcy5yZXBsYWNlVGV4dChjb250ZW50LCBvcmlnaW5hbEV2ZW50LCBpdGVtKVxuICAgIH1cblxuICAgIHJlcGxhY2VUZXh0KGNvbnRlbnQsIG9yaWdpbmFsRXZlbnQsIGl0ZW0pIHtcbiAgICAgICAgdGhpcy5yYW5nZS5yZXBsYWNlVHJpZ2dlclRleHQoY29udGVudCwgdHJ1ZSwgdHJ1ZSwgb3JpZ2luYWxFdmVudCwgaXRlbSlcbiAgICB9XG5cbiAgICBfYXBwZW5kKGNvbGxlY3Rpb24sIG5ld1ZhbHVlcywgcmVwbGFjZSkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbGxlY3Rpb24udmFsdWVzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBhcHBlbmQgdG8gdmFsdWVzLCBhcyBpdCBpcyBhIGZ1bmN0aW9uLicpXG4gICAgICAgIH0gZWxzZSBpZiAoIXJlcGxhY2UpIHtcbiAgICAgICAgICAgIGNvbGxlY3Rpb24udmFsdWVzID0gY29sbGVjdGlvbi52YWx1ZXMuY29uY2F0KG5ld1ZhbHVlcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbGxlY3Rpb24udmFsdWVzID0gbmV3VmFsdWVzXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBlbmQoY29sbGVjdGlvbkluZGV4LCBuZXdWYWx1ZXMsIHJlcGxhY2UpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gcGFyc2VJbnQoY29sbGVjdGlvbkluZGV4KVxuICAgICAgICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykgdGhyb3cgbmV3IEVycm9yKCdwbGVhc2UgcHJvdmlkZSBhbiBpbmRleCBmb3IgdGhlIGNvbGxlY3Rpb24gdG8gdXBkYXRlLicpXG5cbiAgICAgICAgbGV0IGNvbGxlY3Rpb24gPSB0aGlzLmNvbGxlY3Rpb25baW5kZXhdXG5cbiAgICAgICAgdGhpcy5fYXBwZW5kKGNvbGxlY3Rpb24sIG5ld1ZhbHVlcywgcmVwbGFjZSlcbiAgICB9XG5cbiAgICBhcHBlbmRDdXJyZW50KG5ld1ZhbHVlcywgcmVwbGFjZSkge1xuICAgICAgICBpZiAodGhpcy5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5fYXBwZW5kKHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLCBuZXdWYWx1ZXMsIHJlcGxhY2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGFjdGl2ZSBzdGF0ZS4gUGxlYXNlIHVzZSBhcHBlbmQgaW5zdGVhZCBhbmQgcGFzcyBhbiBpbmRleC4nKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGV0YWNoKGVsKSB7XG4gICAgICAgIGlmICghZWwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignW1RyaWJ1dGVdIE11c3QgcGFzcyBpbiBhIERPTSBub2RlIG9yIE5vZGVMaXN0LicpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBpZiBpdCBpcyBhIGpRdWVyeSBjb2xsZWN0aW9uXG4gICAgICAgIGlmICh0eXBlb2YgalF1ZXJ5ICE9PSAndW5kZWZpbmVkJyAmJiBlbCBpbnN0YW5jZW9mIGpRdWVyeSkge1xuICAgICAgICAgICAgZWwgPSBlbC5nZXQoKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSXMgZWwgYW4gQXJyYXkvQXJyYXktbGlrZSBvYmplY3Q/XG4gICAgICAgIGlmIChlbC5jb25zdHJ1Y3RvciA9PT0gTm9kZUxpc3QgfHwgZWwuY29uc3RydWN0b3IgPT09IEhUTUxDb2xsZWN0aW9uIHx8IGVsLmNvbnN0cnVjdG9yID09PSBBcnJheSkge1xuICAgICAgICAgICAgbGV0IGxlbmd0aCA9IGVsLmxlbmd0aFxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RldGFjaChlbFtpXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2RldGFjaChlbClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9kZXRhY2goZWwpIHtcbiAgICAgICAgdGhpcy5ldmVudHMudW5iaW5kKGVsKVxuICAgICAgICBpZiAoZWwudHJpYnV0ZU1lbnUpIHtcbiAgICAgICAgICAgIHRoaXMubWVudUV2ZW50cy51bmJpbmQoZWwudHJpYnV0ZU1lbnUpXG4gICAgICAgIH1cblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS10cmlidXRlJylcbiAgICAgICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZVxuICAgICAgICAgICAgaWYgKGVsLnRyaWJ1dGVNZW51KSB7XG4gICAgICAgICAgICAgICAgZWwudHJpYnV0ZU1lbnUucmVtb3ZlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRyaWJ1dGU7XG4iLCJjbGFzcyBUcmlidXRlRXZlbnRzIHtcbiAgICBjb25zdHJ1Y3Rvcih0cmlidXRlKSB7XG4gICAgICAgIHRoaXMudHJpYnV0ZSA9IHRyaWJ1dGVcbiAgICAgICAgdGhpcy50cmlidXRlLmV2ZW50cyA9IHRoaXNcbiAgICB9XG5cbiAgICBzdGF0aWMga2V5cygpIHtcbiAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgICBrZXk6IDksXG4gICAgICAgICAgICB2YWx1ZTogJ1RBQidcbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiA4LFxuICAgICAgICAgICAgdmFsdWU6ICdERUxFVEUnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogMTMsXG4gICAgICAgICAgICB2YWx1ZTogJ0VOVEVSJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6IDI3LFxuICAgICAgICAgICAgdmFsdWU6ICdFU0NBUEUnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogMzgsXG4gICAgICAgICAgICB2YWx1ZTogJ1VQJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6IDQwLFxuICAgICAgICAgICAgdmFsdWU6ICdET1dOJ1xuICAgICAgICB9XVxuICAgIH1cblxuICAgIGJpbmQoZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LmJvdW5kS2V5ZG93biA9IHRoaXMua2V5ZG93bi5iaW5kKGVsZW1lbnQsIHRoaXMpO1xuICAgICAgICBlbGVtZW50LmJvdW5kS2V5dXAgPSB0aGlzLmtleXVwLmJpbmQoZWxlbWVudCwgdGhpcyk7XG4gICAgICAgIGVsZW1lbnQuYm91bmRJbnB1dCA9IHRoaXMuaW5wdXQuYmluZChlbGVtZW50LCB0aGlzKTtcblxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLFxuICAgICAgICAgICAgZWxlbWVudC5ib3VuZEtleWRvd24sIGZhbHNlKVxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJyxcbiAgICAgICAgICAgIGVsZW1lbnQuYm91bmRLZXl1cCwgZmFsc2UpXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLFxuICAgICAgICAgICAgZWxlbWVudC5ib3VuZElucHV0LCBmYWxzZSlcbiAgICB9XG5cbiAgICB1bmJpbmQoZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLFxuICAgICAgICAgICAgZWxlbWVudC5ib3VuZEtleWRvd24sIGZhbHNlKVxuICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJyxcbiAgICAgICAgICAgIGVsZW1lbnQuYm91bmRLZXl1cCwgZmFsc2UpXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignaW5wdXQnLFxuICAgICAgICAgICAgZWxlbWVudC5ib3VuZElucHV0LCBmYWxzZSlcblxuICAgICAgICBkZWxldGUgZWxlbWVudC5ib3VuZEtleWRvd25cbiAgICAgICAgZGVsZXRlIGVsZW1lbnQuYm91bmRLZXl1cFxuICAgICAgICBkZWxldGUgZWxlbWVudC5ib3VuZElucHV0XG4gICAgfVxuXG4gICAga2V5ZG93bihpbnN0YW5jZSwgZXZlbnQpIHtcbiAgICAgICAgaWYgKGluc3RhbmNlLnNob3VsZERlYWN0aXZhdGUoZXZlbnQpKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS50cmlidXRlLmlzQWN0aXZlID0gZmFsc2VcbiAgICAgICAgICAgIGluc3RhbmNlLnRyaWJ1dGUuaGlkZU1lbnUoKVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzXG4gICAgICAgIGluc3RhbmNlLmNvbW1hbmRFdmVudCA9IGZhbHNlXG5cbiAgICAgICAgVHJpYnV0ZUV2ZW50cy5rZXlzKCkuZm9yRWFjaChvID0+IHtcbiAgICAgICAgICAgIGlmIChvLmtleSA9PT0gZXZlbnQua2V5Q29kZSkge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlLmNvbW1hbmRFdmVudCA9IHRydWVcbiAgICAgICAgICAgICAgICBpbnN0YW5jZS5jYWxsYmFja3MoKVtvLnZhbHVlLnRvTG93ZXJDYXNlKCldKGV2ZW50LCBlbGVtZW50KVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGlucHV0KGluc3RhbmNlLCBldmVudCkge1xuICAgICAgICBpbnN0YW5jZS5pbnB1dEV2ZW50ID0gdHJ1ZVxuICAgICAgICBpbnN0YW5jZS5rZXl1cC5jYWxsKHRoaXMsIGluc3RhbmNlLCBldmVudClcbiAgICB9XG5cbiAgICBjbGljayhpbnN0YW5jZSwgZXZlbnQpIHtcbiAgICAgICAgbGV0IHRyaWJ1dGUgPSBpbnN0YW5jZS50cmlidXRlXG4gICAgICAgIGlmICh0cmlidXRlLm1lbnUgJiYgdHJpYnV0ZS5tZW51LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgICAgICAgIGxldCBsaSA9IGV2ZW50LnRhcmdldFxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIHdoaWxlIChsaS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9PSAnbGknKSB7XG4gICAgICAgICAgICAgICAgbGkgPSBsaS5wYXJlbnROb2RlXG4gICAgICAgICAgICAgICAgaWYgKCFsaSB8fCBsaSA9PT0gdHJpYnV0ZS5tZW51KSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGZpbmQgdGhlIDxsaT4gY29udGFpbmVyIGZvciB0aGUgY2xpY2snKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyaWJ1dGUuc2VsZWN0SXRlbUF0SW5kZXgobGkuZ2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JyksIGV2ZW50KVxuICAgICAgICAgICAgdHJpYnV0ZS5oaWRlTWVudSgpXG5cbiAgICAgICAgLy8gVE9ETzogc2hvdWxkIGZpcmUgd2l0aCBleHRlcm5hbFRyaWdnZXIgYW5kIHRhcmdldCBpcyBvdXRzaWRlIG9mIG1lbnVcbiAgICAgICAgfSBlbHNlIGlmICh0cmlidXRlLmN1cnJlbnQuZWxlbWVudCAmJiAhdHJpYnV0ZS5jdXJyZW50LmV4dGVybmFsVHJpZ2dlcikge1xuICAgICAgICAgICAgdHJpYnV0ZS5jdXJyZW50LmV4dGVybmFsVHJpZ2dlciA9IGZhbHNlXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRyaWJ1dGUuaGlkZU1lbnUoKSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGtleXVwKGluc3RhbmNlLCBldmVudCkge1xuICAgICAgICBpZiAoaW5zdGFuY2UuaW5wdXRFdmVudCkge1xuICAgICAgICAgICAgaW5zdGFuY2UuaW5wdXRFdmVudCA9IGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgaW5zdGFuY2UudXBkYXRlU2VsZWN0aW9uKHRoaXMpXG5cbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDI3KSByZXR1cm5cblxuICAgICAgICBpZiAoIWluc3RhbmNlLnRyaWJ1dGUuYWxsb3dTcGFjZXMgJiYgaW5zdGFuY2UudHJpYnV0ZS5oYXNUcmFpbGluZ1NwYWNlKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS50cmlidXRlLmhhc1RyYWlsaW5nU3BhY2UgPSBmYWxzZTtcbiAgICAgICAgICAgIGluc3RhbmNlLmNvbW1hbmRFdmVudCA9IHRydWU7XG4gICAgICAgICAgICBpbnN0YW5jZS5jYWxsYmFja3MoKVtcInNwYWNlXCJdKGV2ZW50LCB0aGlzKTtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpbnN0YW5jZS50cmlidXRlLmlzQWN0aXZlKSB7XG4gICAgICAgICAgICBsZXQga2V5Q29kZSA9IGluc3RhbmNlLmdldEtleUNvZGUoaW5zdGFuY2UsIHRoaXMsIGV2ZW50KVxuXG4gICAgICAgICAgICBpZiAoaXNOYU4oa2V5Q29kZSkgfHwgIWtleUNvZGUpIHJldHVyblxuXG4gICAgICAgICAgICBsZXQgdHJpZ2dlciA9IGluc3RhbmNlLnRyaWJ1dGUudHJpZ2dlcnMoKS5maW5kKHRyaWdnZXIgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cmlnZ2VyLmNoYXJDb2RlQXQoMCkgPT09IGtleUNvZGVcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdHJpZ2dlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZS5jYWxsYmFja3MoKS50cmlnZ2VyQ2hhcihldmVudCwgdGhpcywgdHJpZ2dlcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbnN0YW5jZS50cmlidXRlLmN1cnJlbnQudHJpZ2dlciAmJiBpbnN0YW5jZS5jb21tYW5kRXZlbnQgPT09IGZhbHNlXG4gICAgICAgICAgICB8fCBpbnN0YW5jZS50cmlidXRlLmlzQWN0aXZlICYmIGV2ZW50LmtleUNvZGUgPT09IDgpIHtcbiAgICAgICAgICBpbnN0YW5jZS50cmlidXRlLnNob3dNZW51Rm9yKHRoaXMsIHRydWUpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG91bGREZWFjdGl2YXRlKGV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy50cmlidXRlLmlzQWN0aXZlKSByZXR1cm4gZmFsc2VcblxuICAgICAgICBpZiAodGhpcy50cmlidXRlLmN1cnJlbnQubWVudGlvblRleHQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBsZXQgZXZlbnRLZXlQcmVzc2VkID0gZmFsc2VcbiAgICAgICAgICAgIFRyaWJ1dGVFdmVudHMua2V5cygpLmZvckVhY2gobyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IG8ua2V5KSBldmVudEtleVByZXNzZWQgPSB0cnVlXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXR1cm4gIWV2ZW50S2V5UHJlc3NlZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgZ2V0S2V5Q29kZShpbnN0YW5jZSwgZWwsIGV2ZW50KSB7XG4gICAgICAgIGxldCBjaGFyXG4gICAgICAgIGxldCB0cmlidXRlID0gaW5zdGFuY2UudHJpYnV0ZVxuICAgICAgICBsZXQgaW5mbyA9IHRyaWJ1dGUucmFuZ2UuZ2V0VHJpZ2dlckluZm8oZmFsc2UsIHRyaWJ1dGUuaGFzVHJhaWxpbmdTcGFjZSwgdHJ1ZSwgdHJpYnV0ZS5hbGxvd1NwYWNlcylcblxuICAgICAgICBpZiAoaW5mbykge1xuICAgICAgICAgICAgcmV0dXJuIGluZm8ubWVudGlvblRyaWdnZXJDaGFyLmNoYXJDb2RlQXQoMClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlU2VsZWN0aW9uKGVsKSB7XG4gICAgICAgIHRoaXMudHJpYnV0ZS5jdXJyZW50LmVsZW1lbnQgPSBlbFxuICAgICAgICBsZXQgaW5mbyA9IHRoaXMudHJpYnV0ZS5yYW5nZS5nZXRUcmlnZ2VySW5mbyhmYWxzZSwgdGhpcy50cmlidXRlLmhhc1RyYWlsaW5nU3BhY2UsIHRydWUsIHRoaXMudHJpYnV0ZS5hbGxvd1NwYWNlcylcblxuICAgICAgICBpZiAoaW5mbykge1xuICAgICAgICAgICAgdGhpcy50cmlidXRlLmN1cnJlbnQuc2VsZWN0ZWRQYXRoID0gaW5mby5tZW50aW9uU2VsZWN0ZWRQYXRoXG4gICAgICAgICAgICB0aGlzLnRyaWJ1dGUuY3VycmVudC5tZW50aW9uVGV4dCA9IGluZm8ubWVudGlvblRleHRcbiAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5jdXJyZW50LnNlbGVjdGVkT2Zmc2V0ID0gaW5mby5tZW50aW9uU2VsZWN0ZWRPZmZzZXRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNhbGxiYWNrcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRyaWdnZXJDaGFyOiAoZSwgZWwsIHRyaWdnZXIpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdHJpYnV0ZSA9IHRoaXMudHJpYnV0ZVxuICAgICAgICAgICAgICAgIHRyaWJ1dGUuY3VycmVudC50cmlnZ2VyID0gdHJpZ2dlclxuXG4gICAgICAgICAgICAgICAgbGV0IGNvbGxlY3Rpb25JdGVtID0gdHJpYnV0ZS5jb2xsZWN0aW9uLmZpbmQoaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLnRyaWdnZXIgPT09IHRyaWdnZXJcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgdHJpYnV0ZS5jdXJyZW50LmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uSXRlbVxuICAgICAgICAgICAgICAgIGlmICh0cmlidXRlLmlucHV0RXZlbnQpIHRyaWJ1dGUuc2hvd01lbnVGb3IoZWwsIHRydWUpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW50ZXI6IChlLCBlbCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNob29zZSBzZWxlY3Rpb25cbiAgICAgICAgICAgICAgICBpZiAodGhpcy50cmlidXRlLmlzQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLnNlbGVjdEl0ZW1BdEluZGV4KHRoaXMudHJpYnV0ZS5tZW51U2VsZWN0ZWQsIGUpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUuaGlkZU1lbnUoKVxuICAgICAgICAgICAgICAgICAgICB9LCAwKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlc2NhcGU6IChlLCBlbCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyaWJ1dGUuaXNBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLmlzQWN0aXZlID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLmhpZGVNZW51KClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGFiOiAoZSwgZWwpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjaG9vc2UgZmlyc3QgbWF0Y2hcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxiYWNrcygpLmVudGVyKGUsIGVsKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNwYWNlOiAoZSwgZWwpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50cmlidXRlLmlzQWN0aXZlICYmICF0aGlzLnRyaWJ1dGUuYWxsb3dTcGFjZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUuaGlkZU1lbnUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXA6IChlLCBlbCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIG5hdmlnYXRlIHVwIHVsXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHJpYnV0ZS5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICBsZXQgY291bnQgPSB0aGlzLnRyaWJ1dGUuY3VycmVudC5maWx0ZXJlZEl0ZW1zLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkID0gdGhpcy50cmlidXRlLm1lbnVTZWxlY3RlZFxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb3VudCA+IHNlbGVjdGVkICYmIHNlbGVjdGVkID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLm1lbnVTZWxlY3RlZC0tXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUxpKClcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5tZW51U2VsZWN0ZWQgPSBjb3VudCAtIDFcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUxpKClcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudS5zY3JvbGxUb3AgPSB0aGlzLnRyaWJ1dGUubWVudS5zY3JvbGxIZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkb3duOiAoZSwgZWwpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBuYXZpZ2F0ZSBkb3duIHVsXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHJpYnV0ZS5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICBsZXQgY291bnQgPSB0aGlzLnRyaWJ1dGUuY3VycmVudC5maWx0ZXJlZEl0ZW1zLmxlbmd0aCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZCA9IHRoaXMudHJpYnV0ZS5tZW51U2VsZWN0ZWRcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY291bnQgPiBzZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLm1lbnVTZWxlY3RlZCsrXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUxpKClcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb3VudCA9PT0gc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5tZW51U2VsZWN0ZWQgPSAwXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUxpKClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5tZW51LnNjcm9sbFRvcCA9IDBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZWxldGU6IChlLCBlbCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyaWJ1dGUuaXNBY3RpdmUgJiYgdGhpcy50cmlidXRlLmN1cnJlbnQubWVudGlvblRleHQubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUuaGlkZU1lbnUoKVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy50cmlidXRlLmlzQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5zaG93TWVudUZvcihlbClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRBY3RpdmVMaShpbmRleCkge1xuICAgICAgICBsZXQgbGlzID0gdGhpcy50cmlidXRlLm1lbnUucXVlcnlTZWxlY3RvckFsbCgnbGknKSxcbiAgICAgICAgICAgIGxlbmd0aCA9IGxpcy5sZW5ndGggPj4+IDBcblxuICAgICAgICAvLyBnZXQgaGVpZ2h0c1xuICAgICAgICBsZXQgbWVudUZ1bGxIZWlnaHQgPSB0aGlzLmdldEZ1bGxIZWlnaHQodGhpcy50cmlidXRlLm1lbnUpLFxuICAgICAgICAgICAgbGlIZWlnaHQgPSB0aGlzLmdldEZ1bGxIZWlnaHQobGlzWzBdKVxuXG4gICAgICAgIGlmIChpbmRleCkgdGhpcy50cmlidXRlLm1lbnVTZWxlY3RlZCA9IGluZGV4O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBsaSA9IGxpc1tpXVxuICAgICAgICAgICAgaWYgKGkgPT09IHRoaXMudHJpYnV0ZS5tZW51U2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0ID0gbGlIZWlnaHQgKiAoaSsxKVxuICAgICAgICAgICAgICAgIGxldCBzY3JvbGxUb3AgPSB0aGlzLnRyaWJ1dGUubWVudS5zY3JvbGxUb3BcbiAgICAgICAgICAgICAgICBsZXQgdG90YWxTY3JvbGwgPSBzY3JvbGxUb3AgKyBtZW51RnVsbEhlaWdodFxuXG4gICAgICAgICAgICAgICAgaWYgKG9mZnNldCA+IHRvdGFsU2Nyb2xsKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudS5zY3JvbGxUb3AgKz0gbGlIZWlnaHRcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9mZnNldCA8IHRvdGFsU2Nyb2xsKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudS5zY3JvbGxUb3AgLT0gbGlIZWlnaHRcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsaS5jbGFzc05hbWUgPSB0aGlzLnRyaWJ1dGUuY3VycmVudC5jb2xsZWN0aW9uLnNlbGVjdENsYXNzXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpLmNsYXNzTmFtZSA9ICcnXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRGdWxsSGVpZ2h0KGVsZW0sIGluY2x1ZGVNYXJnaW4pIHtcbiAgICAgIGxldCBoZWlnaHQgPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodFxuXG4gICAgICBpZiAoaW5jbHVkZU1hcmdpbikge1xuICAgICAgICBsZXQgc3R5bGUgPSBlbGVtLmN1cnJlbnRTdHlsZSB8fCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtKVxuICAgICAgICByZXR1cm4gaGVpZ2h0ICsgcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5Ub3ApICsgcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5Cb3R0b20pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoZWlnaHRcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgVHJpYnV0ZUV2ZW50cztcbiIsImNsYXNzIFRyaWJ1dGVNZW51RXZlbnRzIHtcbiAgICBjb25zdHJ1Y3Rvcih0cmlidXRlKSB7XG4gICAgICAgIHRoaXMudHJpYnV0ZSA9IHRyaWJ1dGVcbiAgICAgICAgdGhpcy50cmlidXRlLm1lbnVFdmVudHMgPSB0aGlzXG4gICAgICAgIHRoaXMubWVudSA9IHRoaXMudHJpYnV0ZS5tZW51XG4gICAgfVxuXG4gICAgYmluZChtZW51KSB7XG4gICAgICAgIG1lbnUubWVudUtleWRvd25FdmVudCA9IHRoaXMudHJpYnV0ZS5ldmVudHMua2V5ZG93bi5iaW5kKHRoaXMubWVudSwgdGhpcylcbiAgICAgICAgdGhpcy5tZW51Q2xpY2tFdmVudCA9IHRoaXMudHJpYnV0ZS5ldmVudHMuY2xpY2suYmluZChudWxsLCB0aGlzKVxuICAgICAgICB0aGlzLm1lbnVDb250YWluZXJTY3JvbGxFdmVudCA9IHRoaXMuZGVib3VuY2UoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMudHJpYnV0ZS5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5zaG93TWVudUZvcih0aGlzLnRyaWJ1dGUuY3VycmVudC5lbGVtZW50LCBmYWxzZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMzAwLCBmYWxzZSlcbiAgICAgICAgdGhpcy53aW5kb3dSZXNpemVFdmVudCA9IHRoaXMuZGVib3VuY2UoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMudHJpYnV0ZS5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5yYW5nZS5wb3NpdGlvbk1lbnVBdENhcmV0KHRydWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDMwMCwgZmFsc2UpXG5cbiAgICAgICAgLy8gZml4ZXMgSUUxMSBpc3N1ZXMgd2l0aCBtb3VzZXVwXG4gICAgICAgIHRoaXMudHJpYnV0ZS5yYW5nZS5nZXREb2N1bWVudCgpLmFkZEV2ZW50TGlzdGVuZXIoJ01TUG9pbnRlclVwJyxcbiAgICAgICAgICAgIHRoaXMubWVudUNsaWNrRXZlbnQsIGZhbHNlKVxuICAgICAgICBtZW51LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLFxuICAgICAgICAgICAgdGhpcy5tZW51S2V5ZG93bkV2ZW50LCBmYWxzZSlcbiAgICAgICAgdGhpcy50cmlidXRlLnJhbmdlLmdldERvY3VtZW50KCkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsXG4gICAgICAgICAgICB0aGlzLm1lbnVDbGlja0V2ZW50LCBmYWxzZSlcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMud2luZG93UmVzaXplRXZlbnQpXG5cbiAgICAgICAgaWYgKHRoaXMubWVudUNvbnRhaW5lcikge1xuICAgICAgICAgICAgdGhpcy5tZW51Q29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMubWVudUNvbnRhaW5lclNjcm9sbEV2ZW50LCBmYWxzZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLm1lbnVDb250YWluZXJTY3JvbGxFdmVudClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZChtZW51KSB7XG4gICAgICAgIG1lbnUucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsXG4gICAgICAgICAgICBtZW51Lm1lbnVLZXlkb3duRXZlbnQsIGZhbHNlKVxuICAgICAgICBkZWxldGUgbWVudS5tZW51S2V5ZG93bkV2ZW50XG4gICAgICAgIHRoaXMudHJpYnV0ZS5yYW5nZS5nZXREb2N1bWVudCgpLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLFxuICAgICAgICAgICAgdGhpcy5tZW51Q2xpY2tFdmVudCwgZmFsc2UpXG4gICAgICAgIHRoaXMudHJpYnV0ZS5yYW5nZS5nZXREb2N1bWVudCgpLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ01TUG9pbnRlclVwJyxcbiAgICAgICAgICAgIHRoaXMubWVudUNsaWNrRXZlbnQsIGZhbHNlKVxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy53aW5kb3dSZXNpemVFdmVudClcblxuICAgICAgICBpZiAodGhpcy5tZW51Q29udGFpbmVyKSB7XG4gICAgICAgICAgICB0aGlzLm1lbnVDb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5tZW51Q29udGFpbmVyU2Nyb2xsRXZlbnQsIGZhbHNlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMubWVudUNvbnRhaW5lclNjcm9sbEV2ZW50KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVib3VuY2UoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgICAgIHZhciB0aW1lb3V0XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50c1xuICAgICAgICAgICAgdmFyIGxhdGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsXG4gICAgICAgICAgICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dClcbiAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KVxuICAgICAgICAgICAgaWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncylcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBUcmlidXRlTWVudUV2ZW50cztcbiIsIi8vIFRoYW5rcyB0byBodHRwczovL2dpdGh1Yi5jb20vamVmZi1jb2xsaW5zL21lbnQuaW9cbmNsYXNzIFRyaWJ1dGVSYW5nZSB7XG4gICAgY29uc3RydWN0b3IodHJpYnV0ZSkge1xuICAgICAgICB0aGlzLnRyaWJ1dGUgPSB0cmlidXRlXG4gICAgICAgIHRoaXMudHJpYnV0ZS5yYW5nZSA9IHRoaXNcbiAgICB9XG5cbiAgICBnZXREb2N1bWVudCgpIHtcbiAgICAgICAgbGV0IGlmcmFtZVxuICAgICAgICBpZiAodGhpcy50cmlidXRlLmN1cnJlbnQuY29sbGVjdGlvbikge1xuICAgICAgICAgICAgaWZyYW1lID0gdGhpcy50cmlidXRlLmN1cnJlbnQuY29sbGVjdGlvbi5pZnJhbWVcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaWZyYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudFxuICAgIH1cblxuICAgIHBvc2l0aW9uTWVudUF0Q2FyZXQoc2Nyb2xsVG8pIHtcbiAgICAgICAgbGV0IGNvbnRleHQgPSB0aGlzLnRyaWJ1dGUuY3VycmVudCxcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzXG5cbiAgICAgICAgbGV0IGluZm8gPSB0aGlzLmdldFRyaWdnZXJJbmZvKGZhbHNlLCB0aGlzLnRyaWJ1dGUuaGFzVHJhaWxpbmdTcGFjZSwgdHJ1ZSwgdGhpcy50cmlidXRlLmFsbG93U3BhY2VzKVxuXG4gICAgICAgIGlmICh0eXBlb2YgaW5mbyAhPT0gJ3VuZGVmaW5lZCcpIHtcblxuICAgICAgICAgICAgaWYoIXRoaXMudHJpYnV0ZS5wb3NpdGlvbk1lbnUpe1xuICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5tZW51LnN0eWxlLmNzc1RleHQgPSBgZGlzcGxheTogYmxvY2s7YFxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNDb250ZW50RWRpdGFibGUoY29udGV4dC5lbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzID0gdGhpcy5nZXRUZXh0QXJlYU9ySW5wdXRVbmRlcmxpbmVQb3NpdGlvbih0aGlzLnRyaWJ1dGUuY3VycmVudC5lbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICBpbmZvLm1lbnRpb25Qb3NpdGlvbilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzID0gdGhpcy5nZXRDb250ZW50RWRpdGFibGVDYXJldFBvc2l0aW9uKGluZm8ubWVudGlvblBvc2l0aW9uKVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5tZW51LnN0eWxlLmNzc1RleHQgPSBgdG9wOiAke2Nvb3JkaW5hdGVzLnRvcH1weDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAke2Nvb3JkaW5hdGVzLmxlZnR9cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6ICR7Y29vcmRpbmF0ZXMucmlnaHR9cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAke2Nvb3JkaW5hdGVzLmJvdHRvbX1weDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4OiAxMDAwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBibG9jaztgXG5cbiAgICAgICAgICAgIGlmIChjb29yZGluYXRlcy5sZWZ0ID09PSAnYXV0bycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudS5zdHlsZS5sZWZ0ID0gJ2F1dG8nXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb29yZGluYXRlcy50b3AgPT09ICdhdXRvJykge1xuICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5tZW51LnN0eWxlLnRvcCA9ICdhdXRvJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2Nyb2xsVG8pIHRoaXMuc2Nyb2xsSW50b1ZpZXcoKVxuXG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG1lbnVEaW1lbnNpb25zID0ge1xuICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnRyaWJ1dGUubWVudS5vZmZzZXRXaWR0aCxcbiAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMudHJpYnV0ZS5tZW51Lm9mZnNldEhlaWdodFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgbWVudUlzT2ZmU2NyZWVuID0gdGhpcy5pc01lbnVPZmZTY3JlZW4oY29vcmRpbmF0ZXMsIG1lbnVEaW1lbnNpb25zKVxuXG4gICAgICAgICAgICAgICAgbGV0IG1lbnVJc09mZlNjcmVlbkhvcml6b250YWxseSA9IHdpbmRvdy5pbm5lcldpZHRoID4gbWVudURpbWVuc2lvbnMud2lkdGggJiYgKG1lbnVJc09mZlNjcmVlbi5sZWZ0IHx8IG1lbnVJc09mZlNjcmVlbi5yaWdodClcbiAgICAgICAgICAgICAgICBsZXQgbWVudUlzT2ZmU2NyZWVuVmVydGljYWxseSA9IHdpbmRvdy5pbm5lckhlaWdodCA+IG1lbnVEaW1lbnNpb25zLmhlaWdodCAmJiAobWVudUlzT2ZmU2NyZWVuLnRvcCB8fCBtZW51SXNPZmZTY3JlZW4uYm90dG9tKVxuICAgICAgICAgICAgICAgIGlmIChtZW51SXNPZmZTY3JlZW5Ib3Jpem9udGFsbHkgfHwgbWVudUlzT2ZmU2NyZWVuVmVydGljYWxseSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudS5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb25NZW51QXRDYXJldChzY3JvbGxUbylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAwKVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudS5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxlY3RFbGVtZW50KHRhcmdldEVsZW1lbnQsIHBhdGgsIG9mZnNldCkge1xuICAgICAgICBsZXQgcmFuZ2VcbiAgICAgICAgbGV0IGVsZW0gPSB0YXJnZXRFbGVtZW50XG5cbiAgICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGVsZW0gPSBlbGVtLmNoaWxkTm9kZXNbcGF0aFtpXV1cbiAgICAgICAgICAgICAgICBpZiAoZWxlbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3aGlsZSAoZWxlbS5sZW5ndGggPCBvZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0IC09IGVsZW0ubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIGVsZW0gPSBlbGVtLm5leHRTaWJsaW5nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlbGVtLmNoaWxkTm9kZXMubGVuZ3RoID09PSAwICYmICFlbGVtLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtID0gZWxlbS5wcmV2aW91c1NpYmxpbmdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHNlbCA9IHRoaXMuZ2V0V2luZG93U2VsZWN0aW9uKClcblxuICAgICAgICByYW5nZSA9IHRoaXMuZ2V0RG9jdW1lbnQoKS5jcmVhdGVSYW5nZSgpXG4gICAgICAgIHJhbmdlLnNldFN0YXJ0KGVsZW0sIG9mZnNldClcbiAgICAgICAgcmFuZ2Uuc2V0RW5kKGVsZW0sIG9mZnNldClcbiAgICAgICAgcmFuZ2UuY29sbGFwc2UodHJ1ZSlcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxuXG4gICAgICAgIHNlbC5hZGRSYW5nZShyYW5nZSlcbiAgICAgICAgdGFyZ2V0RWxlbWVudC5mb2N1cygpXG4gICAgfVxuXG4gICAgcmVzZXRTZWxlY3Rpb24odGFyZ2V0RWxlbWVudCwgcGF0aCwgb2Zmc2V0KSB7XG4gICAgICAgIGlmICghdGhpcy5pc0NvbnRlbnRFZGl0YWJsZSh0YXJnZXRFbGVtZW50KSkge1xuICAgICAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQgIT09IHRoaXMudHJpYnV0ZS5jdXJyZW50LmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRFbGVtZW50LmZvY3VzKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0RWxlbWVudCh0YXJnZXRFbGVtZW50LCBwYXRoLCBvZmZzZXQpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXBsYWNlVHJpZ2dlclRleHQodGV4dCwgcmVxdWlyZUxlYWRpbmdTcGFjZSwgaGFzVHJhaWxpbmdTcGFjZSwgb3JpZ2luYWxFdmVudCwgaXRlbSkge1xuICAgICAgICBsZXQgY29udGV4dCA9IHRoaXMudHJpYnV0ZS5jdXJyZW50XG4gICAgICAgIHRoaXMucmVzZXRTZWxlY3Rpb24oY29udGV4dC5lbGVtZW50LCBjb250ZXh0LnNlbGVjdGVkUGF0aCwgY29udGV4dC5zZWxlY3RlZE9mZnNldClcblxuICAgICAgICBsZXQgaW5mbyA9IHRoaXMuZ2V0VHJpZ2dlckluZm8odHJ1ZSwgaGFzVHJhaWxpbmdTcGFjZSwgcmVxdWlyZUxlYWRpbmdTcGFjZSwgdGhpcy50cmlidXRlLmFsbG93U3BhY2VzKVxuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgZXZlbnRcbiAgICAgICAgbGV0IHJlcGxhY2VFdmVudCA9IG5ldyBDdXN0b21FdmVudCgndHJpYnV0ZS1yZXBsYWNlZCcsIHtcbiAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgIGl0ZW06IGl0ZW0sXG4gICAgICAgICAgICAgICAgZXZlbnQ6IG9yaWdpbmFsRXZlbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBpZiAoaW5mbyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNDb250ZW50RWRpdGFibGUoY29udGV4dC5lbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIGxldCBteUZpZWxkID0gdGhpcy50cmlidXRlLmN1cnJlbnQuZWxlbWVudFxuICAgICAgICAgICAgICAgIGxldCB0ZXh0U3VmZml4ID0gdHlwZW9mIHRoaXMudHJpYnV0ZS5yZXBsYWNlVGV4dFN1ZmZpeCA9PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICA/IHRoaXMudHJpYnV0ZS5yZXBsYWNlVGV4dFN1ZmZpeFxuICAgICAgICAgICAgICAgICAgICA6ICcgJ1xuICAgICAgICAgICAgICAgIHRleHQgKz0gdGV4dFN1ZmZpeFxuICAgICAgICAgICAgICAgIGxldCBzdGFydFBvcyA9IGluZm8ubWVudGlvblBvc2l0aW9uXG4gICAgICAgICAgICAgICAgbGV0IGVuZFBvcyA9IGluZm8ubWVudGlvblBvc2l0aW9uICsgaW5mby5tZW50aW9uVGV4dC5sZW5ndGggKyB0ZXh0U3VmZml4Lmxlbmd0aFxuICAgICAgICAgICAgICAgIG15RmllbGQudmFsdWUgPSBteUZpZWxkLnZhbHVlLnN1YnN0cmluZygwLCBzdGFydFBvcykgKyB0ZXh0ICtcbiAgICAgICAgICAgICAgICAgICAgbXlGaWVsZC52YWx1ZS5zdWJzdHJpbmcoZW5kUG9zLCBteUZpZWxkLnZhbHVlLmxlbmd0aClcbiAgICAgICAgICAgICAgICBteUZpZWxkLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRQb3MgKyB0ZXh0Lmxlbmd0aFxuICAgICAgICAgICAgICAgIG15RmllbGQuc2VsZWN0aW9uRW5kID0gc3RhcnRQb3MgKyB0ZXh0Lmxlbmd0aFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBhZGQgYSBzcGFjZSB0byB0aGUgZW5kIG9mIHRoZSBwYXN0ZWQgdGV4dFxuICAgICAgICAgICAgICAgIGxldCB0ZXh0U3VmZml4ID0gdHlwZW9mIHRoaXMudHJpYnV0ZS5yZXBsYWNlVGV4dFN1ZmZpeCA9PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICA/IHRoaXMudHJpYnV0ZS5yZXBsYWNlVGV4dFN1ZmZpeFxuICAgICAgICAgICAgICAgICAgICA6ICdcXHhBMCdcbiAgICAgICAgICAgICAgICB0ZXh0ICs9IHRleHRTdWZmaXhcbiAgICAgICAgICAgICAgICB0aGlzLnBhc3RlSHRtbCh0ZXh0LCBpbmZvLm1lbnRpb25Qb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgaW5mby5tZW50aW9uUG9zaXRpb24gKyBpbmZvLm1lbnRpb25UZXh0Lmxlbmd0aCArIDEpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnRleHQuZWxlbWVudC5kaXNwYXRjaEV2ZW50KHJlcGxhY2VFdmVudClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBhc3RlSHRtbChodG1sLCBzdGFydFBvcywgZW5kUG9zKSB7XG4gICAgICAgIGxldCByYW5nZSwgc2VsXG4gICAgICAgIHNlbCA9IHRoaXMuZ2V0V2luZG93U2VsZWN0aW9uKClcbiAgICAgICAgcmFuZ2UgPSB0aGlzLmdldERvY3VtZW50KCkuY3JlYXRlUmFuZ2UoKVxuICAgICAgICByYW5nZS5zZXRTdGFydChzZWwuYW5jaG9yTm9kZSwgc3RhcnRQb3MpXG4gICAgICAgIHJhbmdlLnNldEVuZChzZWwuYW5jaG9yTm9kZSwgZW5kUG9zKVxuICAgICAgICByYW5nZS5kZWxldGVDb250ZW50cygpXG5cbiAgICAgICAgbGV0IGVsID0gdGhpcy5nZXREb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIGVsLmlubmVySFRNTCA9IGh0bWxcbiAgICAgICAgbGV0IGZyYWcgPSB0aGlzLmdldERvY3VtZW50KCkuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuICAgICAgICAgICAgbm9kZSwgbGFzdE5vZGVcbiAgICAgICAgd2hpbGUgKChub2RlID0gZWwuZmlyc3RDaGlsZCkpIHtcbiAgICAgICAgICAgIGxhc3ROb2RlID0gZnJhZy5hcHBlbmRDaGlsZChub2RlKVxuICAgICAgICB9XG4gICAgICAgIHJhbmdlLmluc2VydE5vZGUoZnJhZylcblxuICAgICAgICAvLyBQcmVzZXJ2ZSB0aGUgc2VsZWN0aW9uXG4gICAgICAgIGlmIChsYXN0Tm9kZSkge1xuICAgICAgICAgICAgcmFuZ2UgPSByYW5nZS5jbG9uZVJhbmdlKClcbiAgICAgICAgICAgIHJhbmdlLnNldFN0YXJ0QWZ0ZXIobGFzdE5vZGUpXG4gICAgICAgICAgICByYW5nZS5jb2xsYXBzZSh0cnVlKVxuICAgICAgICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpXG4gICAgICAgICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRXaW5kb3dTZWxlY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnRyaWJ1dGUuY29sbGVjdGlvbi5pZnJhbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyaWJ1dGUuY29sbGVjdGlvbi5pZnJhbWUuY29udGVudFdpbmRvdy5nZXRTZWxlY3Rpb24oKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRTZWxlY3Rpb24oKVxuICAgIH1cblxuICAgIGdldE5vZGVQb3NpdGlvbkluUGFyZW50KGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudC5wYXJlbnROb2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBub2RlID0gZWxlbWVudC5wYXJlbnROb2RlLmNoaWxkTm9kZXNbaV1cblxuICAgICAgICAgICAgaWYgKG5vZGUgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q29udGVudEVkaXRhYmxlU2VsZWN0ZWRQYXRoKGN0eCkge1xuICAgICAgICBsZXQgc2VsID0gdGhpcy5nZXRXaW5kb3dTZWxlY3Rpb24oKVxuICAgICAgICBsZXQgc2VsZWN0ZWQgPSBzZWwuYW5jaG9yTm9kZVxuICAgICAgICBsZXQgcGF0aCA9IFtdXG4gICAgICAgIGxldCBvZmZzZXRcblxuICAgICAgICBpZiAoc2VsZWN0ZWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IGlcbiAgICAgICAgICAgIGxldCBjZSA9IHNlbGVjdGVkLmNvbnRlbnRFZGl0YWJsZVxuICAgICAgICAgICAgd2hpbGUgKHNlbGVjdGVkICE9PSBudWxsICYmIGNlICE9PSAndHJ1ZScpIHtcbiAgICAgICAgICAgICAgICBpID0gdGhpcy5nZXROb2RlUG9zaXRpb25JblBhcmVudChzZWxlY3RlZClcbiAgICAgICAgICAgICAgICBwYXRoLnB1c2goaSlcbiAgICAgICAgICAgICAgICBzZWxlY3RlZCA9IHNlbGVjdGVkLnBhcmVudE5vZGVcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2UgPSBzZWxlY3RlZC5jb250ZW50RWRpdGFibGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXRoLnJldmVyc2UoKVxuXG4gICAgICAgICAgICAvLyBnZXRSYW5nZUF0IG1heSBub3QgZXhpc3QsIG5lZWQgYWx0ZXJuYXRpdmVcbiAgICAgICAgICAgIG9mZnNldCA9IHNlbC5nZXRSYW5nZUF0KDApLnN0YXJ0T2Zmc2V0XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQ6IHNlbGVjdGVkLFxuICAgICAgICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFRleHRQcmVjZWRpbmdDdXJyZW50U2VsZWN0aW9uKCkge1xuICAgICAgICBsZXQgY29udGV4dCA9IHRoaXMudHJpYnV0ZS5jdXJyZW50LFxuICAgICAgICAgICAgdGV4dCA9ICcnXG5cbiAgICAgICAgaWYgKCF0aGlzLmlzQ29udGVudEVkaXRhYmxlKGNvbnRleHQuZWxlbWVudCkpIHtcbiAgICAgICAgICAgIGxldCB0ZXh0Q29tcG9uZW50ID0gdGhpcy50cmlidXRlLmN1cnJlbnQuZWxlbWVudDtcbiAgICAgICAgICAgIGlmICh0ZXh0Q29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXJ0UG9zID0gdGV4dENvbXBvbmVudC5zZWxlY3Rpb25TdGFydFxuICAgICAgICAgICAgICAgIGlmICh0ZXh0Q29tcG9uZW50LnZhbHVlICYmIHN0YXJ0UG9zID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9IHRleHRDb21wb25lbnQudmFsdWUuc3Vic3RyaW5nKDAsIHN0YXJ0UG9zKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHNlbGVjdGVkRWxlbSA9IHRoaXMuZ2V0V2luZG93U2VsZWN0aW9uKCkuYW5jaG9yTm9kZVxuXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRFbGVtICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgd29ya2luZ05vZGVDb250ZW50ID0gc2VsZWN0ZWRFbGVtLnRleHRDb250ZW50XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdFN0YXJ0T2Zmc2V0ID0gdGhpcy5nZXRXaW5kb3dTZWxlY3Rpb24oKS5nZXRSYW5nZUF0KDApLnN0YXJ0T2Zmc2V0XG5cbiAgICAgICAgICAgICAgICBpZiAod29ya2luZ05vZGVDb250ZW50ICYmIHNlbGVjdFN0YXJ0T2Zmc2V0ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9IHdvcmtpbmdOb2RlQ29udGVudC5zdWJzdHJpbmcoMCwgc2VsZWN0U3RhcnRPZmZzZXQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRleHRcbiAgICB9XG5cbiAgICBnZXRUcmlnZ2VySW5mbyhtZW51QWxyZWFkeUFjdGl2ZSwgaGFzVHJhaWxpbmdTcGFjZSwgcmVxdWlyZUxlYWRpbmdTcGFjZSwgYWxsb3dTcGFjZXMpIHtcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMudHJpYnV0ZS5jdXJyZW50XG4gICAgICAgIGxldCBzZWxlY3RlZCwgcGF0aCwgb2Zmc2V0XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzQ29udGVudEVkaXRhYmxlKGN0eC5lbGVtZW50KSkge1xuICAgICAgICAgICAgc2VsZWN0ZWQgPSB0aGlzLnRyaWJ1dGUuY3VycmVudC5lbGVtZW50XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgc2VsZWN0aW9uSW5mbyA9IHRoaXMuZ2V0Q29udGVudEVkaXRhYmxlU2VsZWN0ZWRQYXRoKGN0eClcblxuICAgICAgICAgICAgaWYgKHNlbGVjdGlvbkluZm8pIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZCA9IHNlbGVjdGlvbkluZm8uc2VsZWN0ZWRcbiAgICAgICAgICAgICAgICBwYXRoID0gc2VsZWN0aW9uSW5mby5wYXRoXG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gc2VsZWN0aW9uSW5mby5vZmZzZXRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBlZmZlY3RpdmVSYW5nZSA9IHRoaXMuZ2V0VGV4dFByZWNlZGluZ0N1cnJlbnRTZWxlY3Rpb24oKVxuXG4gICAgICAgIGlmIChlZmZlY3RpdmVSYW5nZSAhPT0gdW5kZWZpbmVkICYmIGVmZmVjdGl2ZVJhbmdlICE9PSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgbW9zdFJlY2VudFRyaWdnZXJDaGFyUG9zID0gLTFcbiAgICAgICAgICAgIGxldCB0cmlnZ2VyQ2hhclxuXG4gICAgICAgICAgICB0aGlzLnRyaWJ1dGUuY29sbGVjdGlvbi5mb3JFYWNoKGNvbmZpZyA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGMgPSBjb25maWcudHJpZ2dlclxuICAgICAgICAgICAgICAgIGxldCBpZHggPSBjb25maWcucmVxdWlyZUxlYWRpbmdTcGFjZSA/XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4V2l0aExlYWRpbmdTcGFjZShlZmZlY3RpdmVSYW5nZSwgYykgOlxuICAgICAgICAgICAgICAgICAgICBlZmZlY3RpdmVSYW5nZS5sYXN0SW5kZXhPZihjKVxuXG4gICAgICAgICAgICAgICAgaWYgKGlkeCA+IG1vc3RSZWNlbnRUcmlnZ2VyQ2hhclBvcykge1xuICAgICAgICAgICAgICAgICAgICBtb3N0UmVjZW50VHJpZ2dlckNoYXJQb3MgPSBpZHhcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlckNoYXIgPSBjXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVMZWFkaW5nU3BhY2UgPSBjb25maWcucmVxdWlyZUxlYWRpbmdTcGFjZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGlmIChtb3N0UmVjZW50VHJpZ2dlckNoYXJQb3MgPj0gMCAmJlxuICAgICAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICAgICAgbW9zdFJlY2VudFRyaWdnZXJDaGFyUG9zID09PSAwIHx8XG4gICAgICAgICAgICAgICAgICAgICFyZXF1aXJlTGVhZGluZ1NwYWNlIHx8XG4gICAgICAgICAgICAgICAgICAgIC9bXFx4QTBcXHNdL2cudGVzdChcbiAgICAgICAgICAgICAgICAgICAgICAgIGVmZmVjdGl2ZVJhbmdlLnN1YnN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3N0UmVjZW50VHJpZ2dlckNoYXJQb3MgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vc3RSZWNlbnRUcmlnZ2VyQ2hhclBvcylcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50VHJpZ2dlclNuaXBwZXQgPSBlZmZlY3RpdmVSYW5nZS5zdWJzdHJpbmcobW9zdFJlY2VudFRyaWdnZXJDaGFyUG9zICsgMSxcbiAgICAgICAgICAgICAgICAgICAgZWZmZWN0aXZlUmFuZ2UubGVuZ3RoKVxuXG4gICAgICAgICAgICAgICAgdHJpZ2dlckNoYXIgPSBlZmZlY3RpdmVSYW5nZS5zdWJzdHJpbmcobW9zdFJlY2VudFRyaWdnZXJDaGFyUG9zLCBtb3N0UmVjZW50VHJpZ2dlckNoYXJQb3MgKyAxKVxuICAgICAgICAgICAgICAgIGxldCBmaXJzdFNuaXBwZXRDaGFyID0gY3VycmVudFRyaWdnZXJTbmlwcGV0LnN1YnN0cmluZygwLCAxKVxuICAgICAgICAgICAgICAgIGxldCBsZWFkaW5nU3BhY2UgPSBjdXJyZW50VHJpZ2dlclNuaXBwZXQubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFNuaXBwZXRDaGFyID09PSAnICcgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0U25pcHBldENoYXIgPT09ICdcXHhBMCdcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIGlmIChoYXNUcmFpbGluZ1NwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUcmlnZ2VyU25pcHBldCA9IGN1cnJlbnRUcmlnZ2VyU25pcHBldC50cmltKClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgcmVnZXggPSBhbGxvd1NwYWNlcyA/IC9bXlxcUyBdL2cgOiAvW1xceEEwXFxzXS9nO1xuXG4gICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLmhhc1RyYWlsaW5nU3BhY2UgPSByZWdleC50ZXN0KGN1cnJlbnRUcmlnZ2VyU25pcHBldCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWxlYWRpbmdTcGFjZSAmJiAobWVudUFscmVhZHlBY3RpdmUgfHwgIShyZWdleC50ZXN0KGN1cnJlbnRUcmlnZ2VyU25pcHBldCkpKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVudGlvblBvc2l0aW9uOiBtb3N0UmVjZW50VHJpZ2dlckNoYXJQb3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW50aW9uVGV4dDogY3VycmVudFRyaWdnZXJTbmlwcGV0LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVudGlvblNlbGVjdGVkRWxlbWVudDogc2VsZWN0ZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW50aW9uU2VsZWN0ZWRQYXRoOiBwYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVudGlvblNlbGVjdGVkT2Zmc2V0OiBvZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW50aW9uVHJpZ2dlckNoYXI6IHRyaWdnZXJDaGFyXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsYXN0SW5kZXhXaXRoTGVhZGluZ1NwYWNlIChzdHIsIGNoYXIpIHtcbiAgICAgICAgbGV0IHJldmVyc2VkU3RyID0gc3RyLnNwbGl0KCcnKS5yZXZlcnNlKCkuam9pbignJylcbiAgICAgICAgbGV0IGluZGV4ID0gLTFcblxuICAgICAgICBmb3IgKGxldCBjaWR4ID0gMCwgbGVuID0gc3RyLmxlbmd0aDsgY2lkeCA8IGxlbjsgY2lkeCsrKSB7XG4gICAgICAgICAgICBsZXQgZmlyc3RDaGFyID0gY2lkeCA9PT0gc3RyLmxlbmd0aCAtIDFcbiAgICAgICAgICAgIGxldCBsZWFkaW5nU3BhY2UgPSAvXFxzLy50ZXN0KHJldmVyc2VkU3RyW2NpZHggKyAxXSlcbiAgICAgICAgICAgIGxldCBtYXRjaCA9IGNoYXIgPT09IHJldmVyc2VkU3RyW2NpZHhdXG5cbiAgICAgICAgICAgIGlmIChtYXRjaCAmJiAoZmlyc3RDaGFyIHx8IGxlYWRpbmdTcGFjZSkpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IHN0ci5sZW5ndGggLSAxIC0gY2lkeFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXhcbiAgICB9XG5cbiAgICBpc0NvbnRlbnRFZGl0YWJsZShlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50Lm5vZGVOYW1lICE9PSAnSU5QVVQnICYmIGVsZW1lbnQubm9kZU5hbWUgIT09ICdURVhUQVJFQSdcbiAgICB9XG5cbiAgICBpc01lbnVPZmZTY3JlZW4oY29vcmRpbmF0ZXMsIG1lbnVEaW1lbnNpb25zKSB7XG4gICAgICAgIGxldCBtZW51VG9wID0gdHlwZW9mIGNvb3JkaW5hdGVzLnRvcCA9PT0gJ251bWJlcicgPyBjb29yZGluYXRlcy50b3AgOiBjb29yZGluYXRlcy5ib3R0b20gLSBtZW51RGltZW5zaW9ucy5oZWlnaHRcbiAgICAgICAgbGV0IG1lbnVSaWdodCA9IHR5cGVvZiBjb29yZGluYXRlcy5yaWdodCA9PT0gJ251bWJlcicgPyBjb29yZGluYXRlcy5yaWdodCA6IGNvb3JkaW5hdGVzLmxlZnQgKyBtZW51RGltZW5zaW9ucy53aWR0aFxuICAgICAgICBsZXQgbWVudUJvdHRvbSA9IHR5cGVvZiBjb29yZGluYXRlcy5ib3R0b20gPT09ICdudW1iZXInID8gY29vcmRpbmF0ZXMuYm90dG9tIDogY29vcmRpbmF0ZXMudG9wICsgbWVudURpbWVuc2lvbnMuaGVpZ2h0XG4gICAgICAgIGxldCBtZW51TGVmdCA9IHR5cGVvZiBjb29yZGluYXRlcy5sZWZ0ID09PSAnbnVtYmVyJyA/IGNvb3JkaW5hdGVzLmxlZnQgOiBjb29yZGluYXRlcy5yaWdodCAtIG1lbnVEaW1lbnNpb25zLndpZHRoXG5cbiAgICAgICAgbGV0IHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGhcbiAgICAgICAgbGV0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgICBsZXQgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG4gICAgICAgIGxldCB3aW5kb3dMZWZ0ID0gKHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2Muc2Nyb2xsTGVmdCkgLSAoZG9jLmNsaWVudExlZnQgfHwgMClcbiAgICAgICAgbGV0IHdpbmRvd1RvcCA9ICh3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jLnNjcm9sbFRvcCkgLSAoZG9jLmNsaWVudFRvcCB8fCAwKVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IG1lbnVUb3AgPCBNYXRoLmZsb29yKHdpbmRvd1RvcCksXG4gICAgICAgICAgICByaWdodDogbWVudVJpZ2h0ID4gTWF0aC5jZWlsKHdpbmRvd0xlZnQgKyB3aW5kb3dXaWR0aCksXG4gICAgICAgICAgICBib3R0b206IG1lbnVCb3R0b20gPiBNYXRoLmNlaWwod2luZG93VG9wICsgd2luZG93SGVpZ2h0KSxcbiAgICAgICAgICAgIGxlZnQ6IG1lbnVMZWZ0IDwgTWF0aC5mbG9vcih3aW5kb3dMZWZ0KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TWVudURpbWVuc2lvbnMoKSB7XG4gICAgICAgIC8vIFdpZHRoIG9mIHRoZSBtZW51IGRlcGVuZHMgb2YgaXRzIGNvbnRlbnRzIGFuZCBwb3NpdGlvblxuICAgICAgICAvLyBXZSBtdXN0IGNoZWNrIHdoYXQgaXRzIHdpZHRoIHdvdWxkIGJlIHdpdGhvdXQgYW55IG9ic3RydWN0aW9uXG4gICAgICAgIC8vIFRoaXMgd2F5LCB3ZSBjYW4gYWNoaWV2ZSBnb29kIHBvc2l0aW9uaW5nIGZvciBmbGlwcGluZyB0aGUgbWVudVxuICAgICAgICBsZXQgZGltZW5zaW9ucyA9IHtcbiAgICAgICAgICAgIHdpZHRoOiBudWxsLFxuICAgICAgICAgICAgaGVpZ2h0OiBudWxsXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRyaWJ1dGUubWVudS5zdHlsZS5jc3NUZXh0ID0gYHRvcDogMHB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMHB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGZpeGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4OiAxMDAwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTsgaGlkZGVuO2BcbiAgICAgICBkaW1lbnNpb25zLndpZHRoID0gdGhpcy50cmlidXRlLm1lbnUub2Zmc2V0V2lkdGhcbiAgICAgICBkaW1lbnNpb25zLmhlaWdodCA9IHRoaXMudHJpYnV0ZS5tZW51Lm9mZnNldEhlaWdodFxuXG4gICAgICAgdGhpcy50cmlidXRlLm1lbnUuc3R5bGUuY3NzVGV4dCA9IGBkaXNwbGF5OiBub25lO2BcblxuICAgICAgIHJldHVybiBkaW1lbnNpb25zXG4gICAgfVxuXG4gICAgZ2V0VGV4dEFyZWFPcklucHV0VW5kZXJsaW5lUG9zaXRpb24oZWxlbWVudCwgcG9zaXRpb24sIGZsaXBwZWQpIHtcbiAgICAgICAgbGV0IHByb3BlcnRpZXMgPSBbJ2RpcmVjdGlvbicsICdib3hTaXppbmcnLCAnd2lkdGgnLCAnaGVpZ2h0JywgJ292ZXJmbG93WCcsXG4gICAgICAgICAgICAnb3ZlcmZsb3dZJywgJ2JvcmRlclRvcFdpZHRoJywgJ2JvcmRlclJpZ2h0V2lkdGgnLFxuICAgICAgICAgICAgJ2JvcmRlckJvdHRvbVdpZHRoJywgJ2JvcmRlckxlZnRXaWR0aCcsICdwYWRkaW5nVG9wJyxcbiAgICAgICAgICAgICdwYWRkaW5nUmlnaHQnLCAncGFkZGluZ0JvdHRvbScsICdwYWRkaW5nTGVmdCcsXG4gICAgICAgICAgICAnZm9udFN0eWxlJywgJ2ZvbnRWYXJpYW50JywgJ2ZvbnRXZWlnaHQnLCAnZm9udFN0cmV0Y2gnLFxuICAgICAgICAgICAgJ2ZvbnRTaXplJywgJ2ZvbnRTaXplQWRqdXN0JywgJ2xpbmVIZWlnaHQnLCAnZm9udEZhbWlseScsXG4gICAgICAgICAgICAndGV4dEFsaWduJywgJ3RleHRUcmFuc2Zvcm0nLCAndGV4dEluZGVudCcsXG4gICAgICAgICAgICAndGV4dERlY29yYXRpb24nLCAnbGV0dGVyU3BhY2luZycsICd3b3JkU3BhY2luZydcbiAgICAgICAgXVxuXG4gICAgICAgIGxldCBpc0ZpcmVmb3ggPSAod2luZG93Lm1veklubmVyU2NyZWVuWCAhPT0gbnVsbClcblxuICAgICAgICBsZXQgZGl2ID0gdGhpcy5nZXREb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIGRpdi5pZCA9ICdpbnB1dC10ZXh0YXJlYS1jYXJldC1wb3NpdGlvbi1taXJyb3ItZGl2J1xuICAgICAgICB0aGlzLmdldERvY3VtZW50KCkuYm9keS5hcHBlbmRDaGlsZChkaXYpXG5cbiAgICAgICAgbGV0IHN0eWxlID0gZGl2LnN0eWxlXG4gICAgICAgIGxldCBjb21wdXRlZCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID8gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSA6IGVsZW1lbnQuY3VycmVudFN0eWxlXG5cbiAgICAgICAgc3R5bGUud2hpdGVTcGFjZSA9ICdwcmUtd3JhcCdcbiAgICAgICAgaWYgKGVsZW1lbnQubm9kZU5hbWUgIT09ICdJTlBVVCcpIHtcbiAgICAgICAgICAgIHN0eWxlLndvcmRXcmFwID0gJ2JyZWFrLXdvcmQnXG4gICAgICAgIH1cblxuICAgICAgICAvLyBwb3NpdGlvbiBvZmYtc2NyZWVuXG4gICAgICAgIHN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuICAgICAgICBzdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbidcblxuICAgICAgICAvLyB0cmFuc2ZlciB0aGUgZWxlbWVudCdzIHByb3BlcnRpZXMgdG8gdGhlIGRpdlxuICAgICAgICBwcm9wZXJ0aWVzLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICAgICAgICBzdHlsZVtwcm9wXSA9IGNvbXB1dGVkW3Byb3BdXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKGlzRmlyZWZveCkge1xuICAgICAgICAgICAgc3R5bGUud2lkdGggPSBgJHsocGFyc2VJbnQoY29tcHV0ZWQud2lkdGgpIC0gMil9cHhgXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5zY3JvbGxIZWlnaHQgPiBwYXJzZUludChjb21wdXRlZC5oZWlnaHQpKVxuICAgICAgICAgICAgICAgIHN0eWxlLm92ZXJmbG93WSA9ICdzY3JvbGwnXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG4gICAgICAgIH1cblxuICAgICAgICBkaXYudGV4dENvbnRlbnQgPSBlbGVtZW50LnZhbHVlLnN1YnN0cmluZygwLCBwb3NpdGlvbilcblxuICAgICAgICBpZiAoZWxlbWVudC5ub2RlTmFtZSA9PT0gJ0lOUFVUJykge1xuICAgICAgICAgICAgZGl2LnRleHRDb250ZW50ID0gZGl2LnRleHRDb250ZW50LnJlcGxhY2UoL1xccy9nLCAnwqAnKVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNwYW4gPSB0aGlzLmdldERvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICAgIHNwYW4udGV4dENvbnRlbnQgPSBlbGVtZW50LnZhbHVlLnN1YnN0cmluZyhwb3NpdGlvbikgfHwgJy4nXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChzcGFuKVxuXG4gICAgICAgIGxldCByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICBsZXQgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG4gICAgICAgIGxldCB3aW5kb3dMZWZ0ID0gKHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2Muc2Nyb2xsTGVmdCkgLSAoZG9jLmNsaWVudExlZnQgfHwgMClcbiAgICAgICAgbGV0IHdpbmRvd1RvcCA9ICh3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jLnNjcm9sbFRvcCkgLSAoZG9jLmNsaWVudFRvcCB8fCAwKVxuXG4gICAgICAgIGxldCBjb29yZGluYXRlcyA9IHtcbiAgICAgICAgICAgIHRvcDogcmVjdC50b3AgKyB3aW5kb3dUb3AgKyBzcGFuLm9mZnNldFRvcCArIHBhcnNlSW50KGNvbXB1dGVkLmJvcmRlclRvcFdpZHRoKSArIHBhcnNlSW50KGNvbXB1dGVkLmZvbnRTaXplKSAtIGVsZW1lbnQuc2Nyb2xsVG9wLFxuICAgICAgICAgICAgbGVmdDogcmVjdC5sZWZ0ICsgd2luZG93TGVmdCArIHNwYW4ub2Zmc2V0TGVmdCArIHBhcnNlSW50KGNvbXB1dGVkLmJvcmRlckxlZnRXaWR0aClcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgICAgIGxldCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcblxuICAgICAgICBsZXQgbWVudURpbWVuc2lvbnMgPSB0aGlzLmdldE1lbnVEaW1lbnNpb25zKClcbiAgICAgICAgbGV0IG1lbnVJc09mZlNjcmVlbiA9IHRoaXMuaXNNZW51T2ZmU2NyZWVuKGNvb3JkaW5hdGVzLCBtZW51RGltZW5zaW9ucylcblxuICAgICAgICBpZiAobWVudUlzT2ZmU2NyZWVuLmhvcml6b250YWxseSkge1xuICAgICAgICAgICAgY29vcmRpbmF0ZXMucmlnaHQgPSB3aW5kb3dXaWR0aCAtIGNvb3JkaW5hdGVzLmxlZnRcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzLmxlZnQgPSAnYXV0bydcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwYXJlbnRIZWlnaHQgPSB0aGlzLnRyaWJ1dGUubWVudUNvbnRhaW5lclxuICAgICAgICAgICAgPyB0aGlzLnRyaWJ1dGUubWVudUNvbnRhaW5lci5vZmZzZXRIZWlnaHRcbiAgICAgICAgICAgIDogdGhpcy5nZXREb2N1bWVudCgpLmJvZHkub2Zmc2V0SGVpZ2h0XG5cbiAgICAgICAgaWYgKG1lbnVJc09mZlNjcmVlbi52ZXJ0aWNhbGx5KSB7XG4gICAgICAgICAgICBsZXQgcGFyZW50UmVjdCA9IHRoaXMudHJpYnV0ZS5tZW51Q29udGFpbmVyXG4gICAgICAgICAgICAgICAgPyB0aGlzLnRyaWJ1dGUubWVudUNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICAgICAgICAgIDogdGhpcy5nZXREb2N1bWVudCgpLmJvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICAgIGxldCBzY3JvbGxTdGlsbEF2YWlsYWJsZSA9IHBhcmVudEhlaWdodCAtICh3aW5kb3dIZWlnaHQgLSBwYXJlbnRSZWN0LnRvcClcblxuICAgICAgICAgICAgY29vcmRpbmF0ZXMuYm90dG9tID0gc2Nyb2xsU3RpbGxBdmFpbGFibGUgKyAod2luZG93SGVpZ2h0IC0gcmVjdC50b3AgLSBzcGFuLm9mZnNldFRvcClcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzLnRvcCA9ICdhdXRvJ1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nZXREb2N1bWVudCgpLmJvZHkucmVtb3ZlQ2hpbGQoZGl2KVxuXG4gICAgICAgIHJldHVybiBjb29yZGluYXRlc1xuICAgIH1cblxuICAgIGdldENvbnRlbnRFZGl0YWJsZUNhcmV0UG9zaXRpb24oc2VsZWN0ZWROb2RlUG9zaXRpb24pIHtcbiAgICAgICAgbGV0IG1hcmtlclRleHRDaGFyID0gJ++7vydcbiAgICAgICAgbGV0IG1hcmtlckVsLCBtYXJrZXJJZCA9IGBzZWxfJHtuZXcgRGF0ZSgpLmdldFRpbWUoKX1fJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCkuc3Vic3RyKDIpfWBcbiAgICAgICAgbGV0IHJhbmdlXG4gICAgICAgIGxldCBzZWwgPSB0aGlzLmdldFdpbmRvd1NlbGVjdGlvbigpXG4gICAgICAgIGxldCBwcmV2UmFuZ2UgPSBzZWwuZ2V0UmFuZ2VBdCgwKVxuXG4gICAgICAgIHJhbmdlID0gdGhpcy5nZXREb2N1bWVudCgpLmNyZWF0ZVJhbmdlKClcbiAgICAgICAgcmFuZ2Uuc2V0U3RhcnQoc2VsLmFuY2hvck5vZGUsIHNlbGVjdGVkTm9kZVBvc2l0aW9uKVxuICAgICAgICByYW5nZS5zZXRFbmQoc2VsLmFuY2hvck5vZGUsIHNlbGVjdGVkTm9kZVBvc2l0aW9uKVxuXG4gICAgICAgIHJhbmdlLmNvbGxhcHNlKGZhbHNlKVxuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgbWFya2VyIGVsZW1lbnQgY29udGFpbmluZyBhIHNpbmdsZSBpbnZpc2libGUgY2hhcmFjdGVyIHVzaW5nIERPTSBtZXRob2RzIGFuZCBpbnNlcnQgaXRcbiAgICAgICAgbWFya2VyRWwgPSB0aGlzLmdldERvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICAgIG1hcmtlckVsLmlkID0gbWFya2VySWRcblxuICAgICAgICBtYXJrZXJFbC5hcHBlbmRDaGlsZCh0aGlzLmdldERvY3VtZW50KCkuY3JlYXRlVGV4dE5vZGUobWFya2VyVGV4dENoYXIpKVxuICAgICAgICByYW5nZS5pbnNlcnROb2RlKG1hcmtlckVsKVxuICAgICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKClcbiAgICAgICAgc2VsLmFkZFJhbmdlKHByZXZSYW5nZSlcblxuICAgICAgICBsZXQgcmVjdCA9IG1hcmtlckVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgIGxldCBkb2MgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcbiAgICAgICAgbGV0IHdpbmRvd0xlZnQgPSAod2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvYy5zY3JvbGxMZWZ0KSAtIChkb2MuY2xpZW50TGVmdCB8fCAwKVxuICAgICAgICBsZXQgd2luZG93VG9wID0gKHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2Muc2Nyb2xsVG9wKSAtIChkb2MuY2xpZW50VG9wIHx8IDApXG4gICAgICAgIGxldCBjb29yZGluYXRlcyA9IHtcbiAgICAgICAgICAgIGxlZnQ6IHJlY3QubGVmdCArIHdpbmRvd0xlZnQsXG4gICAgICAgICAgICB0b3A6IHJlY3QudG9wICsgbWFya2VyRWwub2Zmc2V0SGVpZ2h0ICsgd2luZG93VG9wXG4gICAgICAgIH1cbiAgICAgICAgbGV0IHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGhcbiAgICAgICAgbGV0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuXG4gICAgICAgIGxldCBtZW51RGltZW5zaW9ucyA9IHRoaXMuZ2V0TWVudURpbWVuc2lvbnMoKVxuICAgICAgICBsZXQgbWVudUlzT2ZmU2NyZWVuID0gdGhpcy5pc01lbnVPZmZTY3JlZW4oY29vcmRpbmF0ZXMsIG1lbnVEaW1lbnNpb25zKVxuXG4gICAgICAgIGlmIChtZW51SXNPZmZTY3JlZW4ucmlnaHQpIHtcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzLmxlZnQgPSAnYXV0bydcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzLnJpZ2h0ID0gd2luZG93V2lkdGggLSByZWN0LmxlZnQgLSB3aW5kb3dMZWZ0XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcGFyZW50UmVjdCA9IHRoaXMudHJpYnV0ZS5tZW51Q29udGFpbmVyXG4gICAgICAgICAgICA/IHRoaXMudHJpYnV0ZS5tZW51Q29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgICA6IHRoaXMuZ2V0RG9jdW1lbnQoKS5ib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgIGxldCBwYXJlbnRIZWlnaHQgPSB0aGlzLnRyaWJ1dGUubWVudUNvbnRhaW5lclxuICAgICAgICAgICAgPyB0aGlzLnRyaWJ1dGUubWVudUNvbnRhaW5lci5vZmZzZXRIZWlnaHRcbiAgICAgICAgICAgIDogdGhpcy5nZXREb2N1bWVudCgpLmJvZHkub2Zmc2V0SGVpZ2h0XG5cbiAgICAgICAgaWYgKG1lbnVJc09mZlNjcmVlbi5ib3R0b20pIHtcbiAgICAgICAgICAgIGxldCBzY3JvbGxTdGlsbEF2YWlsYWJsZSA9IHBhcmVudEhlaWdodCAtICh3aW5kb3dIZWlnaHQgLSBwYXJlbnRSZWN0LnRvcClcblxuICAgICAgICAgICAgd2luZG93TGVmdCA9ICh3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jLnNjcm9sbExlZnQpIC0gKGRvYy5jbGllbnRMZWZ0IHx8IDApXG4gICAgICAgICAgICB3aW5kb3dUb3AgPSAod2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvYy5zY3JvbGxUb3ApIC0gKGRvYy5jbGllbnRUb3AgfHwgMClcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzLnRvcCA9ICdhdXRvJ1xuICAgICAgICAgICAgY29vcmRpbmF0ZXMuYm90dG9tID0gc2Nyb2xsU3RpbGxBdmFpbGFibGUgKyAod2luZG93SGVpZ2h0IC0gcmVjdC50b3ApXG4gICAgICAgIH1cblxuICAgICAgICBtZW51SXNPZmZTY3JlZW4gPSB0aGlzLmlzTWVudU9mZlNjcmVlbihjb29yZGluYXRlcywgbWVudURpbWVuc2lvbnMpXG4gICAgICAgIGlmIChtZW51SXNPZmZTY3JlZW4ubGVmdCkge1xuICAgICAgICAgICAgaWYgKHdpbmRvd1dpZHRoID4gbWVudURpbWVuc2lvbnMud2lkdGgpIHtcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlcy5sZWZ0ID0gJ2F1dG8nXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXMucmlnaHQgPSBwYXJlbnRSZWN0LnJpZ2h0IC0gd2luZG93TGVmdCAtIHdpbmRvd1dpZHRoXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzLmxlZnQgPSB3aW5kb3dMZWZ0XG4gICAgICAgICAgICAgICAgZGVsZXRlIGNvb3JkaW5hdGVzLnJpZ2h0XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lbnVJc09mZlNjcmVlbi50b3ApIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3dIZWlnaHQgPiBtZW51RGltZW5zaW9ucy5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlcy50b3AgPSAnYXV0bydcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlcy5ib3R0b20gPSBwYXJlbnRSZWN0LmJvdHRvbSAtIHdpbmRvd1RvcCAtIHdpbmRvd0hlaWdodFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlcy50b3AgPSB3aW5kb3dUb3BcbiAgICAgICAgICAgICAgICBkZWxldGUgY29vcmRpbmF0ZXMuYm90dG9tXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBtYXJrZXJFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG1hcmtlckVsKVxuICAgICAgICByZXR1cm4gY29vcmRpbmF0ZXNcbiAgICB9XG5cbiAgICBzY3JvbGxJbnRvVmlldyhlbGVtKSB7XG4gICAgICAgIGxldCByZWFzb25hYmxlQnVmZmVyID0gMjAsXG4gICAgICAgICAgICBjbGllbnRSZWN0XG4gICAgICAgIGxldCBtYXhTY3JvbGxEaXNwbGFjZW1lbnQgPSAxMDBcbiAgICAgICAgbGV0IGUgPSB0aGlzLm1lbnVcblxuICAgICAgICBpZiAodHlwZW9mIGUgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG5cbiAgICAgICAgd2hpbGUgKGNsaWVudFJlY3QgPT09IHVuZGVmaW5lZCB8fCBjbGllbnRSZWN0LmhlaWdodCA9PT0gMCkge1xuICAgICAgICAgICAgY2xpZW50UmVjdCA9IGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgICAgICAgICAgaWYgKGNsaWVudFJlY3QuaGVpZ2h0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZSA9IGUuY2hpbGROb2Rlc1swXVxuICAgICAgICAgICAgICAgIGlmIChlID09PSB1bmRlZmluZWQgfHwgIWUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBlbGVtVG9wID0gY2xpZW50UmVjdC50b3BcbiAgICAgICAgbGV0IGVsZW1Cb3R0b20gPSBlbGVtVG9wICsgY2xpZW50UmVjdC5oZWlnaHRcblxuICAgICAgICBpZiAoZWxlbVRvcCA8IDApIHtcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCB3aW5kb3cucGFnZVlPZmZzZXQgKyBjbGllbnRSZWN0LnRvcCAtIHJlYXNvbmFibGVCdWZmZXIpXG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbUJvdHRvbSA+IHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgICAgICAgbGV0IG1heFkgPSB3aW5kb3cucGFnZVlPZmZzZXQgKyBjbGllbnRSZWN0LnRvcCAtIHJlYXNvbmFibGVCdWZmZXJcblxuICAgICAgICAgICAgaWYgKG1heFkgLSB3aW5kb3cucGFnZVlPZmZzZXQgPiBtYXhTY3JvbGxEaXNwbGFjZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBtYXhZID0gd2luZG93LnBhZ2VZT2Zmc2V0ICsgbWF4U2Nyb2xsRGlzcGxhY2VtZW50XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB0YXJnZXRZID0gd2luZG93LnBhZ2VZT2Zmc2V0IC0gKHdpbmRvdy5pbm5lckhlaWdodCAtIGVsZW1Cb3R0b20pXG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRZID4gbWF4WSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFkgPSBtYXhZXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCB0YXJnZXRZKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFRyaWJ1dGVSYW5nZTtcbiIsIi8vIFRoYW5rcyB0byBodHRwczovL2dpdGh1Yi5jb20vbWF0dHlvcmsvZnV6enlcbmNsYXNzIFRyaWJ1dGVTZWFyY2gge1xuICAgIGNvbnN0cnVjdG9yKHRyaWJ1dGUpIHtcbiAgICAgICAgdGhpcy50cmlidXRlID0gdHJpYnV0ZVxuICAgICAgICB0aGlzLnRyaWJ1dGUuc2VhcmNoID0gdGhpc1xuICAgIH1cblxuICAgIHNpbXBsZUZpbHRlcihwYXR0ZXJuLCBhcnJheSkge1xuICAgICAgICByZXR1cm4gYXJyYXkuZmlsdGVyKHN0cmluZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZXN0KHBhdHRlcm4sIHN0cmluZylcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICB0ZXN0KHBhdHRlcm4sIHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXRjaChwYXR0ZXJuLCBzdHJpbmcpICE9PSBudWxsXG4gICAgfVxuXG4gICAgbWF0Y2gocGF0dGVybiwgc3RyaW5nLCBvcHRzKSB7XG4gICAgICAgIG9wdHMgPSBvcHRzIHx8IHt9XG4gICAgICAgIGxldCBwYXR0ZXJuSWR4ID0gMCxcbiAgICAgICAgICAgIHJlc3VsdCA9IFtdLFxuICAgICAgICAgICAgbGVuID0gc3RyaW5nLmxlbmd0aCxcbiAgICAgICAgICAgIHRvdGFsU2NvcmUgPSAwLFxuICAgICAgICAgICAgY3VyclNjb3JlID0gMCxcbiAgICAgICAgICAgIHByZSA9IG9wdHMucHJlIHx8ICcnLFxuICAgICAgICAgICAgcG9zdCA9IG9wdHMucG9zdCB8fCAnJyxcbiAgICAgICAgICAgIGNvbXBhcmVTdHJpbmcgPSBvcHRzLmNhc2VTZW5zaXRpdmUgJiYgc3RyaW5nIHx8IHN0cmluZy50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgY2gsIGNvbXBhcmVDaGFyXG5cbiAgICAgICAgcGF0dGVybiA9IG9wdHMuY2FzZVNlbnNpdGl2ZSAmJiBwYXR0ZXJuIHx8IHBhdHRlcm4udG9Mb3dlckNhc2UoKVxuXG4gICAgICAgIGxldCBwYXR0ZXJuQ2FjaGUgPSB0aGlzLnRyYXZlcnNlKGNvbXBhcmVTdHJpbmcsIHBhdHRlcm4sIDAsIDAsIFtdKVxuICAgICAgICBpZiAoIXBhdHRlcm5DYWNoZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZW5kZXJlZDogdGhpcy5yZW5kZXIoc3RyaW5nLCBwYXR0ZXJuQ2FjaGUuY2FjaGUsIHByZSwgcG9zdCksXG4gICAgICAgICAgICBzY29yZTogcGF0dGVybkNhY2hlLnNjb3JlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0cmF2ZXJzZShzdHJpbmcsIHBhdHRlcm4sIHN0cmluZ0luZGV4LCBwYXR0ZXJuSW5kZXgsIHBhdHRlcm5DYWNoZSkge1xuICAgICAgICAvLyBpZiB0aGUgcGF0dGVybiBzZWFyY2ggYXQgZW5kXG4gICAgICAgIGlmIChwYXR0ZXJuLmxlbmd0aCA9PT0gcGF0dGVybkluZGV4KSB7XG5cbiAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBzY29yZSBhbmQgY29weSB0aGUgY2FjaGUgY29udGFpbmluZyB0aGUgaW5kaWNlcyB3aGVyZSBpdCdzIGZvdW5kXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNjb3JlOiB0aGlzLmNhbGN1bGF0ZVNjb3JlKHBhdHRlcm5DYWNoZSksXG4gICAgICAgICAgICAgICAgY2FjaGU6IHBhdHRlcm5DYWNoZS5zbGljZSgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiBzdHJpbmcgYXQgZW5kIG9yIHJlbWFpbmluZyBwYXR0ZXJuID4gcmVtYWluaW5nIHN0cmluZ1xuICAgICAgICBpZiAoc3RyaW5nLmxlbmd0aCA9PT0gc3RyaW5nSW5kZXggfHwgcGF0dGVybi5sZW5ndGggLSBwYXR0ZXJuSW5kZXggPiBzdHJpbmcubGVuZ3RoIC0gc3RyaW5nSW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjID0gcGF0dGVybltwYXR0ZXJuSW5kZXhdXG4gICAgICAgIGxldCBpbmRleCA9IHN0cmluZy5pbmRleE9mKGMsIHN0cmluZ0luZGV4KVxuICAgICAgICBsZXQgYmVzdCwgdGVtcFxuXG4gICAgICAgIHdoaWxlIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICBwYXR0ZXJuQ2FjaGUucHVzaChpbmRleClcbiAgICAgICAgICAgIHRlbXAgPSB0aGlzLnRyYXZlcnNlKHN0cmluZywgcGF0dGVybiwgaW5kZXggKyAxLCBwYXR0ZXJuSW5kZXggKyAxLCBwYXR0ZXJuQ2FjaGUpXG4gICAgICAgICAgICBwYXR0ZXJuQ2FjaGUucG9wKClcblxuICAgICAgICAgICAgLy8gaWYgZG93bnN0cmVhbSB0cmF2ZXJzYWwgZmFpbGVkLCByZXR1cm4gYmVzdCBhbnN3ZXIgc28gZmFyXG4gICAgICAgICAgICBpZiAoIXRlbXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmVzdFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWJlc3QgfHwgYmVzdC5zY29yZSA8IHRlbXAuc2NvcmUpIHtcbiAgICAgICAgICAgICAgICBiZXN0ID0gdGVtcFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbmRleCA9IHN0cmluZy5pbmRleE9mKGMsIGluZGV4ICsgMSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBiZXN0XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlU2NvcmUocGF0dGVybkNhY2hlKSB7XG4gICAgICAgIGxldCBzY29yZSA9IDBcbiAgICAgICAgbGV0IHRlbXAgPSAxXG5cbiAgICAgICAgcGF0dGVybkNhY2hlLmZvckVhY2goKGluZGV4LCBpKSA9PiB7XG4gICAgICAgICAgICBpZiAoaSA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAocGF0dGVybkNhY2hlW2kgLSAxXSArIDEgPT09IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAgKz0gdGVtcCArIDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAgPSAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY29yZSArPSB0ZW1wXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHNjb3JlXG4gICAgfVxuXG4gICAgcmVuZGVyKHN0cmluZywgaW5kaWNlcywgcHJlLCBwb3N0KSB7XG4gICAgICAgIHZhciByZW5kZXJlZCA9IHN0cmluZy5zdWJzdHJpbmcoMCwgaW5kaWNlc1swXSlcblxuICAgICAgICBpbmRpY2VzLmZvckVhY2goKGluZGV4LCBpKSA9PiB7XG4gICAgICAgICAgICByZW5kZXJlZCArPSBwcmUgKyBzdHJpbmdbaW5kZXhdICsgcG9zdCArXG4gICAgICAgICAgICAgICAgc3RyaW5nLnN1YnN0cmluZyhpbmRleCArIDEsIChpbmRpY2VzW2kgKyAxXSkgPyBpbmRpY2VzW2kgKyAxXSA6IHN0cmluZy5sZW5ndGgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHJlbmRlcmVkXG4gICAgfVxuXG4gICAgZmlsdGVyKHBhdHRlcm4sIGFyciwgb3B0cykge1xuICAgICAgICBvcHRzID0gb3B0cyB8fCB7fVxuICAgICAgICByZXR1cm4gYXJyXG4gICAgICAgICAgICAucmVkdWNlKChwcmV2LCBlbGVtZW50LCBpZHgsIGFycikgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBzdHIgPSBlbGVtZW50XG5cbiAgICAgICAgICAgICAgICBpZiAob3B0cy5leHRyYWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHN0ciA9IG9wdHMuZXh0cmFjdChlbGVtZW50KVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghc3RyKSB7IC8vIHRha2UgY2FyZSBvZiB1bmRlZmluZWRzIC8gbnVsbHMgLyBldGMuXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgPSAnJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IHJlbmRlcmVkID0gdGhpcy5tYXRjaChwYXR0ZXJuLCBzdHIsIG9wdHMpXG5cbiAgICAgICAgICAgICAgICBpZiAocmVuZGVyZWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBwcmV2W3ByZXYubGVuZ3RoXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZzogcmVuZGVyZWQucmVuZGVyZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29yZTogcmVuZGVyZWQuc2NvcmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogaWR4LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBwcmV2XG4gICAgICAgICAgICB9LCBbXSlcblxuICAgICAgICAuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgbGV0IGNvbXBhcmUgPSBiLnNjb3JlIC0gYS5zY29yZVxuICAgICAgICAgICAgaWYgKGNvbXBhcmUpIHJldHVybiBjb21wYXJlXG4gICAgICAgICAgICByZXR1cm4gYS5pbmRleCAtIGIuaW5kZXhcbiAgICAgICAgfSlcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRyaWJ1dGVTZWFyY2g7XG4iLCIvKipcbiogVHJpYnV0ZS5qc1xuKiBOYXRpdmUgRVM2IEphdmFTY3JpcHQgQG1lbnRpb24gUGx1Z2luXG4qKi9cblxuaW1wb3J0IFRyaWJ1dGUgZnJvbSBcIi4vVHJpYnV0ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBUcmlidXRlO1xuIiwiaWYgKCFBcnJheS5wcm90b3R5cGUuZmluZCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24ocHJlZGljYXRlKSB7XG4gICAgICAgIGlmICh0aGlzID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5wcm90b3R5cGUuZmluZCBjYWxsZWQgb24gbnVsbCBvciB1bmRlZmluZWQnKVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgcHJlZGljYXRlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdwcmVkaWNhdGUgbXVzdCBiZSBhIGZ1bmN0aW9uJylcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGlzdCA9IE9iamVjdCh0aGlzKVxuICAgICAgICB2YXIgbGVuZ3RoID0gbGlzdC5sZW5ndGggPj4+IDBcbiAgICAgICAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgdmFyIHZhbHVlXG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFsdWUgPSBsaXN0W2ldXG4gICAgICAgICAgICBpZiAocHJlZGljYXRlLmNhbGwodGhpc0FyZywgdmFsdWUsIGksIGxpc3QpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cbn1cblxuaWYgKHdpbmRvdyAmJiB0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcykge1xuICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7XG4gICAgICBidWJibGVzOiBmYWxzZSxcbiAgICAgIGNhbmNlbGFibGU6IGZhbHNlLFxuICAgICAgZGV0YWlsOiB1bmRlZmluZWRcbiAgICB9XG4gICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpXG4gICAgZXZ0LmluaXRDdXN0b21FdmVudChldmVudCwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsKVxuICAgIHJldHVybiBldnRcbiAgfVxuXG4gaWYgKHR5cGVvZiB3aW5kb3cuRXZlbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICBDdXN0b21FdmVudC5wcm90b3R5cGUgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlXG4gfVxuXG4gIHdpbmRvdy5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50XG59Il19
