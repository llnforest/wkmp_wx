// pages/user/userinfoEdit.js

const app = getApp();
const md5 = require('../../utils/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    phone:'',
    code:'',
    sec:0,
    isAble:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: app.globalData.user.name,
      phone:app.globalData.user.phone
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //input获取
  nameinput: function (e) {
    this.data.name = e.detail.value.replace(/(^\s)|(\s$)/g, "");
    return this.data.name;
  },
  //input获取
  phoneinput: function (e) {
    this.data.phone = e.detail.value.replace(/(^\s)|(\s$)/g, "");
    return this.data.phone;
  },
  //input获取
  codeinput: function (e) {
    this.data.code = e.detail.value.replace(/(^\s)|(\s$)/g, "");
    return this.data.code;
  },
  /**
   * 发送验证码
   */
  sendCode:function(e){
    var that = this;
    if (that.data.phone == app.globalData.userInfo.phone) {
      app.toast('手机号码未修改');
      return false;
    }
    var randNum = Math.floor(Math.random()*10000);//产生一个随机数
    var secret = md5.hexMD5(that.data.phone + app.globalData.sms_random + randNum);
    app.requestFunc('sms/SendCode', {phone: that.data.phone,num:randNum,secret:secret}, function sucFunc(d) {
      that.setData({
        sec: 60
      })
      //定时器
      var timer = setInterval(function () {
        that.setData({
          sec: that.data.sec-1
        })
        if (that.data.sec <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    },true);
  },
  //确认保存
  sureSubmit:function(e){
    var that = this;
    if (that.data.phone == app.globalData.userInfo.phone){
      app.toast('手机号码未修改');
      return false;
    }
    if (that.data.phone == "") {
      app.toast('请填写手机号')
      return fasle;
    }
    if (that.data.code == "") {
      app.toast('请填写验证码')
      return fasle;
    }
    app.requestFunc('user/editUser', {phone:that.data.phone,name:that.data.name,code:that.data.code}, function sucFunc(d) {
      app.globalData.user.name = that.data.name;
      app.globalData.user.phone = that.data.phone;
      //2s后回退
      setTimeout(function () {
        wx.navigateBack();
      },2000);
      
    },true);
  }
})