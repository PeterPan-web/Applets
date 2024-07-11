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
    proScore:[],
    page: 2,
    index: 2,
    imgUrl: [],
    icoImgUrl:[],
    page: 1,
    hidden: false, //是否显示上拉加载的图标
    show: false,  //是否显示 文字（已经没有数据了）
  },

  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#8a00ff',
    });
    this.loadIndex();
  },
  

  loadIndex:function(){
    console.log('userId_:' + wx.getStorageSync('userKeyID'));
    var that1=this;
    wx.request({
      url: app.d.hostUrl + '/Score_Get.aspx',
      method: 'post',
      data: {
        //fromId: wx.getStorageSync('fromId'),
        //storeId: wx.getStorageSync('storeId'),
        userKeyID:wx.getStorageSync('userKeyID')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var proScore = res.data.proScore;
        that1.setData({
          proScore: proScore,
          hidden: false,
        });

         //that.miaoshaTimer();
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
    })
    this.onLoad();
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onShow: function () {
    //this.cart_TJ();
  },

});