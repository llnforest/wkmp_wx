// pages/prize/takelist.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    takeList:[],
    takeMoney:'',
    empty:false,
    page: 1,
    canReach: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.renderTakeList();
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
    if (!this.loading && this.data.canReach) {
      this.data.page++;
      this.renderTakeList();
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },/**
   * 渲染提现
   */
  renderTakeList: function () {
    let that = this;
    app.requestFunc('prize/takeList', { page: that.data.page}, function sucFunc(d) {
      let _data = d.data;
      if (_data.takeList.length == 0) {
        that.data.canReach = false;
        if (that.data.page == 1) {
          that.setData({
            takeMoney: app.globalData.user.total_profit - app.globalData.user.balance,
            empty: true
          })
        }
      } else {
        if (that.data.page == 1){
            that.setData({
              takeMoney: app.globalData.user.total_profit - app.globalData.user.balance,
              takeList: that.data.takeList.concat(_data.takeList)
            });
          }else{
            that.setData({
              takeList: that.data.takeList.concat(_data.takeList)
            });
          }
          

      }
    });
  },
})