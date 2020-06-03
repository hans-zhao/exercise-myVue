function Compiler(el, vm) {
    this.vm = vm
    this.el = document.querySelector(el)
    this.fragment = null
    this.init()
}
Compiler.prototype = {
    init() {
        if(this.el) {
            this.fragment = this.node2fragment(this.el)
            this.compileElement(this.fragment)
            this.el.appendChild(this.fragment)
        }else {
            console.log('el is not found!')
        }
    },
    node2fragment(el) {
        var fragment = document.createDocumentFragment()
        var child = el.firstChild
        while(child) {
            fragment.appendChild(child)
            child = el.firstChild
        }
        return fragment
    },
    compileElement(el) {
        var childNodes = [...el.childNodes]
        childNodes.forEach(node => {
            // 插值判断
            var reg = /\{\{(.*)\}\}/
            // 获取文本节点
            var text = node.textContent
            // 元素节点
            if(this.isElementNode(node)) {
                this.compile(node)
            }
            // 文本节点
            else if(this.isTextNode(node) && reg.test(text)) {
                this.compileText(node, reg.exec(text)[1])
            }
            if(node.childNodes && node.childNodes.length > 0) {
                this.compileElement(node)
            }
        })
    },
    // 元素编译
    compile(node) {
        var nodeAttrs = [...node.attributes]
        nodeAttrs.forEach(attr => {
            var attrName = attr.name
            if(this.isDirective(attrName)) {
                var exp = attr.value
                var dir = attrName.slice(2)
                if(this.isEventDirective(dir)) {
                    this.compileEvent(node, exp, dir)
                } else {
                    this.compileModel(node, exp)
                }
                node.removeAttribute(attrName)
            }
        })
    },
    // 文本编译
    compileText(node, exp) {
        var value = this.vm[exp]
        this.updateText(node, value)
        // 绑定
        new Watcher(this.vm, exp, newVal => {
            this.updateText(node, newVal)
        })
    },
    compileModel(node, exp) {
        var value = this.vm[exp]
        this.updateModel(node, value)
        new Watcher(this.vm, exp, newVal => {
            this.updateModel(node, newVal)
        })

        // 事件
        node.addEventListener('input', (event) => {
            var newVal = event.target.value
            if(newVal !== value) {
                value = newVal
                this.vm[exp] = newVal
            }
        })
    },
    compileEvent(node, exp, dir) {
        var eventName = dir.split(':')[1]
        var cb = this.vm.methods && this.vm.methods[exp]
        node.addEventListener(eventName, cb.bind(this.vm))
    },
    updateText(node, value) {
        node.textContent = typeof value === 'undefined'?'':value
    },
    updateModel(node, value) {
        node.value = typeof value === 'undefined'?'':value
    },
    isElementNode(node) {
        return node.nodeType == 1
    },
    isTextNode(node) {
        return node.nodeType === 3
    },
    isDirective(dir) {
        return dir.indexOf('v-') === 0
    },
    isEventDirective(dir) {
        return dir.indexOf('on:') === 0
    }
}