import './detail.scss';
import parent from '@/util/common.js';

document.addEventListener('DOMContentLoaded', function() {
  class Detail extends parent {
    constructor() {
      super()

      this.state = {
        $list: $('#detail'),
        arr: []
      }

      // 初始化
      this.init()
    }
    async init() {
      // 加载前 - 用于请求数据
      await this.load()

      // 加载后 - 用于绑定事件
      this.ready()
    }
    async load() {
      const data = await this.fetchData()
      this.state.arr = data.data
      this.render(this.state.arr)
    }
    ready() {

    }
    fetchData() {
      return this.fetch({
        method: 'get',
        url: `${this.baseUriApi}/topics`,
        params: {
          id: this.params.id
        }
      })
    }
    createListFragment(arr) {
      let fragment = document.createDocumentFragment()
      arr.forEach((v) => {
        let html = `
          <p>${v.title}</p>
          <p>${v.author}</p>
          <div>${v.content}</div>
        `
        fragment.appendChild($(html)[0])
      })

      return fragment
    }
    render(arr) {
      let fragment = this.createListFragment(arr)
      this.state.$list.append(fragment)
    }
  }

  new Detail()
})