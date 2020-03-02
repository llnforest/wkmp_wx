// pages/cart/order.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAble:true,
    wineList:[],
    empty:false,
    addressNo:false,
    addressInfo:[],
    express_type:1,
    shop_name:'',
    shop_id:0,
    user_remark:'',
    perExpress:0,
    baseExpress:0,
    count:0,
    expressPrice:0,
    vip_money:'',
    total_money:'',
    userLevel:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    options.ids = 6;
    if(options.ids == "" || options.ids == undefined){
      this.setData({
        empty:ture,
      })
    }else{
      this.renderOrder(options);
    }
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
    if(this.data.shop_id == 0 && this.data.express_type == 2){
      this.setData({
        express_type:1
      });
    }
    this.renderDefaultAddress();
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
   * 渲染订单
   */
  renderOrder: function (options) {
    let that = this;
    app.requestFunc('cart/order', { ids: options.ids, type: options.type || 0 }, function sucFunc(d) {
      let _data = d.data;
      if(_data.wineList.lengh == 0){
        that.setData({
          empty:true
        })
      }else{
        let count = parseInt(_data.count);
        let perExpress = parseInt(_data.perExpress);
        let baseExpress = parseInt(_data.baseExpress);
        that.setData({
          wineList:_data.wineList,
          count: count,
          perExpress: perExpress,
          baseExpress: baseExpress,
          expressPrice:baseExpress + perExpress * count,
          vip_money:_data.vip_money,
          total_money:_data.total_money,
          // userLevel: app.globalData.user.level,
          userLevel:1
        })
        
      }
    });
  },
  /**
   * 渲染默认地址
   */
  renderDefaultAddress: function () {
    let that = this;
    app.requestFunc('cart/getDefaultAddress', { }, function sucFunc(d) {
      let _data = d.data;
      if(_data.addressInfo == ""){
        that.setData({
          addressNo: true
        })
        wx.navigateTo({
          url: '/pages/cart/addressAdd',
        })
      }else{
        that.setData({
          addressInfo:_data.addressInfo
        })
      }
    });
  },
  //input获取
  remarkinput: function (e) {
    this.data.user_remark = e.detail.value.replace(/(^\s)|(\s$)/g, "");
    return this.data.user_remark;
  },
  //点击添加地址
  addAddress: function (e) {
    wx.navigateTo({
      url: '/pages/cart/addressAdd',
    })
  },
  //点击地址
  goAddress: function (e) {
    wx.navigateTo({
      url: '/pages/cart/address?back=1',
    })
  },
  //点击开通会员
  goGift: function (e) {
    wx.navigateTo({
      url: '/pages/prize/gift',
    })
  },
  /**
   * 选择配送方式
   */
  selectType:function(e){
    let data = e.currentTarget.dataset;
    if(data.type != this.data.express_type || data.type == 2){
      this.setData({
        express_type:data.type
      })
      if(data.type == 2){
        wx.navigateTo({
          url: '/pages/cart/shop?id='+this.data.shop_id,
        })
      }
    }
  },
  //提交订单
  sureSubmit: function (e) {
    var that = this;
    if (!that.data.isAble) return false;
    let wineList = [];
    that.data.wineList.forEach((item,index) => {
      wineList.push({id:item.id,quantity:item.quantity});
    })
    console.log(JSON.stringify(wineList));
    app.requestFunc('cart/makeOrder', { wineList: JSON.stringify(wineList),shop_id: that.data.shop_id,express_type: that.data.express_type, user_remark: that.data.user_remark, address_id: that.data.addressInfo.id }, function sucFunc(d) {
      that.data.isAble = false;
      let _data = d.data;
      wx.redirectTo({
        url: '/pages/cart/pay?order_id=' + _data.id,
      })

    }, true);
  },
  /**
   * 计算总价格
   */
  rederTotalMoney: function () {
    let that = this;
    let total_money = 0;
    let vip_money = 0;
    this.data.wineList.forEach((item, i) => {
      total_money += item.quantity * item.mall_price
      vip_money += item.quantity * item.vip_price
    })
    this.setData({
      total_money: total_money,
      vip_money:vip_money
    })
  },
  /**
   * 加减数量事件
   */
  clickOperate: function (e) {
    let data = e.currentTarget.dataset;
    this.data.wineList.forEach((item, i) => {
      if (item.id == data.id) {
        if (data.type == 1) {//增加
          if (item.quantity >= 100) {
            return false;
          }
          item.quantity = item.quantity + 1;
          this.data.expressPrice += this.data.perExpress;
        } else {//减少
          if (item.quantity <= 1) {
            return false;
          }
          item.quantity = item.quantity - 1;
          this.data.expressPrice -= this.data.perExpress;
        }
      }
    })
    this.setData({
      wineList: this.data.wineList,
      expressPrice:this.data.expressPrice
    })

    this.rederTotalMoney();
  }
})