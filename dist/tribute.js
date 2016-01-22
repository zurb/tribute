'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

{
  (function () {
    var Tribute = function () {
      function Tribute(_ref) {
        var _this = this;

        var _ref$values = _ref.values;
        var values = _ref$values === undefined ? null : _ref$values;
        var _ref$trigger = _ref.trigger;
        var trigger = _ref$trigger === undefined ? '@' : _ref$trigger;
        var _ref$selectCallback = _ref.selectCallback;
        var selectCallback = _ref$selectCallback === undefined ? null : _ref$selectCallback;
        var _ref$lookup = _ref.lookup;
        var lookup = _ref$lookup === undefined ? 'key' : _ref$lookup;
        var _ref$fillAttr = _ref.fillAttr;
        var fillAttr = _ref$fillAttr === undefined ? 'value' : _ref$fillAttr;
        var _ref$collection = _ref.collection;
        var collection = _ref$collection === undefined ? null : _ref$collection;

        _classCallCheck(this, Tribute);

        this.expando = this.menuSelected = 0;
        this.instance = this.uuid();
        this.current = {};
        this.isActive = false;

        if (values) {
          this.collection = [{
            // symbol that starts the lookup
            trigger: trigger || '@',

            // function called on select that retuns the content to insert
            selectCallback: (selectCallback || Tribute.defaultSelectCallback).bind(this),

            // column to search against in the object
            lookup: lookup || 'key',

            // column that contains the content to insert by default
            fillAttr: fillAttr || 'value',

            // array of objects
            values: values
          }];
        } else if (collection) {
          this.collection = collection.map(function (item) {
            return {
              trigger: item.trigger || '@',
              selectCallback: (item.selectCallback || Tribute.defaultSelectCallback).bind(_this),
              lookup: item.lookup || 'key',
              fillAttr: item.fillAttr || 'value',
              values: item.values
            };
          });
        } else {
          throw new Error('collection', 'No collection specified.');
        }

        new TributeRange(this);
        new TributeEvents(this);
        new TributeMenuEvents(this);
        new TributeSearch(this);
      }

      _createClass(Tribute, [{
        key: 'triggers',
        value: function triggers() {
          return this.collection.map(function (config) {
            return config.trigger;
          });
        }
      }, {
        key: 'uuid',
        value: function uuid() {
          return 'trbt' + (+new Date() + ++this.expando);
        }
      }, {
        key: 'attach',
        value: function attach(element) {
          if (element.hasAttribute('data-tribute')) {
            throw new Error('tribute', 'already bound to ' + element.nodeName);
          }

          element.setAttribute('data-tribute', this.uuid());
          this.ensureEditable(element);
          this.events.bind(element);
        }
      }, {
        key: 'ensureEditable',
        value: function ensureEditable(element) {
          if (Tribute.inputTypes().indexOf(element.nodeName) === -1) {
            if (element.contentEditable) {
              element.contentEditable = true;
            } else {
              throw new Error('attach', 'Cannot bind to ' + element.nodeName);
            }
          }
        }
      }, {
        key: 'createMenu',
        value: function createMenu() {
          var wrapper = document.createElement('div'),
              ul = document.createElement('ul');

          wrapper.className = 'tribute-container';
          wrapper.appendChild(ul);
          return document.body.appendChild(wrapper);
        }
      }, {
        key: 'showMenuFor',
        value: function showMenuFor(element, collectionItem) {
          var _this2 = this;

          var items = undefined;
          // create the menu if it doesn't exist.
          if (!this.menu) {
            this.menu = this.createMenu();
            this.menuEvents.bind(this.menu);
          }

          this.isActive = true;
          this.menuSelected = 0;

          items = this.search.filter(this.current.mentionText, this.current.collection.values, {
            pre: '<span>',
            post: '</span>',
            extract: function extract(el) {
              return el[_this2.current.collection.lookup];
            }
          });

          this.current.filteredItems = items;

          var ul = this.menu.querySelector('ul');

          ul.innerHTML = '';

          items.forEach(function (item, index) {
            var li = document.createElement('li');
            li.setAttribute('data-index', index);
            if (_this2.menuSelected === index) {
              li.className = 'highlight';
            }
            li.innerHTML = item.string;
            ul.appendChild(li);
          });

          this.range.positionMenuAtCaret();
        }
      }, {
        key: 'hideMenu',
        value: function hideMenu() {
          if (this.menu) {
            this.menu.style.cssText = 'display: none;';
            this.isActive = false;
            this.menuSelected = 0;
            this.current = {};
          }
        }
      }, {
        key: 'selectItemAtIndex',
        value: function selectItemAtIndex(index) {
          var item = this.current.collection.values[index];
          var content = this.current.collection.selectCallback(item);

          this.replaceText(content);
        }
      }, {
        key: 'replaceText',
        value: function replaceText(content) {
          this.range.replaceTriggerText(content, true, true);
        }
      }], [{
        key: 'defaultSelectCallback',
        value: function defaultSelectCallback(item) {
          return '@' + item[this.current.collection.fillAttr];
        }
      }, {
        key: 'inputTypes',
        value: function inputTypes() {
          return ['TEXTAREA', 'INPUT'];
        }
      }]);

      return Tribute;
    }();

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
          var _this3 = this;

          menu.addEventListener('keydown', this.tribute.events.keydown.bind(this.menu, this), false);
          document.addEventListener('click', this.tribute.events.click.bind(null, this), false);
          window.addEventListener('resize', this.debounce(function () {
            if (_this3.tribute.isActive) {
              _this3.tribute.showMenuFor(_this3.tribute.current.element);
            }
          }, 300, false));
        }
      }, {
        key: 'debounce',
        value: function debounce(func, wait, immediate) {
          var _this4 = this,
              _arguments = arguments;

          var timeout;
          return function () {
            var context = _this4,
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
        }
      }, {
        key: 'keydown',
        value: function keydown(instance, event) {
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
        key: 'click',
        value: function click(instance, event) {
          var tribute = instance.tribute;

          if (tribute.menu && tribute.menu.contains(event.target)) {
            var li = event.target;
            tribute.selectItemAtIndex(li.getAttribute('data-index'));
            tribute.hideMenu();
          } else if (tribute.current.element) {
            tribute.hideMenu();
          }
        }
      }, {
        key: 'keyup',
        value: function keyup(instance, event) {
          var keyCode = TributeEvents.getKeyCode(event);
          if (isNaN(keyCode)) return;

          instance.updateSelection(this);

          var trigger = instance.tribute.triggers().find(function (trigger) {
            return trigger.charCodeAt(0) === keyCode;
          });

          if (typeof trigger !== 'undefined') {
            instance.callbacks().triggerChar(event, this, trigger);
          }

          if (instance.tribute.current.trigger && instance.commandEvent === false) {
            instance.tribute.showMenuFor(this);
          }
        }
      }, {
        key: 'updateSelection',
        value: function updateSelection(el) {
          this.tribute.current.element = el;
          var info = this.tribute.range.getTriggerInfo(false, false, true);

          if (info) {
            this.tribute.current.selectedPath = info.mentionSelectedPath;
            this.tribute.current.mentionText = info.mentionText;
            this.tribute.current.selectedOffset = info.mentionSelectedOffset;
          }
        }
      }, {
        key: 'callbacks',
        value: function callbacks() {
          var _this5 = this;

          return {
            triggerChar: function triggerChar(e, el, trigger) {
              var tribute = _this5.tribute;
              tribute.current.trigger = trigger;

              var collectionItem = tribute.collection.find(function (item) {
                return item.trigger === trigger;
              });

              tribute.current.collection = collectionItem;

              tribute.showMenuFor(el);
            },
            enter: function enter(e, el) {
              // choose selection
              if (_this5.tribute.isActive) {
                e.preventDefault();
                setTimeout(function () {
                  _this5.tribute.selectItemAtIndex(_this5.tribute.menuSelected);
                  _this5.tribute.hideMenu();
                }, 0);
              }
            },
            escape: function escape(e, el) {
              if (_this5.tribute.isActive) {
                e.preventDefault();
                _this5.tribute.hideMenu();
              }
            },
            tab: function tab(e, el) {
              // choose first match
              _this5.callbacks().enter(e, el);
            },
            up: function up(e, el) {
              // navigate up ul
              if (_this5.tribute.isActive) {
                e.preventDefault();
                var count = _this5.tribute.current.filteredItems.length,
                    selected = _this5.tribute.menuSelected;

                if (count > selected && selected > 0) {
                  _this5.tribute.menuSelected--;
                  _this5.setActiveLi();
                }
              }
            },
            down: function down(e, el) {
              // navigate down ul
              if (_this5.tribute.isActive) {
                e.preventDefault();
                var count = _this5.tribute.current.filteredItems.length - 1,
                    selected = _this5.tribute.menuSelected;

                if (count > _this5.tribute.menuSelected) {
                  _this5.tribute.menuSelected++;
                  _this5.setActiveLi();
                }
              }
            }
          };
        }
      }, {
        key: 'setActiveLi',
        value: function setActiveLi(index) {
          var lis = this.tribute.menu.querySelectorAll('li'),
              length = lis.length;

          for (var i = 0; i < length; i++) {
            var li = lis[i];
            if (i === this.tribute.menuSelected) {
              li.className = 'highlight';
            } else {
              li.className = '';
            }
          }
        }
      }], [{
        key: 'keys',
        value: function keys() {
          return [{
            key: 9,
            value: 'TAB'
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
      }, {
        key: 'unescape',
        value: function unescape(str) {
          var r = /\\u([\d\w]{4})/gi;

          return str.replace(r, function (match, grp) {
            return String.fromCharCode(parseInt(grp, 16));
          });
        }

        // Google chrome retardedness

      }, {
        key: 'getKeyCode',
        value: function getKeyCode(event) {
          var keyCode = undefined;

          if (event.key) {
            return event.key.charCodeAt(0);
          }

          if (event.keyIdentifier) {
            return parseInt(event.keyIdentifier.substr(2), 16);
          }

          return event.keyCode;
        }
      }]);

      return TributeEvents;
    }();

    // Thanks to https://github.com/jeff-collins/ment.io

    var TributeRange = function () {
      function TributeRange(tribute) {
        _classCallCheck(this, TributeRange);

        this.tribute = tribute;
        this.tribute.range = this;
      }

      _createClass(TributeRange, [{
        key: 'positionMenuAtCaret',
        value: function positionMenuAtCaret() {
          var _this6 = this;

          var context = this.tribute.current,
              coordinates = undefined;
          var info = this.getTriggerInfo(false, false, true);

          if (info !== undefined) {
            if (!this.isContentEditable(context.element)) {
              coordinates = this.getTextAreaOrInputUnderlinePosition(document.activeElement, info.mentionPosition);
            } else {
              coordinates = this.getContentEditableCaretPosition(info.mentionPosition);
            }

            // Move the button into place.
            this.tribute.menu.style.cssText = 'top: ' + coordinates.top + 'px;\n                                           left: ' + coordinates.left + 'px;\n                                           position: absolute;\n                                           zIndex: 10000;\n                                           display: block;';

            setTimeout(function () {
              _this6.scrollIntoView(document.activeElement);
            }, 0);
          } else {
            this.tribute.menu.style.cssText = 'display: none';
          }
        }
      }, {
        key: 'selectElement',
        value: function selectElement(targetElement, path, offset) {
          var range = undefined;
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

          range = document.createRange();
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
          var nodeName = targetElement.nodeName;

          if (nodeName === 'INPUT' || nodeName === 'TEXTAREA') {
            if (targetElement !== document.activeElement) {
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

          var info = this.getTriggerInfo(requireLeadingSpace, true, hasTrailingSpace);

          if (info !== undefined) {
            if (!this.isContentEditable(context.element)) {
              var myField = document.activeElement;
              text += ' ';
              var startPos = info.mentionPosition;
              var endPos = info.mentionPosition + info.mentionText.length + 1;
              myField.value = myField.value.substring(0, startPos) + text + myField.value.substring(endPos, myField.value.length);
              myField.selectionStart = startPos + text.length;
              myField.selectionEnd = startPos + text.length;
            } else {
              // add a space to the end of the pasted text
              text += '\xA0';
              this.pasteHtml(text, info.mentionPosition, info.mentionPosition + info.mentionText.length + 1);
            }
          }
        }
      }, {
        key: 'pasteHtml',
        value: function pasteHtml(html, startPos, endPos) {
          var range = undefined,
              sel = undefined;
          sel = this.getWindowSelection();
          range = document.createRange();
          range.setStart(sel.anchorNode, startPos);
          range.setEnd(sel.anchorNode, endPos);
          range.deleteContents();

          var el = document.createElement('div');
          el.innerHTML = html;
          var frag = document.createDocumentFragment(),
              node = undefined,
              lastNode = undefined;
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
          var offset = undefined;

          if (selected != null) {
            var i = undefined;
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
          var context = this.tribute.current;
          var text = undefined;

          if (!this.isContentEditable(context.element)) {
            var textComponent = document.activeElement;
            var startPos = textComponent.selectionStart;
            text = textComponent.value.substring(0, startPos);
          } else {
            var selectedElem = this.getWindowSelection().anchorNode;

            if (selectedElem != null) {
              var workingNodeContent = selectedElem.textContent;
              var selectStartOffset = this.getWindowSelection().getRangeAt(0).startOffset;

              if (selectStartOffset >= 0) {
                text = workingNodeContent.substring(0, selectStartOffset);
              }
            }
          }

          return text;
        }
      }, {
        key: 'getTriggerInfo',
        value: function getTriggerInfo(menuAlreadyActive, hasTrailingSpace, requireLeadingSpace) {
          var _this7 = this;

          var ctx = this.tribute.current;
          var selected = undefined,
              path = undefined,
              offset = undefined;

          if (!this.isContentEditable(ctx.element)) {
            selected = document.activeElement;
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
            var _ret2 = function () {
              var mostRecentTriggerCharPos = -1;
              var triggerChar = undefined;

              _this7.tribute.triggers().forEach(function (c) {
                var idx = effectiveRange.lastIndexOf(c);

                if (idx > mostRecentTriggerCharPos) {
                  mostRecentTriggerCharPos = idx;
                  triggerChar = c;
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
                if (!leadingSpace && (menuAlreadyActive || !/[\xA0\s]/g.test(currentTriggerSnippet))) {
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

            if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
          }
        }
      }, {
        key: 'isContentEditable',
        value: function isContentEditable(element) {
          return element.nodeName !== 'INPUT' && element.nodeName !== 'TEXTAREA';
        }
      }, {
        key: 'localToGlobalCoordinates',
        value: function localToGlobalCoordinates(element, coordinates) {
          var obj = element;

          while (obj) {
            coordinates.left += obj.offsetLeft + obj.clientLeft;
            coordinates.top += obj.offsetTop + obj.clientTop;
            obj = obj.offsetParent;
          }

          obj = element;

          while (obj !== document.body) {
            if (obj.scrollTop && obj.scrollTop > 0) {
              coordinates.top -= obj.scrollTop;
            }
            if (obj.scrollLeft && obj.scrollLeft > 0) {
              coordinates.left -= obj.scrollLeft;
            }
            obj = obj.parentNode;
          }
        }
      }, {
        key: 'getTextAreaOrInputUnderlinePosition',
        value: function getTextAreaOrInputUnderlinePosition(element, position) {
          var properties = ['direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'fontSizeAdjust', 'lineHeight', 'fontFamily', 'textAlign', 'textTransform', 'textIndent', 'textDecoration', 'letterSpacing', 'wordSpacing'];

          var isFirefox = window.mozInnerScreenX !== null;

          var div = document.createElement('div');
          div.id = 'input-textarea-caret-position-mirror-div';
          document.body.appendChild(div);

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

          var span = document.createElement('span');
          span.textContent = element.value.substring(position) || '.';
          div.appendChild(span);

          var coordinates = {
            top: span.offsetTop + parseInt(computed.borderTopWidth) + parseInt(computed.fontSize),
            left: span.offsetLeft + parseInt(computed.borderLeftWidth)
          };

          this.localToGlobalCoordinates(element, coordinates);

          document.body.removeChild(div);

          return coordinates;
        }
      }, {
        key: 'getContentEditableCaretPosition',
        value: function getContentEditableCaretPosition(selectedNodePosition) {
          var markerTextChar = '﻿';
          var markerEl = undefined,
              markerId = 'sel_' + new Date().getTime() + '_' + Math.random().toString().substr(2);
          var range = undefined;
          var sel = this.getWindowSelection();
          var prevRange = sel.getRangeAt(0);

          range = document.createRange();
          range.setStart(sel.anchorNode, selectedNodePosition);
          range.setEnd(sel.anchorNode, selectedNodePosition);

          range.collapse(false);

          // Create the marker element containing a single invisible character using DOM methods and insert it
          markerEl = document.createElement('span');
          markerEl.id = markerId;
          markerEl.appendChild(document.createTextNode(markerTextChar));
          range.insertNode(markerEl);
          sel.removeAllRanges();
          sel.addRange(prevRange);

          var coordinates = {
            left: 0,
            top: markerEl.offsetHeight
          };

          this.localToGlobalCoordinates(markerEl, coordinates);

          markerEl.parentNode.removeChild(markerEl);
          return coordinates;
        }
      }, {
        key: 'scrollIntoView',
        value: function scrollIntoView(elem) {
          // cheap hack in px - need to check styles relative to the element
          var reasonableBuffer = 20;
          var maxScrollDisplacement = 100;
          var clientRect = undefined;
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
          var _this8 = this;

          return array.filter(function (string) {
            return _this8.test(pattern, string);
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
              ch = undefined,
              compareChar = undefined;

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
          var best = undefined,
              temp = undefined;

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
          var _this9 = this;

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

            var rendered = _this9.match(pattern, str, opts);

            if (rendered != null) {
              prev[prev.length] = {
                string: rendered.rendered,
                score: rendered.score,
                index: idx,
                original: element
              };
            }

            return prev;
          }, [])

          // Sort by score. Browsers are inconsistent wrt stable/unstable
          // sorting, so force stable by using the index in the case of tie.
          // See http://ofb.net/~sethml/is-sort-stable.html
          .sort(function (a, b) {
            var compare = b.score - a.score;
            if (compare) return compare;
            return a.index - b.index;
          });
        }
      }]);

      return TributeSearch;
    }();

    window.Tribute = Tribute;
  })();
}