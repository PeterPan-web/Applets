var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({
    data:{
        wxParseData:[],
        article:{},
        videos: [],
        style:0,
        content:'',
        newsId:'',
        newsTitle:'',
        vid:'',
    },
    //onLoad:function(options){
        //this.setData({style:options.style})
        // this.getArticleDetail(options)
    //},
    
    onLoad: function (option) {

      if (!wx.getStorageSync('referenceId')){
       var s=option.id.indexOf('_');
        wx.setStorageSync('referenceId', option.id.substring(0,s));
      };

      var that = this;
      modalHidden: true;
      
      //that.getUserViewInfo(option.id, option.fromId);

      wx.request({
        url: app.d.hostUrl + '/Activity_More.aspx',
        method: 'post',
        data: {
          id:option.id,
          fromId: wx.getStorageSync('fromId'),
          storeId: wx.getStorageSync('storeId'),
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log("返回数据为：" + res.data);
          var status = res.data.status;
          if (status == 1) {
            var list = res.data.modalContent;
            wx.setNavigationBarTitle({
              title: res.data.modalContent[0].title,//页面标题为路由参数
            })
            that.setData({
              article: list[0],
              videos: res.data.videos,
              newsId: option.id,
              newsTitle: list[0].title,
              content: WxParse.wxParse('content', 'html', list[0].content, that, 5),
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
    }, 
   
   

    
    
    onShareAppMessage() {
      const promise = new Promise(resolve => {
        setTimeout(() => {
          resolve({
            title: '自定义转发标题'
          })
        }, 2000)
      })
      return {
        title: '自定义转发标题',
        path: '/pages/news/detail?id=' + this.data.newsId,
        promise 
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

  play: function (t) {
    this.setData({
      play: t.currentTarget.dataset.index
    });
  },

  fullscreenchange: function (t) {
    fullScreen = !!t.detail.fullScreen;
  }

})