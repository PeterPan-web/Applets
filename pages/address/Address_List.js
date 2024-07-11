// pages/address/user-address/user-address.js
var app = getApp()
Page({
  data: {
    address: [],
    radioindex: '',
    pro_id:0,
    num:0,
    cartId:0,
    from1: {},
    from2: {},
    orderNo: {}
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      from1: options.from1,
      from2: options.from2,
      cartId: options.cartId,
      orderNo: options.orderNo,
    })
    // 页面初始化 options为页面跳转所带来的参数
    //var cartId = options.cartId;
    console.log(wx.getStorageSync('userKeyID'));
    wx.request({
      url: app.d.hostUrl + '/Address_Get.aspx',
      data: {
        user_id:wx.getStorageSync('userKeyID'),
      },
      method: 'POST', 
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var address = res.data.address;
        console.log(address);
        if (address == '') {
          var address = []
        }
        that.setData({
          address: address,
          //cartId: cartId,
        })
      },
      fail: function () {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
    
  },

  onReady: function () {
    // 页面渲染完成
  },
  setDefault: function(e) {
    var that = this;
    var addrId = e.currentTarget.dataset.id;
    wx.request({
      url: app.d.hostUrl + '/Address_Deal.aspx',
      data: {
        uid_id:wx.getStorageSync('userKeyID'),
        addr_id:addrId,
        action_D:'SetDefault'
      },
      method: 'POST',
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        var cartId = that.data.cartId;
        if(status==1){
          if (cartId) {
            wx.redirectTo({
              //url: '../order/pay?cartId=' + cartId,
              url: '../' + that.data.from1 + '/' + that.data.from2 + '?orderNo=' + cartId + '&cartId=' + cartId,
            });
            return false;
          }
          wx.showToast({
            title: '操作成功！',
            duration: 2000
          });
          
          that.DataonLoad();
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },
  delAddress: function (e) {
    var that = this;
    var addrId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function(res) {
        res.confirm && wx.request({
          url: app.d.hostUrl + '/Address_Deal.aspx',
          data: {
            user_id:wx.getStorageSync('userKeyID'),
            addr_id:addrId,
            action_D:'Del',
          },
          method: 'POST', 
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          
          success: function (res) {
            var status = res.data.status;
            if(status==1){
              that.DataonLoad();
            }else{
              wx.showToast({
                title: res.data.err,
                duration: 2000
              });
            }
          },
          fail: function (){
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          }
        });
      }
    });

  },
  DataonLoad: function () {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: app.d.hostUrl + '/Address_Get.aspx',
      data: {
        user_id:wx.getStorageSync('userKeyID'),
      },
      method: 'POST', 
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var address = res.data.adds;
        if (address == '') {
          var address = []
        };
        that.setData({
          address: address,
        });
        wx.navigateTo({
          url: '../address/Address_List',
        });
      },
      fail: function (){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
    
  },
})