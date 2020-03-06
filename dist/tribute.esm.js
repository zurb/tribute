if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.find called on null or undefined')
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function')
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value
            }
        }
        return undefined
    };
}

if (window && typeof window.CustomEvent !== "function") {
  function CustomEvent$1(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt
  }

 if (typeof window.Event !== 'undefined') {
   CustomEvent$1.prototype = window.Event.prototype;
 }

  window.CustomEvent = CustomEvent$1;
}

class TributeEvents {
  constructor(tribute) {
    this.tribute = tribute;
    this.tribute.events = this;
  }

  static keys() {
    return [
      {
        key: 9,
        value: "TAB"
      },
      {
        key: 8,
        value: "DELETE"
      },
      {
        key: 13,
        value: "ENTER"
      },
      {
        key: 27,
        value: "ESCAPE"
      },
      {
        key: 32,
        value: "SPACE"
      },
      {
        key: 38,
        value: "UP"
      },
      {
        key: 40,
        value: "DOWN"
      }
    ];
  }

  bind(element) {
    element.boundKeydown = this.keydown.bind(element, this);
    element.boundKeyup = this.keyup.bind(element, this);
    element.boundInput = this.input.bind(element, this);

    element.addEventListener("keydown", element.boundKeydown, false);
    element.addEventListener("keyup", element.boundKeyup, false);
    element.addEventListener("input", element.boundInput, false);
  }

  unbind(element) {
    element.removeEventListener("keydown", element.boundKeydown, false);
    element.removeEventListener("keyup", element.boundKeyup, false);
    element.removeEventListener("input", element.boundInput, false);

    delete element.boundKeydown;
    delete element.boundKeyup;
    delete element.boundInput;
  }

  keydown(instance, event) {
    if (instance.shouldDeactivate(event)) {
      instance.tribute.isActive = false;
      instance.tribute.hideMenu();
    }

    let element = this;
    instance.commandEvent = false;

    TributeEvents.keys().forEach(o => {
      if (o.key === event.keyCode) {
        instance.commandEvent = true;
        instance.callbacks()[o.value.toLowerCase()](event, element);
      }
    });
  }

  input(instance, event) {
    instance.inputEvent = true;
    instance.keyup.call(this, instance, event);
  }

  click(instance, event) {
    let tribute = instance.tribute;
    if (tribute.menu && tribute.menu.contains(event.target)) {
      let li = event.target;
      event.preventDefault();
      event.stopPropagation();
      while (li.nodeName.toLowerCase() !== "li") {
        li = li.parentNode;
        if (!li || li === tribute.menu) {
          throw new Error("cannot find the <li> container for the click");
        }
      }
      tribute.selectItemAtIndex(li.getAttribute("data-index"), event);
      tribute.hideMenu();

      // TODO: should fire with externalTrigger and target is outside of menu
    } else if (tribute.current.element && !tribute.current.externalTrigger) {
      tribute.current.externalTrigger = false;
      setTimeout(() => tribute.hideMenu());
    }
  }

