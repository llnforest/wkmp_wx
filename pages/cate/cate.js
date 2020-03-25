// pages/cate/cate.js
const app = getApp()
import { routerFillter } from '../../utils/router.js';

routerFillter({

  /**
   * 页面的初始数据
   */
  data: {
    keywords:'',
    cateList:[],
    cate_id:'',
    price:{0:{min:0,max:0},1:{min:0,max:200},2:{min:200,max:500},3:{min:500,max:1000},4:{min:1000,max:0}},
    priceStatus:0,
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
    bai_scroll:0,
    hong_scroll: 0,
    pi_scroll: 0,
    yang_scroll: 0,
    is_render:true,
    searchKeywords:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //更新上级
    if (options.share_id != undefined) {
      app.requestFunc('user/renderParentId', { share_id: options.share_id });
    }
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
    let listIndex = (e.scrollTop + this.data.screenHeight) / (this.data.screenWidth * 0.262) * 2;
    //保存滚动位置
    // if (this.data.cate_id == 1) {
    //   this.data.bai_scroll = e.scrollTop;
    // } else if (this.data.cate_id == 2) {
    //   this.data.hong_scroll = e.scrollTop;
    // } else if (this.data.cate_id == 3) {
    //   this.data.pi_scroll = e.scrollTop;
    // } else if (this.data.cate_id == 4) {
    //   this.data.yang_scroll = e.scrollTop;
    // }

    //懒加载图片
    if (this.data.cate_id == 1 && listIndex > this.data.baiIndex) {
      this.setData({
        baiIndex: listIndex,
      })
    } else if (this.data.cate_id == 2 && listIndex > this.data.hongIndex) {
      this.setData({
        hongIndex: listIndex,
      })
    } else if (this.data.cate_id == 3 && listIndex > this.data.piIndex) {
      this.setData({
        piIndex: listIndex,
        
      })
    } else if (this.data.cate_id == 4 && listIndex > this.data.yangIndex) {
      this.setData({
        yangIndex: listIndex,
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
    let share_id = app.globalData.user.id;
    return {
      title: '悟空名品——分类',
      path: '/pages/cate/cate?share_id=' + share.id,
      success: function (res) { }
    }
  },
  renderWine: function () {
    let that = this;
    app.requestFunc('cate/searchList', { cate_id: that.data.cate_id, keywords: that.data.searchKeywords, min: that.data.price[that.data.priceStatus].min, max: that.data.price[that.data.priceStatus].max }, function sucFunc(d) {
      let _data = d.data;
      let _empty = false;
      if (_data.brandList.length == 0) {
        _empty = true;
      }
      that.data.is_render = false;
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
    this.data.keywords = e.detail.value.replace(/(^\s)|(\s$)/g, "");
    return this.data.keywords;
  },
  skipSearch: function () {
    let that = this;
    this.data.searchKeywords = this.data.keywords;
    console.log(this.data.searchKeywords);
    if (this.data.searchKeywords != '') {
      app.requestFunc('index/searchAdd', { keywords: that.data.searchKeywords }, function sucFunc(d) {
        
      });
    }
    

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
    if (this.data.cate_id == e.currentTarget.dataset.id) return false;
    this.setData({
      cate_id: e.currentTarget.dataset.id
    })
    // let scrollTop = 0;

    if (!this.data.is_render && this.data.cate_id == 1 && Object.keys(this.data.baiList).length > 0){
      // scrollTop = this.data.bai_scroll;
    } else if (!this.data.is_render && this.data.cate_id == 2 && Object.keys(this.data.hongList).length > 0) {
      // scrollTop = this.data.hong_scroll;
    } else if (!this.data.is_render && this.data.cate_id == 3 && Object.keys(this.data.piList).length > 0) {
      // scrollTop = this.data.pi_scroll;
    } else if (!this.data.is_render && this.data.cate_id == 4 && Object.keys(this.data.yangList).length > 0) {
      // scrollTop = this.data.yang_scroll;
    }else{
      this.renderWine();
    }
    
  },
  //点击价格
  clickPrice: function(e){
    let status = e.currentTarget.dataset.status;
    if (this.data.priceStatus == status){
      status = 0;
    }
    this.setData({
      priceStatus:status,
      baiIndex: this.data.maxIndex,
      hongIndex: this.data.maxIndex,
      yangIndex: this.data.maxIndex,
      piIndex: this.data.maxIndex,
      // bai_scroll: 0,
      // hong_scroll: 0,
      // pi_scroll: 0,
      // yang_scroll: 0,
      is_render:true,
      baiList:[],
      hongList: [],
      piList: [],
      yangList: [],
    })
    this.renderWine();

  }
},true)