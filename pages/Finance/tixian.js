var app = getApp();
Page({
  data: {
    username:{},
    //refefence_Name:{},
    user_NameC:{},
    idNo:{},
    mobile:{},
    bankName:{},
    bankNo:{},
    balance:{},
    tixianSort:"1",
    tixian:'',
    shengArr: [],//省级数组
    shengId: [],//省级id数组
    shengIndex: 0,
  },
  formSubmit: function (e) {
    var that=this;
    if (that.data.tixian.indexOf('.')>0){
      wx.showModal({
        title: "提示",
        content: "仅能提现100的倍数!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    }else if(that.data.tixian%100!=0){
      wx.showModal({
        title: "提示",
        content: "仅能提现100的倍数!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
    }

    if (parseFloat(that.data.tixian)>2000){
      wx.showModal({
        title: "提示",
        content: "单日提现不能超过2000!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };

    if (that.data.user_NameC.length==0){
      wx.showModal({
        title: "提示",
        content: "请输入真实姓名!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };

    if (that.data.idNo.length!=18&&that.data.tixianSort=='1'){
      wx.showModal({
        title: "提示",
        content: "请正确输入身份证号码!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };

    if ((that.data.bankName.length==0||that.data.bankName=='请选择开户银行')&&that.data.tixianSort=='1'){
      wx.showModal({
        title: "提示",
        content: "请选择开户行!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };

    if (that.data.bankNo.length<6&&that.data.tixianSort=='1'){
      wx.showModal({
        title: "提示",
        content: "请正确填写银行账号!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };

    if (that.data.tixian.length==0){
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

    if (parseFloat(that.data.tixian)>parseFloat(that.data.balance)){
      wx.showModal({
        title: "提示",
        content: "超额提现!",
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
    wx.request({
      url: app.d.hostUrl + '/tixian_app.aspx',
      data: {
        username:that.data.username,
        user_NameC: that.data.user_NameC,
        idNo:that.data.idNo,
        bankName:that.data.bankName,
        bankNo:that.data.bankNo,
        tixian:that.data.tixian,
      },
      method: 'POST',
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        console.log('Status:' + status);
        console.log('Sql:' + res.data.sql);
        if(status==1){
          wx.showToast({
            title: '提现申请提交成功！',
            duration: 2000
          });
        }else if(status==2){
          wx.showToast({
            title: '提现超额！',
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
            user_NameC:res.data.personInfo[0]['user_NameC'],
            idNo: res.data.personInfo[0]['IDNo'],
            mobile: res.data.personInfo[0]['mobile'],
            bankName: res.data.personInfo[0]['bankName'],
            bankNo: res.data.personInfo[0]['bankNo'],
            shengIndex:res.data.personInfo[0]['shengIndex'],
            balance: res.data.personInfo[0]['balance'],
          });
          var province = res.data.list;
        var sArr = [];
        var sId = [];
        sArr.push('请选择开户银行');
        sId.push('0');
        for (var i = 0; i < province.length; i++) {
          sArr.push(province[i].name);
          sId.push(province[i].id);
        }
        that.setData({
          shengArr: sArr,
          shengId: sId
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

  /*物流方式*/
  TXSort: function(e) {
    var that=this;
    console.log('提现方式：'+e.detail.value);
      that.setData({
        tixianSort:e.detail.value,
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

  bindPickerChangeshengArr: function (e) {
    var that = this;
    this.setData({
      shengIndex: e.detail.value,
      bankName:that.data.shengArr[e.detail.value]
    });
  },

})