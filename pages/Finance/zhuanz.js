var app = getApp();
Page({
  data: {
    username:'',
    user_NameC:'',
    user_Receive:'',
    mobile_Receive:'',
    zhuanz:'',
    pwdPay:'',
    mobile:'',
    mobile_hidden:'',
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
    if (that.data.zhuanz.length==0){
      wx.showModal({
        title: "提示",
        content: "请输入转账金额!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };

    if (parseFloat(that.data.zhuanz)>parseFloat(that.data.balance)){
      wx.showModal({
        title: "提示",
        content: "超额转账!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };

    if (that.data.zhuanz.indexOf('.')>0){
      wx.showModal({
        title: "提示",
        content: "仅能转账100的倍数!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };
    
    if(that.data.zhuanz%100!=0){
      wx.showModal({
        title: "提示",
        content: "仅能转账100的倍数!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };

    if (that.data.mobile_Receive.length==0){
      wx.showModal({
        title: "提示",
        content: "请输入收款人编号!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };

    if (that.data.pwdPay.length==0){
      wx.showModal({
        title: "提示",
        content: "请输入转账密码!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };
    
    if (that.data.pwdPay=='111111'){
      wx.showModal({
        title: "提示",
        content: "密码过于简单，请至个人信息修改后转账!",
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
    var info = e.detail.value;
    var that=this;
    wx.request({
      url: app.d.hostUrl + '/zhuanz_app.aspx',
      data: {
        username:that.data.username,
        user_Receive: that.data.user_Receive,
        mobile_Receive: that.data.mobile_Receive,
        zhuanz:that.data.zhuanz,
        password:that.data.pwdPay
      },
      method: 'POST',
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        console.log('Status:' + status);
        //console.log('Sql:' + res.data.sql);
        if(status==1){
          wx.showModal({
            title: "提示",
            showCancel:false,
            content: "你的转账已提交成功!",
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                    url: '../userCenter/userCenter',
                  })
              } else if (res.cancel) {
                return;
              }
      
            }
          })
          return;
        }else if(status==2){
          wx.showToast({
            title: '收款人出错！',
            duration: 2000
          });
        }else if(status==3){
          wx.showToast({
            title: '转账超额！',
            duration: 2000
          });
        }else{
          wx.showToast({
            title: '提交失败：',
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
            username: res.data.personInfo[0]['username'],
            user_NameC: res.data.personInfo[0]['user_NameC'],
            balance: res.data.personInfo[0]['balance'],
            mobile: res.data.personInfo[0]['mobile_certy'],
            mobile_hidden:res.data.personInfo[0]['mobile_hidden'],
          })
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
    })
   
  },
  

  Input_zhuanz: function (e) {
    this.setData({
      zhuanz: e.detail.value,
    })
  },

  Input_mobile_Receive:function(e){
    this.setData({
      mobile_Receive: e.detail.value,
    })
  },
  
  Input_user_Receive: function (e) {
    this.setData({
      user_Receive: e.detail.value,
    })
  },
  Input_Mobile: function (e) {
    this.setData({
      mobile: e.detail.value,
    })
  },

  Input_idNo: function (e) {
    this.setData({
      idNo: e.detail.value,
    })
  },

  Input_BankNo: function (e) {
    this.setData({
      bankNo: e.detail.value,
    })
  },

  Input_Tixian: function (e) {
    this.setData({
      tixian: e.detail.value,
    })
  },

  Input_UserName: function (e) {
    this.setData({
      username:e.detail.value,
    })
  },

  Input_pwdPay:function(e) {
    this.setData({
      pwdPay:e.detail.value,
    })
  },

  searchUserData:function(){
    var that = this;
    console.log('keyword2:' + that.data.searchValue);
    wx.request({
      url: app.d.hostUrl + '/user_my_search.aspx',
      method:'post',
      data: {
        searchKey:that.data.mobile_Receive,
        uid: wx.getStorageSync('userKeyID'),
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) { 
        console.log('status:' + res.data.status);
        console.log(res.data.productData);  
        var user = res.data.productData[0];
        that.setData({
          
          //uid:user.ID,
          //username:user.username,
          user_Receive:user.user_namec,
          //user_type:user.user_type
        });
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
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