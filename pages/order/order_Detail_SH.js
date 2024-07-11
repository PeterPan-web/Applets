var app = getApp();
// pages/order/detail.js
Page({
  data:{
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
    orderId:0,
    orderData:{},
    proData:[],
    score_Deduct:0,
    total: 0,
    score_balance: 0,
    carts: [],
    rec_Address:{},
    rec_man:{},
    rec_mobile:{},
    rec_WLfirm:' ',
    rec_WLNo:' '
  },

  onLoad:function(options){
    this.setData({
      orderId: options.orderNo,
      rec_WLfirm:' ',
      rec_WLNo:' '
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
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if(status==1){
          var carts = res.data.detail;
          var order = res.data.order[0];
          that.setData({
            orderData: order,
            orderStatus: order.orderStatus,
            total: order.total,
            truePay: order.truePay,
            orderNo:order.orderNo,
            orderId: order.orderNo,
            carts:carts,
            rec_Address:order.rec_Address,
            rec_man:order.rec_man,
            rec_mobile:order.rec_mobile,
            rec_WLfirm:order.rec_WLfirm,
            rec_WLNo:order.rec_WLNo
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

  
  //库存减少
  bindMinus: function (e) {
    var that = this;
    if (that.data.orderStatus!='待付款'){
      console.log('不允许修改！');
      return;
    }
    
    var index = parseInt(e.currentTarget.dataset.index);
    var num = that.data.carts[index].BuyCount;
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num--;
    }
    console.log(num);
    var cart_id = e.currentTarget.dataset.cartid;
    wx.request({
      url: app.d.hostUrl + '/ShoppingCart_Update.aspx',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('userKeyID'),
        num: num,
        cart_id: cart_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          // 只有大于一件的时候，才能normal状态，否则disable状态
          var minusStatus = num <= 1 ? 'disabled' : 'normal';
          // 购物车数据
          var carts = that.data.carts;
          carts[index].BuyCount = num;
          // 按钮可用状态
          var minusStatuses = that.data.minusStatuses;
          minusStatuses[index] = minusStatus;
          // 将数值与状态写回
          that.setData({
            minusStatuses: minusStatuses
          });
          that.sum();
        } else {
          wx.showToast({
            title: '操作失败！',
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

  //库存增加
  bindPlus: function (e) {
    var that = this;
    console.log('修改前：'+that.data.carts[index].BuyCount);
    if (that.data.orderStatus != '待付款') {
      console.log('不允许修改！');
      return;
    }
    var index = parseInt(e.currentTarget.dataset.index);
    var num = that.data.carts[index].BuyCount;
    // 自增
    num++;
    console.log('增加后的库存数量：' + num);
    var cart_id = e.currentTarget.dataset.cartid;
    dataSet: e.currentTarget.dataset;
    console.log('购物DS：' + e.currentTarget.dataset);
    console.log('购物Id：' + cart_id);
    wx.request({
      url: app.d.hostUrl + '/ShoppingCart_Update.aspx',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('userKeyID'),
        num: num,
        cart_id: cart_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          // 只有大于一件的时候，才能normal状态，否则disable状态
          var minusStatus = num <= 1 ? 'disabled' : 'normal';
          // 购物车数据
          var carts = that.data.carts;
          carts[index].BuyCount = num;
          // 按钮可用状态
          var minusStatuses = that.data.minusStatuses;
          minusStatuses[index] = minusStatus;
          // 将数值与状态写回
          that.setData({
            minusStatuses: minusStatuses
          });
          that.sum();
        } else {
          wx.showToast({
            title: '操作失败！',
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

  bindCheckbox: function (e) {
    /*绑定点击事件，将checkbox样式改变为选中与非选中*/
    //拿到下标值，以在carts作遍历指示用
    var index = parseInt(e.currentTarget.dataset.index);
    //原始的icon状态
    var selected = this.data.carts[index].selected;
    var carts = this.data.carts;
    // 对勾选状态取反
    carts[index].selected = !selected;
    // 写回经点击修改后的数组
    this.setData({
      carts: carts
    });
    this.sum()
  },

  bindSelectAll: function () {
    // 环境中目前已选状态
    var selectedAllStatus = this.data.selectedAllStatus;
    // 取反操作
    selectedAllStatus = !selectedAllStatus;
    // 购物车数据，关键是处理selected值
    var carts = this.data.carts;
    // 遍历
    for (var i = 0; i < carts.length; i++) {
      carts[i].selected = selectedAllStatus;
    }
    this.setData({
      selectedAllStatus: selectedAllStatus,
      carts: carts
    });
    this.sum()
  },

  bindCheckout: function (e) {
    var orderNo = e.currentTarget.dataset.ordersn;
    var tj_money = e.currentTarget.dataset.tj_money;
    console.log('订单号：' + orderNo);
    console.log('订单金额：' + tj_money);
    wx.navigateTo({
      url: '../order/ShopPay2?orderNo=' + orderNo,
    })
  },

  ///批量删除
  bindDel: function () {
    var that = this;
    if (that.data.orderStatus != '待付款') {
      console.log('不允许删除！');
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
        title: '请选择要删除的商品！',
        duration: 2000
      });
      return false;
    }
    console.log('要删除的CartID值：' + toastStr);
    wx.request({
      url: app.d.hostUrl + '/ShoppingCart_Del.aspx',
      method: 'post',
      data: {
        cart_id: toastStr,//that.data.orderId,
        user_id: wx.getStorageSync('userKeyID'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          wx.showToast({
            title: '删除成功！',
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
    var score = 0;
    for (var i = 0; i < carts.length; i++) {
      //if (carts[i].selected) {
        total += carts[i].BuyCount * carts[i].price;
        score += carts[i].BuyCount * carts[i].score_Deduct;
      //}
    }
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
      total: '¥ ' + total,
    });
    console.log('score:' + score + ' score_balance:' + this.data.score_balance);
    if (score <= this.data.score_balance) {
      this.setData({
        score_Deduct: score,
      });
    } else {
      this.setData({
        score_Deduct: this.data.score_balance,
      });
    }

  },


  bindManual: function(e) {  
    var that = this;  
    var index = parseInt(e.currentTarget.dataset.index);
    var carts = that.data.carts;
    var cart_id = e.currentTarget.dataset.cartid;
    console.log('修改前：'+that.data.carts[index].BuyCount);
    carts[index].BuyCount = that.data.carts[index].BuyCount;
    if (that.data.orderStatus != '待付款') {
      console.log('不允许修改！');
      return;
    };
   
        carts[index].BuyCount = e.detail.value;
    
        wx.request({
          url: app.d.hostUrl + '/ShoppingCart_Update.aspx',
          method: 'post',
          data: {
            user_id: wx.getStorageSync('userKeyID'),
            num: e.detail.value,
            cart_id: cart_id
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var status = res.data.status;
            if (status == 1) {
              that.sum();
            } else {
              wx.showToast({
                title: '操作失败！',
                duration: 2000
              });
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

  //确认收货
  recOrder:function(e){
   var that = this;
   //var orderId = e.currentTarget.dataset.orderId;
   wx.showModal({
    title: '提示',
    content: '你确定已收到宝贝吗？',
    success: function(res) {
      res.confirm && wx.request({
        url: app.d.hostUrl + '/UserOrder_Edit.aspx',
        method:'post',
        data: {
          id:that.data.orderNo,
          type:'receive',
        },
        header: {
          'Content-Type':  'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var status = res.data.status;
          if(status == 1){
            that.setData({
              showModalStatus: false,
              orderStatus:'已完成'
            });
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


  // 点击立即确认发货
  doDelieve: function (e) {
    var that = this;
    if (wx.getStorageSync('userKeyID') == "1") {
      wx.showModal({
        title: "提示",
        content: "亲，还没有登录哦，我们先登录再回来购物吧!",
        complete: function () {
          wx.navigateTo({
            url: '../MemberShip/shopUserLogin?from1=proDetail&from2=proDetail&reId=' + that.data.productId + '&pageSort=common',
          })
        }
      })
      return;
    }

    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 10
    })

    this.animation = animation
    animation.translateY(300).step();
    animationData: animation.export();

     if (e.currentTarget.dataset.status == 1) {

      this.setData(
        {
          showModalStatus: true
        }
      );
     }
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
  },

  Input_WLfirm:function (e){
    this.setData({
      rec_WLfirm: e.detail.value,
    })
  },

  Input_WLNo:function (e){
    this.setData({
      rec_WLNo: e.detail.value,
    })
  },

  rec_confirm:function (e){
    var that=this;
    if (that.data.rec_WLfirm.length<3){
      wx.showModal({
        title: "提示",
        content: "请填写物流公司!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };
    if (that.data.rec_WLNo.length<5){
      wx.showModal({
        title: "提示",
        content: "请填写物流单号!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };
    wx.request({
      url: app.d.hostUrl + '/UserOrder_RecConfirm.aspx',
      data: {
        user_id:wx.getStorageSync('userKeyID'),
        orderId : that.data.orderId,
        rec_WLfirm: that.data.rec_WLfirm,
        rec_WLNo: that.data.rec_WLNo
      },
      method: 'POST',
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if(status==1){
          that.setData({
              showModalStatus: false,
              orderStatus:'待收货'
          });
          wx.showToast({
            title:'发货成功！',
            duration: 2000
          });
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
        wx.showToast({
          title:'网络异常！',
          duration: 2000
        });
      }
    })
  }

})