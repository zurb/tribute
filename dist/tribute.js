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
        new _TributeSearch2.default(this, searchOpts);
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
                    if (!_this2.current.collection.noMatchTemplate) {
                        _this2.hideMenu();
                    } else {
                        ul.innerHTML = _this2.current.collection.noMatchTemplate();
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
                        var li = e.target;
                        var index = li.getAttribute('data-index');
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
    function TributeSearch(tribute, opts) {
        _classCallCheck(this, TributeSearch);

        this.tribute = tribute;
        this.tribute.search = this;
        this.opts = opts;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvVHJpYnV0ZS5qcyIsInNyYy9UcmlidXRlRXZlbnRzLmpzIiwic3JjL1RyaWJ1dGVNZW51RXZlbnRzLmpzIiwic3JjL1RyaWJ1dGVSYW5nZS5qcyIsInNyYy9UcmlidXRlU2VhcmNoLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztJQUVNLE87QUFDRiwyQkFvQkc7QUFBQTs7QUFBQSwrQkFuQkMsTUFtQkQ7QUFBQSxZQW5CQyxNQW1CRCwrQkFuQlUsSUFtQlY7QUFBQSwrQkFsQkMsTUFrQkQ7QUFBQSxZQWxCQyxNQWtCRCwrQkFsQlUsSUFrQlY7QUFBQSxvQ0FqQkMsV0FpQkQ7QUFBQSxZQWpCQyxXQWlCRCxvQ0FqQmUsV0FpQmY7QUFBQSxnQ0FoQkMsT0FnQkQ7QUFBQSxZQWhCQyxPQWdCRCxnQ0FoQlcsR0FnQlg7QUFBQSx5Q0FmQyxnQkFlRDtBQUFBLFlBZkMsZ0JBZUQseUNBZm9CLEtBZXBCO0FBQUEsdUNBZEMsY0FjRDtBQUFBLFlBZEMsY0FjRCx1Q0Fka0IsSUFjbEI7QUFBQSx5Q0FiQyxnQkFhRDtBQUFBLFlBYkMsZ0JBYUQseUNBYm9CLElBYXBCO0FBQUEsK0JBWkMsTUFZRDtBQUFBLFlBWkMsTUFZRCwrQkFaVSxLQVlWO0FBQUEsaUNBWEMsUUFXRDtBQUFBLFlBWEMsUUFXRCxpQ0FYWSxPQVdaO0FBQUEsbUNBVkMsVUFVRDtBQUFBLFlBVkMsVUFVRCxtQ0FWYyxJQVVkO0FBQUEsc0NBVEMsYUFTRDtBQUFBLFlBVEMsYUFTRCxzQ0FUaUIsSUFTakI7QUFBQSx3Q0FSQyxlQVFEO0FBQUEsWUFSQyxlQVFELHdDQVJtQixJQVFuQjtBQUFBLHlDQVBDLG1CQU9EO0FBQUEsWUFQQyxtQkFPRCx5Q0FQdUIsSUFPdkI7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QUFQLEdBQXFCLFdBQXJCO0FBQ0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgVHJpYnV0ZVV0aWxzIGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgVHJpYnV0ZUV2ZW50cyBmcm9tIFwiLi9UcmlidXRlRXZlbnRzXCI7XG5pbXBvcnQgVHJpYnV0ZU1lbnVFdmVudHMgZnJvbSBcIi4vVHJpYnV0ZU1lbnVFdmVudHNcIjtcbmltcG9ydCBUcmlidXRlUmFuZ2UgZnJvbSBcIi4vVHJpYnV0ZVJhbmdlXCI7XG5pbXBvcnQgVHJpYnV0ZVNlYXJjaCBmcm9tIFwiLi9UcmlidXRlU2VhcmNoXCI7XG5cbmNsYXNzIFRyaWJ1dGUge1xuICAgIGNvbnN0cnVjdG9yKHtcbiAgICAgICAgdmFsdWVzID0gbnVsbCxcbiAgICAgICAgaWZyYW1lID0gbnVsbCxcbiAgICAgICAgc2VsZWN0Q2xhc3MgPSAnaGlnaGxpZ2h0JyxcbiAgICAgICAgdHJpZ2dlciA9ICdAJyxcbiAgICAgICAgYXV0b2NvbXBsZXRlTW9kZSA9IGZhbHNlLFxuICAgICAgICBzZWxlY3RUZW1wbGF0ZSA9IG51bGwsXG4gICAgICAgIG1lbnVJdGVtVGVtcGxhdGUgPSBudWxsLFxuICAgICAgICBsb29rdXAgPSAna2V5JyxcbiAgICAgICAgZmlsbEF0dHIgPSAndmFsdWUnLFxuICAgICAgICBjb2xsZWN0aW9uID0gbnVsbCxcbiAgICAgICAgbWVudUNvbnRhaW5lciA9IG51bGwsXG4gICAgICAgIG5vTWF0Y2hUZW1wbGF0ZSA9IG51bGwsXG4gICAgICAgIHJlcXVpcmVMZWFkaW5nU3BhY2UgPSB0cnVlLFxuICAgICAgICBhbGxvd1NwYWNlcyA9IGZhbHNlLFxuICAgICAgICByZXBsYWNlVGV4dFN1ZmZpeCA9IG51bGwsXG4gICAgICAgIHBvc2l0aW9uTWVudSA9IHRydWUsXG4gICAgICAgIHNwYWNlU2VsZWN0c01hdGNoID0gZmFsc2UsXG4gICAgICAgIHNlYXJjaE9wdHMgPSB7fSxcbiAgICAgICAgbWVudUl0ZW1MaW1pdCA9IG51bGwsXG4gICAgfSkge1xuICAgICAgICB0aGlzLmF1dG9jb21wbGV0ZU1vZGUgPSBhdXRvY29tcGxldGVNb2RlXG4gICAgICAgIHRoaXMubWVudVNlbGVjdGVkID0gMFxuICAgICAgICB0aGlzLmN1cnJlbnQgPSB7fVxuICAgICAgICB0aGlzLmlucHV0RXZlbnQgPSBmYWxzZVxuICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2VcbiAgICAgICAgdGhpcy5tZW51Q29udGFpbmVyID0gbWVudUNvbnRhaW5lclxuICAgICAgICB0aGlzLmFsbG93U3BhY2VzID0gYWxsb3dTcGFjZXNcbiAgICAgICAgdGhpcy5yZXBsYWNlVGV4dFN1ZmZpeCA9IHJlcGxhY2VUZXh0U3VmZml4XG4gICAgICAgIHRoaXMucG9zaXRpb25NZW51ID0gcG9zaXRpb25NZW51XG4gICAgICAgIHRoaXMuaGFzVHJhaWxpbmdTcGFjZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNwYWNlU2VsZWN0c01hdGNoID0gc3BhY2VTZWxlY3RzTWF0Y2g7XG5cbiAgICAgICAgaWYgKHRoaXMuYXV0b2NvbXBsZXRlTW9kZSkge1xuICAgICAgICAgICAgdHJpZ2dlciA9ICcnXG4gICAgICAgICAgICBhbGxvd1NwYWNlcyA9IGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb24gPSBbe1xuICAgICAgICAgICAgICAgIC8vIHN5bWJvbCB0aGF0IHN0YXJ0cyB0aGUgbG9va3VwXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogdHJpZ2dlcixcblxuICAgICAgICAgICAgICAgIC8vIGlzIGl0IHdyYXBwZWQgaW4gYW4gaWZyYW1lXG4gICAgICAgICAgICAgICAgaWZyYW1lOiBpZnJhbWUsXG5cbiAgICAgICAgICAgICAgICAvLyBjbGFzcyBhcHBsaWVkIHRvIHNlbGVjdGVkIGl0ZW1cbiAgICAgICAgICAgICAgICBzZWxlY3RDbGFzczogc2VsZWN0Q2xhc3MsXG5cbiAgICAgICAgICAgICAgICAvLyBmdW5jdGlvbiBjYWxsZWQgb24gc2VsZWN0IHRoYXQgcmV0dW5zIHRoZSBjb250ZW50IHRvIGluc2VydFxuICAgICAgICAgICAgICAgIHNlbGVjdFRlbXBsYXRlOiAoc2VsZWN0VGVtcGxhdGUgfHwgVHJpYnV0ZS5kZWZhdWx0U2VsZWN0VGVtcGxhdGUpLmJpbmQodGhpcyksXG5cbiAgICAgICAgICAgICAgICAvLyBmdW5jdGlvbiBjYWxsZWQgdGhhdCByZXR1cm5zIGNvbnRlbnQgZm9yIGFuIGl0ZW1cbiAgICAgICAgICAgICAgICBtZW51SXRlbVRlbXBsYXRlOiAobWVudUl0ZW1UZW1wbGF0ZSB8fCBUcmlidXRlLmRlZmF1bHRNZW51SXRlbVRlbXBsYXRlKS5iaW5kKHRoaXMpLFxuXG4gICAgICAgICAgICAgICAgLy8gZnVuY3Rpb24gY2FsbGVkIHdoZW4gbWVudSBpcyBlbXB0eSwgZGlzYWJsZXMgaGlkaW5nIG9mIG1lbnUuXG4gICAgICAgICAgICAgICAgbm9NYXRjaFRlbXBsYXRlOiAodCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHQuYmluZCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vTWF0Y2hUZW1wbGF0ZSB8fCBmdW5jdGlvbiAoKSB7cmV0dXJuICcnfS5iaW5kKHRoaXMpXG4gICAgICAgICAgICAgICAgfSkobm9NYXRjaFRlbXBsYXRlKSxcblxuICAgICAgICAgICAgICAgIC8vIGNvbHVtbiB0byBzZWFyY2ggYWdhaW5zdCBpbiB0aGUgb2JqZWN0XG4gICAgICAgICAgICAgICAgbG9va3VwOiBsb29rdXAsXG5cbiAgICAgICAgICAgICAgICAvLyBjb2x1bW4gdGhhdCBjb250YWlucyB0aGUgY29udGVudCB0byBpbnNlcnQgYnkgZGVmYXVsdFxuICAgICAgICAgICAgICAgIGZpbGxBdHRyOiBmaWxsQXR0cixcblxuICAgICAgICAgICAgICAgIC8vIGFycmF5IG9mIG9iamVjdHMgb3IgYSBmdW5jdGlvbiByZXR1cm5pbmcgYW4gYXJyYXkgb2Ygb2JqZWN0c1xuICAgICAgICAgICAgICAgIHZhbHVlczogdmFsdWVzLFxuXG4gICAgICAgICAgICAgICAgcmVxdWlyZUxlYWRpbmdTcGFjZTogcmVxdWlyZUxlYWRpbmdTcGFjZSxcblxuICAgICAgICAgICAgICAgIHNlYXJjaE9wdHM6IHNlYXJjaE9wdHMsXG5cbiAgICAgICAgICAgICAgICBtZW51SXRlbUxpbWl0OiBtZW51SXRlbUxpbWl0LFxuICAgICAgICAgICAgfV1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdXRvY29tcGxldGVNb2RlKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignVHJpYnV0ZSBpbiBhdXRvY29tcGxldGUgbW9kZSBkb2VzIG5vdCB3b3JrIGZvciBjb2xsZWN0aW9ucycpXG4gICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyOiBpdGVtLnRyaWdnZXIgfHwgdHJpZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgaWZyYW1lOiBpdGVtLmlmcmFtZSB8fCBpZnJhbWUsXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdENsYXNzOiBpdGVtLnNlbGVjdENsYXNzIHx8IHNlbGVjdENsYXNzLFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RUZW1wbGF0ZTogKGl0ZW0uc2VsZWN0VGVtcGxhdGUgfHwgVHJpYnV0ZS5kZWZhdWx0U2VsZWN0VGVtcGxhdGUpLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIG1lbnVJdGVtVGVtcGxhdGU6IChpdGVtLm1lbnVJdGVtVGVtcGxhdGUgfHwgVHJpYnV0ZS5kZWZhdWx0TWVudUl0ZW1UZW1wbGF0ZSkuYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgLy8gZnVuY3Rpb24gY2FsbGVkIHdoZW4gbWVudSBpcyBlbXB0eSwgZGlzYWJsZXMgaGlkaW5nIG9mIG1lbnUuXG4gICAgICAgICAgICAgICAgICAgIG5vTWF0Y2hUZW1wbGF0ZTogKHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHQuYmluZCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICAgICAgICAgICAgICB9KShub01hdGNoVGVtcGxhdGUpLFxuICAgICAgICAgICAgICAgICAgICBsb29rdXA6IGl0ZW0ubG9va3VwIHx8IGxvb2t1cCxcbiAgICAgICAgICAgICAgICAgICAgZmlsbEF0dHI6IGl0ZW0uZmlsbEF0dHIgfHwgZmlsbEF0dHIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlczogaXRlbS52YWx1ZXMsXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVMZWFkaW5nU3BhY2U6IGl0ZW0ucmVxdWlyZUxlYWRpbmdTcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoT3B0czogaXRlbS5zZWFyY2hPcHRzIHx8IHNlYXJjaE9wdHMsXG4gICAgICAgICAgICAgICAgICAgIG1lbnVJdGVtTGltaXQ6IGl0ZW0ubWVudUl0ZW1MaW1pdCB8fCBtZW51SXRlbUxpbWl0LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1tUcmlidXRlXSBObyBjb2xsZWN0aW9uIHNwZWNpZmllZC4nKVxuICAgICAgICB9XG5cbiAgICAgICAgbmV3IFRyaWJ1dGVSYW5nZSh0aGlzKVxuICAgICAgICBuZXcgVHJpYnV0ZUV2ZW50cyh0aGlzKVxuICAgICAgICBuZXcgVHJpYnV0ZU1lbnVFdmVudHModGhpcylcbiAgICAgICAgbmV3IFRyaWJ1dGVTZWFyY2godGhpcywgc2VhcmNoT3B0cylcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVmYXVsdFNlbGVjdFRlbXBsYXRlKGl0ZW0pIHtcbiAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiBudWxsO1xuICAgICAgaWYgKHRoaXMucmFuZ2UuaXNDb250ZW50RWRpdGFibGUodGhpcy5jdXJyZW50LmVsZW1lbnQpKSB7XG4gICAgICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cInRyaWJ1dGUtbWVudGlvblwiPicgKyAodGhpcy5jdXJyZW50LmNvbGxlY3Rpb24udHJpZ2dlciArIGl0ZW0ub3JpZ2luYWxbdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24uZmlsbEF0dHJdKSArICc8L3NwYW4+JztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLnRyaWdnZXIgKyBpdGVtLm9yaWdpbmFsW3RoaXMuY3VycmVudC5jb2xsZWN0aW9uLmZpbGxBdHRyXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVmYXVsdE1lbnVJdGVtVGVtcGxhdGUobWF0Y2hJdGVtKSB7XG4gICAgICAgIHJldHVybiBtYXRjaEl0ZW0uc3RyaW5nXG4gICAgfVxuXG4gICAgc3RhdGljIGlucHV0VHlwZXMoKSB7XG4gICAgICAgIHJldHVybiBbJ1RFWFRBUkVBJywgJ0lOUFVUJ11cbiAgICB9XG5cbiAgICB0cmlnZ2VycygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5tYXAoY29uZmlnID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWcudHJpZ2dlclxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGF0dGFjaChlbCkge1xuICAgICAgICBpZiAoIWVsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1tUcmlidXRlXSBNdXN0IHBhc3MgaW4gYSBET00gbm9kZSBvciBOb2RlTGlzdC4nKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgaXQgaXMgYSBqUXVlcnkgY29sbGVjdGlvblxuICAgICAgICBpZiAodHlwZW9mIGpRdWVyeSAhPT0gJ3VuZGVmaW5lZCcgJiYgZWwgaW5zdGFuY2VvZiBqUXVlcnkpIHtcbiAgICAgICAgICAgIGVsID0gZWwuZ2V0KClcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElzIGVsIGFuIEFycmF5L0FycmF5LWxpa2Ugb2JqZWN0P1xuICAgICAgICBpZiAoZWwuY29uc3RydWN0b3IgPT09IE5vZGVMaXN0IHx8IGVsLmNvbnN0cnVjdG9yID09PSBIVE1MQ29sbGVjdGlvbiB8fCBlbC5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcbiAgICAgICAgICAgIGxldCBsZW5ndGggPSBlbC5sZW5ndGhcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hdHRhY2goZWxbaV0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9hdHRhY2goZWwpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfYXR0YWNoKGVsKSB7XG4gICAgICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ2RhdGEtdHJpYnV0ZScpKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1RyaWJ1dGUgd2FzIGFscmVhZHkgYm91bmQgdG8gJyArIGVsLm5vZGVOYW1lKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbnN1cmVFZGl0YWJsZShlbClcbiAgICAgICAgdGhpcy5ldmVudHMuYmluZChlbClcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdkYXRhLXRyaWJ1dGUnLCB0cnVlKVxuICAgIH1cblxuICAgIGVuc3VyZUVkaXRhYmxlKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKFRyaWJ1dGUuaW5wdXRUeXBlcygpLmluZGV4T2YoZWxlbWVudC5ub2RlTmFtZSkgPT09IC0xKSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudC5jb250ZW50RWRpdGFibGUpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNvbnRlbnRFZGl0YWJsZSA9IHRydWVcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbVHJpYnV0ZV0gQ2Fubm90IGJpbmQgdG8gJyArIGVsZW1lbnQubm9kZU5hbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVNZW51KCkge1xuICAgICAgICBsZXQgd3JhcHBlciA9IHRoaXMucmFuZ2UuZ2V0RG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgIHVsID0gdGhpcy5yYW5nZS5nZXREb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ3VsJylcblxuICAgICAgICB3cmFwcGVyLmNsYXNzTmFtZSA9ICd0cmlidXRlLWNvbnRhaW5lcidcbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZCh1bClcblxuICAgICAgICBpZiAodGhpcy5tZW51Q29udGFpbmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tZW51Q29udGFpbmVyLmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5yYW5nZS5nZXREb2N1bWVudCgpLmJvZHkuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgICB9XG5cbiAgICBzaG93TWVudUZvcihlbGVtZW50LCBzY3JvbGxUbykge1xuICAgICAgICAvLyBPbmx5IHByb2NlZWQgaWYgbWVudSBpc24ndCBhbHJlYWR5IHNob3duIGZvciB0aGUgY3VycmVudCBlbGVtZW50ICYgbWVudGlvblRleHRcbiAgICAgICAgaWYgKHRoaXMuaXNBY3RpdmUgJiYgdGhpcy5jdXJyZW50LmVsZW1lbnQgPT09IGVsZW1lbnQgJiYgdGhpcy5jdXJyZW50Lm1lbnRpb25UZXh0ID09PSB0aGlzLmN1cnJlbnRNZW50aW9uVGV4dFNuYXBzaG90KSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJyZW50TWVudGlvblRleHRTbmFwc2hvdCA9IHRoaXMuY3VycmVudC5tZW50aW9uVGV4dFxuXG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgbWVudSBpZiBpdCBkb2Vzbid0IGV4aXN0LlxuICAgICAgICBpZiAoIXRoaXMubWVudSkge1xuICAgICAgICAgICAgdGhpcy5tZW51ID0gdGhpcy5jcmVhdGVNZW51KClcbiAgICAgICAgICAgIGVsZW1lbnQudHJpYnV0ZU1lbnUgPSB0aGlzLm1lbnVcbiAgICAgICAgICAgIHRoaXMubWVudUV2ZW50cy5iaW5kKHRoaXMubWVudSlcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlXG4gICAgICAgIHRoaXMubWVudVNlbGVjdGVkID0gMFxuXG4gICAgICAgIGlmICghdGhpcy5jdXJyZW50Lm1lbnRpb25UZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQubWVudGlvblRleHQgPSAnJ1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvY2Vzc1ZhbHVlcyA9ICh2YWx1ZXMpID0+IHtcbiAgICAgICAgICAgIC8vIFRyaWJ1dGUgbWF5IG5vdCBiZSBhY3RpdmUgYW55IG1vcmUgYnkgdGhlIHRpbWUgdGhlIHZhbHVlIGNhbGxiYWNrIHJldHVybnNcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgaXRlbXMgPSB0aGlzLnNlYXJjaC5maWx0ZXIodGhpcy5jdXJyZW50Lm1lbnRpb25UZXh0LCB2YWx1ZXMsIHtcbiAgICAgICAgICAgICAgICBwcmU6IHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLnNlYXJjaE9wdHMucHJlIHx8ICc8c3Bhbj4nLFxuICAgICAgICAgICAgICAgIHBvc3Q6IHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLnNlYXJjaE9wdHMucG9zdCB8fCAnPC9zcGFuPicsXG4gICAgICAgICAgICAgICAgc2tpcDogdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24uc2VhcmNoT3B0cy5za2lwLFxuICAgICAgICAgICAgICAgIGV4dHJhY3Q6IChlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLmxvb2t1cCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlbFt0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5sb29rdXBdXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLmxvb2t1cCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLmxvb2t1cChlbCwgdGhpcy5jdXJyZW50Lm1lbnRpb25UZXh0KVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGxvb2t1cCBhdHRyaWJ1dGUsIGxvb2t1cCBtdXN0IGJlIHN0cmluZyBvciBmdW5jdGlvbi4nKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50LmZpbHRlcmVkSXRlbXMgPSBpdGVtc1xuXG5cbiAgICAgICAgICAgIGxldCB1bCA9IHRoaXMubWVudS5xdWVyeVNlbGVjdG9yKCd1bCcpXG5cbiAgICAgICAgICAgIHRoaXMucmFuZ2UucG9zaXRpb25NZW51QXRDYXJldChzY3JvbGxUbylcblxuICAgICAgICAgICAgaWYgKCFpdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsZXQgbm9NYXRjaEV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCd0cmlidXRlLW5vLW1hdGNoJywgeyBkZXRhaWw6IHRoaXMubWVudSB9KVxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudC5lbGVtZW50LmRpc3BhdGNoRXZlbnQobm9NYXRjaEV2ZW50KVxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24ubm9NYXRjaFRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZU1lbnUoKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHVsLmlubmVySFRNTCA9IHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLm5vTWF0Y2hUZW1wbGF0ZSgpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5tZW51SXRlbUxpbWl0KSB7XG4gICAgICAgICAgICAgICAgaXRlbXMgPSBpdGVtcy5zbGljZSgwLCB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi5tZW51SXRlbUxpbWl0KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1bC5pbm5lckhUTUwgPSAnJ1xuICAgICAgICAgICAgbGV0IGZyYWdtZW50ID0gdGhpcy5yYW5nZS5nZXREb2N1bWVudCgpLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBsaSA9IHRoaXMucmFuZ2UuZ2V0RG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdsaScpXG4gICAgICAgICAgICAgICAgbGkuc2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JywgaW5kZXgpXG4gICAgICAgICAgICAgICAgbGkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgIGxldCBsaSA9IGUudGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gbGkuZ2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JylcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUubW92ZW1lbnRZICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5zZXRBY3RpdmVMaShpbmRleClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWVudVNlbGVjdGVkID09PSBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgbGkuY2xhc3NOYW1lID0gdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24uc2VsZWN0Q2xhc3NcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGkuaW5uZXJIVE1MID0gdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24ubWVudUl0ZW1UZW1wbGF0ZShpdGVtKVxuICAgICAgICAgICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGxpKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHVsLmFwcGVuZENoaWxkKGZyYWdtZW50KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi52YWx1ZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLnZhbHVlcyh0aGlzLmN1cnJlbnQubWVudGlvblRleHQsIHByb2Nlc3NWYWx1ZXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9jZXNzVmFsdWVzKHRoaXMuY3VycmVudC5jb2xsZWN0aW9uLnZhbHVlcylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3dNZW51Rm9yQ29sbGVjdGlvbihlbGVtZW50LCBjb2xsZWN0aW9uSW5kZXgpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgIT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGxhY2VDYXJldEF0RW5kKGVsZW1lbnQpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnQuY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbltjb2xsZWN0aW9uSW5kZXggfHwgMF1cbiAgICAgICAgdGhpcy5jdXJyZW50LmV4dGVybmFsVHJpZ2dlciA9IHRydWVcbiAgICAgICAgdGhpcy5jdXJyZW50LmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgICAgaWYgKGVsZW1lbnQuaXNDb250ZW50RWRpdGFibGUpXG4gICAgICAgICAgICB0aGlzLmluc2VydFRleHRBdEN1cnNvcih0aGlzLmN1cnJlbnQuY29sbGVjdGlvbi50cmlnZ2VyKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLmluc2VydEF0Q2FyZXQoZWxlbWVudCwgdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24udHJpZ2dlcilcblxuICAgICAgICB0aGlzLnNob3dNZW51Rm9yKGVsZW1lbnQpXG4gICAgfVxuXG4gICAgLy8gVE9ETzogbWFrZSBzdXJlIHRoaXMgd29ya3MgZm9yIGlucHV0cy90ZXh0YXJlYXNcbiAgICBwbGFjZUNhcmV0QXRFbmQoZWwpIHtcbiAgICAgICAgZWwuZm9jdXMoKTtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuZ2V0U2VsZWN0aW9uICE9IFwidW5kZWZpbmVkXCJcbiAgICAgICAgICAgICAgICAmJiB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlUmFuZ2UgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdmFyIHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgICAgIHJhbmdlLnNlbGVjdE5vZGVDb250ZW50cyhlbCk7XG4gICAgICAgICAgICByYW5nZS5jb2xsYXBzZShmYWxzZSk7XG4gICAgICAgICAgICB2YXIgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgICAgICAgc2VsLmFkZFJhbmdlKHJhbmdlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQuYm9keS5jcmVhdGVUZXh0UmFuZ2UgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdmFyIHRleHRSYW5nZSA9IGRvY3VtZW50LmJvZHkuY3JlYXRlVGV4dFJhbmdlKCk7XG4gICAgICAgICAgICB0ZXh0UmFuZ2UubW92ZVRvRWxlbWVudFRleHQoZWwpO1xuICAgICAgICAgICAgdGV4dFJhbmdlLmNvbGxhcHNlKGZhbHNlKTtcbiAgICAgICAgICAgIHRleHRSYW5nZS5zZWxlY3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZvciBjb250ZW50ZWRpdGFibGVcbiAgICBpbnNlcnRUZXh0QXRDdXJzb3IodGV4dCkge1xuICAgICAgICB2YXIgc2VsLCByYW5nZSwgaHRtbDtcbiAgICAgICAgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgICByYW5nZSA9IHNlbC5nZXRSYW5nZUF0KDApO1xuICAgICAgICByYW5nZS5kZWxldGVDb250ZW50cygpO1xuICAgICAgICB2YXIgdGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KTtcbiAgICAgICAgcmFuZ2UuaW5zZXJ0Tm9kZSh0ZXh0Tm9kZSk7XG4gICAgICAgIHJhbmdlLnNlbGVjdE5vZGVDb250ZW50cyh0ZXh0Tm9kZSlcbiAgICAgICAgcmFuZ2UuY29sbGFwc2UoZmFsc2UpXG4gICAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKVxuICAgICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpXG4gICAgfVxuXG4gICAgLy8gZm9yIHJlZ3VsYXIgaW5wdXRzXG4gICAgaW5zZXJ0QXRDYXJldCh0ZXh0YXJlYSwgdGV4dCkge1xuICAgICAgICB2YXIgc2Nyb2xsUG9zID0gdGV4dGFyZWEuc2Nyb2xsVG9wO1xuICAgICAgICB2YXIgY2FyZXRQb3MgPSB0ZXh0YXJlYS5zZWxlY3Rpb25TdGFydDtcblxuICAgICAgICB2YXIgZnJvbnQgPSAodGV4dGFyZWEudmFsdWUpLnN1YnN0cmluZygwLCBjYXJldFBvcyk7XG4gICAgICAgIHZhciBiYWNrID0gKHRleHRhcmVhLnZhbHVlKS5zdWJzdHJpbmcodGV4dGFyZWEuc2VsZWN0aW9uRW5kLCB0ZXh0YXJlYS52YWx1ZS5sZW5ndGgpO1xuICAgICAgICB0ZXh0YXJlYS52YWx1ZSA9IGZyb250ICsgdGV4dCArIGJhY2s7XG4gICAgICAgIGNhcmV0UG9zID0gY2FyZXRQb3MgKyB0ZXh0Lmxlbmd0aDtcbiAgICAgICAgdGV4dGFyZWEuc2VsZWN0aW9uU3RhcnQgPSBjYXJldFBvcztcbiAgICAgICAgdGV4dGFyZWEuc2VsZWN0aW9uRW5kID0gY2FyZXRQb3M7XG4gICAgICAgIHRleHRhcmVhLmZvY3VzKCk7XG4gICAgICAgIHRleHRhcmVhLnNjcm9sbFRvcCA9IHNjcm9sbFBvcztcbiAgICB9XG5cbiAgICBoaWRlTWVudSgpIHtcbiAgICAgICAgaWYgKHRoaXMubWVudSkge1xuICAgICAgICAgICAgdGhpcy5tZW51LnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZTsnXG4gICAgICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2VcbiAgICAgICAgICAgIHRoaXMubWVudVNlbGVjdGVkID0gMFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0ge31cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGVjdEl0ZW1BdEluZGV4KGluZGV4LCBvcmlnaW5hbEV2ZW50KSB7XG4gICAgICAgIGluZGV4ID0gcGFyc2VJbnQoaW5kZXgpXG4gICAgICAgIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInIHx8IGlzTmFOKGluZGV4KSkgcmV0dXJuXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5jdXJyZW50LmZpbHRlcmVkSXRlbXNbaW5kZXhdXG4gICAgICAgIGxldCBjb250ZW50ID0gdGhpcy5jdXJyZW50LmNvbGxlY3Rpb24uc2VsZWN0VGVtcGxhdGUoaXRlbSlcbiAgICAgICAgaWYgKGNvbnRlbnQgIT09IG51bGwpIHRoaXMucmVwbGFjZVRleHQoY29udGVudCwgb3JpZ2luYWxFdmVudCwgaXRlbSlcbiAgICB9XG5cbiAgICByZXBsYWNlVGV4dChjb250ZW50LCBvcmlnaW5hbEV2ZW50LCBpdGVtKSB7XG4gICAgICAgIHRoaXMucmFuZ2UucmVwbGFjZVRyaWdnZXJUZXh0KGNvbnRlbnQsIHRydWUsIHRydWUsIG9yaWdpbmFsRXZlbnQsIGl0ZW0pXG4gICAgfVxuXG4gICAgX2FwcGVuZChjb2xsZWN0aW9uLCBuZXdWYWx1ZXMsIHJlcGxhY2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb2xsZWN0aW9uLnZhbHVlcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gYXBwZW5kIHRvIHZhbHVlcywgYXMgaXQgaXMgYSBmdW5jdGlvbi4nKVxuICAgICAgICB9IGVsc2UgaWYgKCFyZXBsYWNlKSB7XG4gICAgICAgICAgICBjb2xsZWN0aW9uLnZhbHVlcyA9IGNvbGxlY3Rpb24udmFsdWVzLmNvbmNhdChuZXdWYWx1ZXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2xsZWN0aW9uLnZhbHVlcyA9IG5ld1ZhbHVlc1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXBwZW5kKGNvbGxlY3Rpb25JbmRleCwgbmV3VmFsdWVzLCByZXBsYWNlKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHBhcnNlSW50KGNvbGxlY3Rpb25JbmRleClcbiAgICAgICAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHRocm93IG5ldyBFcnJvcigncGxlYXNlIHByb3ZpZGUgYW4gaW5kZXggZm9yIHRoZSBjb2xsZWN0aW9uIHRvIHVwZGF0ZS4nKVxuXG4gICAgICAgIGxldCBjb2xsZWN0aW9uID0gdGhpcy5jb2xsZWN0aW9uW2luZGV4XVxuXG4gICAgICAgIHRoaXMuX2FwcGVuZChjb2xsZWN0aW9uLCBuZXdWYWx1ZXMsIHJlcGxhY2UpXG4gICAgfVxuXG4gICAgYXBwZW5kQ3VycmVudChuZXdWYWx1ZXMsIHJlcGxhY2UpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuX2FwcGVuZCh0aGlzLmN1cnJlbnQuY29sbGVjdGlvbiwgbmV3VmFsdWVzLCByZXBsYWNlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhY3RpdmUgc3RhdGUuIFBsZWFzZSB1c2UgYXBwZW5kIGluc3RlYWQgYW5kIHBhc3MgYW4gaW5kZXguJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRldGFjaChlbCkge1xuICAgICAgICBpZiAoIWVsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1tUcmlidXRlXSBNdXN0IHBhc3MgaW4gYSBET00gbm9kZSBvciBOb2RlTGlzdC4nKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgaXQgaXMgYSBqUXVlcnkgY29sbGVjdGlvblxuICAgICAgICBpZiAodHlwZW9mIGpRdWVyeSAhPT0gJ3VuZGVmaW5lZCcgJiYgZWwgaW5zdGFuY2VvZiBqUXVlcnkpIHtcbiAgICAgICAgICAgIGVsID0gZWwuZ2V0KClcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElzIGVsIGFuIEFycmF5L0FycmF5LWxpa2Ugb2JqZWN0P1xuICAgICAgICBpZiAoZWwuY29uc3RydWN0b3IgPT09IE5vZGVMaXN0IHx8IGVsLmNvbnN0cnVjdG9yID09PSBIVE1MQ29sbGVjdGlvbiB8fCBlbC5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcbiAgICAgICAgICAgIGxldCBsZW5ndGggPSBlbC5sZW5ndGhcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZXRhY2goZWxbaV0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9kZXRhY2goZWwpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZGV0YWNoKGVsKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzLnVuYmluZChlbClcbiAgICAgICAgaWYgKGVsLnRyaWJ1dGVNZW51KSB7XG4gICAgICAgICAgICB0aGlzLm1lbnVFdmVudHMudW5iaW5kKGVsLnRyaWJ1dGVNZW51KVxuICAgICAgICB9XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtdHJpYnV0ZScpXG4gICAgICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2VcbiAgICAgICAgICAgIGlmIChlbC50cmlidXRlTWVudSkge1xuICAgICAgICAgICAgICAgIGVsLnRyaWJ1dGVNZW51LnJlbW92ZSgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUcmlidXRlO1xuIiwiY2xhc3MgVHJpYnV0ZUV2ZW50cyB7XG4gICAgY29uc3RydWN0b3IodHJpYnV0ZSkge1xuICAgICAgICB0aGlzLnRyaWJ1dGUgPSB0cmlidXRlXG4gICAgICAgIHRoaXMudHJpYnV0ZS5ldmVudHMgPSB0aGlzXG4gICAgfVxuXG4gICAgc3RhdGljIGtleXMoKSB7XG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAga2V5OiA5LFxuICAgICAgICAgICAgdmFsdWU6ICdUQUInXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogOCxcbiAgICAgICAgICAgIHZhbHVlOiAnREVMRVRFJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6IDEzLFxuICAgICAgICAgICAgdmFsdWU6ICdFTlRFUidcbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAyNyxcbiAgICAgICAgICAgIHZhbHVlOiAnRVNDQVBFJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6IDMyLFxuICAgICAgICAgICAgdmFsdWU6ICdTUEFDRSdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAzOCxcbiAgICAgICAgICAgIHZhbHVlOiAnVVAnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogNDAsXG4gICAgICAgICAgICB2YWx1ZTogJ0RPV04nXG4gICAgICAgIH1dXG4gICAgfVxuXG4gICAgYmluZChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuYm91bmRLZXlkb3duID0gdGhpcy5rZXlkb3duLmJpbmQoZWxlbWVudCwgdGhpcyk7XG4gICAgICAgIGVsZW1lbnQuYm91bmRLZXl1cCA9IHRoaXMua2V5dXAuYmluZChlbGVtZW50LCB0aGlzKTtcbiAgICAgICAgZWxlbWVudC5ib3VuZElucHV0ID0gdGhpcy5pbnB1dC5iaW5kKGVsZW1lbnQsIHRoaXMpO1xuXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsXG4gICAgICAgICAgICBlbGVtZW50LmJvdW5kS2V5ZG93biwgZmFsc2UpXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLFxuICAgICAgICAgICAgZWxlbWVudC5ib3VuZEtleXVwLCBmYWxzZSlcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsXG4gICAgICAgICAgICBlbGVtZW50LmJvdW5kSW5wdXQsIGZhbHNlKVxuICAgIH1cblxuICAgIHVuYmluZChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsXG4gICAgICAgICAgICBlbGVtZW50LmJvdW5kS2V5ZG93biwgZmFsc2UpXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLFxuICAgICAgICAgICAgZWxlbWVudC5ib3VuZEtleXVwLCBmYWxzZSlcbiAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdpbnB1dCcsXG4gICAgICAgICAgICBlbGVtZW50LmJvdW5kSW5wdXQsIGZhbHNlKVxuXG4gICAgICAgIGRlbGV0ZSBlbGVtZW50LmJvdW5kS2V5ZG93blxuICAgICAgICBkZWxldGUgZWxlbWVudC5ib3VuZEtleXVwXG4gICAgICAgIGRlbGV0ZSBlbGVtZW50LmJvdW5kSW5wdXRcbiAgICB9XG5cbiAgICBrZXlkb3duKGluc3RhbmNlLCBldmVudCkge1xuICAgICAgICBpZiAoaW5zdGFuY2Uuc2hvdWxkRGVhY3RpdmF0ZShldmVudCkpIHtcbiAgICAgICAgICAgIGluc3RhbmNlLnRyaWJ1dGUuaXNBY3RpdmUgPSBmYWxzZVxuICAgICAgICAgICAgaW5zdGFuY2UudHJpYnV0ZS5oaWRlTWVudSgpXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXNcbiAgICAgICAgaW5zdGFuY2UuY29tbWFuZEV2ZW50ID0gZmFsc2VcblxuICAgICAgICBUcmlidXRlRXZlbnRzLmtleXMoKS5mb3JFYWNoKG8gPT4ge1xuICAgICAgICAgICAgaWYgKG8ua2V5ID09PSBldmVudC5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2UuY29tbWFuZEV2ZW50ID0gdHJ1ZVxuICAgICAgICAgICAgICAgIGluc3RhbmNlLmNhbGxiYWNrcygpW28udmFsdWUudG9Mb3dlckNhc2UoKV0oZXZlbnQsIGVsZW1lbnQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgaW5wdXQoaW5zdGFuY2UsIGV2ZW50KSB7XG4gICAgICAgIGluc3RhbmNlLmlucHV0RXZlbnQgPSB0cnVlXG4gICAgICAgIGluc3RhbmNlLmtleXVwLmNhbGwodGhpcywgaW5zdGFuY2UsIGV2ZW50KVxuICAgIH1cblxuICAgIGNsaWNrKGluc3RhbmNlLCBldmVudCkge1xuICAgICAgICBsZXQgdHJpYnV0ZSA9IGluc3RhbmNlLnRyaWJ1dGVcbiAgICAgICAgaWYgKHRyaWJ1dGUubWVudSAmJiB0cmlidXRlLm1lbnUuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgbGV0IGxpID0gZXZlbnQudGFyZ2V0XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgd2hpbGUgKGxpLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09ICdsaScpIHtcbiAgICAgICAgICAgICAgICBsaSA9IGxpLnBhcmVudE5vZGVcbiAgICAgICAgICAgICAgICBpZiAoIWxpIHx8IGxpID09PSB0cmlidXRlLm1lbnUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZmluZCB0aGUgPGxpPiBjb250YWluZXIgZm9yIHRoZSBjbGljaycpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJpYnV0ZS5zZWxlY3RJdGVtQXRJbmRleChsaS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnKSwgZXZlbnQpXG4gICAgICAgICAgICB0cmlidXRlLmhpZGVNZW51KClcblxuICAgICAgICAvLyBUT0RPOiBzaG91bGQgZmlyZSB3aXRoIGV4dGVybmFsVHJpZ2dlciBhbmQgdGFyZ2V0IGlzIG91dHNpZGUgb2YgbWVudVxuICAgICAgICB9IGVsc2UgaWYgKHRyaWJ1dGUuY3VycmVudC5lbGVtZW50ICYmICF0cmlidXRlLmN1cnJlbnQuZXh0ZXJuYWxUcmlnZ2VyKSB7XG4gICAgICAgICAgICB0cmlidXRlLmN1cnJlbnQuZXh0ZXJuYWxUcmlnZ2VyID0gZmFsc2VcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdHJpYnV0ZS5oaWRlTWVudSgpKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAga2V5dXAoaW5zdGFuY2UsIGV2ZW50KSB7XG4gICAgICAgIGlmIChpbnN0YW5jZS5pbnB1dEV2ZW50KSB7XG4gICAgICAgICAgICBpbnN0YW5jZS5pbnB1dEV2ZW50ID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBpbnN0YW5jZS51cGRhdGVTZWxlY3Rpb24odGhpcylcblxuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMjcpIHJldHVyblxuXG4gICAgICAgIGlmICghaW5zdGFuY2UudHJpYnV0ZS5hbGxvd1NwYWNlcyAmJiBpbnN0YW5jZS50cmlidXRlLmhhc1RyYWlsaW5nU3BhY2UpIHtcbiAgICAgICAgICAgIGluc3RhbmNlLnRyaWJ1dGUuaGFzVHJhaWxpbmdTcGFjZSA9IGZhbHNlO1xuICAgICAgICAgICAgaW5zdGFuY2UuY29tbWFuZEV2ZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIGluc3RhbmNlLmNhbGxiYWNrcygpW1wic3BhY2VcIl0oZXZlbnQsIHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWluc3RhbmNlLnRyaWJ1dGUuaXNBY3RpdmUpIHtcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZS50cmlidXRlLmF1dG9jb21wbGV0ZU1vZGUpIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZS5jYWxsYmFja3MoKS50cmlnZ2VyQ2hhcihldmVudCwgdGhpcywgJycpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBrZXlDb2RlID0gaW5zdGFuY2UuZ2V0S2V5Q29kZShpbnN0YW5jZSwgdGhpcywgZXZlbnQpXG4gICAgXG4gICAgICAgICAgICAgICAgaWYgKGlzTmFOKGtleUNvZGUpIHx8ICFrZXlDb2RlKSByZXR1cm5cbiAgICBcbiAgICAgICAgICAgICAgICBsZXQgdHJpZ2dlciA9IGluc3RhbmNlLnRyaWJ1dGUudHJpZ2dlcnMoKS5maW5kKHRyaWdnZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJpZ2dlci5jaGFyQ29kZUF0KDApID09PSBrZXlDb2RlXG4gICAgICAgICAgICAgICAgfSlcbiAgICBcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRyaWdnZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLmNhbGxiYWNrcygpLnRyaWdnZXJDaGFyKGV2ZW50LCB0aGlzLCB0cmlnZ2VyKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgoaW5zdGFuY2UudHJpYnV0ZS5jdXJyZW50LnRyaWdnZXIgfHwgaW5zdGFuY2UudHJpYnV0ZS5hdXRvY29tcGxldGVNb2RlKVxuICAgICAgICAgICAgJiYgaW5zdGFuY2UuY29tbWFuZEV2ZW50ID09PSBmYWxzZVxuICAgICAgICAgICAgfHwgaW5zdGFuY2UudHJpYnV0ZS5pc0FjdGl2ZSAmJiBldmVudC5rZXlDb2RlID09PSA4KSB7XG4gICAgICAgICAgaW5zdGFuY2UudHJpYnV0ZS5zaG93TWVudUZvcih0aGlzLCB0cnVlKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvdWxkRGVhY3RpdmF0ZShldmVudCkge1xuICAgICAgICBpZiAoIXRoaXMudHJpYnV0ZS5pc0FjdGl2ZSkgcmV0dXJuIGZhbHNlXG5cbiAgICAgICAgaWYgKHRoaXMudHJpYnV0ZS5jdXJyZW50Lm1lbnRpb25UZXh0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgbGV0IGV2ZW50S2V5UHJlc3NlZCA9IGZhbHNlXG4gICAgICAgICAgICBUcmlidXRlRXZlbnRzLmtleXMoKS5mb3JFYWNoKG8gPT4ge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSBvLmtleSkgZXZlbnRLZXlQcmVzc2VkID0gdHJ1ZVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmV0dXJuICFldmVudEtleVByZXNzZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGdldEtleUNvZGUoaW5zdGFuY2UsIGVsLCBldmVudCkge1xuICAgICAgICBsZXQgY2hhclxuICAgICAgICBsZXQgdHJpYnV0ZSA9IGluc3RhbmNlLnRyaWJ1dGVcbiAgICAgICAgbGV0IGluZm8gPSB0cmlidXRlLnJhbmdlLmdldFRyaWdnZXJJbmZvKGZhbHNlLCB0cmlidXRlLmhhc1RyYWlsaW5nU3BhY2UsIHRydWUsIHRyaWJ1dGUuYWxsb3dTcGFjZXMsIHRyaWJ1dGUuYXV0b2NvbXBsZXRlTW9kZSlcblxuICAgICAgICBpZiAoaW5mbykge1xuICAgICAgICAgICAgcmV0dXJuIGluZm8ubWVudGlvblRyaWdnZXJDaGFyLmNoYXJDb2RlQXQoMClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlU2VsZWN0aW9uKGVsKSB7XG4gICAgICAgIHRoaXMudHJpYnV0ZS5jdXJyZW50LmVsZW1lbnQgPSBlbFxuICAgICAgICBsZXQgaW5mbyA9IHRoaXMudHJpYnV0ZS5yYW5nZS5nZXRUcmlnZ2VySW5mbyhmYWxzZSwgdGhpcy50cmlidXRlLmhhc1RyYWlsaW5nU3BhY2UsIHRydWUsIHRoaXMudHJpYnV0ZS5hbGxvd1NwYWNlcywgdGhpcy50cmlidXRlLmF1dG9jb21wbGV0ZU1vZGUpXG5cbiAgICAgICAgaWYgKGluZm8pIHtcbiAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5jdXJyZW50LnNlbGVjdGVkUGF0aCA9IGluZm8ubWVudGlvblNlbGVjdGVkUGF0aFxuICAgICAgICAgICAgdGhpcy50cmlidXRlLmN1cnJlbnQubWVudGlvblRleHQgPSBpbmZvLm1lbnRpb25UZXh0XG4gICAgICAgICAgICB0aGlzLnRyaWJ1dGUuY3VycmVudC5zZWxlY3RlZE9mZnNldCA9IGluZm8ubWVudGlvblNlbGVjdGVkT2Zmc2V0XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjYWxsYmFja3MoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0cmlnZ2VyQ2hhcjogKGUsIGVsLCB0cmlnZ2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHRyaWJ1dGUgPSB0aGlzLnRyaWJ1dGVcbiAgICAgICAgICAgICAgICB0cmlidXRlLmN1cnJlbnQudHJpZ2dlciA9IHRyaWdnZXJcblxuICAgICAgICAgICAgICAgIGxldCBjb2xsZWN0aW9uSXRlbSA9IHRyaWJ1dGUuY29sbGVjdGlvbi5maW5kKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS50cmlnZ2VyID09PSB0cmlnZ2VyXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIHRyaWJ1dGUuY3VycmVudC5jb2xsZWN0aW9uID0gY29sbGVjdGlvbkl0ZW1cbiAgICAgICAgICAgICAgICBpZiAodHJpYnV0ZS5pbnB1dEV2ZW50KSB0cmlidXRlLnNob3dNZW51Rm9yKGVsLCB0cnVlKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudGVyOiAoZSwgZWwpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjaG9vc2Ugc2VsZWN0aW9uXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHJpYnV0ZS5pc0FjdGl2ZSAmJiB0aGlzLnRyaWJ1dGUuY3VycmVudC5maWx0ZXJlZEl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLnNlbGVjdEl0ZW1BdEluZGV4KHRoaXMudHJpYnV0ZS5tZW51U2VsZWN0ZWQsIGUpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUuaGlkZU1lbnUoKVxuICAgICAgICAgICAgICAgICAgICB9LCAwKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlc2NhcGU6IChlLCBlbCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyaWJ1dGUuaXNBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLmlzQWN0aXZlID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLmhpZGVNZW51KClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGFiOiAoZSwgZWwpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjaG9vc2UgZmlyc3QgbWF0Y2hcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxiYWNrcygpLmVudGVyKGUsIGVsKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNwYWNlOiAoZSwgZWwpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50cmlidXRlLmlzQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyaWJ1dGUuc3BhY2VTZWxlY3RzTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tzKCkuZW50ZXIoZSwgZWwpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMudHJpYnV0ZS5hbGxvd1NwYWNlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5oaWRlTWVudSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXA6IChlLCBlbCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIG5hdmlnYXRlIHVwIHVsXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHJpYnV0ZS5pc0FjdGl2ZSAmJiB0aGlzLnRyaWJ1dGUuY3VycmVudC5maWx0ZXJlZEl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb3VudCA9IHRoaXMudHJpYnV0ZS5jdXJyZW50LmZpbHRlcmVkSXRlbXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQgPSB0aGlzLnRyaWJ1dGUubWVudVNlbGVjdGVkXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvdW50ID4gc2VsZWN0ZWQgJiYgc2VsZWN0ZWQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudVNlbGVjdGVkLS1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlTGkoKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLm1lbnVTZWxlY3RlZCA9IGNvdW50IC0gMVxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlTGkoKVxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5tZW51LnNjcm9sbFRvcCA9IHRoaXMudHJpYnV0ZS5tZW51LnNjcm9sbEhlaWdodFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRvd246IChlLCBlbCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIG5hdmlnYXRlIGRvd24gdWxcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50cmlidXRlLmlzQWN0aXZlICYmIHRoaXMudHJpYnV0ZS5jdXJyZW50LmZpbHRlcmVkSXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvdW50ID0gdGhpcy50cmlidXRlLmN1cnJlbnQuZmlsdGVyZWRJdGVtcy5sZW5ndGggLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQgPSB0aGlzLnRyaWJ1dGUubWVudVNlbGVjdGVkXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvdW50ID4gc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5tZW51U2VsZWN0ZWQrK1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVMaSgpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY291bnQgPT09IHNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudVNlbGVjdGVkID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVMaSgpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudS5zY3JvbGxUb3AgPSAwXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVsZXRlOiAoZSwgZWwpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50cmlidXRlLmlzQWN0aXZlICYmIHRoaXMudHJpYnV0ZS5jdXJyZW50Lm1lbnRpb25UZXh0Lmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLmhpZGVNZW51KClcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudHJpYnV0ZS5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUuc2hvd01lbnVGb3IoZWwpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0QWN0aXZlTGkoaW5kZXgpIHtcbiAgICAgICAgbGV0IGxpcyA9IHRoaXMudHJpYnV0ZS5tZW51LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyksXG4gICAgICAgICAgICBsZW5ndGggPSBsaXMubGVuZ3RoID4+PiAwXG5cbiAgICAgICAgaWYgKGluZGV4KSB0aGlzLnRyaWJ1dGUubWVudVNlbGVjdGVkID0gcGFyc2VJbnQoaW5kZXgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBsaSA9IGxpc1tpXVxuICAgICAgICAgICAgaWYgKGkgPT09IHRoaXMudHJpYnV0ZS5tZW51U2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBsaS5jbGFzc0xpc3QuYWRkKHRoaXMudHJpYnV0ZS5jdXJyZW50LmNvbGxlY3Rpb24uc2VsZWN0Q2xhc3MpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGxpQ2xpZW50UmVjdCA9IGxpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIGxldCBtZW51Q2xpZW50UmVjdCA9IHRoaXMudHJpYnV0ZS5tZW51LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGxpQ2xpZW50UmVjdC5ib3R0b20gPiBtZW51Q2xpZW50UmVjdC5ib3R0b20pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNjcm9sbERpc3RhbmNlID0gbGlDbGllbnRSZWN0LmJvdHRvbSAtIG1lbnVDbGllbnRSZWN0LmJvdHRvbTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLm1lbnUuc2Nyb2xsVG9wICs9IHNjcm9sbERpc3RhbmNlXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChsaUNsaWVudFJlY3QudG9wIDwgbWVudUNsaWVudFJlY3QudG9wKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzY3JvbGxEaXN0YW5jZSA9IG1lbnVDbGllbnRSZWN0LnRvcCAtIGxpQ2xpZW50UmVjdC50b3A7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5tZW51LnNjcm9sbFRvcCAtPSBzY3JvbGxEaXN0YW5jZVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMudHJpYnV0ZS5jdXJyZW50LmNvbGxlY3Rpb24uc2VsZWN0Q2xhc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RnVsbEhlaWdodChlbGVtLCBpbmNsdWRlTWFyZ2luKSB7XG4gICAgICBsZXQgaGVpZ2h0ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHRcblxuICAgICAgaWYgKGluY2x1ZGVNYXJnaW4pIHtcbiAgICAgICAgbGV0IHN0eWxlID0gZWxlbS5jdXJyZW50U3R5bGUgfHwgd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbSlcbiAgICAgICAgcmV0dXJuIGhlaWdodCArIHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luVG9wKSArIHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luQm90dG9tKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaGVpZ2h0XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFRyaWJ1dGVFdmVudHM7XG4iLCJjbGFzcyBUcmlidXRlTWVudUV2ZW50cyB7XG4gICAgY29uc3RydWN0b3IodHJpYnV0ZSkge1xuICAgICAgICB0aGlzLnRyaWJ1dGUgPSB0cmlidXRlXG4gICAgICAgIHRoaXMudHJpYnV0ZS5tZW51RXZlbnRzID0gdGhpc1xuICAgICAgICB0aGlzLm1lbnUgPSB0aGlzLnRyaWJ1dGUubWVudVxuICAgIH1cblxuICAgIGJpbmQobWVudSkge1xuICAgICAgICB0aGlzLm1lbnVDbGlja0V2ZW50ID0gdGhpcy50cmlidXRlLmV2ZW50cy5jbGljay5iaW5kKG51bGwsIHRoaXMpXG4gICAgICAgIHRoaXMubWVudUNvbnRhaW5lclNjcm9sbEV2ZW50ID0gdGhpcy5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy50cmlidXRlLmlzQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLnNob3dNZW51Rm9yKHRoaXMudHJpYnV0ZS5jdXJyZW50LmVsZW1lbnQsIGZhbHNlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCAzMDAsIGZhbHNlKVxuICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUV2ZW50ID0gdGhpcy5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy50cmlidXRlLmlzQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLnJhbmdlLnBvc2l0aW9uTWVudUF0Q2FyZXQodHJ1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMzAwLCBmYWxzZSlcblxuICAgICAgICAvLyBmaXhlcyBJRTExIGlzc3VlcyB3aXRoIG1vdXNlZG93blxuICAgICAgICB0aGlzLnRyaWJ1dGUucmFuZ2UuZ2V0RG9jdW1lbnQoKS5hZGRFdmVudExpc3RlbmVyKCdNU1BvaW50ZXJEb3duJyxcbiAgICAgICAgICAgIHRoaXMubWVudUNsaWNrRXZlbnQsIGZhbHNlKVxuICAgICAgICB0aGlzLnRyaWJ1dGUucmFuZ2UuZ2V0RG9jdW1lbnQoKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLFxuICAgICAgICAgICAgdGhpcy5tZW51Q2xpY2tFdmVudCwgZmFsc2UpXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLndpbmRvd1Jlc2l6ZUV2ZW50KVxuXG4gICAgICAgIGlmICh0aGlzLm1lbnVDb250YWluZXIpIHtcbiAgICAgICAgICAgIHRoaXMubWVudUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLm1lbnVDb250YWluZXJTY3JvbGxFdmVudCwgZmFsc2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5tZW51Q29udGFpbmVyU2Nyb2xsRXZlbnQpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHVuYmluZChtZW51KSB7XG4gICAgICAgIHRoaXMudHJpYnV0ZS5yYW5nZS5nZXREb2N1bWVudCgpLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsXG4gICAgICAgICAgICB0aGlzLm1lbnVDbGlja0V2ZW50LCBmYWxzZSlcbiAgICAgICAgdGhpcy50cmlidXRlLnJhbmdlLmdldERvY3VtZW50KCkucmVtb3ZlRXZlbnRMaXN0ZW5lcignTVNQb2ludGVyRG93bicsXG4gICAgICAgICAgICB0aGlzLm1lbnVDbGlja0V2ZW50LCBmYWxzZSlcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMud2luZG93UmVzaXplRXZlbnQpXG5cbiAgICAgICAgaWYgKHRoaXMubWVudUNvbnRhaW5lcikge1xuICAgICAgICAgICAgdGhpcy5tZW51Q29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMubWVudUNvbnRhaW5lclNjcm9sbEV2ZW50LCBmYWxzZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLm1lbnVDb250YWluZXJTY3JvbGxFdmVudClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgICAgICB2YXIgdGltZW91dFxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGFyZ3MgPSBhcmd1bWVudHNcbiAgICAgICAgICAgIHZhciBsYXRlciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbFxuICAgICAgICAgICAgICAgIGlmICghaW1tZWRpYXRlKSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dFxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpXG4gICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdClcbiAgICAgICAgICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgVHJpYnV0ZU1lbnVFdmVudHM7XG4iLCIvLyBUaGFua3MgdG8gaHR0cHM6Ly9naXRodWIuY29tL2plZmYtY29sbGlucy9tZW50LmlvXG5jbGFzcyBUcmlidXRlUmFuZ2Uge1xuICAgIGNvbnN0cnVjdG9yKHRyaWJ1dGUpIHtcbiAgICAgICAgdGhpcy50cmlidXRlID0gdHJpYnV0ZVxuICAgICAgICB0aGlzLnRyaWJ1dGUucmFuZ2UgPSB0aGlzXG4gICAgfVxuXG4gICAgZ2V0RG9jdW1lbnQoKSB7XG4gICAgICAgIGxldCBpZnJhbWVcbiAgICAgICAgaWYgKHRoaXMudHJpYnV0ZS5jdXJyZW50LmNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmcmFtZSA9IHRoaXMudHJpYnV0ZS5jdXJyZW50LmNvbGxlY3Rpb24uaWZyYW1lXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlmcmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnRcbiAgICB9XG5cbiAgICBwb3NpdGlvbk1lbnVBdENhcmV0KHNjcm9sbFRvKSB7XG4gICAgICAgIGxldCBjb250ZXh0ID0gdGhpcy50cmlidXRlLmN1cnJlbnQsXG4gICAgICAgICAgICBjb29yZGluYXRlc1xuXG4gICAgICAgIGxldCBpbmZvID0gdGhpcy5nZXRUcmlnZ2VySW5mbyhmYWxzZSwgdGhpcy50cmlidXRlLmhhc1RyYWlsaW5nU3BhY2UsIHRydWUsIHRoaXMudHJpYnV0ZS5hbGxvd1NwYWNlcywgdGhpcy50cmlidXRlLmF1dG9jb21wbGV0ZU1vZGUpXG5cbiAgICAgICAgaWYgKHR5cGVvZiBpbmZvICE9PSAndW5kZWZpbmVkJykge1xuXG4gICAgICAgICAgICBpZighdGhpcy50cmlidXRlLnBvc2l0aW9uTWVudSl7XG4gICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLm1lbnUuc3R5bGUuY3NzVGV4dCA9IGBkaXNwbGF5OiBibG9jaztgXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5pc0NvbnRlbnRFZGl0YWJsZShjb250ZXh0LmVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXMgPSB0aGlzLmdldFRleHRBcmVhT3JJbnB1dFVuZGVybGluZVBvc2l0aW9uKHRoaXMudHJpYnV0ZS5jdXJyZW50LmVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgIGluZm8ubWVudGlvblBvc2l0aW9uKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXMgPSB0aGlzLmdldENvbnRlbnRFZGl0YWJsZUNhcmV0UG9zaXRpb24oaW5mby5tZW50aW9uUG9zaXRpb24pXG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgdGhpcy50cmlidXRlLm1lbnUuc3R5bGUuY3NzVGV4dCA9IGB0b3A6ICR7Y29vcmRpbmF0ZXMudG9wfXB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICR7Y29vcmRpbmF0ZXMubGVmdH1weDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodDogJHtjb29yZGluYXRlcy5yaWdodH1weDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b206ICR7Y29vcmRpbmF0ZXMuYm90dG9tfXB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB6LWluZGV4OiAxMDAwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBibG9jaztgXG5cbiAgICAgICAgICAgIGlmIChjb29yZGluYXRlcy5sZWZ0ID09PSAnYXV0bycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudS5zdHlsZS5sZWZ0ID0gJ2F1dG8nXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb29yZGluYXRlcy50b3AgPT09ICdhdXRvJykge1xuICAgICAgICAgICAgICAgIHRoaXMudHJpYnV0ZS5tZW51LnN0eWxlLnRvcCA9ICdhdXRvJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2Nyb2xsVG8pIHRoaXMuc2Nyb2xsSW50b1ZpZXcoKVxuXG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG1lbnVEaW1lbnNpb25zID0ge1xuICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnRyaWJ1dGUubWVudS5vZmZzZXRXaWR0aCxcbiAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMudHJpYnV0ZS5tZW51Lm9mZnNldEhlaWdodFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgbWVudUlzT2ZmU2NyZWVuID0gdGhpcy5pc01lbnVPZmZTY3JlZW4oY29vcmRpbmF0ZXMsIG1lbnVEaW1lbnNpb25zKVxuXG4gICAgICAgICAgICAgICAgbGV0IG1lbnVJc09mZlNjcmVlbkhvcml6b250YWxseSA9IHdpbmRvdy5pbm5lcldpZHRoID4gbWVudURpbWVuc2lvbnMud2lkdGggJiYgKG1lbnVJc09mZlNjcmVlbi5sZWZ0IHx8IG1lbnVJc09mZlNjcmVlbi5yaWdodClcbiAgICAgICAgICAgICAgICBsZXQgbWVudUlzT2ZmU2NyZWVuVmVydGljYWxseSA9IHdpbmRvdy5pbm5lckhlaWdodCA+IG1lbnVEaW1lbnNpb25zLmhlaWdodCAmJiAobWVudUlzT2ZmU2NyZWVuLnRvcCB8fCBtZW51SXNPZmZTY3JlZW4uYm90dG9tKVxuICAgICAgICAgICAgICAgIGlmIChtZW51SXNPZmZTY3JlZW5Ib3Jpem9udGFsbHkgfHwgbWVudUlzT2ZmU2NyZWVuVmVydGljYWxseSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudS5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb25NZW51QXRDYXJldChzY3JvbGxUbylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAwKVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRyaWJ1dGUubWVudS5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxlY3RFbGVtZW50KHRhcmdldEVsZW1lbnQsIHBhdGgsIG9mZnNldCkge1xuICAgICAgICBsZXQgcmFuZ2VcbiAgICAgICAgbGV0IGVsZW0gPSB0YXJnZXRFbGVtZW50XG5cbiAgICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGVsZW0gPSBlbGVtLmNoaWxkTm9kZXNbcGF0aFtpXV1cbiAgICAgICAgICAgICAgICBpZiAoZWxlbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3aGlsZSAoZWxlbS5sZW5ndGggPCBvZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0IC09IGVsZW0ubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIGVsZW0gPSBlbGVtLm5leHRTaWJsaW5nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlbGVtLmNoaWxkTm9kZXMubGVuZ3RoID09PSAwICYmICFlbGVtLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtID0gZWxlbS5wcmV2aW91c1NpYmxpbmdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHNlbCA9IHRoaXMuZ2V0V2luZG93U2VsZWN0aW9uKClcblxuICAgICAgICByYW5nZSA9IHRoaXMuZ2V0RG9jdW1lbnQoKS5jcmVhdGVSYW5nZSgpXG4gICAgICAgIHJhbmdlLnNldFN0YXJ0KGVsZW0sIG9mZnNldClcbiAgICAgICAgcmFuZ2Uuc2V0RW5kKGVsZW0sIG9mZnNldClcbiAgICAgICAgcmFuZ2UuY29sbGFwc2UodHJ1ZSlcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxuXG4gICAgICAgIHNlbC5hZGRSYW5nZShyYW5nZSlcbiAgICAgICAgdGFyZ2V0RWxlbWVudC5mb2N1cygpXG4gICAgfVxuXG4gICAgcmVwbGFjZVRyaWdnZXJUZXh0KHRleHQsIHJlcXVpcmVMZWFkaW5nU3BhY2UsIGhhc1RyYWlsaW5nU3BhY2UsIG9yaWdpbmFsRXZlbnQsIGl0ZW0pIHtcbiAgICAgICAgbGV0IGluZm8gPSB0aGlzLmdldFRyaWdnZXJJbmZvKHRydWUsIGhhc1RyYWlsaW5nU3BhY2UsIHJlcXVpcmVMZWFkaW5nU3BhY2UsIHRoaXMudHJpYnV0ZS5hbGxvd1NwYWNlcywgdGhpcy50cmlidXRlLmF1dG9jb21wbGV0ZU1vZGUpXG5cbiAgICAgICAgaWYgKGluZm8gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbGV0IGNvbnRleHQgPSB0aGlzLnRyaWJ1dGUuY3VycmVudFxuICAgICAgICAgICAgbGV0IHJlcGxhY2VFdmVudCA9IG5ldyBDdXN0b21FdmVudCgndHJpYnV0ZS1yZXBsYWNlZCcsIHtcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogaXRlbSxcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2U6IGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IGluZm8sXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiBvcmlnaW5hbEV2ZW50LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGlmICghdGhpcy5pc0NvbnRlbnRFZGl0YWJsZShjb250ZXh0LmVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgbGV0IG15RmllbGQgPSB0aGlzLnRyaWJ1dGUuY3VycmVudC5lbGVtZW50XG4gICAgICAgICAgICAgICAgbGV0IHRleHRTdWZmaXggPSB0eXBlb2YgdGhpcy50cmlidXRlLnJlcGxhY2VUZXh0U3VmZml4ID09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy50cmlidXRlLnJlcGxhY2VUZXh0U3VmZml4XG4gICAgICAgICAgICAgICAgICAgIDogJyAnXG4gICAgICAgICAgICAgICAgdGV4dCArPSB0ZXh0U3VmZml4XG4gICAgICAgICAgICAgICAgbGV0IHN0YXJ0UG9zID0gaW5mby5tZW50aW9uUG9zaXRpb25cbiAgICAgICAgICAgICAgICBsZXQgZW5kUG9zID0gaW5mby5tZW50aW9uUG9zaXRpb24gKyBpbmZvLm1lbnRpb25UZXh0Lmxlbmd0aCArIHRleHRTdWZmaXgubGVuZ3RoXG4gICAgICAgICAgICAgICAgbXlGaWVsZC52YWx1ZSA9IG15RmllbGQudmFsdWUuc3Vic3RyaW5nKDAsIHN0YXJ0UG9zKSArIHRleHQgK1xuICAgICAgICAgICAgICAgICAgICBteUZpZWxkLnZhbHVlLnN1YnN0cmluZyhlbmRQb3MsIG15RmllbGQudmFsdWUubGVuZ3RoKVxuICAgICAgICAgICAgICAgIG15RmllbGQuc2VsZWN0aW9uU3RhcnQgPSBzdGFydFBvcyArIHRleHQubGVuZ3RoXG4gICAgICAgICAgICAgICAgbXlGaWVsZC5zZWxlY3Rpb25FbmQgPSBzdGFydFBvcyArIHRleHQubGVuZ3RoXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGFkZCBhIHNwYWNlIHRvIHRoZSBlbmQgb2YgdGhlIHBhc3RlZCB0ZXh0XG4gICAgICAgICAgICAgICAgbGV0IHRleHRTdWZmaXggPSB0eXBlb2YgdGhpcy50cmlidXRlLnJlcGxhY2VUZXh0U3VmZml4ID09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy50cmlidXRlLnJlcGxhY2VUZXh0U3VmZml4XG4gICAgICAgICAgICAgICAgICAgIDogJ1xceEEwJ1xuICAgICAgICAgICAgICAgIHRleHQgKz0gdGV4dFN1ZmZpeFxuICAgICAgICAgICAgICAgIHRoaXMucGFzdGVIdG1sKHRleHQsIGluZm8ubWVudGlvblBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICBpbmZvLm1lbnRpb25Qb3NpdGlvbiArIGluZm8ubWVudGlvblRleHQubGVuZ3RoICsgIXRoaXMudHJpYnV0ZS5hdXRvY29tcGxldGVNb2RlKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb250ZXh0LmVsZW1lbnQuZGlzcGF0Y2hFdmVudChyZXBsYWNlRXZlbnQpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwYXN0ZUh0bWwoaHRtbCwgc3RhcnRQb3MsIGVuZFBvcykge1xuICAgICAgICBsZXQgcmFuZ2UsIHNlbFxuICAgICAgICBzZWwgPSB0aGlzLmdldFdpbmRvd1NlbGVjdGlvbigpXG4gICAgICAgIHJhbmdlID0gdGhpcy5nZXREb2N1bWVudCgpLmNyZWF0ZVJhbmdlKClcbiAgICAgICAgcmFuZ2Uuc2V0U3RhcnQoc2VsLmFuY2hvck5vZGUsIHN0YXJ0UG9zKVxuICAgICAgICByYW5nZS5zZXRFbmQoc2VsLmFuY2hvck5vZGUsIGVuZFBvcylcbiAgICAgICAgcmFuZ2UuZGVsZXRlQ29udGVudHMoKVxuXG4gICAgICAgIGxldCBlbCA9IHRoaXMuZ2V0RG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICBlbC5pbm5lckhUTUwgPSBodG1sXG4gICAgICAgIGxldCBmcmFnID0gdGhpcy5nZXREb2N1bWVudCgpLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcbiAgICAgICAgICAgIG5vZGUsIGxhc3ROb2RlXG4gICAgICAgIHdoaWxlICgobm9kZSA9IGVsLmZpcnN0Q2hpbGQpKSB7XG4gICAgICAgICAgICBsYXN0Tm9kZSA9IGZyYWcuYXBwZW5kQ2hpbGQobm9kZSlcbiAgICAgICAgfVxuICAgICAgICByYW5nZS5pbnNlcnROb2RlKGZyYWcpXG5cbiAgICAgICAgLy8gUHJlc2VydmUgdGhlIHNlbGVjdGlvblxuICAgICAgICBpZiAobGFzdE5vZGUpIHtcbiAgICAgICAgICAgIHJhbmdlID0gcmFuZ2UuY2xvbmVSYW5nZSgpXG4gICAgICAgICAgICByYW5nZS5zZXRTdGFydEFmdGVyKGxhc3ROb2RlKVxuICAgICAgICAgICAgcmFuZ2UuY29sbGFwc2UodHJ1ZSlcbiAgICAgICAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKVxuICAgICAgICAgICAgc2VsLmFkZFJhbmdlKHJhbmdlKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0V2luZG93U2VsZWN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy50cmlidXRlLmNvbGxlY3Rpb24uaWZyYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmlidXRlLmNvbGxlY3Rpb24uaWZyYW1lLmNvbnRlbnRXaW5kb3cuZ2V0U2VsZWN0aW9uKClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3aW5kb3cuZ2V0U2VsZWN0aW9uKClcbiAgICB9XG5cbiAgICBnZXROb2RlUG9zaXRpb25JblBhcmVudChlbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiAwXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnQucGFyZW50Tm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IGVsZW1lbnQucGFyZW50Tm9kZS5jaGlsZE5vZGVzW2ldXG5cbiAgICAgICAgICAgIGlmIChub2RlID09PSBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldENvbnRlbnRFZGl0YWJsZVNlbGVjdGVkUGF0aChjdHgpIHtcbiAgICAgICAgbGV0IHNlbCA9IHRoaXMuZ2V0V2luZG93U2VsZWN0aW9uKClcbiAgICAgICAgbGV0IHNlbGVjdGVkID0gc2VsLmFuY2hvck5vZGVcbiAgICAgICAgbGV0IHBhdGggPSBbXVxuICAgICAgICBsZXQgb2Zmc2V0XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkICE9IG51bGwpIHtcbiAgICAgICAgICAgIGxldCBpXG4gICAgICAgICAgICBsZXQgY2UgPSBzZWxlY3RlZC5jb250ZW50RWRpdGFibGVcbiAgICAgICAgICAgIHdoaWxlIChzZWxlY3RlZCAhPT0gbnVsbCAmJiBjZSAhPT0gJ3RydWUnKSB7XG4gICAgICAgICAgICAgICAgaSA9IHRoaXMuZ2V0Tm9kZVBvc2l0aW9uSW5QYXJlbnQoc2VsZWN0ZWQpXG4gICAgICAgICAgICAgICAgcGF0aC5wdXNoKGkpXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQgPSBzZWxlY3RlZC5wYXJlbnROb2RlXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNlID0gc2VsZWN0ZWQuY29udGVudEVkaXRhYmxlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGF0aC5yZXZlcnNlKClcblxuICAgICAgICAgICAgLy8gZ2V0UmFuZ2VBdCBtYXkgbm90IGV4aXN0LCBuZWVkIGFsdGVybmF0aXZlXG4gICAgICAgICAgICBvZmZzZXQgPSBzZWwuZ2V0UmFuZ2VBdCgwKS5zdGFydE9mZnNldFxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkOiBzZWxlY3RlZCxcbiAgICAgICAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgICAgICAgIG9mZnNldDogb2Zmc2V0XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRUZXh0UHJlY2VkaW5nQ3VycmVudFNlbGVjdGlvbigpIHtcbiAgICAgICAgbGV0IGNvbnRleHQgPSB0aGlzLnRyaWJ1dGUuY3VycmVudCxcbiAgICAgICAgICAgIHRleHQgPSAnJ1xuXG4gICAgICAgIGlmICghdGhpcy5pc0NvbnRlbnRFZGl0YWJsZShjb250ZXh0LmVsZW1lbnQpKSB7XG4gICAgICAgICAgICBsZXQgdGV4dENvbXBvbmVudCA9IHRoaXMudHJpYnV0ZS5jdXJyZW50LmVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAodGV4dENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIGxldCBzdGFydFBvcyA9IHRleHRDb21wb25lbnQuc2VsZWN0aW9uU3RhcnRcbiAgICAgICAgICAgICAgICBpZiAodGV4dENvbXBvbmVudC52YWx1ZSAmJiBzdGFydFBvcyA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0Q29tcG9uZW50LnZhbHVlLnN1YnN0cmluZygwLCBzdGFydFBvcylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZEVsZW0gPSB0aGlzLmdldFdpbmRvd1NlbGVjdGlvbigpLmFuY2hvck5vZGVcblxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkRWxlbSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbGV0IHdvcmtpbmdOb2RlQ29udGVudCA9IHNlbGVjdGVkRWxlbS50ZXh0Q29udGVudFxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RTdGFydE9mZnNldCA9IHRoaXMuZ2V0V2luZG93U2VsZWN0aW9uKCkuZ2V0UmFuZ2VBdCgwKS5zdGFydE9mZnNldFxuXG4gICAgICAgICAgICAgICAgaWYgKHdvcmtpbmdOb2RlQ29udGVudCAmJiBzZWxlY3RTdGFydE9mZnNldCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQgPSB3b3JraW5nTm9kZUNvbnRlbnQuc3Vic3RyaW5nKDAsIHNlbGVjdFN0YXJ0T2Zmc2V0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0ZXh0XG4gICAgfVxuXG4gICAgZ2V0TGFzdFdvcmRJblRleHQodGV4dCkge1xuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXHUwMEEwL2csICcgJyk7IC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5ODUwNDA3L2hvdy1kby1pLXJlcGxhY2UtdW5pY29kZS1jaGFyYWN0ZXItdTAwYTAtd2l0aC1hLXNwYWNlLWluLWphdmFzY3JpcHRcbiAgICAgICAgbGV0IHdvcmRzQXJyYXkgPSB0ZXh0LnNwbGl0KCcgJylcbiAgICAgICAgbGV0IHdvcmxkc0NvdW50ID0gd29yZHNBcnJheS5sZW5ndGggLSAxXG4gICAgICAgIHJldHVybiB3b3Jkc0FycmF5W3dvcmxkc0NvdW50XS50cmltKClcbiAgICB9XG5cbiAgICBnZXRUcmlnZ2VySW5mbyhtZW51QWxyZWFkeUFjdGl2ZSwgaGFzVHJhaWxpbmdTcGFjZSwgcmVxdWlyZUxlYWRpbmdTcGFjZSwgYWxsb3dTcGFjZXMsIGlzQXV0b2NvbXBsZXRlKSB7XG4gICAgICAgIGxldCBjdHggPSB0aGlzLnRyaWJ1dGUuY3VycmVudFxuICAgICAgICBsZXQgc2VsZWN0ZWQsIHBhdGgsIG9mZnNldFxuXG4gICAgICAgIGlmICghdGhpcy5pc0NvbnRlbnRFZGl0YWJsZShjdHguZWxlbWVudCkpIHtcbiAgICAgICAgICAgIHNlbGVjdGVkID0gdGhpcy50cmlidXRlLmN1cnJlbnQuZWxlbWVudFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHNlbGVjdGlvbkluZm8gPSB0aGlzLmdldENvbnRlbnRFZGl0YWJsZVNlbGVjdGVkUGF0aChjdHgpXG5cbiAgICAgICAgICAgIGlmIChzZWxlY3Rpb25JbmZvKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQgPSBzZWxlY3Rpb25JbmZvLnNlbGVjdGVkXG4gICAgICAgICAgICAgICAgcGF0aCA9IHNlbGVjdGlvbkluZm8ucGF0aFxuICAgICAgICAgICAgICAgIG9mZnNldCA9IHNlbGVjdGlvbkluZm8ub2Zmc2V0XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZWZmZWN0aXZlUmFuZ2UgPSB0aGlzLmdldFRleHRQcmVjZWRpbmdDdXJyZW50U2VsZWN0aW9uKClcbiAgICAgICAgbGV0IGxhc3RXb3JkT2ZFZmZlY3RpdmVSYW5nZSA9IHRoaXMuZ2V0TGFzdFdvcmRJblRleHQoZWZmZWN0aXZlUmFuZ2UpXG5cbiAgICAgICAgaWYgKGlzQXV0b2NvbXBsZXRlKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG1lbnRpb25Qb3NpdGlvbjogZWZmZWN0aXZlUmFuZ2UubGVuZ3RoIC0gbGFzdFdvcmRPZkVmZmVjdGl2ZVJhbmdlLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBtZW50aW9uVGV4dDogbGFzdFdvcmRPZkVmZmVjdGl2ZVJhbmdlLFxuICAgICAgICAgICAgICAgIG1lbnRpb25TZWxlY3RlZEVsZW1lbnQ6IHNlbGVjdGVkLFxuICAgICAgICAgICAgICAgIG1lbnRpb25TZWxlY3RlZFBhdGg6IHBhdGgsXG4gICAgICAgICAgICAgICAgbWVudGlvblNlbGVjdGVkT2Zmc2V0OiBvZmZzZXRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlZmZlY3RpdmVSYW5nZSAhPT0gdW5kZWZpbmVkICYmIGVmZmVjdGl2ZVJhbmdlICE9PSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgbW9zdFJlY2VudFRyaWdnZXJDaGFyUG9zID0gLTFcbiAgICAgICAgICAgIGxldCB0cmlnZ2VyQ2hhclxuXG4gICAgICAgICAgICB0aGlzLnRyaWJ1dGUuY29sbGVjdGlvbi5mb3JFYWNoKGNvbmZpZyA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGMgPSBjb25maWcudHJpZ2dlclxuICAgICAgICAgICAgICAgIGxldCBpZHggPSBjb25maWcucmVxdWlyZUxlYWRpbmdTcGFjZSA/XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4V2l0aExlYWRpbmdTcGFjZShlZmZlY3RpdmVSYW5nZSwgYykgOlxuICAgICAgICAgICAgICAgICAgICBlZmZlY3RpdmVSYW5nZS5sYXN0SW5kZXhPZihjKVxuXG4gICAgICAgICAgICAgICAgaWYgKGlkeCA+IG1vc3RSZWNlbnRUcmlnZ2VyQ2hhclBvcykge1xuICAgICAgICAgICAgICAgICAgICBtb3N0UmVjZW50VHJpZ2dlckNoYXJQb3MgPSBpZHhcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlckNoYXIgPSBjXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVMZWFkaW5nU3BhY2UgPSBjb25maWcucmVxdWlyZUxlYWRpbmdTcGFjZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGlmIChtb3N0UmVjZW50VHJpZ2dlckNoYXJQb3MgPj0gMCAmJlxuICAgICAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICAgICAgbW9zdFJlY2VudFRyaWdnZXJDaGFyUG9zID09PSAwIHx8XG4gICAgICAgICAgICAgICAgICAgICFyZXF1aXJlTGVhZGluZ1NwYWNlIHx8XG4gICAgICAgICAgICAgICAgICAgIC9bXFx4QTBcXHNdL2cudGVzdChcbiAgICAgICAgICAgICAgICAgICAgICAgIGVmZmVjdGl2ZVJhbmdlLnN1YnN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3N0UmVjZW50VHJpZ2dlckNoYXJQb3MgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vc3RSZWNlbnRUcmlnZ2VyQ2hhclBvcylcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50VHJpZ2dlclNuaXBwZXQgPSBlZmZlY3RpdmVSYW5nZS5zdWJzdHJpbmcobW9zdFJlY2VudFRyaWdnZXJDaGFyUG9zICsgMSxcbiAgICAgICAgICAgICAgICAgICAgZWZmZWN0aXZlUmFuZ2UubGVuZ3RoKVxuXG4gICAgICAgICAgICAgICAgdHJpZ2dlckNoYXIgPSBlZmZlY3RpdmVSYW5nZS5zdWJzdHJpbmcobW9zdFJlY2VudFRyaWdnZXJDaGFyUG9zLCBtb3N0UmVjZW50VHJpZ2dlckNoYXJQb3MgKyAxKVxuICAgICAgICAgICAgICAgIGxldCBmaXJzdFNuaXBwZXRDaGFyID0gY3VycmVudFRyaWdnZXJTbmlwcGV0LnN1YnN0cmluZygwLCAxKVxuICAgICAgICAgICAgICAgIGxldCBsZWFkaW5nU3BhY2UgPSBjdXJyZW50VHJpZ2dlclNuaXBwZXQubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFNuaXBwZXRDaGFyID09PSAnICcgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0U25pcHBldENoYXIgPT09ICdcXHhBMCdcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIGlmIChoYXNUcmFpbGluZ1NwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUcmlnZ2VyU25pcHBldCA9IGN1cnJlbnRUcmlnZ2VyU25pcHBldC50cmltKClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgcmVnZXggPSBhbGxvd1NwYWNlcyA/IC9bXlxcUyBdL2cgOiAvW1xceEEwXFxzXS9nO1xuXG4gICAgICAgICAgICAgICAgdGhpcy50cmlidXRlLmhhc1RyYWlsaW5nU3BhY2UgPSByZWdleC50ZXN0KGN1cnJlbnRUcmlnZ2VyU25pcHBldCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWxlYWRpbmdTcGFjZSAmJiAobWVudUFscmVhZHlBY3RpdmUgfHwgIShyZWdleC50ZXN0KGN1cnJlbnRUcmlnZ2VyU25pcHBldCkpKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVudGlvblBvc2l0aW9uOiBtb3N0UmVjZW50VHJpZ2dlckNoYXJQb3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW50aW9uVGV4dDogY3VycmVudFRyaWdnZXJTbmlwcGV0LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVudGlvblNlbGVjdGVkRWxlbWVudDogc2VsZWN0ZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW50aW9uU2VsZWN0ZWRQYXRoOiBwYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVudGlvblNlbGVjdGVkT2Zmc2V0OiBvZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW50aW9uVHJpZ2dlckNoYXI6IHRyaWdnZXJDaGFyXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsYXN0SW5kZXhXaXRoTGVhZGluZ1NwYWNlIChzdHIsIGNoYXIpIHtcbiAgICAgICAgbGV0IHJldmVyc2VkU3RyID0gc3RyLnNwbGl0KCcnKS5yZXZlcnNlKCkuam9pbignJylcbiAgICAgICAgbGV0IGluZGV4ID0gLTFcblxuICAgICAgICBmb3IgKGxldCBjaWR4ID0gMCwgbGVuID0gc3RyLmxlbmd0aDsgY2lkeCA8IGxlbjsgY2lkeCsrKSB7XG4gICAgICAgICAgICBsZXQgZmlyc3RDaGFyID0gY2lkeCA9PT0gc3RyLmxlbmd0aCAtIDFcbiAgICAgICAgICAgIGxldCBsZWFkaW5nU3BhY2UgPSAvXFxzLy50ZXN0KHJldmVyc2VkU3RyW2NpZHggKyAxXSlcbiAgICAgICAgICAgIGxldCBtYXRjaCA9IGNoYXIgPT09IHJldmVyc2VkU3RyW2NpZHhdXG5cbiAgICAgICAgICAgIGlmIChtYXRjaCAmJiAoZmlyc3RDaGFyIHx8IGxlYWRpbmdTcGFjZSkpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IHN0ci5sZW5ndGggLSAxIC0gY2lkeFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXhcbiAgICB9XG5cbiAgICBpc0NvbnRlbnRFZGl0YWJsZShlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50Lm5vZGVOYW1lICE9PSAnSU5QVVQnICYmIGVsZW1lbnQubm9kZU5hbWUgIT09ICdURVhUQVJFQSdcbiAgICB9XG5cbiAgICBpc01lbnVPZmZTY3JlZW4oY29vcmRpbmF0ZXMsIG1lbnVEaW1lbnNpb25zKSB7XG4gICAgICAgIGxldCB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgICAgIGxldCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgICAgbGV0IGRvYyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxuICAgICAgICBsZXQgd2luZG93TGVmdCA9ICh3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jLnNjcm9sbExlZnQpIC0gKGRvYy5jbGllbnRMZWZ0IHx8IDApXG4gICAgICAgIGxldCB3aW5kb3dUb3AgPSAod2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvYy5zY3JvbGxUb3ApIC0gKGRvYy5jbGllbnRUb3AgfHwgMClcblxuICAgICAgICBsZXQgbWVudVRvcCA9IHR5cGVvZiBjb29yZGluYXRlcy50b3AgPT09ICdudW1iZXInID8gY29vcmRpbmF0ZXMudG9wIDogd2luZG93VG9wICsgd2luZG93SGVpZ2h0IC0gY29vcmRpbmF0ZXMuYm90dG9tIC0gbWVudURpbWVuc2lvbnMuaGVpZ2h0XG4gICAgICAgIGxldCBtZW51UmlnaHQgPSB0eXBlb2YgY29vcmRpbmF0ZXMucmlnaHQgPT09ICdudW1iZXInID8gY29vcmRpbmF0ZXMucmlnaHQgOiBjb29yZGluYXRlcy5sZWZ0ICsgbWVudURpbWVuc2lvbnMud2lkdGhcbiAgICAgICAgbGV0IG1lbnVCb3R0b20gPSB0eXBlb2YgY29vcmRpbmF0ZXMuYm90dG9tID09PSAnbnVtYmVyJyA/IGNvb3JkaW5hdGVzLmJvdHRvbSA6IGNvb3JkaW5hdGVzLnRvcCArIG1lbnVEaW1lbnNpb25zLmhlaWdodFxuICAgICAgICBsZXQgbWVudUxlZnQgPSB0eXBlb2YgY29vcmRpbmF0ZXMubGVmdCA9PT0gJ251bWJlcicgPyBjb29yZGluYXRlcy5sZWZ0IDogd2luZG93TGVmdCArIHdpbmRvd1dpZHRoIC0gY29vcmRpbmF0ZXMucmlnaHQgLSBtZW51RGltZW5zaW9ucy53aWR0aFxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IG1lbnVUb3AgPCBNYXRoLmZsb29yKHdpbmRvd1RvcCksXG4gICAgICAgICAgICByaWdodDogbWVudVJpZ2h0ID4gTWF0aC5jZWlsKHdpbmRvd0xlZnQgKyB3aW5kb3dXaWR0aCksXG4gICAgICAgICAgICBib3R0b206IG1lbnVCb3R0b20gPiBNYXRoLmNlaWwod2luZG93VG9wICsgd2luZG93SGVpZ2h0KSxcbiAgICAgICAgICAgIGxlZnQ6IG1lbnVMZWZ0IDwgTWF0aC5mbG9vcih3aW5kb3dMZWZ0KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TWVudURpbWVuc2lvbnMoKSB7XG4gICAgICAgIC8vIFdpZHRoIG9mIHRoZSBtZW51IGRlcGVuZHMgb2YgaXRzIGNvbnRlbnRzIGFuZCBwb3NpdGlvblxuICAgICAgICAvLyBXZSBtdXN0IGNoZWNrIHdoYXQgaXRzIHdpZHRoIHdvdWxkIGJlIHdpdGhvdXQgYW55IG9ic3RydWN0aW9uXG4gICAgICAgIC8vIFRoaXMgd2F5LCB3ZSBjYW4gYWNoaWV2ZSBnb29kIHBvc2l0aW9uaW5nIGZvciBmbGlwcGluZyB0aGUgbWVudVxuICAgICAgICBsZXQgZGltZW5zaW9ucyA9IHtcbiAgICAgICAgICAgIHdpZHRoOiBudWxsLFxuICAgICAgICAgICAgaGVpZ2h0OiBudWxsXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRyaWJ1dGUubWVudS5zdHlsZS5jc3NUZXh0ID0gYHRvcDogMHB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMHB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGZpeGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4OiAxMDAwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTsgaGlkZGVuO2BcbiAgICAgICBkaW1lbnNpb25zLndpZHRoID0gdGhpcy50cmlidXRlLm1lbnUub2Zmc2V0V2lkdGhcbiAgICAgICBkaW1lbnNpb25zLmhlaWdodCA9IHRoaXMudHJpYnV0ZS5tZW51Lm9mZnNldEhlaWdodFxuXG4gICAgICAgdGhpcy50cmlidXRlLm1lbnUuc3R5bGUuY3NzVGV4dCA9IGBkaXNwbGF5OiBub25lO2BcblxuICAgICAgIHJldHVybiBkaW1lbnNpb25zXG4gICAgfVxuXG4gICAgZ2V0VGV4dEFyZWFPcklucHV0VW5kZXJsaW5lUG9zaXRpb24oZWxlbWVudCwgcG9zaXRpb24sIGZsaXBwZWQpIHtcbiAgICAgICAgbGV0IHByb3BlcnRpZXMgPSBbJ2RpcmVjdGlvbicsICdib3hTaXppbmcnLCAnd2lkdGgnLCAnaGVpZ2h0JywgJ292ZXJmbG93WCcsXG4gICAgICAgICAgICAnb3ZlcmZsb3dZJywgJ2JvcmRlclRvcFdpZHRoJywgJ2JvcmRlclJpZ2h0V2lkdGgnLFxuICAgICAgICAgICAgJ2JvcmRlckJvdHRvbVdpZHRoJywgJ2JvcmRlckxlZnRXaWR0aCcsICdwYWRkaW5nVG9wJyxcbiAgICAgICAgICAgICdwYWRkaW5nUmlnaHQnLCAncGFkZGluZ0JvdHRvbScsICdwYWRkaW5nTGVmdCcsXG4gICAgICAgICAgICAnZm9udFN0eWxlJywgJ2ZvbnRWYXJpYW50JywgJ2ZvbnRXZWlnaHQnLCAnZm9udFN0cmV0Y2gnLFxuICAgICAgICAgICAgJ2ZvbnRTaXplJywgJ2ZvbnRTaXplQWRqdXN0JywgJ2xpbmVIZWlnaHQnLCAnZm9udEZhbWlseScsXG4gICAgICAgICAgICAndGV4dEFsaWduJywgJ3RleHRUcmFuc2Zvcm0nLCAndGV4dEluZGVudCcsXG4gICAgICAgICAgICAndGV4dERlY29yYXRpb24nLCAnbGV0dGVyU3BhY2luZycsICd3b3JkU3BhY2luZydcbiAgICAgICAgXVxuXG4gICAgICAgIGxldCBpc0ZpcmVmb3ggPSAod2luZG93Lm1veklubmVyU2NyZWVuWCAhPT0gbnVsbClcblxuICAgICAgICBsZXQgZGl2ID0gdGhpcy5nZXREb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIGRpdi5pZCA9ICdpbnB1dC10ZXh0YXJlYS1jYXJldC1wb3NpdGlvbi1taXJyb3ItZGl2J1xuICAgICAgICB0aGlzLmdldERvY3VtZW50KCkuYm9keS5hcHBlbmRDaGlsZChkaXYpXG5cbiAgICAgICAgbGV0IHN0eWxlID0gZGl2LnN0eWxlXG4gICAgICAgIGxldCBjb21wdXRlZCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID8gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSA6IGVsZW1lbnQuY3VycmVudFN0eWxlXG5cbiAgICAgICAgc3R5bGUud2hpdGVTcGFjZSA9ICdwcmUtd3JhcCdcbiAgICAgICAgaWYgKGVsZW1lbnQubm9kZU5hbWUgIT09ICdJTlBVVCcpIHtcbiAgICAgICAgICAgIHN0eWxlLndvcmRXcmFwID0gJ2JyZWFrLXdvcmQnXG4gICAgICAgIH1cblxuICAgICAgICAvLyBwb3NpdGlvbiBvZmYtc2NyZWVuXG4gICAgICAgIHN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuICAgICAgICBzdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbidcblxuICAgICAgICAvLyB0cmFuc2ZlciB0aGUgZWxlbWVudCdzIHByb3BlcnRpZXMgdG8gdGhlIGRpdlxuICAgICAgICBwcm9wZXJ0aWVzLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICAgICAgICBzdHlsZVtwcm9wXSA9IGNvbXB1dGVkW3Byb3BdXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKGlzRmlyZWZveCkge1xuICAgICAgICAgICAgc3R5bGUud2lkdGggPSBgJHsocGFyc2VJbnQoY29tcHV0ZWQud2lkdGgpIC0gMil9cHhgXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5zY3JvbGxIZWlnaHQgPiBwYXJzZUludChjb21wdXRlZC5oZWlnaHQpKVxuICAgICAgICAgICAgICAgIHN0eWxlLm92ZXJmbG93WSA9ICdzY3JvbGwnXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG4gICAgICAgIH1cblxuICAgICAgICBkaXYudGV4dENvbnRlbnQgPSBlbGVtZW50LnZhbHVlLnN1YnN0cmluZygwLCBwb3NpdGlvbilcblxuICAgICAgICBpZiAoZWxlbWVudC5ub2RlTmFtZSA9PT0gJ0lOUFVUJykge1xuICAgICAgICAgICAgZGl2LnRleHRDb250ZW50ID0gZGl2LnRleHRDb250ZW50LnJlcGxhY2UoL1xccy9nLCAnwqAnKVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNwYW4gPSB0aGlzLmdldERvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICAgIHNwYW4udGV4dENvbnRlbnQgPSBlbGVtZW50LnZhbHVlLnN1YnN0cmluZyhwb3NpdGlvbikgfHwgJy4nXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChzcGFuKVxuXG4gICAgICAgIGxldCByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICBsZXQgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG4gICAgICAgIGxldCB3aW5kb3dMZWZ0ID0gKHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2Muc2Nyb2xsTGVmdCkgLSAoZG9jLmNsaWVudExlZnQgfHwgMClcbiAgICAgICAgbGV0IHdpbmRvd1RvcCA9ICh3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jLnNjcm9sbFRvcCkgLSAoZG9jLmNsaWVudFRvcCB8fCAwKVxuXG4gICAgICAgIGxldCBjb29yZGluYXRlcyA9IHtcbiAgICAgICAgICAgIHRvcDogcmVjdC50b3AgKyB3aW5kb3dUb3AgKyBzcGFuLm9mZnNldFRvcCArIHBhcnNlSW50KGNvbXB1dGVkLmJvcmRlclRvcFdpZHRoKSArIHBhcnNlSW50KGNvbXB1dGVkLmZvbnRTaXplKSAtIGVsZW1lbnQuc2Nyb2xsVG9wLFxuICAgICAgICAgICAgbGVmdDogcmVjdC5sZWZ0ICsgd2luZG93TGVmdCArIHNwYW4ub2Zmc2V0TGVmdCArIHBhcnNlSW50KGNvbXB1dGVkLmJvcmRlckxlZnRXaWR0aClcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgICAgIGxldCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcblxuICAgICAgICBsZXQgbWVudURpbWVuc2lvbnMgPSB0aGlzLmdldE1lbnVEaW1lbnNpb25zKClcbiAgICAgICAgbGV0IG1lbnVJc09mZlNjcmVlbiA9IHRoaXMuaXNNZW51T2ZmU2NyZWVuKGNvb3JkaW5hdGVzLCBtZW51RGltZW5zaW9ucylcblxuICAgICAgICBpZiAobWVudUlzT2ZmU2NyZWVuLnJpZ2h0KSB7XG4gICAgICAgICAgICBjb29yZGluYXRlcy5yaWdodCA9IHdpbmRvd1dpZHRoIC0gY29vcmRpbmF0ZXMubGVmdFxuICAgICAgICAgICAgY29vcmRpbmF0ZXMubGVmdCA9ICdhdXRvJ1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBhcmVudEhlaWdodCA9IHRoaXMudHJpYnV0ZS5tZW51Q29udGFpbmVyXG4gICAgICAgICAgICA/IHRoaXMudHJpYnV0ZS5tZW51Q29udGFpbmVyLm9mZnNldEhlaWdodFxuICAgICAgICAgICAgOiB0aGlzLmdldERvY3VtZW50KCkuYm9keS5vZmZzZXRIZWlnaHRcblxuICAgICAgICBpZiAobWVudUlzT2ZmU2NyZWVuLmJvdHRvbSkge1xuICAgICAgICAgICAgbGV0IHBhcmVudFJlY3QgPSB0aGlzLnRyaWJ1dGUubWVudUNvbnRhaW5lclxuICAgICAgICAgICAgICAgID8gdGhpcy50cmlidXRlLm1lbnVDb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICAgICAgICA6IHRoaXMuZ2V0RG9jdW1lbnQoKS5ib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgICBsZXQgc2Nyb2xsU3RpbGxBdmFpbGFibGUgPSBwYXJlbnRIZWlnaHQgLSAod2luZG93SGVpZ2h0IC0gcGFyZW50UmVjdC50b3ApXG5cbiAgICAgICAgICAgIGNvb3JkaW5hdGVzLmJvdHRvbSA9IHNjcm9sbFN0aWxsQXZhaWxhYmxlICsgKHdpbmRvd0hlaWdodCAtIHJlY3QudG9wIC0gc3Bhbi5vZmZzZXRUb3ApXG4gICAgICAgICAgICBjb29yZGluYXRlcy50b3AgPSAnYXV0bydcbiAgICAgICAgfVxuXG4gICAgICAgIG1lbnVJc09mZlNjcmVlbiA9IHRoaXMuaXNNZW51T2ZmU2NyZWVuKGNvb3JkaW5hdGVzLCBtZW51RGltZW5zaW9ucylcbiAgICAgICAgaWYgKG1lbnVJc09mZlNjcmVlbi5sZWZ0KSB7XG4gICAgICAgICAgICBjb29yZGluYXRlcy5sZWZ0ID0gd2luZG93V2lkdGggPiBtZW51RGltZW5zaW9ucy53aWR0aFxuICAgICAgICAgICAgICAgID8gd2luZG93TGVmdCArIHdpbmRvd1dpZHRoIC0gbWVudURpbWVuc2lvbnMud2lkdGhcbiAgICAgICAgICAgICAgICA6IHdpbmRvd0xlZnRcbiAgICAgICAgICAgIGRlbGV0ZSBjb29yZGluYXRlcy5yaWdodFxuICAgICAgICB9XG4gICAgICAgIGlmIChtZW51SXNPZmZTY3JlZW4udG9wKSB7XG4gICAgICAgICAgICBjb29yZGluYXRlcy50b3AgPSB3aW5kb3dIZWlnaHQgPiBtZW51RGltZW5zaW9ucy5oZWlnaHRcbiAgICAgICAgICAgICAgICA/IHdpbmRvd1RvcCArIHdpbmRvd0hlaWdodCAtIG1lbnVEaW1lbnNpb25zLmhlaWdodFxuICAgICAgICAgICAgICAgIDogd2luZG93VG9wXG4gICAgICAgICAgICBkZWxldGUgY29vcmRpbmF0ZXMuYm90dG9tXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdldERvY3VtZW50KCkuYm9keS5yZW1vdmVDaGlsZChkaXYpXG4gICAgICAgIHJldHVybiBjb29yZGluYXRlc1xuICAgIH1cblxuICAgIGdldENvbnRlbnRFZGl0YWJsZUNhcmV0UG9zaXRpb24oc2VsZWN0ZWROb2RlUG9zaXRpb24pIHtcbiAgICAgICAgbGV0IG1hcmtlclRleHRDaGFyID0gJ++7vydcbiAgICAgICAgbGV0IG1hcmtlckVsLCBtYXJrZXJJZCA9IGBzZWxfJHtuZXcgRGF0ZSgpLmdldFRpbWUoKX1fJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCkuc3Vic3RyKDIpfWBcbiAgICAgICAgbGV0IHJhbmdlXG4gICAgICAgIGxldCBzZWwgPSB0aGlzLmdldFdpbmRvd1NlbGVjdGlvbigpXG4gICAgICAgIGxldCBwcmV2UmFuZ2UgPSBzZWwuZ2V0UmFuZ2VBdCgwKVxuXG4gICAgICAgIHJhbmdlID0gdGhpcy5nZXREb2N1bWVudCgpLmNyZWF0ZVJhbmdlKClcbiAgICAgICAgcmFuZ2Uuc2V0U3RhcnQoc2VsLmFuY2hvck5vZGUsIHNlbGVjdGVkTm9kZVBvc2l0aW9uKVxuICAgICAgICByYW5nZS5zZXRFbmQoc2VsLmFuY2hvck5vZGUsIHNlbGVjdGVkTm9kZVBvc2l0aW9uKVxuXG4gICAgICAgIHJhbmdlLmNvbGxhcHNlKGZhbHNlKVxuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgbWFya2VyIGVsZW1lbnQgY29udGFpbmluZyBhIHNpbmdsZSBpbnZpc2libGUgY2hhcmFjdGVyIHVzaW5nIERPTSBtZXRob2RzIGFuZCBpbnNlcnQgaXRcbiAgICAgICAgbWFya2VyRWwgPSB0aGlzLmdldERvY3VtZW50KCkuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICAgIG1hcmtlckVsLmlkID0gbWFya2VySWRcblxuICAgICAgICBtYXJrZXJFbC5hcHBlbmRDaGlsZCh0aGlzLmdldERvY3VtZW50KCkuY3JlYXRlVGV4dE5vZGUobWFya2VyVGV4dENoYXIpKVxuICAgICAgICByYW5nZS5pbnNlcnROb2RlKG1hcmtlckVsKVxuICAgICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKClcbiAgICAgICAgc2VsLmFkZFJhbmdlKHByZXZSYW5nZSlcblxuICAgICAgICBsZXQgcmVjdCA9IG1hcmtlckVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgIGxldCBkb2MgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcbiAgICAgICAgbGV0IHdpbmRvd0xlZnQgPSAod2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvYy5zY3JvbGxMZWZ0KSAtIChkb2MuY2xpZW50TGVmdCB8fCAwKVxuICAgICAgICBsZXQgd2luZG93VG9wID0gKHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2Muc2Nyb2xsVG9wKSAtIChkb2MuY2xpZW50VG9wIHx8IDApXG4gICAgICAgIGxldCBjb29yZGluYXRlcyA9IHtcbiAgICAgICAgICAgIGxlZnQ6IHJlY3QubGVmdCArIHdpbmRvd0xlZnQsXG4gICAgICAgICAgICB0b3A6IHJlY3QudG9wICsgbWFya2VyRWwub2Zmc2V0SGVpZ2h0ICsgd2luZG93VG9wXG4gICAgICAgIH1cbiAgICAgICAgbGV0IHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGhcbiAgICAgICAgbGV0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuXG4gICAgICAgIGxldCBtZW51RGltZW5zaW9ucyA9IHRoaXMuZ2V0TWVudURpbWVuc2lvbnMoKVxuICAgICAgICBsZXQgbWVudUlzT2ZmU2NyZWVuID0gdGhpcy5pc01lbnVPZmZTY3JlZW4oY29vcmRpbmF0ZXMsIG1lbnVEaW1lbnNpb25zKVxuXG4gICAgICAgIGlmIChtZW51SXNPZmZTY3JlZW4ucmlnaHQpIHtcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzLmxlZnQgPSAnYXV0bydcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzLnJpZ2h0ID0gd2luZG93V2lkdGggLSByZWN0LmxlZnQgLSB3aW5kb3dMZWZ0XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcGFyZW50SGVpZ2h0ID0gdGhpcy50cmlidXRlLm1lbnVDb250YWluZXJcbiAgICAgICAgICAgID8gdGhpcy50cmlidXRlLm1lbnVDb250YWluZXIub2Zmc2V0SGVpZ2h0XG4gICAgICAgICAgICA6IHRoaXMuZ2V0RG9jdW1lbnQoKS5ib2R5Lm9mZnNldEhlaWdodFxuXG4gICAgICAgIGlmIChtZW51SXNPZmZTY3JlZW4uYm90dG9tKSB7XG4gICAgICAgICAgICBsZXQgcGFyZW50UmVjdCA9IHRoaXMudHJpYnV0ZS5tZW51Q29udGFpbmVyXG4gICAgICAgICAgICAgICAgPyB0aGlzLnRyaWJ1dGUubWVudUNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICAgICAgICAgIDogdGhpcy5nZXREb2N1bWVudCgpLmJvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICAgIGxldCBzY3JvbGxTdGlsbEF2YWlsYWJsZSA9IHBhcmVudEhlaWdodCAtICh3aW5kb3dIZWlnaHQgLSBwYXJlbnRSZWN0LnRvcClcblxuICAgICAgICAgICAgY29vcmRpbmF0ZXMudG9wID0gJ2F1dG8nXG4gICAgICAgICAgICBjb29yZGluYXRlcy5ib3R0b20gPSBzY3JvbGxTdGlsbEF2YWlsYWJsZSArICh3aW5kb3dIZWlnaHQgLSByZWN0LnRvcClcbiAgICAgICAgfVxuXG4gICAgICAgIG1lbnVJc09mZlNjcmVlbiA9IHRoaXMuaXNNZW51T2ZmU2NyZWVuKGNvb3JkaW5hdGVzLCBtZW51RGltZW5zaW9ucylcbiAgICAgICAgaWYgKG1lbnVJc09mZlNjcmVlbi5sZWZ0KSB7XG4gICAgICAgICAgICBjb29yZGluYXRlcy5sZWZ0ID0gd2luZG93V2lkdGggPiBtZW51RGltZW5zaW9ucy53aWR0aFxuICAgICAgICAgICAgICAgID8gd2luZG93TGVmdCArIHdpbmRvd1dpZHRoIC0gbWVudURpbWVuc2lvbnMud2lkdGhcbiAgICAgICAgICAgICAgICA6IHdpbmRvd0xlZnRcbiAgICAgICAgICAgIGRlbGV0ZSBjb29yZGluYXRlcy5yaWdodFxuICAgICAgICB9XG4gICAgICAgIGlmIChtZW51SXNPZmZTY3JlZW4udG9wKSB7XG4gICAgICAgICAgICBjb29yZGluYXRlcy50b3AgPSB3aW5kb3dIZWlnaHQgPiBtZW51RGltZW5zaW9ucy5oZWlnaHRcbiAgICAgICAgICAgICAgICA/IHdpbmRvd1RvcCArIHdpbmRvd0hlaWdodCAtIG1lbnVEaW1lbnNpb25zLmhlaWdodFxuICAgICAgICAgICAgICAgIDogd2luZG93VG9wXG4gICAgICAgICAgICBkZWxldGUgY29vcmRpbmF0ZXMuYm90dG9tXG4gICAgICAgIH1cblxuICAgICAgICBtYXJrZXJFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG1hcmtlckVsKVxuICAgICAgICByZXR1cm4gY29vcmRpbmF0ZXNcbiAgICB9XG5cbiAgICBzY3JvbGxJbnRvVmlldyhlbGVtKSB7XG4gICAgICAgIGxldCByZWFzb25hYmxlQnVmZmVyID0gMjAsXG4gICAgICAgICAgICBjbGllbnRSZWN0XG4gICAgICAgIGxldCBtYXhTY3JvbGxEaXNwbGFjZW1lbnQgPSAxMDBcbiAgICAgICAgbGV0IGUgPSB0aGlzLm1lbnVcblxuICAgICAgICBpZiAodHlwZW9mIGUgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG5cbiAgICAgICAgd2hpbGUgKGNsaWVudFJlY3QgPT09IHVuZGVmaW5lZCB8fCBjbGllbnRSZWN0LmhlaWdodCA9PT0gMCkge1xuICAgICAgICAgICAgY2xpZW50UmVjdCA9IGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgICAgICAgICAgaWYgKGNsaWVudFJlY3QuaGVpZ2h0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZSA9IGUuY2hpbGROb2Rlc1swXVxuICAgICAgICAgICAgICAgIGlmIChlID09PSB1bmRlZmluZWQgfHwgIWUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBlbGVtVG9wID0gY2xpZW50UmVjdC50b3BcbiAgICAgICAgbGV0IGVsZW1Cb3R0b20gPSBlbGVtVG9wICsgY2xpZW50UmVjdC5oZWlnaHRcblxuICAgICAgICBpZiAoZWxlbVRvcCA8IDApIHtcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCB3aW5kb3cucGFnZVlPZmZzZXQgKyBjbGllbnRSZWN0LnRvcCAtIHJlYXNvbmFibGVCdWZmZXIpXG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbUJvdHRvbSA+IHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgICAgICAgbGV0IG1heFkgPSB3aW5kb3cucGFnZVlPZmZzZXQgKyBjbGllbnRSZWN0LnRvcCAtIHJlYXNvbmFibGVCdWZmZXJcblxuICAgICAgICAgICAgaWYgKG1heFkgLSB3aW5kb3cucGFnZVlPZmZzZXQgPiBtYXhTY3JvbGxEaXNwbGFjZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBtYXhZID0gd2luZG93LnBhZ2VZT2Zmc2V0ICsgbWF4U2Nyb2xsRGlzcGxhY2VtZW50XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB0YXJnZXRZID0gd2luZG93LnBhZ2VZT2Zmc2V0IC0gKHdpbmRvdy5pbm5lckhlaWdodCAtIGVsZW1Cb3R0b20pXG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRZID4gbWF4WSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFkgPSBtYXhZXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCB0YXJnZXRZKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFRyaWJ1dGVSYW5nZTtcbiIsIi8vIFRoYW5rcyB0byBodHRwczovL2dpdGh1Yi5jb20vbWF0dHlvcmsvZnV6enlcbmNsYXNzIFRyaWJ1dGVTZWFyY2gge1xuICAgIGNvbnN0cnVjdG9yKHRyaWJ1dGUsIG9wdHMpIHtcbiAgICAgICAgdGhpcy50cmlidXRlID0gdHJpYnV0ZVxuICAgICAgICB0aGlzLnRyaWJ1dGUuc2VhcmNoID0gdGhpc1xuICAgICAgICB0aGlzLm9wdHMgPSBvcHRzO1xuICAgIH1cblxuICAgIHNpbXBsZUZpbHRlcihwYXR0ZXJuLCBhcnJheSkge1xuICAgICAgICByZXR1cm4gYXJyYXkuZmlsdGVyKHN0cmluZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZXN0KHBhdHRlcm4sIHN0cmluZylcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICB0ZXN0KHBhdHRlcm4sIHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXRjaChwYXR0ZXJuLCBzdHJpbmcpICE9PSBudWxsXG4gICAgfVxuXG4gICAgbWF0Y2gocGF0dGVybiwgc3RyaW5nLCBvcHRzKSB7XG4gICAgICAgIG9wdHMgPSBvcHRzIHx8IHt9XG4gICAgICAgIGxldCBwYXR0ZXJuSWR4ID0gMCxcbiAgICAgICAgICAgIHJlc3VsdCA9IFtdLFxuICAgICAgICAgICAgbGVuID0gc3RyaW5nLmxlbmd0aCxcbiAgICAgICAgICAgIHRvdGFsU2NvcmUgPSAwLFxuICAgICAgICAgICAgY3VyclNjb3JlID0gMCxcbiAgICAgICAgICAgIHByZSA9IG9wdHMucHJlIHx8ICcnLFxuICAgICAgICAgICAgcG9zdCA9IG9wdHMucG9zdCB8fCAnJyxcbiAgICAgICAgICAgIGNvbXBhcmVTdHJpbmcgPSBvcHRzLmNhc2VTZW5zaXRpdmUgJiYgc3RyaW5nIHx8IHN0cmluZy50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgY2gsIGNvbXBhcmVDaGFyXG5cbiAgICAgICAgaWYgKG9wdHMuc2tpcCkge1xuICAgICAgICAgICAgcmV0dXJuIHtyZW5kZXJlZDogc3RyaW5nLCBzY29yZTogMH1cbiAgICAgICAgfVxuXG4gICAgICAgIHBhdHRlcm4gPSBvcHRzLmNhc2VTZW5zaXRpdmUgJiYgcGF0dGVybiB8fCBwYXR0ZXJuLnRvTG93ZXJDYXNlKClcblxuICAgICAgICBsZXQgcGF0dGVybkNhY2hlID0gdGhpcy50cmF2ZXJzZShjb21wYXJlU3RyaW5nLCBwYXR0ZXJuLCAwLCAwLCBbXSlcbiAgICAgICAgaWYgKCFwYXR0ZXJuQ2FjaGUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlbmRlcmVkOiB0aGlzLnJlbmRlcihzdHJpbmcsIHBhdHRlcm5DYWNoZS5jYWNoZSwgcHJlLCBwb3N0KSxcbiAgICAgICAgICAgIHNjb3JlOiBwYXR0ZXJuQ2FjaGUuc2NvcmVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRyYXZlcnNlKHN0cmluZywgcGF0dGVybiwgc3RyaW5nSW5kZXgsIHBhdHRlcm5JbmRleCwgcGF0dGVybkNhY2hlKSB7XG4gICAgICAgIC8vIGlmIHRoZSBwYXR0ZXJuIHNlYXJjaCBhdCBlbmRcbiAgICAgICAgaWYgKHBhdHRlcm4ubGVuZ3RoID09PSBwYXR0ZXJuSW5kZXgpIHtcblxuICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHNjb3JlIGFuZCBjb3B5IHRoZSBjYWNoZSBjb250YWluaW5nIHRoZSBpbmRpY2VzIHdoZXJlIGl0J3MgZm91bmRcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc2NvcmU6IHRoaXMuY2FsY3VsYXRlU2NvcmUocGF0dGVybkNhY2hlKSxcbiAgICAgICAgICAgICAgICBjYWNoZTogcGF0dGVybkNhY2hlLnNsaWNlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHN0cmluZyBhdCBlbmQgb3IgcmVtYWluaW5nIHBhdHRlcm4gPiByZW1haW5pbmcgc3RyaW5nXG4gICAgICAgIGlmIChzdHJpbmcubGVuZ3RoID09PSBzdHJpbmdJbmRleCB8fCBwYXR0ZXJuLmxlbmd0aCAtIHBhdHRlcm5JbmRleCA+IHN0cmluZy5sZW5ndGggLSBzdHJpbmdJbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGMgPSBwYXR0ZXJuW3BhdHRlcm5JbmRleF1cbiAgICAgICAgbGV0IGluZGV4ID0gc3RyaW5nLmluZGV4T2YoYywgc3RyaW5nSW5kZXgpXG4gICAgICAgIGxldCBiZXN0LCB0ZW1wXG5cbiAgICAgICAgd2hpbGUgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHBhdHRlcm5DYWNoZS5wdXNoKGluZGV4KVxuICAgICAgICAgICAgdGVtcCA9IHRoaXMudHJhdmVyc2Uoc3RyaW5nLCBwYXR0ZXJuLCBpbmRleCArIDEsIHBhdHRlcm5JbmRleCArIDEsIHBhdHRlcm5DYWNoZSlcbiAgICAgICAgICAgIHBhdHRlcm5DYWNoZS5wb3AoKVxuXG4gICAgICAgICAgICAvLyBpZiBkb3duc3RyZWFtIHRyYXZlcnNhbCBmYWlsZWQsIHJldHVybiBiZXN0IGFuc3dlciBzbyBmYXJcbiAgICAgICAgICAgIGlmICghdGVtcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBiZXN0XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghYmVzdCB8fCBiZXN0LnNjb3JlIDwgdGVtcC5zY29yZSkge1xuICAgICAgICAgICAgICAgIGJlc3QgPSB0ZW1wXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluZGV4ID0gc3RyaW5nLmluZGV4T2YoYywgaW5kZXggKyAxKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJlc3RcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVTY29yZShwYXR0ZXJuQ2FjaGUpIHtcbiAgICAgICAgbGV0IHNjb3JlID0gMFxuICAgICAgICBsZXQgdGVtcCA9IDFcblxuICAgICAgICBwYXR0ZXJuQ2FjaGUuZm9yRWFjaCgoaW5kZXgsIGkpID0+IHtcbiAgICAgICAgICAgIGlmIChpID4gMCkge1xuICAgICAgICAgICAgICAgIGlmIChwYXR0ZXJuQ2FjaGVbaSAtIDFdICsgMSA9PT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcCArPSB0ZW1wICsgMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcCA9IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjb3JlICs9IHRlbXBcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gc2NvcmVcbiAgICB9XG5cbiAgICByZW5kZXIoc3RyaW5nLCBpbmRpY2VzLCBwcmUsIHBvc3QpIHtcbiAgICAgICAgdmFyIHJlbmRlcmVkID0gc3RyaW5nLnN1YnN0cmluZygwLCBpbmRpY2VzWzBdKVxuXG4gICAgICAgIGluZGljZXMuZm9yRWFjaCgoaW5kZXgsIGkpID0+IHtcbiAgICAgICAgICAgIHJlbmRlcmVkICs9IHByZSArIHN0cmluZ1tpbmRleF0gKyBwb3N0ICtcbiAgICAgICAgICAgICAgICBzdHJpbmcuc3Vic3RyaW5nKGluZGV4ICsgMSwgKGluZGljZXNbaSArIDFdKSA/IGluZGljZXNbaSArIDFdIDogc3RyaW5nLmxlbmd0aClcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gcmVuZGVyZWRcbiAgICB9XG5cbiAgICBmaWx0ZXIocGF0dGVybiwgYXJyLCBvcHRzKSB7XG4gICAgICAgIG9wdHMgPSBvcHRzIHx8IHt9XG4gICAgICAgIHJldHVybiBhcnJcbiAgICAgICAgICAgIC5yZWR1Y2UoKHByZXYsIGVsZW1lbnQsIGlkeCwgYXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHN0ciA9IGVsZW1lbnRcblxuICAgICAgICAgICAgICAgIGlmIChvcHRzLmV4dHJhY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gb3B0cy5leHRyYWN0KGVsZW1lbnQpXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdHIpIHsgLy8gdGFrZSBjYXJlIG9mIHVuZGVmaW5lZHMgLyBudWxscyAvIGV0Yy5cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciA9ICcnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgcmVuZGVyZWQgPSB0aGlzLm1hdGNoKHBhdHRlcm4sIHN0ciwgb3B0cylcblxuICAgICAgICAgICAgICAgIGlmIChyZW5kZXJlZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZbcHJldi5sZW5ndGhdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nOiByZW5kZXJlZC5yZW5kZXJlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlOiByZW5kZXJlZC5zY29yZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBpZHgsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZXZcbiAgICAgICAgICAgIH0sIFtdKVxuXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBsZXQgY29tcGFyZSA9IGIuc2NvcmUgLSBhLnNjb3JlXG4gICAgICAgICAgICBpZiAoY29tcGFyZSkgcmV0dXJuIGNvbXBhcmVcbiAgICAgICAgICAgIHJldHVybiBhLmluZGV4IC0gYi5pbmRleFxuICAgICAgICB9KVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVHJpYnV0ZVNlYXJjaDtcbiIsIi8qKlxuKiBUcmlidXRlLmpzXG4qIE5hdGl2ZSBFUzYgSmF2YVNjcmlwdCBAbWVudGlvbiBQbHVnaW5cbioqL1xuXG5pbXBvcnQgVHJpYnV0ZSBmcm9tIFwiLi9UcmlidXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IFRyaWJ1dGU7XG4iLCJpZiAoIUFycmF5LnByb3RvdHlwZS5maW5kKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbihwcmVkaWNhdGUpIHtcbiAgICAgICAgaWYgKHRoaXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FycmF5LnByb3RvdHlwZS5maW5kIGNhbGxlZCBvbiBudWxsIG9yIHVuZGVmaW5lZCcpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ByZWRpY2F0ZSBtdXN0IGJlIGEgZnVuY3Rpb24nKVxuICAgICAgICB9XG4gICAgICAgIHZhciBsaXN0ID0gT2JqZWN0KHRoaXMpXG4gICAgICAgIHZhciBsZW5ndGggPSBsaXN0Lmxlbmd0aCA+Pj4gMFxuICAgICAgICB2YXIgdGhpc0FyZyA9IGFyZ3VtZW50c1sxXVxuICAgICAgICB2YXIgdmFsdWVcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGxpc3RbaV1cbiAgICAgICAgICAgIGlmIChwcmVkaWNhdGUuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaSwgbGlzdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxufVxuXG5pZiAod2luZG93ICYmIHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgIT09IFwiZnVuY3Rpb25cIikge1xuICBmdW5jdGlvbiBDdXN0b21FdmVudChldmVudCwgcGFyYW1zKSB7XG4gICAgcGFyYW1zID0gcGFyYW1zIHx8IHtcbiAgICAgIGJ1YmJsZXM6IGZhbHNlLFxuICAgICAgY2FuY2VsYWJsZTogZmFsc2UsXG4gICAgICBkZXRhaWw6IHVuZGVmaW5lZFxuICAgIH1cbiAgICB2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50JylcbiAgICBldnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpXG4gICAgcmV0dXJuIGV2dFxuICB9XG5cbiBpZiAodHlwZW9mIHdpbmRvdy5FdmVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgIEN1c3RvbUV2ZW50LnByb3RvdHlwZSA9IHdpbmRvdy5FdmVudC5wcm90b3R5cGVcbiB9XG5cbiAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnRcbn0iXX0=
