// pages/prize/gift.js
const app = getApp();
var common = require("../../utils/common.js");
import { routerFillter } from '../../utils/router.js';
routerFillter({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:[],
    giftList:[],
    selected:0,
    phone:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //更新上级
    if (options.share_id != undefined) {
      app.requestFunc('user/renderParentId', { share_id: options.share_id });
    }
    this.renderGift();
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
    this.renderUser();
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
      title: '悟空名品——会员礼包',
      path: '/pages/prize/gift?share_id=' + share.id,
      success: function (res) { }
    }
  },
  /**
   * 点击立即开通
   */
  editUser: function (e) {
    wx.navigateTo({
      url: '/pages/user/userinfoEdit',
    })
  },
  /**
   * 渲染个人信息
   */
  renderUser: function () {
    let that = this;
    app.requestFunc('prize/getGiftUserInfo', {},function(d){
      that.setData({
        userInfo: d.data.userInfo
      })
    });
  },
  /**
   * 渲染礼品
   */
  renderGift: function () {
    let that = this;
    app.requestFunc('prize/gift', {}, function sucFunc(d) {
      let _data = d.data;
      that.setData({
        giftList: _data.giftList,
        selected: _data.selected
      })
    });
  },
  //input获取
  phoneinput: function (e) {
    this.data.phone = e.detail.value.replace(/(^\s)|(\s$)/g, "");
    return this.data.phone;
  },
  /**
   * 点击选择
   */
  clickItem: function (e) {
    let data = e.currentTarget.dataset;
    if (this.data.selected != data.id) {
      this.setData({
        selected:data.id
      });
    }
   
  },
  /**
   * 立即开通
   */
  goBuy: function (e) {
    if(this.data.phone == ''){
      wx.showToast({
        title: '请输入邀请码',
        duration: 2000,
        icon: 'none',
      });
      return false;
    }

    let that = this;


    app.requestClick('cart/makeOrderGift', { gift_type: this.data.selected, phone: this.data.phone }, function sucFunc(d) {
      let _data = d.data;
      app.requestFunc('wxpay/createOrder', { order_id: _data.id, type: 2 }, function sucFunc(d) {
        let _data = d.data;
        common.doWechatPay(_data.prepay_id,
          function () {//成功
            wx.showToast({
              title: '支付成功',
            })
            wx.navigateTo({
              url: '/pages/index/index',
            })
          }, function () {//失败
            wx.showToast({
              title: '支付失败',
            })
          }, function () {//完成

          });

      });
      

    });
  },
},true)