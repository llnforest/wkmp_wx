// pages/prize/gift.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:[],
    giftList:[],
    selected:0,
    phone:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.renderGift();
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
    this.renderUser();
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
   * 点击立即开通
   */
  editUser: function (e) {
    wx.navigateTo({
      url: '/pages/user/userinfoEdit',
    })
  },
  /**
   * 渲染个人信息
   */
  renderUser: function () {
    console.log(app.globalData.user);
    this.setData({
      userInfo: app.globalData.user
    })
  },
  /**
   * 渲染礼品
   */
  renderGift: function () {
    let that = this;
    app.requestFunc('prize/gift', {}, function sucFunc(d) {
      let _data = d.data;
      that.setData({
        giftList: _data.giftList,
        selected: _data.selected
      })
    });
  },
  //input获取
  phoneinput: function (e) {
    this.data.phone = e.detail.value.replace(/(^\s)|(\s$)/g, "");
    return this.data.phone;
  },
  /**
   * 点击选择
   */
  clickItem: function (e) {
    let data = e.currentTarget.dataset;
    if (this.data.selected != data.id) {
      this.setData({
        selected:data.id
      });
    }
   
  },
  /**
   * 立即开通
   */
  goBuy: function (e) {
    if(this.data.phone == ''){
      wx.showToast({
        title: '请输入邀请码',
        duration: 2000,
        icon: 'none',
      });
      return false;
    }
    wx.navigateTo({
      url: '/pages/prize/goBuy?gift_id='+this.data.selected+'&phone='+this.data.phone,
    })
  },
})