// pages/panic/panic.js
var app = getApp();

Page({
  data:{
    quan: [],
    // quan1: [],
    // quan2: [],
    // quan3: [],
    currentTab: 0,
  },
   like:function(e){
    console.log(e.currentTarget.dataset.title)
    wx.navigateTo({
      url: '../proDetail/proDetail?title='+e.currentTarget.dataset.title,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({
      currentTab: options.currentTab,
    });
    switch (options.currentTab) {
      case '0':
        that.loadQuan();
        break;
      case '1':
        that.loadQuan1();
        break;
      case '2':
        that.loadQuan2();
        break;
    }
  },

  loadQuan: function () {
    var that = this;
    console.log('当前选项：' + that.data.currentTab);
    wx.request({
      url: app.d.hostUrl + '/myService_Get.aspx',
      method: 'post',
      data: {
        username: wx.getStorageSync("openId")
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var quan = res.data.quan;
        var status = res.data.status;
        if (status == 1) {
              that.setData({
                quan: quan,
              });  
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
        //endInitData
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },

  loadQuan1: function () {
    var that = this;
    console.log('当前选项：' + that.data.currentTab);
    wx.request({
      url: app.d.hostUrl + '/myService_Get.aspx',
      method: 'post',
      data: {
        username: wx.getStorageSync("openId")
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var quan1 = res.data.quan1;
        var status = res.data.status;
        if (status == 1) {
              that.setData({
                quan: quan1,
              });
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },

  loadQuan2: function () {
    var that = this;
    console.log('当前选项：' + that.data.currentTab);
    wx.request({
      url: app.d.hostUrl + '/myService_Get.aspx',
      method: 'post',
      data: {
        username: wx.getStorageSync("openId")
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var quan2 = res.data.quan2;
        var status = res.data.status;
        if (status == 1) {  
              that.setData({
                quan: quan2,
              });
             
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
        //endInitData
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },

  loadQuan3: function () {
    var that = this;
    console.log('当前选项：' + that.data.currentTab);
    wx.request({
      url: app.d.hostUrl + '/Coupon_Get.aspx',
      method: 'post',
      data: {
        username: wx.getStorageSync("openId")
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var quan3 = res.data.quan3;
        var status = res.data.status;
        if (status == 1) {  
              that.setData({
                quan: quan3,
              });
             
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
        //endInitData
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },

  getOrderStatus: function () {
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ? 2 : this.data.currentTab == 3 ? 3 : 0;
  },


  //bindChange: function (e) {
  //  var that = this;
  //  that.setData({ currentTab: e.detail.current });
  //},

  swichNav: function (e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var current = e.target.dataset.current;
      that.setData({
        currentTab: parseInt(current),
      });
      console.log('currentTab_:' + current);
      console.log('openId:' + wx.getStorageSync('openId'));
      //console.log('isStatus:' + e.target.dataset.otype);
      //没有数据就进行加载
      switch (current) {
        case '0':
          that.loadQuan();
          break;
        case '1':
          that.loadQuan1();
          break;
        case '2':
          that.loadQuan2();
          break;
        case '3':
          that.loadQuan3();
          break;
      }
    };
  },

})