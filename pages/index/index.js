var app = getApp();
var share_count = 0, width = 260, int = 1, interval = 0, page_first_init = !0, timer = 1, msgHistory = "", fullScreen = !1;
Page({
  data: {
    module_list: [],
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    sortData: [],
    briefData: [],
    productData: [],
    productData2: [],
    productData3: [],
    productData4: [],
    proVIP: [],
    proScore:[],
    salonData:[],
    shareData:[],
    msgList:[],
    briefNews: [],
    baoming:[],
    page: 2,
    index: 2,
    icoImgUrl:[],
    searchKey: '',
    page: 1,
    hidden: false, //是否显示上拉加载的图标
    show: false,  //是否显示 文字（已经没有数据了）
  },

  onLoad: function (options) {
    //console.log('options.referenceId:'+options.referenceId);
    if (!wx.getStorageSync('referenceId')){
      wx.setStorageSync('referenceId', options.referenceId);
    };

    // let roomId = [直播房间id] // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取
    // let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 1 })) // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）
    // this.setData({
    //     roomId,
    //     customParams
    // })

  //   wx.setTabBarBadge({ //购物车不为空 ，给购物车的tabar右上角添加购物车数量标志
  //     index: 3,						//标志添加位置
  //     text: '.'				//通过编译，将购物车总数量放到这里
  //  })

    this.loadIndex();
    //this.cart_TJ();
  },
  

  loadIndex:function(){
    console.log('userId_:' + wx.getStorageSync('userKeyID'));
    var that1=this;
    wx.request({
      url: app.d.hostUrl + '/Index_Get.aspx',
      method: 'post',
      data: {
        fromId: wx.getStorageSync('fromId'),
        storeId: wx.getStorageSync('storeId'),
        userKeyID:wx.getStorageSync('userKeyID')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var banner = res.data.banner;
        var sortList = res.data.sortList;
        var proList = res.data.proList;
        var proList2 = res.data.proList2;
        var proList3 = res.data.proList3;
        var proList4 = res.data.proList4;
        var msgList = res.data.msgList;
        var proScore = res.data.proScore;
        var proVIP = res.data.proVIP;
        var salonData = res.data.salonData;
        var shareData = res.data.shareData;
        var briefNews = res.data.briefNews;
        var module_list = res.data.module_list;
        var icoImgUrl = res.data.icoImgUrl[0];
        var baoming=res.data.baoming;
        that1.setData({
          module_list: module_list,
          imgUrls: banner,
          icoImgUrl: icoImgUrl,
          sortData: sortList,
          msgList: msgList,
          productData: proList,
          productData2: proList2,
          productData3: proList3,
          productData4: proList4,
          proScore: proScore,
          proVIP: proVIP,
          shareData: shareData,
          salonData: salonData,
          briefNews: briefNews,
          baoming:baoming,
          hidden: false,
        });
         //下拉刷新停止刷新        
         wx.stopPullDownRefresh();
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

  },


  onShareAppMessage: function () {
    return {
      title: '大管家首页',
      path: '/pages/index/index',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },

  onShareTimeline: function () {
    return {
        title: '患教文章',
        query: {
          articleId:articleId,
          unionId:app.globalData.unionId
        },
      }
  },

  onPullDownRefresh :function () {
    console.log('下拉刷新')
    this.setData({
      page: 1,
      hidden:true,
    //  list: []
    })
    this.onLoad();
  },



  //跳转商品搜索页  
  suo:function(e){
    wx.navigateTo({
      url: '../search/search',
      
      success: function(res){
        console.log("开始跳转：2");
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },


  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },

  doScan: function (e){
    wx.scanCode({
      onlyFromCamera: true,
      success (res) {
        console.log(res.result);
       var that = this;
        wx.request({
        url: app.d.hostUrl + '/scan_send.aspx',
        method: 'post',
        data: {
          username: wx.getStorageSync('openId'),
          result: res.result,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log("返回数据为：" + res.data);
          var status = res.data.status;
          if (status == 1) {
            wx.showToast({
              title: '扫码成功！',
              duration: 3000,
            });
            //that.setData({
              // article: list[0],
              // videos: res.data.videos,
              // newsId: option.id,
            //});
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
    

      }
    })
  },
  
  searchValueInput: function (e) {
    var value = e.detail.value;
    this.setData({
      searchValue: value,
    });
    //if (!value && this.data.productData.length == 0) {
      //this.setData({
      //  hotKeyShow: true,
      //  historyKeyShow: true,
      //});
    //}
  },

  doSearch: function (e) {
    var that = this;
    var searchKey = that.data.searchValue;
    console.log('SearChKey:' + searchKey);
    //if (!searchKey) {
      //this.setData({
        //focus: true,
        //hotKeyShow: true,
        //historyKeyShow: true,
      //});
      wx.navigateTo({
        url: '../proSearch/proSearch?keyword='+searchKey
      });

      //wx.showToast({
      //  title: '请输入查询关键字！',
      //})

      //return;
    //};
    

  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onShow: function () {
    console.log('index---------onShow()')
    this.animation = wx.createAnimation({
      duration: 1400,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0',
      success: function (res) {
        console.log("res")
      }
    });
    //this.cart_TJ();
  },

  rotateAni: function (n) {
    console.log("rotate==" + n)
    this.animation.rotate(180 * (n)).step()
    this.setData({
      animation: this.animation.export()
    })
  },

  play: function (t) {
    this.setData({
      play: t.currentTarget.dataset.index
    });
  },
  onPageScroll: function (k) {
    //console.log('开始滚动屏');
    //console.log('t.top：' + e.scrollTop);
    var e = this;
    fullScreen || -1 != e.data.play && wx.createSelectorQuery().select(".video").fields({
      rect: !0
    }, function (t) {
      var a = wx.getSystemInfoSync().windowHeight;
      //console.log('高：'+a);
      //console.log('e.top：' + k.scrollTop);
      (k.scrollTop <= -200 || k.scrollTop >= a - 57) && e.setData({
        play: -1
      });
    }).exec();
  },

  fullscreenchange: function (t) {
    fullScreen = !!t.detail.fullScreen;
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
        if (status == 1&&res.data.cart_tj_0>0) {
          wx.setTabBarBadge({ //购物车不为空 ，给购物车的tabar右上角添加购物车数量标志
            index: 1,						//标志添加位置
            text: res.data.cart_tj_0,				//通过编译，将购物车总数量放到这里
          })

        };
        // if (status == 1&&res.data.user_mobile.length==0) {
        //   wx.setTabBarBadge({ //购物车不为空 ，给购物车的tabar右上角添加购物车数量标志
        //     index: 3,						//标志添加位置
        //     text: '.',				//通过编译，将购物车总数量放到这里
        //   })
        // };
        // if (status == 1&&res.data.user_headpic.length==0) {
        //   wx.setTabBarBadge({ //购物车不为空 ，给购物车的tabar右上角添加购物车数量标志
        //     index: 3,						//标志添加位置
        //     text: '.',				//通过编译，将购物车总数量放到这里
        //   })
        // }
      },
      fail: function () {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  }
});