class Tribute {
  constructor(options) {
    this.expando = 0
    this.instance = this.uuid()
    this.globalCallbacks = options.callbacks || {}
    this.current = {}

    // array of {key: '', value: ''}
    if (options.values) {
      this.collection = [{
        // The symbol that starts the lookup
        trigger: options.trigger || '@',

        // the column to search against in the object
        lookup: options.lookup || 'key',

        // the array of objects
        values: options.values
      }]
    } else if (options.collection) {
      this.collection = options.collection
    } else {
      console.warn(Error('collection', 'No collection specified.'))
    }

    new TributeRange(this)
    new TributeEvents(this)
    new TributeMenuEvents(this)
  }

  static inputTypes() {
    return [
      'TEXTAREA',
      'INPUT'
    ]
  }

  triggers() {
    return this.collection.map(config => {
      return config.trigger
    })
  }

  uuid() {
    return `trbt${(+ new Date()) + (++this.expando)}`
  }

  attach(element) {
    element.setAttribute('data-tribute', this.uuid())
    this.ensureEditable(element)
    this.events.bind(element)
  }

  ensureEditable(element) {
    if (Tribute.inputTypes().indexOf(element.nodeName) === -1) {
      if (element.contentEditable) {
        element.contentEditable = true
      } else {
        console.warn(Error('attach', 'Cannot bind to ' + element.nodeName))
      }
    }
  }

  showMenuFor(element, collectionItem) {
    // create the menu if it doesn't exist.
    if (!this.menu) {
      this.menu = (() => {
        let wrapper = document.createElement('div'),
          ul = document.createElement('ul')

        wrapper.className = 'tribute-container'
        wrapper.appendChild(ul)
        return document.body.appendChild(wrapper)
      })()

      this.menuEvents.bind(this.menu)
    }

    let ul = this.menu.querySelector('ul')

    ul.innerHTML = ''

    collectionItem.values.forEach((item, index) => {
      let li = document.createElement('li')
      li.setAttribute('data-index', index)
      li.innerHTML = item.value
      ul.appendChild(li)
    })

    this.current = {
      element: element,
      collection: collectionItem
    }

    this.range.positionMenuAtCaret()
  }

  hideMenu() {
    if (this.menu) {
      this.menu.style.cssText = 'display: none;'

      this.current = {}
    }
  }

}

class TributeMenuEvents {
  constructor(tribute) {
    this.tribute = tribute
    this.tribute.menuEvents = this
    this.menu = this.tribute.menu
  }

  bind(menu) {
    menu.addEventListener('keydown',
      this.tribute.events.keydown.bind(this.menu, this), false)
    document.addEventListener('click', this.tribute.events.click.bind(null, this), false)
  }
}

class TributeEvents {
  constructor(tribute) {
    this.tribute = tribute
    this.tribute.events = this
  }

  static keys() {
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
    }]
  }

  bind(element) {
    element.addEventListener('keydown',
      this.keydown.bind(element, this), false)
    element.addEventListener('keyup',
      this.keyup.bind(element, this), false)
  }

  static unescape(str) {
    let r = /\\u([\d\w]{4})/gi
    return str.replace(r, (match, grp) => {
        return String.fromCharCode(parseInt(grp, 16))
    })
  }

  keydown(instance, event) {
    let element = this

    TributeEvents.keys().forEach(o => {
      if (o.key === event.keyCode) {
        instance.callbacks()[o.value.toLowerCase()](event, element)
      }
    })
  }

  click(instance, event) {
    let tribute = instance.tribute
    if (tribute.menu && tribute.menu.contains(event.target)) {
      console.log('select item.')
    } else if (instance.tribute.current.element) {
      instance.tribute.hideMenu()
      console.log('hide menu')
    }
  }

  // Google chrome retardedness
  static getKeyCode(event) {
    let keyCode

    if (event.keyIdentifier) {
      return parseInt(event.keyIdentifier.substr(2), 16)
    }

    return event.keyCode
  }

  keyup(instance, event) {
    let keyCode = TributeEvents.getKeyCode(event)
    if (isNaN(keyCode)) return

    let trigger = instance.tribute.triggers().find(trigger => {
      return trigger.charCodeAt(0) === keyCode
    })

    if (typeof trigger !== 'undefined') {
      instance.callbacks().triggerChar(event, this, trigger)
    }
  }

  callbacks() {
    return Object.assign({}, this.tribute.globalCallbacks, {
      triggerChar: (e, el, trigger) => {
        let pos = this.tribute.range.position(el)
        let prevCode = el.textContent.charCodeAt(pos - 2)

        let collectionItem = this.tribute.collection.find(item => {
          return item.trigger = trigger
        })

        // If space or the beginning of the line
        if (prevCode === 32 || isNaN(prevCode)) {
          this.tribute.showMenuFor(el, collectionItem)
        }
      },
      space: (e, el) => {
        //cancel selection if active.
        console.log('space:', this.tribute, e, el)
      },
      enter: (e, el) => {
        //choose selection
        console.log('enter:', this.tribute, e, el)
      },
      escape: (e, el) => {
        // cancel selection
        console.log('escape:', this.tribute, e, el)
      },
      backspace: (e, el) => {
        // no idea
        console.log('backspace:', this.tribute, e, el)
      },
      tab: (e, el) => {
        // choose first match
        console.log('tab:', this.tribute, e, el)
      },
      up: (e, el) => {
        // navigate up ul
        console.log('up:', this.tribute, e, el)
      },
      down: (e, el) => {
        // navigate down ul
        console.log('down:', this.tribute, e, el)
      }
    })
  }

}

