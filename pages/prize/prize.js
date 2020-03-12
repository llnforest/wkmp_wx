// pages/prize/prize.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.user.level == 0){
      wx.redirectTo({
        url: '/pages/prize/gift',
      })
    }
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
    this.renderPrize();

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
   * 渲染奖励中心
   */
  renderPrize:function(){
    console.log(app.globalData.user);
    this.setData({
      userInfo: app.globalData.user
    })
  },
  //点击地址管理
  goTeam: function (e) {
    wx.navigateTo({
      url: '/pages/prize/team',
    })
  },
  //点击我的收益
  goProfit: function (e) {
    wx.navigateTo({
      url: '/pages/prize/profit',
    })
  },
  //点击提现记录
  goTakeList: function (e) {
    wx.navigateTo({
      url: '/pages/prize/takelist',
    })
  },
  //点击去提现
  goApply: function (e) {

  },
  //点击立即开通
  editUser: function (e) {
    wx.navigateTo({
      url: '/pages/user/userinfoEdit',
    })
  },
})