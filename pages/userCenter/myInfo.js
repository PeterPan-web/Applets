var app = getApp();
Page({
  data: {
    personInfo:[],
    cartId:0,
    user_id:'',
    refefence_Name:'',
    user_NameC:'',
    mobile:'',
    mobile_hidden:'',
    bankName:'',
    bankNo:'',
    selectData:['登录密码'],
    pwdLogin1:'',
    pwdLogin2:'',
    pwdPay1:'',
    pwdPay2:'',
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
    if (that.data.pwd_login&&(that.data.pwdLogin1.length<6||that.data.pwdLogin2.length<6)){
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
    if (that.data.pwd_pay&&(that.data.pwdPay1.length<6||that.data.pwdPay2.length<6)){
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
    if (that.data.pwdLogin1!=that.data.pwdLogin2){
      wx.showModal({
        title: "提示",
        content: "两次登录密码不一致!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };

    if (that.data.pwdPay1!=that.data.pwdPay2){
      wx.showModal({
        title: "提示",
        content: "两次转账密码不一致!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };


    if (that.data.certyCode_local!=that.data.certyCode||that.data.certyCode.length<4){
      wx.showModal({
        title: "提示",
        content: "请填写正确的验证码!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 

        }
      })
      return;
    };

    var info = e.detail.value;
    var cartId = this.data.cartId;
    wx.request({
      url: app.d.hostUrl + '/MyInfo_Edit.aspx',
      data: {
        user_id:wx.getStorageSync('userKeyID'),
        username:'',
        refefence_Name: info.refefence_Name,
        user_NameC: info.user_NameC,
        mobile: info.mobile,
        bankName:info.bankName,
        bankNo:info.bankNo,
        pwdLogin1:info.pwdLogin1,
        pwdPay1:info.pwdPay1
      },
      method: 'POST',
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        //console.log('SQL:' + res.data.Sql);
        if(status==1){
          wx.showToast({
            title: '保存成功！',
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
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/MyInfo_Get.aspx',
      data: {
        user_id: wx.getStorageSync('userKeyID'),
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('Data:'+res.data);
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            user_id: res.data.personInfo[0]['user_id'],
            refefence_Name: res.data.personInfo[0]['reference_Name'],
            user_NameC: res.data.personInfo[0]['user_NameC'],
            mobile: res.data.personInfo[0]['mobile_certy'],
            mobile_hidden: res.data.personInfo[0]['mobile_hidden'],
            bankName: res.data.personInfo[0]['bankName'],
            bankNo: res.data.personInfo[0]['bankNo'],
            
          })
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
        //wx.redirectTo({
        //url: 'Address_Add?cartId=' + cartId
        //});
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
  
  Input_UserNameC: function (e) {
    this.setData({
      User_NameC: e.detail.value,
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

  Input_pwdLogin1:function(e) {
    this.setData({
      pwdLogin1: e.detail.value,
    })
  },

  Input_pwdLogin2:function(e) {
    this.setData({
      pwdLogin2: e.detail.value,
    })
  },

  Input_pwdPay1:function(e) {
    this.setData({
      pwdPay1: e.detail.value,
    })
  },

  Input_pwdPay2:function(e) {
    this.setData({
      pwdPay2: e.detail.value,
    })
  },

  Input_CertyCode: function (e) {
    this.setData({
      certyCode: e.detail.value,
    })
  },

  checkboxChange: function() {
    if (!this.data.pwd_login)
    {
      this.setData({
        pwd_login:true,
      });
    }
    else{
      this.setData({
        pwd_login:false,
      });
    }
  },

  checkboxChange2: function() {
    if (!this.data.pwd_pay)
    {
      this.setData({
        pwd_pay:true,
      });
    }
    else{
      this.setData({
        pwd_pay:false,
      });
    }
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