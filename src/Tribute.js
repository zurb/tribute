import "./utils";
import TributeEvents from "./TributeEvents";
import TributeMenuEvents from "./TributeMenuEvents";
import TributeRange from "./TributeRange";
import TributeSearch from "./TributeSearch";

class Tribute {
    constructor({
        values = null,
        iframe = null,
        selectClass = 'highlight',
        trigger = '@',
        selectTemplate = null,
        menuItemTemplate = null,
        lookup = 'key',
        fillAttr = 'value',
        collection = null,
        menuContainer = null,
        noMatchTemplate = null,
        requireLeadingSpace = true,
        allowSpaces = false,
    }) {

        this.menuSelected = 0
        this.current = {}
        this.inputEvent = false
        this.isActive = false
        this.menuContainer = menuContainer
        this.allowSpaces = allowSpaces

        if (values) {
            this.collection = [{
                // symbol that starts the lookup
                trigger: trigger,

                iframe: iframe,

                selectClass: selectClass,

                // function called on select that retuns the content to insert
                selectTemplate: (selectTemplate || Tribute.defaultSelectTemplate).bind(this),

                // function called that returns content for an item
                menuItemTemplate: (menuItemTemplate || Tribute.defaultMenuItemTemplate).bind(this),

                // function called when menu is empty, disables hiding of menu.
                noMatchTemplate: (t => {
                    if (typeof t === 'function') {
                        return t.bind(this)
                    }

                    return null
                })(noMatchTemplate),

                // column to search against in the object
                lookup: lookup,

                // column that contains the content to insert by default
                fillAttr: fillAttr,

                // array of objects
                values: values,

                requireLeadingSpace: requireLeadingSpace,
            }]
        }
        else if (collection) {
            this.collection = collection.map(item => {
                return {
                    trigger: item.trigger || trigger,
                    iframe: item.iframe || iframe,
                    selectClass: item.selectClass || selectClass,
                    selectTemplate: (item.selectTemplate || Tribute.defaultSelectTemplate).bind(this),
                    menuItemTemplate: (item.menuItemTemplate || Tribute.defaultMenuItemTemplate).bind(this),
                    // function called when menu is empty, disables hiding of menu.
                    noMatchTemplate: (t => {
                        if (typeof t === 'function') {
                            return t.bind(this)
                        }

                        return null
                    })(noMatchTemplate),
                    lookup: item.lookup || lookup,
                    fillAttr: item.fillAttr || fillAttr,
                    values: item.values,
                    requireLeadingSpace: item.requireLeadingSpace
                }
            })
        }
        else {
            throw new Error('[Tribute] No collection specified.')
        }

        new TributeRange(this)
        new TributeEvents(this)
        new TributeMenuEvents(this)
        new TributeSearch(this)
    }

    static defaultSelectTemplate(item) {
        return this.current.collection.trigger + item.original[this.current.collection.fillAttr];
    }

    static defaultMenuItemTemplate(matchItem) {
        return matchItem.string
    }

    static inputTypes() {
        return ['TEXTAREA', 'INPUT']
    }

    triggers() {
        return this.collection.map(config => {
            return config.trigger
        })
    }

    attach(el) {
        if (!el) {
            throw new Error('[Tribute] Must pass in a DOM node or NodeList.')
        }

        // Check if it is a jQuery collection
        if (typeof jQuery !== 'undefined' && el instanceof jQuery) {
            el = el.get()
        }

        // Is el an Array/Array-like object?
        if (el.constructor === NodeList || el.constructor === HTMLCollection || el.constructor === Array) {
            let length = el.length
            for (var i = 0; i < length; ++i) {
                this._attach(el[i])
            }
        } else {
            this._attach(el)
        }
    }

    _attach(el) {
        if (el.hasAttribute('data-tribute')) {
            console.warn('Tribute was already bound to ' + el.nodeName)
        }

        this.ensureEditable(el)
        this.events.bind(el)
        el.setAttribute('data-tribute', true)
    }

    ensureEditable(element) {
        if (Tribute.inputTypes().indexOf(element.nodeName) === -1) {
            if (element.contentEditable) {
                element.contentEditable = true
            } else {
                throw new Error('[Tribute] Cannot bind to ' + element.nodeName)
            }
        }
    }

    createMenu() {
        let wrapper = this.range.getDocument().createElement('div'),
            ul = this.range.getDocument().createElement('ul')

        wrapper.className = 'tribute-container'
        wrapper.appendChild(ul)

        if (this.menuContainer) {
            return this.menuContainer.appendChild(wrapper)
        }

        return this.range.getDocument().body.appendChild(wrapper)
    }

    showMenuFor(element, scrollTo) {
        let items
            // create the menu if it doesn't exist.
        if (!this.menu) {
            this.menu = this.createMenu()
            this.menuEvents.bind(this.menu)
        }

        this.isActive = true
        this.menuSelected = 0

        if (!this.current.mentionText) {
            this.current.mentionText = ''
        }

        items = this.search.filter(this.current.mentionText, this.current.collection.values, {
            pre: '<span>',
            post: '</span>',
            extract: (el) => {
                if (typeof this.current.collection.lookup === 'string') {
                    return el[this.current.collection.lookup]
                } else if (typeof this.current.collection.lookup === 'function') {
                    return this.current.collection.lookup(el)
                } else {
                    throw new Error('Invalid lookup attribute, lookup must be string or function.')
                }
            }
        })

        this.current.filteredItems = items

        let ul = this.menu.querySelector('ul')

        if (!items.length) {
            let noMatchEvent = new CustomEvent('tribute-no-match', { detail: this.menu })
            this.current.element.dispatchEvent(noMatchEvent)
            if (!this.current.collection.noMatchTemplate) {
                this.hideMenu()
            } else {
                ul.innerHTML = this.current.collection.noMatchTemplate()
            }

            return
        }

        ul.innerHTML = ''

        items.forEach((item, index) => {
            let li = this.range.getDocument().createElement('li')
            li.setAttribute('data-index', index)
            li.addEventListener('mouseenter', (e) => {
              let li = e.target;
              let index = li.getAttribute('data-index')
              this.events.setActiveLi(index)
            })
            if (this.menuSelected === index) {
                li.className = this.current.collection.selectClass
            }
            li.innerHTML = this.current.collection.menuItemTemplate(item)
            ul.appendChild(li)
        })

        this.range.positionMenuAtCaret(scrollTo)

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
        index = parseInt(index)
        if (typeof index !== 'number') return
        let item = this.current.filteredItems[index]
        let content = this.current.collection.selectTemplate(item)
        this.replaceText(content)
    }

    replaceText(content) {
        this.range.replaceTriggerText(content, true, true)
    }

    _append(collection, newValues, replace) {
        if (!replace) {
            collection.values = collection.values.concat(newValues)
        } else {
            collection.values = newValues
        }
    }

    append(collectionIndex, newValues, replace) {
        let index = parseInt(collectionIndex)
        if (typeof index !== 'number') throw new Error('please provide an index for the collection to update.')

        let collection = this.collection[index]

        this._append(collection, newValues, replace)
    }

    appendCurrent(newValues, replace) {
        if (this.isActive) {
            this._append(this.current.collection, newValues, replace)
        } else {
            throw new Error('No active state. Please use append instead and pass an index.')
        }
    }
}

export default Tribute;
