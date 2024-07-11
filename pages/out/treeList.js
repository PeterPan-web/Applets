var app = getApp()
Page({
  data: {
  },

  onLoad: function (options) {
   var that=this;
        that.setData({
          title: '队友',
          url: app.d.hostUrl + '/userTreeList.aspx?UId=' + wx.getStorageSync('userKeyID'),
        });
  },

})