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
    max:0,
    baiList:[],
    hongList: [],
    piList: [],
    yangList: [],
    bai_empty:false,
    hong_empty: false,
    pi_empty: false,
    yang_empty: false,
    baiIndex:0,
    hongIndex: 0,
    piIndex: 0,
    yangIndex: 0,

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
    //获取屏幕尺寸
    const screenWidth = wx.getSystemInfoSync().windowWidth;
    const screenHeight = wx.getSystemInfoSync().windowHeight - 185;
    this.data.screenHeight = screenHeight;
    this.data.screenWidth = screenWidth;
    this.data.maxIndex = screenHeight / (screenWidth * 0.262) * 2;
    console.log(screenHeight);
    console.log(screenHeight - 185);
    console.log(this.data.maxIndex);
    this.setData({
      //获取页面初始状态图片数量，0.63为图片容器的高度值(63vw)，将代码中0.63改为你的容器对应高度
      baiIndex: this.data.maxIndex,
      hongIndex: this.data.maxIndex,
      yangIndex: this.data.maxIndex,
      piIndex: this.data.maxIndex,

    })
  },
  // 滚动事件 
  onPageScroll(e) {
    //滚动距离+屏幕高度换算vw倍数
    let listIndex = (e.scrollTop + this.data.screenHeight) / (this.data.screenWidth * 0.262) * 2
    if (listIndex > this.data.maxIndex) {
      this.data.maxIndex = listIndex;
      this.setData({
        baiIndex: this.data.maxIndex,
        hongIndex: this.data.maxIndex,
        yangIndex: this.data.maxIndex,
        piIndex: this.data.maxIndex,
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
      let _empty = false;
      if (_data.brandList.length == 0) {
        _empty = true;
      }
      //根据cate_id 判断每个页面的数据
      if(that.data.cate_id == 1){
        that.setData({
          bai_empty: _empty,
          baiList:_data.brandList
        })
      } else if(that.data.cate_id == 2){
        that.setData({
          hong_empty: _empty,
          hongList: _data.brandList
        })
      } else if (that.data.cate_id == 3) {
        that.setData({
          pi_empty: _empty,
          piList: _data.brandList
        })
      }else{
        that.setData({
          yang_empty: _empty,
          yangList: _data.brandList
        })
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
  //点击分类
  clickCate: function (e) {
    this.setData({
      cate_id: e.currentTarget.dataset.id
    })
    this.renderWine();
  },
})