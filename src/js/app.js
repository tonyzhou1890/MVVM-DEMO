// 绑定数据
let demo = {}

// 绑定元素
const el = document.querySelector('#input')

// 添加事件
el.addEventListener('change', (e) => {
  demo.value = e.target.value
})

// 数据拦截
Object.defineProperty(demo,'value',{
  set: (v) => {
    if (demo._value !== v) {
      demo._value = v
      el.value = v
    }
  },
  get: () => {
    return demo._value
  }
})