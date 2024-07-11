var app = getApp()
Page({
  data: {
  },

  onLoad: function (options) {
   var that=this;
    switch (options.sort) {
      case 'mark':
        that.setData({
          title: '二维码',
          url: app.d.hostUrl + '/Get_WXUserMark.aspx?UId=' + wx.getStorageSync('userKeyID'),
        });
        break;
      case 'SList':
        that.setData({
          title: '队友',
          url: app.d.hostUrl + '/userTreeList.aspx?UId=' + wx.getStorageSync('userKeyID'),
        });
        break;
      case 'balance':
        that.setData({
          title: '我的余额',
          url: app.d.hostUrl + '/userBalance.asp?UId=' + wx.getStorageSync('userKeyID'),
        });
        break;
      case 'order':
        that.setData({
          title: '我的订单',
          url: app.d.hostUrl + '/userOrder.asp?UId=' + wx.getStorageSync('userKeyID'),
        });
        break;
      case 'score':
        that.setData({
          title: '已激活积分',
          url: app.d.hostUrl + '/userFunds.asp?UId=' + wx.getStorageSync('userKeyID'),
        });
        break;
      case 'score_wait':
        that.setData({
          title: '待激活积分',
          url: app.d.hostUrl + '/userScore_wait.asp?UId=' + wx.getStorageSync('userKeyID'),
        });
        break;
      case 'funds':
        that.setData({
          title: '我的消费金',
          url: app.d.hostUrl + '/userFunds.asp?UId=' + wx.getStorageSync('userKeyID'),
        });
        break;
      case 'news':
        that.setData({
          title: '新闻资讯',
          url: app.d.hostUrl + '/news.asp?NId=' + options.NewsId,
        });
        break;
      case 'action00':
        that.setData({
          title: '动作00',
          url: app.d.hostUrl + '/action00.aspx?UId=' + wx.getStorageSync('userKeyID'),
        });
        break;
      case 'action11':
        that.setData({
          title: '动作11',
          url: app.d.hostUrl + '/action11.aspx?UId=' + wx.getStorageSync('userKeyID'),
        });
        break;
      case 'action22':
        that.setData({
          title: '动作22',
          url: app.d.hostUrl + '/action22.aspx?UId=' + wx.getStorageSync('userKeyID'),
        });
        break;
      case 'action33':
        that.setData({
          title: '动作33',
          url: app.d.hostUrl + '/action33.aspx?UId=' + wx.getStorageSync('userKeyID'),
        });
        break;
        default:
        that.setData({
          url: options.sort,
        });
        break;
    }
  },

})