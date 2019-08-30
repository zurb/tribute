"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = _interopRequireDefault(require("./utils"));

var _TributeEvents = _interopRequireDefault(require("./TributeEvents"));

var _TributeMenuEvents = _interopRequireDefault(require("./TributeMenuEvents"));

var _TributeRange = _interopRequireDefault(require("./TributeRange"));

var _TributeSearch = _interopRequireDefault(require("./TributeSearch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tribute =
/*#__PURE__*/
function () {
  function Tribute(_ref) {
    var _this = this;

    var _ref$values = _ref.values,
        values = _ref$values === void 0 ? null : _ref$values,
        _ref$iframe = _ref.iframe,
        iframe = _ref$iframe === void 0 ? null : _ref$iframe,
        _ref$selectClass = _ref.selectClass,
        selectClass = _ref$selectClass === void 0 ? 'highlight' : _ref$selectClass,
        _ref$trigger = _ref.trigger,
        trigger = _ref$trigger === void 0 ? '@' : _ref$trigger,
        _ref$autocompleteMode = _ref.autocompleteMode,
        autocompleteMode = _ref$autocompleteMode === void 0 ? false : _ref$autocompleteMode,
        _ref$selectTemplate = _ref.selectTemplate,
        selectTemplate = _ref$selectTemplate === void 0 ? null : _ref$selectTemplate,
        _ref$menuItemTemplate = _ref.menuItemTemplate,
        menuItemTemplate = _ref$menuItemTemplate === void 0 ? null : _ref$menuItemTemplate,
        _ref$lookup = _ref.lookup,
        lookup = _ref$lookup === void 0 ? 'key' : _ref$lookup,
        _ref$fillAttr = _ref.fillAttr,
        fillAttr = _ref$fillAttr === void 0 ? 'value' : _ref$fillAttr,
        _ref$collection = _ref.collection,
        collection = _ref$collection === void 0 ? null : _ref$collection,
        _ref$menuContainer = _ref.menuContainer,
        menuContainer = _ref$menuContainer === void 0 ? null : _ref$menuContainer,
        _ref$noMatchTemplate = _ref.noMatchTemplate,
        noMatchTemplate = _ref$noMatchTemplate === void 0 ? null : _ref$noMatchTemplate,
        _ref$requireLeadingSp = _ref.requireLeadingSpace,
        requireLeadingSpace = _ref$requireLeadingSp === void 0 ? true : _ref$requireLeadingSp,
        _ref$allowSpaces = _ref.allowSpaces,
        allowSpaces = _ref$allowSpaces === void 0 ? false : _ref$allowSpaces,
        _ref$replaceTextSuffi = _ref.replaceTextSuffix,
        replaceTextSuffix = _ref$replaceTextSuffi === void 0 ? null : _ref$replaceTextSuffi,
        _ref$positionMenu = _ref.positionMenu,
        positionMenu = _ref$positionMenu === void 0 ? true : _ref$positionMenu,
        _ref$spaceSelectsMatc = _ref.spaceSelectsMatch,
        spaceSelectsMatch = _ref$spaceSelectsMatc === void 0 ? false : _ref$spaceSelectsMatc,
        _ref$searchOpts = _ref.searchOpts,
        searchOpts = _ref$searchOpts === void 0 ? {} : _ref$searchOpts,
        _ref$menuItemLimit = _ref.menuItemLimit,
        menuItemLimit = _ref$menuItemLimit === void 0 ? null : _ref$menuItemLimit;

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

    new _TributeRange["default"](this);
    new _TributeEvents["default"](this);
    new _TributeMenuEvents["default"](this);
    new _TributeSearch["default"](this);
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
      } // Check if it is a jQuery collection


      if (typeof jQuery !== 'undefined' && el instanceof jQuery) {
        el = el.get();
      } // Is el an Array/Array-like object?


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

      this.currentMentionTextSnapshot = this.current.mentionText; // create the menu if it doesn't exist.

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
          var noMatchEvent = new CustomEvent('tribute-no-match', {
            detail: _this2.menu
          });

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
            var _this2$_findLiTarget = _this2._findLiTarget(e.target),
                _this2$_findLiTarget2 = _slicedToArray(_this2$_findLiTarget, 2),
                li = _this2$_findLiTarget2[0],
                index = _this2$_findLiTarget2[1];

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
    } // TODO: make sure this works for inputs/textareas

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
    } // for contenteditable

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
    } // for regular inputs

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
      } // Check if it is a jQuery collection


      if (typeof jQuery !== 'undefined' && el instanceof jQuery) {
        el = el.get();
      } // Is el an Array/Array-like object?


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

var _default = Tribute;
exports["default"] = _default;
module.exports = exports.default;