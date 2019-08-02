(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Tribute = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
            _ref$autocompleteMode = _ref.autocompleteMode,
            autocompleteMode = _ref$autocompleteMode === undefined ? false : _ref$autocompleteMode,
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
            positionMenu = _ref$positionMenu === undefined ? true : _ref$positionMenu,
            _ref$spaceSelectsMatc = _ref.spaceSelectsMatch,
            spaceSelectsMatch = _ref$spaceSelectsMatc === undefined ? false : _ref$spaceSelectsMatc,
            _ref$searchOpts = _ref.searchOpts,
            searchOpts = _ref$searchOpts === undefined ? {} : _ref$searchOpts,
            _ref$menuItemLimit = _ref.menuItemLimit,
            menuItemLimit = _ref$menuItemLimit === undefined ? null : _ref$menuItemLimit;

        _classCallCheck(this, Tribute);

        this.autocompleteMode = autocompleteMode;
        this.menuSelected = 0;
        this.current = {};
        this.inputEvent = false;
        this.isActive = false;
        this.menuContainer = menuContainer;
        this.allowSpaces = allowSpaces;
        this.replaceTextSuffix = replaceTextSuffix;
        this.positionMenu = positionMenu;
        this.hasTrailingSpace = false;
        this.spaceSelectsMatch = spaceSelectsMatch;

        if (this.autocompleteMode) {
            trigger = '';
            allowSpaces = false;
        }

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

                    return noMatchTemplate || function () {
                        return '';
                    }.bind(_this);
                }(noMatchTemplate),

                // column to search against in the object
                lookup: lookup,

                // column that contains the content to insert by default
                fillAttr: fillAttr,

                // array of objects or a function returning an array of objects
                values: values,

                requireLeadingSpace: requireLeadingSpace,

                searchOpts: searchOpts,

                menuItemLimit: menuItemLimit
            }];
        } else if (collection) {
            if (this.autocompleteMode) console.warn('Tribute in autocomplete mode does not work for collections');
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
                    requireLeadingSpace: item.requireLeadingSpace,
                    searchOpts: item.searchOpts || searchOpts,
                    menuItemLimit: item.menuItemLimit || menuItemLimit
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
                    pre: _this2.current.collection.searchOpts.pre || '<span>',
                    post: _this2.current.collection.searchOpts.post || '</span>',
                    skip: _this2.current.collection.searchOpts.skip,
                    extract: function extract(el) {
                        if (typeof _this2.current.collection.lookup === 'string') {
                            return el[_this2.current.collection.lookup];
                        } else if (typeof _this2.current.collection.lookup === 'function') {
                            return _this2.current.collection.lookup(el, _this2.current.mentionText);
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
                    if (typeof _this2.current.collection.noMatchTemplate === 'function' && !_this2.current.collection.noMatchTemplate() || !_this2.current.collection.noMatchTemplate) {
                        _this2.hideMenu();
                    } else {
                        typeof _this2.current.collection.noMatchTemplate === 'function' ? ul.innerHTML = _this2.current.collection.noMatchTemplate() : ul.innerHTML = _this2.current.collection.noMatchTemplate;
                    }

                    return;
                }

                if (_this2.current.collection.menuItemLimit) {
                    items = items.slice(0, _this2.current.collection.menuItemLimit);
                }

                ul.innerHTML = '';
                var fragment = _this2.range.getDocument().createDocumentFragment();

                items.forEach(function (item, index) {
                    var li = _this2.range.getDocument().createElement('li');
                    li.setAttribute('data-index', index);
                    li.addEventListener('mousemove', function (e) {
                        // let li = e.target;
                        // let index = li.getAttribute('data-index')
                        var _findLiTarget2 = _this2._findLiTarget(e.target),
                            _findLiTarget3 = _slicedToArray(_findLiTarget2, 2),
                            li = _findLiTarget3[0],
                            index = _findLiTarget3[1];

                        if (e.movementY !== 0) {
                            _this2.events.setActiveLi(index);
                        }
                    });
                    if (_this2.menuSelected === index) {
                        li.className = _this2.current.collection.selectClass;
                    }
                    li.innerHTML = _this2.current.collection.menuItemTemplate(item);
                    fragment.appendChild(li);
                });
                ul.appendChild(fragment);
            };

            if (typeof this.current.collection.values === 'function') {
                this.current.collection.values(this.current.mentionText, processValues);
            } else {
                processValues(this.current.collection.values);
            }
        }
    }, {
        key: "_findLiTarget",
        value: function _findLiTarget(el) {
            if (!el) return [];
            var index = el.getAttribute('data-index');
            return !index ? this._findLiTarget(el.parentNode) : [el, index];
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
            if (typeof index !== 'number' || isNaN(index)) return;
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
module.exports = exports.default;

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
                if (instance.tribute.autocompleteMode) {
                    instance.callbacks().triggerChar(event, this, '');
                } else {
                    var keyCode = instance.getKeyCode(instance, this, event);

                    if (isNaN(keyCode) || !keyCode) return;

                    var trigger = instance.tribute.triggers().find(function (trigger) {
                        return trigger.charCodeAt(0) === keyCode;
                    });

                    if (typeof trigger !== 'undefined') {
                        instance.callbacks().triggerChar(event, this, trigger);
                    }
                }
            }

            if ((instance.tribute.current.trigger || instance.tribute.autocompleteMode) && instance.commandEvent === false || instance.tribute.isActive && event.keyCode === 8) {
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
            var info = tribute.range.getTriggerInfo(false, tribute.hasTrailingSpace, true, tribute.allowSpaces, tribute.autocompleteMode);

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
            var info = this.tribute.range.getTriggerInfo(false, this.tribute.hasTrailingSpace, true, this.tribute.allowSpaces, this.tribute.autocompleteMode);

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
                    if (_this.tribute.isActive && _this.tribute.current.filteredItems) {
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
                    if (_this.tribute.isActive) {
                        if (_this.tribute.spaceSelectsMatch) {
                            _this.callbacks().enter(e, el);
                        } else if (!_this.tribute.allowSpaces) {
                            e.stopPropagation();
                            setTimeout(function () {
                                _this.tribute.hideMenu();
                                _this.tribute.isActive = false;
                            }, 0);
                        }
                    }
                },
                up: function up(e, el) {
                    // navigate up ul
                    if (_this.tribute.isActive && _this.tribute.current.filteredItems) {
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
                    if (_this.tribute.isActive && _this.tribute.current.filteredItems) {
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

            if (index) this.tribute.menuSelected = parseInt(index);

            for (var i = 0; i < length; i++) {
                var li = lis[i];
                if (i === this.tribute.menuSelected) {
                    li.classList.add(this.tribute.current.collection.selectClass);

                    var liClientRect = li.getBoundingClientRect();
                    var menuClientRect = this.tribute.menu.getBoundingClientRect();

                    if (liClientRect.bottom > menuClientRect.bottom) {
                        var scrollDistance = liClientRect.bottom - menuClientRect.bottom;
                        this.tribute.menu.scrollTop += scrollDistance;
                    } else if (liClientRect.top < menuClientRect.top) {
                        var _scrollDistance = menuClientRect.top - liClientRect.top;
                        this.tribute.menu.scrollTop -= _scrollDistance;
                    }
                } else {
                    li.classList.remove(this.tribute.current.collection.selectClass);
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
                key: 32,
                value: 'SPACE'
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
module.exports = exports.default;

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

            // fixes IE11 issues with mousedown
            this.tribute.range.getDocument().addEventListener('MSPointerDown', this.menuClickEvent, false);
            this.tribute.range.getDocument().addEventListener('mousedown', this.menuClickEvent, false);
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
            this.tribute.range.getDocument().removeEventListener('mousedown', this.menuClickEvent, false);
            this.tribute.range.getDocument().removeEventListener('MSPointerDown', this.menuClickEvent, false);
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
module.exports = exports.default;

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

            var info = this.getTriggerInfo(false, this.tribute.hasTrailingSpace, true, this.tribute.allowSpaces, this.tribute.autocompleteMode);

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

                this.tribute.menu.style.cssText = 'top: ' + coordinates.top + 'px;\n                                     left: ' + coordinates.left + 'px;\n                                     right: ' + coordinates.right + 'px;\n                                     bottom: ' + coordinates.bottom + 'px;\n                                     position: absolute;\n                                     z-index: 10000;\n                                     display: block;';

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
        key: 'replaceTriggerText',
        value: function replaceTriggerText(text, requireLeadingSpace, hasTrailingSpace, originalEvent, item) {
            var info = this.getTriggerInfo(true, hasTrailingSpace, requireLeadingSpace, this.tribute.allowSpaces, this.tribute.autocompleteMode);

            if (info !== undefined) {
                var context = this.tribute.current;
                var replaceEvent = new CustomEvent('tribute-replaced', {
                    detail: {
                        item: item,
                        instance: context,
                        context: info,
                        event: originalEvent
                    }
                });

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
                    this.pasteHtml(text, info.mentionPosition, info.mentionPosition + info.mentionText.length + !this.tribute.autocompleteMode);
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
        key: 'getLastWordInText',
        value: function getLastWordInText(text) {
            text = text.replace(/\u00A0/g, ' '); // https://stackoverflow.com/questions/29850407/how-do-i-replace-unicode-character-u00a0-with-a-space-in-javascript
            var wordsArray = text.split(' ');
            var worldsCount = wordsArray.length - 1;
            return wordsArray[worldsCount].trim();
        }
    }, {
        key: 'getTriggerInfo',
        value: function getTriggerInfo(menuAlreadyActive, hasTrailingSpace, requireLeadingSpace, allowSpaces, isAutocomplete) {
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
            var lastWordOfEffectiveRange = this.getLastWordInText(effectiveRange);

            if (isAutocomplete) {
                return {
                    mentionPosition: effectiveRange.length - lastWordOfEffectiveRange.length,
                    mentionText: lastWordOfEffectiveRange,
                    mentionSelectedElement: selected,
                    mentionSelectedPath: path,
                    mentionSelectedOffset: offset
                };
            }

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
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            var doc = document.documentElement;
            var windowLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
            var windowTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

            var menuTop = typeof coordinates.top === 'number' ? coordinates.top : windowTop + windowHeight - coordinates.bottom - menuDimensions.height;
            var menuRight = typeof coordinates.right === 'number' ? coordinates.right : coordinates.left + menuDimensions.width;
            var menuBottom = typeof coordinates.bottom === 'number' ? coordinates.bottom : coordinates.top + menuDimensions.height;
            var menuLeft = typeof coordinates.left === 'number' ? coordinates.left : windowLeft + windowWidth - coordinates.right - menuDimensions.width;

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

            if (menuIsOffScreen.right) {
                coordinates.right = windowWidth - coordinates.left;
                coordinates.left = 'auto';
            }

            var parentHeight = this.tribute.menuContainer ? this.tribute.menuContainer.offsetHeight : this.getDocument().body.offsetHeight;

            if (menuIsOffScreen.bottom) {
                var parentRect = this.tribute.menuContainer ? this.tribute.menuContainer.getBoundingClientRect() : this.getDocument().body.getBoundingClientRect();
                var scrollStillAvailable = parentHeight - (windowHeight - parentRect.top);

                coordinates.bottom = scrollStillAvailable + (windowHeight - rect.top - span.offsetTop);
                coordinates.top = 'auto';
            }

            menuIsOffScreen = this.isMenuOffScreen(coordinates, menuDimensions);
            if (menuIsOffScreen.left) {
                coordinates.left = windowWidth > menuDimensions.width ? windowLeft + windowWidth - menuDimensions.width : windowLeft;
                delete coordinates.right;
            }
            if (menuIsOffScreen.top) {
                coordinates.top = windowHeight > menuDimensions.height ? windowTop + windowHeight - menuDimensions.height : windowTop;
                delete coordinates.bottom;
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

            var parentHeight = this.tribute.menuContainer ? this.tribute.menuContainer.offsetHeight : this.getDocument().body.offsetHeight;

            if (menuIsOffScreen.bottom) {
                var parentRect = this.tribute.menuContainer ? this.tribute.menuContainer.getBoundingClientRect() : this.getDocument().body.getBoundingClientRect();
                var scrollStillAvailable = parentHeight - (windowHeight - parentRect.top);

                coordinates.top = 'auto';
                coordinates.bottom = scrollStillAvailable + (windowHeight - rect.top);
            }

            menuIsOffScreen = this.isMenuOffScreen(coordinates, menuDimensions);
            if (menuIsOffScreen.left) {
                coordinates.left = windowWidth > menuDimensions.width ? windowLeft + windowWidth - menuDimensions.width : windowLeft;
                delete coordinates.right;
            }
            if (menuIsOffScreen.top) {
                coordinates.top = windowHeight > menuDimensions.height ? windowTop + windowHeight - menuDimensions.height : windowTop;
                delete coordinates.bottom;
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
module.exports = exports.default;

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

            if (opts.skip) {
                return { rendered: string, score: 0 };
            }

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
module.exports = exports.default;

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

module.exports = exports.default;

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvVHJpYnV0ZS5qcyIsInNyYy9UcmlidXRlRXZlbnRzLmpzIiwic3JjL1RyaWJ1dGVNZW51RXZlbnRzLmpzIiwic3JjL1RyaWJ1dGVSYW5nZS5qcyIsInNyYy9UcmlidXRlU2VhcmNoLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0lBRU0sTztBQUNGLDJCQW9CRztBQUFBOztBQUFBLCtCQW5CQyxNQW1CRDtBQUFBLFlBbkJDLE1BbUJELCtCQW5CVSxJQW1CVjtBQUFBLCtCQWxCQyxNQWtCRDtBQUFBLFlBbEJDLE1Ba0JELCtCQWxCVSxJQWtCVjtBQUFBLG9DQWpCQyxXQWlCRDtBQUFBLFlBakJDLFdBaUJELG9DQWpCZSxXQWlCZjtBQUFBLGdDQWhCQyxPQWdCRDtBQUFBLFlBaEJDLE9BZ0JELGdDQWhCVyxHQWdCWDtBQUFBLHlDQWZDLGdCQWVEO0FBQUEsWUFmQyxnQkFlRCx5Q0Fmb0IsS0FlcEI7QUFBQSx1Q0FkQyxjQWNEO0FBQUEsWUFkQyxjQWNELHVDQWRrQixJQWNsQjtBQUFBLHlDQWJDLGdCQWFEO0FBQUEsWUFiQyxnQkFhRCx5Q0Fib0IsSUFhcEI7QUFBQSwrQkFaQyxNQVlEO0FBQUEsWUFaQyxNQVlELCtCQVpVLEtBWVY7QUFBQSxpQ0FYQyxRQVdEO0FBQUEsWUFYQyxRQVdELGlDQVhZLE9BV1o7QUFBQSxtQ0FWQyxVQVVEO0FBQUEsWUFWQyxVQVVELG1DQVZjLElBVWQ7QUFBQSxzQ0FUQyxhQVNEO0FBQUEsWUFUQyxhQVNELHNDQVRpQixJQVNqQjtBQUFBLHdDQVJDLGVBUUQ7QUFBQSxZQVJDLGVBUUQsd0NBUm1CLElBUW5CO0FBQUEseUNBUEMsbUJBT0Q7QUFBQSxZQVBDLG1CQU9ELHlDQVB1QixJQU92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UUFDN0MsV0FENkMsR0FDdEQsU0FBUyxXQUFULENBQXFCLEtBQXJCLEVBQTRCLE1BQTVCLEVBQW9DO0FBQ2xDLGlCQUFTLFVBQVU7QUFDakIscUJBQVMsS0FEUTtBQUVqQix3QkFBWSxLQUZLO0FBR2pCLG9CQUFRO0FBSFMsU0FBbkI7QUFLQSxZQUFJLE1BQU0sU0FBUyxXQUFULENBQXFCLGFBQXJCLENBQVY7QUFDQSxZQUFJLGVBQUosQ0FBb0IsS0FBcEIsRUFBMkIsT0FBTyxPQUFsQyxFQUEyQyxPQUFPLFVBQWxELEVBQThELE9BQU8sTUFBckU7QUFDQSxlQUFPLEdBQVA7QUFDRCxLQVZxRDs7QUFZdkQsUUFBSSxPQUFPLE9BQU8sS0FBZCxLQUF3QixXQUE1QixFQUF5QztBQUN2QyxvQkFBWSxTQUFaLEdBQXdCLE9BQU8sS0FBUCxDQUFhLFNBQXJDO0FBQ0Q7O0FBRUEsV0FBTyxXQUFQLEdBQXFCLFdBQXJCO0FBQ0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgVHJpYnV0ZVV0aWxzIGZyb20gXCIuL3V0aWxzXCI7XHJcbmltcG9ydCBUcmlidXRlRXZlbnRzIGZyb20gXCIuL1RyaWJ1dGVFdmVudHNcIjtcclxuaW1wb3J0IFRyaWJ1dGVNZW51RXZlbnRzIGZyb20gXCIuL1RyaWJ1dGVNZW51RXZlbnRzXCI7XHJcbmltcG9ydCBUcmlidXRlUmFuZ2UgZnJvbSBcIi4vVHJpYnV0ZVJhbmdlXCI7XHJcbmltcG9ydCBUcmlidXRlU2VhcmNoIGZyb20gXCIuL1RyaWJ1dGVTZWFyY2hcIjtcclxuXHJcbmNsYXNzIFRyaWJ1dGUge1xyXG4gICAgY29uc3RydWN0b3Ioe1xyXG4gICAgICAgIHZhbHVlcyA9IG51bGwsXHJcbiAgICAgICAgaWZyYW1lID0gbnVsbCxcclxuICAgICAgICBzZWxlY3RDbGFzcyA9ICdoaWdobGlnaHQnLFxyXG4gICAgICAgIHRyaWdnZXIgPSAnQCcsXHJcbiAgICAgICAgYXV0b2NvbXBsZXRlTW9kZSA9IGZhbHNlLFxyXG4gICAgICAgIHNlbGVjdFRlbXBsYXRlID0gbnVsbCxcclxuICAgICAgICBtZW51SXRlbVRlbXBsYXRlID0gbnVsbCxcclxuICAgICAgICBsb29rdXAgPSAna2V5JyxcclxuICAgICAgICBmaWxsQXR0ciA9ICd2YWx1ZScsXHJcbiAgICAgICAgY29sbGVjdGlvbiA9IG51bGwsXHJcbiAgICAgICAgbWVudUNvbnRhaW5lciA9IG51bGwsXHJcbiAgICAgICAgbm9NYXRjaFRlbXBsYXRlID0gbnVsbCxcclxuICAgICAgICByZXF1aXJlTGVhZGluZ1NwYWNlID0gdHJ1ZSxcclxuICAgICAgICBhbGxvd1NwYWNlcyA9IGZhbHNlLFxyXG4gICAgICAgIHJlcGxhY2VUZXh0U3VmZml4ID0gbnVsbCxcclxuICAgICAgICBwb3NpdGlvbk1lbnUgPSB0cnVlLFxyXG4gICAgICAgIHNwYWNlU2VsZWN0c01hdGNoID0gZmFsc2UsXHJcbiAgICAgICAgc2VhcmNoT3B0cyA9IHt9LFxyXG4gICAgICAgIG1lbnVJdGVtTGltaXQgPSBudWxsLFxyXG4gICAgfSkge1xyXG4gICAgICAgIHRoaXMuYXV0b2NvbXBsZXRlTW9kZSA9IGF1dG9jb21wbGV0ZU1vZGVcclxuICAgICAgICB0aGlzLm1lbnVTZWxlY3RlZCA9IDBcclxuICAgICAgICB0aGlzLmN1cnJlbnQgPSB7fVxyXG4gICAgICAgIHRoaXMuaW5wdXRFdmVudCA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5tZW51Q29udGFpbmVyID0gbWVudUNvbnRhaW5lclxyXG4gICAgICAgIHRoaXMuYWxsb3dTcGFjZXMgPSBhbGxvd1NwYWNlc1xyXG4gICAgICAgIHRoaXMucmVwbGFjZVRleHRTdWZmaXggPSByZXBsYWNlVGV4dFN1ZmZpeFxyXG4gICAgICAgIHRoaXMucG9zaXRpb25NZW51ID0gcG9zaXRpb25NZW51XHJcbiAgICAgICAgdGhpcy5oYXNUcmFpbGluZ1NwYWNlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zcGFjZVNlbGVjdHNNYXRjaCA9IHNwYWNlU2VsZWN0c01hdGNoO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hdXRvY29tcGxldGVNb2RlKSB7XHJcbiAgICAgICAgICAgIHRyaWdnZXIgPSAnJ1xyXG4gICAgICAgICAgICBhbGxvd1NwYWNlcyA9IGZhbHNlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsdWVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29sbGVjdGlvbiA9IFt7XHJcbiAgICAgICAgICAgICAgICAvLyBzeW1ib2wgdGhhdCBzdGFydHMgdGhlIGxvb2t1cFxyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogdHJpZ2dlcixcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBpcyBpdCB3cmFwcGVkIGluIGFuIGlmcmFtZVxyXG4gICAgICAgICAgICAgICAgaWZyYW1lOiBpZnJhbWUsXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY2xhc3MgYXBwbGllZCB0byBzZWxlY3RlZCBpdGVtXHJcbiAgICAgICAgICAgICAgICBzZWxlY3RDbGFzczogc2VsZWN0Q2xhc3MsXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZnVuY3Rpb24gY2FsbGVkIG9uIHNlbGVjdCB0aGF0IHJldHVucyB0aGUgY29udGVudCB0byBpbnNlcnRcclxuICAgICAgICAgICAgICAgIHNlbGVjdFRlbXBsYXRlOiAoc2VsZWN0VGVtcGxhdGUgfHwgVHJpYnV0ZS5kZWZhdWx0U2VsZWN0VGVtcGxhdGUpLmJpbmQodGhpcyksXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZnVuY3Rpb24gY2FsbGVkIHRoYXQgcmV0dXJucyBjb250ZW50IGZvciBhbiBpdGVtXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbVRlbXBsYXRlOiAobWVudUl0ZW1UZW1wbGF0ZSB8fCBUcmlidXRlLmRlZmF1bHRNZW51SXRlbVRlbXBsYXRlKS5iaW5kKHRoaXMpLFxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIG1lbnUgaXMgZW1wdHksIGRpc2FibGVzIGhpZGluZyBvZiBtZW51LlxyXG4gICAgICAgICAgICAgICAgbm9NYXRjaFRlbXBsYXRlOiAodCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0LmJpbmQodGhpcylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub01hdGNoVGVtcGxhdGUgfHwgZnVuY3Rpb24gKCkge3JldHVybiAnJ30uYmluZCh0aGlzKVxyXG4gICAgICAgICAgICAgICAgfSkobm9NYXRjaFRlbXBsYXRlKSxcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb2x1bW4gdG8gc2VhcmNoIGFnYWluc3QgaW4gdGhlIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgbG9va3VwOiBsb29rdXAsXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29sdW1uIHRoYXQgY29udGFpbnMgdGhlIGNvbnRlbnQgdG8gaW5zZXJ0IGJ5IGRlZmF1bHRcclxuICAgICAgICAgICAgICAgIGZpbGxBdHRyOiBmaWxsQXR0cixcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBhcnJheSBvZiBvYmplY3RzIG9yIGEgZnVuY3Rpb24gcmV0dXJuaW5nIGFuIGFycmF5IG9mIG9iamVjdHNcclxuICAgICAgICAgICAgICAgIHZhbHVlczogdmFsdWVzLFxyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVpcmVMZWFkaW5nU3BhY2U6IHJlcXVpcmVMZWFkaW5nU3BhY2UsXHJcblxyXG4gICAgICAgICAgICAgICAgc2VhcmNoT3B0czogc2VhcmNoT3B0cyxcclxuXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbUxpbWl0OiBtZW51SXRlbUxpbWl0LFxyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjb2xsZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmF1dG9jb21wbGV0ZU1vZGUpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1RyaWJ1dGUgaW4gYXV0b2NvbXBsZXRlIG1vZGUgZG9lcyBub3Qgd29yayBmb3IgY29sbGVjdGlvbnMnKVxyXG4gICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uLm1hcChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcjogaXRlbS50cmlnZ2VyIHx8IHRyaWdnZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgaWZyYW1lOiBpdGVtLmlmcmFtZSB8fCBpZnJhbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0Q2xhc3M6IGl0ZW0uc2VsZWN0Q2xhc3MgfHwgc2VsZWN0Q2xhc3MsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0VGVtcGxhdGU6IChpdGVtLnNlbGVjdFRlbXBsYXRlIHx8IFRyaWJ1dGUuZGVmYXVsdFNlbGVjdFRlbXBsYXRlKS5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lbnVJdGVtVGVtcGxhdGU6IChpdGVtLm1lbnVJdGVtVGVtcGxhdGUgfHwgVHJpYnV0ZS5kZWZhdWx0TWVudUl0ZW1UZW1wbGF0ZSkuYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgICAgICAgICAvLyBmdW5jdGlvbiBjYWxsZWQgd2hlbiBtZW51IGlzIGVtcHR5LCBkaXNhYmxlcyBoaWRpbmcgb2YgbWVudS5cclxuICAgICAgICAgICAgICAgICAgICBub01hdGNoVGVtcGxhdGU6ICh0ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdC5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgfSkobm9NYXRjaFRlbXBsYXRlKSxcclxuICAgICAgICAgICAgICAgICAgICBsb29rdXA6IGl0ZW0ubG9va3VwIHx8IGxvb2t1cCxcclxuICAgICAgICAgICAgICAgICAgICBmaWxsQXR0cjogaXRlbS5maWxsQXR0ciB8fCBmaWxsQXR0cixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IGl0ZW0udmFsdWVzLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVMZWFkaW5nU3BhY2U6IGl0ZW0ucmVxdWlyZUxlYWRpbmdTcGFjZSxcclxuICAgICAgICAgICAgICAgICAgICBzZWFyY2hPcHRzOiBpdGVtLnNlYXJjaE9wdHMgfHwgc2VhcmNoT3B0cyxcclxuICAgICAgICAgICAgICAgICAgICBtZW51SXRlbUxpbWl0OiBpdGVtLm1lbnVJdGVtTGltaXQgfHwgbWVudUl0ZW1MaW1pdCxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignW1RyaWJ1dGVdIE5vIGNvbGxlY3Rpb24gc3BlY2lmaWVkLicpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuZXcgVHJpYnV0ZVJhbmdlKHRoaXMpXHJcbiAgICAgICAgbmV3IFRyaWJ1dGVFdmVudHModGhpcylcclxuICAgICAgICBuZXcgVHJpYnV0ZU1lbnVFdmVudHModGhpcylcclxuICAgICAgICBuZXcgVHJpYnV0ZVNlYXJjaCh0aGlzKVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBkZWZhdWx0U2VsZWN0VGVtcGxhdGUoaXRlbSkge1xyXG4gICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICd1bmRlZmluZWQnKSByZXR1cm4gbnVsbDtcclxuICAgICAgaWYgKHRoaXMucmFuZ2UuaXNDb250ZW50RWRpdGFibGUodGhpcy5jdXJyZW50LmVsZW1lbnQpKSB7XHJcbiAgICAgICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwidHJpYnV0ZS1tZW50aW9uXCI+JyArICh0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi50cmlnZ2VyICsgaXRlbS5vcmlnaW5hbFt0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5maWxsQXR0cl0pICsgJzwvc3Bhbj4nO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24udHJpZ2dlciArIGl0ZW0ub3JpZ2luYWxbdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24uZmlsbEF0dHJdO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBkZWZhdWx0TWVudUl0ZW1UZW1wbGF0ZShtYXRjaEl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gbWF0Y2hJdGVtLnN0cmluZ1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpbnB1dFR5cGVzKCkge1xyXG4gICAgICAgIHJldHVybiBbJ1RFWFRBUkVBJywgJ0lOUFVUJ11cclxuICAgIH1cclxuXHJcbiAgICB0cmlnZ2VycygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLm1hcChjb25maWcgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gY29uZmlnLnRyaWdnZXJcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGF0dGFjaChlbCkge1xyXG4gICAgICAgIGlmICghZWwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbVHJpYnV0ZV0gTXVzdCBwYXNzIGluIGEgRE9NIG5vZGUgb3IgTm9kZUxpc3QuJylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGlmIGl0IGlzIGEgalF1ZXJ5IGNvbGxlY3Rpb25cclxuICAgICAgICBpZiAodHlwZW9mIGpRdWVyeSAhPT0gJ3VuZGVmaW5lZCcgJiYgZWwgaW5zdGFuY2VvZiBqUXVlcnkpIHtcclxuICAgICAgICAgICAgZWwgPSBlbC5nZXQoKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSXMgZWwgYW4gQXJyYXkvQXJyYXktbGlrZSBvYmplY3Q/XHJcbiAgICAgICAgaWYgKGVsLmNvbnN0cnVjdG9yID09PSBOb2RlTGlzdCB8fCBlbC5jb25zdHJ1Y3RvciA9PT0gSFRNTENvbGxlY3Rpb24gfHwgZWwuY29uc3RydWN0b3IgPT09IEFycmF5KSB7XHJcbiAgICAgICAgICAgIGxldCBsZW5ndGggPSBlbC5sZW5ndGhcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYXR0YWNoKGVsW2ldKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fYXR0YWNoKGVsKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfYXR0YWNoKGVsKSB7XHJcbiAgICAgICAgaWYgKGVsLmhhc0F0dHJpYnV0ZSgnZGF0YS10cmlidXRlJykpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdUcmlidXRlIHdhcyBhbHJlYWR5IGJvdW5kIHRvICcgKyBlbC5ub2RlTmFtZSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZW5zdXJlRWRpdGFibGUoZWwpXHJcbiAgICAgICAgdGhpcy5ldmVudHMuYmluZChlbClcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdHJpYnV0ZScsIHRydWUpXHJcbiAgICB9XHJcblxyXG4gICAgZW5zdXJlRWRpdGFibGUoZWxlbWVudCkge1xyXG4gICAgICAgIGlmIChUcmlidXRlLmlucHV0VHlwZXMoKS5pbmRleE9mKGVsZW1lbnQubm9kZU5hbWUpID09PSAtMSkge1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5jb250ZW50RWRpdGFibGUpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuY29udGVudEVkaXRhYmxlID0gdHJ1ZVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbVHJpYnV0ZV0gQ2Fubm90IGJpbmQgdG8gJyArIGVsZW1lbnQubm9kZU5hbWUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlTWVudSgpIHtcclxuICAgICAgICBsZXQgd3JhcHBlciA9IHRoaXMucmFuZ2UuZ2V0RG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuICAgICAgICAgICAgdWwgPSB0aGlzLnJhbmdlLmdldERvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgndWwnKVxyXG5cclxuICAgICAgICB3cmFwcGVyLmNsYXNzTmFtZSA9ICd0cmlidXRlLWNvbnRhaW5lcidcclxuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHVsKVxyXG5cclxuICAgICAgICBpZiAodGhpcy5tZW51Q29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1lbnVDb250YWluZXIuYXBwZW5kQ2hpbGQod3JhcHBlcilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnJhbmdlLmdldERvY3VtZW50KCkuYm9keS5hcHBlbmRDaGlsZCh3cmFwcGVyKVxyXG4gICAgfVxyXG5cclxuICAgIHNob3dNZW51Rm9yKGVsZW1lbnQsIHNjcm9sbFRvKSB7XHJcbiAgICAgICAgLy8gT25seSBwcm9jZWVkIGlmIG1lbnUgaXNuJ3QgYWxyZWFkeSBzaG93biBmb3IgdGhlIGN1cnJlbnQgZWxlbWVudCAmIG1lbnRpb25UZXh0XHJcbiAgICAgICAgaWYgKHRoaXMuaXNBY3RpdmUgJiYgdGhpcy5jdXJyZW50LmVsZW1lbnQgPT09IGVsZW1lbnQgJiYgdGhpcy5jdXJyZW50Lm1lbnRpb25UZXh0ID09PSB0aGlzLmN1cnJlbnRNZW50aW9uVGV4dFNuYXBzaG90KSB7XHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TWVudGlvblRleHRTbmFwc2hvdCA9IHRoaXMuY3VycmVudC5tZW50aW9uVGV4dFxyXG5cclxuICAgICAgICAvLyBjcmVhdGUgdGhlIG1lbnUgaWYgaXQgZG9lc24ndCBleGlzdC5cclxuICAgICAgICBpZiAoIXRoaXMubWVudSkge1xyXG4gICAgICAgICAgICB0aGlzLm1lbnUgPSB0aGlzLmNyZWF0ZU1lbnUoKVxyXG4gICAgICAgICAgICBlbGVtZW50LnRyaWJ1dGVNZW51ID0gdGhpcy5tZW51XHJcbiAgICAgICAgICAgIHRoaXMubWVudUV2ZW50cy5iaW5kKHRoaXMubWVudSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5tZW51U2VsZWN0ZWQgPSAwXHJcblxyXG4gICAgICAgIGlmICghdGhpcy5jdXJyZW50Lm1lbnRpb25UZXh0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5tZW50aW9uVGV4dCA9ICcnXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwcm9jZXNzVmFsdWVzID0gKHZhbHVlcykgPT4ge1xyXG4gICAgICAgICAgICAvLyBUcmlidXRlIG1heSBub3QgYmUgYWN0aXZlIGFueSBtb3JlIGJ5IHRoZSB0aW1lIHRoZSB2YWx1ZSBjYWxsYmFjayByZXR1cm5zXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0FjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBpdGVtcyA9IHRoaXMuc2VhcmNoLmZpbHRlcih0aGlzLmN1cnJlbnQubWVudGlvblRleHQsIHZhbHVlcywge1xyXG4gICAgICAgICAgICAgICAgcHJlOiB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5zZWFyY2hPcHRzLnByZSB8fCAnPHNwYW4+JyxcclxuICAgICAgICAgICAgICAgIHBvc3Q6IHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLnNlYXJjaE9wdHMucG9zdCB8fCAnPC9zcGFuPicsXHJcbiAgICAgICAgICAgICAgICBza2lwOiB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5zZWFyY2hPcHRzLnNraXAsXHJcbiAgICAgICAgICAgICAgICBleHRyYWN0OiAoZWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLmxvb2t1cCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsW3RoaXMuY3VycmVudC5jb2xsZWN0aW9uLmxvb2t1cF1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5sb29rdXAgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLmxvb2t1cChlbCwgdGhpcy5jdXJyZW50Lm1lbnRpb25UZXh0KVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBsb29rdXAgYXR0cmlidXRlLCBsb29rdXAgbXVzdCBiZSBzdHJpbmcgb3IgZnVuY3Rpb24uJylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQuZmlsdGVyZWRJdGVtcyA9IGl0ZW1zXHJcblxyXG5cclxuICAgICAgICAgICAgbGV0IHVsID0gdGhpcy5tZW51LnF1ZXJ5U2VsZWN0b3IoJ3VsJylcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2UucG9zaXRpb25NZW51QXRDYXJldChzY3JvbGxUbylcclxuXHJcbiAgICAgICAgICAgIGlmICghaXRlbXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9NYXRjaEV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCd0cmlidXRlLW5vLW1hdGNoJywgeyBkZXRhaWw6IHRoaXMubWVudSB9KVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50LmVsZW1lbnQuZGlzcGF0Y2hFdmVudChub01hdGNoRXZlbnQpXHJcbiAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5ub01hdGNoVGVtcGxhdGUgPT09ICdmdW5jdGlvbicgJiYgIXRoaXMuY3VycmVudC5jb2xsZWN0aW9uLm5vTWF0Y2hUZW1wbGF0ZSgpIHx8ICF0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5ub01hdGNoVGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGVNZW51KClcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLm5vTWF0Y2hUZW1wbGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IHVsLmlubmVySFRNTCA9IHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLm5vTWF0Y2hUZW1wbGF0ZSgpIDogdWwuaW5uZXJIVE1MID0gdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24ubm9NYXRjaFRlbXBsYXRlXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5tZW51SXRlbUxpbWl0KSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtcyA9IGl0ZW1zLnNsaWNlKDAsIHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLm1lbnVJdGVtTGltaXQpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHVsLmlubmVySFRNTCA9ICcnXHJcbiAgICAgICAgICAgIGxldCBmcmFnbWVudCA9IHRoaXMucmFuZ2UuZ2V0RG9jdW1lbnQoKS5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcclxuXHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGkgPSB0aGlzLnJhbmdlLmdldERvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnbGknKVxyXG4gICAgICAgICAgICAgICAgbGkuc2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JywgaW5kZXgpXHJcbiAgICAgICAgICAgICAgICBsaS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAvLyBsZXQgbGkgPSBlLnRhcmdldDtcclxuICAgICAgICAgICAgICAgICAgLy8gbGV0IGluZGV4ID0gbGkuZ2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JylcclxuICAgICAgICAgICAgICAgICAgICBsZXQgW2xpLCBpbmRleF0gPSB0aGlzLl9maW5kTGlUYXJnZXQoZS50YXJnZXQpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUubW92ZW1lbnRZICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNldEFjdGl2ZUxpKGluZGV4KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tZW51U2VsZWN0ZWQgPT09IGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgIGxpLmNsYXNzTmFtZSA9IHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLnNlbGVjdENsYXNzXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsaS5pbm5lckhUTUwgPSB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5tZW51SXRlbVRlbXBsYXRlKGl0ZW0pXHJcbiAgICAgICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChsaSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgdWwuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLnZhbHVlcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi52YWx1ZXModGhpcy5jdXJyZW50Lm1lbnRpb25UZXh0LCBwcm9jZXNzVmFsdWVzKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHByb2Nlc3NWYWx1ZXModGhpcy5jdXJyZW50LmNvbGxlY3Rpb24udmFsdWVzKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfZmluZExpVGFyZ2V0KGVsKSB7XHJcbiAgICAgICAgaWYgKCFlbCkgcmV0dXJuIFtdXHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnKTtcclxuICAgICAgICByZXR1cm4gIWluZGV4ID9cclxuICAgICAgICAgICAgdGhpcy5fZmluZExpVGFyZ2V0KGVsLnBhcmVudE5vZGUpIDpcclxuICAgICAgICAgICAgW2VsLCBpbmRleF1cclxuICAgIH1cclxuXHJcbiAgICBzaG93TWVudUZvckNvbGxlY3Rpb24oZWxlbWVudCwgY29sbGVjdGlvbkluZGV4KSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgIT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5wbGFjZUNhcmV0QXRFbmQoZWxlbWVudClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudC5jb2xsZWN0aW9uID0gdGhpcy5jb2xsZWN0aW9uW2NvbGxlY3Rpb25JbmRleCB8fCAwXVxyXG4gICAgICAgIHRoaXMuY3VycmVudC5leHRlcm5hbFRyaWdnZXIgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5jdXJyZW50LmVsZW1lbnQgPSBlbGVtZW50XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50LmlzQ29udGVudEVkaXRhYmxlKVxyXG4gICAgICAgICAgICB0aGlzLmluc2VydFRleHRBdEN1cnNvcih0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi50cmlnZ2VyKVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5pbnNlcnRBdENhcmV0KGVsZW1lbnQsIHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLnRyaWdnZXIpXHJcblxyXG4gICAgICAgIHRoaXMuc2hvd01lbnVGb3IoZWxlbWVudClcclxuICAgIH1cclxuXHJcbiAgICAvLyBUT0RPOiBtYWtlIHN1cmUgdGhpcyB3b3JrcyBmb3IgaW5wdXRzL3RleHRhcmVhc1xyXG4gICAgcGxhY2VDYXJldEF0RW5kKGVsKSB7XHJcbiAgICAgICAgZWwuZm9jdXMoKTtcclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5nZXRTZWxlY3Rpb24gIT0gXCJ1bmRlZmluZWRcIlxyXG4gICAgICAgICAgICAgICAgJiYgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZVJhbmdlICE9IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgdmFyIHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcclxuICAgICAgICAgICAgcmFuZ2Uuc2VsZWN0Tm9kZUNvbnRlbnRzKGVsKTtcclxuICAgICAgICAgICAgcmFuZ2UuY29sbGFwc2UoZmFsc2UpO1xyXG4gICAgICAgICAgICB2YXIgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKCk7XHJcbiAgICAgICAgICAgIHNlbC5hZGRSYW5nZShyYW5nZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQuYm9keS5jcmVhdGVUZXh0UmFuZ2UgIT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICB2YXIgdGV4dFJhbmdlID0gZG9jdW1lbnQuYm9keS5jcmVhdGVUZXh0UmFuZ2UoKTtcclxuICAgICAgICAgICAgdGV4dFJhbmdlLm1vdmVUb0VsZW1lbnRUZXh0KGVsKTtcclxuICAgICAgICAgICAgdGV4dFJhbmdlLmNvbGxhcHNlKGZhbHNlKTtcclxuICAgICAgICAgICAgdGV4dFJhbmdlLnNlbGVjdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBmb3IgY29udGVudGVkaXRhYmxlXHJcbiAgICBpbnNlcnRUZXh0QXRDdXJzb3IodGV4dCkge1xyXG4gICAgICAgIHZhciBzZWwsIHJhbmdlLCBodG1sO1xyXG4gICAgICAgIHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcclxuICAgICAgICByYW5nZSA9IHNlbC5nZXRSYW5nZUF0KDApO1xyXG4gICAgICAgIHJhbmdlLmRlbGV0ZUNvbnRlbnRzKCk7XHJcbiAgICAgICAgdmFyIHRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCk7XHJcbiAgICAgICAgcmFuZ2UuaW5zZXJ0Tm9kZSh0ZXh0Tm9kZSk7XHJcbiAgICAgICAgcmFuZ2Uuc2VsZWN0Tm9kZUNvbnRlbnRzKHRleHROb2RlKVxyXG4gICAgICAgIHJhbmdlLmNvbGxhcHNlKGZhbHNlKVxyXG4gICAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKVxyXG4gICAgICAgIHNlbC5hZGRSYW5nZShyYW5nZSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBmb3IgcmVndWxhciBpbnB1dHNcclxuICAgIGluc2VydEF0Q2FyZXQodGV4dGFyZWEsIHRleHQpIHtcclxuICAgICAgICB2YXIgc2Nyb2xsUG9zID0gdGV4dGFyZWEuc2Nyb2xsVG9wO1xyXG4gICAgICAgIHZhciBjYXJldFBvcyA9IHRleHRhcmVhLnNlbGVjdGlvblN0YXJ0O1xyXG5cclxuICAgICAgICB2YXIgZnJvbnQgPSAodGV4dGFyZWEudmFsdWUpLnN1YnN0cmluZygwLCBjYXJldFBvcyk7XHJcbiAgICAgICAgdmFyIGJhY2sgPSAodGV4dGFyZWEudmFsdWUpLnN1YnN0cmluZyh0ZXh0YXJlYS5zZWxlY3Rpb25FbmQsIHRleHRhcmVhLnZhbHVlLmxlbmd0aCk7XHJcbiAgICAgICAgdGV4dGFyZWEudmFsdWUgPSBmcm9udCArIHRleHQgKyBiYWNrO1xyXG4gICAgICAgIGNhcmV0UG9zID0gY2FyZXRQb3MgKyB0ZXh0Lmxlbmd0aDtcclxuICAgICAgICB0ZXh0YXJlYS5zZWxlY3Rpb25TdGFydCA9IGNhcmV0UG9zO1xyXG4gICAgICAgIHRleHRhcmVhLnNlbGVjdGlvbkVuZCA9IGNhcmV0UG9zO1xyXG4gICAgICAgIHRleHRhcmVhLmZvY3VzKCk7XHJcbiAgICAgICAgdGV4dGFyZWEuc2Nyb2xsVG9wID0gc2Nyb2xsUG9zO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGVNZW51KCkge1xyXG4gICAgICAgIGlmICh0aGlzLm1lbnUpIHtcclxuICAgICAgICAgICAgdGhpcy5tZW51LnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZTsnXHJcbiAgICAgICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZVxyXG4gICAgICAgICAgICB0aGlzLm1lbnVTZWxlY3RlZCA9IDBcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0ge31cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0SXRlbUF0SW5kZXgoaW5kZXgsIG9yaWdpbmFsRXZlbnQpIHtcclxuICAgICAgICBpbmRleCA9IHBhcnNlSW50KGluZGV4KVxyXG4gICAgICAgIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInIHx8IGlzTmFOKGluZGV4KSkgcmV0dXJuXHJcbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLmN1cnJlbnQuZmlsdGVyZWRJdGVtc1tpbmRleF1cclxuICAgICAgICBsZXQgY29udGVudCA9IHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLnNlbGVjdFRlbXBsYXRlKGl0ZW0pXHJcbiAgICAgICAgaWYgKGNvbnRlbnQgIT09IG51bGwpIHRoaXMucmVwbGFjZVRleHQoY29udGVudCwgb3JpZ2luYWxFdmVudCwgaXRlbSlcclxuICAgIH1cclxuXHJcbiAgICByZXBsYWNlVGV4dChjb250ZW50LCBvcmlnaW5hbEV2ZW50LCBpdGVtKSB7XHJcbiAgICAgICAgdGhpcy5yYW5nZS5yZXBsYWNlVHJpZ2dlclRleHQoY29udGVudCwgdHJ1ZSwgdHJ1ZSwgb3JpZ2luYWxFdmVudCwgaXRlbSlcclxuICAgIH1cclxuXHJcbiAgICBfYXBwZW5kKGNvbGxlY3Rpb24sIG5ld1ZhbHVlcywgcmVwbGFjZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY29sbGVjdGlvbi52YWx1ZXMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gYXBwZW5kIHRvIHZhbHVlcywgYXMgaXQgaXMgYSBmdW5jdGlvbi4nKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoIXJlcGxhY2UpIHtcclxuICAgICAgICAgICAgY29sbGVjdGlvbi52YWx1ZXMgPSBjb2xsZWN0aW9uLnZhbHVlcy5jb25jYXQobmV3VmFsdWVzKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbGxlY3Rpb24udmFsdWVzID0gbmV3VmFsdWVzXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFwcGVuZChjb2xsZWN0aW9uSW5kZXgsIG5ld1ZhbHVlcywgcmVwbGFjZSkge1xyXG4gICAgICAgIGxldCBpbmRleCA9IHBhcnNlSW50KGNvbGxlY3Rpb25JbmRleClcclxuICAgICAgICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykgdGhyb3cgbmV3IEVycm9yKCdwbGVhc2UgcHJvdmlkZSBhbiBpbmRleCBmb3IgdGhlIGNvbGxlY3Rpb24gdG8gdXBkYXRlLicpXHJcblxyXG4gICAgICAgIGxldCBjb2xsZWN0aW9uID0gdGhpcy5jb2xsZWN0aW9uW2luZGV4XVxyXG5cclxuICAgICAgICB0aGlzLl9hcHBlbmQoY29sbGVjdGlvbiwgbmV3VmFsdWVzLCByZXBsYWNlKVxyXG4gICAgfVxyXG5cclxuICAgIGFwcGVuZEN1cnJlbnQobmV3VmFsdWVzLCByZXBsYWNlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNBY3RpdmUpIHtcclxuICAgICAgICAgICAgdGhpcy5fYXBwZW5kKHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLCBuZXdWYWx1ZXMsIHJlcGxhY2UpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhY3RpdmUgc3RhdGUuIFBsZWFzZSB1c2UgYXBwZW5kIGluc3RlYWQgYW5kIHBhc3MgYW4gaW5kZXguJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGV0YWNoKGVsKSB7XHJcbiAgICAgICAgaWYgKCFlbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1tUcmlidXRlXSBNdXN0IHBhc3MgaW4gYSBET00gbm9kZSBvciBOb2RlTGlzdC4nKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgaXQgaXMgYSBqUXVlcnkgY29sbGVjdGlvblxyXG4gICAgICAgIGlmICh0eXBlb2YgalF1ZXJ5ICE9PSAndW5kZWZpbmVkJyAmJiBlbCBpbnN0YW5jZW9mIGpRdWVyeSkge1xyXG4gICAgICAgICAgICBlbCA9IGVsLmdldCgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJcyBlbCBhbiBBcnJheS9BcnJheS1saWtlIG9iamVjdD9cclxuICAgICAgICBpZiAoZWwuY29uc3RydWN0b3IgPT09IE5vZGVMaXN0IHx8IGVsLmNvbnN0cnVjdG9yID09PSBIVE1MQ29sbGVjdGlvbiB8fCBlbC5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcclxuICAgICAgICAgICAgbGV0IGxlbmd0aCA9IGVsLmxlbmd0aFxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZXRhY2goZWxbaV0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9kZXRhY2goZWwpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9kZXRhY2goZWwpIHtcclxuICAgICAgICB0aGlzLmV2ZW50cy51bmJpbmQoZWwpXHJcbiAgICAgICAgaWYgKGVsLnRyaWJ1dGVNZW51KSB7XHJcbiAgICAgICAgICAgIHRoaXMubWVudUV2ZW50cy51bmJpbmQoZWwudHJpYnV0ZU1lbnUpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXRyaWJ1dGUnKVxyXG4gICAgICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2VcclxuICAgICAgICAgICAgaWYgKGVsLnRyaWJ1dGVNZW51KSB7XHJcbiAgICAgICAgICAgICAgICBlbC50cmlidXRlTWVudS5yZW1vdmUoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVHJpYnV0ZTtcclxuIiwiY2xhc3MgVHJpYnV0ZUV2ZW50cyB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0cmlidXRlKSB7XHJcbiAgICAgICAgdGhpcy50cmlidXRlID0gdHJpYnV0ZVxyXG4gICAgICAgIHRoaXMudHJpYnV0ZS5ldmVudHMgPSB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGtleXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgICAgIGtleTogOSxcclxuICAgICAgICAgICAgdmFsdWU6ICdUQUInXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBrZXk6IDgsXHJcbiAgICAgICAgICAgIHZhbHVlOiAnREVMRVRFJ1xyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAga2V5OiAxMyxcclxuICAgICAgICAgICAgdmFsdWU6ICdFTlRFUidcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGtleTogMjcsXHJcbiAgICAgICAgICAgIHZhbHVlOiAnRVNDQVBFJ1xyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAga2V5OiAzMixcclxuICAgICAgICAgICAgdmFsdWU6ICdTUEFDRSdcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGtleTogMzgsXHJcbiAgICAgICAgICAgIHZhbHVlOiAnVVAnXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBrZXk6IDQwLFxyXG4gICAgICAgICAgICB2YWx1ZTogJ0RPV04nXHJcbiAgICAgICAgfV1cclxuICAgIH1cclxuXHJcbiAgICBiaW5kKGVsZW1lbnQpIHtcclxuICAgICAgICBlbGVtZW50LmJvdW5kS2V5ZG93biA9IHRoaXMua2V5ZG93bi5iaW5kKGVsZW1lbnQsIHRoaXMpO1xyXG4gICAgICAgIGVsZW1lbnQuYm91bmRLZXl1cCA9IHRoaXMua2V5dXAuYmluZChlbGVtZW50LCB0aGlzKTtcclxuICAgICAgICBlbGVtZW50LmJvdW5kSW5wdXQgPSB0aGlzLmlucHV0LmJpbmQoZWxlbWVudCwgdGhpcyk7XHJcblxyXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsXHJcbiAgICAgICAgICAgIGVsZW1lbnQuYm91bmRLZXlkb3duLCBmYWxzZSlcclxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJyxcclxuICAgICAgICAgICAgZWxlbWVudC5ib3VuZEtleXVwLCBmYWxzZSlcclxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JyxcclxuICAgICAgICAgICAgZWxlbWVudC5ib3VuZElucHV0LCBmYWxzZSlcclxuICAgIH1cclxuXHJcbiAgICB1bmJpbmQoZWxlbWVudCkge1xyXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsXHJcbiAgICAgICAgICAgIGVsZW1lbnQuYm91bmRLZXlkb3duLCBmYWxzZSlcclxuICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJyxcclxuICAgICAgICAgICAgZWxlbWVudC5ib3VuZEtleXVwLCBmYWxzZSlcclxuICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2lucHV0JyxcclxuICAgICAgICAgICAgZWxlbWVudC5ib3VuZElucHV0LCBmYWxzZSlcclxuXHJcbiAgICAgICAgZGVsZXRlIGVsZW1lbnQuYm91bmRLZXlkb3duXHJcbiAgICAgICAgZGVsZXRlIGVsZW1lbnQuYm91bmRLZXl1cFxyXG4gICAgICAgIGRlbGV0ZSBlbGVtZW50LmJvdW5kSW5wdXRcclxuICAgIH1cclxuXHJcbiAgICBrZXlkb3duKGluc3RhbmNlLCBldmVudCkge1xyXG4gICAgICAgIGlmIChpbnN0YW5jZS5zaG91bGREZWFjdGl2YXRlKGV2ZW50KSkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS50cmlidXRlLmlzQWN0aXZlID0gZmFsc2VcclxuICAgICAgICAgICAgaW5zdGFuY2UudHJpYnV0ZS5oaWRlTWVudSgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXNcclxuICAgICAgICBpbnN0YW5jZS5jb21tYW5kRXZlbnQgPSBmYWxzZVxyXG5cclxuICAgICAgICBUcmlidXRlRXZlbnRzLmtleXMoKS5mb3JFYWNoKG8gPT4ge1xyXG4gICAgICAgICAgICBpZiAoby5rZXkgPT09IGV2ZW50LmtleUNvZGUpIHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLmNvbW1hbmRFdmVudCA9IHRydWVcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLmNhbGxiYWNrcygpW28udmFsdWUudG9Mb3dlckNhc2UoKV0oZXZlbnQsIGVsZW1lbnQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGlucHV0KGluc3RhbmNlLCBldmVudCkge1xyXG4gICAgICAgIGluc3RhbmNlLmlucHV0RXZlbnQgPSB0cnVlXHJcbiAgICAgICAgaW5zdGFuY2Uua2V5dXAuY2FsbCh0aGlzLCBpbnN0YW5jZSwgZXZlbnQpXHJcbiAgICB9XHJcblxyXG4gICAgY2xpY2soaW5zdGFuY2UsIGV2ZW50KSB7XHJcbiAgICAgICAgbGV0IHRyaWJ1dGUgPSBpbnN0YW5jZS50cmlidXRlXHJcbiAgICAgICAgaWYgKHRyaWJ1dGUubWVudSAmJiB0cmlidXRlLm1lbnUuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICBsZXQgbGkgPSBldmVudC50YXJnZXRcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgICB3aGlsZSAobGkubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gJ2xpJykge1xyXG4gICAgICAgICAgICAgICAgbGkgPSBsaS5wYXJlbnROb2RlXHJcbiAgICAgICAgICAgICAgICBpZiAoIWxpIHx8IGxpID09PSB0cmlidXRlLm1lbnUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBmaW5kIHRoZSA8bGk+IGNvbnRhaW5lciBmb3IgdGhlIGNsaWNrJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cmlidXRlLnNlbGVjdEl0ZW1BdEluZGV4KGxpLmdldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcpLCBldmVudClcclxuICAgICAgICAgICAgdHJpYnV0ZS5oaWRlTWVudSgpXHJcblxyXG4gICAgICAgIC8vIFRPRE86IHNob3VsZCBmaXJlIHdpdGggZXh0ZXJuYWxUcmlnZ2VyIGFuZCB0YXJnZXQgaXMgb3V0c2lkZSBvZiBtZW51XHJcbiAgICAgICAgfSBlbHNlIGlmICh0cmlidXRlLmN1cnJlbnQuZWxlbWVudCAmJiAhdHJpYnV0ZS5jdXJyZW50LmV4dGVybmFsVHJpZ2dlcikge1xyXG4gICAgICAgICAgICB0cmlidXRlLmN1cnJlbnQuZXh0ZXJuYWxUcmlnZ2VyID0gZmFsc2VcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0cmlidXRlLmhpZGVNZW51KCkpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGtleXVwKGluc3RhbmNlLCBldmVudCkge1xyXG4gICAgICAgIGlmIChpbnN0YW5jZS5pbnB1dEV2ZW50KSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLmlucHV0RXZlbnQgPSBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgICBpbnN0YW5jZS51cGRhdGVTZWxlY3Rpb24odGhpcylcclxuXHJcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDI3KSByZXR1cm5cclxuXHJcbiAgICAgICAgaWYgKCFpbnN0YW5jZS50cmlidXRlLmFsbG93U3BhY2VzICYmIGluc3RhbmNlLnRyaWJ1dGUuaGFzVHJhaWxpbmdTcGFjZSkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS50cmlidXRlLmhhc1RyYWlsaW5nU3BhY2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgaW5zdGFuY2UuY29tbWFuZEV2ZW50ID0gdHJ1ZTtcclxuICAgICAgICAgICAgaW5zdGFuY2UuY2FsbGJhY2tzKClbXCJzcGFjZVwiXShldmVudCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFpbnN0YW5jZS50cmlidXRlLmlzQWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZS50cmlidXRlLmF1dG9jb21wbGV0ZU1vZGUpIHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLmNhbGxiYWNrcygpLnRyaWdnZXJDaGFyKGV2ZW50LCB0aGlzLCAnJylcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBrZXlDb2RlID0gaW5zdGFuY2UuZ2V0S2V5Q29kZShpbnN0YW5jZSwgdGhpcywgZXZlbnQpXHJcbiAgICBcclxuICAgICAgICAgICAgICAgIGlmIChpc05hTihrZXlDb2RlKSB8fCAha2V5Q29kZSkgcmV0dXJuXHJcbiAgICBcclxuICAgICAgICAgICAgICAgIGxldCB0cmlnZ2VyID0gaW5zdGFuY2UudHJpYnV0ZS50cmlnZ2VycygpLmZpbmQodHJpZ2dlciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRyaWdnZXIuY2hhckNvZGVBdCgwKSA9PT0ga2V5Q29kZVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0cmlnZ2VyICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLmNhbGxiYWNrcygpLnRyaWdnZXJDaGFyKGV2ZW50LCB0aGlzLCB0cmlnZ2VyKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoKGluc3RhbmNlLnRyaWJ1dGUuY3VycmVudC50cmlnZ2VyIHx8IGluc3RhbmNlLnRyaWJ1dGUuYXV0b2NvbXBsZXRlTW9kZSlcclxuICAgICAgICAgICAgJiYgaW5zdGFuY2UuY29tbWFuZEV2ZW50ID09PSBmYWxzZVxyXG4gICAgICAgICAgICB8fCBpbnN0YW5jZS50cmlidXRlLmlzQWN0aXZlICYmIGV2ZW50LmtleUNvZGUgPT09IDgpIHtcclxuICAgICAgICAgIGluc3RhbmNlLnRyaWJ1dGUuc2hvd01lbnVGb3IodGhpcywgdHJ1ZSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2hvdWxkRGVhY3RpdmF0ZShldmVudCkge1xyXG4gICAgICAgIGlmICghdGhpcy50cmlidXRlLmlzQWN0aXZlKSByZXR1cm4gZmFsc2VcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudHJpYnV0ZS5jdXJyZW50Lm1lbnRpb25UZXh0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBsZXQgZXZlbnRLZXlQcmVzc2VkID0gZmFsc2VcclxuICAgICAgICAgICAgVHJpYnV0ZUV2ZW50cy5rZXlzKCkuZm9yRWFjaChvID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSBvLmtleSkgZXZlbnRLZXlQcmVzc2VkID0gdHJ1ZVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuICFldmVudEtleVByZXNzZWRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIGdldEtleUNvZGUoaW5zdGFuY2UsIGVsLCBldmVudCkge1xyXG4gICAgICAgIGxldCBjaGFyXHJcbiAgICAgICAgbGV0IHRyaWJ1dGUgPSBpbnN0YW5jZS50cmlidXRlXHJcbiAgICAgICAgbGV0IGluZm8gPSB0cmlidXRlLnJhbmdlLmdldFRyaWdnZXJJbmZvKGZhbHNlLCB0cmlidXRlLmhhc1RyYWlsaW5nU3BhY2UsIHRydWUsIHRyaWJ1dGUuYWxsb3dTcGFjZXMsIHRyaWJ1dGUuYXV0b2NvbXBsZXRlTW9kZSlcclxuXHJcbiAgICAgICAgaWYgKGluZm8pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGluZm8ubWVudGlvblRyaWdnZXJDaGFyLmNoYXJDb2RlQXQoMClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU2VsZWN0aW9uKGVsKSB7XHJcbiAgICAgICAgdGhpcy50cmlidXRlLmN1cnJlbnQuZWxlbWVudCA9IGVsXHJcbiAgICAgICAgbGV0IGluZm8gPSB0aGlzLnRyaWJ1dGUucmFuZ2UuZ2V0VHJpZ2dlckluZm8oZmFsc2UsIHRoaXMudHJpYnV0ZS5oYXNUcmFpbGluZ1NwYWNlLCB0cnVlLCB0aGlzLnRyaWJ1dGUuYWxsb3dTcGFjZXMsIHRoaXMudHJpYnV0ZS5hdXRvY29tcGxldGVNb2RlKVxyXG5cclxuICAgICAgICBpZiAoaW5mbykge1xyXG4gICAgICAgICAgICB0aGlzLnRyaWJ1dGUuY3VycmVudC5zZWxlY3RlZFBhdGggPSBpbmZvLm1lbnRpb25TZWxlY3RlZFBhdGhcclxuICAgICAgICAgICAgdGhpcy50cmlidXRlLmN1cnJlbnQubWVudGlvblRleHQgPSBpbmZvLm1lbnRpb25UZXh0XHJcbiAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5jdXJyZW50LnNlbGVjdGVkT2Zmc2V0ID0gaW5mby5tZW50aW9uU2VsZWN0ZWRPZmZzZXRcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2FsbGJhY2tzKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRyaWdnZXJDaGFyOiAoZSwgZWwsIHRyaWdnZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCB0cmlidXRlID0gdGhpcy50cmlidXRlXHJcbiAgICAgICAgICAgICAgICB0cmlidXRlLmN1cnJlbnQudHJpZ2dlciA9IHRyaWdnZXJcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY29sbGVjdGlvbkl0ZW0gPSB0cmlidXRlLmNvbGxlY3Rpb24uZmluZChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS50cmlnZ2VyID09PSB0cmlnZ2VyXHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIHRyaWJ1dGUuY3VycmVudC5jb2xsZWN0aW9uID0gY29sbGVjdGlvbkl0ZW1cclxuICAgICAgICAgICAgICAgIGlmICh0cmlidXRlLmlucHV0RXZlbnQpIHRyaWJ1dGUuc2hvd01lbnVGb3IoZWwsIHRydWUpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudGVyOiAoZSwgZWwpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGNob29zZSBzZWxlY3Rpb25cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyaWJ1dGUuaXNBY3RpdmUgJiYgdGhpcy50cmlidXRlLmN1cnJlbnQuZmlsdGVyZWRJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLnNlbGVjdEl0ZW1BdEluZGV4KHRoaXMudHJpYnV0ZS5tZW51U2VsZWN0ZWQsIGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5oaWRlTWVudSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXNjYXBlOiAoZSwgZWwpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyaWJ1dGUuaXNBY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLmlzQWN0aXZlID0gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUuaGlkZU1lbnUoKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0YWI6IChlLCBlbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gY2hvb3NlIGZpcnN0IG1hdGNoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxiYWNrcygpLmVudGVyKGUsIGVsKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzcGFjZTogKGUsIGVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50cmlidXRlLmlzQWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudHJpYnV0ZS5zcGFjZVNlbGVjdHNNYXRjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbGxiYWNrcygpLmVudGVyKGUsIGVsKVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMudHJpYnV0ZS5hbGxvd1NwYWNlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5oaWRlTWVudSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLmlzQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdXA6IChlLCBlbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gbmF2aWdhdGUgdXAgdWxcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyaWJ1dGUuaXNBY3RpdmUgJiYgdGhpcy50cmlidXRlLmN1cnJlbnQuZmlsdGVyZWRJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY291bnQgPSB0aGlzLnRyaWJ1dGUuY3VycmVudC5maWx0ZXJlZEl0ZW1zLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQgPSB0aGlzLnRyaWJ1dGUubWVudVNlbGVjdGVkXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb3VudCA+IHNlbGVjdGVkICYmIHNlbGVjdGVkID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudVNlbGVjdGVkLS1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVMaSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLm1lbnVTZWxlY3RlZCA9IGNvdW50IC0gMVxyXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVMaSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudS5zY3JvbGxUb3AgPSB0aGlzLnRyaWJ1dGUubWVudS5zY3JvbGxIZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRvd246IChlLCBlbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gbmF2aWdhdGUgZG93biB1bFxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHJpYnV0ZS5pc0FjdGl2ZSAmJiB0aGlzLnRyaWJ1dGUuY3VycmVudC5maWx0ZXJlZEl0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb3VudCA9IHRoaXMudHJpYnV0ZS5jdXJyZW50LmZpbHRlcmVkSXRlbXMubGVuZ3RoIC0gMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQgPSB0aGlzLnRyaWJ1dGUubWVudVNlbGVjdGVkXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb3VudCA+IHNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5tZW51U2VsZWN0ZWQrK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUxpKClcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvdW50ID09PSBzZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudVNlbGVjdGVkID0gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUxpKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLm1lbnUuc2Nyb2xsVG9wID0gMFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGVsZXRlOiAoZSwgZWwpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyaWJ1dGUuaXNBY3RpdmUgJiYgdGhpcy50cmlidXRlLmN1cnJlbnQubWVudGlvblRleHQubGVuZ3RoIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5oaWRlTWVudSgpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudHJpYnV0ZS5pc0FjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5zaG93TWVudUZvcihlbClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRBY3RpdmVMaShpbmRleCkge1xyXG4gICAgICAgIGxldCBsaXMgPSB0aGlzLnRyaWJ1dGUubWVudS5xdWVyeVNlbGVjdG9yQWxsKCdsaScpLFxyXG4gICAgICAgICAgICBsZW5ndGggPSBsaXMubGVuZ3RoID4+PiAwXHJcblxyXG4gICAgICAgIGlmIChpbmRleCkgdGhpcy50cmlidXRlLm1lbnVTZWxlY3RlZCA9IHBhcnNlSW50KGluZGV4KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgbGkgPSBsaXNbaV1cclxuICAgICAgICAgICAgaWYgKGkgPT09IHRoaXMudHJpYnV0ZS5tZW51U2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGxpLmNsYXNzTGlzdC5hZGQodGhpcy50cmlidXRlLmN1cnJlbnQuY29sbGVjdGlvbi5zZWxlY3RDbGFzcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGxpQ2xpZW50UmVjdCA9IGxpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IG1lbnVDbGllbnRSZWN0ID0gdGhpcy50cmlidXRlLm1lbnUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGxpQ2xpZW50UmVjdC5ib3R0b20gPiBtZW51Q2xpZW50UmVjdC5ib3R0b20pIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2Nyb2xsRGlzdGFuY2UgPSBsaUNsaWVudFJlY3QuYm90dG9tIC0gbWVudUNsaWVudFJlY3QuYm90dG9tO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5tZW51LnNjcm9sbFRvcCArPSBzY3JvbGxEaXN0YW5jZVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChsaUNsaWVudFJlY3QudG9wIDwgbWVudUNsaWVudFJlY3QudG9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNjcm9sbERpc3RhbmNlID0gbWVudUNsaWVudFJlY3QudG9wIC0gbGlDbGllbnRSZWN0LnRvcDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudS5zY3JvbGxUb3AgLT0gc2Nyb2xsRGlzdGFuY2VcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsaS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMudHJpYnV0ZS5jdXJyZW50LmNvbGxlY3Rpb24uc2VsZWN0Q2xhc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldEZ1bGxIZWlnaHQoZWxlbSwgaW5jbHVkZU1hcmdpbikge1xyXG4gICAgICBsZXQgaGVpZ2h0ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHRcclxuXHJcbiAgICAgIGlmIChpbmNsdWRlTWFyZ2luKSB7XHJcbiAgICAgICAgbGV0IHN0eWxlID0gZWxlbS5jdXJyZW50U3R5bGUgfHwgd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbSlcclxuICAgICAgICByZXR1cm4gaGVpZ2h0ICsgcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5Ub3ApICsgcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5Cb3R0b20pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBoZWlnaHRcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRyaWJ1dGVFdmVudHM7XHJcbiIsImNsYXNzIFRyaWJ1dGVNZW51RXZlbnRzIHtcclxuICAgIGNvbnN0cnVjdG9yKHRyaWJ1dGUpIHtcclxuICAgICAgICB0aGlzLnRyaWJ1dGUgPSB0cmlidXRlXHJcbiAgICAgICAgdGhpcy50cmlidXRlLm1lbnVFdmVudHMgPSB0aGlzXHJcbiAgICAgICAgdGhpcy5tZW51ID0gdGhpcy50cmlidXRlLm1lbnVcclxuICAgIH1cclxuXHJcbiAgICBiaW5kKG1lbnUpIHtcclxuICAgICAgICB0aGlzLm1lbnVDbGlja0V2ZW50ID0gdGhpcy50cmlidXRlLmV2ZW50cy5jbGljay5iaW5kKG51bGwsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5tZW51Q29udGFpbmVyU2Nyb2xsRXZlbnQgPSB0aGlzLmRlYm91bmNlKCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudHJpYnV0ZS5pc0FjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLnNob3dNZW51Rm9yKHRoaXMudHJpYnV0ZS5jdXJyZW50LmVsZW1lbnQsIGZhbHNlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMzAwLCBmYWxzZSlcclxuICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUV2ZW50ID0gdGhpcy5kZWJvdW5jZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRyaWJ1dGUuaXNBY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5yYW5nZS5wb3NpdGlvbk1lbnVBdENhcmV0KHRydWUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCAzMDAsIGZhbHNlKVxyXG5cclxuICAgICAgICAvLyBmaXhlcyBJRTExIGlzc3VlcyB3aXRoIG1vdXNlZG93blxyXG4gICAgICAgIHRoaXMudHJpYnV0ZS5yYW5nZS5nZXREb2N1bWVudCgpLmFkZEV2ZW50TGlzdGVuZXIoJ01TUG9pbnRlckRvd24nLFxyXG4gICAgICAgICAgICB0aGlzLm1lbnVDbGlja0V2ZW50LCBmYWxzZSlcclxuICAgICAgICB0aGlzLnRyaWJ1dGUucmFuZ2UuZ2V0RG9jdW1lbnQoKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLFxyXG4gICAgICAgICAgICB0aGlzLm1lbnVDbGlja0V2ZW50LCBmYWxzZSlcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy53aW5kb3dSZXNpemVFdmVudClcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubWVudUNvbnRhaW5lcikge1xyXG4gICAgICAgICAgICB0aGlzLm1lbnVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5tZW51Q29udGFpbmVyU2Nyb2xsRXZlbnQsIGZhbHNlKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLm1lbnVDb250YWluZXJTY3JvbGxFdmVudClcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHVuYmluZChtZW51KSB7XHJcbiAgICAgICAgdGhpcy50cmlidXRlLnJhbmdlLmdldERvY3VtZW50KCkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJyxcclxuICAgICAgICAgICAgdGhpcy5tZW51Q2xpY2tFdmVudCwgZmFsc2UpXHJcbiAgICAgICAgdGhpcy50cmlidXRlLnJhbmdlLmdldERvY3VtZW50KCkucmVtb3ZlRXZlbnRMaXN0ZW5lcignTVNQb2ludGVyRG93bicsXHJcbiAgICAgICAgICAgIHRoaXMubWVudUNsaWNrRXZlbnQsIGZhbHNlKVxyXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLndpbmRvd1Jlc2l6ZUV2ZW50KVxyXG5cclxuICAgICAgICBpZiAodGhpcy5tZW51Q29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWVudUNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLm1lbnVDb250YWluZXJTY3JvbGxFdmVudCwgZmFsc2UpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMubWVudUNvbnRhaW5lclNjcm9sbEV2ZW50KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZWJvdW5jZShmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcclxuICAgICAgICB2YXIgdGltZW91dFxyXG4gICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBjb250ZXh0ID0gdGhpcyxcclxuICAgICAgICAgICAgICAgIGFyZ3MgPSBhcmd1bWVudHNcclxuICAgICAgICAgICAgdmFyIGxhdGVyID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGltZW91dCA9IG51bGxcclxuICAgICAgICAgICAgICAgIGlmICghaW1tZWRpYXRlKSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXRcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpXHJcbiAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KVxyXG4gICAgICAgICAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRyaWJ1dGVNZW51RXZlbnRzO1xyXG4iLCIvLyBUaGFua3MgdG8gaHR0cHM6Ly9naXRodWIuY29tL2plZmYtY29sbGlucy9tZW50LmlvXHJcbmNsYXNzIFRyaWJ1dGVSYW5nZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0cmlidXRlKSB7XHJcbiAgICAgICAgdGhpcy50cmlidXRlID0gdHJpYnV0ZVxyXG4gICAgICAgIHRoaXMudHJpYnV0ZS5yYW5nZSA9IHRoaXNcclxuICAgIH1cclxuXHJcbiAgICBnZXREb2N1bWVudCgpIHtcclxuICAgICAgICBsZXQgaWZyYW1lXHJcbiAgICAgICAgaWYgKHRoaXMudHJpYnV0ZS5jdXJyZW50LmNvbGxlY3Rpb24pIHtcclxuICAgICAgICAgICAgaWZyYW1lID0gdGhpcy50cmlidXRlLmN1cnJlbnQuY29sbGVjdGlvbi5pZnJhbWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghaWZyYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50XHJcbiAgICB9XHJcblxyXG4gICAgcG9zaXRpb25NZW51QXRDYXJldChzY3JvbGxUbykge1xyXG4gICAgICAgIGxldCBjb250ZXh0ID0gdGhpcy50cmlidXRlLmN1cnJlbnQsXHJcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzXHJcblxyXG4gICAgICAgIGxldCBpbmZvID0gdGhpcy5nZXRUcmlnZ2VySW5mbyhmYWxzZSwgdGhpcy50cmlidXRlLmhhc1RyYWlsaW5nU3BhY2UsIHRydWUsIHRoaXMudHJpYnV0ZS5hbGxvd1NwYWNlcywgdGhpcy50cmlidXRlLmF1dG9jb21wbGV0ZU1vZGUpXHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgaW5mbyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHJcbiAgICAgICAgICAgIGlmKCF0aGlzLnRyaWJ1dGUucG9zaXRpb25NZW51KXtcclxuICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5tZW51LnN0eWxlLmNzc1RleHQgPSBgZGlzcGxheTogYmxvY2s7YFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0NvbnRlbnRFZGl0YWJsZShjb250ZXh0LmVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlcyA9IHRoaXMuZ2V0VGV4dEFyZWFPcklucHV0VW5kZXJsaW5lUG9zaXRpb24odGhpcy50cmlidXRlLmN1cnJlbnQuZWxlbWVudCxcclxuICAgICAgICAgICAgICAgICAgICBpbmZvLm1lbnRpb25Qb3NpdGlvbilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzID0gdGhpcy5nZXRDb250ZW50RWRpdGFibGVDYXJldFBvc2l0aW9uKGluZm8ubWVudGlvblBvc2l0aW9uKVxyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgdGhpcy50cmlidXRlLm1lbnUuc3R5bGUuY3NzVGV4dCA9IGB0b3A6ICR7Y29vcmRpbmF0ZXMudG9wfXB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJHtjb29yZGluYXRlcy5sZWZ0fXB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6ICR7Y29vcmRpbmF0ZXMucmlnaHR9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b206ICR7Y29vcmRpbmF0ZXMuYm90dG9tfXB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgei1pbmRleDogMTAwMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBibG9jaztgXHJcblxyXG4gICAgICAgICAgICBpZiAoY29vcmRpbmF0ZXMubGVmdCA9PT0gJ2F1dG8nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudS5zdHlsZS5sZWZ0ID0gJ2F1dG8nXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjb29yZGluYXRlcy50b3AgPT09ICdhdXRvJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLm1lbnUuc3R5bGUudG9wID0gJ2F1dG8nXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxUbykgdGhpcy5zY3JvbGxJbnRvVmlldygpXHJcblxyXG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWVudURpbWVuc2lvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy50cmlidXRlLm1lbnUub2Zmc2V0V2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMudHJpYnV0ZS5tZW51Lm9mZnNldEhlaWdodFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IG1lbnVJc09mZlNjcmVlbiA9IHRoaXMuaXNNZW51T2ZmU2NyZWVuKGNvb3JkaW5hdGVzLCBtZW51RGltZW5zaW9ucylcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbWVudUlzT2ZmU2NyZWVuSG9yaXpvbnRhbGx5ID0gd2luZG93LmlubmVyV2lkdGggPiBtZW51RGltZW5zaW9ucy53aWR0aCAmJiAobWVudUlzT2ZmU2NyZWVuLmxlZnQgfHwgbWVudUlzT2ZmU2NyZWVuLnJpZ2h0KVxyXG4gICAgICAgICAgICAgICAgbGV0IG1lbnVJc09mZlNjcmVlblZlcnRpY2FsbHkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgPiBtZW51RGltZW5zaW9ucy5oZWlnaHQgJiYgKG1lbnVJc09mZlNjcmVlbi50b3AgfHwgbWVudUlzT2ZmU2NyZWVuLmJvdHRvbSlcclxuICAgICAgICAgICAgICAgIGlmIChtZW51SXNPZmZTY3JlZW5Ib3Jpem9udGFsbHkgfHwgbWVudUlzT2ZmU2NyZWVuVmVydGljYWxseSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5tZW51LnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZSdcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uTWVudUF0Q2FyZXQoc2Nyb2xsVG8pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDApXHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5tZW51LnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZSdcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0RWxlbWVudCh0YXJnZXRFbGVtZW50LCBwYXRoLCBvZmZzZXQpIHtcclxuICAgICAgICBsZXQgcmFuZ2VcclxuICAgICAgICBsZXQgZWxlbSA9IHRhcmdldEVsZW1lbnRcclxuXHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtID0gZWxlbS5jaGlsZE5vZGVzW3BhdGhbaV1dXHJcbiAgICAgICAgICAgICAgICBpZiAoZWxlbSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoZWxlbS5sZW5ndGggPCBvZmZzZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgLT0gZWxlbS5sZW5ndGhcclxuICAgICAgICAgICAgICAgICAgICBlbGVtID0gZWxlbS5uZXh0U2libGluZ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW0uY2hpbGROb2Rlcy5sZW5ndGggPT09IDAgJiYgIWVsZW0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbSA9IGVsZW0ucHJldmlvdXNTaWJsaW5nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHNlbCA9IHRoaXMuZ2V0V2luZG93U2VsZWN0aW9uKClcclxuXHJcbiAgICAgICAgcmFuZ2UgPSB0aGlzLmdldERvY3VtZW50KCkuY3JlYXRlUmFuZ2UoKVxyXG4gICAgICAgIHJhbmdlLnNldFN0YXJ0KGVsZW0sIG9mZnNldClcclxuICAgICAgICByYW5nZS5zZXRFbmQoZWxlbSwgb2Zmc2V0KVxyXG4gICAgICAgIHJhbmdlLmNvbGxhcHNlKHRydWUpXHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxyXG5cclxuICAgICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpXHJcbiAgICAgICAgdGFyZ2V0RWxlbWVudC5mb2N1cygpXHJcbiAgICB9XHJcblxyXG4gICAgcmVwbGFjZVRyaWdnZXJUZXh0KHRleHQsIHJlcXVpcmVMZWFkaW5nU3BhY2UsIGhhc1RyYWlsaW5nU3BhY2UsIG9yaWdpbmFsRXZlbnQsIGl0ZW0pIHtcclxuICAgICAgICBsZXQgaW5mbyA9IHRoaXMuZ2V0VHJpZ2dlckluZm8odHJ1ZSwgaGFzVHJhaWxpbmdTcGFjZSwgcmVxdWlyZUxlYWRpbmdTcGFjZSwgdGhpcy50cmlidXRlLmFsbG93U3BhY2VzLCB0aGlzLnRyaWJ1dGUuYXV0b2NvbXBsZXRlTW9kZSlcclxuXHJcbiAgICAgICAgaWYgKGluZm8gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBsZXQgY29udGV4dCA9IHRoaXMudHJpYnV0ZS5jdXJyZW50XHJcbiAgICAgICAgICAgIGxldCByZXBsYWNlRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3RyaWJ1dGUtcmVwbGFjZWQnLCB7XHJcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiBpdGVtLFxyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlOiBjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IGluZm8sXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IG9yaWdpbmFsRXZlbnQsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNDb250ZW50RWRpdGFibGUoY29udGV4dC5lbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG15RmllbGQgPSB0aGlzLnRyaWJ1dGUuY3VycmVudC5lbGVtZW50XHJcbiAgICAgICAgICAgICAgICBsZXQgdGV4dFN1ZmZpeCA9IHR5cGVvZiB0aGlzLnRyaWJ1dGUucmVwbGFjZVRleHRTdWZmaXggPT0gJ3N0cmluZydcclxuICAgICAgICAgICAgICAgICAgICA/IHRoaXMudHJpYnV0ZS5yZXBsYWNlVGV4dFN1ZmZpeFxyXG4gICAgICAgICAgICAgICAgICAgIDogJyAnXHJcbiAgICAgICAgICAgICAgICB0ZXh0ICs9IHRleHRTdWZmaXhcclxuICAgICAgICAgICAgICAgIGxldCBzdGFydFBvcyA9IGluZm8ubWVudGlvblBvc2l0aW9uXHJcbiAgICAgICAgICAgICAgICBsZXQgZW5kUG9zID0gaW5mby5tZW50aW9uUG9zaXRpb24gKyBpbmZvLm1lbnRpb25UZXh0Lmxlbmd0aCArIHRleHRTdWZmaXgubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICBteUZpZWxkLnZhbHVlID0gbXlGaWVsZC52YWx1ZS5zdWJzdHJpbmcoMCwgc3RhcnRQb3MpICsgdGV4dCArXHJcbiAgICAgICAgICAgICAgICAgICAgbXlGaWVsZC52YWx1ZS5zdWJzdHJpbmcoZW5kUG9zLCBteUZpZWxkLnZhbHVlLmxlbmd0aClcclxuICAgICAgICAgICAgICAgIG15RmllbGQuc2VsZWN0aW9uU3RhcnQgPSBzdGFydFBvcyArIHRleHQubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICBteUZpZWxkLnNlbGVjdGlvbkVuZCA9IHN0YXJ0UG9zICsgdGV4dC5sZW5ndGhcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGFkZCBhIHNwYWNlIHRvIHRoZSBlbmQgb2YgdGhlIHBhc3RlZCB0ZXh0XHJcbiAgICAgICAgICAgICAgICBsZXQgdGV4dFN1ZmZpeCA9IHR5cGVvZiB0aGlzLnRyaWJ1dGUucmVwbGFjZVRleHRTdWZmaXggPT0gJ3N0cmluZydcclxuICAgICAgICAgICAgICAgICAgICA/IHRoaXMudHJpYnV0ZS5yZXBsYWNlVGV4dFN1ZmZpeFxyXG4gICAgICAgICAgICAgICAgICAgIDogJ1xceEEwJ1xyXG4gICAgICAgICAgICAgICAgdGV4dCArPSB0ZXh0U3VmZml4XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhc3RlSHRtbCh0ZXh0LCBpbmZvLm1lbnRpb25Qb3NpdGlvbixcclxuICAgICAgICAgICAgICAgICAgICBpbmZvLm1lbnRpb25Qb3NpdGlvbiArIGluZm8ubWVudGlvblRleHQubGVuZ3RoICsgIXRoaXMudHJpYnV0ZS5hdXRvY29tcGxldGVNb2RlKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0LmVsZW1lbnQuZGlzcGF0Y2hFdmVudChyZXBsYWNlRXZlbnQpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBhc3RlSHRtbChodG1sLCBzdGFydFBvcywgZW5kUG9zKSB7XHJcbiAgICAgICAgbGV0IHJhbmdlLCBzZWxcclxuICAgICAgICBzZWwgPSB0aGlzLmdldFdpbmRvd1NlbGVjdGlvbigpXHJcbiAgICAgICAgcmFuZ2UgPSB0aGlzLmdldERvY3VtZW50KCkuY3JlYXRlUmFuZ2UoKVxyXG4gICAgICAgIHJhbmdlLnNldFN0YXJ0KHNlbC5hbmNob3JOb2RlLCBzdGFydFBvcylcclxuICAgICAgICByYW5nZS5zZXRFbmQoc2VsLmFuY2hvck5vZGUsIGVuZFBvcylcclxuICAgICAgICByYW5nZS5kZWxldGVDb250ZW50cygpXHJcblxyXG4gICAgICAgIGxldCBlbCA9IHRoaXMuZ2V0RG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgIGVsLmlubmVySFRNTCA9IGh0bWxcclxuICAgICAgICBsZXQgZnJhZyA9IHRoaXMuZ2V0RG9jdW1lbnQoKS5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXHJcbiAgICAgICAgICAgIG5vZGUsIGxhc3ROb2RlXHJcbiAgICAgICAgd2hpbGUgKChub2RlID0gZWwuZmlyc3RDaGlsZCkpIHtcclxuICAgICAgICAgICAgbGFzdE5vZGUgPSBmcmFnLmFwcGVuZENoaWxkKG5vZGUpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJhbmdlLmluc2VydE5vZGUoZnJhZylcclxuXHJcbiAgICAgICAgLy8gUHJlc2VydmUgdGhlIHNlbGVjdGlvblxyXG4gICAgICAgIGlmIChsYXN0Tm9kZSkge1xyXG4gICAgICAgICAgICByYW5nZSA9IHJhbmdlLmNsb25lUmFuZ2UoKVxyXG4gICAgICAgICAgICByYW5nZS5zZXRTdGFydEFmdGVyKGxhc3ROb2RlKVxyXG4gICAgICAgICAgICByYW5nZS5jb2xsYXBzZSh0cnVlKVxyXG4gICAgICAgICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKClcclxuICAgICAgICAgICAgc2VsLmFkZFJhbmdlKHJhbmdlKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRXaW5kb3dTZWxlY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudHJpYnV0ZS5jb2xsZWN0aW9uLmlmcmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmlidXRlLmNvbGxlY3Rpb24uaWZyYW1lLmNvbnRlbnRXaW5kb3cuZ2V0U2VsZWN0aW9uKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB3aW5kb3cuZ2V0U2VsZWN0aW9uKClcclxuICAgIH1cclxuXHJcbiAgICBnZXROb2RlUG9zaXRpb25JblBhcmVudChlbGVtZW50KSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50LnBhcmVudE5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IGVsZW1lbnQucGFyZW50Tm9kZS5jaGlsZE5vZGVzW2ldXHJcblxyXG4gICAgICAgICAgICBpZiAobm9kZSA9PT0gZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRDb250ZW50RWRpdGFibGVTZWxlY3RlZFBhdGgoY3R4KSB7XHJcbiAgICAgICAgbGV0IHNlbCA9IHRoaXMuZ2V0V2luZG93U2VsZWN0aW9uKClcclxuICAgICAgICBsZXQgc2VsZWN0ZWQgPSBzZWwuYW5jaG9yTm9kZVxyXG4gICAgICAgIGxldCBwYXRoID0gW11cclxuICAgICAgICBsZXQgb2Zmc2V0XHJcblxyXG4gICAgICAgIGlmIChzZWxlY3RlZCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxldCBpXHJcbiAgICAgICAgICAgIGxldCBjZSA9IHNlbGVjdGVkLmNvbnRlbnRFZGl0YWJsZVxyXG4gICAgICAgICAgICB3aGlsZSAoc2VsZWN0ZWQgIT09IG51bGwgJiYgY2UgIT09ICd0cnVlJykge1xyXG4gICAgICAgICAgICAgICAgaSA9IHRoaXMuZ2V0Tm9kZVBvc2l0aW9uSW5QYXJlbnQoc2VsZWN0ZWQpXHJcbiAgICAgICAgICAgICAgICBwYXRoLnB1c2goaSlcclxuICAgICAgICAgICAgICAgIHNlbGVjdGVkID0gc2VsZWN0ZWQucGFyZW50Tm9kZVxyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2UgPSBzZWxlY3RlZC5jb250ZW50RWRpdGFibGVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwYXRoLnJldmVyc2UoKVxyXG5cclxuICAgICAgICAgICAgLy8gZ2V0UmFuZ2VBdCBtYXkgbm90IGV4aXN0LCBuZWVkIGFsdGVybmF0aXZlXHJcbiAgICAgICAgICAgIG9mZnNldCA9IHNlbC5nZXRSYW5nZUF0KDApLnN0YXJ0T2Zmc2V0XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQ6IHNlbGVjdGVkLFxyXG4gICAgICAgICAgICAgICAgcGF0aDogcGF0aCxcclxuICAgICAgICAgICAgICAgIG9mZnNldDogb2Zmc2V0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGV4dFByZWNlZGluZ0N1cnJlbnRTZWxlY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGNvbnRleHQgPSB0aGlzLnRyaWJ1dGUuY3VycmVudCxcclxuICAgICAgICAgICAgdGV4dCA9ICcnXHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pc0NvbnRlbnRFZGl0YWJsZShjb250ZXh0LmVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgIGxldCB0ZXh0Q29tcG9uZW50ID0gdGhpcy50cmlidXRlLmN1cnJlbnQuZWxlbWVudDtcclxuICAgICAgICAgICAgaWYgKHRleHRDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzdGFydFBvcyA9IHRleHRDb21wb25lbnQuc2VsZWN0aW9uU3RhcnRcclxuICAgICAgICAgICAgICAgIGlmICh0ZXh0Q29tcG9uZW50LnZhbHVlICYmIHN0YXJ0UG9zID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gdGV4dENvbXBvbmVudC52YWx1ZS5zdWJzdHJpbmcoMCwgc3RhcnRQb3MpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkRWxlbSA9IHRoaXMuZ2V0V2luZG93U2VsZWN0aW9uKCkuYW5jaG9yTm9kZVxyXG5cclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkRWxlbSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgd29ya2luZ05vZGVDb250ZW50ID0gc2VsZWN0ZWRFbGVtLnRleHRDb250ZW50XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0U3RhcnRPZmZzZXQgPSB0aGlzLmdldFdpbmRvd1NlbGVjdGlvbigpLmdldFJhbmdlQXQoMCkuc3RhcnRPZmZzZXRcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAod29ya2luZ05vZGVDb250ZW50ICYmIHNlbGVjdFN0YXJ0T2Zmc2V0ID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gd29ya2luZ05vZGVDb250ZW50LnN1YnN0cmluZygwLCBzZWxlY3RTdGFydE9mZnNldClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRleHRcclxuICAgIH1cclxuXHJcbiAgICBnZXRMYXN0V29yZEluVGV4dCh0ZXh0KSB7XHJcbiAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXFx1MDBBMC9nLCAnICcpOyAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yOTg1MDQwNy9ob3ctZG8taS1yZXBsYWNlLXVuaWNvZGUtY2hhcmFjdGVyLXUwMGEwLXdpdGgtYS1zcGFjZS1pbi1qYXZhc2NyaXB0XHJcbiAgICAgICAgbGV0IHdvcmRzQXJyYXkgPSB0ZXh0LnNwbGl0KCcgJylcclxuICAgICAgICBsZXQgd29ybGRzQ291bnQgPSB3b3Jkc0FycmF5Lmxlbmd0aCAtIDFcclxuICAgICAgICByZXR1cm4gd29yZHNBcnJheVt3b3JsZHNDb3VudF0udHJpbSgpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VHJpZ2dlckluZm8obWVudUFscmVhZHlBY3RpdmUsIGhhc1RyYWlsaW5nU3BhY2UsIHJlcXVpcmVMZWFkaW5nU3BhY2UsIGFsbG93U3BhY2VzLCBpc0F1dG9jb21wbGV0ZSkge1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLnRyaWJ1dGUuY3VycmVudFxyXG4gICAgICAgIGxldCBzZWxlY3RlZCwgcGF0aCwgb2Zmc2V0XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pc0NvbnRlbnRFZGl0YWJsZShjdHguZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgc2VsZWN0ZWQgPSB0aGlzLnRyaWJ1dGUuY3VycmVudC5lbGVtZW50XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGlvbkluZm8gPSB0aGlzLmdldENvbnRlbnRFZGl0YWJsZVNlbGVjdGVkUGF0aChjdHgpXHJcblxyXG4gICAgICAgICAgICBpZiAoc2VsZWN0aW9uSW5mbykge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQgPSBzZWxlY3Rpb25JbmZvLnNlbGVjdGVkXHJcbiAgICAgICAgICAgICAgICBwYXRoID0gc2VsZWN0aW9uSW5mby5wYXRoXHJcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSBzZWxlY3Rpb25JbmZvLm9mZnNldFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZWZmZWN0aXZlUmFuZ2UgPSB0aGlzLmdldFRleHRQcmVjZWRpbmdDdXJyZW50U2VsZWN0aW9uKClcclxuICAgICAgICBsZXQgbGFzdFdvcmRPZkVmZmVjdGl2ZVJhbmdlID0gdGhpcy5nZXRMYXN0V29yZEluVGV4dChlZmZlY3RpdmVSYW5nZSlcclxuXHJcbiAgICAgICAgaWYgKGlzQXV0b2NvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBtZW50aW9uUG9zaXRpb246IGVmZmVjdGl2ZVJhbmdlLmxlbmd0aCAtIGxhc3RXb3JkT2ZFZmZlY3RpdmVSYW5nZS5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICBtZW50aW9uVGV4dDogbGFzdFdvcmRPZkVmZmVjdGl2ZVJhbmdlLFxyXG4gICAgICAgICAgICAgICAgbWVudGlvblNlbGVjdGVkRWxlbWVudDogc2VsZWN0ZWQsXHJcbiAgICAgICAgICAgICAgICBtZW50aW9uU2VsZWN0ZWRQYXRoOiBwYXRoLFxyXG4gICAgICAgICAgICAgICAgbWVudGlvblNlbGVjdGVkT2Zmc2V0OiBvZmZzZXRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGVmZmVjdGl2ZVJhbmdlICE9PSB1bmRlZmluZWQgJiYgZWZmZWN0aXZlUmFuZ2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgbGV0IG1vc3RSZWNlbnRUcmlnZ2VyQ2hhclBvcyA9IC0xXHJcbiAgICAgICAgICAgIGxldCB0cmlnZ2VyQ2hhclxyXG5cclxuICAgICAgICAgICAgdGhpcy50cmlidXRlLmNvbGxlY3Rpb24uZm9yRWFjaChjb25maWcgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGMgPSBjb25maWcudHJpZ2dlclxyXG4gICAgICAgICAgICAgICAgbGV0IGlkeCA9IGNvbmZpZy5yZXF1aXJlTGVhZGluZ1NwYWNlID9cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleFdpdGhMZWFkaW5nU3BhY2UoZWZmZWN0aXZlUmFuZ2UsIGMpIDpcclxuICAgICAgICAgICAgICAgICAgICBlZmZlY3RpdmVSYW5nZS5sYXN0SW5kZXhPZihjKVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpZHggPiBtb3N0UmVjZW50VHJpZ2dlckNoYXJQb3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBtb3N0UmVjZW50VHJpZ2dlckNoYXJQb3MgPSBpZHhcclxuICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyQ2hhciA9IGNcclxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlTGVhZGluZ1NwYWNlID0gY29uZmlnLnJlcXVpcmVMZWFkaW5nU3BhY2VcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIGlmIChtb3N0UmVjZW50VHJpZ2dlckNoYXJQb3MgPj0gMCAmJlxyXG4gICAgICAgICAgICAgICAgKFxyXG4gICAgICAgICAgICAgICAgICAgIG1vc3RSZWNlbnRUcmlnZ2VyQ2hhclBvcyA9PT0gMCB8fFxyXG4gICAgICAgICAgICAgICAgICAgICFyZXF1aXJlTGVhZGluZ1NwYWNlIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgL1tcXHhBMFxcc10vZy50ZXN0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlZmZlY3RpdmVSYW5nZS5zdWJzdHJpbmcoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3N0UmVjZW50VHJpZ2dlckNoYXJQb3MgLSAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9zdFJlY2VudFRyaWdnZXJDaGFyUG9zKVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFRyaWdnZXJTbmlwcGV0ID0gZWZmZWN0aXZlUmFuZ2Uuc3Vic3RyaW5nKG1vc3RSZWNlbnRUcmlnZ2VyQ2hhclBvcyArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgZWZmZWN0aXZlUmFuZ2UubGVuZ3RoKVxyXG5cclxuICAgICAgICAgICAgICAgIHRyaWdnZXJDaGFyID0gZWZmZWN0aXZlUmFuZ2Uuc3Vic3RyaW5nKG1vc3RSZWNlbnRUcmlnZ2VyQ2hhclBvcywgbW9zdFJlY2VudFRyaWdnZXJDaGFyUG9zICsgMSlcclxuICAgICAgICAgICAgICAgIGxldCBmaXJzdFNuaXBwZXRDaGFyID0gY3VycmVudFRyaWdnZXJTbmlwcGV0LnN1YnN0cmluZygwLCAxKVxyXG4gICAgICAgICAgICAgICAgbGV0IGxlYWRpbmdTcGFjZSA9IGN1cnJlbnRUcmlnZ2VyU25pcHBldC5sZW5ndGggPiAwICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFNuaXBwZXRDaGFyID09PSAnICcgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RTbmlwcGV0Q2hhciA9PT0gJ1xceEEwJ1xyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIGlmIChoYXNUcmFpbGluZ1NwYWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFRyaWdnZXJTbmlwcGV0ID0gY3VycmVudFRyaWdnZXJTbmlwcGV0LnRyaW0oKVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCByZWdleCA9IGFsbG93U3BhY2VzID8gL1teXFxTIF0vZyA6IC9bXFx4QTBcXHNdL2c7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLmhhc1RyYWlsaW5nU3BhY2UgPSByZWdleC50ZXN0KGN1cnJlbnRUcmlnZ2VyU25pcHBldCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFsZWFkaW5nU3BhY2UgJiYgKG1lbnVBbHJlYWR5QWN0aXZlIHx8ICEocmVnZXgudGVzdChjdXJyZW50VHJpZ2dlclNuaXBwZXQpKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW50aW9uUG9zaXRpb246IG1vc3RSZWNlbnRUcmlnZ2VyQ2hhclBvcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVudGlvblRleHQ6IGN1cnJlbnRUcmlnZ2VyU25pcHBldCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVudGlvblNlbGVjdGVkRWxlbWVudDogc2VsZWN0ZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbnRpb25TZWxlY3RlZFBhdGg6IHBhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbnRpb25TZWxlY3RlZE9mZnNldDogb2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW50aW9uVHJpZ2dlckNoYXI6IHRyaWdnZXJDaGFyXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxhc3RJbmRleFdpdGhMZWFkaW5nU3BhY2UgKHN0ciwgY2hhcikge1xyXG4gICAgICAgIGxldCByZXZlcnNlZFN0ciA9IHN0ci5zcGxpdCgnJykucmV2ZXJzZSgpLmpvaW4oJycpXHJcbiAgICAgICAgbGV0IGluZGV4ID0gLTFcclxuXHJcbiAgICAgICAgZm9yIChsZXQgY2lkeCA9IDAsIGxlbiA9IHN0ci5sZW5ndGg7IGNpZHggPCBsZW47IGNpZHgrKykge1xyXG4gICAgICAgICAgICBsZXQgZmlyc3RDaGFyID0gY2lkeCA9PT0gc3RyLmxlbmd0aCAtIDFcclxuICAgICAgICAgICAgbGV0IGxlYWRpbmdTcGFjZSA9IC9cXHMvLnRlc3QocmV2ZXJzZWRTdHJbY2lkeCArIDFdKVxyXG4gICAgICAgICAgICBsZXQgbWF0Y2ggPSBjaGFyID09PSByZXZlcnNlZFN0cltjaWR4XVxyXG5cclxuICAgICAgICAgICAgaWYgKG1hdGNoICYmIChmaXJzdENoYXIgfHwgbGVhZGluZ1NwYWNlKSkge1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSBzdHIubGVuZ3RoIC0gMSAtIGNpZHhcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbmRleFxyXG4gICAgfVxyXG5cclxuICAgIGlzQ29udGVudEVkaXRhYmxlKGVsZW1lbnQpIHtcclxuICAgICAgICByZXR1cm4gZWxlbWVudC5ub2RlTmFtZSAhPT0gJ0lOUFVUJyAmJiBlbGVtZW50Lm5vZGVOYW1lICE9PSAnVEVYVEFSRUEnXHJcbiAgICB9XHJcblxyXG4gICAgaXNNZW51T2ZmU2NyZWVuKGNvb3JkaW5hdGVzLCBtZW51RGltZW5zaW9ucykge1xyXG4gICAgICAgIGxldCB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXHJcbiAgICAgICAgbGV0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxyXG4gICAgICAgIGxldCBkb2MgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcclxuICAgICAgICBsZXQgd2luZG93TGVmdCA9ICh3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jLnNjcm9sbExlZnQpIC0gKGRvYy5jbGllbnRMZWZ0IHx8IDApXHJcbiAgICAgICAgbGV0IHdpbmRvd1RvcCA9ICh3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jLnNjcm9sbFRvcCkgLSAoZG9jLmNsaWVudFRvcCB8fCAwKVxyXG5cclxuICAgICAgICBsZXQgbWVudVRvcCA9IHR5cGVvZiBjb29yZGluYXRlcy50b3AgPT09ICdudW1iZXInID8gY29vcmRpbmF0ZXMudG9wIDogd2luZG93VG9wICsgd2luZG93SGVpZ2h0IC0gY29vcmRpbmF0ZXMuYm90dG9tIC0gbWVudURpbWVuc2lvbnMuaGVpZ2h0XHJcbiAgICAgICAgbGV0IG1lbnVSaWdodCA9IHR5cGVvZiBjb29yZGluYXRlcy5yaWdodCA9PT0gJ251bWJlcicgPyBjb29yZGluYXRlcy5yaWdodCA6IGNvb3JkaW5hdGVzLmxlZnQgKyBtZW51RGltZW5zaW9ucy53aWR0aFxyXG4gICAgICAgIGxldCBtZW51Qm90dG9tID0gdHlwZW9mIGNvb3JkaW5hdGVzLmJvdHRvbSA9PT0gJ251bWJlcicgPyBjb29yZGluYXRlcy5ib3R0b20gOiBjb29yZGluYXRlcy50b3AgKyBtZW51RGltZW5zaW9ucy5oZWlnaHRcclxuICAgICAgICBsZXQgbWVudUxlZnQgPSB0eXBlb2YgY29vcmRpbmF0ZXMubGVmdCA9PT0gJ251bWJlcicgPyBjb29yZGluYXRlcy5sZWZ0IDogd2luZG93TGVmdCArIHdpbmRvd1dpZHRoIC0gY29vcmRpbmF0ZXMucmlnaHQgLSBtZW51RGltZW5zaW9ucy53aWR0aFxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0b3A6IG1lbnVUb3AgPCBNYXRoLmZsb29yKHdpbmRvd1RvcCksXHJcbiAgICAgICAgICAgIHJpZ2h0OiBtZW51UmlnaHQgPiBNYXRoLmNlaWwod2luZG93TGVmdCArIHdpbmRvd1dpZHRoKSxcclxuICAgICAgICAgICAgYm90dG9tOiBtZW51Qm90dG9tID4gTWF0aC5jZWlsKHdpbmRvd1RvcCArIHdpbmRvd0hlaWdodCksXHJcbiAgICAgICAgICAgIGxlZnQ6IG1lbnVMZWZ0IDwgTWF0aC5mbG9vcih3aW5kb3dMZWZ0KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRNZW51RGltZW5zaW9ucygpIHtcclxuICAgICAgICAvLyBXaWR0aCBvZiB0aGUgbWVudSBkZXBlbmRzIG9mIGl0cyBjb250ZW50cyBhbmQgcG9zaXRpb25cclxuICAgICAgICAvLyBXZSBtdXN0IGNoZWNrIHdoYXQgaXRzIHdpZHRoIHdvdWxkIGJlIHdpdGhvdXQgYW55IG9ic3RydWN0aW9uXHJcbiAgICAgICAgLy8gVGhpcyB3YXksIHdlIGNhbiBhY2hpZXZlIGdvb2QgcG9zaXRpb25pbmcgZm9yIGZsaXBwaW5nIHRoZSBtZW51XHJcbiAgICAgICAgbGV0IGRpbWVuc2lvbnMgPSB7XHJcbiAgICAgICAgICAgIHdpZHRoOiBudWxsLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IG51bGxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudHJpYnV0ZS5tZW51LnN0eWxlLmNzc1RleHQgPSBgdG9wOiAwcHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDBweDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGZpeGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDEwMDAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTsgaGlkZGVuO2BcclxuICAgICAgIGRpbWVuc2lvbnMud2lkdGggPSB0aGlzLnRyaWJ1dGUubWVudS5vZmZzZXRXaWR0aFxyXG4gICAgICAgZGltZW5zaW9ucy5oZWlnaHQgPSB0aGlzLnRyaWJ1dGUubWVudS5vZmZzZXRIZWlnaHRcclxuXHJcbiAgICAgICB0aGlzLnRyaWJ1dGUubWVudS5zdHlsZS5jc3NUZXh0ID0gYGRpc3BsYXk6IG5vbmU7YFxyXG5cclxuICAgICAgIHJldHVybiBkaW1lbnNpb25zXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGV4dEFyZWFPcklucHV0VW5kZXJsaW5lUG9zaXRpb24oZWxlbWVudCwgcG9zaXRpb24sIGZsaXBwZWQpIHtcclxuICAgICAgICBsZXQgcHJvcGVydGllcyA9IFsnZGlyZWN0aW9uJywgJ2JveFNpemluZycsICd3aWR0aCcsICdoZWlnaHQnLCAnb3ZlcmZsb3dYJyxcclxuICAgICAgICAgICAgJ292ZXJmbG93WScsICdib3JkZXJUb3BXaWR0aCcsICdib3JkZXJSaWdodFdpZHRoJyxcclxuICAgICAgICAgICAgJ2JvcmRlckJvdHRvbVdpZHRoJywgJ2JvcmRlckxlZnRXaWR0aCcsICdwYWRkaW5nVG9wJyxcclxuICAgICAgICAgICAgJ3BhZGRpbmdSaWdodCcsICdwYWRkaW5nQm90dG9tJywgJ3BhZGRpbmdMZWZ0JyxcclxuICAgICAgICAgICAgJ2ZvbnRTdHlsZScsICdmb250VmFyaWFudCcsICdmb250V2VpZ2h0JywgJ2ZvbnRTdHJldGNoJyxcclxuICAgICAgICAgICAgJ2ZvbnRTaXplJywgJ2ZvbnRTaXplQWRqdXN0JywgJ2xpbmVIZWlnaHQnLCAnZm9udEZhbWlseScsXHJcbiAgICAgICAgICAgICd0ZXh0QWxpZ24nLCAndGV4dFRyYW5zZm9ybScsICd0ZXh0SW5kZW50JyxcclxuICAgICAgICAgICAgJ3RleHREZWNvcmF0aW9uJywgJ2xldHRlclNwYWNpbmcnLCAnd29yZFNwYWNpbmcnXHJcbiAgICAgICAgXVxyXG5cclxuICAgICAgICBsZXQgaXNGaXJlZm94ID0gKHdpbmRvdy5tb3pJbm5lclNjcmVlblggIT09IG51bGwpXHJcblxyXG4gICAgICAgIGxldCBkaXYgPSB0aGlzLmdldERvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICBkaXYuaWQgPSAnaW5wdXQtdGV4dGFyZWEtY2FyZXQtcG9zaXRpb24tbWlycm9yLWRpdidcclxuICAgICAgICB0aGlzLmdldERvY3VtZW50KCkuYm9keS5hcHBlbmRDaGlsZChkaXYpXHJcblxyXG4gICAgICAgIGxldCBzdHlsZSA9IGRpdi5zdHlsZVxyXG4gICAgICAgIGxldCBjb21wdXRlZCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID8gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSA6IGVsZW1lbnQuY3VycmVudFN0eWxlXHJcblxyXG4gICAgICAgIHN0eWxlLndoaXRlU3BhY2UgPSAncHJlLXdyYXAnXHJcbiAgICAgICAgaWYgKGVsZW1lbnQubm9kZU5hbWUgIT09ICdJTlBVVCcpIHtcclxuICAgICAgICAgICAgc3R5bGUud29yZFdyYXAgPSAnYnJlYWstd29yZCdcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHBvc2l0aW9uIG9mZi1zY3JlZW5cclxuICAgICAgICBzdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSdcclxuICAgICAgICBzdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbidcclxuXHJcbiAgICAgICAgLy8gdHJhbnNmZXIgdGhlIGVsZW1lbnQncyBwcm9wZXJ0aWVzIHRvIHRoZSBkaXZcclxuICAgICAgICBwcm9wZXJ0aWVzLmZvckVhY2gocHJvcCA9PiB7XHJcbiAgICAgICAgICAgIHN0eWxlW3Byb3BdID0gY29tcHV0ZWRbcHJvcF1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiAoaXNGaXJlZm94KSB7XHJcbiAgICAgICAgICAgIHN0eWxlLndpZHRoID0gYCR7KHBhcnNlSW50KGNvbXB1dGVkLndpZHRoKSAtIDIpfXB4YFxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5zY3JvbGxIZWlnaHQgPiBwYXJzZUludChjb21wdXRlZC5oZWlnaHQpKVxyXG4gICAgICAgICAgICAgICAgc3R5bGUub3ZlcmZsb3dZID0gJ3Njcm9sbCdcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkaXYudGV4dENvbnRlbnQgPSBlbGVtZW50LnZhbHVlLnN1YnN0cmluZygwLCBwb3NpdGlvbilcclxuXHJcbiAgICAgICAgaWYgKGVsZW1lbnQubm9kZU5hbWUgPT09ICdJTlBVVCcpIHtcclxuICAgICAgICAgICAgZGl2LnRleHRDb250ZW50ID0gZGl2LnRleHRDb250ZW50LnJlcGxhY2UoL1xccy9nLCAnwqAnKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNwYW4gPSB0aGlzLmdldERvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IGVsZW1lbnQudmFsdWUuc3Vic3RyaW5nKHBvc2l0aW9uKSB8fCAnLidcclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoc3BhbilcclxuXHJcbiAgICAgICAgbGV0IHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICAgICAgbGV0IGRvYyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxyXG4gICAgICAgIGxldCB3aW5kb3dMZWZ0ID0gKHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2Muc2Nyb2xsTGVmdCkgLSAoZG9jLmNsaWVudExlZnQgfHwgMClcclxuICAgICAgICBsZXQgd2luZG93VG9wID0gKHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2Muc2Nyb2xsVG9wKSAtIChkb2MuY2xpZW50VG9wIHx8IDApXHJcblxyXG4gICAgICAgIGxldCBjb29yZGluYXRlcyA9IHtcclxuICAgICAgICAgICAgdG9wOiByZWN0LnRvcCArIHdpbmRvd1RvcCArIHNwYW4ub2Zmc2V0VG9wICsgcGFyc2VJbnQoY29tcHV0ZWQuYm9yZGVyVG9wV2lkdGgpICsgcGFyc2VJbnQoY29tcHV0ZWQuZm9udFNpemUpIC0gZWxlbWVudC5zY3JvbGxUb3AsXHJcbiAgICAgICAgICAgIGxlZnQ6IHJlY3QubGVmdCArIHdpbmRvd0xlZnQgKyBzcGFuLm9mZnNldExlZnQgKyBwYXJzZUludChjb21wdXRlZC5ib3JkZXJMZWZ0V2lkdGgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxyXG4gICAgICAgIGxldCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcclxuXHJcbiAgICAgICAgbGV0IG1lbnVEaW1lbnNpb25zID0gdGhpcy5nZXRNZW51RGltZW5zaW9ucygpXHJcbiAgICAgICAgbGV0IG1lbnVJc09mZlNjcmVlbiA9IHRoaXMuaXNNZW51T2ZmU2NyZWVuKGNvb3JkaW5hdGVzLCBtZW51RGltZW5zaW9ucylcclxuXHJcbiAgICAgICAgaWYgKG1lbnVJc09mZlNjcmVlbi5yaWdodCkge1xyXG4gICAgICAgICAgICBjb29yZGluYXRlcy5yaWdodCA9IHdpbmRvd1dpZHRoIC0gY29vcmRpbmF0ZXMubGVmdFxyXG4gICAgICAgICAgICBjb29yZGluYXRlcy5sZWZ0ID0gJ2F1dG8nXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcGFyZW50SGVpZ2h0ID0gdGhpcy50cmlidXRlLm1lbnVDb250YWluZXJcclxuICAgICAgICAgICAgPyB0aGlzLnRyaWJ1dGUubWVudUNvbnRhaW5lci5vZmZzZXRIZWlnaHRcclxuICAgICAgICAgICAgOiB0aGlzLmdldERvY3VtZW50KCkuYm9keS5vZmZzZXRIZWlnaHRcclxuXHJcbiAgICAgICAgaWYgKG1lbnVJc09mZlNjcmVlbi5ib3R0b20pIHtcclxuICAgICAgICAgICAgbGV0IHBhcmVudFJlY3QgPSB0aGlzLnRyaWJ1dGUubWVudUNvbnRhaW5lclxyXG4gICAgICAgICAgICAgICAgPyB0aGlzLnRyaWJ1dGUubWVudUNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gICAgICAgICAgICAgICAgOiB0aGlzLmdldERvY3VtZW50KCkuYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gICAgICAgICAgICBsZXQgc2Nyb2xsU3RpbGxBdmFpbGFibGUgPSBwYXJlbnRIZWlnaHQgLSAod2luZG93SGVpZ2h0IC0gcGFyZW50UmVjdC50b3ApXHJcblxyXG4gICAgICAgICAgICBjb29yZGluYXRlcy5ib3R0b20gPSBzY3JvbGxTdGlsbEF2YWlsYWJsZSArICh3aW5kb3dIZWlnaHQgLSByZWN0LnRvcCAtIHNwYW4ub2Zmc2V0VG9wKVxyXG4gICAgICAgICAgICBjb29yZGluYXRlcy50b3AgPSAnYXV0bydcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1lbnVJc09mZlNjcmVlbiA9IHRoaXMuaXNNZW51T2ZmU2NyZWVuKGNvb3JkaW5hdGVzLCBtZW51RGltZW5zaW9ucylcclxuICAgICAgICBpZiAobWVudUlzT2ZmU2NyZWVuLmxlZnQpIHtcclxuICAgICAgICAgICAgY29vcmRpbmF0ZXMubGVmdCA9IHdpbmRvd1dpZHRoID4gbWVudURpbWVuc2lvbnMud2lkdGhcclxuICAgICAgICAgICAgICAgID8gd2luZG93TGVmdCArIHdpbmRvd1dpZHRoIC0gbWVudURpbWVuc2lvbnMud2lkdGhcclxuICAgICAgICAgICAgICAgIDogd2luZG93TGVmdFxyXG4gICAgICAgICAgICBkZWxldGUgY29vcmRpbmF0ZXMucmlnaHRcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1lbnVJc09mZlNjcmVlbi50b3ApIHtcclxuICAgICAgICAgICAgY29vcmRpbmF0ZXMudG9wID0gd2luZG93SGVpZ2h0ID4gbWVudURpbWVuc2lvbnMuaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICA/IHdpbmRvd1RvcCArIHdpbmRvd0hlaWdodCAtIG1lbnVEaW1lbnNpb25zLmhlaWdodFxyXG4gICAgICAgICAgICAgICAgOiB3aW5kb3dUb3BcclxuICAgICAgICAgICAgZGVsZXRlIGNvb3JkaW5hdGVzLmJvdHRvbVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nZXREb2N1bWVudCgpLmJvZHkucmVtb3ZlQ2hpbGQoZGl2KVxyXG4gICAgICAgIHJldHVybiBjb29yZGluYXRlc1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbnRlbnRFZGl0YWJsZUNhcmV0UG9zaXRpb24oc2VsZWN0ZWROb2RlUG9zaXRpb24pIHtcclxuICAgICAgICBsZXQgbWFya2VyVGV4dENoYXIgPSAn77u/J1xyXG4gICAgICAgIGxldCBtYXJrZXJFbCwgbWFya2VySWQgPSBgc2VsXyR7bmV3IERhdGUoKS5nZXRUaW1lKCl9XyR7TWF0aC5yYW5kb20oKS50b1N0cmluZygpLnN1YnN0cigyKX1gXHJcbiAgICAgICAgbGV0IHJhbmdlXHJcbiAgICAgICAgbGV0IHNlbCA9IHRoaXMuZ2V0V2luZG93U2VsZWN0aW9uKClcclxuICAgICAgICBsZXQgcHJldlJhbmdlID0gc2VsLmdldFJhbmdlQXQoMClcclxuXHJcbiAgICAgICAgcmFuZ2UgPSB0aGlzLmdldERvY3VtZW50KCkuY3JlYXRlUmFuZ2UoKVxyXG4gICAgICAgIHJhbmdlLnNldFN0YXJ0KHNlbC5hbmNob3JOb2RlLCBzZWxlY3RlZE5vZGVQb3NpdGlvbilcclxuICAgICAgICByYW5nZS5zZXRFbmQoc2VsLmFuY2hvck5vZGUsIHNlbGVjdGVkTm9kZVBvc2l0aW9uKVxyXG5cclxuICAgICAgICByYW5nZS5jb2xsYXBzZShmYWxzZSlcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBtYXJrZXIgZWxlbWVudCBjb250YWluaW5nIGEgc2luZ2xlIGludmlzaWJsZSBjaGFyYWN0ZXIgdXNpbmcgRE9NIG1ldGhvZHMgYW5kIGluc2VydCBpdFxyXG4gICAgICAgIG1hcmtlckVsID0gdGhpcy5nZXREb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgICAgIG1hcmtlckVsLmlkID0gbWFya2VySWRcclxuXHJcbiAgICAgICAgbWFya2VyRWwuYXBwZW5kQ2hpbGQodGhpcy5nZXREb2N1bWVudCgpLmNyZWF0ZVRleHROb2RlKG1hcmtlclRleHRDaGFyKSlcclxuICAgICAgICByYW5nZS5pbnNlcnROb2RlKG1hcmtlckVsKVxyXG4gICAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKVxyXG4gICAgICAgIHNlbC5hZGRSYW5nZShwcmV2UmFuZ2UpXHJcblxyXG4gICAgICAgIGxldCByZWN0ID0gbWFya2VyRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuICAgICAgICBsZXQgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XHJcbiAgICAgICAgbGV0IHdpbmRvd0xlZnQgPSAod2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvYy5zY3JvbGxMZWZ0KSAtIChkb2MuY2xpZW50TGVmdCB8fCAwKVxyXG4gICAgICAgIGxldCB3aW5kb3dUb3AgPSAod2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvYy5zY3JvbGxUb3ApIC0gKGRvYy5jbGllbnRUb3AgfHwgMClcclxuICAgICAgICBsZXQgY29vcmRpbmF0ZXMgPSB7XHJcbiAgICAgICAgICAgIGxlZnQ6IHJlY3QubGVmdCArIHdpbmRvd0xlZnQsXHJcbiAgICAgICAgICAgIHRvcDogcmVjdC50b3AgKyBtYXJrZXJFbC5vZmZzZXRIZWlnaHQgKyB3aW5kb3dUb3BcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGhcclxuICAgICAgICBsZXQgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XHJcblxyXG4gICAgICAgIGxldCBtZW51RGltZW5zaW9ucyA9IHRoaXMuZ2V0TWVudURpbWVuc2lvbnMoKVxyXG4gICAgICAgIGxldCBtZW51SXNPZmZTY3JlZW4gPSB0aGlzLmlzTWVudU9mZlNjcmVlbihjb29yZGluYXRlcywgbWVudURpbWVuc2lvbnMpXHJcblxyXG4gICAgICAgIGlmIChtZW51SXNPZmZTY3JlZW4ucmlnaHQpIHtcclxuICAgICAgICAgICAgY29vcmRpbmF0ZXMubGVmdCA9ICdhdXRvJ1xyXG4gICAgICAgICAgICBjb29yZGluYXRlcy5yaWdodCA9IHdpbmRvd1dpZHRoIC0gcmVjdC5sZWZ0IC0gd2luZG93TGVmdFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHBhcmVudEhlaWdodCA9IHRoaXMudHJpYnV0ZS5tZW51Q29udGFpbmVyXHJcbiAgICAgICAgICAgID8gdGhpcy50cmlidXRlLm1lbnVDb250YWluZXIub2Zmc2V0SGVpZ2h0XHJcbiAgICAgICAgICAgIDogdGhpcy5nZXREb2N1bWVudCgpLmJvZHkub2Zmc2V0SGVpZ2h0XHJcblxyXG4gICAgICAgIGlmIChtZW51SXNPZmZTY3JlZW4uYm90dG9tKSB7XHJcbiAgICAgICAgICAgIGxldCBwYXJlbnRSZWN0ID0gdGhpcy50cmlidXRlLm1lbnVDb250YWluZXJcclxuICAgICAgICAgICAgICAgID8gdGhpcy50cmlidXRlLm1lbnVDb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuICAgICAgICAgICAgICAgIDogdGhpcy5nZXREb2N1bWVudCgpLmJvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuICAgICAgICAgICAgbGV0IHNjcm9sbFN0aWxsQXZhaWxhYmxlID0gcGFyZW50SGVpZ2h0IC0gKHdpbmRvd0hlaWdodCAtIHBhcmVudFJlY3QudG9wKVxyXG5cclxuICAgICAgICAgICAgY29vcmRpbmF0ZXMudG9wID0gJ2F1dG8nXHJcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzLmJvdHRvbSA9IHNjcm9sbFN0aWxsQXZhaWxhYmxlICsgKHdpbmRvd0hlaWdodCAtIHJlY3QudG9wKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWVudUlzT2ZmU2NyZWVuID0gdGhpcy5pc01lbnVPZmZTY3JlZW4oY29vcmRpbmF0ZXMsIG1lbnVEaW1lbnNpb25zKVxyXG4gICAgICAgIGlmIChtZW51SXNPZmZTY3JlZW4ubGVmdCkge1xyXG4gICAgICAgICAgICBjb29yZGluYXRlcy5sZWZ0ID0gd2luZG93V2lkdGggPiBtZW51RGltZW5zaW9ucy53aWR0aFxyXG4gICAgICAgICAgICAgICAgPyB3aW5kb3dMZWZ0ICsgd2luZG93V2lkdGggLSBtZW51RGltZW5zaW9ucy53aWR0aFxyXG4gICAgICAgICAgICAgICAgOiB3aW5kb3dMZWZ0XHJcbiAgICAgICAgICAgIGRlbGV0ZSBjb29yZGluYXRlcy5yaWdodFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobWVudUlzT2ZmU2NyZWVuLnRvcCkge1xyXG4gICAgICAgICAgICBjb29yZGluYXRlcy50b3AgPSB3aW5kb3dIZWlnaHQgPiBtZW51RGltZW5zaW9ucy5oZWlnaHRcclxuICAgICAgICAgICAgICAgID8gd2luZG93VG9wICsgd2luZG93SGVpZ2h0IC0gbWVudURpbWVuc2lvbnMuaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICA6IHdpbmRvd1RvcFxyXG4gICAgICAgICAgICBkZWxldGUgY29vcmRpbmF0ZXMuYm90dG9tXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYXJrZXJFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG1hcmtlckVsKVxyXG4gICAgICAgIHJldHVybiBjb29yZGluYXRlc1xyXG4gICAgfVxyXG5cclxuICAgIHNjcm9sbEludG9WaWV3KGVsZW0pIHtcclxuICAgICAgICBsZXQgcmVhc29uYWJsZUJ1ZmZlciA9IDIwLFxyXG4gICAgICAgICAgICBjbGllbnRSZWN0XHJcbiAgICAgICAgbGV0IG1heFNjcm9sbERpc3BsYWNlbWVudCA9IDEwMFxyXG4gICAgICAgIGxldCBlID0gdGhpcy5tZW51XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgZSA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcclxuXHJcbiAgICAgICAgd2hpbGUgKGNsaWVudFJlY3QgPT09IHVuZGVmaW5lZCB8fCBjbGllbnRSZWN0LmhlaWdodCA9PT0gMCkge1xyXG4gICAgICAgICAgICBjbGllbnRSZWN0ID0gZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG5cclxuICAgICAgICAgICAgaWYgKGNsaWVudFJlY3QuaGVpZ2h0ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBlID0gZS5jaGlsZE5vZGVzWzBdXHJcbiAgICAgICAgICAgICAgICBpZiAoZSA9PT0gdW5kZWZpbmVkIHx8ICFlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZWxlbVRvcCA9IGNsaWVudFJlY3QudG9wXHJcbiAgICAgICAgbGV0IGVsZW1Cb3R0b20gPSBlbGVtVG9wICsgY2xpZW50UmVjdC5oZWlnaHRcclxuXHJcbiAgICAgICAgaWYgKGVsZW1Ub3AgPCAwKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCB3aW5kb3cucGFnZVlPZmZzZXQgKyBjbGllbnRSZWN0LnRvcCAtIHJlYXNvbmFibGVCdWZmZXIpXHJcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtQm90dG9tID4gd2luZG93LmlubmVySGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxldCBtYXhZID0gd2luZG93LnBhZ2VZT2Zmc2V0ICsgY2xpZW50UmVjdC50b3AgLSByZWFzb25hYmxlQnVmZmVyXHJcblxyXG4gICAgICAgICAgICBpZiAobWF4WSAtIHdpbmRvdy5wYWdlWU9mZnNldCA+IG1heFNjcm9sbERpc3BsYWNlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgbWF4WSA9IHdpbmRvdy5wYWdlWU9mZnNldCArIG1heFNjcm9sbERpc3BsYWNlbWVudFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0WSA9IHdpbmRvdy5wYWdlWU9mZnNldCAtICh3aW5kb3cuaW5uZXJIZWlnaHQgLSBlbGVtQm90dG9tKVxyXG5cclxuICAgICAgICAgICAgaWYgKHRhcmdldFkgPiBtYXhZKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRZID0gbWF4WVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgdGFyZ2V0WSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBUcmlidXRlUmFuZ2U7XHJcbiIsIi8vIFRoYW5rcyB0byBodHRwczovL2dpdGh1Yi5jb20vbWF0dHlvcmsvZnV6enlcclxuY2xhc3MgVHJpYnV0ZVNlYXJjaCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0cmlidXRlKSB7XHJcbiAgICAgICAgdGhpcy50cmlidXRlID0gdHJpYnV0ZVxyXG4gICAgICAgIHRoaXMudHJpYnV0ZS5zZWFyY2ggPSB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgc2ltcGxlRmlsdGVyKHBhdHRlcm4sIGFycmF5KSB7XHJcbiAgICAgICAgcmV0dXJuIGFycmF5LmZpbHRlcihzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZXN0KHBhdHRlcm4sIHN0cmluZylcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHRlc3QocGF0dGVybiwgc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2gocGF0dGVybiwgc3RyaW5nKSAhPT0gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIG1hdGNoKHBhdHRlcm4sIHN0cmluZywgb3B0cykge1xyXG4gICAgICAgIG9wdHMgPSBvcHRzIHx8IHt9XHJcbiAgICAgICAgbGV0IHBhdHRlcm5JZHggPSAwLFxyXG4gICAgICAgICAgICByZXN1bHQgPSBbXSxcclxuICAgICAgICAgICAgbGVuID0gc3RyaW5nLmxlbmd0aCxcclxuICAgICAgICAgICAgdG90YWxTY29yZSA9IDAsXHJcbiAgICAgICAgICAgIGN1cnJTY29yZSA9IDAsXHJcbiAgICAgICAgICAgIHByZSA9IG9wdHMucHJlIHx8ICcnLFxyXG4gICAgICAgICAgICBwb3N0ID0gb3B0cy5wb3N0IHx8ICcnLFxyXG4gICAgICAgICAgICBjb21wYXJlU3RyaW5nID0gb3B0cy5jYXNlU2Vuc2l0aXZlICYmIHN0cmluZyB8fCBzdHJpbmcudG9Mb3dlckNhc2UoKSxcclxuICAgICAgICAgICAgY2gsIGNvbXBhcmVDaGFyXHJcblxyXG4gICAgICAgIGlmIChvcHRzLnNraXApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtyZW5kZXJlZDogc3RyaW5nLCBzY29yZTogMH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBhdHRlcm4gPSBvcHRzLmNhc2VTZW5zaXRpdmUgJiYgcGF0dGVybiB8fCBwYXR0ZXJuLnRvTG93ZXJDYXNlKClcclxuXHJcbiAgICAgICAgbGV0IHBhdHRlcm5DYWNoZSA9IHRoaXMudHJhdmVyc2UoY29tcGFyZVN0cmluZywgcGF0dGVybiwgMCwgMCwgW10pXHJcbiAgICAgICAgaWYgKCFwYXR0ZXJuQ2FjaGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGxcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVuZGVyZWQ6IHRoaXMucmVuZGVyKHN0cmluZywgcGF0dGVybkNhY2hlLmNhY2hlLCBwcmUsIHBvc3QpLFxyXG4gICAgICAgICAgICBzY29yZTogcGF0dGVybkNhY2hlLnNjb3JlXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyYXZlcnNlKHN0cmluZywgcGF0dGVybiwgc3RyaW5nSW5kZXgsIHBhdHRlcm5JbmRleCwgcGF0dGVybkNhY2hlKSB7XHJcbiAgICAgICAgLy8gaWYgdGhlIHBhdHRlcm4gc2VhcmNoIGF0IGVuZFxyXG4gICAgICAgIGlmIChwYXR0ZXJuLmxlbmd0aCA9PT0gcGF0dGVybkluZGV4KSB7XHJcblxyXG4gICAgICAgICAgICAvLyBjYWxjdWxhdGUgc2NvcmUgYW5kIGNvcHkgdGhlIGNhY2hlIGNvbnRhaW5pbmcgdGhlIGluZGljZXMgd2hlcmUgaXQncyBmb3VuZFxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2NvcmU6IHRoaXMuY2FsY3VsYXRlU2NvcmUocGF0dGVybkNhY2hlKSxcclxuICAgICAgICAgICAgICAgIGNhY2hlOiBwYXR0ZXJuQ2FjaGUuc2xpY2UoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBpZiBzdHJpbmcgYXQgZW5kIG9yIHJlbWFpbmluZyBwYXR0ZXJuID4gcmVtYWluaW5nIHN0cmluZ1xyXG4gICAgICAgIGlmIChzdHJpbmcubGVuZ3RoID09PSBzdHJpbmdJbmRleCB8fCBwYXR0ZXJuLmxlbmd0aCAtIHBhdHRlcm5JbmRleCA+IHN0cmluZy5sZW5ndGggLSBzdHJpbmdJbmRleCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYyA9IHBhdHRlcm5bcGF0dGVybkluZGV4XVxyXG4gICAgICAgIGxldCBpbmRleCA9IHN0cmluZy5pbmRleE9mKGMsIHN0cmluZ0luZGV4KVxyXG4gICAgICAgIGxldCBiZXN0LCB0ZW1wXHJcblxyXG4gICAgICAgIHdoaWxlIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIHBhdHRlcm5DYWNoZS5wdXNoKGluZGV4KVxyXG4gICAgICAgICAgICB0ZW1wID0gdGhpcy50cmF2ZXJzZShzdHJpbmcsIHBhdHRlcm4sIGluZGV4ICsgMSwgcGF0dGVybkluZGV4ICsgMSwgcGF0dGVybkNhY2hlKVxyXG4gICAgICAgICAgICBwYXR0ZXJuQ2FjaGUucG9wKClcclxuXHJcbiAgICAgICAgICAgIC8vIGlmIGRvd25zdHJlYW0gdHJhdmVyc2FsIGZhaWxlZCwgcmV0dXJuIGJlc3QgYW5zd2VyIHNvIGZhclxyXG4gICAgICAgICAgICBpZiAoIXRlbXApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBiZXN0XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghYmVzdCB8fCBiZXN0LnNjb3JlIDwgdGVtcC5zY29yZSkge1xyXG4gICAgICAgICAgICAgICAgYmVzdCA9IHRlbXBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaW5kZXggPSBzdHJpbmcuaW5kZXhPZihjLCBpbmRleCArIDEpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYmVzdFxyXG4gICAgfVxyXG5cclxuICAgIGNhbGN1bGF0ZVNjb3JlKHBhdHRlcm5DYWNoZSkge1xyXG4gICAgICAgIGxldCBzY29yZSA9IDBcclxuICAgICAgICBsZXQgdGVtcCA9IDFcclxuXHJcbiAgICAgICAgcGF0dGVybkNhY2hlLmZvckVhY2goKGluZGV4LCBpKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhdHRlcm5DYWNoZVtpIC0gMV0gKyAxID09PSBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXAgKz0gdGVtcCArIDFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXAgPSAxXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNjb3JlICs9IHRlbXBcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gc2NvcmVcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoc3RyaW5nLCBpbmRpY2VzLCBwcmUsIHBvc3QpIHtcclxuICAgICAgICB2YXIgcmVuZGVyZWQgPSBzdHJpbmcuc3Vic3RyaW5nKDAsIGluZGljZXNbMF0pXHJcblxyXG4gICAgICAgIGluZGljZXMuZm9yRWFjaCgoaW5kZXgsIGkpID0+IHtcclxuICAgICAgICAgICAgcmVuZGVyZWQgKz0gcHJlICsgc3RyaW5nW2luZGV4XSArIHBvc3QgK1xyXG4gICAgICAgICAgICAgICAgc3RyaW5nLnN1YnN0cmluZyhpbmRleCArIDEsIChpbmRpY2VzW2kgKyAxXSkgPyBpbmRpY2VzW2kgKyAxXSA6IHN0cmluZy5sZW5ndGgpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlbmRlcmVkXHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyKHBhdHRlcm4sIGFyciwgb3B0cykge1xyXG4gICAgICAgIG9wdHMgPSBvcHRzIHx8IHt9XHJcbiAgICAgICAgcmV0dXJuIGFyclxyXG4gICAgICAgICAgICAucmVkdWNlKChwcmV2LCBlbGVtZW50LCBpZHgsIGFycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHN0ciA9IGVsZW1lbnRcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAob3B0cy5leHRyYWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gb3B0cy5leHRyYWN0KGVsZW1lbnQpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc3RyKSB7IC8vIHRha2UgY2FyZSBvZiB1bmRlZmluZWRzIC8gbnVsbHMgLyBldGMuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciA9ICcnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCByZW5kZXJlZCA9IHRoaXMubWF0Y2gocGF0dGVybiwgc3RyLCBvcHRzKVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyZW5kZXJlZCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldltwcmV2Lmxlbmd0aF0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZzogcmVuZGVyZWQucmVuZGVyZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlOiByZW5kZXJlZC5zY29yZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGlkeCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IGVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZXZcclxuICAgICAgICAgICAgfSwgW10pXHJcblxyXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjb21wYXJlID0gYi5zY29yZSAtIGEuc2NvcmVcclxuICAgICAgICAgICAgaWYgKGNvbXBhcmUpIHJldHVybiBjb21wYXJlXHJcbiAgICAgICAgICAgIHJldHVybiBhLmluZGV4IC0gYi5pbmRleFxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRyaWJ1dGVTZWFyY2g7XHJcbiIsIi8qKlxyXG4qIFRyaWJ1dGUuanNcclxuKiBOYXRpdmUgRVM2IEphdmFTY3JpcHQgQG1lbnRpb24gUGx1Z2luXHJcbioqL1xyXG5cclxuaW1wb3J0IFRyaWJ1dGUgZnJvbSBcIi4vVHJpYnV0ZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVHJpYnV0ZTtcclxuIiwiaWYgKCFBcnJheS5wcm90b3R5cGUuZmluZCkge1xyXG4gICAgQXJyYXkucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbihwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAodGhpcyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5wcm90b3R5cGUuZmluZCBjYWxsZWQgb24gbnVsbCBvciB1bmRlZmluZWQnKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdwcmVkaWNhdGUgbXVzdCBiZSBhIGZ1bmN0aW9uJylcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxpc3QgPSBPYmplY3QodGhpcylcclxuICAgICAgICB2YXIgbGVuZ3RoID0gbGlzdC5sZW5ndGggPj4+IDBcclxuICAgICAgICB2YXIgdGhpc0FyZyA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgIHZhciB2YWx1ZVxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gbGlzdFtpXVxyXG4gICAgICAgICAgICBpZiAocHJlZGljYXRlLmNhbGwodGhpc0FyZywgdmFsdWUsIGksIGxpc3QpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICB9XHJcbn1cclxuXHJcbmlmICh3aW5kb3cgJiYgdHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCAhPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcykge1xyXG4gICAgcGFyYW1zID0gcGFyYW1zIHx8IHtcclxuICAgICAgYnViYmxlczogZmFsc2UsXHJcbiAgICAgIGNhbmNlbGFibGU6IGZhbHNlLFxyXG4gICAgICBkZXRhaWw6IHVuZGVmaW5lZFxyXG4gICAgfVxyXG4gICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpXHJcbiAgICBldnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpXHJcbiAgICByZXR1cm4gZXZ0XHJcbiAgfVxyXG5cclxuIGlmICh0eXBlb2Ygd2luZG93LkV2ZW50ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICBDdXN0b21FdmVudC5wcm90b3R5cGUgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlXHJcbiB9XHJcblxyXG4gIHdpbmRvdy5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50XHJcbn0iXX0=
