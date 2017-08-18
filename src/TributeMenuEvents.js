class TributeMenuEvents {
    constructor(tribute) {
        this.tribute = tribute
        this.tribute.menuEvents = this
        this.menu = this.tribute.menu
        this.doc = this.tribute.range.getDocument(tribute.current)
        this.win = this.tribute.range.getWindow(tribute.current)
    }

    bind(menu) {
        menu.addEventListener('keydown',
            this.tribute.events.keydown.bind(menu, this), false)
        this.doc.addEventListener('mousedown',
            this.tribute.events.click.bind(null, this), false)
        this.win.addEventListener('resize', this.debounce(() => {
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
            this.tribute.range.getWindow(this.tribute.current).onscroll = this.debounce(() => {
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
