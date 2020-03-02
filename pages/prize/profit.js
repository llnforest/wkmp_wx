// pages/prize/profit.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    profitList:[],
    totalProfit:'',
    balance:'',
    screenHeight: 0,
    screenWidth: 0,
    maxIndex: 0,
    empty: false,
    page: 1,
    canReach: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.renderProfit();
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
    //获取屏幕尺寸
    const screenWidth = wx.getSystemInfoSync().windowWidth;
    const screenHeight = wx.getSystemInfoSync().windowHeight - 85;
    this.data.screenHeight = screenHeight;
    this.data.screenWidth = screenWidth;
    this.setData({
      //获取页面初始状态图片数量，0.63为图片容器的高度值(63vw)，将代码中0.63改为你的容器对应高度
      maxIndex: screenHeight / (screenWidth * 0.575),
    })
  },
  // 滚动事件 
  onPageScroll(e) {
    //滚动距离+屏幕高度换算vw倍数
    let listIndex = (e.scrollTop + this.data.screenHeight) / (this.data.screenWidth * 0.575)
    if (listIndex > this.data.maxIndex) {
      this.setData({
        maxIndex: listIndex
      })
    }

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
      this.renderProfit();
    }
  },
  /**
   * 渲染收益
   */
  renderProfit: function () {
    let that = this;
    app.requestFunc('prize/profit', { page: that.data.page}, function sucFunc(d) {
      let _data = d.data;
      if (_data.profitList.length == 0) {
        that.data.canReach = false;
        if (that.data.page == 1) {
          that.setData({
            totalProfit: app.globalData.user.total_profit,
            balance: app.globalData.user.balance,
            empty: true
          })
        }
      } else {
        if(that.data.page == 1){
          that.setData({
            totalProfit: app.globalData.user.total_profit,
            balance: app.globalData.user.balance,
            profitList: that.data.profitList.concat(_data.profitList)
          });
        }else{
          that.setData({
            profitList: that.data.profitList.concat(_data.profitList)
          });
        }
        

      }
    });
  },
})