import "./utils";
import TributeEvents from "./TributeEvents";
import TributeMenuEvents from "./TributeMenuEvents";
import TributeRange from "./TributeRange";
import TributeSearch from "./TributeSearch";

class Tribute {
  constructor({
    values = null,
    iframe = null,
    selectClass = "highlight",
    containerClass = "tribute-container",
    itemClass = "",
    trigger = "@",
    autocompleteMode = false,
    selectTemplate = null,
    menuItemTemplate = null,
    lookup = "key",
    fillAttr = "value",
    collection = null,
    menuContainer = null,
    noMatchTemplate = null,
    requireLeadingSpace = true,
    allowSpaces = false,
    replaceTextSuffix = null,
    positionMenu = true,
    spaceSelectsMatch = false,
    searchOpts = {},
    menuItemLimit = null,
    menuShowMinLength = 0
  }) {
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
      trigger = "";
      allowSpaces = false;
    }

    if (values) {
      this.collection = [
        {
          // symbol that starts the lookup
          trigger: trigger,

          // is it wrapped in an iframe
          iframe: iframe,

          // class applied to selected item
          selectClass: selectClass,

          // class applied to the Container
          containerClass: containerClass,

          // class applied to each item
          itemClass: itemClass,

          // function called on select that retuns the content to insert
          selectTemplate: (
            selectTemplate || Tribute.defaultSelectTemplate
          ).bind(this),

          // function called that returns content for an item
          menuItemTemplate: (
            menuItemTemplate || Tribute.defaultMenuItemTemplate
          ).bind(this),

          // function called when menu is empty, disables hiding of menu.
          noMatchTemplate: (t => {
            if (typeof t === "string") {
              if (t.trim() === "") return null;
              return t;
            }
            if (typeof t === "function") {
              return t.bind(this);
            }

            return (
              noMatchTemplate ||
              function() {
                return "<li>No Match Found!</li>";
              }.bind(this)
            );
          })(noMatchTemplate),

          // column to search against in the object
          lookup: lookup,

          // column that contains the content to insert by default
          fillAttr: fillAttr,

          // array of objects or a function returning an array of objects
          values: values,

          requireLeadingSpace: requireLeadingSpace,

          searchOpts: searchOpts,

          menuItemLimit: menuItemLimit,

          menuShowMinLength: menuShowMinLength
        }
      ];
    } else if (collection) {
      if (this.autocompleteMode)
        console.warn(
          "Tribute in autocomplete mode does not work for collections"
        );
      this.collection = collection.map(item => {
        return {
          trigger: item.trigger || trigger,
          iframe: item.iframe || iframe,
          selectClass: item.selectClass || selectClass,
          containerClass: item.containerClass || containerClass,
          itemClass: item.itemClass || itemClass,
          selectTemplate: (
            item.selectTemplate || Tribute.defaultSelectTemplate
          ).bind(this),
          menuItemTemplate: (
            item.menuItemTemplate || Tribute.defaultMenuItemTemplate
          ).bind(this),
          // function called when menu is empty, disables hiding of menu.
          noMatchTemplate: (t => {
            if (typeof t === "string") {
              if (t.trim() === "") return null;
              return t;
            }
            if (typeof t === "function") {
              return t.bind(this);
            }

            return (
              noMatchTemplate ||
              function() {
                return "<li>No Match Found!</li>";
              }.bind(this)
            );
          })(noMatchTemplate),
          lookup: item.lookup || lookup,
          fillAttr: item.fillAttr || fillAttr,
          values: item.values,
          requireLeadingSpace: item.requireLeadingSpace,
          searchOpts: item.searchOpts || searchOpts,
          menuItemLimit: item.menuItemLimit || menuItemLimit,
          menuShowMinLength: item.menuShowMinLength || menuShowMinLength
        };
      });
    } else {
      throw new Error("[Tribute] No collection specified.");
    }

