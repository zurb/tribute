'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tribute = function () {
  function Tribute(options) {
    _classCallCheck(this, Tribute);

    this.expando = 0;
    this.instance = this.uuid();
    this.globalCallbacks = options.callbacks || {};
    this.currentNode = null;

    // array of {key: '', value: ''}
    if (options.values) {
      this.collection = [{
        // The symbol that starts the lookup
        trigger: options.trigger || '@',

        // the column to search against in the object
        lookup: options.lookup || 'key',

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
      if (Tribute.inputTypes().indexOf(element.tagName) === -1) {
        if (element.contentEditable) {
          element.contentEditable = true;
        } else {
          console.warn(Error('attach', 'Cannot bind to ' + element.tagName));
        }
      }
    }
  }, {
    key: 'showMenuFor',
    value: function showMenuFor(element, collectionItem) {
      // create the menu if it doesn't exist.
      if (!this.menu) {
        this.menu = function () {
          var wrapper = document.createElement('div'),
              ul = document.createElement('ul');

          wrapper.className = 'tribute-container';
          wrapper.appendChild(ul);
          return document.body.appendChild(wrapper);
        }();
      }

      var ul = this.menu.querySelector('ul');

      ul.innerHTML = '';

      collectionItem.values.forEach(function (item, index) {
        var li = document.createElement('li');
        li.setAttribute('data-index', index);
        li.innerHTML = item.value;
        ul.appendChild(li);
      });
    }
  }], [{
    key: 'inputTypes',
    value: function inputTypes() {
      return ['TEXTAREA', 'INPUT'];
    }
  }]);

  return Tribute;
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
      element.addEventListener('keypress', this.keypress.bind(element, this), false);
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
    key: 'keypress',
    value: function keypress(instance, event) {
      var trigger = instance.tribute.triggers().find(function (trigger) {
        return trigger.charCodeAt(0) === event.keyCode;
      });

      if (typeof trigger !== 'undefined') {
        instance.callbacks().triggerChar(event, this, trigger);
      }
    }
  }, {
    key: 'callbacks',
    value: function callbacks() {
      var _this = this;

      return Object.assign({}, this.tribute.globalCallbacks, {
        triggerChar: function triggerChar(e, el, trigger) {
          var pos = _this.tribute.range.position(el);
          var prevCode = el.innerText.charCodeAt(pos - 1);

          var collectionItem = _this.tribute.collection.find(function (item) {
            return item.trigger = trigger;
          });

          // If space or the beginning of the line
          if (prevCode === 32 || isNaN(prevCode)) {
            _this.tribute.showMenuFor(el, collectionItem);
          }
        },
        enter: function enter(e, el) {
          console.log('enter:', _this.tribute, e, el);
        },
        escape: function escape(e, el) {
          console.log('escape:', _this.tribute, e, el);
        },
        backspace: function backspace(e, el) {
          console.log('backspace:', _this.tribute, e, el);
        },
        tab: function tab(e, el) {
          console.log('tab:', _this.tribute, e, el);
        },
        up: function up(e, el) {
          console.log('up:', _this.tribute, e, el);
        },
        down: function down(e, el) {
          console.log('down:', _this.tribute, e, el);
        }
      });
    }
  }], [{
    key: 'keys',
    value: function keys() {
      return [{ key: 8, value: 'BACKSPACE' }, { key: 9, value: 'TAB' }, { key: 13, value: 'ENTER' }, { key: 27, value: 'ESCAPE' }, { key: 38, value: 'UP' }, { key: 40, value: 'DOWN' }];
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
    key: 'position',
    value: function position(node) {
      var caretPos = 0,
          sel = undefined,
          range = undefined;

      sel = window.getSelection();

      if (sel.rangeCount) {
        range = sel.getRangeAt(0);

        if (range.commonAncestorContainer.parentNode == node) {
          caretPos = range.endOffset;
        }
      }

      return caretPos;
    }
  }]);

  return TributeRange;
}();

var tribute = new Tribute({
  values: [{ key: 'jordan@zurb.com', value: 'Jordan Humphreys' }, { key: 'sirwalterriley@zurb.com', value: 'Sir Walter Riley' }]
});

tribute.attach(document.getElementById('test'));