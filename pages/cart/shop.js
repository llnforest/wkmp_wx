// pages/cart/shop.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList:'',
    defaultId:0,
    empty:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.renderShop(options);
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
  /**
 * 设置默认项
 */
  clickDefault: function (e) {
    let data = e.currentTarget.dataset;
    let that = this;
    that.setData({
      defaultId:data.id
    });
    let pages = getCurrentPages();//获取当前页面js里面的pages里的所有信息。
    pages[pages.length - 2].setData({
      shop_id:data.id,
      shop_name:data.name
    });
    wx.navigateBack();
  },
  /**
   * 渲染门店
   */
  renderShop: function (options) {
    let that = this;
    app.requestFunc('cart/shop', {}, function sucFunc(d) {
      let _data = d.data;
      if (_data.shopList.length == 0) {
        that.setData({
          empty: true
        });
        let pages = getCurrentPages();//获取当前页面js里面的pages里的所有信息。
        pages[pages.length - 2].setData({
          express_type: 1,
        });
      } else {
        that.setData({
          shopList: _data.shopList,
          defaultId:options.id
        })
      }

    });
  },
})