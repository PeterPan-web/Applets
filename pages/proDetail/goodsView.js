var app = getApp();
Page({
  data:{
    page:1,
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
    total: 0,
    score_balance: 0,
    carts: [],
    dataSet:[],
    productData:[]
  },

  // #加载购物车里的数据开始
  loadProductData: function () {
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/proDetail_ViewList.aspx',
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
        });
      },
    });
  },
  //#加载购物车里的数据结束
//库存减少
bindMinus: function(e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var num = that.data.carts[index].BuyCount;
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
     url: '../order/ShopPay?orderNo=' + toastStr+'0',
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
    var score = 0;
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].selected) {
        total += carts[i].BuyCount * carts[i].price;
        score += carts[i].BuyCount * carts[i].score_Deduct;
      }
    }
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
      total: '¥ ' + total,
    });
  console.log('score:' + score + ' score_balance:' + this.data.score_balance);
    if (score<=this.data.score_balance){
      this.setData({
        score_Deduct: score,
      });
    }else{
      this.setData({
        score_Deduct: this.data.score_balance,
      });
    }

},


onLoad:function(options){

  //wx.setTabBarBadge({
  //  index: 3,
  //  text:'1',
  //});

  //wx.showTabBarRedDot({//wx.hideTabBarRedDot移除
  //  index: 4,
  //});

    this.loadProductData();
    this.sum();
},

onShow:function(){
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



})