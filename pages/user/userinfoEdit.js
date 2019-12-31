// pages/user/userinfoEdit.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    phone:'',
    code:'',
    sec:0,
    isAble:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: app.globalData.user.name,
      phone:app.globalData.user.phone
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //input获取
  nameinput: function (e) {
    this.data.name = e.detail.value.replace(/(^\s)|(\s$)/g, "");
    return this.data.name;
  },
  //input获取
  phoneinput: function (e) {
    this.data.phone = e.detail.value.replace(/(^\s)|(\s$)/g, "");
    return this.data.phone;
  },
  //input获取
  codeinput: function (e) {
    this.data.code = e.detail.value.replace(/(^\s)|(\s$)/g, "");
    return this.data.code;
  },
  //发送验证按
  sendCode:function(e){
    var that = this;
    var randNum = Math.floor(Math.random()*10000);//产生一个随机数
    app.requestFunc('sms/SendCode', {phone: that.data.phone,num:randNum}, function sucFunc(d) {
      that.setData({
        sec: 60
      })
      //定时器
      var timer = setInterval(function () {
        that.setData({
          sec: that.data.sec-1
        })
        if (that.data.sec <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    },true);
  },
  //确认保存
  sureSubmit:function(e){
    var that = this;
    if(!that.data.isAble) return false;
    if (that.data.phone == app.globalData.userInfo.phone){
      wx.showToast({
        title: '手机号码未修改',
        duration: 2000,
        icon: 'none',
      });
      return false;
    }
    app.requestFunc('user/editUser', {phone:that.data.phone,name:that.data.name,code:that.data.code}, function sucFunc(d) {
      that.data.isAble = false;
      app.globalData.user.name = that.data.name;
      app.globalData.user.phone = that.data.phone;
      //2s后回退
      setTimeout(function () {
        wx.navigateBack();
      },2000);
      
    },true);
  }
})