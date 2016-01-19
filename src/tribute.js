class Tribute {
  constructor(options) {
    this.expando = 0
    this.instance = this.uuid()
    this.globalCallbacks = options.callbacks || {}
    this.currentNode = null

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
    if (Tribute.inputTypes().indexOf(element.tagName) === -1) {
      if (element.contentEditable) {
        element.contentEditable = true
      } else {
        console.warn(Error('attach', 'Cannot bind to ' + element.tagName))
      }
    }
  }

  showMenuFor(element, collectionItem) {
    // create the menu if it doesn't exist.
    if (!this.menu) {
      this.menu = (()=> {
        let wrapper = document.createElement('div'),
            ul = document.createElement('ul')

        wrapper.className = 'tribute-container'
        wrapper.appendChild(ul)
        return document.body.appendChild(wrapper)
      })()
    }

    let ul = this.menu.querySelector('ul')

    ul.innerHTML = '';

    collectionItem.values.forEach((item, index) => {
      let li = document.createElement('li')
      li.setAttribute('data-index', index)
      li.innerHTML = item.value
      ul.appendChild(li)
    })
  }
}

class TributeEvents {
  constructor(tribute) {
    this.tribute = tribute
    this.tribute.events = this
  }

  static keys() {
    return [
      {key: 8,  value: 'BACKSPACE'},
      {key: 9,  value: 'TAB'},
      {key: 13, value: 'ENTER'},
      {key: 27, value: 'ESCAPE'},
      {key: 38, value: 'UP'},
      {key: 40, value: 'DOWN'}
    ]
  }

  bind(element) {
    element.addEventListener('keydown', this.keydown.bind(element, this), false)
    element.addEventListener('keypress', this.keypress.bind(element, this), false)
  }

  keydown(instance, event) {
    let element = this

    TributeEvents.keys().forEach(o => {
      if (o.key === event.keyCode) {
        instance.callbacks()[o.value.toLowerCase()](event, element)
      }
    })
  }

  keypress(instance, event) {
    let trigger = instance.tribute.triggers().find(trigger => {
      return trigger.charCodeAt(0) === event.keyCode
    })

    if (typeof trigger !== 'undefined') {
      instance.callbacks().triggerChar(event, this, trigger)
    }
  }

  callbacks() {
    return Object.assign({}, this.tribute.globalCallbacks, {
      triggerChar: (e, el, trigger) => {
        let pos = this.tribute.range.position(el)
        let prevCode = el.textContent.charCodeAt(pos - 1)

        let collectionItem = this.tribute.collection.find(item => {
          return item.trigger = trigger
        })

        // If space or the beginning of the line
        if (prevCode === 32 || isNaN(prevCode)) {
          this.tribute.showMenuFor(el, collectionItem)
        }
      },
      enter: (e, el) => {
        console.log('enter:', this.tribute, e, el)
      },
      escape: (e, el) => {
        console.log('escape:', this.tribute, e, el)
      },
      backspace: (e, el) => {
        console.log('backspace:', this.tribute, e, el)
      },
      tab: (e, el) => {
        console.log('tab:', this.tribute, e, el)
      },
      up: (e, el) => {
        console.log('up:', this.tribute, e, el)
      },
      down: (e, el) => {
        console.log('down:', this.tribute, e, el)
      },
    })
  }

}

class TributeRange {
  constructor(tribute) {
    this.tribute = tribute
    this.tribute.range = this
  }

  position(node) {
    let caretPos = 0, sel, range;

    sel = window.getSelection()

    if (sel.rangeCount) {
      range = sel.getRangeAt(0)

      if (range.commonAncestorContainer.parentNode == node) {
        caretPos = range.endOffset
      }
    }

    return caretPos
  }
}
