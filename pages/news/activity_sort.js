var app = getApp();
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    hotNews:[],
    modalContent:[],
    modalHidden: true,
    imgUrl: [],
  },

  onLoad: function (option) {
    var that = this;
    modalHidden: true;
    wx.request({
      url: app.d.hostUrl + '/Activity_List.aspx',
      method: 'post',
      data: {
        userKeyID: wx.getStorageSync('userKeyID'),
        sort:option.sort,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("返回数据为：" + res.data);
        var title_sort = res.data.title_sort;
        var status = res.data.status;
        if (status == 1) {
          var list = res.data.hotnews;
          var banner = res.data.banner;
          that.setData({
            imgUrls: banner,
            hotNews: list,
          });
          wx.setNavigationBarTitle({
            title: title_sort
          })
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


  modalTap: function (e) {
    var self = this;
    var that = this;
    console.log('当前值：' + e.currentTarget.dataset.index)
    wx.request({
      url: app.d.hostUrl + '/Activity_More.aspx',
      method: 'post',
      data: {
        id: e.currentTarget.dataset.index,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.log("返回数据为：" + res.data);
        var status = res.data.status;
        if (status == 1) {
          var list = res.data.modalContent;
          that.setData({
            modalContent: list[0],
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

    })
    this.setData({
      //modalContent: self.data.data.hotnews[Number(e.currentTarget.dataset.index)],
      modalHidden: false
    })
  },

  
  doGetWXCode: function () {
    var that = this;
    wx.request({
      url: that.d.hostUrl + '/LoginSessionkey.aspx',
      method: 'post',
      data: {
        path: "pages/index?query=1", 
        width: 430
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data;
        console.log('status:' + data.status);

        var openid = data.openid;
        var userKey = data.userKeyID;
        
        //console.log('获取userKeyID:' + userKey);

        if (data.status == 0) {
          wx.showToast({
            title: data.err,
            duration: 2000
          });
          return false;
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


  modalHide: function(e) {
    this.setData({
      modalHidden: true
    })
  }
  // contentLimit: function(content) {
  //   return content.substr(20)
  // }
})
