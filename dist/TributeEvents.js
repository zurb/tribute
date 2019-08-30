"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TributeEvents =
/*#__PURE__*/
function () {
  function TributeEvents(tribute) {
    _classCallCheck(this, TributeEvents);

    this.tribute = tribute;
    this.tribute.events = this;
  }

  _createClass(TributeEvents, [{
    key: "bind",
    value: function bind(element) {
      element.boundKeydown = this.keydown.bind(element, this);
      element.boundKeyup = this.keyup.bind(element, this);
      element.boundInput = this.input.bind(element, this);
      element.addEventListener('keydown', element.boundKeydown, false);
      element.addEventListener('keyup', element.boundKeyup, false);
      element.addEventListener('input', element.boundInput, false);
    }
  }, {
    key: "unbind",
    value: function unbind(element) {
      element.removeEventListener('keydown', element.boundKeydown, false);
      element.removeEventListener('keyup', element.boundKeyup, false);
      element.removeEventListener('input', element.boundInput, false);
      delete element.boundKeydown;
      delete element.boundKeyup;
      delete element.boundInput;
    }
  }, {
    key: "keydown",
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
    key: "input",
    value: function input(instance, event) {
      instance.inputEvent = true;
      instance.keyup.call(this, instance, event);
    }
  }, {
    key: "click",
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
        tribute.hideMenu(); // TODO: should fire with externalTrigger and target is outside of menu
      } else if (tribute.current.element && !tribute.current.externalTrigger) {
        tribute.current.externalTrigger = false;
        setTimeout(function () {
          return tribute.hideMenu();
        });
      }
    }
  }, {
    key: "keyup",
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
    key: "shouldDeactivate",
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
    key: "getKeyCode",
    value: function getKeyCode(instance, el, event) {
      var _char;

      var tribute = instance.tribute;
      var info = tribute.range.getTriggerInfo(false, tribute.hasTrailingSpace, true, tribute.allowSpaces, tribute.autocompleteMode);

      if (info) {
        return info.mentionTriggerChar.charCodeAt(0);
      } else {
        return false;
      }
    }
  }, {
    key: "updateSelection",
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
    key: "callbacks",
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
        "delete": function _delete(e, el) {
          if (_this.tribute.isActive && _this.tribute.current.mentionText.length < 1) {
            _this.tribute.hideMenu();
          } else if (_this.tribute.isActive) {
            _this.tribute.showMenuFor(el);
          }
        }
      };
    }
  }, {
    key: "setActiveLi",
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
    key: "getFullHeight",
    value: function getFullHeight(elem, includeMargin) {
      var height = elem.getBoundingClientRect().height;

      if (includeMargin) {
        var style = elem.currentStyle || window.getComputedStyle(elem);
        return height + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
      }

      return height;
    }
  }], [{
    key: "keys",
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

var _default = TributeEvents;
exports["default"] = _default;
module.exports = exports.default;