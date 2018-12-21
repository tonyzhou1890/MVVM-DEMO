/**
 * 类：M
 */
class M {
  // 初始化
  constructor(options) {
    this.$el = document.querySelector(options.el)
    this.$data = options.data
    this.$methods = options.methods
    this._observe(this, '$data') // 监听数据
    this._compile(this.$el) // 编译html，监听事件，收集依赖
    this._initFill(this.$data) // 数据填充
  }
  // 监听数据————对set进行拦截
  _observe(parent, child) {
    const data = parent[child]
    parent[child] = new Proxy(data, {
      set(target, key, value) {
        let res = Reflect.set(target, key, value)
        // 数据变化时更新视图
        if (target._ob[key]) {
            target._ob[key].map(item => {
            item.update()
          })
        }
        
        return res
      }
    })
    // 遍历对象，如果元素是数组或对象，递归监听
    const keys = Object.keys(data)
    keys.map(item => {
      if (data[item] !== null && (typeof data[item]) === 'object') {
        this._observe(data, item)
      }
    })
  }
  // 编译
  _compile(el) {
    const nodes = Array.prototype.slice.call(el.children)
    nodes.map(node => {
      if (node.children.length > 0) this._compile(node)
      let attrs = null
      // 解析m-bind
      if (attrs = this._hasBind(node)) {
        attrs.map(attr => {
          this._pushWatcher(node, attr.attr, attr.key)
        })
      }
      // 解析m-model
      if (node.hasAttribute('m-model')) {
        const key = node.getAttribute('m-model')
        this._pushWatcher(node, 'value', key)
        const data = this._resolveValue(key)
        if (data !== false) {
          const tempData = data.data
          const tempKey = data.key
          node.addEventListener('input', () => {tempData[tempKey] = node.value})
        }
      }
      let events = null
      // 解析m-on
      if (events = this._hasOn(node)) {
        events.map(event => {
          const handler = this.$methods[event.key].bind(this.$data)
          console.log(event)
          node.addEventListener(event.event, handler)
        })
      }
    })
  }
  // 判断m-bind
  _hasBind(node) {
    let i = null
    let attr = null
    let key = null
    const attrs = []
    // 可以bind的属性
    const _bindAttr = ['text', 'innerText', 'html', 'innerHTML', 'src', 'value', 'href', 'class', 'style', 'alt', 'title']
    _bindAttr.map((item, index) => {
      if (node.hasAttribute('m-bind:' + item)) {
        i = index
        attr = item
        key = node.getAttribute('m-bind:' + item)
        if (attr && key) {
          if (attr === 'text') attr = 'innerText'
          if (attr === 'html') attr = 'innerHTML'
          attrs.push({ attr, key })
          attr = null
          key = null
        }
      }
    })
    
    if (attrs.length) {
      return attrs
    } else return false
  }
  // 添加watcher
  _pushWatcher(node, attr, key) {
    const data = this._resolveValue(key)
    if (data !== false) {
      const tempData = data.data
      const tempKey = data.key
      if (tempData._ob === null || tempData._ob === undefined) {
        tempData._ob = Object.create(null)
      }
      console.log(tempKey)
      if (tempData._ob[tempKey] === null || tempData._ob[tempKey] === undefined) {
        tempData._ob[tempKey] = []
      }
      tempData._ob[tempKey].push(new Watcher(node, attr, tempKey, tempData))
    }
  }
  // 解析值所在对象
  _resolveValue(key) {
    const arr = key.split('.')
    if (arr.length) {
      let data = this.$data
      for (let i = 0, len = arr.length - 1; i < len; i++) {
        if (data[arr[i]]) {
          data = data[arr[i]]
        }
      }
      return {
        data,
        key: arr[arr.length - 1]
      }
    } else {
      return false
    }
  }
  // 判断m-on
  _hasOn(node) {
    let event = null
    let key = null
    const events = []
    // 可以监听的事件
    const _event = ['click', 'dbclick', 'input', 'focus', 'blur', 'change', 'load', 'select']
    _event.map((item, index) => {
      if (node.hasAttribute('m-on:' + item)) {
        event = item
        key = node.getAttribute('m-on:' + item)
        if (event && key) {
          events.push({event, key})
          event = null
          key = null
        }
      }
    })
    if (events.length) {
      return events
    } else return false
  }
  // 数据填充初始化
  _initFill(data) {
    if (data._ob) {
      const keys = Object.keys(data._ob)
      keys.map(item => {
        data._ob[item].map(watcher => {
          watcher.update()
        })
      })
    }
    const dataKeys = Object.keys(data)
    dataKeys.map(item => {
      if ((typeof data[item]) === 'object' && item !== '_ob') {
        this._initFill(data[item])
      }
    })
  }
}

// 类：Watcher。更新视图
class Watcher {
  constructor(node, attr, key, data) {
    this.node = node
    this.attr = attr
    this.key = key
    this.data = data
  }
  update() {
    console.log(this)
    this.node[this.attr] = this.data[this.key]
  }
}
