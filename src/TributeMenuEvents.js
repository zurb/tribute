class TributeMenuEvents {
    constructor(tribute) {
        this.tribute = tribute
        this.tribute.menuEvents = this
        this.menu = this.tribute.menu
    }

    bind(menu) {
        menu.addEventListener('keydown',
            this.tribute.events.keydown.bind(this.menu, this), false)
        this.tribute.range.getDocument().addEventListener('mousedown',
            this.tribute.events.click.bind(null, this), false)

        // fixes IE11 issues with mousedown
        this.tribute.range.getDocument().addEventListener('MSPointerDown',
            this.tribute.events.click.bind(null, this), false)

        window.addEventListener('resize', this.debounce(() => {
            if (this.tribute.isActive) {
                this.tribute.range.positionMenuAtCaret(true)
            }
        }, 300, false))

        if (this.menuContainer) {
            this.menuContainer.addEventListener('scroll', this.debounce(() => {
                if (this.tribute.isActive) {
                    this.tribute.showMenuFor(this.tribute.current.element, false)
                }
            }, 300, false), false)
        } else {
            window.onscroll = this.debounce(() => {
                if (this.tribute.isActive) {
                    this.tribute.showMenuFor(this.tribute.current.element, false)
                }
            }, 300, false)
        }

    }

    debounce(func, wait, immediate) {
        var timeout
        return () => {
            var context = this,
                args = arguments
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


export default TributeMenuEvents;
