//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    bannerList: [],
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: app.data.url + '/index/index/index',
      method: 'post',
      data: {
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        var _data = res.data.data;
        if(res.data.code == 0){
          that.setData({
            bannerList: _data.bannerList,

          });
        }else{
          console.log('error')
        }


        

        

      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
