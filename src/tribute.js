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

        // The function that gets call on select that retuns the content to insert
        selectCallback: options.selectCallback || Tribute.defaultSelectCallback.bind(this),

        // the column to search against in the object
        lookup: options.lookup || 'key',

        // the column that contains the content to insert by default
        fillAttr: options.fillAttr || 'value',

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
    new TributeSearch(this)
  }

  static defaultSelectCallback(item) {
    return `@${item[this.current.collection.fillAttr]}`
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

    this.current.collection = collectionItem

    this.range.positionMenuAtCaret()

  }

  hideMenu() {
    if (this.menu) {
      this.menu.style.cssText = 'display: none;'

      this.current = {}
      console.log('unsetCurrent')
    }
  }

  selectItemAtIndex(index) {
    let item = this.current.collection.values[index];
    let content = this.current.collection.selectCallback(item)

    this.replaceText(content)
  }

  replaceText(content) {
    this.range.replaceTriggerText(content, true, true)
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
      let li = event.target
      tribute.selectItemAtIndex(li.getAttribute('data-index'))
      tribute.hideMenu()
    } else if (tribute.current.element) {
      tribute.hideMenu()
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
    instance.updateSelection(this)
    let trigger = instance.tribute.triggers().find(trigger => {
      return trigger.charCodeAt(0) === keyCode
    })

    if (typeof trigger !== 'undefined') {
      instance.callbacks().triggerChar(event, this, trigger)
    }
  }

  updateSelection(el) {
    this.tribute.current.element = el
    let info = this.tribute.range.getTriggerInfo(false, false, true)
    this.tribute.current.selectedPath = info.mentionSelectedPath
    this.tribute.current.selectedOffset = info.mentionSelectedOffset
  }

  callbacks() {
    return Object.assign({}, this.tribute.globalCallbacks, {
      triggerChar: (e, el, trigger) => {
        if (!this.tribute.current.selectedPath) return
        this.tribute.current.trigger = trigger

        let collectionItem = this.tribute.collection.find(item => {
          return item.trigger = trigger
        })

        this.tribute.showMenuFor(el, collectionItem)
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
    let context = this.tribute.current,
      coordinates
    let info = this.getTriggerInfo(false, false, true)

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

  selectElement(targetElement, path, offset) {
    let range
    let elem = targetElement

    if (path) {
      for (var i = 0; i < path.length; i++) {
        elem = elem.childNodes[path[i]]
        if (elem === undefined) {
          return
        }
        while (elem.length < offset) {
          offset -= elem.length
          elem = elem.nextSibling
        }
        if (elem.childNodes.length === 0 && !elem.length) {
          elem = elem.previousSibling
        }
      }
    }
    let sel = this.getWindowSelection()

    range = document.createRange()
    range.setStart(elem, offset)
    range.setEnd(elem, offset)
    range.collapse(true)

    try {
      sel.removeAllRanges()
    } catch (error) {}

    sel.addRange(range)
    targetElement.focus()
  }

  resetSelection(targetElement, path, offset) {
    let nodeName = targetElement.nodeName

    if (nodeName === 'INPUT' || nodeName === 'TEXTAREA') {
      if (targetElement !== document.activeElement) {
        targetElement.focus()
      }
    } else {
      this.selectElement(targetElement, path, offset)
    }
  }

  replaceTriggerText(text, requireLeadingSpace, hasTrailingSpace) {
    let context = this.tribute.current
    this.resetSelection(context.element, context.selectedPath, context.selectedOffset)

    let info = this.getTriggerInfo(requireLeadingSpace, true, hasTrailingSpace)

    if (info !== undefined) {
      if (!this.isContentEditable(context.element)) {
        let myField = document.activeElement
        text += ' '
        let startPos = info.mentionPosition
        let endPos = info.mentionPosition + info.mentionText.length + 1
        myField.value = myField.value.substring(0, startPos) + text +
          myField.value.substring(endPos, myField.value.length)
        myField.selectionStart = startPos + text.length
        myField.selectionEnd = startPos + text.length
      } else {
        // add a space to the end of the pasted text
        text += '\xA0'
        this.pasteHtml(text, info.mentionPosition,
          info.mentionPosition + info.mentionText.length + 1)
      }
    }
  }

  pasteHtml(html, startPos, endPos) {
    var range, sel
    sel = this.getWindowSelection()
    range = document.createRange()
    range.setStart(sel.anchorNode, startPos)
    range.setEnd(sel.anchorNode, endPos)
    range.deleteContents()

    var el = document.createElement('div')
    el.innerHTML = html
    var frag = document.createDocumentFragment(),
      node, lastNode
    while ((node = el.firstChild)) {
      lastNode = frag.appendChild(node)
    }
    range.insertNode(frag)

    // Preserve the selection
    if (lastNode) {
      range = range.cloneRange()
      range.setStartAfter(lastNode)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
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
      let node = element.parentNode.childNodes[i]

      if (node === element) {
        return i
      }
    }
  }

  getContentEditableSelectedPath() {
    // content editable
    let sel = this.getWindowSelection()
    let selected = sel.anchorNode
    let path = []
    let offset

    if (selected != null) {
      let i
      let ce = selected.contentEditable
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
      console.log('offset', offset)
      return {
        selected: selected,
        path: path,
        offset: offset
      }
    }
  }

  getTextPrecedingCurrentSelection() {
    let context = this.tribute.current
    let text

    if (!this.isContentEditable(context.element)) {
      let textComponent = document.activeElement
      let startPos = textComponent.selectionStart
      text = textComponent.value.substring(0, startPos)

    } else {
      let selectedElem = this.getWindowSelection().anchorNode

      if (selectedElem != null) {
        let workingNodeContent = selectedElem.textContent
        let selectStartOffset = this.getWindowSelection().getRangeAt(0).startOffset

        if (selectStartOffset >= 0) {
          text = workingNodeContent.substring(0, selectStartOffset)
        }
      }
    }
    return text
  }

  getTriggerInfo(menuAlreadyActive, hasTrailingSpace, requireLeadingSpace) {
    let ctx = this.tribute.current
    let selected, path, offset

    if (!this.isContentEditable(ctx.element)) {
      selected = document.activeElement
    } else {
      // content editable
      let selectionInfo = this.getContentEditableSelectedPath()

      if (selectionInfo) {
        selected = selectionInfo.selected
        path = selectionInfo.path
        offset = selectionInfo.offset
      }
    }

    let effectiveRange = this.getTextPrecedingCurrentSelection()

    if (effectiveRange !== undefined && effectiveRange !== null) {
      let mostRecentTriggerCharPos = -1
      let triggerChar

      this.tribute.triggers().forEach(c => {
        let idx = effectiveRange.lastIndexOf(c)

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
        let currentTriggerSnippet = effectiveRange.substring(mostRecentTriggerCharPos + 1,
          effectiveRange.length)

        triggerChar = effectiveRange.substring(mostRecentTriggerCharPos, mostRecentTriggerCharPos + 1)
        let firstSnippetChar = currentTriggerSnippet.substring(0, 1)
        let leadingSpace = currentTriggerSnippet.length > 0 &&
          (
            firstSnippetChar === ' ' ||
            firstSnippetChar === '\xA0'
          )
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

  isContentEditable(element) {
    return element.nodeName !== 'INPUT' && element.nodeName !== 'TEXTAREA'
  }

  localToGlobalCoordinates(element, coordinates) {
    let obj = element
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
    let properties = [
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

    let isFirefox = (window.mozInnerScreenX !== null)

    let div = document.createElement('div')
    div.id = 'input-textarea-caret-position-mirror-div'
    document.body.appendChild(div)

    let style = div.style
    let computed = window.getComputedStyle ? getComputedStyle(element) : element.currentStyle

    style.whiteSpace = 'pre-wrap'
    if (element.nodeName !== 'INPUT') {
      style.wordWrap = 'break-word'
    }

    // position off-screen
    style.position = 'absolute'
    style.visibility = 'hidden'

    // transfer the element's properties to the div
    properties.forEach(prop => {
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

    let span = document.createElement('span');
    span.textContent = element.value.substring(position) || '.'
    div.appendChild(span)

    let coordinates = {
      top: span.offsetTop + parseInt(computed.borderTopWidth) + parseInt(computed.fontSize),
      left: span.offsetLeft + parseInt(computed.borderLeftWidth)
    }

    this.localToGlobalCoordinates(element, coordinates)

    document.body.removeChild(div)

    return coordinates
  }

  getContentEditableCaretPosition(selectedNodePosition) {
    let markerTextChar = '\ufeff'
    let markerEl, markerId = `sel_${new Date().getTime()}_${Math.random().toString().substr(2)}`
    let range
    let sel = this.getWindowSelection()
    let prevRange = sel.getRangeAt(0)

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

    let coordinates = {
      left: 0,
      top: markerEl.offsetHeight
    }

    this.localToGlobalCoordinates(markerEl, coordinates);

    markerEl.parentNode.removeChild(markerEl);
    return coordinates;
  }

  scrollIntoView(elem) {
    // cheap hack in px - need to check styles relative to the element
    let reasonableBuffer = 20
    let maxScrollDisplacement = 100
    let clientRect
    let e = elem[0]

    while (clientRect === undefined || clientRect.height === 0) {
      clientRect = e.getBoundingClientRect()

      if (clientRect.height === 0) {
        e = e.childNodes[0]
        if (e === undefined || !e.getBoundingClientRect) {
          return
        }
      }
    }

    let elemTop = clientRect.top
    let elemBottom = elemTop + clientRect.height

    if (elemTop < 0) {
      window.scrollTo(0, window.pageYOffset + clientRect.top - reasonableBuffer)
    } else if (elemBottom > $window.innerHeight) {
      let maxY = window.pageYOffset + clientRect.top - reasonableBuffer

      if (maxY - window.pageYOffset > maxScrollDisplacement) {
        maxY = window.pageYOffset + maxScrollDisplacement
      }

      let targetY = $window.pageYOffset - (window.innerHeight - elemBottom)

      if (targetY > maxY) {
        targetY = maxY
      }

      window.scrollTo(0, targetY)
    }
  }

}

class TributeSearch {
  constructor(tribute) {
    this.tribute = tribute
    this.tribute.search = this
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
    opts = opts || {}
    let patternIdx = 0,
      result = [],
      len = string.length,
      totalScore = 0,
      currScore = 0,
      pre = opts.pre || '',
      post = opts.post || '',
      // String to compare against. This might be a lowercase version of the
      // raw string
      compareString = opts.caseSensitive && string || string.toLowerCase(),
      ch, compareChar

    pattern = opts.caseSensitive && pattern || pattern.toLowerCase()

    // For each character in the string, either add it to the result
    // or wrap in template if it's the next string in the pattern
    for (var idx = 0; idx < len; idx++) {
      ch = string[idx]
      if (compareString[idx] === pattern[patternIdx]) {
        ch = pre + ch + post
        patternIdx += 1

        // consecutive characters should increase the score more than linearly
        currScore += 1 + currScore
      } else {
        currScore = 0
      }
      totalScore += currScore
      result[result.length] = ch
    }

    // return rendered string if we have a match for every char
    if (patternIdx === pattern.length) {
      return {
        rendered: result.join(''),
        score: totalScore
      }
    }

    return null
  }

  filter(pattern, arr, opts) {
    if (!arr || arr.length === 0) {
      return []
    }

    if (typeof pattern !== 'string') {
      return arr
    }

    opts = opts || {}

    return arr.reduce((prev, element, idx, arr) => {
      let str = element

      if (opts.extract) {
        str = opts.extract(element)
      }

      let rendered = this.match(pattern, str, opts)

      if (rendered != null) {
        prev[prev.length] = {
          string: rendered.rendered,
          score: rendered.score,
          index: idx,
          original: element
        }
      }

      return prev
    }, [])

    // Sort by score. Browsers are inconsistent wrt stable/unstable
    // sorting, so force stable by using the index in the case of tie.
    // See http://ofb.net/~sethml/is-sort-stable.html
    .sort((a, b) => {
      let compare = b.score - a.score
      if (compare) return compare
      return a.index - b.index
    })
  }
}