  keyup(instance, event) {
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
        instance.callbacks().triggerChar(event, this, "");
      } else {
        let keyCode = instance.getKeyCode(instance, this, event);

        if (isNaN(keyCode) || !keyCode) return;

        let trigger = instance.tribute.triggers().find(trigger => {
          return trigger.charCodeAt(0) === keyCode;
        });

        if (typeof trigger !== "undefined") {
          instance.callbacks().triggerChar(event, this, trigger);
        }
      }
    }

    if (
      instance.tribute.current.mentionText.length <
      instance.tribute.current.collection.menuShowMinLength
    ) {
      return;
    }

    if (
      ((instance.tribute.current.trigger ||
        instance.tribute.autocompleteMode) &&
        instance.commandEvent === false) ||
      (instance.tribute.isActive && event.keyCode === 8)
    ) {
      instance.tribute.showMenuFor(this, true);
    }
  }

  shouldDeactivate(event) {
    if (!this.tribute.isActive) return false;

    if (this.tribute.current.mentionText.length === 0) {
      let eventKeyPressed = false;
      TributeEvents.keys().forEach(o => {
        if (event.keyCode === o.key) eventKeyPressed = true;
      });

      return !eventKeyPressed;
    }

    return false;
  }

  getKeyCode(instance, el, event) {
    let tribute = instance.tribute;
    let info = tribute.range.getTriggerInfo(
      false,
      tribute.hasTrailingSpace,
      true,
      tribute.allowSpaces,
      tribute.autocompleteMode
    );

    if (info) {
      return info.mentionTriggerChar.charCodeAt(0);
    } else {
      return false;
    }
  }

  updateSelection(el) {
    this.tribute.current.element = el;
    let info = this.tribute.range.getTriggerInfo(
      false,
      this.tribute.hasTrailingSpace,
      true,
      this.tribute.allowSpaces,
      this.tribute.autocompleteMode
    );

    if (info) {
      this.tribute.current.selectedPath = info.mentionSelectedPath;
      this.tribute.current.mentionText = info.mentionText;
      this.tribute.current.selectedOffset = info.mentionSelectedOffset;
    }
  }

  callbacks() {
    return {
      triggerChar: (e, el, trigger) => {
        let tribute = this.tribute;
        tribute.current.trigger = trigger;

        let collectionItem = tribute.collection.find(item => {
          return item.trigger === trigger;
        });

        tribute.current.collection = collectionItem;

        if (
          tribute.current.mentionText.length >=
            tribute.current.collection.menuShowMinLength &&
          tribute.inputEvent
        ) {
          tribute.showMenuFor(el, true);
        }
      },
      enter: (e, el) => {
        // choose selection
        if (this.tribute.isActive && this.tribute.current.filteredItems) {
          e.preventDefault();
          e.stopPropagation();
          setTimeout(() => {
            this.tribute.selectItemAtIndex(this.tribute.menuSelected, e);
            this.tribute.hideMenu();
          }, 0);
        }
      },
      escape: (e, el) => {
        if (this.tribute.isActive) {
          e.preventDefault();
          e.stopPropagation();
          this.tribute.isActive = false;
          this.tribute.hideMenu();
        }
      },
      tab: (e, el) => {
        // choose first match
        this.callbacks().enter(e, el);
      },
      space: (e, el) => {
        if (this.tribute.isActive) {
          if (this.tribute.spaceSelectsMatch) {
            this.callbacks().enter(e, el);
          } else if (!this.tribute.allowSpaces) {
            e.stopPropagation();
            setTimeout(() => {
              this.tribute.hideMenu();
              this.tribute.isActive = false;
            }, 0);
          }
        }
      },
      up: (e, el) => {
        // navigate up ul
        if (this.tribute.isActive && this.tribute.current.filteredItems) {
          e.preventDefault();
          e.stopPropagation();
          let count = this.tribute.current.filteredItems.length,
            selected = this.tribute.menuSelected;

          if (count > selected && selected > 0) {
            this.tribute.menuSelected--;
            this.setActiveLi();
          } else if (selected === 0) {
            this.tribute.menuSelected = count - 1;
            this.setActiveLi();
            this.tribute.menu.scrollTop = this.tribute.menu.scrollHeight;
          }
        }
      },
      down: (e, el) => {
        // navigate down ul
        if (this.tribute.isActive && this.tribute.current.filteredItems) {
          e.preventDefault();
          e.stopPropagation();
          let count = this.tribute.current.filteredItems.length - 1,
            selected = this.tribute.menuSelected;

          if (count > selected) {
            this.tribute.menuSelected++;
            this.setActiveLi();
          } else if (count === selected) {
            this.tribute.menuSelected = 0;
            this.setActiveLi();
            this.tribute.menu.scrollTop = 0;
          }
        }
      },
      delete: (e, el) => {
        if (
          this.tribute.isActive &&
          this.tribute.current.mentionText.length < 1
        ) {
          this.tribute.hideMenu();
        } else if (this.tribute.isActive) {
          this.tribute.showMenuFor(el);
        }
      }
    };
  }

  setActiveLi(index) {
    let lis = this.tribute.menu.querySelectorAll("li"),
      length = lis.length >>> 0;

    if (index) this.tribute.menuSelected = parseInt(index);

    for (let i = 0; i < length; i++) {
      let li = lis[i];
      if (i === this.tribute.menuSelected) {
        li.classList.add(this.tribute.current.collection.selectClass);

        let liClientRect = li.getBoundingClientRect();
        let menuClientRect = this.tribute.menu.getBoundingClientRect();

        if (liClientRect.bottom > menuClientRect.bottom) {
          let scrollDistance = liClientRect.bottom - menuClientRect.bottom;
          this.tribute.menu.scrollTop += scrollDistance;
        } else if (liClientRect.top < menuClientRect.top) {
          let scrollDistance = menuClientRect.top - liClientRect.top;
          this.tribute.menu.scrollTop -= scrollDistance;
        }
      } else {
        li.classList.remove(this.tribute.current.collection.selectClass);
      }
    }
  }

  getFullHeight(elem, includeMargin) {
    let height = elem.getBoundingClientRect().height;

    if (includeMargin) {
      let style = elem.currentStyle || window.getComputedStyle(elem);
      return (
        height + parseFloat(style.marginTop) + parseFloat(style.marginBottom)
      );
    }

    return height;
  }
}

