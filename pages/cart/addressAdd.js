// pages/cart/addressAdd.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    name: '',
    address:'',
    isAble: true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.user)
    this.setData({
      phone: app.globalData.user.phone,
      name: app.globalData.user.name,
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
  addressinput: function (e) {
    this.data.address = e.detail.value.replace(/(^\s)|(\s$)/g, "");
    return this.data.address;
  },
  //确认保存
  sureSubmit: function (e) {
    var that = this;
    if (!that.data.isAble) return false;
    
    app.requestFunc('cart/addAddress', { contact_phone: that.data.phone, contact_name: that.data.name, address: that.data.address }, function sucFunc(d) {
      that.data.isAble = false;
      //2s后回退
      setTimeout(function () {
        wx.navigateBack();
      }, 2000);

    }, true);
  }
})