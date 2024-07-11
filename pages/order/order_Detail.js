var app = getApp();
// pages/order/detail.js
Page({
  data:{
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
    orderId:0,
    orderData:{},
    score_Deduct:0,
    total: 0,
    total_vip: 0,
    score_balance: 0,
    scorePay:0,
    carts: [],
    user_type:'',
    upgrade_ok:'no',
    mobile_tj:'0',
    money_refund:'0',
  },

  onLoad:function(options){
    this.setData({
      orderId: options.orderNo,
    })
    this.loadComsume(options.orderNo);
    
  },

  loadComsume: function (orderNo){
    var that = this;
    console.log('orderNo:' + orderNo);
    wx.request({
      url: app.d.hostUrl + '/userOrder_Detail.aspx',
      method:'post',
      data: {
        orderNo: orderNo,
        user_id:wx.getStorageSync('userKeyID')
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if(status==1){
          var carts = res.data.detail;
          var order = res.data.order[0];
          // var config=res.data.config[0];
          that.setData({
            orderData: order,
            orderStatus: order.orderStatus,
            total: order.total,
            truePay: order.truePay,
            scorePay:order.scorePay,
            orderNo:order.orderNo,
            orderId: order.orderNo,
            money_refund:order.money_refund,
            
            carts:carts,
            // config:config,
            user_type: res.data.user_type,
            mobile_tj:res.data.mobile_tj
          });
          that.sum();
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

  loadConsumerDetail: function (orderNo){
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/Dish_List_Get_had.aspx',
      method: 'post',
      data: {
        orderNo: orderNo,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          var catList = res.data.catList;
          that.setData({
            typeTree: catList,
            user_id: app.d.openid,
            //typeK: e
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000,
          });
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      }
    });
  },



  bindToastChange: function () {
    this.setData({
      toastHidden: true
    });
  },

  //统计
  sum: function () {
    var carts = this.data.carts;
    // 计算总金额
    var total = 0;
    var total_vip0 = 0;
    var score = 0;
    for (var i = 0; i < carts.length; i++) {
        total += carts[i].buyCount * carts[i].price;
        score += carts[i].buyCount * carts[i].EScore_Scores;
       
    }
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
      //total_vip: total_vip0,
      total: '¥ ' + total,
      truePay:total,
      scorePay:score
      
    });
    console.log('score:' + score + ' score_balance:' + this.data.score_balance);
    if (score <= this.data.score_balance) {
      this.setData({
        scorePay: score,
      });
    } else {
      this.setData({
        score_Deduct: this.data.score_balance,
      });
    }

  },

  bindGuaMai: function () {
    var that = this;
    if (that.data.orderStatus != '待发货') {
      console.log('不允许挂卖！');
      return;
    }
    // 初始化toastStr字符串
    var toastStr = '';
    // 遍历取出已勾选的cid
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].selected) {
        toastStr += this.data.carts[i].CartID;
        toastStr += ',';
      }
    }
    toastStr += '0';
    if (toastStr == '0') {
      wx.showToast({
        title: '请选择要挂卖的商品！',
        duration: 2000
      });
      return false;
    }
    console.log('要挂卖的CartID值：' + toastStr);
    wx.request({
      url: app.d.hostUrl + '/ShoppingCart_GuaMai.aspx',
      method: 'post',
      data: {
        cart_id: toastStr,//that.data.orderId,
        orderNo:that.data.orderNo,
        user_id: wx.getStorageSync('userKeyID'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          wx.showToast({
            title: '挂卖成功！',
          });
          that.setData({
            carts: res.data.proData,
            total: '¥ 0',
          });

        } else {
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

  bindShowMobile:function () {
    var that=this;
    if (that.data.upgrade_ok='no'){
      that.setData({
        upgrade_ok:'confirm'
      });
    };
  },

  Input_mobile_tj: function (e) {
    this.setData({
      mobile_tj: e.detail.value,
    })
  },

  doCopyNo:function(){
    var data=this.data.orderData.LogisticsNo
    wx.setClipboardData({
      data,//要复制的内容
             success: function (res) {
               wx.getClipboardData({
                 success: function (res) {
                   console.log(res.data, 876) // data
                   wx.showToast({
                    icon: 'none',
                    title: '复制完成',
                  })
                }
              })
            }
          })
  },
  
  gotoShopPay:function() {
    //存回data
    wx.navigateTo({
      url: '../order/ShopPay2?orderNo=' + this.data.orderNo,
    })
  },
  
  showRefund:function(e) {
    var cartid = e.currentTarget.dataset.cartid;
    wx.navigateTo({
      url: '../order/tuihuo_basket?basket_id=' + cartid,
    })
  },

  bindManual: function(e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var num = e.detail.value;
  
    if (num>100){
      wx.showModal({
        title: "提示",
        content: "最多购买100!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            var carts = that.data.carts;
            carts[index].buyCount = 100;
            that.setData({
              carts:carts
            });
           return;
          } 
  
        }
      })
      return;
    };
    
    console.log('增加后的库存数量：'+e.detail.value);
    var cart_id = e.currentTarget.dataset.cartid;
    dataSet: e.currentTarget.dataset;
    console.log('购物DS：' + e.currentTarget.dataset);
    console.log('购物Id：' + cart_id);
    wx.request({
      url: app.d.hostUrl + '/ShoppingCart_Update.aspx',
      method:'post',
      data: {
        user_id: wx.getStorageSync('userKeyID'),
        num:num,
        cart_id:cart_id
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if(status==1){
          // 只有大于一件的时候，才能normal状态，否则disable状态
          var minusStatus = num <= 1 ? 'disabled' : 'normal';
          // 购物车数据
          var carts = that.data.carts;
          carts[index].buyCount = num;
          // 按钮可用状态
          var minusStatuses = that.data.minusStatuses;
          minusStatuses[index] = minusStatus;
          // 将数值与状态写回
          that.setData({
            minusStatuses: minusStatuses
          });
          that.sum();
        }else{
          wx.showToast({
            title: '操作失败！',
            duration: 2000
          });
        }
      },
      fail: function() {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  }, 

  onShareAppMessage: function () {
    return {
    title: '',
      path: '',
    success: function (res) {
     // 分享成功
    },
    fail: function (res) {
     // 分享失败
    }
   }
 },

})