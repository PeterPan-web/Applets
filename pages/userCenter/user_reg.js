var app = getApp();
Page({
  data: {
    personInfo:[],
    cartId:0,
    user_id:'',
    referenceName:'',
    userNameC:'',
    mobile:'',
    bankName:'',
    bankNo:'',
    payMark_wx:'',
    payMark_alipay: '',
    parentCard:'',
    password:'',
    pwdPay:'',
    //控制按钮能否点击
    disabled: false,
    //倒计时时间
    time: 60,
    //定时器
    timer: '',
    text:'发送验证码',
    certyCode_local:'',
    certyCode:''
  },
  formSubmit: function (e) {
    var that=this;
    var info = e.detail.value;
    var cartId = this.data.cartId;

    // if (that.data.parentCard.length<5){
    //   wx.showModal({
    //     title: "提示",
    //     content: "请添加直推人编号!",
    //     showCancel: false,
    //     success: function (res) {
    //       if (res.confirm) {
    //        return;
    //       } 
    //     }
    //   })
    //   return;
    // };

    if (that.data.referenceName.length<5){
      wx.showModal({
        title: "提示",
        content: "请添加安置位编号!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 

        }
      })
      return;
    };

    if (that.data.mobile.length!=11){
      wx.showModal({
        title: "提示",
        content: "请添加绑定手机!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 

        }
      })
      return;
    };

    // if (that.data.certyCode_local!=that.data.certyCode||that.data.certyCode.length<4){
    //   wx.showModal({
    //     title: "提示",
    //     content: "请填写正确的验证码!",
    //     showCancel: false,
    //     success: function (res) {
    //       if (res.confirm) {
    //        return;
    //       } 
    //     }
    //   })
    //   return;
    // };

    if (that.data.password.length<6){
      wx.showModal({
        title: "提示",
        content: "登录密码不能少于6位!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };
    if (that.data.pwdPay.length<6){
      wx.showModal({
        title: "提示",
        content: "支付密码不能少于6位!",
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
      url: app.d.hostUrl + '/user_agent_reg.aspx',
      data: {
        user_id:wx.getStorageSync('userKeyID'),
        parentCard:that.data.parentCard,
        referenceName: that.data.referenceName,
        user_NameC: that.data.userNameC,
        mobile: that.data.mobile,
        password:that.data.password,
        pwdPay:that.data.pwdPay,
        bankName:that.data.bankName,
        bankNo:that.data.bankNo,
      },
      method: 'POST',
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        var userReg=res.data.userReg;
        var orderNo=res.data.orderNo;
        console.log('userReg:' + res.data.userReg);

        if(status==1){
          wx.setStorageSync('userReg', res.data.userReg);
          wx.showModal({
            title: "提示",
            showCancel:false,
            content: "会员注册成功，编号：【"+userReg+"】，点击前往报单",
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                    url: '../order/order_Detail?orderNo='+userReg,
                  })
              } else if (res.cancel) {
                return;
              }
      
            }
          })
          //return;

          // wx.showToast({
          //   title: '注册成功！',
          //   duration: 2000
          // });
        }else{
          wx.showToast({
            title: '注册失败:'+status,
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
    })
  },

  onLoad: function (options) {
    // var that = this;
    // wx.request({
    //   url: app.d.hostUrl + '/MyInfo_Get.aspx',
    //   data: {
    //     user_id: '0',
    //   },
    //   method: 'POST',
    //   header: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   success: function (res) {
    //     console.log('Data:'+res.data);
    //     var status = res.data.status;
    //     if (status == 1) {
    //       that.setData({
    //         user_id: res.data.personInfo[0]['user_id'],
    //         refefenceName: res.data.personInfo[0]['reference_Name'],
    //         userNameC: res.data.personInfo[0]['user_NameC'],
    //         mobile: res.data.personInfo[0]['mobile'],
    //         bankName: res.data.personInfo[0]['bankName'],
    //         bankNo: res.data.personInfo[0]['bankNo'],
    //         payMark_wx: res.data.personInfo[0]['payMark_wx'],
    //         payMark_alipay: res.data.personInfo[0]['payMark_alipay'],
    //         //cashDate: res.data.personInfo[0]['cashDate'],
    //         //cashSort: res.data.personInfo[0]['cashSort'],
    //       })
    //     } else {
    //       wx.showToast({
    //         title: res.data.err,
    //         duration: 2000
    //       });
    //     }
    //     //wx.redirectTo({
    //     //url: 'Address_Add?cartId=' + cartId
    //     //});
    //   },
    //   fail: function () {
    //     // fail
    //     wx.showToast({
    //       title: '网络异常！',
    //       duration: 2000
    //     });
    //   }
    // })
   
  },
  
  Input_parentCard: function (e) {
    this.setData({
      parentCard: e.detail.value,
    })
  },

  Input_password: function (e) {
    this.setData({
      password: e.detail.value,
    })
  },

  Input_pwdPay: function (e) {
    this.setData({
      pwdPay: e.detail.value,
    })
  },

  Input_referenceName: function (e) {
    this.setData({
      referenceName: e.detail.value,
    })
  },

  Input_userNameC: function (e) {
    this.setData({
      userNameC: e.detail.value,
    })
  },

  Input_Mobile:function(e){
    this.setData({
      mobile: e.detail.value,
    })
  },
  
  Input_BankName: function (e) {
    this.setData({
      bankName: e.detail.value,
    })
  },

  Input_BankNo: function (e) {
    this.setData({
      bankNo: e.detail.value,
    })
  },

  Input_CertyCode: function (e) {
    this.setData({
      certyCode: e.detail.value,
    })
  },

  //点击方法
send: function() {
  var that=this;

  if (that.data.mobile.length!=11){
    wx.showModal({
      title: "提示",
      content: "请添加绑定手机!",
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
    url: app.d.hostUrl + '/certyCode_send.aspx',
    data: {
      mobile:that.data.mobile
    },
    method: 'POST',
    header: {
      'Content-Type':  'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var status = res.data.status;
      if(status==1){
        that.setData({
          certyCode_local:res.data.certyCode
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
        title: '网络异常！',
        duration: 2000
      });
    }
  })
  

  //将按钮设置为禁用
  this.setData({
    disabled: true,
    //certyCode:ran.Next(1000,9999)
  })
  //给定时器赋值
  this.data.timer = setInterval(() => {
    this.timer()
  }, 1000)
  //弹出提示框
  wx.showToast({
    title: '发送成功',
    duration: 2000
  })
},

//定时器
timer() {
  let time = this.data.time;
  time--;
  this.setData({
    time,
    text: time + '秒内有效'
  })
  //判断倒计时时间为0时
  if(time <= 0) {
    //清除定时器
    clearInterval(this.data.timer);
    //设置文本内容，倒计时间，按钮可用
    this.setData({
      text: '发送验证码',
      time: 60,
      disabled: false
    })
  }
}

  

})