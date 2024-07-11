// pages/userCenter/userCenter.js
var app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page( {
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userId:{},
    from1:{},
    from2:{},
    reId:{},
    pageSort: {},
    TId:{},
    loginPic:'',
    wxParseData: [],
    loadingText: '加载中...',
    loadingHidden: false, 
  },
  onLoad: function (option) {
    var that = this;
    that.setData({
      from1 : option.from1,
      from2 : option.from2,
      pageSort : option.pageSort,
      reId:option.reId,
    });
    
    wx.request({
      url: app.d.hostUrl + '/members_Reg.aspx',
      method: 'post',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("返回数据为：" + res.data);
        //var that2=this;
        var status = res.data.status;
        console.log('图片：' + res.data.modalContent[0].img);
        if (status == 1) {
          that.setData ({
            loginPic: res.data.modalContent[0].img,
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
      },

    });

      console.log('Log:开始加载Log');
      console.log('userId:' + app.d.userKeyID);
      console.log('openId:' + app.d.openId);

  },

  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称   
            console.log('已经获得授权！');

        wx.login({
          success:function(res){
            var code = res.code;
            var nickName = e.detail.userInfo.nickName;
            var avatarUrl = e.detail.userInfo.avatarUrl;
            console.log('开始登录 code：' + code);
            
            app.globalData.userInfo = e.detail.userInfo;
            that.getUserSessionKey(code, nickName, avatarUrl);
            typeof cb == "function" && cb(app.globalData.userInfo);
            //wx.showToast({
            //  title: '登录成功！',
            //  duration: 2000
            //});
            

          }

        })


        }
      }
    });
  },

  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },


  //用户的openId开始
  getUserSessionKey: function (code, nickName, avatarUrl) {
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/LoginSessionkey.aspx',
      method: 'post',
      data: {
        code: code,
        nickName: nickName,
        avatarUrl: avatarUrl
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data;
        console.log('status_App:' + data.status);

        var openid = data.openid;
        var userKey = data.userKeyID;
        //console.log('获取nickName:' + nickName);
        console.log('获取openId_Reg:' + openid);
        wx.setStorageSync('openId', openid);
        //console.log('获取unionid:' + data.unionid);
        console.log('获取userKeyID_Reg:' + userKey);
        wx.setStorageSync('userKeyID', userKey);
        
        if (data.status == 0) {
          wx.showToast({
            title: data.err,
            duration: 2000
          });
          return false;
        }

        //app0.d.userId = userKey;
        app.d.userKeyID = userKey;
        app.d.openid = openid;
        app.d.nickName = nickName;

        console.log('UserId_Reg:' + wx.getStorageSync('userKeyID'));
        console.log('准备跳转到:' + '../' + that.data.from1 + '/' + that.data.from2);
       
        if (that.data.pageSort=="tab")
        {
          console.log('跳转方向1');
          wx.switchTab({
            url: '../' + that.data.from1 + '/' + that.data.from2,
          });
        }
        else
        {
          if (that.data.from2 =="proDetail")
           {
            console.log('跳转方向2');
            wx.navigateTo({
              url: '../proDetail/proDetail?productId=' + that.data.reId,
            });
           }
           else
           {
            console.log('跳转方向3');
           wx.navigateTo({
             url: '../' + that.data.from1 + '/' + that.data.from2,
           });
          }
        }
        
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:getsessionkeys',
          duration: 2000
        });
      },
    });
  },
  //用户的openId结束
  cancelLogin:function () {
    console.log('开始跳转');
    wx.switchTab({
      url: '../index/index',
    });
  },

})