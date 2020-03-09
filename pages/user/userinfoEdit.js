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
    isAuth:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.user.headimgurl == null){
      this.setData({
        isAuth:false
      })
    }else{
      this.setData({
        name: app.globalData.user.name,
        phone: app.globalData.user.phone
      })
    }
    
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
    app.requestClick('sms/SendCode', {phone: that.data.phone,num:randNum,secret:secret}, function sucFunc(d) {
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
    app.requestClick('user/editUser', {phone:that.data.phone,name:that.data.name,code:that.data.code}, function sucFunc(d) {
      app.globalData.user.name = that.data.name;
      app.globalData.user.phone = that.data.phone;
      //2s后回退
      setTimeout(function () {
        wx.navigateBack();
      },2000);
      
    },true);
  },
  /**
   * 微信授权
   */
  bindGetUserInfo: function (res) {
    if (res.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      app.requestFunc(
        'user/updateWx', { nickname: res.detail.userInfo.nickName, headimgurl: res.detail.userInfo.avatarUrl}, function sucFunc(d) {
          that.setData({
            isAuth: true
          });
          app.globalData.user.headimgurl = res.detail.userInfo.avatarUrl;
          app.globalData.user.nickname = res.detail.userInfo.nickName;
        }
      )
      
      

    } else {

      //用户按了拒绝按钮

      wx.showModal({

        title: '警告',

        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',

        showCancel: false,

        confirmText: '返回授权',

        success: function (res) {

          // 用户没有授权成功，不需要改变 isHide 的值

          if (res.confirm) {

            console.log('用户点击了“返回授权”');

          }

        }

      });

    }

  

  },
})