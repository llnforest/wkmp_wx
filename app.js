//app.js
App({
  data:{
    // url:'https://api.99wukong.cn/',
    url:'http://api.99wukong.test/',
    // url:'http://192.168.100.62/wkmp/public/index/'

    isCanClick:true,
  },
  /**
   * 公用请求方法
   * url:地址
   * data：传递数据
   * sucFunc:成功回调方法
   * is_suc_toast:操作成功是否弹框
   * errFunc:失败回调方法
   */
  requestFunc: function(url,data = {},sucFunc = false,is_suc_toast = false,errFunc = false){
    var that = this;
    data.token = that.globalData.token;
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
          if(sucFunc) sucFunc(_data);
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
      }
    });
  },
  /**
   * 公用请求方法（点击事件）
   * url:地址
   * data：传递数据
   * sucFunc:成功回调方法
   * is_suc_toast:操作成功是否弹框
   * errFunc:失败回调方法
   */
  requestClick: function (url, data = {}, sucFunc, is_suc_toast = false, errFunc = false) {
    var that = this;
    if (!that.data.isCanClick) return false;
    that.data.isCanClick = false;
    data.token = that.globalData.token;
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
          if (is_suc_toast) {//弹框
            that.toast(_data.msg);
          }
          if (sucFunc) sucFunc(_data);
        } else {//失败
          if (errFunc) {
            errFunc(_data);
          } else {
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
  //自动登录
  userLogin: function () {
    //定义promise方法
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: that.data.url + 'api/getToken',
            method: 'post',
            'data': { code: res.code },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data.code == 0) {
                that.globalData.token = res.data.data.token;
                that.globalData.openid = res.data.data.openid;
                resolve(res.data);
              } else {
                reject(res);
              }
            }
          });
        }
      });
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
            if (res.data.code == 0) {
              that.globalData.user = res.data.data;
              that.globalData.token = res.data.data.token;
            }else{
              console.log(res);
              getApp().toast('网络异常')
            }
          }
        });
      }
    });
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res);
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });
    //获取系统信息,计算各部分的高度参数
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.globalData.windowWidth = res.windowWidth;
        that.globalData.screenRate = 375 / res.windowWidth;
        that.globalData.barHeight = res.statusBarHeight;
        that.globalData.navHeight = 44 * that.globalData.screenRate;
        that.globalData.windowHeight = res.windowHeight;
        that.globalData.tabHeight = res.screenHeight - res.statusBarHeight - that.globalData.navHeight - res.windowHeight

      }
    });
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
    windowWidth: 0,
    screenRate:1,
    barHeight:0,
    navHeight:0,
    windowHeight:0,
    tabHeight:0,
    userInfo: [],
    cate_id:1,
    user:[],
    token:"",
    sms_random:"BVCXa1.4jdPPksMndkE3_oO0*",
    appId: 'wx9e86511465aa9905',
    key:'923ksdKdjskI9sksdjfsdjksK823Ojk1'
  },
  onPageScroll: function (e) {
    if (e.scrollTop < 0) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  }
})