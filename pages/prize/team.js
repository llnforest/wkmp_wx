// pages/prize/team.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vipList: [],
    tgList: [],
    gjList: [],
    level:1,
    userInfo: [],
    screenHeight: 0,
    screenWidth: 0,
    vipMaxIndex: 0,
    tgMaxIndex: 0,
    gjMaxIndex: 0,
    vip_empty: false,
    tg_empty: false,
    gj_empty: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.renderTeam();
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
    const screenHeight = wx.getSystemInfoSync().windowHeight - 175;
    this.data.screenHeight = screenHeight;
    this.data.screenWidth = screenWidth;
    this.setData({
      //获取页面初始状态图片数量，0.63为图片容器的高度值(63vw)，将代码中0.63改为你的容器对应高度
      vipMaxIndex: screenHeight / (screenWidth * 0.441),
      tgMaxIndex: screenHeight / (screenWidth * 0.441),
      gjMaxIndex: screenHeight / (screenWidth * 0.441),
    })
  },
  // 滚动事件 
  onPageScroll(e) {
    //滚动距离+屏幕高度换算vw倍数
    let listIndex = (e.scrollTop + this.data.screenHeight) / (this.data.screenWidth * 0.441)
    if(this.data.level == 1){
      if (listIndex > this.data.vipMaxIndex) {
        this.setData({
          vipMaxIndex: listIndex
        })
      }
    } else if (this.data.level == 2) {
      if (listIndex > this.data.tgMaxIndex) {
        this.setData({
          tgMaxIndex: listIndex
        })
      }
    } else if (this.data.level == 3) {
      if (listIndex > this.data.gjMaxIndex) {
        this.setData({
          gjMaxIndex: listIndex
        })
      }
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
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 渲染团队
   */
  renderTeam: function () {
    let that = this;
    app.requestFunc('prize/team', {level:that.data.level }, function sucFunc(d) {
      let _data = d.data;
      if(that.data.level == 1){
        if (_data.teamList.length == 0) {
            that.setData({
              userInfo: app.globalData.user,
              vip_empty: true
            })
        } else {
            that.setData({
              userInfo: app.globalData.user,
              vipList: _data.teamList
            });
        }
      } else if (that.data.level == 2) {
        if (_data.teamList.length == 0) {
          that.setData({
            tg_empty: true
          })
        } else {
          that.setData({
            tgList: _data.teamList
          });
        }
      } else if (that.data.level == 3) {
        if (_data.teamList.length == 0) {
          that.setData({
            gj_empty: true
          })
        } else {
          that.setData({
            gjList: _data.teamList
          });
        }
      }
      
    });
  },
  /**
   * 点击等级
   */
  clickLevel:function(e){
    let data = e.currentTarget.dataset;
    this.setData({
      level:data.level
    })
    if(this.data.level == 1 && !this.data.vip_empty && this.data.vipList.length == 0){
      this.renderTeam();
    } else if (this.data.level == 2 && !this.data.tg_empty && this.data.tgList.length == 0) {
      this.renderTeam();
    } else if (this.data.level == 3 && !this.data.gj_empty && this.data.gjList.length == 0) {
      this.renderTeam();
    }
  }
})