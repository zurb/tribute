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
            key: 8,
            value: 'DELETE'
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
        element.addEventListener('input',
            this.input.bind(element, this), false)
    }

    keydown(instance, event) {
        if (instance.shouldDeactivate(event)) {
            instance.tribute.isActive = false
        }

        let element = this
        instance.commandEvent = false

        TributeEvents.keys().forEach(o => {
            if (o.key === event.keyCode) {
                instance.commandEvent = true
                instance.callbacks()[o.value.toLowerCase()](event, element)
            }
        })
    }

    input(instance, event) {
        instance.inputEvent = true
        instance.keyup.call(this, instance, event)
    }

    click(instance, event) {
        let tribute = instance.tribute

        if (tribute.menu && tribute.menu.contains(event.target)) {
            let li = event.target
            while (li.nodeName.toLowerCase() !== 'li') {
                li = li.parentNode
                if (!li || li === tribute.menu) {
                    throw new Error('cannot find the <li> container for the click')
                }
            }
            tribute.selectItemAtIndex(li.getAttribute('data-index'))
            tribute.hideMenu()
        } else if (tribute.current.element) {
            tribute.hideMenu()
        }
    }

    keyup(instance, event) {
        if (instance.inputEvent) {
            instance.inputEvent = false
        }
        instance.updateSelection(this)

        if (event.keyCode === 27) return

        if (!instance.tribute.isActive) {
            let keyCode = instance.getKeyCode(instance, this, event)

            if (isNaN(keyCode)) return

            let trigger = instance.tribute.triggers().find(trigger => {
                return trigger.charCodeAt(0) === keyCode
            })

            if (typeof trigger !== 'undefined') {
                instance.callbacks().triggerChar(event, this, trigger)
            }
        }

        if (instance.tribute.current.trigger && instance.commandEvent === false
            || instance.tribute.isActive && event.keyCode === 8) {
          instance.tribute.showMenuFor(this, true)
        }
    }

    shouldDeactivate(event) {
        if (!this.tribute.isActive) return false

        if (this.tribute.current.mentionText.length === 0) {
            let eventKeyPressed = false
            TributeEvents.keys().forEach(o => {
                if (event.keyCode === o.key) eventKeyPressed = true
            })

            return !eventKeyPressed
        }

        return false
    }

    getKeyCode(instance, el, event) {
        let char
        let tribute = instance.tribute
        let info = tribute.range.getTriggerInfo(false, false, true, tribute.allowSpaces)

        if (info) {
            return info.mentionTriggerChar.charCodeAt(0)
        } else {
            return false
        }
    }

    updateSelection(el) {
        this.tribute.current.element = el
        let info = this.tribute.range.getTriggerInfo(false, false, true, this.tribute.allowSpaces)

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
                if (tribute.inputEvent) tribute.showMenuFor(el, true)
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
                    } else if (selected === 0) {
                      this.tribute.menuSelected = count - 1
                      this.setActiveLi()
                      this.tribute.menu.scrollTop = this.tribute.menu.scrollHeight
                    }
                }
            },
            down: (e, el) => {
                // navigate down ul
                if (this.tribute.isActive) {
                    e.preventDefault()
                    let count = this.tribute.current.filteredItems.length - 1,
                        selected = this.tribute.menuSelected

                    if (count > selected) {
                        this.tribute.menuSelected++
                        this.setActiveLi()
                    } else if (count === selected) {
                        this.tribute.menuSelected = 0
                        this.setActiveLi()
                        this.tribute.menu.scrollTop = 0
                    }
                }
            },
            delete: (e, el) => {
                if (this.tribute.isActive && this.tribute.current.mentionText.length < 1) {
                    this.tribute.hideMenu()
                } else if (this.tribute.isActive) {
                    this.tribute.showMenuFor(el)
                }
            }
        }
    }

    setActiveLi(index) {
        let lis = this.tribute.menu.querySelectorAll('li'),
            length = lis.length >>> 0

        // get heights
        let menuFullHeight = this.getFullHeight(this.tribute.menu),
            liHeight = this.getFullHeight(lis[0])

        if (index) this.tribute.menuSelected = index;

        for (let i = 0; i < length; i++) {
            let li = lis[i]
            if (i === this.tribute.menuSelected) {
                let offset = liHeight * (i+1)
                let scrollTop = this.tribute.menu.scrollTop
                let totalScroll = scrollTop + menuFullHeight

                if (offset > totalScroll) {
                  this.tribute.menu.scrollTop += liHeight
                } else if (offset < totalScroll) {
                  this.tribute.menu.scrollTop -= liHeight
                }

                li.className = this.tribute.current.collection.selectClass
            } else {
                li.className = ''
            }
        }
    }

    getFullHeight(elem, includeMargin) {
      let height = elem.getBoundingClientRect().height

      if (includeMargin) {
        let style = elem.currentStyle || window.getComputedStyle(elem)
        return height + parseFloat(style.marginTop) + parseFloat(style.marginBottom)
      }

      return height
    }

}

export default TributeEvents;
