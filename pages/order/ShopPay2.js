var app = getApp();
Page({
  data:{
    itemData:{},
    userId:0,
    paytype:'weixin',//0线下1微信
    remark:'',
    cartId:0,
    addrId:0,//收货地址//测试--
    btnDisabled:false,
    add_have: false,
    productData:[],
    address:{},
    adds_ZT:[],
    vprice:0,
    quan_id:0,
    vid:0,
    addemt:0,
    orderSN: {},
    quan:[],
    payInfo:[],
    tj_money: 0,
    tj_discount: 0,
    tj_Quan: 0,
    pay_balance: 0,
    pay_score: 0,
    pay_WX: 0,
    pay_LC: 0,
    total: 0,
    balance: 0,
    pay_balance: 0,
    pay_WX: 0,
    priceType:'',
    isBuySort:'',
    buySort:'首购',
    buy_tuijian:false,
    buyer_Name:'',
    buyer_Mobile:'',
    buyer_Reference:'',
    mobile_tj:'',
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
  },

  onLoad:function(options){
    var uid = wx.getStorageSync('userKeyID');
    this.setData({
      cartId: options.orderNo,
      userId: uid,
      //mobile_tj:options.mobile_tj,
    });
    this.loadProductDetail();
  },

  loadProductDetail:function(){
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/ShoppingCart_Pay2.aspx',
      method:'post',
      data: {
        cart_id: that.data.cartId,
        uid: that.data.userId,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('status:'+res.data.status);
        console.log('cart_Id:' + that.data.cartId);
        console.log('isBuySort:' + that.data.isBuySort);
        var adds =res.data.adds;
        var payInfo = res.data.pay;
        console.log('地址2:' + adds);
        
        if (adds.length > 0) {
          console.log('统计1：' + adds.length);
          that.setData({
            address: adds[0],
            addrId: adds[0].id,
            add_have: true,
          });
        }
        else {
          console.log('统计2：' + adds.length);
          that.setData({
            address: '',
            addrId: 0,
            add_have: false,
          });
        }

        //console.log('Status:'+res.data);
        that.setData({
          productData: res.data.proData,
          total: res.data.total,
          vprice: res.data.total,
          quan: res.data.quan,
          adds_ZT:res.data.adds_ZT,
          payInfo: payInfo,
          balance: payInfo[0].balance,
          pay_balance: payInfo[0].pay_balance,
          pay_WX: payInfo[0].pay_WX,
          score_balance: payInfo[0].score,
          isBuySort:res.data.isBuySort,
          priceType:payInfo[0].priceType,
          pay_score:payInfo[0].pay_score,
        });
        //endInitData

        if (that.data.isBuySort.length==0||that.data.isBuySort=='首购'){
          that.setData({
            buySort:'首购'
          })
        }else{
          that.setData({
            buySort:'复购'
          })
        }

        that.sum();

      },
    });
  },

  remarkInput:function(e){
    this.setData({
      remark: e.detail.value,
    })
  },

  //选择优惠券
  getvou: function (e) {
    var quanid = e.currentTarget.dataset.quanid;
    var price = e.currentTarget.dataset.price;
    var zprice = this.data.vprice;
    var cprice = parseFloat(zprice) - parseFloat(price);
    this.setData({
      total: cprice,
      quan_id: quanid
    });
    this.getPaySort();
  },

  /* 确认订单 余额已经支付，标注结果 */
  deal_PayOK_YE: function () {
    this.setData({
      btnDisabled: false,
    })
    //创建订单
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/ShoppingCart_PayOK_WX.aspx',
      method: 'post',
      data: {
        orderSN: that.data.cartId,
        shouldPay: that.data.tj_money,
        truePay: that.data.total,
        quanId: that.data.quan_id,
        pay_balance: that.data.pay_balance,
        pay_WX: that.data.pay_WX,
        uid: wx.getStorageSync('userKeyID'),

        pay_score:that.data.pay_score,
        score:that.data.pay_score,
        buySort:that.data.buySort,
        buyer_Name:that.data.buyer_Name,
        buyer_Mobile:that.data.buyer_Mobile,
        buyer_Reference:that.data.buyer_Reference

      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data;
        if (data.status == 1) {
          //订单支付确认成功
          wx.showModal({
            title: '恭喜你',
            content: '付款成功',
            showCancel: false
          });
          
          wx.setStorageSync('orderNo', '');//成功付款，清空记录
          setTimeout(function () {
            wx.redirectTo({
              url: '../order/shopOrder_List?currentTab=1&otype=pay',
            });
          }, 2000)
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:createProductOrder',
          duration: 2000
        });
      }
    });
  },

  //确认订单
  confirmOrder_needPay:function(){
    this.setData({
      btnDisabled:false,
    })
    //创建订单
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/ShoppingCart_Confirm.aspx',
      method:'post',
      data: {
        user_id: that.data.userId,
        cart_id: that.data.cartId+'0',
        total: that.data.total,//总价
        quan_id: that.data.quan_id,//优惠券ID
        type:that.data.paytype,
        addrId: that.data.addrId,//地址的id
        remark: that.data.remark,//用户备注
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data;
        if(data.status == 1){
          //创建订单成功
          that.setData({
            orderSN: data.sub_number,
          })
        }else{
          wx.showToast({
            title:"订单确认失败!",
            duration:2500
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:createProductOrder',
          duration: 2000
        });
      }
    });
  },
  
  //获取用户openId
  getOpenId: function (code) {
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/GetOpenid.ashx?code=' + code, 
      data: {},
      success: function (res) {
        var a12 = res.data;
        that.generateOrder();
        //console.log('openId:'+a12); 
      },
      fail: function () {
        // fail 
      },
      complete: function () {
        // complete 
      }
    })
  }, 
  
  


  /* 支付  */
  pay: function (param) {
    var that = this;
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function (res) {
        //console.log('支付成功');
      },
      fail: function (res) {
        // fail 支付请求失败
        wx.showModal({
          title: '提醒！！！',
          content: '付款失败',
          showCancel: false
        });

        return;
      },
      complete: function (res) {

        console.log('支付完成');
        if (res.errMsg == 'requestPayment:ok') {
          wx.showModal({
            title: '恭喜你',
            content: '付款成功',
            showCancel: false
          });
          that.confirmOrder_PayOK_WX();
          //that.confirmOrder_PayOK();
          wx.setStorageSync('orderNo', '');//成功付款，清空记录
          setTimeout(function () {
            wx.redirectTo({
              url: '../order/shopOrder_List?currentTab=1&otype=send',
            });
          }, 2000)

        }
        return;
      }
    })
  }, 

  /* 确认订单已经支付 */
  confirmOrder_PayOK: function () {
    this.setData({
      btnDisabled: false,
    })
    //创建订单
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/ShoppingCart_PayOK.aspx',
      method: 'post',
      data: {
        orderSN: that.data.cartId,
        //buySort:that.data.buySort,
        //buyer_Name:that.data.buyer_Name,
        //buyer_Mobile:that.data.buyer_Mobile,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data;
        if (data.status == 1) {
          //订单支付确认成功
        } 
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:createProductOrder',
          duration: 2000
        });
      }
    });
  },

  /* 确认订单已经支付，标注结果 */
  confirmOrder_PayOK_WX: function () {
    this.setData({
      btnDisabled: false,
    })
    //创建订单
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/ShoppingCart_PayOK_WX.aspx',
      method: 'post',
      data: {
        orderSN: that.data.orderNo,
        shouldPay: that.data.tj_money,
        truePay: that.data.total,
        quanId: that.data.quan_id,
        pay_balance: that.data.pay_balance,
        pay_score: that.data.pay_score,
        pay_WX: that.data.pay_WX,
        score: that.data.pay_score,
        uid: wx.getStorageSync('userKeyID'),
        buySort:that.data.buySort,
        buyer_Name:that.data.buyer_Name,
        buyer_Mobile:that.data.buyer_Mobile,
        buyer_Reference:that.data.buyer_Reference
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data;
        if (data.status == 1) {
          //订单支付确认成功
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:createProductOrder',
          duration: 2000
        });
      }
    });
  },



  bindMinus: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var num = that.data.productData[index].BuyCount;
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num--;
    }
    console.log('减少后的库存数量：' + num);
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
          var carts = that.data.productData;
          carts[index].BuyCount = num;
          // 按钮可用状态
          var minusStatuses = that.data.minusStatuses;
          minusStatuses[index] = minusStatus;
          // 将数值与状态写回
          that.setData({
            minusStatuses: minusStatuses,
            //productData:carts,
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
    var index = parseInt(e.currentTarget.dataset.index);
    var num = that.data.productData[index].BuyCount;
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
        console.log('status:'+status);
        if (status == 1) {
          // 只有大于一件的时候，才能normal状态，否则disable状态
          var minusStatus = num <= 1 ? 'disabled' : 'normal';
          // 购物车数据
          var carts = that.data.productData;
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

  //统计
  sum: function () {
    var carts = this.data.productData;
    // 计算总金额
    var total = 0;
    var score = 0;
    for (var i = 0; i < carts.length; i++) {

      total += carts[i].BuyCount * carts[i].price;
      score += carts[i].BuyCount * carts[i].EScore_Scores;

    }
    // 写回经点击修改后的数组
    this.setData({
      productData: carts,
      total: total,
      vprice: total,
    });

    console.log('score:' + score + ' score_balance:' + this.data.score_balance);
    if (score <= this.data.score_balance) {
      this.setData({
        pay_score: score,
      });
    } else {
      this.setData({
        pay_score: this.data.score_balance,
      });
    }

    this.getPaySort();

  },

  //根据会员账户获取支付方式 11
  getPaySort: function () {
    var that = this;
    //console.log('1:'+that.data.cartId + '0');
    wx.request({
      url: app.d.hostUrl + '/ShoppingCart_PaySort.aspx',
      method: 'post',
      data: {
        total: that.data.total,
        uid: that.data.userId,
        score: that.data.pay_score,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('status:' + res.data.status);
        var payInfo = res.data.pay;
        console.log('score:' + payInfo[0].score);
        console.log('pay_score:' + payInfo[0].pay_score);

        that.setData({
          payInfo: payInfo,
          balance: payInfo[0].balance,
          pay_balance: payInfo[0].pay_balance,
          pay_Quan: payInfo[0].tj_Quan,
          pay_WX: payInfo[0].pay_WX,
        });
        //endInitData
      },
    });
  },

  //根据会员账户获取支付方式 11
  getPaySort01: function () {
    var that = this;
    //console.log('1:'+that.data.cartId + '0');
    wx.request({
      url: app.d.hostUrl + '/ShoppingCart_PaySort.aspx',
      method: 'post',
      data: {
        total: that.data.total,
        uid: that.data.userId,
        score: that.data.pay_score,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('status:' + res.data.status);
        var payInfo = res.data.pay;
        console.log('score:' + payInfo[0].score);
        console.log('pay_score:' + payInfo[0].pay_score);

        that.setData({
          payInfo: payInfo,
          balance: payInfo[0].balance,
          pay_balance: payInfo[0].pay_balance,
          pay_WX: payInfo[0].pay_WX,
        });
        //endInitData
      },
    });
  },

  //根据会员账户获取支付方式
  getPaySort0: function () {
    var that = this;
    //console.log('1:'+that.data.cartId + '0');
    wx.request({
      url: app.d.hostUrl + '/ShoppingCart_PaySort.aspx',
      method: 'post',
      data: {
        total: that.data.total,
        uid: that.data.userId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('status:' + res.data.status);
        var payInfo = res.data.pay;

        that.setData({
          payInfo: payInfo,
          balance: payInfo[0].balance,
          pay_balance: payInfo[0].pay_balance,
          pay_WX: payInfo[0].pay_WX,
        });
        //endInitData
      },
    });
  },

  /*购买方式*/
  buySort: function(e) {
    var that=this;
    console.log('购买方式：'+e.detail.value);
    if (e.detail.value==1) {
      that.setData({
        buy_tuijian:false,
        buySort:'复购',
      })
    }
    else {
      that.setData({
        buy_tuijian:true,
        buySort:'为下级购买',
      })
    }
  },

  Input_buyer_Name: function (e) {
    this.setData({
      buyer_Name: e.detail.value,
    })
  },

  Input_buyer_Mobile: function (e) {
    this.setData({
      buyer_Mobile: e.detail.value,
    })
  },
  Input_buyer_Reference: function (e) {
    this.setData({
      buyer_Reference: e.detail.value,
    })
  },
  
   //微信支付创建订单
   gotoPay_WX:function(e){
    var that=this;
    console.log('AddId:'+that.data.addrId);
    if (that.data.addrId==0){
      wx.showToast({
        title: "请填写收货地址!",
        duration: 3000
      });
      return;
    }
     
    that.setData({
      paytype: 'weixin',
    });
    //this.confirmOrder();
    wx.login({
      success: function (res) {
        console.log('code:'+res.code);
        console.log('cartId:' + that.data.cartId+'0');
        console.log('userId:' + that.data.userId);
        console.log('Remark:' + that.data.remark);
        console.log('userId:' + that.data.userId);
        console.log('total:' + that.data.total);
        console.log('AddressId:' + that.data.addrId);
        console.log('QuanId:' + that.data.quan_id);
        //处理订单都设置为待付款 
        //that.confirmOrder_needPay();
        //that.getOpenId(res.code)
        that.generateOrder();
      }
    }); 
  },

  /**生成商户订单 */
  generateOrder: function () {
    var that = this;
    var pay_WX = that.data.pay_WX;
    console.log('Total:' + pay_WX);

    wx.request({
      url: app.d.hostUrl + '/pay.ashx',
      data: {
        total_fee: parseInt(pay_WX * 100),//1分为单位
        openid: wx.getStorageSync('openId'),
        orderSN:that.data.cartId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var pay = res.data;
        //发起支付
        var timeStamp = pay.timeStamp;
        var packages = pay.package;
        var paySign = pay.paySign;
        var nonceStr = pay.nonceStr;
        var param = { "timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
        console.log("timeStamp:"+ timeStamp+ " package:"+ packages+ " paySign:"+ paySign+ " signType:"+ "MD5"+ " nonceStr:"+ nonceStr);
        that.pay(param)
      },
    })
  }, 

  //余额支付
  gotoPay_YE: function () {
    var that = this;
    wx.showModal({
      title: "提示",
      content: "此操作将会从你的账户余额中扣款吧!",
      success: function (res) {
        if (res.confirm) {
          that.deal_PayOK_YE();
        } else if (res.cancel) {
          return;
        }

      }
    })
    return;
  },

    //积分余额支付
    gotoPay_Score: function () {
      var that = this;
  
      
  
      if (!that.data.add_have) {
        wx.showModal({
          title: "提示",
          content: "请添加收货地址!",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              return;
            }
          }
        })
        return;
      };
  
      if (that.data.buy_tuijian&&that.data.buyer_Mobile.length!=11){
        wx.showModal({
          title: "提示",
          content: "请添加购买人手机!",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
             return;
            } 
  
          }
        })
        return;
      };
  
      if (that.data.buy_tuijian&&that.data.buyer_Name.length==0){
        wx.showModal({
          title: "提示",
          content: "请添加购买人姓名!",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
             return;
            } 
  
          }
        })
        return;
      };
      if (!that.data.orderSN){
        that.confirmOrder_needPay();
      };
  
      wx.showModal({
        title: "提示",
        content: "此操作将会从你的账户中扣款积分!",
        success: function (res) {
          if (res.confirm) {
            that.deal_PayOK_YE();
          } else if (res.cancel) {
            return;
          }
  
        }
      })
      return;
    },

});