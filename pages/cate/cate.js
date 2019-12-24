// pages/cate/cate.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keywords:'',
    cateList:[],
    cate_id:'',
    min:0,
    max:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      cate_id: app.globalData.cate_id
    });
    app.requestFunc('cate/getCateList', {}, function sucFunc(d) {
      let _data = d.data;
      that.setData({
        cateList: _data.cateList
      });
    });

    this.renderWine();
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
  renderWine: function () {
    let that = this;
    app.requestFunc('cate/searchList', { cate_id: that.data.cate_id, keywords: that.data.keywords, min: that.data.min, max: that.data.max }, function sucFunc(d) {
      let _data = d.data;
      if (_data.wineList.length == 0) {
        that.data.canReach = false;
        if (that.data.page == 1) {
          that.setData({
            empty: true
          })
        }
      } else {
        if (that.data.page == 1) {
          that.setData({
            wineList: _data.wineList,
            empty: that.data.empty
          });
        } else {
          that.setData({
            wineList: that.data.wineList.concat(_data.wineList)
          });
        }

      }

    });
  },
  //点击搜索
  clickSearch: function (e) {
    this.skipSearch();
  },
  //input获取
  searchinput: function (e) {
    this.data.keywords = e.detail.value;
  },
  skipSearch: function () {
    let that = this;
    let keywords = this.data.keywords.replace(/(^\s)|(\s$)/g, "");
    if (keywords != '') {
      app.requestFunc('index/searchAdd', { keywords: keywords }, function sucFunc(d) {
        if (d.data.result.id != undefined) {
          that.data.searchList.push({ id: d.data.result.id, keywords: keywords })
          that.setData({
            searchList: that.data.searchList,
            show_search: true
          })
        }
      });
    }
    this.data.page = 1;
    this.data.canReach = true;
    this.data.empty = false;
    this.data.maxIndex = 0;

    this.renderWine();
  },
  //点击酒品
  clickWine: function (e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/index/detail?id=' + data.id,
    })
  },
})