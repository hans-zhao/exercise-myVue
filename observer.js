function defineReactive(data, key, value) {
    observer(value)
    var dep = new Dep()
    Object.defineProperty(data, key, {
        get() {
            // console.log('get', value)
            if(Dep.target) {
                dep.addSub(Dep.target)
            }
            return value
        },
        set(newVal) {
            // console.log('set', value, newVal)
            if(newVal !== value) {
                value = newVal
                dep.notify()
            }
        }
    })
}

function observer(data) {
    if(!data || typeof data !== 'object') return
    Object.keys(data).forEach(key => {
        defineReactive(data, key, data[key])
    })
}

function Dep() {
    this.subs = []
}

Dep.prototype.addSub = function(sub) {
    this.subs.push(sub)
}
Dep.prototype.notify = function(){
    this.subs.forEach(sub => {
        sub.update()
    })
}


Dep.target = null