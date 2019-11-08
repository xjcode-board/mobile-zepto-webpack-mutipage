# mobile-zepto-webpack-mutipage
webpack构建的基于zepto的移动端多页应用

## 一：参考
[web-mobile-cli](https://github.com/sihai00/web-mobile-cli)
1. 沿用了web-mobile-cli的生命周期
2. 去掉了gulp自动化构建，增加支持webpack
3. 优化项目结构，更加清晰

## 二：使用
``` bash
# 进入项目，运行前请先安装所需依赖
npm install

# 运行以下命令启动服务器 localhost:8000
npm start

# 打包（dist文件）
npm run build

# config.js的配置
port: 8000  端口号
serverIndex: '' 开发环境下默认指向
outputPath: 'dist' 打包文件名
publicPath: '/' 缓存服务器地址
title: 'mobile-zepto-webpack-mutipage' html公共标题
```

## 三：目录
- dist: 打包后文件（默认打包后为```dist```目录，默认浏览器打开首页为```dist/index.html```）
- config: 项目配置文件
- src
	- assets: 图片与公共样式等资源文件
	- lib: 插件或者库文件 也可用cdn
	- pages: 页面
	- template: 提取公共的html模板（ejs）
  - util: 工具函数或公共js文件

## 四：页面
项目使用了`ejs`作为开发的模板，好处是可以抽离出公共模块使用例子如下：
```html
<!DOCTYPE html>
<html lang="en">
<% include ../../template/header.ejs %>
<body>
	<!-- page -->
	<div class="home-page" id="home">
		<ul class="list" id="homeList">
			<li class="item"></li>
		</ul>
	</div>
	<!-- footer -->
	<% include ../../template/footer.ejs %>
</body>

</html>
```
`publicPath`的值是在`config.js`中定义的，可用于全局cdn引用路径

## 五：样式
1.采用[vw方案](https://www.w3cplus.com/css/vw-for-layout.html)
2.[postcss-px-to-viewport](https://npm.taobao.org/package/postcss-px-to-viewport)，可将px单位自动转换成viewport单位
3.scss里面直接用px写样式，打包后会被转换成对应的vw

```配置
require('postcss-px-to-viewport')({
  viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
  viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
  unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
  viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
  selectorBlackList: ['.ignore', '.hairlines'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
  minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
  mediaQuery: false // 允许在媒体查询中转换`px`
})
```

## 六：javascript
可以使用最新语法，打包后经过`babel`转译为`es5`

### 6-1：生命周期
- constructor
  - this.state：储存当前页面的变量
  - this.init：初始化
- init：
  - load：用于数据请求、数据渲染
  - ready：用于事件的绑定（只有当load执行完才可调用）

```javascript
class index extends parent{
  constructor(){
    super()

    this.state = {
      $list: $('#home'),
      arr: []
    }

    // 初始化
    this.init()
  }
  async init(){
    // 加载前 - 用于请求数据
    await this.load()

    // 加载后 - 用于绑定事件
    this.ready()
  }
  async load(){
    const data = await this.fetchData()

    this.state.arr = data.data
    // 拿到数据后渲染render()
  }
  ready(){
    // 在此初次渲染后可绑定事件
  }
  fetchData(){
    // parent类中的fetch方法
    return this.fetch({
      method: 'get',
      url: `${this.baseUriApi}/topics`,
      params: {
        limit: 10
      }
    })
  }
}
```

### 6-2：parent类
`page`中的`js`都继承自`parent`，`parent`可以存放一些全局的方法和变量给子类调用

```javascript
class parent {
  constructor(){
    this.baseUri = 'https://cnodejs.org'
    this.baseUriApi = this.baseUri + '/api/v1'
    this.windowUrl = window.location.href
    this.origin = window.location.origin
    this.params = this.getUrlParams()
  }
  // 获取url参数
  getUrlParams(url){
    var uri = url || this.windowUrl
    var match = uri && uri.match(/([^?=&]+)=([^?&]+)/g)

    return match && match.reduce(function(a, b){
      var val = b.split(/([^?=&]+)=([^?&]+)/g)
      a[val[1]] = val[2]
      return a
    }, {})
  }
  // 请求数据  模板里面加入了weui的toast和loading
  fetch(option) {
    const token = this.params && this.params.token
    let url = option.url + '?access_token=' + token;
    let loading = weui.loading('加载中...');
    return new Promise((resolve, reject) => {
      $.ajax({
        type: option.method,
        url,
        data: option.method === 'get' ? option.params : JSON.stringify(option.params),
        contentType: 'application/json',
        success: function(data) {
          if (data.success === true) {
            resolve(data)
          } else {
            reject(data)
            weui.toast(data.errorMsg, {
              duration: 3000,
              className: "msg-toast"
            });
          }
        },
        error: function(xhr, type) {
          reject(JSON.parse(xhr.response)['error']['message'])
        },
        complete: function() {
          loading.hide()
        }
      })
    }).catch(err => console.log(`错误信息: ${err}`))
  }
}
```