    new TributeRange(this);
    new TributeEvents(this);
    new TributeMenuEvents(this);
    new TributeSearch(this);
  }

  get isActive() {
    return this._isActive;
  }

  set isActive(val) {
    if (this._isActive != val) {
      this._isActive = val;
      if (this.current.element) {
        let noMatchEvent = new CustomEvent(`tribute-active-${val}`);
        this.current.element.dispatchEvent(noMatchEvent);
      }
    }
  }

  static defaultSelectTemplate(item) {
    if (typeof item === "undefined")
      return `${this.current.collection.trigger}${this.current.mentionText}`;
    if (this.range.isContentEditable(this.current.element)) {
      return (
        '<span class="tribute-mention">' +
        (this.current.collection.trigger +
          item.original[this.current.collection.fillAttr]) +
        "</span>"
      );
    }

    return (
      this.current.collection.trigger +
      item.original[this.current.collection.fillAttr]
    );
  }

  static defaultMenuItemTemplate(matchItem) {
    return matchItem.string;
  }

  static inputTypes() {
    return ["TEXTAREA", "INPUT"];
  }

  triggers() {
    return this.collection.map(config => {
      return config.trigger;
    });
  }

  attach(el) {
    if (!el) {
      throw new Error("[Tribute] Must pass in a DOM node or NodeList.");
    }

    // Check if it is a jQuery collection
    if (typeof jQuery !== "undefined" && el instanceof jQuery) {
      el = el.get();
    }

    // Is el an Array/Array-like object?
    if (
      el.constructor === NodeList ||
      el.constructor === HTMLCollection ||
      el.constructor === Array
    ) {
      let length = el.length;
      for (var i = 0; i < length; ++i) {
        this._attach(el[i]);
      }
    } else {
      this._attach(el);
    }
  }

  _attach(el) {
    if (el.hasAttribute("data-tribute")) {
      console.warn("Tribute was already bound to " + el.nodeName);
    }

    this.ensureEditable(el);
    this.events.bind(el);
    el.setAttribute("data-tribute", true);
  }

  ensureEditable(element) {
    if (Tribute.inputTypes().indexOf(element.nodeName) === -1) {
      if (element.contentEditable) {
        element.contentEditable = true;
      } else {
        throw new Error("[Tribute] Cannot bind to " + element.nodeName);
      }
    }
  }

  createMenu(containerClass) {
    let wrapper = this.range.getDocument().createElement("div"),
      ul = this.range.getDocument().createElement("ul");
    wrapper.className = containerClass;
    wrapper.appendChild(ul);

    if (this.menuContainer) {
      return this.menuContainer.appendChild(wrapper);
    }

    return this.range.getDocument().body.appendChild(wrapper);
  }

  showMenuFor(element, scrollTo) {
    // Only proceed if menu isn't already shown for the current element & mentionText
    if (
      this.isActive &&
      this.current.element === element &&
      this.current.mentionText === this.currentMentionTextSnapshot
    ) {
      return;
    }
    this.currentMentionTextSnapshot = this.current.mentionText;

    // create the menu if it doesn't exist.
    if (!this.menu) {
      this.menu = this.createMenu(this.current.collection.containerClass);
      element.tributeMenu = this.menu;
      this.menuEvents.bind(this.menu);
    }

    this.isActive = true;
    this.menuSelected = 0;

    if (!this.current.mentionText) {
      this.current.mentionText = "";
    }

    const processValues = values => {
      // Tribute may not be active any more by the time the value callback returns
      if (!this.isActive) {
        return;
      }

      let items = this.search.filter(this.current.mentionText, values, {
        pre: this.current.collection.searchOpts.pre || "<span>",
        post: this.current.collection.searchOpts.post || "</span>",
        skip: this.current.collection.searchOpts.skip,
        extract: el => {
          if (typeof this.current.collection.lookup === "string") {
            return el[this.current.collection.lookup];
          } else if (typeof this.current.collection.lookup === "function") {
            return this.current.collection.lookup(el, this.current.mentionText);
          } else {
            throw new Error(
              "Invalid lookup attribute, lookup must be string or function."
            );
          }
        }
      });

      if (this.current.collection.menuItemLimit) {
        items = items.slice(0, this.current.collection.menuItemLimit);
      }

      this.current.filteredItems = items;

      let ul = this.menu.querySelector("ul");

      this.range.positionMenuAtCaret(scrollTo);

      if (!items.length) {
        let noMatchEvent = new CustomEvent("tribute-no-match", {
          detail: this.menu
        });
        this.current.element.dispatchEvent(noMatchEvent);
        if (
          (typeof this.current.collection.noMatchTemplate === "function" &&
            !this.current.collection.noMatchTemplate()) ||
          !this.current.collection.noMatchTemplate
        ) {
          this.hideMenu();
        } else {
          typeof this.current.collection.noMatchTemplate === "function"
            ? (ul.innerHTML = this.current.collection.noMatchTemplate())
            : (ul.innerHTML = this.current.collection.noMatchTemplate);
        }

        return;
      }

      ul.innerHTML = "";
      let fragment = this.range.getDocument().createDocumentFragment();

      items.forEach((item, index) => {
        let li = this.range.getDocument().createElement("li");
        li.setAttribute("data-index", index);
        li.className = this.current.collection.itemClass;
        li.addEventListener("mousemove", e => {
          let [li, index] = this._findLiTarget(e.target);
          if (e.movementY !== 0) {
            this.events.setActiveLi(index);
          }
        });
        if (this.menuSelected === index) {
          li.classList.add(this.current.collection.selectClass);
        }
        li.innerHTML = this.current.collection.menuItemTemplate(item);
        fragment.appendChild(li);
      });
      ul.appendChild(fragment);
    };

    if (typeof this.current.collection.values === "function") {
      this.current.collection.values(this.current.mentionText, processValues);
    } else {
      processValues(this.current.collection.values);
    }
  }

  _findLiTarget(el) {
    if (!el) return [];
    const index = el.getAttribute("data-index");
    return !index ? this._findLiTarget(el.parentNode) : [el, index];
  }

  showMenuForCollection(element, collectionIndex) {
    if (element !== document.activeElement) {
      this.placeCaretAtEnd(element);
    }

    this.current.collection = this.collection[collectionIndex || 0];
    this.current.externalTrigger = true;
    this.current.element = element;

    if (element.isContentEditable)
      this.insertTextAtCursor(this.current.collection.trigger);
    else this.insertAtCaret(element, this.current.collection.trigger);

    this.showMenuFor(element);
  }

  // TODO: make sure this works for inputs/textareas
  placeCaretAtEnd(el) {
    el.focus();
    if (
      typeof window.getSelection != "undefined" &&
      typeof document.createRange != "undefined"
    ) {
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
  insertTextAtCursor(text) {
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
  insertAtCaret(textarea, text) {
    var scrollPos = textarea.scrollTop;
    var caretPos = textarea.selectionStart;

    var front = textarea.value.substring(0, caretPos);
    var back = textarea.value.substring(
      textarea.selectionEnd,
      textarea.value.length
    );
    textarea.value = front + text + back;
    caretPos = caretPos + text.length;
    textarea.selectionStart = caretPos;
    textarea.selectionEnd = caretPos;
    textarea.focus();
    textarea.scrollTop = scrollPos;
  }

  hideMenu() {
    if (this.menu) {
      this.menu.style.cssText = "display: none;";
      this.isActive = false;
      this.menuSelected = 0;
      this.current = {};
    }
  }

  selectItemAtIndex(index, originalEvent) {
    index = parseInt(index);
    if (typeof index !== "number" || isNaN(index)) return;
    let item = this.current.filteredItems[index];
    let content = this.current.collection.selectTemplate(item);
    if (content !== null) this.replaceText(content, originalEvent, item);
  }

  replaceText(content, originalEvent, item) {
    this.range.replaceTriggerText(content, true, true, originalEvent, item);
  }

  _append(collection, newValues, replace) {
    if (typeof collection.values === "function") {
      throw new Error("Unable to append to values, as it is a function.");
    } else if (!replace) {
      collection.values = collection.values.concat(newValues);
    } else {
      collection.values = newValues;
    }
  }

  append(collectionIndex, newValues, replace) {
    let index = parseInt(collectionIndex);
    if (typeof index !== "number")
      throw new Error("please provide an index for the collection to update.");

    let collection = this.collection[index];

    this._append(collection, newValues, replace);
  }

  appendCurrent(newValues, replace) {
    if (this.isActive) {
      this._append(this.current.collection, newValues, replace);
    } else {
      throw new Error(
        "No active state. Please use append instead and pass an index."
      );
    }
  }

  detach(el) {
    if (!el) {
      throw new Error("[Tribute] Must pass in a DOM node or NodeList.");
    }

    // Check if it is a jQuery collection
    if (typeof jQuery !== "undefined" && el instanceof jQuery) {
      el = el.get();
    }

    // Is el an Array/Array-like object?
    if (
      el.constructor === NodeList ||
      el.constructor === HTMLCollection ||
      el.constructor === Array
    ) {
      let length = el.length;
      for (var i = 0; i < length; ++i) {
        this._detach(el[i]);
      }
    } else {
      this._detach(el);
    }
  }

  _detach(el) {
    this.events.unbind(el);
    if (el.tributeMenu) {
      this.menuEvents.unbind(el.tributeMenu);
    }

    setTimeout(() => {
      el.removeAttribute("data-tribute");
      this.isActive = false;
      if (el.tributeMenu) {
        el.tributeMenu.remove();
      }
    });
  }
}

export default Tribute;
