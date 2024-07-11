//index.js  
//获取应用实例  
var app = getApp(), timer = 1;
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({
  firstIndex: 0,
  data: {
    bannerApp: true,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,  
    productId: 0,
    ms_Id: 0,
    productName:'',
    specification:'',
    priceType:'',
    priceType_Name: '',
    price_yh:0,
    escore_Scores:0,
    allow_sell:0,
    proData: {},
    miaosha:{},
    comment_count:{},
    comment_list:{},
    autoplay: !1,
    hide: "hide",
    showPlayer:false,
    show: !1,
    content: '',
    bannerItem: [],
    buynum: 1,
    // 产品图片轮播
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    tab_detail: "active",
    tab_comment: "",

    // 属性选择
    firstIndex: -1,
    attrValueListIndex:0,
    index2: 0,

    userInfo2:{},
    userKeyId:'',
    //准备数据
    //数据结构：以一组一组来进行设定
    commodityAttr:[],
    attrValueList: [],
    portrait_temp:'',
    qrcode_temp:'',
    windowWidth:'',
    scale:'',
    bgPath:'',
    imgList: [],
    imgUrl:'',
    isRealName:false,
  },
  
  // 传值
  onLoad: function (option) {
    var that = this;
    if (!wx.getStorageSync('referenceId')){
      var s=option.productId.indexOf('_');
      wx.setStorageSync('referenceId', option.productId.substring(0,s));
    };
    
    console.log('产品值：' + option.productId);
      console.log('产品价：' + option.priceFrom);
      that.setData({
        productId: option.productId,
      });
      that.loadProductDetail(option.priceType, option.priceFrom,option.productId, that,option.referenceId);
    
  },

  setSpeci: function() {
    this.setData(
      {
        showModalStatus: true
      }
    );
  },

  // 点击加购物 弹窗
  setModalStatus: function (e) {
    var that = this;
    if (that.data.proData.proDepart=='报单专区'&&(!wx.getStorageSync('userMobile')||wx.getStorageSync('loginNamec')=='微信用户')) {
      wx.showModal({
        title: "登录提示",
        content: "亲，还没有实名认证哦，请先认证再购物!",
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            that.setData({
              isRealName:true
            })
          } 
        }
      })
      return;
    }

    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 10
    })

    this.animation = animation
    animation.translateY(300).step();

    this.setData({
      animationData: animation.export()
    })

    if (e.currentTarget.dataset.status == 1) {

      this.setData(
        {
          showModalStatus: true
        }
      );
    }
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
  },

  // 点击立即购买 弹窗
  setModalBuyStatus: function (e) {
    var that = this;
    if (that.data.proData.proDepart=='报单专区'&&(!wx.getStorageSync('userMobile')||wx.getStorageSync('loginNamec')=='微信用户')) {
      wx.showModal({
        title: "登录提示",
        content: "亲，还没有实名认证哦，请先认证再购物!",
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            that.setData({
              isRealName:true
            })
          } 
        }
      })
      return;
    }

    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 10
    })

    this.animation = animation
    animation.translateY(300).step();

    this.setData({
      animationData: animation.export()
    })

    if (e.currentTarget.dataset.status == 1) {

      this.setData(
        {
          showModalBuyStatus: true
        }
      );
    }
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData(
          {
            showModalBuyStatus: false
          }
        );
      }
    }.bind(this), 200)
  },

  // 加减
  changeNum: function (e) {
    var that = this;
    if (e.target.dataset.alphaBeta == 0) {
      if (this.data.buynum <= 1) {
        buynum: 1
      } else {
        this.setData({
          buynum: this.data.buynum - 1
        })
      };
    } else {
      if (that.data.priceType!='miaosha') {
        if (this.data.allow_sell!=0&&this.data.buynum + 1>this.data.allow_sell){
          wx.showModal({
            title: '限量销售商品',
            content: '每订单限量：'+this.data.allow_sell,
            showCancel: false
          },3000);
          return;
        }
        this.setData({
          buynum: this.data.buynum + 1
        })
      }
    };
  },

  // 商品详情数据获取
  loadProductDetail: function (priceType,price_yh,proId, that1,referenceId) {
    console.log("proId2:" + proId);
    //console.log("e:" + e);
    console.log("proId:" + proId);
    console.log("priceType:" + priceType);
    console.log("ms_Id:" + this.data.ms_Id);
    console.log("uId:" +wx.getStorageSync('userKeyID'));
    console.log("referenceId:" +referenceId);
    //var that1 = this;
    wx.request({
      url: app.d.hostUrl + '/proDetail_get.aspx',
      method: 'post',
      data: {
        productId: proId,
        priceType: priceType,
        //ms_Id:this.data.ms_Id,
        uid: wx.getStorageSync('userKeyID'),
        referenceId:referenceId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          var proData = res.data.proData[0];
          //var userInfo = res.data.userInfo[0];
          var content = proData.content;
          var comment_count = res.data.comment_count[0];
          var comment_list = res.data.comment_list;
          
          wx.setNavigationBarTitle({
            title: proData.name//页面标题为路由参数
          })
           
          content: WxParse.wxParse('content', 'html', proData.content, that1, 5),
          that1.setData({
            proData: proData,
            productName: proData.name,
            specification: proData.specification,
            price_Sale: proData.price_Sale,
            price_yh:price_yh,
            escore_Scores:proData.EScore_Scores,
            imgUrl:proData.photo_x2,
            score_Deduct: proData.score_Deduct,
            attrValueList:res.data.attrValueList,
            comment_count: comment_count,
            comment_list: comment_list,
            hide:'',
            priceType: priceType,
            priceType_Name:'会员价',
            allow_sell:proData.allow_sell,
            loginNamec:proData.user_namec,
            userMobile:proData.user_mobile,
            IDNo:proData.IDNo
            //userInfo:userInfo
          });

          that1.cart_TJ();
          //if (proData.miaosha.length>0) {
          //  that1.setData({
          //    miaosha: proData.miaosha[0],
          //    ms_type: proData.miaosha[0].type,
          //  });
          //  that1.miaoshaTimer();
          //};

        } else {
          wx.showToast({
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
  },
  // 属性选择

  Input_loginNamec:function(e) {
    this.setData({
      loginNamec:e.detail.value,
    })
  },

  Input_IDNo:function(e) {
    this.setData({
     IDNo:e.detail.value,
    })
  },

  doRealName:function() {
    var that2 = this;
    if (that2.data.userMobile.length!=11){
      wx.showModal({
        title: "提示",
        content: "请绑定手机号码!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };

    if (that2.data.loginNamec=='微信用户'){
      wx.showModal({
        title: "提示",
        content: "请填写真实姓名!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };

    if (that2.data.IDNo.length!=18){
      wx.showModal({
        title: "提示",
        content: "请正确填写18位身份证号!",
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
      url: app.d.hostUrl + '/updateRealName.aspx',
      method: 'post',
      data: {
        UId: wx.getStorageSync('userKeyID'),
        userMobile: that2.data.userMobile,
        loginNamec:that2.data.loginNamec,
        IDNo:that2.data.IDNo,
        referenceId:wx.getStorageSync('referenceId')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data;
        if (data.status == 1) {
          that2.setData({
            isRealName:false,
          });
            wx.showToast({
              title: '实名认证成功！',
              duration: 2000
            });
          
            wx.setStorageSync('userMobile', that2.data.userMobile);
            wx.setStorageSync('loginNamec', that2.data.loginNamec);
            
        }
      },
    });
  },

  //开始绑定手机
  getPhoneNumber: function (e) {//点击获取手机号码按钮
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.request({
          url: app.d.hostUrl + '/LoginSessionkey.aspx',
          method: 'post',
          data: {
            code: code,
            appId:app.d.appId,
            //appKey:app.d.appKey
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var data = res.data;
            wx.checkSession({
              success: function () {
        
                console.log(e.detail.errMsg)
                console.log(e.detail.iv)
                console.log(e.detail.encryptedData)
        
                var ency = e.detail.encryptedData;
                var iv = e.detail.iv;
                //var sessionk =  that.data.sessionKey;
        
                if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
                  that.setData({
                    modalstatus: true
                  });
                } else {//同意授权
                  wx.request({
                    method: "GET",
                    url: app.d.hostUrl + '/WX_AESDecrypt.ashx',
                    data: {
                      encrypdata: ency,
                      ivdata: iv,
                      sessionkey: res.data.session_key
                    },
                    header: {
                      'content-type': 'application/json' // 默认值  
                    },
                    success: (res) => {
                      console.log("解密成功~~~~~~~将解密的号码保存到本地~~~~~~~~");
                      console.log(res);
                      var phone = res.data.phoneNumber;
                      console.log('号码：'+phone);
                      that.updateMobile(phone);
                      that.setData({
                        userMobile:phone
                      });
                      
                      
                    }, 
                    fail: function (res) {
                      console.log("解密失败~~~~~~~~~~~~~");
                      console.log(res);
                    }
                  });
                }
              },
              fail: function () {
                console.log("session_key 已经失效，需要重新执行登录流程");
                that.wxlogin(); //重新登录
              }
            });
          },
          fail: function (e) {
            wx.showToast({
              title: '网络异常！err:getsessionkeys',
              duration: 2000
            });
          },
        });

      }
    });

  },

  updateMobile: function (userMobile) {
    var that2 = this;
    wx.request({
      url: app.d.hostUrl + '/updateMobile.aspx',
      method: 'post',
      data: {
        UId: wx.getStorageSync('userKeyID'),
        userMobile: userMobile
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data;
        console.log('更改手机号：' + data.status + ' ' + data.sql);
        if (data.status == 1) {
          app.d.userMobile = userMobile;
         that2.wx.setStorageSync('userMobile', userMobile)
            wx.showToast({
              title: '手机绑定成功！',
              duration: 2000
            });
          
        }
      },
    });
  },
  //结束绑定手机

  miaoshaTimer: function () {
    var t = this;
    t.data.miaosha && t.data.miaosha.rest_time && (timer = setInterval(function () {
      0 < t.data.proData.miaosha[0].rest_time ? (t.data.proData.miaosha[0].rest_time = t.data.proData.miaosha[0].rest_time - 1,
        t.data.miaosha = t.getTimesBySecond(t.data.proData.miaosha[0].rest_time),
        t.setData({
        miaosha: t.data.miaosha
        })) : clearInterval(timer);
    }, 1e3));

    if (t.data.proData.miaosha[0].rest_time==0) {
        t.setData({
          ms_type : 2,
        })
    }

  },

  getTimesBySecond: function (t) {
    if (t = parseInt(t), isNaN(t)) return {
      h: "00",
      m: "00",
      s: "00",
    };
    var a = parseInt(t / 3600), e = parseInt(t % 3600 / 60), i = t % 60;
    return 1 <= a && (a -= 1), {
      h: a < 10 ? "0" + a : "" + a,
      m: e < 10 ? "0" + e : "" + e,
      s: i < 10 ? "0" + i : "" + i
    };
  },


  initProductData: function(data) {
    data["LunBoProductImageUrl"] = [];

    var imgs = data.LunBoProductImage.split(';');
    for (let url of imgs) {
     url && data["LunBoProductImageUrl"].push(app.d.hostImg + url);
    }

    data.Price = data.Price / 100;
    data.VedioImagePath = app.d.hostVideo + '/' + data.VedioImagePath;
    data.videoPath = app.d.hostVideo + '/' + data.videoPath;
  },

  doAddFavorites: function(e) {
    var m = Date.getMinutes().toString();
    if (m != wx.getStorageSync('m')) {
      wx.setStorageSync('m', m)
      //正常执行程序。
      this.addFavorites();
    } else {
      //提交太频繁了。
    } 

  },

  //添加到收藏
  addFavorites: function() {
    var that = this;
    wx.request({
     url: app.d.hostUrl + '/UserFavorite_Add.aspx',
    method: 'post',
    data: {
      uid: wx.getStorageSync('userKeyID'),
      action : 'Add',
      proId: that.data.productId,
      price:that.data.price_yh,
      priceType:that.data.priceType,
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log('uid:'+wx.getStorageSync('userKeyID'));
      console.log('proId:'+ that.data.productId);    
      var data = res.data;
      if (data.status == 1) {
        console.log('收藏成功：proId='+res.data.proId);
        wx.showToast({
          title: '收藏成功！',
          duration: 2000
        });
        //变成已收藏，但是目前小程序可能不能改变图片，只能改样式
        //that.data.itemData.isCollect = true;
      } else {
        wx.showToast({
          title: data.err,
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


  //加入购物车
  addShopCart: function (e) { //添加到购物车
    var that = this;

    if (that.data.buynum>100){
      wx.showModal({
        title: "提示",
        content: "首次购买数量上限100!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 

        }
      })
      return;
    };

    if (that.data.priceType=='miaosha') {
      if (that.data.proData.miaosha[0].type==0) return wx.showToast({
        title: "秒杀活动已结束",
        image: "/images/icon-warning.png"
      }), !0;
      if (that.data.proData.miaosha[0].left_num == 0) return wx.showToast({
        title: "商品库存不足",
        image: "/images/icon-warning.png"
      }), !0;
    }

    wx.request({
      url: app.d.hostUrl + '/ShoppingCart_Add.aspx',
      method: 'post',
      data: {
        ms_Id: that.data.ms_Id,
        uid: wx.getStorageSync('userKeyID'),
        proId: that.data.productId,
        num: that.data.buynum,
        price_yh: that.data.price_yh,
        priceType: that.data.priceType,
        specification: that.data.specification,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data;
        console.log('CartId:' + res.data.cart_id);
        console.log('sql:'+res.data.sql);
        if (data.status == 1) {
          var ptype = e.currentTarget.dataset.type;
          if (ptype == 'buynow') {
            wx.redirectTo({
              url: '../order/ShopPay?priceType=' + that.data.priceType + '&orderNo=' + res.data.cart_id,
            });
            return;
          } else {
            console.log('加入购物车成功！');
            wx.showToast({
              title: '加入购物车成功',
              icon: 'success',
              duration: 2000
            });
            that.setData({
              showModalStatus:false,
            });
            that.cart_TJ();
          }
        } else {
          console.log('uid:' + wx.getStorageSync('userKeyID') + ' proId:' + that.data.productId + ' num:' + that.data.buynum),

            wx.showToast({
              title: data.err,
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
  },

  bindChange: function (e) {//滑动切换tab 
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },

  initNavHeight: function() {////获取系统信息
   var that = this;
   wx.getSystemInfo({
    success: function (res) {
      that.setData({
        winWidth: res.windowWidth,
        winHeight: res.windowHeight
      });
    }
   });
  },

  bannerClosed: function() {
   this.setData({
    bannerApp: false,
   })
  },

  swichNav: function (e) {//点击tab切换
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
     return false;
    } else {
      that.setData({
      currentTab: e.target.dataset.current
      })
    }
  },

  goIndex:function(e) {
   var that=this;
   console.log('开始跳转');
    wx.switchTab({
      url: '../index/index',
    });
  },
  goCart: function (e) {
    var that = this;
    console.log('开始跳转');
    wx.switchTab({
      url: '../cart/cart',
    });
  },

  

  drawImage() {
    //绘制canvas图片
    var that = this
    const ctx = wx.createCanvasContext('myCanvas')


    var bgPath = '../../../images/share_bg.png'
    //var bgPath = that.data.bgPath
    var portraitPath = that.data.portrait_temp
    var hostNickname = '力挽软件'//app.globalData.userInfo.nickName

    var qrPath = that.data.qrcode_temp
    var windowWidth = that.data.windowWidth
    that.setData({
      scale: 50,
      windowWidth:600,
      bgPath:bgPath,
    })
    
    wx.getImageInfo({
      src: 'https://api.lewon.net/weixin/data/share_bg.png',
      success(res) {
        console.log('Path:'+res.path)
        ctx.drawImage(res.path, 0, 0, 320, 150)
        ctx.draw()
      }
    })

  },


  canvasToImage2() {
    wx.canvasToTempFilePath({
      //x: 0,
      //y: 0,
      //width: 500,
      //height: 2500,
      //destWidth: 300,//输出
      //destHeight: 500,

      width: 600, //canvas原本的大小
      heght: 700,
      destWidth: 360,  //生成图片的大小设置成canvas大小的二倍
      destHeight: 580,
      canvasId: 'myCanvas',
      fileType: 'png',
      quality: 1,
      success(res) {
        //wx.authorize({
        //  scope: 'scope.writePhotosAlbum',
        //  success() {
        //    wx.saveImageToPhotosAlbum({
        //      filePath: res.tempFilePath,
        //      success() {
        //        wx.showToast({
        //          title: '图片保存成功'
        //        })
        //      }
        //    })
        //  }
        //})
      }
    }, this)
  },


  canvasToImage() {
    var that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 5,
      //width: 800,//that.data.windowWidth,
      //height: 700,//that.data.windowWidth * that.data.scale,
      //destWidth:400,// that.data.windowWidth * 4,
      //destHeight: 700,//that.data.windowWidth * 4 * that.data.scale,
      //canvasId: 'myCanvas',
      width: 320, //canvas原本的大小
      heght: 580,
      destWidth: 1000,  //生成图片的大小设置成canvas大小的二倍
      destHeight: 1600,
      canvasId: 'myCanvas',
      fileType: 'png',
      quality: 1,
      success: function (res) {
        console.log('朋友圈分享图生成成功:' + res.tempFilePath)
        wx.previewImage({
          current: res.tempFilePath, // 当前显示图片的http链接
          urls: [res.tempFilePath] // 需要预览的图片http链接列表
        })
      },
      fail: function (err) {
        console.log('失败')
        console.log(err)
      }
    })
  },


/* 获取数据 */
  distachAttrValue: function (commodityAttr) {
    /**
      将后台返回的数据组合成类似
      {
        attrKey:'型号',
        attrValueList:['1','2','3']
      }
    */
    //把数据对象的数据（视图使用），写到局部内
    var attrValueList = this.data.attrValueList;
    //遍历获取的数据
    for (var i = 0; i < commodityAttr.length; i++) {
      for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
        var attrIndex = this.getAttrIndex(commodityAttr[i].attrValueList[j].attrKey, attrValueList);
        console.log('属性索引', attrIndex);
        //如果还没有属性索引为 - 1，此时新增属性并设置属性值数组的第一个值；索引大于等于0，表示已存在的属性名的位置
        if (attrIndex >= 0) {
         // 如果属性值数组中没有该值，push新值；否则不处理
          if (!this.isValueExist(commodityAttr[i].attrValueList[j].attrValue, attrValueList[attrIndex].attrValues)) {
            attrValueList[attrIndex].attrValues.push(commodityAttr[i].attrValueList[j].attrValue);
          }
        } else {
          attrValueList.push({
            attrKey: commodityAttr[i].attrValueList[j].attrKey,
            attrValues: [commodityAttr[i].attrValueList[j].attrValue]
          });
        }
      }
    }
    console.log('result', attrValueList)
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        if (attrValueList[i].attrValueStatus) {
          attrValueList[i].attrValueStatus[j] = true;
        } else {
          attrValueList[i].attrValueStatus = [];
          attrValueList[i].attrValueStatus[j] = true;
        }
      }
    }
    this.setData({
      attrValueList: attrValueList
    });
  },
  getAttrIndex: function (attrName, attrValueList) {
    判断数组中的attrKey是否有该属性值
    for (var i = 0; i < attrValueList.length; i++) {
      if (attrName == attrValueList[i].attrKey) {
        break;
      }
    }
    return i < attrValueList.length ? i : -1;
  },
  isValueExist: function (value, valueArr) {
    判断是否已有属性值
    for (var i = 0; i < valueArr.length; i++) {
      if (valueArr[i] == value) {
        break;
      }
    }
    return i < valueArr.length;
  },

  /* 选择属性值事件 */
  selectAttrValue: function (e) {
    var attrValueList = this.data.attrValueList;
    var index = e.currentTarget.dataset.index;//属性索引
       console.log('index:'+index);
    var key = e.currentTarget.dataset.key;
       console.log('key:' + key);
    var value = e.currentTarget.dataset.value;
       console.log('value:' + value);
    var status = e.currentTarget.dataset.status;
       console.log('status:' + status);
    console.log('attrIndex:' + e.currentTarget.dataset.attrIndex);
    //var valueIndex = e.currentTarget.dataset.valueIndex;
    //console.log('valueIndex:' + valueIndex);
    if (e.currentTarget.dataset.status || index == this.data.firstIndex) {
      if (e.currentTarget.dataset.selectedvalue == e.currentTarget.dataset.value) ///
      {//取消选中
         this.disSelectValue(attrValueList, index, key, value);
      } 
      else {//选中
        this.selectValue(attrValueList, index, key, value);
      }
    }
  },

  /* 选中 */
  selectValue: function (attrValueList, index, key, value, unselectStatus) {
    console.log('firstIndex', this.data.firstIndex);
    var includeGroup = [];
    if (index == this.data.firstIndex && !unselectStatus) { // 如果是第一个选中的属性值，则该属性所有值可选
      var commodityAttr = this.data.commodityAttr;
      //其他选中的属性值全都置空
      console.log('其他选中的属性值全都置空', index, this.data.firstIndex, !unselectStatus);
      for (var i = 0; i < attrValueList.length; i++) {
        for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
          attrValueList[i].selectedValue = '';
        }
      } 
    } 
    else {
      var commodityAttr = this.data.commodityAttr;
    }

    console.log('选中', commodityAttr, index, key, value);

  attrValueList[index].selectedValue = value;

  //判断属性是否可选
    var ValueList='';
    var ValueItem='';
  for (var k = 0; k < attrValueList.length; k++) {
       
          for (var m = 0; m < attrValueList[k].attrValues.length; m++) {
            if (attrValueList[k].attrValues[m] == value) {
             attrValueList[k].attrValueStatus[m] = true;
            }
          } 
    ValueList = ValueList + attrValueList[k].attrKey +':'+ attrValueList[k].selectedValue+',';
    ValueItem= attrValueList[k].selectedValue+',';
  };
  //  console.log('选定值：', ValueItem);
  //console.log('结果', attrValueList);
  this.setData({
    attrValueList: attrValueList,
    specification: ValueList,
  });
  var that = this;
  //console.log('编码：'+that.data.proData.pro_number+' '+ValueItem);
  wx.request({
    url: app.d.hostUrl + '/proDetail_speciPrice_get.aspx',
    data: {
      //total_fee: that.data.total*100,//1分为单位
      proNum: that.data.proData.pro_number,//1分为单位
      itemSelected: ValueItem
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.data.status==1&&res.data.salePrice>0){
        //console.log('新的属性值:'+res.data.salePrice);
        that.setData({
          price_yh:res.data.salePrice,
          imgUrl:res.data.imgUrl
        });
      }
    },
  })
}, 



  onShareAppMessage: function () {
     return {
     title: this.data.productName,
       path: '/pages/proDetail/proDetail?priceType='+this.data.priceType+'&priceFrom='+this.data.price_yh+'&productId=' + this.data.productId + '&referenceId=' + wx.getStorageSync('userKeyID'),
     success: function (res) {
      // 分享成功
     },
     fail: function (res) {
      // 分享失败
     }
    }
  },

  onShareTimeline: function () {
    var that=this;
    //console.log(res);
    return {
      title: '【积分】'+that.data.productName,
      path: '/pages/proDetail/proDetail?priceType='+that.data.priceType+'&priceFrom='+that.data.price_yh+'&productId='+that.data.productId+'&referenceId='+wx.getStorageSync('userKeyID'),
      imageUrl:that.data.proData.photo_x,
      }
  },

  play: function (t) {
    var a = t.target.dataset.url;
    console.log('视频地址：'+a);
    this.setData({
      video_url: a,
      hide: "",
      showPlayer:true,
      show: !0
    });
    wx.createVideoContext("video").play();
  },
  close: function (t) {
    if ("video" == t.target.id) return !0;
    this.setData({
      hide: "hide",
      showPlayer: false,
      show: !1
    }), wx.createVideoContext("video").pause();
  },
  hide: function (t) {
    0 == t.detail.current ? this.setData({
      img_hide: ""
    }) : this.setData({
      img_hide: "hide"
    });
  },
  //分享开始
  //分享
  goShare: function (e) {
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/Get_WXProCode.aspx',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('userKeyID'),
        proId: that.data.productId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        console.log('Status:' + status);
        console.log('Img:' + res.data.imgList[0].image);
        if (status == 1) {
          that.setData({
            imgList: res.data.imgList,
          });
          wx.previewImage({
            current: that.data.imgList, // 当前显示图片的http链接
            urls: that.data.imgList // 需要预览的图片http链接列表
          })

        } else {
          wx.showToast({
            //title: res.data.err,
            duration: 2000
          });
        }
        //endInitData
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });

  },

  showShareModal: function () {
    this.setData({
      share_modal_active: "active",
      no_scroll: !0
    });
  },
  shareModalClose: function () {
    this.setData({
      share_modal_active: "",
      no_scroll: !1
    });
  },

  getGoodsQrcode: function () {
    var a = this;
    console.log('生成分享图片中：1');
    a.setData({
      goods_qrcode_active: "active",
      share_modal_active: "",
    }),

    console.log('生成分享图片中：2');
    wx.request({
      url: app.d.hostUrl + '/Get_WXProCode.aspx',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('userKeyID'),
        proId: a.data.productId,
        priceType:'会员价',
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (t) {
        a.setData({
          imgList:t.data.imgList,
          goods_qrcode: t.data.imgList[0],
        });
        //1 == t.code && (a.goodsQrcodeClose(), wx.showModal({
        //  title: "提示",
        //  content: t.msg,
        //  showCancel: !1,
        //  success: function (t) {
        //    t.confirm;
        //  }
        //}));
      },
      error: function (e) {
        wx.showModal({
          title: "提示",
          content: t.msg,
          showCancel: !1,
          success: function (t) {
            t.confirm;
          }
        });
      }
    });
  },
  goodsQrcodeClose: function () {
    this.setData({
      goods_qrcode_active: "",
      no_scroll: !1
    });
  },
  saveGoodsQrcode: function () {
    var a = this;
    wx.saveImageToPhotosAlbum ? (wx.showLoading({
      title: "正在保存图片",
      mask: !1
    }), wx.downloadFile({
      url: a.data.goods_qrcode,
      success: function (t) {
        wx.showLoading({
          title: "正在保存图片",
          mask: !1
        }), wx.saveImageToPhotosAlbum({
          filePath: t.tempFilePath,
          success: function () {
            wx.showModal({
              title: "提示",
              content: "商品海报保存成功",
              showCancel: !1
            });
          },
          fail: function (t) {
            wx.showModal({
              title: "图片保存失败",
              content: t.errMsg,
              showCancel: !1
            });
          },
          complete: function (t) {
            wx.hideLoading();
          }
        });
      },
      fail: function (t) {
        wx.showModal({
          title: "图片下载失败",
          content: t.errMsg + ";" + a.data.goods_qrcode,
          showCancel: !1
        });
      },
      complete: function (t) {
        wx.hideLoading();
      }
    })) : wx.showModal({
      title: "提示",
      content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
      showCancel: !1
    });
  },
  goodsQrcodeClick: function (t) {
    var a = t.currentTarget.dataset.imgList;
    wx.previewImage({
      current: this.data.imgList, // 当前显示图片的http链接
      urls: this.data.imgList // 需要预览的图片http链接列表
    })
  },
  //分享结束

  tabSwitch: function (t) {
    "detail" == t.currentTarget.dataset.tab ? this.setData({
      tab_detail: "active",
      tab_comment: ""
    }) : this.setData({
      tab_detail: "",
      tab_comment: "active"
    });
  },
  commentPicView: function (t) {
    var a = t.currentTarget.dataset.index, o = t.currentTarget.dataset.picIndex;
    wx.previewImage({
      current: this.data.comment_list[a].pic_list[o],
      urls: this.data.comment_list[a].pic_list
    });
  },

  cart_TJ:function () {
    var s=this;
    wx.request({
      url: app.d.hostUrl + '/ShoppingCart_TJ.aspx',
      method: 'post',
      data: {
        uid: wx.getStorageSync('userKeyID'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          s.setData({
            cart_tj: res.data.cart_tj,
          });
          // wx.setTabBarBadge({ //购物车不为空 ，给购物车的tabar右上角添加购物车数量标志
          //   index: 3,						//标志添加位置
          //   text: res.data.cart_tj,				//通过编译，将购物车总数量放到这里
          // })

        }
      },
      fail: function () {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
     

  },

  Input_buynum:function(e){
    this.setData({
      buynum: e.detail.value,
    })
  },

});
