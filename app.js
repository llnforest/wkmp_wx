//app.js
App({
  data:{
    url:'http://api.99wukong.test/',
    // url:'http://192.168.100.62/wkmp/public/index/'

    isCanClick:true,
  },
  /**
   * 
   * url:地址
   * data：传递数据
   * sucFunc:成功回调函数
   * is_toast:操作成功是否弹框
   */
  requestFunc: function(url,data = {},sucFunc,is_suc_toast = false,errFunc = false){
    var that = this;
    if (!that.data.isCanClick) return false;
    that.data.isCanClick = false;
    // data.token = that.globalData.token;
    wx.request({
      url: that.data.url + url,
      method: 'post',
      'data': data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _data = res.data;
        console.log(_data);
        if (res.data.code == 0) {//成功
          if(is_suc_toast){//弹框
            that.toast(_data.msg);
          }
          sucFunc(_data);
        } else {//失败
          if(errFunc){
            errFunc(_data);
          }else{
            that.toast(_data.msg);
          }
        }
      },
      fail: function (e) {
        that.toast('网络异常');
      },
      complete: function () {
        that.data.isCanClick = true;
      }
    });
  },
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: that.data.url + 'api/getToken',
          method: 'post',
          'data': {code:res.code},
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.globalData.user = res.data.data;
            that.globalData.token = res.data.data.token;
          }
        });
      }
    })
    // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })
  },
  toast: function (msg, timelong = 2000) {
    let duration = timelong || 2000;
    wx.showToast({
      title: msg,
      duration: duration,
      icon: 'none'
    });
  },
  globalData: {
    userInfo: [],
    cate_id:1,
    user:[],
    token:"",
    sms_random:"BVCXa1.4jdPPksMndkE3_oO0*",
  },
  onPageScroll: function (e) {
    if (e.scrollTop < 0) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  }
})