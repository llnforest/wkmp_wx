// pages/user/user.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    pay_num:0
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.renderUserInfo();
    this.renderPayNum();
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
    if(this.data.userInfo.phone){
      this.renderPayNum();
    }
    this.setData({
      userInfo:app.globalData.user
    })
    
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
  /**
   * 渲染个人信息
   */
  renderUserInfo:function(){
    let that = this;
    app.requestFunc('user/user', {}, function sucFunc(d) {
      let _data = d.data;
      app.globalData.user = _data.userInfo;
        that.setData({
          userInfo: _data.userInfo
        })
    });
  },
  /**
   * 渲染未支付数量
   */
  renderPayNum: function () {
    let that = this;
    app.requestFunc('user/payNum', {}, function sucFunc(d) {
      let _data = d.data;
      that.setData({
        pay_num: _data.payNum
      })
    });
  },
  //点击立即开通
  goGift: function (e) {
    wx.navigateTo({
      url: '/pages/prize/gift',
    })
  },
  //点击我的订单项
  goOrderList: function (e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/user/orderlist?status=' + data.status,
    })
  },
  //点击地址管理
  goAddress: function (e) {
    wx.navigateTo({
      url: '/pages/cart/address',
    })
  },
  //点击我的信息
  goUserInfo: function (e) {
    wx.navigateTo({
      url: '/pages/user/userinfo',
    })
  },
  //点击我的客服
  goService: function (e) {
    
  },
  //点击立即开通
  editUser: function (e) {
    wx.navigateTo({
      url: '/pages/user/userinfoEdit',
    })
  },
})