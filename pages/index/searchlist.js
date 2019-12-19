// pages/index/searchlist.js
const app = getApp()

Page({

  data: {
    wineList: [],
    keywords: '',
    screenHeight:0,
    screenWidth:0,
    listIndex:0,
    maxIndex:0,
    empty:false,
    page:1,
    canReach:true,
  },
  onLoad: function (options) {
    console.log(options);
    let keywords = options.keywords != undefined?options.keywords:'';
    this.setData({
      keywords: keywords
    })
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
    //获取屏幕尺寸
    const screenWidth = wx.getSystemInfoSync().windowWidth;
    const screenHeight = wx.getSystemInfoSync().windowHeight;
    this.data.screenHeight = screenHeight;
    this.data.screenWidth = screenWidth;
    this.data.maxIndex = screenHeight / (screenWidth * 0.35);
    this.setData({
      //获取页面初始状态图片数量，0.63为图片容器的高度值(63vw)，将代码中0.63改为你的容器对应高度
      listIndex: this.data.maxIndex,
    })
  },
  // 滚动事件 
  onPageScroll(e) {
    //滚动距离+屏幕高度换算vw倍数
    let listIndex = (e.scrollTop + this.data.screenHeight) / (this.data.screenWidth * 0.35)
    if (listIndex > this.data.maxIndex){
      this.data.maxIndex = listIndex;
      this.setData({
        listIndex: listIndex
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
    if(!this.loading && this.data.canReach){
      this.data.page ++;
      this.renderWine();
    }

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
    }, true);
  },
  renderWine: function(){
    let that = this;
    app.requestFunc('index/searchList', { page:that.data.page,keywords: that.data.keywords }, function sucFunc(d) {
      let _data = d.data;
      if (_data.wineList.length == 0){
        that.data.canReach = false;
        if (that.data.page == 1){
          that.setData({
            empty: true
          })
        }
      }else{
        that.setData({
          wineList: that.data.wineList.concat(_data.wineList)
        });
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
    app.requestFunc('index/searchAdd', { keywords: keywords }, function sucFunc(d) {
      if (d.data.result.id != undefined) {
        that.data.searchList.push({ id: d.data.result.id, keywords: keywords })
        that.setData({
          searchList: that.data.searchList,
          show_search: true
        })
      }
    });
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