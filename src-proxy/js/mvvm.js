/**
 * 类：M
 */
class M {
  // 初始化
  constructor(options) {
    this.$el = document.querySelector(options.el)
    this.$data = options.data
    this.$methods = options.methods
    this._observe(this.$el) // 监听数据
    this._compile(this.$el) // 编译html，监听事件，收集依赖
  }
  // 可以bind的属性
  _bindAttr = ['text', 'innerText', 'html', 'innerHTML', 'src', 'value', 'href', 'class', 'style']
  // 可以监听的事件
  _event = ['click', 'dbclick', 'input', 'focus', 'blur', 'change', 'load', 'select']
  // 监听数据————对set进行拦截
  _observe(data) {
    data = new Proxy(data, {
      set(target, key, value) {
        let res = Reflect(target, key, value)
        // 数据变化时更新视图
        target._ob[key].map(item => {
          item.update()
        })
        return res
      }
    })
    // 遍历对象，如果元素是数组或对象，递归监听
    data.map(item => {
      if (item !== null && (typeof item) === 'object') {
        this._observe(item)
      }
    })
  }
  // 编译
  _compile(el) {
    const nodes = Array.prototype.slice.call(el.children)
    const data = this.$data
    nodes.map(node => {
      if (node.children.length > 0) this._compile(node)
      let attr = null
      // 解析m-bind
      if (attr = this._hasBind(node)) {
        this._pushWatcher(node, attr.attr, attr.key)
      }
      // 解析m-model
      if (node.hasAttribute('m-model')) {
        const key = node.getAttribute('m-model')
        this._pushWatcher(node, 'value', key)
      }
    })
  }
  // 判断m-bind
  _hasBind(node) {
    let i = null
    let attr = null
    let key = null
    this._bindAttr.map((item, index) => {
      if (node.hasAttribute('m-' + item)) {
        i = index
        attr = item
        key = node.getAttribute('m-' + item)
        break
      }
    })
    if (attr === 'text') attr = 'innerText'
    if (attr === 'html') attr = 'innerHTML'
    if (attr) {
      return {
        attr,
        key
      }
    }
    else return false
  }
  // 添加watcher
  _pushWatcher(node, attr, key) {
    const arr = key.split('.')
    if (arr.length) {
      let data = this.$data
      // 解析值所在对象
      for (let i = 0, len = arr.length - 1; i < len; i++) {
        if (data[arr[i]]) {
          data = data[arr[i]]
        }
      }
      if (data._ob === null || data._ob === undefined) {
        data._ob = Object.create(null)
      }
      if (data._ob[key] === null || data._ob[key] === undefined) {
        data._ob[key] = []
      }
      data._ob[key].push(new Watcher(node, attr, key, data))
    }
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
    this.node[this.attr] = this.data[this.key]
  }
}
