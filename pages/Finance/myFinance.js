//获取应用实例  
var app = getApp();
var common = require("../../utils/common.js");
Page({  
  data: {  
    winWidth: 0,  
    winHeight: 0, 
    currentTab: 0,  
    isStatus:'pay',//10待付款，20待发货，30待收货 40、50已完成
    page:0,
    refundpage:0,
    orderList0:[],
    Finance:{},
    billList:[],
    orderList2:[],
    orderList3:[],
    orderList4:[],
  },  

  onLoad: function(options) {  
    this.initSystemInfo();
    this.setData({
      currentTab: parseInt(options.currentTab),
      isStatus:options.otype
    });

    this.loadOrderList();
    this.getFinance();
  }, 

  getOrderStatus:function(){
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ?2 :this.data.currentTab == 3 ? 3:0;
  },

  //取消订单
  removeOrder:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.orderId;
    console.log('orderId:'+orderId);
    wx.showModal({
      title: '提示',
      content: '你确定要取消订单吗？',
      success: function(res) {
        res.confirm && wx.request({
          url: app.d.hostUrl + '/UserOrder_Deal.aspx',
          method:'post',
          data: {
            orderSN: orderId,
            OpType:'cancel',
          },
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var status = res.data.status;
            //console.log('OrderSN:' + res.data.orderSN);
            if(status == 1){

              wx.showToast({
                title: '订单取消成功！',
                duration: 2000
              });
              that.loadOrderList();
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

      }
    });
  },

  //确认收货
  recOrder:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.orderId;
    wx.showModal({
      title: '提示',
      content: '你确定已收到宝贝吗？',
      success: function(res) {
        res.confirm && wx.request({
          url: app.d.hostUrl + '/UserOrder_Edit.aspx',
          method:'post',
          data: {
            id: orderId,
            type:'receive',
          },
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var status = res.data.status;
            if(status == 1){
              wx.showToast({
                title: '操作成功！',
                duration: 2000
              });
              that.loadOrderList();
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

      }
    });
  },
  
  //加载订单
  loadOrderList: function(){
    var that = this;
    console.log('当前：' + that.data.currentTab,);
    wx.request({
      url: app.d.hostUrl + '/UserOrder_List.aspx',
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
          case 4:
            that.setData({
              orderList4: list,
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
          that.getFinance();
            break;
          case 1:
          that.getBillList();
            break;  
          case 2:
            !that.data.orderList2.length && that.loadOrderList();
            break;
          case 3:
            !that.data.orderList3.length && that.loadOrderList();
            break;
        }
    };
  },
  
  getFinance:function(){
    var that = this;
    console.log('当前：' + that.data.currentTab, );
    wx.request({
      url: app.d.hostUrl + '/UserBalance_Get.aspx',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('userKeyID'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        console.log('Status:' + status);
        //var list = res.data.order;
        that.setData({
          Finance: res.data.Finance[0],
        });

      },
      fail: function () {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },

  getBillList: function () {
    var that = this;
    console.log('当前：' + that.data.currentTab, );
    wx.request({
      url: app.d.hostUrl + '/UserBill_Get.aspx',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('userKeyID'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        console.log('Status:' + status);
        //var list = res.data.order;
        that.setData({
          billList: res.data.billList,
        });

      },
      fail: function () {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  
})