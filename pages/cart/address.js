// pages/cart/address.js
const app = getApp();
Page({
  data: {
    delBtnWidth: 160,
    addressList: [],
    isScroll: true,
    windowHeight: app.globalData.windowHeight + app.globalData.tabHeight,
    empty:false,
    isSelect:0,
    isBack:0
  },
  onLoad: function (options) {
    if(options.back != undefined) this.data.back = options.back;
  }, 
  onShow:function(){
    this.renderAddress();
  },
  drawStart: function (e) {
    // console.log("drawStart");  
    var touch = e.touches[0]

    for (var index in this.data.addressList) {
      var item = this.data.addressList[index]
      item.right = 0
    }
    this.setData({
      addressList: this.data.addressList,
      startX: touch.clientX,
    })

  },
  drawMove: function (e) {
    var touch = e.touches[0]
    var item = this.data.addressList[e.currentTarget.dataset.index]
    var disX = this.data.startX - touch.clientX

    if (disX >= 20) {
      if (disX > this.data.delBtnWidth) {
        disX = this.data.delBtnWidth
      }
      item.right = disX
      this.setData({
        isScroll: false,
        addressList: this.data.addressList
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        addressList: this.data.addressList
      })
    }
  },
  drawEnd: function (e) {
    var item = this.data.addressList[e.currentTarget.dataset.index]
    if (item.right >= this.data.delBtnWidth / 2) {
      item.right = this.data.delBtnWidth
      this.setData({
        isScroll: true,
        addressList: this.data.addressList,
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        addressList: this.data.addressList,
      })
    }
  },

/**
 * 删除操作
 */
  delItem: function (e) {
    let data = e.currentTarget.dataset;
    let that = this;
    app.requestFunc('cart/delAddress', {id:data.id}, function sucFunc(d) {
      that.data.addressList.splice(data.index,1);
      if(that.data.addressList.length == 0){
        that.setData({
          empty:true,
          addressList: []
        })
      }else{
        console.log(that.data.addressList);
        that.setData({
          addressList:that.data.addressList
        })
      }

    });
  },
  /**
   * 添加地址
   */
  addAddress:function(){
    wx.navigateTo({
      url: '/pages/cart/addressAdd',
    })
  },
  /**
 * 设置默认项
 */
  clickDefault: function (e) {
    let data = e.currentTarget.dataset;
    let that = this;
    if(that.data.isDefault != data.id){
      app.requestFunc('cart/setAddressDefault', { id: data.id }, function sucFunc(d) {
        that.data.addressList.forEach((item, index) => {
          if (item.id == data.id) {
            item.is_default = 1;
            that.data.isDefault = data.id;
          } else {
            item.is_default = 0;
          }
        });
        if (that.data.back == 1) {
          wx.navigateBack();
        }
        that.setData({
          addressList: that.data.addressList
        })

      }, true);
    }else{
      if(that.data.back == 1){
        wx.navigateBack();
      }
    }
    
  },
  /**
   * 渲染地址列表
   */
  renderAddress: function () {
    let that = this;
    app.requestFunc('cart/address', {}, function sucFunc(d) {
      let _data = d.data;
      if(_data.addressList.length == 0){
        that.setData({
          empty: true
        })
      }else{
        _data.addressList.forEach((item, i) => {
          item.right = 0;
          if(item.is_default == 1) that.data.isDefault = item.id
        })
        that.setData({
          addressList: _data.addressList
        })
      }
      
    });
  },

})