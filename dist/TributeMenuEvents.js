"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TributeMenuEvents =
/*#__PURE__*/
function () {
  function TributeMenuEvents(tribute) {
    _classCallCheck(this, TributeMenuEvents);

    this.tribute = tribute;
    this.tribute.menuEvents = this;
    this.menu = this.tribute.menu;
  }

  _createClass(TributeMenuEvents, [{
    key: "bind",
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
      }, 300, false); // fixes IE11 issues with mousedown

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
    key: "unbind",
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
    key: "debounce",
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

var _default = TributeMenuEvents;
exports["default"] = _default;
module.exports = exports.default;