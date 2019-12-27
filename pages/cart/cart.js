// pages/cart/cart.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    empty:false,
    cartList:[],
    total_money:0,
    buyIds:[],
    delIds:[],
    editModel:false,
    selectAll:true,
    dataIds:[],
    listIndex: 0,
    maxIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    this.renderCart();
    //获取屏幕尺寸
    const screenWidth = wx.getSystemInfoSync().windowWidth;
    const screenHeight = wx.getSystemInfoSync().windowHeight - 37;
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
    if (listIndex > this.data.maxIndex) {
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  renderCart: function () {
    let that = this;
    app.requestFunc('cart/cart', {}, function sucFunc(d) {
      let _data = d.data;
      if (_data.cartList.length == 0) {
          that.setData({
            empty: true
          })
      } else {
        let dataIds = [];
        let cartData = [];
        _data.cartList.forEach(function(item,i){
          dataIds.push(item.id);
        })

        that.setData({
          cartList: _data.cartList,
          total_money:_data.total_money,
          dataIds:dataIds,
          buyIds:dataIds
        });
      }

    });
  },
  //全选、取消全选
  selectAll:function(e){
    if(this.data.selectAll){
      if(this.data.editModel){
        this.setData({
          delIds:[],
          selectAll:false
        })
      }else{
        this.setData({
          buyIds: [],
          selectAll: false,
          total_money: 0
        })
      }
    }else{
      if (this.data.editModel) {
        this.setData({
          delIds: this.data.dataIds,
          selectAll: true
        })
      } else {
        this.setData({
          buyIds: this.data.dataIds,
          selectAll: true,
          
        })
        this.rederTotalMoney();
      }
    }
  },
  //切换模式
  changeModel: function (e) {
    let data = e.currentTarget.dataset;
    
    if (data.id == 1) {
      this.setData({
        editModel: true,
        buyIds:[],
        delIds: [],
        selectAll: false,
        total_money:0
      })
    } else {
      this.setData({
        editModel: false,
        buyIds: [],
        delIds: [],
        selectAll:false
      })
    }

  },
  //点击选项
  clickSelect: function (e) {
    let data = e.currentTarget.dataset;
    let ids = [];
    if(!this.data.editModel){
      ids = this.data.buyIds;
    }else{
      ids = this.data.delIds;
    }
    let index = ids.indexOf(data.id);
    let selectAll = false;
    if(index > -1){
      ids.splice(index,1);
    }else{
      ids.push(data.id);
    }
    if(ids.length == this.data.dataIds.length){
      selectAll = true;
    }
    if (!this.data.editModel) {
      this.setData({
        buyIds:ids,
        selectAll:selectAll
      })
      this.rederTotalMoney();
    } else {
      this.setData({
        delIds: ids,
        selectAll: selectAll
      })
    }
    
  },
  //点击酒品
  clickWine: function (e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/index/detail?id=' + data.id,
    })
  },
  //点击去结算
  goBuy: function (e) {
    if (that.data.buyIds.length == 0){
      wx.showToast({
        title: "请先选择要购买商品",
        duration: 2000,
        icon: 'none',
      });
      return false;
    }
    let that = this;
    wx.navigateTo({
      url: '/pages/cart/order?ids=' + that.data.buyIds.join(','),
    })
  },
  delCart:function(e){
    let that = this;
    if (that.data.delIds.length == 0){
      wx.showToast({
        title: "请先选择要删除商品",
        duration: 2000,
        icon: 'none',
      });
      return false;
    }
    app.requestFunc('cart/delCart', {ids:that.data.delIds.join(',')}, function sucFunc(d) {
      let _data = d.data;
      if(that.data.selectAll){
        that.setData({
          empty:true
        })
      }else{
        that.data.delIds.forEach((item,i) => {
          let index = that.data.dataIds.indexOf(item);
          if(index > -1){
            that.data.dataIds.splice(index,1);
            that.data.cartList.splice(index, 1);
          }
        })
        that.setData({
          dataIds:that.data.dataIds,
          cartList:that.data.cartList,
          delIds:[]
        })
      }

    },true);
  },
  rederTotalMoney:function(){
    let that = this;
    let total_money = 0;
    this.data.cartList.forEach((item,i) => {
      let index = that.data.buyIds.indexOf(item.id);
      if(index > -1){
        total_money += item.quantity * item.mall_price
      }
    })
    this.setData({
      total_money:total_money
    })
  },
  clickOperate:function(e){
    let data = e.currentTarget.dataset;
    this.data.cartList.forEach((item, i) => {
      if (item.id == data.id) {
        if(data.type == 1){//增加
          if (item.quantity >= 100) {
            return false;
          }
          item.quantity = item.quantity + 1;
        }else{//减少
          if(item.quantity <= 1){
            return false;
          }
          item.quantity = item.quantity - 1;
        }
      }
    })
    this.setData({
      cartList: this.data.cartList
    })
    
    this.rederTotalMoney();
  }
})