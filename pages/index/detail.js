// pages/index/detail.js
const app = getApp();
var common = require("../../utils/common.js");
import { routerFillter } from '../../utils/router.js';

routerFillter({

  /**
   * 页面的初始数据
   */
  data: {
    images: {},
    imgList: ['/images/img/detail1.jpg', '/images/img/detail2.jpg'],
    empty:false,
    empty_msg:'',
    info:{},
    xqtList:[],
    jptList:[],
    cart_num:0,
    is_img_show:"none"
  },
  imageLoad:function(e){
    common.imageLoad(e,this);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //更新上级
    if (options.share_id != undefined){
      app.requestFunc('user/renderParentId',{share_id:options.share_id});
    }

    app.requestFunc('index/detail', {id:options.id}, function sucFunc(d) {
      let _data = d.data;
      that.setData({
        xqtList: _data.xqtList,
        jptList: _data.jptList,
        info: _data.wineInfo,
        cart_num: _data.cart_num
      });
    }
    ,false
    ,function errFunc(d) {
      that.setData({
        empty: true,
        empty_msg: d.msg
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
    let share_id = app.globalData.user.id;
    let info = this.data.info;
    return {
      title: '悟空名品——'+info.wine_name,
      path: '/pages/index/detail?id='+info.id+'&share_id=' + share.id,
      success: function (res) { }
    }
  },
  //点击加入购物车
  addCart: function (e) {
    let that = this;
    app.requestClick('index/cartAdd', { wine_id: that.data.info.id }, function sucFunc(d) {
      let _data = d.data;
      that.setData({
        is_img_show: "block"
      })
      var animation = wx.createAnimation({
        duration: 700,
        timingFunction: 'ease',
        delay: 100
      });
      animation.opacity(0.5).scale(1.2).translate(0, -90).step();
      animation.opacity(0.2).scale(0.5).translate(0, 90).step();
      // this.setData({
        
      // })
      that.setData({
        cart_num: that.data.cart_num + _data.num,
        ani: animation.export(),
      });
    },true);
    

  
  },
  //点击立即购买
  goBuy: function (e) {
    let that = this;
    wx.navigateTo({
      url: '/pages/cart/order?ids=' + that.data.info.id + '&type=0',
    })
  },
  //点击购物车
  goCart: function (e) {
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },
},true)