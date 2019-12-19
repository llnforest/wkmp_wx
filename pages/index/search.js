// pages/index/search.js
const app = getApp()

Page({

  data: {
    searchList: [],
    hotList: [],
    show_search:true,
    show_hot:true,
    keywords:'',
  },
  onLoad: function () {
    var that = this;
    app.requestFunc('index/search', {}, function sucFunc(d) {
      let _data = d.data;
      let show_search = _data.searchList.length == 0?false:true;
      let show_hot = _data.hotList.length == 0 ? false : true;

      that.setData({
        searchList: _data.searchList,
        hotList: _data.hotList,
        show_hot: show_hot,
        show_search: show_search
      });
    });
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
  //点击搜索项
  clickSearchItem: function (e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/index/searchlist?keywords=' + data.keywords,
    })
  },
  //点击删除最近搜索
  delSearch: function (e) {
    var that = this;
    app.requestFunc('index/searchDel', {}, function sucFunc(d) {
      that.setData({
        searchList: [],
        show_search: false
      });
    },true);
  },
  //点击搜索
  clickSearch: function (e) {
    this.skipSearch();
  },
  searchinput:function(e){
    this.data.keywords = e.detail.value;
  },
  skipSearch: function(){
    let that = this;
    let keywords = this.data.keywords.replace(/(^\s)|(\s$)/g, "");
    app.requestFunc('index/searchAdd', { keywords: keywords}, function sucFunc(d) {
      if(d.data.result.id != undefined){
        that.data.searchList.push({ id: d.data.result.id, keywords: keywords})
        that.setData({
          searchList: that.data.searchList,
          show_search:true
        })
      }
    });
    wx.navigateTo({
      url: '/pages/index/searchlist?keywords=' + keywords,
    })
  }
})