//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    bannerList: [],
    labelList:[],
    centerBanner:{},
    wineList:[],
    brandList:[],
    siteInfo:{}
  },
  onLoad: function () {
    var that = this;
    app.requestFunc('index/index',{},function sucFunc(d){
      let _data = d.data;
      that.setData({
        bannerList: _data.bannerList,
        labelList: _data.labelList,
        centerBanner: _data.centerBanner,
        wineList: _data.wineList,
        brandList: _data.brandList,
        siteInfo: _data.siteInfo
      });
    });
  },
  //点击酒品
  clickWine: function (e) {
    let data = e.currentTarget.dataset;
    console.log(data);
    wx.navigateTo({
      url: '/pages/index/detail?id=' + data.id,
    })
  },
  //点击品牌
  clickBrand: function (e) {
    let data = e.currentTarget.dataset;
    console.log(data);
    wx.navigateTo({
      url: '/pages/index/searchlist?brand_id=' + data.id,
    })
  },
  //点击搜索
  clickSearch: function (e) {
    wx.navigateTo({
      url: '/pages/index/search',
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
