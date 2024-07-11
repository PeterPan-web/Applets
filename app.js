// app.js
App({
  d: {
    hostUrl: 'https://api.lewon.net/Api_DGJ',
    userId: 1,
    userKeyID:'',
    fromID: '',
    storeID: '',
    openid: '',
    nickName:'',
    appId:"wx0e8af0a315f61527",
  },

  onLaunch: function (options) {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    console.log("本次场景值:", options.scene);
    wx.setStorageSync('scene', options.scene);
    this.getUserInfo();
  },

  getUserInfo: function(e) {
    console.log("获取用户信息：01");
    var o = this;
    this.globalData.userInfo ? ("function" == typeof e && e(this.globalData.userInfo), 
    console.log("已经登录：02")) : wx.login({
        success: function(t) {
            var a = t.code;
            console.log("登录成功 code：" + a), wx.getUserInfo({
                success: function(t) {
                    t.userInfo, o.globalData.userInfo = t.userInfo, o.getUserSessionKey(a), "function" == typeof e && e(o.globalData.userInfo);
                }
            });
        }
    });
  },
  getUserSessionKey: function(e) {
    var o = this;
    wx.request({
        url: o.d.hostUrl + "/LoginSessionkey.aspx",
        method: "post",
        data: {
            code: e,
            appId:o.d.appId
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function(t) {
            var a = t.data;
            console.log("status:" + a.status);
            var n = a.openid, s = a.userKeyID, r = a.userMobile, i = a.user_NameC;
            if (console.log("获取openId:" + n), wx.setStorageSync("openId", n), console.log("获取userKeyID:" + s), 
            wx.setStorageSync("userKeyID", s), wx.setStorageSync("userMobile", r), wx.setStorageSync("loginNamec", i), 
            0 == a.status) return wx.showToast({
                title: a.err,
                duration: 2e3
            }), !1;
            o.globalData.userInfo.sessionId = e, o.globalData.userInfo.openid = n, o.globalData.userInfo.id = n, 
            o.globalData.userInfo.userKeyID = s, o.d.userId = s, o.d.userKeyID = s, o.d.openid = n;
        },
        fail: function(e) {
            wx.showToast({
                title: "网络异常！err:getsessionkeys",
                duration: 2e3
            });
        }
    });
  },

  //用户登录 
  // userLogin: function () {
  //   let that = this;
  //   let promise = new Promise((resolve, reject) => {
  //     wx.login({
  //       success: res => {
  //         wx.request({
  //           url: that.d.hostUrl + '/LoginSessionkey.aspx',
  //           data: { 
  //             code: res.code,
  //             appId:this.d.appId,
  //           },
  //           method:'post',
  //           header: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //           success: res => {
  //             var data = res.data;
  //             console.log('status:' + data.status);
        
  //             var openid = data.openid;
  //             var userKey = data.userKeyID;
              
  //             wx.setStorageSync('userKeyID', userKey);
  //             wx.setStorageSync('openId', openid);
  //             that.globalData.isLogin=true;

  //             if(data.status==0){
  //               wx.showToast({
  //               title: data.err,
  //               duration: 2000
  //             });
  //             return false;
  //             }
  //             resolve(res);
  //           },
  //           fail: err => {
  //             reject(err)
  //           }
  //         })
  //       }
  //     })
  //   })
  //   return promise;
  // },

  globalData:{
    userInfo:null,
    isLogin:false
  },

  onPullDownRefresh: function (){
    wx.stopPullDownRefresh();
  },

  currentPage: null,
  pageOnLoad: function (t) {
    this.page.onLoad(t);
  },
  pageOnReady: function (t) {
    this.page.onReady(t);
  },
  pageOnShow: function (t) {
    this.page.onShow(t);
  },
  pageOnHide: function (t) {
    this.page.onHide(t);
  },
  pageOnUnload: function (t) {
    this.page.onUnload(t);
  },
  page: require("utils/page.js"),
  getNavigationBarColor: function () {
    var e = this;
    e.request({
      url: api.default.navigation_bar_color,
      success: function (t) {
        0 == t.code && (wx.setStorageSync("_navigation_bar_color", t.data), e.setNavigationBarColor());
      }
    });
  },
  setNavigationBarColor: function () {
    var t = wx.getStorageSync("_navigation_bar_color");
    t && wx.setNavigationBarColor(t);
  },

});





