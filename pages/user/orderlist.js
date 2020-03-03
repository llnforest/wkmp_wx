// pages/user/orderlist.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    status: '100',
    scrollLeft: 0, //tab标题的滚动条位置
    orderList: { 0: [], 1: [], 2: [], 3: [], 4: [] },
    page: { 0: 1, 1: 1, 2: 1, 3: 1, 4: 1 },
    canReach: { 0: true, 1: true, 2: true, 3: true, 4: true },
    empty: { 0: false, 1: false, 2: false, 3: false, 4: false },
    currentList: ['100', '0', '1,2', '4', '3'],
  },
  onLoad: function (options) {
    var that = this;
    if (options.status != undefined && options.status != '100') {
      let current = this.data.currentList.indexOf(options.status);
      this.setData({
        status: options.status,
        currentTab: current
      })
    }
    this.renderOrder();
    // 高度自适应
    
    that.setData({
      winHeight: (app.globalData.windowHeight + app.globalData.tabHeight) * (750 / app.globalData.windowWidth)
    });
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    if (e.detail.current != this.data.currentTab) {
      this.setData({
        currentTab: e.detail.current,
        status: this.data.currentList[e.detail.current]
      });
      this.renderOrder();
    }

  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.currentTarget.dataset.current;
    if (this.data.status == cur) {
      return false;
    } else {
      let current = this.data.currentList.indexOf(cur);
      this.setData({
        currentTab: current,
        status: cur
      })
      this.renderOrder();
    }
  },
  /**
   * 去付款
   */
  goPay: function (e) {
    wx.navigateTo({
      url: '/pages/cart/pay?order_id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 去详情
   */
  goOrderDetail: function (e) {
    wx.navigateTo({
      url: '/pages/user/orderdetail?order_id=' + e.currentTarget.dataset.id,
    })
  },
  //点击酒品
  clickWine: function (e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/index/detail?id=' + data.id,
    })
  },
  /**
   * 取消订单
   */
  doCancel: function (e) {
    let order_id = e.currentTarget.dataset.id;
    var that = this;
    app.requestFunc('user/cancelOrder', { id: order_id }, function sucFunc(d) {
      that.setData({
        page: { 0: 1, 1: 1, 2: that.data.page[2], 3: that.data.page[3], 4: 1 },
        canReach: { 0: true, 1: true, 2: that.data.canReach[2], 3: that.data.canReach[3], 4: true },
        empty: { 0: false, 1: false, 2: that.data.empty[2], 3: that.data.empty[3], 4: false },
      })
      that.renderOrder();

    }, true);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  loadMore: function () {
    console.log('reach');
    if (!this.loading && this.data.canReach[this.data.currentTab]) {
      console.log('reach ok');
      this.renderOrder();
    }

  },
  /**
   * 渲染订单
   */
  renderOrder: function () {
    let that = this;
    if (!that.data.canReach[that.data.currentTab]) return false;
    let page = that.data.page[that.data.currentTab];
    app.requestFunc('user/orderList', { page: page, status: that.data.status }, function sucFunc(d) {
      let _data = d.data;
      if (_data.orderList.length == 0) {
        that.data.canReach[that.data.currentTab] = false;
        if (page == 1) {
          var empty = "empty[" + that.data.currentTab + "]";
          that.setData({
            [empty]: true
          })
        }
      } else {
        var orderList = "orderList[" + that.data.currentTab + "]";
        if (page == 1) {
          that.setData({
            [orderList]: _data.orderList
          });
        } else {
          that.setData({
            [orderList]: that.data.orderList[that.data.currentTab].concat(_data.orderList)
          });
        }

      }
      that.data.page[that.data.currentTab]++;
    });
  },

})