'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tribute = function () {
  function Tribute(options) {
    _classCallCheck(this, Tribute);

    this.expando = 0;
    this.instance = this.uuid();
    this.current = {};

    // array of {key: '', value: ''}
    if (options.values) {
      this.collection = [{
        // The symbol that starts the lookup
        trigger: options.trigger || '@',

        // The function that gets call on select that retuns the content to insert
        selectCallback: (options.selectCallback || Tribute.defaultSelectCallback).bind(this),

        // the column to search against in the object
        lookup: options.lookup || 'key',

        // the column that contains the content to insert by default
        fillAttr: options.fillAttr || 'value',

        // the array of objects
        values: options.values
      }];
    } else if (options.collection) {
      this.collection = options.collection;
    } else {
      console.warn(Error('collection', 'No collection specified.'));
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
          console.warn(Error('attach', 'Cannot bind to ' + element.nodeName));
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
      // create the menu if it doesn't exist.
      if (!this.menu) {
        this.menu = this.createMenu();
        this.menuEvents.bind(this.menu);
      }

      var ul = this.menu.querySelector('ul');

      ul.innerHTML = '';

      this.current.collection.values.forEach(function (item, index) {
        var li = document.createElement('li');
        li.setAttribute('data-index', index);
        li.innerHTML = item.value;
        ul.appendChild(li);
      });

      this.range.positionMenuAtCaret();
    }
  }, {
    key: 'hideMenu',
    value: function hideMenu() {
      if (this.menu) {
        this.menu.style.cssText = 'display: none;';

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
      menu.addEventListener('keydown', this.tribute.events.keydown.bind(this.menu, this), false);
      document.addEventListener('click', this.tribute.events.click.bind(null, this), false);
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

      TributeEvents.keys().forEach(function (o) {
        if (o.key === event.keyCode) {
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

    // Google chrome retardedness

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

      if (instance.tribute.current.trigger) {
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
            return item.trigger = trigger;
          });

          tribute.current.collection = collectionItem;

          tribute.showMenuFor(el);
        },
        space: function space(e, el) {
          //cancel selection if active.
          console.log('space:', _this.tribute, e, el);
        },
        enter: function enter(e, el) {
          //choose selection
          console.log('enter:', _this.tribute, e, el);
        },
        escape: function escape(e, el) {
          // cancel selection
          console.log('escape:', _this.tribute, e, el);
        },
        backspace: function backspace(e, el) {
          // no idea
          console.log('backspace:', _this.tribute, e, el);
        },
        tab: function tab(e, el) {
          // choose first match
          console.log('tab:', _this.tribute, e, el);
        },
        up: function up(e, el) {
          // navigate up ul
          console.log('up:', _this.tribute, e, el);
        },
        down: function down(e, el) {
          // navigate down ul
          console.log('down:', _this.tribute, e, el);
        }
      };
    }
  }], [{
    key: 'keys',
    value: function keys() {
      return [{
        key: 8,
        value: 'BACKSPACE'
      }, {
        key: 9,
        value: 'TAB'
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
  }, {
    key: 'unescape',
    value: function unescape(str) {
      var r = /\\u([\d\w]{4})/gi;

      return str.replace(r, function (match, grp) {
        return String.fromCharCode(parseInt(grp, 16));
      });
    }
  }, {
    key: 'getKeyCode',
    value: function getKeyCode(event) {
      var keyCode = undefined;

      if (event.keyIdentifier) {
        return parseInt(event.keyIdentifier.substr(2), 16);
      }

      return event.keyCode;
    }
  }]);

  return TributeEvents;
}();

var TributeRange = function () {
  function TributeRange(tribute) {
    _classCallCheck(this, TributeRange);

    this.tribute = tribute;
    this.tribute.range = this;
  }

  _createClass(TributeRange, [{
    key: 'positionMenuAtCaret',
    value: function positionMenuAtCaret() {
      // getTriggerInfo(menuAlreadyActive, hasTrailingSpace)
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
        this.tribute.menu.style.cssText = 'top: ' + coordinates.top + 'px;\n                                         left: ' + coordinates.left + 'px;\n                                         position: absolute;\n                                         zIndex: 10000;\n                                         display: block;';

        // setTimeout(() => {
        //   this.scrollIntoView(context.menu);
        // }.bind(this), 0)
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
      var range, sel;
      sel = this.getWindowSelection();
      range = document.createRange();
      range.setStart(sel.anchorNode, startPos);
      range.setEnd(sel.anchorNode, endPos);
      range.deleteContents();

      var el = document.createElement('div');
      el.innerHTML = html;
      var frag = document.createDocumentFragment(),
          node,
          lastNode;
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
      var _this2 = this;

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
        var _ret = function () {
          var mostRecentTriggerCharPos = -1;
          var triggerChar = undefined;

          _this2.tribute.triggers().forEach(function (c) {
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

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
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
      var e = elem[0];

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
      } else if (elemBottom > $window.innerHeight) {
        var maxY = window.pageYOffset + clientRect.top - reasonableBuffer;

        if (maxY - window.pageYOffset > maxScrollDisplacement) {
          maxY = window.pageYOffset + maxScrollDisplacement;
        }

        var targetY = $window.pageYOffset - (window.innerHeight - elemBottom);

        if (targetY > maxY) {
          targetY = maxY;
        }

        window.scrollTo(0, targetY);
      }
    }
  }]);

  return TributeRange;
}();

var TributeSearch = function () {
  function TributeSearch(tribute) {
    _classCallCheck(this, TributeSearch);

    this.tribute = tribute;
    this.tribute.search = this;
  }

  _createClass(TributeSearch, [{
    key: 'simpleFilter',
    value: function simpleFilter(pattern, array) {
      var _this3 = this;

      return array.filter(function (string) {
        return _this3.test(pattern, string);
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

      // String to compare against. This might be a lowercase version of the
      // raw string
      compareString = opts.caseSensitive && string || string.toLowerCase(),
          ch = undefined,
          compareChar = undefined;

      pattern = opts.caseSensitive && pattern || pattern.toLowerCase();

      // For each character in the string, either add it to the result
      // or wrap in template if it's the next string in the pattern
      for (var idx = 0; idx < len; idx++) {
        ch = string[idx];
        if (compareString[idx] === pattern[patternIdx]) {
          ch = pre + ch + post;
          patternIdx += 1;

          // consecutive characters should increase the score more than linearly
          currScore += 1 + currScore;
        } else {
          currScore = 0;
        }
        totalScore += currScore;
        result[result.length] = ch;
      }

      // return rendered string if we have a match for every char
      if (patternIdx === pattern.length) {
        return {
          rendered: result.join(''),
          score: totalScore
        };
      }

      return null;
    }
  }, {
    key: 'filter',
    value: function filter(pattern, arr, opts) {
      var _this4 = this;

      if (!arr || arr.length === 0) {
        return [];
      }

      if (typeof pattern !== 'string') {
        return arr;
      }

      opts = opts || {};

      return arr.reduce(function (prev, element, idx, arr) {
        var str = element;

        if (opts.extract) {
          str = opts.extract(element);
        }

        var rendered = _this4.match(pattern, str, opts);

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