class TributeMenuEvents {
  constructor(tribute) {
    this.tribute = tribute;
    this.tribute.menuEvents = this;
    this.menu = this.tribute.menu;
  }

  bind(menu) {
    this.menuClickEvent = this.tribute.events.click.bind(null, this);
    this.menuContainerScrollEvent = this.debounce(
      () => {
        if (this.tribute.isActive) {
          this.tribute.showMenuFor(this.tribute.current.element, false);
        }
      },
      300,
      false
    );
    this.windowResizeEvent = this.debounce(
      () => {
        if (this.tribute.isActive) {
          this.tribute.range.positionMenuAtCaret(true);
        }
      },
      300,
      false
    );

    // fixes IE11 issues with mousedown
    this.tribute.range
      .getDocument()
      .addEventListener("MSPointerDown", this.menuClickEvent, false);
    this.tribute.range
      .getDocument()
      .addEventListener("mousedown", this.menuClickEvent, false);
    window.addEventListener("resize", this.windowResizeEvent);

    if (this.menuContainer) {
      this.menuContainer.addEventListener(
        "scroll",
        this.menuContainerScrollEvent,
        false
      );
    } else {
      window.addEventListener("scroll", this.menuContainerScrollEvent);
    }
  }

  unbind(menu) {
    this.tribute.range
      .getDocument()
      .removeEventListener("mousedown", this.menuClickEvent, false);
    this.tribute.range
      .getDocument()
      .removeEventListener("MSPointerDown", this.menuClickEvent, false);
    window.removeEventListener("resize", this.windowResizeEvent);

    if (this.menuContainer) {
      this.menuContainer.removeEventListener(
        "scroll",
        this.menuContainerScrollEvent,
        false
      );
    } else {
      window.removeEventListener("scroll", this.menuContainerScrollEvent);
    }
  }