class TributeRange {
  constructor(tribute) {
    this.tribute = tribute
    this.tribute.range = this
  }

  positionMenuAtCaret() {
    // getTriggerInfo(menuAlreadyActive, hasTrailingSpace)
    let context = this.tribute.current, coordinates
    let info = this.getTriggerInfo(false, false)

    if (info !== undefined) {
      if (!this.isContentEditable(context.element)) {
        coordinates = this.getTextAreaOrInputUnderlinePosition(document.activeElement,
          info.mentionPosition);
      } else {
        coordinates = this.getContentEditableCaretPosition(info.mentionPosition);
      }

      // Move the button into place.
      this.tribute.menu.style.cssText = `top: ${coordinates.top}px;
                                         left: ${coordinates.left}px;
                                         position: absolute;
                                         zIndex: 10000;
                                         display: block;`

      // setTimeout(() => {
      //   this.scrollIntoView(context.menu);
      // }.bind(this), 0)
    } else {
      this.tribute.menu.style.cssText = 'display: none'
    }
  }

  getWindowSelection() {
    return window.getSelection()
  }

  getNodePositionInParent(element) {
    if (element.parentNode === null) {
      return 0
    }
    for (var i = 0; i < element.parentNode.childNodes.length; i++) {
      var node = element.parentNode.childNodes[i]
      if (node === element) {
        return i
      }
    }
  }

  getContentEditableSelectedPath() {
    // content editable
    var sel = this.getWindowSelection()
    var selected = sel.anchorNode
    var path = []
    var offset
    if (selected != null) {
      var i
      var ce = selected.contentEditable
      while (selected !== null && ce !== 'true') {
        i = this.getNodePositionInParent(selected)
        path.push(i)
        selected = selected.parentNode
        if (selected !== null) {
          ce = selected.contentEditable
        }
      }
      path.reverse()
      // getRangeAt may not exist, need alternative
      offset = sel.getRangeAt(0).startOffset
      return {
        selected: selected,
        path: path,
        offset: offset
      }
    }
  }

  getTextPrecedingCurrentSelection() {
    let context = this.tribute.current
    var text
    if (!this.isContentEditable(context.element)) {
      var textComponent = document.activeElement
      var startPos = textComponent.selectionStart
      text = textComponent.value.substring(0, startPos)

    } else {
      var selectedElem = this.getWindowSelection().anchorNode
      if (selectedElem != null) {
        var workingNodeContent = selectedElem.textContent
        var selectStartOffset = this.getWindowSelection().getRangeAt(0).startOffset

        if (selectStartOffset >= 0) {
          text = workingNodeContent.substring(0, selectStartOffset)
        }
      }
    }
    return text
  }

