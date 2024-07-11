var app = getApp();
Page({
  data:{
    page:1,
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
    total: 0,
    total_vip: 0,
    score_balance: 0,
    kcc_balance:0,
    carts: [],
    dataSet:[],
    productData:[],
    user_type:'',
    upgrade_ok:'no',
    mobile_tj:'0',
  },

  // #加载购物车里的数据开始
  loadProductData: function () {
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/ShoppingCart_Get.aspx',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('userKeyID')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var cart = res.data.proData;
        that.setData({
          carts:cart,
          score_balance:res.data.score,
          user_type: res.data.user_type,
          mobile_tj:res.data.mobile_tj
        });
      },
    });
  },
  //#加载购物车里的数据结束
//库存减少
bindMinus: function(e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var num = that.data.carts[index].buyCount;
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num --;
    }
    console.log(num);
    var cart_id = e.currentTarget.dataset.cartid;
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
          carts[index].BuyCount = num;
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

//库存增加
bindPlus: function(e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var num = that.data.carts[index].BuyCount;
    // 自增
    num ++;
    console.log('增加后的库存数量：'+num);
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

bindCheckbox: function(e) {
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

bindSelectAll: function() {
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

bindCheckout: function() {
  var that=this;
   // 初始化toastStr字符串
   var toastStr = '';
   // 遍历取出已勾选的cid
   for (var i = 0; i < this.data.carts.length; i++) {
     if (this.data.carts[i].selected) {
       toastStr += this.data.carts[i].CartID;
       toastStr += ',';
     }
   }
   if (toastStr==''){
     wx.showToast({
       title: '请选择要结算的商品！',
       duration: 2000
     });
     return false;
   }
   console.log('要结算的CartID值：' + toastStr);
   if (that.data.total_vip>0){
    wx.showModal({
      title: "升级未达标提示",
      content: '还不足升级金额，是否继续付款？',
      showCancel: 1,
      success: function (t) {
       console.log(t.confirm);
       if (t.confirm){
        wx.navigateTo({
          url: '../order/ShopPay?mobile_tj=0&orderNo=' + toastStr+'0',
        })
       }
      }
    });
   } else{

    wx.navigateTo({
      url: '../order/ShopPay?mobile_tj=0&orderNo=' + toastStr+'0',
    })
   }

   
   //存回data
  
 },

 bindCheckout_up: function() {
  if (this.data.mobile_tj.length!=11){
    wx.showModal({
      title: "提示",
      content: "请填写推荐人手机号!",
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
         return;
        } 
      }
    })
    return;
  };
  
  var that=this;
    wx.request({
      url: app.d.hostUrl + '/bongMobile_tj.aspx',
      data:{
        mobile_tj:that.data.mobile_tj,
        user_id: wx.getStorageSync('userKeyID'),
      },
      method: 'POST', 
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        var reference_status = res.data.reference_status;
        if(status==1&&reference_status=='yes'){
          that.setData({
            upgrade_ok:'no'
          });
          that.gotoShopPay();
        }else{
          wx.showToast({
            title: '验证失败',
            icon: 'success',
            duration: 2000,
          });
        }
      },
    })

},

gotoShopPay:function() {
  // 初始化toastStr字符串
  var toastStr = '';
  // 遍历取出已勾选的cid
  for (var i = 0; i < this.data.carts.length; i++) {
    if (this.data.carts[i].selected) {
      toastStr += this.data.carts[i].CartID;
      toastStr += ',';
    }
  }
  if (toastStr==''){
    wx.showToast({
      title: '请选择要结算的商品！',
      duration: 2000
    });
    return false;
  }
  console.log('要结算的CartID值：' + toastStr);
  //存回data
  wx.navigateTo({
    url: '../order/ShopPay?mobile_tj='+this.data.mobile_tj+'&orderNo=' + toastStr+'0',
  })


},

///批量删除
bindDel: function () {
  var that = this;
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
          carts:res.data.proData,
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

 bindToastChange: function() {
   this.setData({
     toastHidden: true
   });
 },

//统计
sum: function() {
    var carts = this.data.carts;
    // 计算总金额
    var total = 0;
    var total_vip = 0;
    var score = 0;
    var EXScoreTJ = 0;
    var lc_givenTJ = 0;
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].selected) {
        total += carts[i].buyCount * carts[i].price;
        score += carts[i].buyCount * carts[i].score_Deduct;
        EXScoreTJ += carts[i].buyCount * carts[i].EScore_Scores;
        lc_givenTJ += carts[i].buyCount * carts[i].LC_Given;
        if (carts[i].proDepart=='创客专区'||carts[i].proDepart=='理事专区'){
          total_vip += carts[i].buyCount * carts[i].price;
        }
      }
    }
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
      total: total,
      total_vip:total_vip,
      EXScoreTJ: EXScoreTJ,
      lc_givenTJ: lc_givenTJ,
    });
  console.log('score:' + score + ' score_balance:' + this.data.score_balance);
    if (score<=this.data.score_balance){
      this.setData({
        score_Deduct: score,
        EXScoreTJ: EXScoreTJ,
      });
    }else{
      this.setData({
        score_Deduct: this.data.score_balance,
      });
    }

},

onLoad:function(options){
    wx.removeTabBarBadge({//这个方法为移除当前tabbar右上角的文本
     index: 1,		 //代表哪个tabbar（从0开始）
    });
    this.loadProductData();
    this.sum();
},

  onShow:function(){
    this.setData({
    total:0,
    total_vip:0,
    upgrade_ok:'no',
    selectedAllStatus:false,
    });
    this.loadProductData();
  },

  removeShopCard:function(e){
    var that = this;
    var cardId = e.currentTarget.dataset.cartid;
    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function(res) {
        res.confirm && wx.request({
          url: app.d.hostUrl + '/ShoppingCart_Del.aspx',
          method:'post',
          data: {
            cart_id: cardId,
          },
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var data = res.data;
            if(data.status == 1){
              //that.data.productData.length =0;
              that.loadProductData();
            }else{
              wx.showToast({
                title: '操作失败！',
                duration: 2000
              });
            }
          },
        });
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

  goUpgrade:function () {
    console.log('开始跳转');
    wx.navigateTo({
      url: '../proSpecial/proSpecial?sort=810&title=创客专区',
      success: function(res) {
      },
      fail: function(res) {
      },
      complete: function(res) {
      },
     })
  },

  goUpgrade2:function () {
    console.log('开始跳转');
    wx.navigateTo({
      url: '../proSpecial/proSpecial?sort=810&title=创客专区',
      success: function(res) {
      },
      fail: function(res) {
      },
      complete: function(res) {
      },
     })
  },

  bindShowMobile:function () {
    var that=this;
    console.log('点击升级');
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

})