  debounce(func, wait, immediate) {
    var timeout;
    return () => {
      var context = this,
        args = arguments;
      var later = () => {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
}

// Thanks to https://github.com/jeff-collins/ment.io

class TributeRange {
    constructor(tribute) {
        this.tribute = tribute;
        this.tribute.range = this;
    }

    getDocument() {
        let iframe;
        if (this.tribute.current.collection) {
            iframe = this.tribute.current.collection.iframe;
        }

        if (!iframe) {
            return document
        }

        return iframe.contentWindow.document
    }

    positionMenuAtCaret(scrollTo) {
        let context = this.tribute.current,
            coordinates;

        let info = this.getTriggerInfo(false, this.tribute.hasTrailingSpace, true, this.tribute.allowSpaces, this.tribute.autocompleteMode);

        if (typeof info !== 'undefined') {

            if(!this.tribute.positionMenu){
                this.tribute.menu.style.cssText = `display: block;`;
                return
            }

            if (!this.isContentEditable(context.element)) {
                coordinates = this.getTextAreaOrInputUnderlinePosition(this.tribute.current.element,
                    info.mentionPosition);
            }
            else {
                coordinates = this.getContentEditableCaretPosition(info.mentionPosition);
            }

            this.tribute.menu.style.cssText = `top: ${coordinates.top}px;
                                     left: ${coordinates.left}px;
                                     right: ${coordinates.right}px;
                                     bottom: ${coordinates.bottom}px;
                                     position: absolute;
                                     display: block;`;

            if (coordinates.left === 'auto') {
                this.tribute.menu.style.left = 'auto';
            }

            if (coordinates.top === 'auto') {
                this.tribute.menu.style.top = 'auto';
            }

            if (scrollTo) this.scrollIntoView();

            window.setTimeout(() => {
                let menuDimensions = {
                   width: this.tribute.menu.offsetWidth,
                   height: this.tribute.menu.offsetHeight
                };
                let menuIsOffScreen = this.isMenuOffScreen(coordinates, menuDimensions);

                let menuIsOffScreenHorizontally = window.innerWidth > menuDimensions.width && (menuIsOffScreen.left || menuIsOffScreen.right);
                let menuIsOffScreenVertically = window.innerHeight > menuDimensions.height && (menuIsOffScreen.top || menuIsOffScreen.bottom);
                if (menuIsOffScreenHorizontally || menuIsOffScreenVertically) {
                    this.tribute.menu.style.cssText = 'display: none';
                    this.positionMenuAtCaret(scrollTo);
                }
            }, 0);

        } else {
            this.tribute.menu.style.cssText = 'display: none';
        }
    }

    get menuContainerIsBody() {
        return this.tribute.menuContainer === document.body || !this.tribute.menuContainer;
    }


    selectElement(targetElement, path, offset) {
        let range;
        let elem = targetElement;

        if (path) {
            for (var i = 0; i < path.length; i++) {
                elem = elem.childNodes[path[i]];
                if (elem === undefined) {
                    return
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
        let sel = this.getWindowSelection();

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

    replaceTriggerText(text, requireLeadingSpace, hasTrailingSpace, originalEvent, item) {
        let info = this.getTriggerInfo(true, hasTrailingSpace, requireLeadingSpace, this.tribute.allowSpaces, this.tribute.autocompleteMode);

        if (info !== undefined) {
            let context = this.tribute.current;
            let replaceEvent = new CustomEvent('tribute-replaced', {
                detail: {
                    item: item,
                    instance: context,
                    context: info,
                    event: originalEvent,
                }
            });

            if (!this.isContentEditable(context.element)) {
                let myField = this.tribute.current.element;
                let textSuffix = typeof this.tribute.replaceTextSuffix == 'string'
                    ? this.tribute.replaceTextSuffix
                    : ' ';
                text += textSuffix;
                let startPos = info.mentionPosition;
                let endPos = info.mentionPosition + info.mentionText.length + textSuffix.length;
                if (!this.tribute.autocompleteMode) {
                    endPos += info.mentionTriggerChar.length - 1;
                }
                myField.value = myField.value.substring(0, startPos) + text +
                    myField.value.substring(endPos, myField.value.length);
                myField.selectionStart = startPos + text.length;
                myField.selectionEnd = startPos + text.length;
            } else {
                // add a space to the end of the pasted text
                let textSuffix = typeof this.tribute.replaceTextSuffix == 'string'
                    ? this.tribute.replaceTextSuffix
                    : '\xA0';
                text += textSuffix;
                let endPos = info.mentionPosition + info.mentionText.length;
                if (!this.tribute.autocompleteMode) {
                    endPos += info.mentionTriggerChar.length;
                }
                this.pasteHtml(text, info.mentionPosition, endPos);
            }

            context.element.dispatchEvent(new CustomEvent('input', { bubbles: true }));
            context.element.dispatchEvent(replaceEvent);
        }
    }

    pasteHtml(html, startPos, endPos) {
        let range, sel;
        sel = this.getWindowSelection();
        range = this.getDocument().createRange();
        range.setStart(sel.anchorNode, startPos);
        range.setEnd(sel.anchorNode, endPos);
        range.deleteContents();

        let el = this.getDocument().createElement('div');
        el.innerHTML = html;
        let frag = this.getDocument().createDocumentFragment(),
            node, lastNode;
        while ((node = el.firstChild)) {
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

    getWindowSelection() {
        if (this.tribute.collection.iframe) {
            return this.tribute.collection.iframe.contentWindow.getSelection()
        }

        return window.getSelection()
    }

    getNodePositionInParent(element) {
        if (element.parentNode === null) {
            return 0
        }

        for (var i = 0; i < element.parentNode.childNodes.length; i++) {
            let node = element.parentNode.childNodes[i];

            if (node === element) {
                return i
            }
        }
    }

    getContentEditableSelectedPath(ctx) {
        let sel = this.getWindowSelection();
        let selected = sel.anchorNode;
        let path = [];
        let offset;

        if (selected != null) {
            let i;
            let ce = selected.contentEditable;
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
            }
        }
    }

    getTextPrecedingCurrentSelection() {
        let context = this.tribute.current,
            text = '';

        if (!this.isContentEditable(context.element)) {
            let textComponent = this.tribute.current.element;
            if (textComponent) {
                let startPos = textComponent.selectionStart;
                if (textComponent.value && startPos >= 0) {
                    text = textComponent.value.substring(0, startPos);
                }
            }

        } else {
            let selectedElem = this.getWindowSelection().anchorNode;

            if (selectedElem != null) {
                let workingNodeContent = selectedElem.textContent;
                let selectStartOffset = this.getWindowSelection().getRangeAt(0).startOffset;

                if (workingNodeContent && selectStartOffset >= 0) {
                    text = workingNodeContent.substring(0, selectStartOffset);
                }
            }
        }

        return text
    }

    getLastWordInText(text) {
        text = text.replace(/\u00A0/g, ' '); // https://stackoverflow.com/questions/29850407/how-do-i-replace-unicode-character-u00a0-with-a-space-in-javascript
        let wordsArray = text.split(/\s+/);
        let worldsCount = wordsArray.length - 1;
        return wordsArray[worldsCount].trim()
    }

    getTriggerInfo(menuAlreadyActive, hasTrailingSpace, requireLeadingSpace, allowSpaces, isAutocomplete) {
        let ctx = this.tribute.current;
        let selected, path, offset;

        if (!this.isContentEditable(ctx.element)) {
            selected = this.tribute.current.element;
        } else {
            let selectionInfo = this.getContentEditableSelectedPath(ctx);

            if (selectionInfo) {
                selected = selectionInfo.selected;
                path = selectionInfo.path;
                offset = selectionInfo.offset;
            }
        }

        let effectiveRange = this.getTextPrecedingCurrentSelection();
        let lastWordOfEffectiveRange = this.getLastWordInText(effectiveRange);

        if (isAutocomplete) {
            return {
                mentionPosition: effectiveRange.length - lastWordOfEffectiveRange.length,
                mentionText: lastWordOfEffectiveRange,
                mentionSelectedElement: selected,
                mentionSelectedPath: path,
                mentionSelectedOffset: offset
            }
        }

        if (effectiveRange !== undefined && effectiveRange !== null) {
            let mostRecentTriggerCharPos = -1;
            let triggerChar;

            this.tribute.collection.forEach(config => {
                let c = config.trigger;
                let idx = config.requireLeadingSpace ?
                    this.lastIndexWithLeadingSpace(effectiveRange, c) :
                    effectiveRange.lastIndexOf(c);

                if (idx > mostRecentTriggerCharPos) {
                    mostRecentTriggerCharPos = idx;
                    triggerChar = c;
                    requireLeadingSpace = config.requireLeadingSpace;
                }
            });

            if (mostRecentTriggerCharPos >= 0 &&
                (
                    mostRecentTriggerCharPos === 0 ||
                    !requireLeadingSpace ||
                    /[\xA0\s]/g.test(
                        effectiveRange.substring(
                            mostRecentTriggerCharPos - 1,
                            mostRecentTriggerCharPos)
                    )
                )
            ) {
                let currentTriggerSnippet = effectiveRange.substring(mostRecentTriggerCharPos + triggerChar.length,
                    effectiveRange.length);

                triggerChar = effectiveRange.substring(mostRecentTriggerCharPos, mostRecentTriggerCharPos + triggerChar.length);
                let firstSnippetChar = currentTriggerSnippet.substring(0, 1);
                let leadingSpace = currentTriggerSnippet.length > 0 &&
                    (
                        firstSnippetChar === ' ' ||
                        firstSnippetChar === '\xA0'
                    );
                if (hasTrailingSpace) {
                    currentTriggerSnippet = currentTriggerSnippet.trim();
                }

                let regex = allowSpaces ? /[^\S ]/g : /[\xA0\s]/g;

                this.tribute.hasTrailingSpace = regex.test(currentTriggerSnippet);

                if (!leadingSpace && (menuAlreadyActive || !(regex.test(currentTriggerSnippet)))) {
                    return {
                        mentionPosition: mostRecentTriggerCharPos,
                        mentionText: currentTriggerSnippet,
                        mentionSelectedElement: selected,
                        mentionSelectedPath: path,
                        mentionSelectedOffset: offset,
                        mentionTriggerChar: triggerChar
                    }
                }
            }
        }
    }

    lastIndexWithLeadingSpace (str, trigger) {
        let reversedStr = str.split('').reverse().join('');
        let index = -1;

        for (let cidx = 0, len = str.length; cidx < len; cidx++) {
            let firstChar = cidx === str.length - 1;
            let leadingSpace = /\s/.test(reversedStr[cidx + 1]);

            let match = true;
            for (let triggerIdx = trigger.length - 1; triggerIdx >= 0; triggerIdx--) {
              if (trigger[triggerIdx] !== reversedStr[cidx-triggerIdx]) {
                match = false;
                break
              }
            }

            if (match && (firstChar || leadingSpace)) {
                index = str.length - 1 - cidx;
                break
            }
        }

        return index
    }

    isContentEditable(element) {
        return element.nodeName !== 'INPUT' && element.nodeName !== 'TEXTAREA'
    }

    isMenuOffScreen(coordinates, menuDimensions) {
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        let doc = document.documentElement;
        let windowLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        let windowTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

        let menuTop = typeof coordinates.top === 'number' ? coordinates.top : windowTop + windowHeight - coordinates.bottom - menuDimensions.height;
        let menuRight = typeof coordinates.right === 'number' ? coordinates.right : coordinates.left + menuDimensions.width;
        let menuBottom = typeof coordinates.bottom === 'number' ? coordinates.bottom : coordinates.top + menuDimensions.height;
        let menuLeft = typeof coordinates.left === 'number' ? coordinates.left : windowLeft + windowWidth - coordinates.right - menuDimensions.width;

        return {
            top: menuTop < Math.floor(windowTop),
            right: menuRight > Math.ceil(windowLeft + windowWidth),
            bottom: menuBottom > Math.ceil(windowTop + windowHeight),
            left: menuLeft < Math.floor(windowLeft)
        }
    }

    getMenuDimensions() {
        // Width of the menu depends of its contents and position
        // We must check what its width would be without any obstruction
        // This way, we can achieve good positioning for flipping the menu
        let dimensions = {
            width: null,
            height: null
        };

        this.tribute.menu.style.cssText = `top: 0px;
                                 left: 0px;
                                 position: fixed;
                                 display: block;
                                 visibility; hidden;`;
       dimensions.width = this.tribute.menu.offsetWidth;
       dimensions.height = this.tribute.menu.offsetHeight;

       this.tribute.menu.style.cssText = `display: none;`;

       return dimensions
    }

    getTextAreaOrInputUnderlinePosition(element, position, flipped) {
        let properties = ['direction', 'boxSizing', 'width', 'height', 'overflowX',
            'overflowY', 'borderTopWidth', 'borderRightWidth',
            'borderBottomWidth', 'borderLeftWidth', 'paddingTop',
            'paddingRight', 'paddingBottom', 'paddingLeft',
            'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch',
            'fontSize', 'fontSizeAdjust', 'lineHeight', 'fontFamily',
            'textAlign', 'textTransform', 'textIndent',
            'textDecoration', 'letterSpacing', 'wordSpacing'
        ];

        let isFirefox = (window.mozInnerScreenX !== null);

        let div = this.getDocument().createElement('div');
        div.id = 'input-textarea-caret-position-mirror-div';
        this.getDocument().body.appendChild(div);

        let style = div.style;
        let computed = window.getComputedStyle ? getComputedStyle(element) : element.currentStyle;

        style.whiteSpace = 'pre-wrap';
        if (element.nodeName !== 'INPUT') {
            style.wordWrap = 'break-word';
        }

        // position off-screen
        style.position = 'absolute';
        style.visibility = 'hidden';

        // transfer the element's properties to the div
        properties.forEach(prop => {
            style[prop] = computed[prop];
        });

        if (isFirefox) {
            style.width = `${(parseInt(computed.width) - 2)}px`;
            if (element.scrollHeight > parseInt(computed.height))
                style.overflowY = 'scroll';
        } else {
            style.overflow = 'hidden';
        }

        div.textContent = element.value.substring(0, position);

        if (element.nodeName === 'INPUT') {
            div.textContent = div.textContent.replace(/\s/g, ' ');
        }

        let span = this.getDocument().createElement('span');
        span.textContent = element.value.substring(position) || '.';
        div.appendChild(span);

        let rect = element.getBoundingClientRect();
        let doc = document.documentElement;
        let windowLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        let windowTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

        let top = 0;
        let left = 0;
        if (this.menuContainerIsBody) {
          top = rect.top;
          left = rect.left;
        }

        let coordinates = {
            top: top + windowTop + span.offsetTop + parseInt(computed.borderTopWidth) + parseInt(computed.fontSize) - element.scrollTop,
            left: left + windowLeft + span.offsetLeft + parseInt(computed.borderLeftWidth)
        };

        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        let menuDimensions = this.getMenuDimensions();
        let menuIsOffScreen = this.isMenuOffScreen(coordinates, menuDimensions);

        if (menuIsOffScreen.right) {
            coordinates.right = windowWidth - coordinates.left;
            coordinates.left = 'auto';
        }

        let parentHeight = this.tribute.menuContainer
            ? this.tribute.menuContainer.offsetHeight
            : this.getDocument().body.offsetHeight;

        if (menuIsOffScreen.bottom) {
            let parentRect = this.tribute.menuContainer
                ? this.tribute.menuContainer.getBoundingClientRect()
                : this.getDocument().body.getBoundingClientRect();
            let scrollStillAvailable = parentHeight - (windowHeight - parentRect.top);

            coordinates.bottom = scrollStillAvailable + (windowHeight - rect.top - span.offsetTop);
            coordinates.top = 'auto';
        }

        menuIsOffScreen = this.isMenuOffScreen(coordinates, menuDimensions);
        if (menuIsOffScreen.left) {
            coordinates.left = windowWidth > menuDimensions.width
                ? windowLeft + windowWidth - menuDimensions.width
                : windowLeft;
            delete coordinates.right;
        }
        if (menuIsOffScreen.top) {
            coordinates.top = windowHeight > menuDimensions.height
                ? windowTop + windowHeight - menuDimensions.height
                : windowTop;
            delete coordinates.bottom;
        }

        this.getDocument().body.removeChild(div);
        return coordinates
    }

    getContentEditableCaretPosition(selectedNodePosition) {
        let range;
        let sel = this.getWindowSelection();

        range = this.getDocument().createRange();
        range.setStart(sel.anchorNode, selectedNodePosition);
        range.setEnd(sel.anchorNode, selectedNodePosition);

        range.collapse(false);

        let rect = range.getBoundingClientRect();
        let doc = document.documentElement;
        let windowLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        let windowTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

        let left = rect.left;
        let top = rect.top;

        let coordinates = {
            left: left + windowLeft,
            top: top + rect.height + windowTop
        };
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        let menuDimensions = this.getMenuDimensions();
        let menuIsOffScreen = this.isMenuOffScreen(coordinates, menuDimensions);

        if (menuIsOffScreen.right) {
            coordinates.left = 'auto';
            coordinates.right = windowWidth - rect.left - windowLeft;
        }

        let parentHeight = this.tribute.menuContainer
            ? this.tribute.menuContainer.offsetHeight
            : this.getDocument().body.offsetHeight;

        if (menuIsOffScreen.bottom) {
            let parentRect = this.tribute.menuContainer
                ? this.tribute.menuContainer.getBoundingClientRect()
                : this.getDocument().body.getBoundingClientRect();
            let scrollStillAvailable = parentHeight - (windowHeight - parentRect.top);

            coordinates.top = 'auto';
            coordinates.bottom = scrollStillAvailable + (windowHeight - rect.top);
        }

        menuIsOffScreen = this.isMenuOffScreen(coordinates, menuDimensions);
        if (menuIsOffScreen.left) {
            coordinates.left = windowWidth > menuDimensions.width
                ? windowLeft + windowWidth - menuDimensions.width
                : windowLeft;
            delete coordinates.right;
        }
        if (menuIsOffScreen.top) {
            coordinates.top = windowHeight > menuDimensions.height
                ? windowTop + windowHeight - menuDimensions.height
                : windowTop;
            delete coordinates.bottom;
        }

        if (!this.menuContainerIsBody) {
            coordinates.left = coordinates.left ? coordinates.left - this.tribute.menuContainer.offsetLeft : coordinates.left;
            coordinates.top = coordinates.top ? coordinates.top - this.tribute.menuContainer.offsetTop : coordinates.top;
        }

        return coordinates
    }

    scrollIntoView(elem) {
        let reasonableBuffer = 20,
            clientRect;
        let maxScrollDisplacement = 100;
        let e = this.menu;

        if (typeof e === 'undefined') return;

        while (clientRect === undefined || clientRect.height === 0) {
            clientRect = e.getBoundingClientRect();

            if (clientRect.height === 0) {
                e = e.childNodes[0];
                if (e === undefined || !e.getBoundingClientRect) {
                    return
                }
            }
        }

        let elemTop = clientRect.top;
        let elemBottom = elemTop + clientRect.height;

        if (elemTop < 0) {
            window.scrollTo(0, window.pageYOffset + clientRect.top - reasonableBuffer);
        } else if (elemBottom > window.innerHeight) {
            let maxY = window.pageYOffset + clientRect.top - reasonableBuffer;

            if (maxY - window.pageYOffset > maxScrollDisplacement) {
                maxY = window.pageYOffset + maxScrollDisplacement;
            }

            let targetY = window.pageYOffset - (window.innerHeight - elemBottom);

            if (targetY > maxY) {
                targetY = maxY;
            }

            window.scrollTo(0, targetY);
        }
    }
}

// Thanks to https://github.com/mattyork/fuzzy
class TributeSearch {
    constructor(tribute) {
        this.tribute = tribute;
        this.tribute.search = this;
    }

    simpleFilter(pattern, array) {
        return array.filter(string => {
            return this.test(pattern, string)
        })
    }

    test(pattern, string) {
        return this.match(pattern, string) !== null
    }

    match(pattern, string, opts) {
        opts = opts || {};
        let len = string.length,
            pre = opts.pre || '',
            post = opts.post || '',
            compareString = opts.caseSensitive && string || string.toLowerCase();

        if (opts.skip) {
            return {rendered: string, score: 0}
        }

        pattern = opts.caseSensitive && pattern || pattern.toLowerCase();

        let patternCache = this.traverse(compareString, pattern, 0, 0, []);
        if (!patternCache) {
            return null
        }
        return {
            rendered: this.render(string, patternCache.cache, pre, post),
            score: patternCache.score
        }
    }

    traverse(string, pattern, stringIndex, patternIndex, patternCache) {
        // if the pattern search at end
        if (pattern.length === patternIndex) {

            // calculate score and copy the cache containing the indices where it's found
            return {
                score: this.calculateScore(patternCache),
                cache: patternCache.slice()
            }
        }

        // if string at end or remaining pattern > remaining string
        if (string.length === stringIndex || pattern.length - patternIndex > string.length - stringIndex) {
            return undefined
        }

        let c = pattern[patternIndex];
        let index = string.indexOf(c, stringIndex);
        let best, temp;

        while (index > -1) {
            patternCache.push(index);
            temp = this.traverse(string, pattern, index + 1, patternIndex + 1, patternCache);
            patternCache.pop();

            // if downstream traversal failed, return best answer so far
            if (!temp) {
                return best
            }

            if (!best || best.score < temp.score) {
                best = temp;
            }

            index = string.indexOf(c, index + 1);
        }

        return best
    }

    calculateScore(patternCache) {
        let score = 0;
        let temp = 1;

        patternCache.forEach((index, i) => {
            if (i > 0) {
                if (patternCache[i - 1] + 1 === index) {
                    temp += temp + 1;
                }
                else {
                    temp = 1;
                }
            }

            score += temp;
        });

        return score
    }

    render(string, indices, pre, post) {
        var rendered = string.substring(0, indices[0]);

        indices.forEach((index, i) => {
            rendered += pre + string[index] + post +
                string.substring(index + 1, (indices[i + 1]) ? indices[i + 1] : string.length);
        });

        return rendered
    }

    filter(pattern, arr, opts) {
        opts = opts || {};
        return arr
            .reduce((prev, element, idx, arr) => {
                let str = element;

                if (opts.extract) {
                    str = opts.extract(element);

                    if (!str) { // take care of undefineds / nulls / etc.
                        str = '';
                    }
                }

                let rendered = this.match(pattern, str, opts);

                if (rendered != null) {
                    prev[prev.length] = {
                        string: rendered.rendered,
                        score: rendered.score,
                        index: idx,
                        original: element
                    };
                }

                return prev
            }, [])

        .sort((a, b) => {
            let compare = b.score - a.score;
            if (compare) return compare
            return a.index - b.index
        })
    }
}

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
    var sel, range;
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

/**
 * Tribute.js
 * Native ES6 JavaScript @mention Plugin
 **/

export default Tribute;