  getTriggerInfo(menuAlreadyActive, hasTrailingSpace, requireLeadingSpace) {
    let ctx = this.tribute.current
    var selected, path, offset
    if (!this.isContentEditable(ctx.element)) {
      selected = document.activeElement
    } else {
      // content editable
      var selectionInfo = this.getContentEditableSelectedPath()
      if (selectionInfo) {
        selected = selectionInfo.selected
        path = selectionInfo.path
        offset = selectionInfo.offset
      }
    }

    var effectiveRange = this.getTextPrecedingCurrentSelection()

    if (effectiveRange !== undefined && effectiveRange !== null) {
      var mostRecentTriggerCharPos = -1
      var triggerChar
      this.tribute.triggers().forEach((c) => {
        var idx = effectiveRange.lastIndexOf(c)
        if (idx > mostRecentTriggerCharPos) {
          mostRecentTriggerCharPos = idx
          triggerChar = c
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
        var currentTriggerSnippet = effectiveRange.substring(mostRecentTriggerCharPos + 1,
          effectiveRange.length)

        triggerChar = effectiveRange.substring(mostRecentTriggerCharPos, mostRecentTriggerCharPos + 1)
        var firstSnippetChar = currentTriggerSnippet.substring(0, 1)
        var leadingSpace = currentTriggerSnippet.length > 0 &&
          (
            firstSnippetChar === ' ' ||
            firstSnippetChar === '\xA0'
          );
        if (hasTrailingSpace) {
          currentTriggerSnippet = currentTriggerSnippet.trim()
        }
        if (!leadingSpace && (menuAlreadyActive || !(/[\xA0\s]/g.test(currentTriggerSnippet)))) {
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

  position(node) {
    let caretPos = 0,
      sel, range;

    sel = this.getWindowSelection()

    if (sel.rangeCount) {
      range = sel.getRangeAt(0)

      if (range.commonAncestorContainer.parentNode == node) {
        caretPos = range.endOffset
      }
    }

    return caretPos
  }

  isContentEditable(element) {
    return element.nodeName !== 'INPUT' && element.nodeName !== 'TEXTAREA'
  }

  localToGlobalCoordinates(element, coordinates) {
    var obj = element
    while (obj) {
      coordinates.left += obj.offsetLeft + obj.clientLeft
      coordinates.top += obj.offsetTop + obj.clientTop
      obj = obj.offsetParent
    }
    obj = element
    while (obj !== document.body) {
      if (obj.scrollTop && obj.scrollTop > 0) {
        coordinates.top -= obj.scrollTop
      }
      if (obj.scrollLeft && obj.scrollLeft > 0) {
        coordinates.left -= obj.scrollLeft
      }
      obj = obj.parentNode
    }
  }

  getTextAreaOrInputUnderlinePosition(element, position) {
    var properties = [
      'direction',
      'boxSizing',
      'width',
      'height',
      'overflowX',
      'overflowY',
      'borderTopWidth',
      'borderRightWidth',
      'borderBottomWidth',
      'borderLeftWidth',
      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',
      'fontStyle',
      'fontVariant',
      'fontWeight',
      'fontStretch',
      'fontSize',
      'fontSizeAdjust',
      'lineHeight',
      'fontFamily',
      'textAlign',
      'textTransform',
      'textIndent',
      'textDecoration',
      'letterSpacing',
      'wordSpacing'
    ]

    var isFirefox = (window.mozInnerScreenX !== null)

    var div = document.createElement('div')
    div.id = 'input-textarea-caret-position-mirror-div'
    document.body.appendChild(div)

    var style = div.style
    var computed = window.getComputedStyle ? getComputedStyle(element) : element.currentStyle

    style.whiteSpace = 'pre-wrap'
    if (element.nodeName !== 'INPUT') {
      style.wordWrap = 'break-word'
    }

    // position off-screen
    style.position = 'absolute'
    style.visibility = 'hidden'

    // transfer the element's properties to the div
    properties.forEach((prop) => {
      style[prop] = computed[prop]
    })

    if (isFirefox) {
      style.width = `${(parseInt(computed.width) - 2)}px`
      if (element.scrollHeight > parseInt(computed.height))
        style.overflowY = 'scroll'
    } else {
      style.overflow = 'hidden'
    }

    div.textContent = element.value.substring(0, position);

    if (element.nodeName === 'INPUT') {
      div.textContent = div.textContent.replace(/\s/g, '\u00a0')
    }

    var span = document.createElement('span');
    span.textContent = element.value.substring(position) || '.'
    div.appendChild(span)

    var coordinates = {
      top: span.offsetTop + parseInt(computed.borderTopWidth) + parseInt(computed.fontSize),
      left: span.offsetLeft + parseInt(computed.borderLeftWidth)
    }

    this.localToGlobalCoordinates(element, coordinates)

    document.body.removeChild(div)

    return coordinates
  }

  getContentEditableCaretPosition(selectedNodePosition) {
    var markerTextChar = '\ufeff'
    var markerEl, markerId = `sel_${new Date().getTime()}_${Math.random().toString().substr(2)}`

    var range
    var sel = this.getWindowSelection()
    var prevRange = sel.getRangeAt(0)
    range = document.createRange()

    range.setStart(sel.anchorNode, selectedNodePosition)
    range.setEnd(sel.anchorNode, selectedNodePosition)

    range.collapse(false)

    // Create the marker element containing a single invisible character using DOM methods and insert it
    markerEl = document.createElement('span')
    markerEl.id = markerId
    markerEl.appendChild(document.createTextNode(markerTextChar))
    range.insertNode(markerEl)
    sel.removeAllRanges()
    sel.addRange(prevRange)

    var coordinates = {
      left: 0,
      top: markerEl.offsetHeight
    }

    this.localToGlobalCoordinates(markerEl, coordinates);

    markerEl.parentNode.removeChild(markerEl);
    return coordinates;
  }

  scrollIntoView(elem) {
    // cheap hack in px - need to check styles relative to the element
    var reasonableBuffer = 20
    var maxScrollDisplacement = 100
    var clientRect
    var e = elem[0]

    while (clientRect === undefined || clientRect.height === 0) {
      clientRect = e.getBoundingClientRect()

      if (clientRect.height === 0) {
        e = e.childNodes[0]
        if (e === undefined || !e.getBoundingClientRect) {
          return
        }
      }
    }

    var elemTop = clientRect.top
    var elemBottom = elemTop + clientRect.height

    if (elemTop < 0) {
      window.scrollTo(0, window.pageYOffset + clientRect.top - reasonableBuffer)
    } else if (elemBottom > $window.innerHeight) {
      var maxY = window.pageYOffset + clientRect.top - reasonableBuffer

      if (maxY - window.pageYOffset > maxScrollDisplacement) {
        maxY = window.pageYOffset + maxScrollDisplacement
      }

      var targetY = $window.pageYOffset - (window.innerHeight - elemBottom)

      if (targetY > maxY) {
        targetY = maxY
      }

      window.scrollTo(0, targetY)
    }
  }

}
