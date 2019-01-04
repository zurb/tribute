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

    positionMenuAtCaret(scrollTo) {
        let context = this.tribute.current,
            coordinates

        let info = this.getTriggerInfo(false, this.tribute.hasTrailingSpace, true, this.tribute.allowSpaces)

        if (typeof info !== 'undefined') {

            if(!this.tribute.positionMenu){
                this.tribute.menu.style.cssText = `display: block;`
                return
            }

            if (!this.isContentEditable(context.element)) {
                coordinates = this.getTextAreaOrInputUnderlinePosition(this.tribute.current.element,
                    info.mentionPosition)
            }
            else {
                coordinates = this.getContentEditableCaretPosition(info.mentionPosition)
            }


            this.tribute.menu.style.cssText = `top: ${coordinates.top}px;
                                     left: ${coordinates.left}px;
                                     right: ${coordinates.right}px;
                                     bottom: ${coordinates.bottom}px;
                                     position: absolute;
                                     zIndex: 10000;
                                     display: block;`

            if (coordinates.left === 'auto') {
                this.tribute.menu.style.left = 'auto'
            }

            if (coordinates.top === 'auto') {
                this.tribute.menu.style.top = 'auto'
            }

            if (scrollTo) this.scrollIntoView()

            window.setTimeout(() => {
                let menuDimensions = {
                   width: this.tribute.menu.offsetWidth,
                   height: this.tribute.menu.offsetHeight
                }
                let menuIsOffScreen = this.isMenuOffScreen(coordinates, menuDimensions)

                let menuIsOffScreenHorizontally = window.innerWidth > menuDimensions.width && (menuIsOffScreen.left || menuIsOffScreen.right)
                let menuIsOffScreenVertically = window.innerHeight > menuDimensions.height && (menuIsOffScreen.top || menuIsOffScreen.bottom)
                if (menuIsOffScreenHorizontally || menuIsOffScreenVertically) {
                    this.tribute.menu.style.cssText = 'display: none'
                    this.positionMenuAtCaret(scrollTo)
                }
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
        if (!this.isContentEditable(targetElement)) {
            if (targetElement !== this.tribute.current.element) {
                targetElement.focus()
            }
        } else {
            this.selectElement(targetElement, path, offset)
        }
    }

    replaceTriggerText(text, requireLeadingSpace, hasTrailingSpace, originalEvent, item) {
        let context = this.tribute.current
        this.resetSelection(context.element, context.selectedPath, context.selectedOffset)

        let info = this.getTriggerInfo(true, hasTrailingSpace, requireLeadingSpace, this.tribute.allowSpaces)

        // Create the event
        let replaceEvent = new CustomEvent('tribute-replaced', {
            detail: {
                item: item,
                event: originalEvent
            }
        })

        if (info !== undefined) {
            if (!this.isContentEditable(context.element)) {
                let myField = this.tribute.current.element
                let textSuffix = typeof this.tribute.replaceTextSuffix == 'string'
                    ? this.tribute.replaceTextSuffix
                    : ' '
                text += textSuffix
                let startPos = info.mentionPosition
                let endPos = info.mentionPosition + info.mentionText.length + textSuffix.length
                myField.value = myField.value.substring(0, startPos) + text +
                    myField.value.substring(endPos, myField.value.length)
                myField.selectionStart = startPos + text.length
                myField.selectionEnd = startPos + text.length
            } else {
                // add a space to the end of the pasted text
                let textSuffix = typeof this.tribute.replaceTextSuffix == 'string'
                    ? this.tribute.replaceTextSuffix
                    : '\xA0'
                text += textSuffix
                this.pasteHtml(text, info.mentionPosition,
                    info.mentionPosition + info.mentionText.length + 1)
            }

            context.element.dispatchEvent(replaceEvent)
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
            let node = element.parentNode.childNodes[i]

            if (node === element) {
                return i
            }
        }
    }

    getContentEditableSelectedPath(ctx) {
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
        let context = this.tribute.current,
            text = ''

        if (!this.isContentEditable(context.element)) {
            let textComponent = this.tribute.current.element;
            if (textComponent) {
                let startPos = textComponent.selectionStart
                if (textComponent.value && startPos >= 0) {
                    text = textComponent.value.substring(0, startPos)
                }
            }

        } else {
            let selectedElem = this.getWindowSelection().anchorNode

            if (selectedElem != null) {
                let workingNodeContent = selectedElem.textContent
                let selectStartOffset = this.getWindowSelection().getRangeAt(0).startOffset

                if (workingNodeContent && selectStartOffset >= 0) {
                    text = workingNodeContent.substring(0, selectStartOffset)
                }
            }
        }

        return text
    }

    getTriggerInfo(menuAlreadyActive, hasTrailingSpace, requireLeadingSpace, allowSpaces) {
        let ctx = this.tribute.current
        let selected, path, offset

        if (!this.isContentEditable(ctx.element)) {
            selected = this.tribute.current.element
        } else {
            let selectionInfo = this.getContentEditableSelectedPath(ctx)

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

            this.tribute.collection.forEach(config => {
                let c = config.trigger
                let idx = config.requireLeadingSpace ?
                    this.lastIndexWithLeadingSpace(effectiveRange, c) :
                    effectiveRange.lastIndexOf(c)

                if (idx > mostRecentTriggerCharPos) {
                    mostRecentTriggerCharPos = idx
                    triggerChar = c
                    requireLeadingSpace = config.requireLeadingSpace
                }
            })

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

    lastIndexWithLeadingSpace (str, char) {
        let reversedStr = str.split('').reverse().join('')
        let index = -1

        for (let cidx = 0, len = str.length; cidx < len; cidx++) {
            let firstChar = cidx === str.length - 1
            let leadingSpace = /\s/.test(reversedStr[cidx + 1])
            let match = char === reversedStr[cidx]

            if (match && (firstChar || leadingSpace)) {
                index = str.length - 1 - cidx
                break
            }
        }

        return index
    }

    isContentEditable(element) {
        return element.nodeName !== 'INPUT' && element.nodeName !== 'TEXTAREA'
    }

    isMenuOffScreen(coordinates, menuDimensions) {
        let windowWidth = window.innerWidth
        let windowHeight = window.innerHeight
        let doc = document.documentElement
        let windowLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
        let windowTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)

        let menuTop = typeof coordinates.top === 'number' ? coordinates.top : windowTop + windowHeight - coordinates.bottom - menuDimensions.height
        let menuRight = typeof coordinates.right === 'number' ? coordinates.right : coordinates.left + menuDimensions.width
        let menuBottom = typeof coordinates.bottom === 'number' ? coordinates.bottom : coordinates.top + menuDimensions.height
        let menuLeft = typeof coordinates.left === 'number' ? coordinates.left : windowLeft + windowWidth - coordinates.right - menuDimensions.width

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
        }

        this.tribute.menu.style.cssText = `top: 0px;
                                 left: 0px;
                                 position: fixed;
                                 zIndex: 10000;
                                 display: block;
                                 visibility; hidden;`
       dimensions.width = this.tribute.menu.offsetWidth
       dimensions.height = this.tribute.menu.offsetHeight

       this.tribute.menu.style.cssText = `display: none;`

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
            div.textContent = div.textContent.replace(/\s/g, ' ')
        }

        let span = this.getDocument().createElement('span')
        span.textContent = element.value.substring(position) || '.'
        div.appendChild(span)

        let rect = element.getBoundingClientRect()
        let doc = document.documentElement
        let windowLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
        let windowTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)

        let coordinates = {
            top: rect.top + windowTop + span.offsetTop + parseInt(computed.borderTopWidth) + parseInt(computed.fontSize) - element.scrollTop,
            left: rect.left + windowLeft + span.offsetLeft + parseInt(computed.borderLeftWidth)
        }

        let windowWidth = window.innerWidth
        let windowHeight = window.innerHeight

        let menuDimensions = this.getMenuDimensions()
        let menuIsOffScreen = this.isMenuOffScreen(coordinates, menuDimensions)

        if (menuIsOffScreen.right) {
            coordinates.right = windowWidth - coordinates.left
            coordinates.left = 'auto'
        }

        let parentHeight = this.tribute.menuContainer
            ? this.tribute.menuContainer.offsetHeight
            : this.getDocument().body.offsetHeight

        if (menuIsOffScreen.bottom) {
            let parentRect = this.tribute.menuContainer
                ? this.tribute.menuContainer.getBoundingClientRect()
                : this.getDocument().body.getBoundingClientRect()
            let scrollStillAvailable = parentHeight - (windowHeight - parentRect.top)

            coordinates.bottom = scrollStillAvailable + (windowHeight - rect.top - span.offsetTop)
            coordinates.top = 'auto'
        }

        menuIsOffScreen = this.isMenuOffScreen(coordinates, menuDimensions)
        if (menuIsOffScreen.left) {
            coordinates.left = windowWidth > menuDimensions.width
                ? windowLeft + windowWidth - menuDimensions.width
                : windowLeft
            delete coordinates.right
        }
        if (menuIsOffScreen.top) {
            coordinates.top = windowHeight > menuDimensions.height
                ? windowTop + windowHeight - menuDimensions.height
                : windowTop
            delete coordinates.bottom
        }

        this.getDocument().body.removeChild(div)
        return coordinates
    }

    getContentEditableCaretPosition(selectedNodePosition) {
        let markerTextChar = '﻿'
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

        let rect = markerEl.getBoundingClientRect()
        let doc = document.documentElement
        let windowLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
        let windowTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
        let coordinates = {
            left: rect.left + windowLeft,
            top: rect.top + markerEl.offsetHeight + windowTop
        }
        let windowWidth = window.innerWidth
        let windowHeight = window.innerHeight

        let menuDimensions = this.getMenuDimensions()
        let menuIsOffScreen = this.isMenuOffScreen(coordinates, menuDimensions)

        if (menuIsOffScreen.right) {
            coordinates.left = 'auto'
            coordinates.right = windowWidth - rect.left - windowLeft
        }

        let parentHeight = this.tribute.menuContainer
            ? this.tribute.menuContainer.offsetHeight
            : this.getDocument().body.offsetHeight

        if (menuIsOffScreen.bottom) {
            let parentRect = this.tribute.menuContainer
                ? this.tribute.menuContainer.getBoundingClientRect()
                : this.getDocument().body.getBoundingClientRect()
            let scrollStillAvailable = parentHeight - (windowHeight - parentRect.top)

            coordinates.top = 'auto'
            coordinates.bottom = scrollStillAvailable + (windowHeight - rect.top)
        }

        menuIsOffScreen = this.isMenuOffScreen(coordinates, menuDimensions)
        if (menuIsOffScreen.left) {
            coordinates.left = windowWidth > menuDimensions.width
                ? windowLeft + windowWidth - menuDimensions.width
                : windowLeft
            delete coordinates.right
        }
        if (menuIsOffScreen.top) {
            coordinates.top = windowHeight > menuDimensions.height
                ? windowTop + windowHeight - menuDimensions.height
                : windowTop
            delete coordinates.bottom
        }

        markerEl.parentNode.removeChild(markerEl)
        return coordinates
    }

    scrollIntoView(elem) {
        let reasonableBuffer = 20,
            clientRect
        let maxScrollDisplacement = 100
        let e = this.menu

        if (typeof e === 'undefined') return;

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


export default TributeRange;
