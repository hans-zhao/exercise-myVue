function MyVue(data, el, exp) {
    console.log("MyVue -> exp", exp)
    this.data = data
    observer(data)

    Object.keys(data).forEach(key => {
        this.proxyKeys(key)
    })
    // 初始化绑定的属性
    el.innerHTML = this.data[exp]

    new Watcher(this, exp, val => {
        el.innerHTML = val
    })
    return this
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