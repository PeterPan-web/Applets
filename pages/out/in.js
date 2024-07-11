var app = getApp();
var qqmapsdk;
Page({
  data:{
    orderId:0,
    nullHouse: true,  //先设置隐藏
    src: null,
    bcbh:0,
    staffBH:'',
    otherValue:'1000',
    userList:[],
    orderNo:'',
    loginInfo:[],
    tj_money: 0,
    title:'',
    unit:'',
    paysort:'weixin',
    accInfo:[],
  },

  onLoad:function(){
    var that=this;
    console.log('userId:' + wx.getStorageSync('userKeyID'));
    if (wx.getStorageSync('userKeyID') == "1") {
      wx.navigateTo({
        url: '../MemberShip/userLogin?from1=Factory&from2=faceDetect',
      });
    };

    wx.request({
      url: app.d.hostUrl + '/getInSort.aspx',
      method: 'post',
      data: {
        userName: wx.getStorageSync('openId'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("返回数据为：" + res.data);
        console.log("title：" + res.data.title);
        console.log("unit：" + res.data.unit);
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            title: res.data.title,
            unit: res.data.unit,
            userList: res.data.userList
          });
          wx.setNavigationBarTitle({
            title: res.data.title2,
          });

        };

      },

    });

  },

  getUserList: function () {
    var that=this;
    wx.request({
      url: app.d.hostUrl + '/getInSort.aspx',
      method: 'post',
      data: {
        userName: wx.getStorageSync('openId'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("返回数据为：" + res.data);
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            title: res.data.title,
            unit: res.data.unit,
          });
          wx.setNavigationBarTitle({
            title: res.data.title,
          });

        }; 
        
      },

    });

    
  },

  // 参数点击响应事件
  userListTap: function (e) {//e是获取e.currentTarget.dataset.id所以是必备的，跟前端的data-id获取的方式差不多
    var that = this;
    var this_checked = e.currentTarget.dataset.staffbh;
    

    that.setData({
      staffBH: this_checked,
      otherValue: this_checked,
    });
    console.log('选定值：' + that.data.staffBH);

    var userList = this.data.userList;//获取Json数组

    for (var i = 0; i < userList.length; i++) {
      //console.log('值' + i + '：' + userList[i].staffBH + '  选定的值：' + this_checked);

      if (userList[i].staffBH == this_checked) {
        userList[i].checked = true;
      }
      else {
        userList[i].checked = false;
      }
      //userList[0].checked = true;
    };
    that.setData({
      userList: userList,
    });
  },

  Input_OtherValue: function (e) {
    this.setData({
      otherValue: e.detail.value,
    })
  },

  //微信支付创建订单 11
  createProductOrderByWX: function (e) {
    var that = this;

    wx.request({
      url: app.d.hostUrl + '/addIn_CheckOut.aspx',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('cardNo'),
        valueAdd: that.data.otherValue,//that.data.staffBH,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            orderNo: res.data.orderNo,
          });

          console.log('订单号1：' + that.data.orderNo);
          //that.gotoPay(that.data.orderNo, that.data.staffBH);
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


    that.setData({
      paytype: 'weixin',
    });
    wx.login({
      success: function (res) {
        console.log('code:' + res.code);
        console.log('cartId:' + that.data.cartId + '0');
        console.log('userId:' + that.data.userId);
        console.log('Remark:' + that.data.remark);
        console.log('userId:' + that.data.userId);
        console.log('total:' + that.data.total);
        console.log('AddressId:' + that.data.addrId);
        console.log('QuanId:' + that.data.quan_id);
        //处理订单都设置为待付款 
        that.generateOrder();
      }
    });
  },

  /**生成商户订单 11 */ 
  generateOrder: function () {
    var that = this;
    console.log('Total:' + that.data.otherValue);
    //console.log('openId:' + openid);

    wx.request({
      url: app.d.hostUrl + '/pay.ashx',
      data: {
        //total_fee: 1,
        total_fee: that.data.otherValue * 100,//1分为单位
        openid: wx.getStorageSync('openId'),
        orderSN:that.data.orderNo
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('Pay:' + res.data);
        var pay = res.data;
        //发起支付
        var timeStamp = pay.timeStamp;
        var packages = pay.package;
        var paySign = pay.paySign;
        var nonceStr = pay.nonceStr;
        var param = { "timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
        console.log(param);
        that.pay(param)
      },
    })
  }, 


  /* 支付 11  */
  pay: function (param) {
    var that = this;
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function (res) {
        console.log('支付成功');
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
            content: '充值成功',
            showCancel: false
          });
          that.confirmOrder_PayOK();
          wx.setStorageSync('orderNo', '');//成功付款，清空记录
          setTimeout(function () {
            wx.switchTab({
              url: '../userCenter/userCenter',
            });
          }, 2000)

        }
        return;
      }
    })
  }, 

  /* 确认订单已经支付，标注结果 11 */
  confirmOrder_PayOK: function () {
    this.setData({
      btnDisabled: false,
    })
    //创建订单
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/AddIn_PayOK.aspx',
      method: 'post',
      data: {
        orderSN: that.data.orderNo,
        truePay: that.data.otherValue,
        openId: wx.getStorageSync('openId')
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

  radioChang: function (e) {
    var that=this;
    //console.log('radio发生change事件，携带value值为：', e.detail.value)
    that.setData ({
      paysort:e.detail.value,
    });
    if (e.detail.value =='coin') {
      console.log('开始获取币值');
      wx.request({
        url: app.d.hostUrl + '/B_GetLoginInfo.aspx',
        method: 'post',
        data: {
          user_id: wx.getStorageSync('userKeyID'),
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var loginInfo = res.data.loginInfo[0];
          that.setData({
            loginInfo: loginInfo,
            userName: loginInfo.B_UserName,
            password: loginInfo.B_Password,
          });
        },
        fail: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        },
      })
    }

  },

});