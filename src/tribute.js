if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
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
  class Tribute {
    constructor({values=null, trigger='@', selectCallback=null, lookup='key', fillAttr='value', collection=null}) {
      this.expando = this.menuSelected = 0
      this.instance = this.uuid()
      this.current = {}
      this.isActive = false

      if (values) {
        this.collection = [{
          // symbol that starts the lookup
          trigger: trigger || '@',

          iframe: null,

          // function called on select that retuns the content to insert
          selectCallback: (selectCallback || Tribute.defaultSelectCallback).bind(this),

          // column to search against in the object
          lookup: lookup || 'key',

          // column that contains the content to insert by default
          fillAttr: fillAttr || 'value',

          // array of objects
          values: values
        }]
      } else if (collection) {
        this.collection = collection.map(item => {
          return {
            trigger: item.trigger || '@',
            iframe: item.iframe || null,
            selectCallback: (item.selectCallback || Tribute.defaultSelectCallback).bind(this),
            lookup: item.lookup || 'key',
            fillAttr: item.fillAttr || 'value',
            values: item.values
          }
        })
      } else {
        throw new Error('collection', 'No collection specified.')
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
      if (element.hasAttribute('data-tribute')) {
        throw new Error('tribute', 'already bound to ' + element.nodeName)
      }

      element.setAttribute('data-tribute', this.uuid())
      this.ensureEditable(element)
      this.events.bind(element)
    }

    ensureEditable(element) {
      if (Tribute.inputTypes().indexOf(element.nodeName) === -1) {
        if (element.contentEditable) {
          element.contentEditable = true
        } else {
          throw new Error('attach', 'Cannot bind to ' + element.nodeName)
        }
      }
    }

    createMenu() {
      let wrapper = this.range.getDocument().createElement('div'),
          ul = this.range.getDocument().createElement('ul')

      wrapper.className = 'tribute-container'
      wrapper.appendChild(ul)
      return this.range.getDocument().body.appendChild(wrapper)
    }

    showMenuFor(element, collectionItem) {
      let items
      // create the menu if it doesn't exist.
      if (!this.menu) {
        this.menu = this.createMenu()
        this.menuEvents.bind(this.menu)
      }

      this.isActive = true
      this.menuSelected = 0

      items = this.search.filter(this.current.mentionText, this.current.collection.values, {
        pre: '<span>',
        post: '</span>',
        extract: (el) => {
          return el[this.current.collection.lookup]
        }
      })

      this.current.filteredItems = items

      let ul = this.menu.querySelector('ul')

      ul.innerHTML = ''

      items.forEach((item, index) => {
        let li = this.range.getDocument().createElement('li')
        li.setAttribute('data-index', index)
        if (this.menuSelected === index) {
          li.className = 'highlight'
        }
        li.innerHTML = item.string
        ul.appendChild(li)
      })

      this.range.positionMenuAtCaret()

    }

    hideMenu() {
      if (this.menu) {
        this.menu.style.cssText = 'display: none;'
        this.isActive = false
        this.menuSelected = 0
        this.current = {}
      }
    }

    selectItemAtIndex(index) {
      let item = this.current.collection.values[index]
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
      this.tribute.range.getDocument().addEventListener('click',
        this.tribute.events.click.bind(null, this), false)
      window.addEventListener('resize', this.debounce(() => {
        if (this.tribute.isActive) {
          this.tribute.showMenuFor(this.tribute.current.element)
        }
      }, 300, false))
    }

    debounce(func, wait, immediate) {
      var timeout
      return () => {
        var context = this, args = arguments
        var later = () => {
          timeout = null
          if (!immediate) func.apply(context, args)
        }
        var callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
      }
    }
  }

  class TributeEvents {
    constructor(tribute) {
      this.tribute = tribute
      this.tribute.events = this
    }

    static keys() {
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
      }]
    }

    bind(element) {
      element.addEventListener('keydown',
        this.keydown.bind(element, this), false)
      element.addEventListener('keyup',
        this.keyup.bind(element, this), false)
    }

    // Google chrome retardedness
    static getKeyCode(event) {
      let keyCode

      if (event.key) {
        return event.key.charCodeAt(0)
      }

      if (event.keyIdentifier) {
        return parseInt(event.keyIdentifier.substr(2), 16)
      }

      return event.keyCode
    }

    keydown(instance, event) {
      let element = this
      instance.commandEvent = false

      TributeEvents.keys().forEach(o => {
        if (o.key === event.keyCode) {
          instance.commandEvent = true
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

      if (instance.tribute.current.trigger && instance.commandEvent === false) {
        instance.tribute.showMenuFor(this)
      }
    }

    updateSelection(el) {
      this.tribute.current.element = el
      let info = this.tribute.range.getTriggerInfo(false, false, true)

      if (info) {
        this.tribute.current.selectedPath = info.mentionSelectedPath
        this.tribute.current.mentionText = info.mentionText
        this.tribute.current.selectedOffset = info.mentionSelectedOffset
      }
    }

    callbacks() {
      return {
        triggerChar: (e, el, trigger) => {
          let tribute = this.tribute
          tribute.current.trigger = trigger

          let collectionItem = tribute.collection.find(item => {
            return item.trigger === trigger
          })

          tribute.current.collection = collectionItem

          tribute.showMenuFor(el)
        },
        enter: (e, el) => {
          // choose selection
          if (this.tribute.isActive) {
            e.preventDefault()
            setTimeout(() => {
              this.tribute.selectItemAtIndex(this.tribute.menuSelected)
              this.tribute.hideMenu()
            }, 0)
          }
        },
        escape: (e, el) => {
          if (this.tribute.isActive) {
            e.preventDefault()
            this.tribute.hideMenu()
          }
        },
        tab: (e, el) => {
          // choose first match
          this.callbacks().enter(e, el)
        },
        up: (e, el) => {
          // navigate up ul
          if (this.tribute.isActive) {
            e.preventDefault()
            let count = this.tribute.current.filteredItems.length,
              selected = this.tribute.menuSelected

            if (count > selected && selected > 0) {
              this.tribute.menuSelected--
                this.setActiveLi()
            }
          }
        },
        down: (e, el) => {
          // navigate down ul
          if (this.tribute.isActive) {
            e.preventDefault()
            let count = this.tribute.current.filteredItems.length - 1,
              selected = this.tribute.menuSelected

            if (count > this.tribute.menuSelected) {
              this.tribute.menuSelected++
                this.setActiveLi()
            }
          }
        }
      }
    }

    setActiveLi(index) {
      let lis = this.tribute.menu.querySelectorAll('li'),
        length = lis.length

      for (let i = 0; i < length; i++) {
        let li = lis[i]
        if (i === this.tribute.menuSelected) {
          li.className = 'highlight'
        } else {
          li.className = ''
        }
      }
    }

  }

  // Thanks to https://github.com/jeff-collins/ment.io
  class TributeRange {
    constructor(tribute) {
      this.tribute = tribute
      this.tribute.range = this
    }

    getDocument() {
      let iframe
      if (this.tribute.current.collection) {
        iframe = this.tribute.current.collection.iframe
      }

      if (!iframe) {
        return document
      }

      return iframe.contentWindow.document
    }

    positionMenuAtCaret() {
      let context = this.tribute.current,
        coordinates
      let info = this.getTriggerInfo(false, false, true)

      if (info !== undefined) {
        if (!this.isContentEditable(context.element)) {
          coordinates = this.getTextAreaOrInputUnderlinePosition(this.getDocument().activeElement,
            info.mentionPosition)
        } else {
          coordinates = this.getContentEditableCaretPosition(info.mentionPosition)
        }

        // Move the button into place.
        this.tribute.menu.style.cssText = `top: ${coordinates.top}px;
                                           left: ${coordinates.left}px;
                                           position: absolute;
                                           zIndex: 10000;
                                           display: block;`

        setTimeout(() => {
          this.scrollIntoView(this.getDocument().activeElement)
        }, 0)
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

      range = this.getDocument().createRange()
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
        if (targetElement !== this.getDocument().activeElement) {
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
          let myField = this.getDocument().activeElement
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
      let range, sel
      sel = this.getWindowSelection()
      range = this.getDocument().createRange()
      range.setStart(sel.anchorNode, startPos)
      range.setEnd(sel.anchorNode, endPos)
      range.deleteContents()

      let el = this.getDocument().createElement('div')
      el.innerHTML = html
      let frag = this.getDocument().createDocumentFragment(),
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
        let textComponent = this.getDocument().activeElement
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
        selected = this.getDocument().activeElement
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

      while (obj !== this.getDocument().body) {
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

      let div = this.getDocument().createElement('div')
      div.id = 'input-textarea-caret-position-mirror-div'
      this.getDocument().body.appendChild(div)

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

      div.textContent = element.value.substring(0, position)

      if (element.nodeName === 'INPUT') {
        div.textContent = div.textContent.replace(/\s/g, '\u00a0')
      }

      let span = this.getDocument().createElement('span')
      span.textContent = element.value.substring(position) || '.'
      div.appendChild(span)

      let coordinates = {
        top: span.offsetTop + parseInt(computed.borderTopWidth) + parseInt(computed.fontSize),
        left: span.offsetLeft + parseInt(computed.borderLeftWidth)
      }

      this.localToGlobalCoordinates(element, coordinates)

      this.getDocument().body.removeChild(div)

      return coordinates
    }

    getContentEditableCaretPosition(selectedNodePosition) {
      let markerTextChar = '\ufeff'
      let markerEl, markerId = `sel_${new Date().getTime()}_${Math.random().toString().substr(2)}`
      let range
      let sel = this.getWindowSelection()
      let prevRange = sel.getRangeAt(0)

      range = this.getDocument().createRange()
      range.setStart(sel.anchorNode, selectedNodePosition)
      range.setEnd(sel.anchorNode, selectedNodePosition)

      range.collapse(false)

      // Create the marker element containing a single invisible character using DOM methods and insert it
      markerEl = this.getDocument().createElement('span')
      markerEl.id = markerId
      markerEl.appendChild(this.getDocument().createTextNode(markerTextChar))
      range.insertNode(markerEl)
      sel.removeAllRanges()
      sel.addRange(prevRange)

      let coordinates = {
        left: 0,
        top: markerEl.offsetHeight
      }

      this.localToGlobalCoordinates(markerEl, coordinates)

      markerEl.parentNode.removeChild(markerEl)
      return coordinates
    }

    scrollIntoView(elem) {
      // cheap hack in px - need to check styles relative to the element
      let reasonableBuffer = 20
      let maxScrollDisplacement = 100
      let clientRect
      let e = elem

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
      } else if (elemBottom > window.innerHeight) {
        let maxY = window.pageYOffset + clientRect.top - reasonableBuffer

        if (maxY - window.pageYOffset > maxScrollDisplacement) {
          maxY = window.pageYOffset + maxScrollDisplacement
        }

        let targetY = window.pageYOffset - (window.innerHeight - elemBottom)

        if (targetY > maxY) {
          targetY = maxY
        }

        window.scrollTo(0, targetY)
      }
    }

  }

  // Thanks to https://github.com/mattyork/fuzzy
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
          compareString = opts.caseSensitive && string || string.toLowerCase(),
          ch, compareChar

      pattern = opts.caseSensitive && pattern || pattern.toLowerCase()

      let patternCache = this.traverse(compareString, pattern, 0, 0, [])
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

        // calculate socre and copy the cache containing the indices where it's found
        return {
          score: this.calculateScore(patternCache),
          cache: patternCache.slice()
        }
      }

      // if string at end or remaining pattern > remaining string
      if (string.length === stringIndex || pattern.length - patternIndex > string.length - stringIndex) {
        return undefined
      }

      let c = pattern[patternIndex]
      let index = string.indexOf(c, stringIndex)
      let best, temp

      while (index > -1) {
        patternCache.push(index)
        temp = this.traverse(string, pattern, index + 1, patternIndex + 1, patternCache)
        patternCache.pop()

        // if downstream traversal failed, return best answer so far
        if (!temp) {
          return best
        }

        if (!best || best.score < temp.score) {
          best = temp
        }

        index = string.indexOf(c, index + 1)
      }

      return best
    }

    calculateScore(patternCache) {
      let score = 0
      let temp = 1

      patternCache.forEach((index, i) => {
        if (i > 0) {
          if (patternCache[i - 1] + 1 === index) {
            temp += temp + 1
          } else {
            temp = 1
          }
        }

        score += temp
      })

      return score
    }

    render(string, indices, pre, post) {
      var rendered = string.substring(0, indices[0])

      indices.forEach((index, i) => {
        rendered += pre + string[index] + post +
          string.substring(index + 1, (indices[i + 1]) ? indices[i + 1] : string.length)
      })

      return rendered
    }

    filter(pattern, arr, opts) {
      opts = opts || {}
      return arr
        .reduce((prev, element, idx, arr) => {
          let str = element

          if (opts.extract) {
            str = opts.extract(element)

            if (!str) { // take care of undefineds / nulls / etc.
              str = ''
            }
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

  window.Tribute = Tribute
}
