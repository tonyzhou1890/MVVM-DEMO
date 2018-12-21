window.m = new M({
  el: '#app',
  data: {
    number: 0,
    query: {
      tip: '输入：',
      query: ''
    },
    style: 'color: #000'
  },
  methods: {
    add() {
      this.number++
    },
    sub() {
      this.number--
    },
    changeStyle() {
      let color = ''
      let number = Number(this.query.query)
      if (!number) {
        color = 'red'
      } else if(number < 10){
        color = 'green'
      } else if (number < 100) {
        color = 'blue'
      } else {
        color = 'gray'
      }
      this.style = 'color: ' + color
    }
  }
})