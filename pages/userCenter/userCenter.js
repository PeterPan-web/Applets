var app = getApp();
Page({
  data: {
    orderInfo: {},
    outSort: [],
    userId: {},
    loadingText: "加载中...",
    loadingHidden: false,
    hasMobile: false,
    hasUserInfo: false,
    isRealName: false,
    cardNo: "",
    loginNamec: "",
    userMobile: "",
    sessionKey: "",
    flag: false,
    isLogin: false,
    isForgetPWD: false,
    login_name: "",
    login_pwd: "",
    //控制按钮能否点击
    disabled: false,
    //倒计时时间
    time: 60,
    //定时器
    timer: "",
    text: "发送验证码",
    certyCode_local: "",
    certyCode: "",
    IDNo: "",
    showMakePhone: false,
    userInfo: {},
    // 缓存的数据
    cachingName:"",
  },
  getUserProfile: function (e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    var that = this;
    wx.getUserProfile({
      desc: "用于完善会员资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          avatarUrl: res.userInfo.avatarUrl,
          isLogin: true,
        });

        wx.request({
          url: app.d.hostUrl + "/updateUserInfo.aspx",
          method: "post",
          data: {
            openId: wx.getStorageSync("openId"),
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl,
            referenceId: wx.getStorageSync("referenceId"),
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          success: function (res) {
            var data = res.data;
            console.log("更改资料成功：" + data.status + " " + data.userKeyID);
            wx.setStorageSync("userKeyID", data.userKeyID);
            wx.setStorageSync("cardNo", data.cardNo);
            that.setData({
              isLogin: true,
            });
            wx.showToast({
              title: "登录成功！",
              duration: 2000,
            });
            that.loadOrderStatus();
            // if(that.data.hasMobile){
            //   that.setData({
            //     flag:true
            //   })
            // }
          },
        });
      },
    });
  },
  checkLoginAndNavigate: function() {
    if (this.data.flag) {
      wx.navigateTo({
        url: '../order/shopOrder_List?currentTab=0'
      });
    }else{
        // 如果未登录，提示用户登录或执行其他操作
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        });
    }
  },
  checkLoginAndNavigate: function() {
    if (this.data.flag) {
      wx.navigateTo({
        url: '../order/shopOrder_List?currentTab=0'
      });
    }else{
        // 如果未登录，提示用户登录或执行其他操作
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        });
    }
  },
  checkLoginAndNavigate1: function() {
    if (this.data.flag) {
      wx.navigateTo({
        url: '../order/shopOrder_List?currentTab=0&otype=pay'
      });
    }else{
        // 如果未登录，提示用户登录或执行其他操作
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        });
    }
  },
  checkLoginAndNavigate2: function() {
    if (this.data.flag) {
      wx.navigateTo({
        url: '../order/shopOrder_List?currentTab=1&otype=send'
      });
    }else{
        // 如果未登录，提示用户登录或执行其他操作
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        });
    }
  },
  checkLoginAndNavigate3: function() {
    if (this.data.flag) {
      wx.navigateTo({
        url: '../order/shopOrder_List?currentTab=2&otype=receive'
      });
    }else{
        // 如果未登录，提示用户登录或执行其他操作
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        });
    }
  },
  checkLoginAndNavigate4: function() {
    if (this.data.flag) {
      wx.navigateTo({
        url: '../order/shopOrder_List?currentTab=3&otype=finish'
      });
    }else{
        // 如果未登录，提示用户登录或执行其他操作
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        });
    }
  },
  onLoad: function () {
    // this.loadOrderStatus();
    // wx.getUserInfo({
    //   success: function(res) {
    //     console.log(res,"res");
    //     var userInfo = res.userInfo
    //     var nickName = userInfo.nickName
    //     var avatarUrl = userInfo.avatarUrl
    //   }
    // })
  },

  onShow: function () {
    //  wx.hideTabBarRedDot({
    //     index: 3
    //   });
    // if (wx.getStorageSync('cardNo').length>=5){
    //   this.setData({
    //     isLogin:true
    //   });
    // }else{
    //   this.setData({
    //     isLogin:false
    //   });
    // }
    // this.loadOrderStatus();
  },
  onPullDownRefresh() {
    console.log("下拉刷新");
    this.setData({
      page: 1,
    });
    this.onLoad();
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    var that = this;
    wx.getUserProfile({
      desc: "用于完善会员资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          avatarUrl: res.userInfo.avatarUrl,
          isLogin: true,
        });

        wx.request({
          url: app.d.hostUrl + "/updateUserInfo.aspx",
          method: "post",
          data: {
            openId: wx.getStorageSync("openId"),
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl,
            referenceId: wx.getStorageSync("referenceId"),
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          success: function (res) {
            var data = res.data;
            console.log("更改资料成功：" + data.status + " " + data.userKeyID);
            wx.setStorageSync("userKeyID", data.userKeyID);
            wx.setStorageSync("cardNo", data.cardNo);
            that.setData({
              isLogin: true,
            });
            wx.showToast({
              title: "登录成功！",
              duration: 2000,
            });
            that.loadOrderStatus();
            // if(that.data.hasMobile){
            //   that.setData({
            //     flag:true
            //   })
            // }
          },
        });
      },
    });
  },
  loadOrderStatus: function () {
    //获取用户数据
    var that = this;
    console.log("UserKey:" + wx.getStorageSync("userKeyID"));
    wx.request({
      url: app.d.hostUrl + "/UserOrder_TJ.aspx",
      method: "post",
      data: {
        userId: wx.getStorageSync("userKeyID"),
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          var orderTJ = res.data.orderTJ[0];
          var outSort = res.data.outSort;
          var menu = res.data.menu;
          var otherMenu = res.data.otherMenu;
          var user_mobile = orderTJ.user_mobile;
          var user_avatarUrl = orderTJ.avatarUrl;
          that.setData({
            orderInfo: orderTJ,
            userId: wx.getStorageSync("userKeyID"),
            outSort: outSort,
            avatarUrl: user_avatarUrl,
            cardNo: orderTJ.cardNo,
            userMobile: user_mobile,
            loginNamec: orderTJ.nickName,
            IDNo: orderTJ.IDNo,
            menu: menu,
            otherMenu: otherMenu,
          });
          console.log(that.data, "获取的数据");
          if (user_mobile.length > 0) {
            that.setData({
              hasMobile: true,
            });
          }
          if (user_avatarUrl.length < 10) {
            that.setData({
              hasUserInfo: false,
            });
          } else {
            that.setData({
              hasUserInfo: true,
            });
          }
          if (!that.data.hasUserInfo || !that.data.hasMobile) {
            that.setData({
              flag: false,
            });
          } else {
            that.setData({
              flag: true,
            });
          }
        }
      },
      error: function (e) {
        wx.showToast({
          title: "网络异常！",
          duration: 2000,
        });
      },
    });
  },

  getCard: function () {
    //打开会员卡
    //wx.openCard({
    //  cardList: [{
    //    cardId: 'pWxaE02h9x7cmG6ytj7iuR6EVzZo',
    //    code: '085194654886'
    //  }]// 需要打开的卡券列表
    //});

    wx.showShareMenu({
      withShareTicket: true,
    });
  },

  //开始绑定手机
  getPhoneNumber: function (e) {
    //点击获取手机号码按钮
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.request({
          url: app.d.hostUrl + "/LoginSessionkey.aspx",
          method: "post",
          data: {
            code: code,
            appId: app.d.appId,
            //appKey:app.d.appKey
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          success: function (res) {
            var data = res.data;
            wx.checkSession({
              success: function () {
                console.log(e.detail.errMsg);
                console.log(e.detail.iv);
                console.log(e.detail.encryptedData);

                var ency = e.detail.encryptedData;
                var iv = e.detail.iv;
                //var sessionk =  that.data.sessionKey;

                if (e.detail.errMsg == "getPhoneNumber:fail user deny") {
                  that.setData({
                    modalstatus: true,
                  });
                } else {
                  //同意授权
                  wx.request({
                    method: "GET",
                    url: app.d.hostUrl + "/WX_AESDecrypt.ashx",
                    data: {
                      encrypdata: ency,
                      ivdata: iv,
                      sessionkey: res.data.session_key,
                    },
                    header: {
                      "content-type": "application/json", // 默认值
                    },
                    success: (res) => {
                      console.log(
                        "解密成功~~~~~~~将解密的号码保存到本地~~~~~~~~"
                      );
                      console.log(res);
                      var phone = res.data.phoneNumber;
                      console.log("号码：" + phone);
                      that.updateMobile(phone);
                      that.setData({
                        cardNo: phone,
                      });
                    },
                    fail: function (res) {
                      console.log("解密失败~~~~~~~~~~~~~");
                      console.log(res);
                    },
                  });
                }
              },
              fail: function () {
                console.log("session_key 已经失效，需要重新执行登录流程");
                that.wxlogin(); //重新登录
              },
            });
          },
          fail: function (e) {
            wx.showToast({
              title: "网络异常！err:getsessionkeys",
              duration: 2000,
            });
          },
        });
      },
    });
  },

  updateMobile: function (userMobile) {
    var that2 = this;
    wx.request({
      url: app.d.hostUrl + "/updateMobile.aspx",
      method: "post",
      data: {
        UId: wx.getStorageSync("userKeyID"),
        userMobile: userMobile,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        var data = res.data;
        console.log("更改手机号：" + data.status + " " + data.sql);
        if (data.status == 1) {
          app.d.userMobile = userMobile;
          that2.setData({
            hasMobile: true,
          });

          console.log("hasUserInfo:" + that2.data.hasUserInfo);
          if (that2.data.hasUserInfo) {
            that2.setData({
              flag: true,
            });
          }
          wx.showToast({
            title: "手机绑定成功！",
            duration: 2000,
          });
        }
      },
    });
  },
  //结束绑定手机
  callGetPhone(e) {
    // 号码
    let telPhone = e.currentTarget.dataset.getphone;
    this.callPhone(telPhone);
  },

  callPhone(phoneNumber) {
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
      success: function () {
        console.log("拨打电话成功！");
      },
      fail: function () {
        console.log("拨打电话失败！");
      },
    });
  },

  doExit: function () {
    var that = this;
    wx.showModal({
      title: "提示",
      content: "此操作将会退出当前账号!",
      success: function (res) {
        if (res.confirm) {
          //wx.setStorageSync('userKeyID', "0");
          wx.setStorageSync("cardNo", "0");
          wx.setStorageSync("loginNamec", "0");
          wx.setStorageSync("userKeyID", "0");
          that.setData({
            cardNo: "",
            loginNamec: "",
            isLogin: false,
            hasUserInfo: false,
            login_name: "",
            login_pwd: "",
            orderInfo: null,
            outSort: null,
            avatarUrl: "",
            flag:false,
          });
        } else if (res.cancel) {
          return;
        }
      },
    });
    return;
  },

  bindOfficial: function () {
    this.setData({
      copy: !0,
    });
  },
  bindRealName: function () {
    let loginNamec = this.data.loginNamec
    this.setData({
      isRealName: true,
      cachingName:loginNamec,
    });
  },
  doHidden: function () {
    let loginNamec = this.data.loginNamec
    this.setData({
      isRealName: false,
      cachingName:loginNamec,
    });
  },

  doRealName: function () {
    var that2 = this;
    console.log(that2.data, "得到的数据");
    if (that2.data.userMobile.length != 11) {
      wx.showModal({
        title: "提示",
        content: "请绑定手机号码!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            return;
          }
        },
      });
      return;
    }

    if (that2.data.cachingName == "微信用户") {
      wx.showModal({
        title: "提示",
        content: "请填写真实姓名!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            return;
          }
        },
      });
      return;
    }
    if (that2.data.IDNo.length != 18) {
      wx.showModal({
        title: "提示",
        content: "请正确填写18位身份证号!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            return;
          }
        },
      });
      return;
    }
    wx.request({
      url: app.d.hostUrl + "/updateRealName.aspx",
      method: "post",
      data: {
        UId: wx.getStorageSync("userKeyID"),
        userMobile: that2.data.cachingMobile,
        loginNamec: that2.data.cachingName,
        IDNo: that2.data.cachingIDNo,
        referenceId: wx.getStorageSync("referenceId"),
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        var data = res.data;
        if (data.status == 1) {
          that2.setData({
            isRealName: false,
          });
          wx.showToast({
            title: "实名认证成功！",
            duration: 2000,
          });

          wx.setStorageSync("userMobile", that2.data.cachingMobile);
          wx.setStorageSync("loginNamec", that2.data.cachingName);
        }
      },
    });
  },



  doBindMSG: function (e) {
    var id = "k3AaTl5FdIuaZeC9mw_C4Yk_oa96GzjRlBIS4eTxQsI";
    wx.requestSubscribeMessage({
      tmplIds: [id],
      success(res) {
        if (res[id] == "accept") {
          //用户同意了订阅
          wx.showToast({
            title: "订阅成功",
          });
        } else {
          //用户拒绝了订阅或当前游戏被禁用订阅消息
          wx.showToast({
            title: "订阅失败",
          });
        }
      },
      fail(res) {
        console.log(res);
      },
      complete(res) {
        console.log(res);
      },
    });
  },

  doClearStoreSyn: function () {
    var that = this;
    //that.setData({
    //  loading: true,
    //  disabled: true
    //});
    //that.update();

    wx.clearStorage({
      success: function () {
        console.log("清除缓存完成！");
        //  that.setData({
        //    loading: false,
        //    disabled: false,
        //    toast1Hidden: false
        //  });
        //  that.update();
      },
    });
  },
  // showMask: function () {
  //   this.setData({ flag: false })
  // },
  closeMask: function () {
    this.setData({ flag: true });
  },

  Input_login_name: function (e) {
    this.setData({
      login_name: e.detail.value,
    });
  },

  Input_login_pwd: function (e) {
    this.setData({
      login_pwd: e.detail.value,
    });
  },

  Input_CertyCode: function (e) {
    this.setData({
      certyCode: e.detail.value,
    });
  },

  Input_loginNamec: function (e) {
    this.setData({
      cachingName: e.detail.value,
    });
  },

  Input_IDNo: function (e) {
    this.setData({
      IDNo: e.detail.value,
    });
  },

  doLogin: function (e) {
    var that = this;
    if (that.data.login_name.length < 5 || that.data.login_pwd.length < 4) {
      wx.showModal({
        title: "提示",
        content: "请填写正确的编码和密码!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            return;
          }
        },
      });
      return;
    }
    wx.request({
      url: app.d.hostUrl + "/user_my_login.aspx",
      method: "post",
      data: {
        login_name: that.data.login_name,
        login_pwd: that.data.login_pwd,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        var user = res.data.productData[0];
        that.setData({
          isLogin: true,
          cardNo: user.cardNo,
          loginNamec: user.user_namec,
        });
        wx.setStorageSync("userKeyID", user.ID);
        wx.setStorageSync("cardNo", user.cardNo);
        wx.setStorageSync("loginNamec", user.user_namec);
        that.loadOrderStatus();
      },
      fail: function (e) {
        wx.showToast({
          title: "网络异常！",
          duration: 2000,
        });
      },
    });
  },

  forgetPWD: function (e) {
    var that = this;
    that.setData({
      isLogin: true,
      isForgetPWD: true,
    });
  },
  gotoLogin: function (e) {
    var that = this;
    that.setData({
      isLogin: false,
      isForgetPWD: false,
    });
  },
  //点击方法
  send: function () {
    var that = this;

    if (that.data.login_name.length < 5) {
      wx.showModal({
        title: "提示",
        content: "请输入会员编号!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            return;
          }
        },
      });
      return;
    }

    wx.request({
      url: app.d.hostUrl + "/certyCode_send2.aspx",
      data: {
        login_name: that.data.login_name,
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            certyCode_local: res.data.certyCode,
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000,
          });
        }
      },
      fail: function () {
        wx.showToast({
          title: "网络异常！",
          duration: 2000,
        });
      },
    });

    //将按钮设置为禁用
    this.setData({
      disabled: true,
      //certyCode:ran.Next(1000,9999)
    });
    //给定时器赋值
    this.data.timer = setInterval(() => {
      this.timer();
    }, 1000);
    //弹出提示框
    wx.showToast({
      title: "发送成功",
      duration: 2000,
    });
  },

  //定时器
  timer() {
    let time = this.data.time;
    time--;
    this.setData({
      time,
      text: time + "秒内有效",
    });
    //判断倒计时时间为0时
    if (time <= 0) {
      //清除定时器
      clearInterval(this.data.timer);
      //设置文本内容，倒计时间，按钮可用
      this.setData({
        text: "发送验证码",
        time: 60,
        disabled: false,
      });
    }
  },

  doGetPWD: function (e) {
    var that = this;

    if (
      that.data.certyCode_local != that.data.certyCode ||
      that.data.certyCode.length < 4
    ) {
      wx.showModal({
        title: "提示",
        content: "请填写正确的验证码!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            return;
          }
        },
      });
      return;
    }

    wx.request({
      url: app.d.hostUrl + "/user_getuserPwd.aspx",
      method: "post",
      data: {
        login_name: that.data.login_name,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          wx.showModal({
            title: "密码找回成功",
            content: "你的登录密码是：" + res.data.loginPwd,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  isLogin: false,
                  isForgetPWD: false,
                });
              }
            },
          });
          return;
        }
      },
      fail: function (e) {
        wx.showToast({
          title: "网络异常！",
          duration: 2000,
        });
      },
    });
  },

  closeMask: function () {
    this.setData({ flag: true });
  },

  Input_login_name: function (e) {
    this.setData({
      login_name: e.detail.value,
    });
  },

  Input_login_pwd: function (e) {
    this.setData({
      login_pwd: e.detail.value,
    });
  },

  Input_CertyCode: function (e) {
    this.setData({
      certyCode: e.detail.value,
    });
  },

  doLogin: function (e) {
    var that = this;
    if (that.data.login_name.length < 5 || that.data.login_pwd.length < 4) {
      wx.showModal({
        title: "提示",
        content: "请填写正确的编码和密码!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            return;
          }
        },
      });
      return;
    }
    wx.request({
      url: app.d.hostUrl + "/user_my_login.aspx",
      method: "post",
      data: {
        login_name: that.data.login_name,
        login_pwd: that.data.login_pwd,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        var user = res.data.productData[0];
        that.setData({
          isLogin: true,
          cardNo: user.cardNo,
          loginNamec: user.user_namec,
        });
        wx.setStorageSync("userKeyID", user.ID);
        wx.setStorageSync("cardNo", user.cardNo);
        wx.setStorageSync("loginNamec", user.user_namec);
        that.loadOrderStatus();
      },
      fail: function (e) {
        wx.showToast({
          title: "网络异常！",
          duration: 2000,
        });
      },
    });
  },

  forgetPWD: function (e) {
    var that = this;
    that.setData({
      isLogin: true,
      isForgetPWD: true,
    });
  },
  gotoLogin: function (e) {
    var that = this;
    that.setData({
      isLogin: false,
      isForgetPWD: false,
    });
  },
  //点击方法
  send: function () {
    var that = this;

    if (that.data.login_name.length < 5) {
      wx.showModal({
        title: "提示",
        content: "请输入会员编号!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            return;
          }
        },
      });
      return;
    }

    wx.request({
      url: app.d.hostUrl + "/certyCode_send2.aspx",
      data: {
        login_name: that.data.login_name,
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            certyCode_local: res.data.certyCode,
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000,
          });
        }
      },
      fail: function () {
        wx.showToast({
          title: "网络异常！",
          duration: 2000,
        });
      },
    });

    //将按钮设置为禁用
    this.setData({
      disabled: true,
      //certyCode:ran.Next(1000,9999)
    });
    //给定时器赋值
    this.data.timer = setInterval(() => {
      this.timer();
    }, 1000);
    //弹出提示框
    wx.showToast({
      title: "发送成功",
      duration: 2000,
    });
  },

  //定时器
  timer() {
    let time = this.data.time;
    time--;
    this.setData({
      time,
      text: time + "秒内有效",
    });
    //判断倒计时时间为0时
    if (time <= 0) {
      //清除定时器
      clearInterval(this.data.timer);
      //设置文本内容，倒计时间，按钮可用
      this.setData({
        text: "发送验证码",
        time: 60,
        disabled: false,
      });
    }
  },

  doGetPWD: function (e) {
    var that = this;

    if (
      that.data.certyCode_local != that.data.certyCode ||
      that.data.certyCode.length < 4
    ) {
      wx.showModal({
        title: "提示",
        content: "请填写正确的验证码!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            return;
          }
        },
      });
      return;
    }

    wx.request({
      url: app.d.hostUrl + "/user_getuserPwd.aspx",
      method: "post",
      data: {
        login_name: that.data.login_name,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          wx.showModal({
            title: "密码找回成功",
            content: "你的登录密码是：" + res.data.loginPwd,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  isLogin: false,
                  isForgetPWD: false,
                });
              }
            },
          });
          return;
        }
      },
      fail: function (e) {
        wx.showToast({
          title: "网络异常！",
          duration: 2000,
        });
      },
    });
  },
});
