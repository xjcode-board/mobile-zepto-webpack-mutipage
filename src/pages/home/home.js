import './home.scss';
import parent from '@/util/common.js';

document.addEventListener('DOMContentLoaded', function() {
  class Home extends parent {
    constructor() {
      super()

      this.state = {
        $list: $('#homeList'),
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
      $('.list .item').bind('click', function() {
        location.href = `detail.html?id=${$(this).data('id')}`
      })
    }
    fetchData() {
      return this.fetch({
        method: 'get',
        url: `${this.baseUriApi}/topics`,
        params: {
          limit: 10
        }
      })
    }
    createListFragment(arr) {
      let fragment = document.createDocumentFragment()
      arr.forEach((v) => {
        let html = `
          <li class="item" data-id="${v.id}">
						<p class="title">${v.title}</p>
						<div class="content">${v.content}</div>
					</li>
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

  new Home()
})