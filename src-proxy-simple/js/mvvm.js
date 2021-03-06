class Vue {
  constructor(options) {
    this.$el = document.querySelector(options.el)
    this.$methods = options.methods
    this._binding = {}
    this._observe(options.data)
    this._compile(this.$el)
  }
  _observe(data) {
    var self = this
    this.$data = new Proxy(data, {
      set(target, key, value) {
        let res = Reflect.set(target, key, value)
        self._binding[key].map(item => {
          item.update()
        })
        return res
      }
    })
  }
  _compile(root) {
    const nodes = Array.prototype.slice.call(root.children)
    let data = this.$data
    nodes.map(node => {
      if (node.children.length > 0) this._compile(node)
      if (node.hasAttribute('v-bind')) {
        let key = node.getAttribute('v-bind')
        this._pushWatcher(new Watcher(node, 'innerHTML', data, key))
      }
      if (node.hasAttribute('v-model')) {
        let key = node.getAttribute('v-model')
        this._pushWatcher(new Watcher(node, 'value', data, key))
        node.addEventListener('input', () => {data[key] = node.value})
      }
      if (node.hasAttribute('v-click')) {
        let methodName = node.getAttribute('v-click')
        let method = this.$methods[methodName].bind(data)
        node.addEventListener('click', method)
      }
    })
  }
  _pushWatcher(watcher) {
    if (!this._binding[watcher.key]) this._binding[watcher.key] = []
    this._binding[watcher.key].push(watcher)
  }
}

class Watcher {
  constructor (node, attr, data, key) {
    this.node = node
    this.attr = attr,
    this.data = data,
    this.key = key
  }
  update() {
    this.node[this.attr] = this.data[this.key]
  }
}