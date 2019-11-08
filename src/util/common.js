export default class parent {
  constructor() {
    this.baseUri = 'https://cnodejs.org'
    this.baseUriApi = this.baseUri + '/api/v1'
    this.windowUrl = window.location.href
    this.origin = window.location.origin
    this.params = this.getUrlParams()
  }
  // 获取url参数
  getUrlParams(url) {
    let uri = url || this.windowUrl
    let match = uri && uri.match(/([^?=&]+)=([^?&]+)/g)

    return match && match.reduce(function(a, b) {
      let val = b.split(/([^?=&]+)=([^?&]+)/g)
      a[val[1]] = val[2]
      return a
    }, {})
  }
  // 请求
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
          }
          weui.toast('操作成功', {
            duration: 30000,
            className: "msg-toast"
          });
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