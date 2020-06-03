function MyVue(options) {
    // options是vm的属性
    this.data = options.data
    this.methods = options.methods
    observer(this.data)

    Object.keys(this.data).forEach(key => {
        this.proxyKeys(key)
    })

    new Compiler(options.el, this)
    options.mounted.call(this)
    // return this
}

// data的属性添加到this上
MyVue.prototype.proxyKeys = function(key) {
    Object.defineProperty(this, key, {
        get(){
            return this.data[key]
        },
        set(newVal){
            this.data[key] = newVal
        }
    })
}