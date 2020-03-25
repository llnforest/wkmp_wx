const appGlobalData = getApp().globalData;

/**
 * routerFillter --全局路由拦截器
 * @function
 * @param{Object} pageObj 当前页面的page对象
 * @param{Boolean} flag 是否开启权限判断
 */
exports.routerFillter = function (pageObj, flag = false) {
  if (flag) {
    let _onLoad = pageObj.onLoad
    pageObj.onLoad = function (options) {
      let that = this
      if (appGlobalData.token == "") {
        //判断获取token是否完成
        getApp().userLogin().then((res) => {
          _onLoad.call(that);
        },(res) => {
          console.log(res);
          getApp().toast('网络异常')
        })

      } else {
        if (appGlobalData.token == "") {
          
        }
        _onLoad.call(that, options);
      }
    }
  }
  return Page(pageObj)
}
