window.m = new M({
  el: '#app',
  data: {
    number: 0,
    query: {
      tip: '输入：',
      query: ''
    }
  },
  methods: {
    add() {
      this.number++
    },
    sub() {
      this.number--
    }
  }
})