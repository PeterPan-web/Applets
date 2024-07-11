//获取应用实例  
var app = getApp();
var common = require("../../utils/common.js");
Page({  
  data: {  
    winWidth: 0,  
    winHeight: 0,  
    // tab切换  
    currentTab: 0,  
    isStatus:'pay',//10待付款，20待发货，30待收货 40、50已完成
    page:0,
    refundpage:0,
    orderList0:[],
    orderList1:[],
    orderList2:[],
    orderList3: [],
    tj_0: 0,
    tj_1: 0,
    tj_2: 0,
    tj_3: 0
  },  
  onLoad: function(options) {  
    this.initSystemInfo();
    this.setData({
      currentTab: parseInt(options.currentTab),
      isStatus:options.otype
    });

    if(this.data.currentTab == 4){
      this.loadReturnOrderList();
    }else{
      this.loadOrderList();
    }
  },  
  getOrderStatus:function(){
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ?2 :this.data.currentTab == 3 ? 3:0;
  },

  //加载订单
loadOrderList: function(){
    var that = this;
    console.log('当前：' + that.data.currentTab,);
    wx.request({
      url: app.d.hostUrl + '/UserProperty_List.aspx',
      method:'post',  
      data: {
        user_id:wx.getStorageSync('userKeyID'),
        order_type:that.data.currentTab,
        page:that.data.page,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        var list = res.data.order;
        console.log(res.data.tj);
        that.setData({
          tj_0: res.data.tj[0].tj_0,
          tj_1: res.data.tj[0].tj_1,
          tj_2: res.data.tj[0].tj_2,
          tj_3: res.data.tj[0].tj_3,
        });
        switch(that.data.currentTab){
          case 0:
            that.setData({
              orderList0: list,
            });
            break;
          case 1:
            that.setData({
              orderList1: list,
            });
            break;  
          case 2:
            that.setData({
              orderList2: list,
            });
            break;
          case 3:
            that.setData({
              orderList3: list,
            });
            break;
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },

loadReturnOrderList:function(){
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/UserOrder_Refund.aspx',
      method:'post',
      data: {
        user_id:wx.getStorageSync('userKeyID'),
        page:that.data.refundpage,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data.ord;
        var status = res.data.status;
        if(status==1){
          that.setData({
            orderList4: that.data.orderList4.concat(data),
          });
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
    });
  },
  
  // returnProduct:function(){
  // },
  initSystemInfo:function(){
    var that = this; 
    wx.getSystemInfo( {
      success: function( res ) {  
        that.setData( {  
          winWidth: res.windowWidth,  
          winHeight: res.windowHeight  
        });  
      }    
    });  
  },

  bindChange: function(e) {  
    var that = this;  
    that.setData( { currentTab: e.detail.current });  
  },  

  swichNav: function(e) {  
    var that = this;  
    if( that.data.currentTab === e.target.dataset.current ) {  
      return false;  
    } else { 
      var current = e.target.dataset.current;
      that.setData({
        currentTab: parseInt(current),
        isStatus: e.target.dataset.otype,
      });
      console.log('currentTab:' + current);
      console.log('isStatus:' + e.target.dataset.otype);
      //没有数据就进行加载
      switch(that.data.currentTab){
          case 0:
            !that.data.orderList0.length && that.loadOrderList();
            break;
          case 1:
            !that.data.orderList1.length && that.loadOrderList();
            break;  
          case 2:
            !that.data.orderList2.length && that.loadOrderList();
            break;
          case 3:
            !that.data.orderList3.length && that.loadOrderList();
            break;
          case 4:
            that.data.orderList4.length = 0;
            that.loadReturnOrderList();
            break;
        }
    };
  },
  /**
   * 微信支付订单
   */
  // payOrderByWechat: function(event){
  //   var orderId = event.currentTarget.dataset.orderId;
  //   this.prePayWechatOrder(orderId);
  //   var successCallback = function(response){
  //     console.log(response);
  //   }
  //   common.doWechatPay("prepayId", successCallback);
  // },

  payOrderByWechat: function (e) {
    var order_id = e.currentTarget.dataset.orderId;
    var order_sn = e.currentTarget.dataset.ordersn;
    if(!order_sn){
      wx.showToast({
        title: "订单异常!",
        duration: 2000,
      });
      return false;
    }
    wx.request({
      url: app.d.hostUrl + '/Pay_Weixin.aspx',
      data: {
        order_id: order_id,
        order_sn: order_sn,
        uid: wx.getStorageSync('userKeyID'),
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        if (res.data.status == 1) {
          var order = res.data.arr;
          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,
            success: function (res) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: '../userCenter/Order?currentTab=1&otype=deliver',
                });
              }, 3000);
            },
            fail: function (res) {
              wx.showToast({
                title: res,
                duration: 3000
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function (e) {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  bindCheckout: function (e) {
    var orderNo = e.currentTarget.dataset.orderno;
    var tj_money = e.currentTarget.dataset.tj_money;
    console.log('订单号：' + orderNo);
    console.log('订单金额：' + tj_money);
    wx.navigateTo({
      url: '../order/ShopPay2?orderNo=' + orderNo,
    })
  },

})