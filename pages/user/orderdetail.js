// pages/user/orderdetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wineList: [],
    orderInfo: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.renderPay(options.order_id);
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
   * 渲染支付
   */
  renderPay: function (order_id) {
    let that = this;
    app.requestFunc('user/orderDetail', { id: order_id }, function sucFunc(d) {
      let _data = d.data;
      that.setData({
        orderInfo: _data.orderInfo,
        wineList: _data.wineList
      })
    });
  },
})