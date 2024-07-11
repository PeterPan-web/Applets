// pages/panic/panic.js
var app = getApp();
Page({
  data:{
    quan_id:'',
    quanNo:'',
    quanNo_name:'',
    quanType:'',
    use_Place:'',
    useStatus:'',
    title_1:'',
    title_2:'',
    bgUrl_qunRight:'',
    bgUrl_qunLeft:'',
    cpTypeBg:'',
    useName:''
    
  },
   like:function(e){
    console.log(e.currentTarget.dataset.title)
    wx.navigateTo({
      url: '../proDetail/proDetail?title='+e.currentTarget.dataset.title,
      success: function(res){
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
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    //console.log('openId:'+options.openid);
    var that = this;
    that.setData({
      quan_id:options.quan_id
    });
    //wx.setStorageSync('openId', options.openid)
    that.loadQuan(options.quan_id);
  },

  loadQuan: function (quan_id) {
    var that = this;
   
    wx.request({
      url: app.d.hostUrl + '/Coupon_receive.aspx',
      method: 'post',
      data: {
        user_id: wx.getStorageSync("userKeyID"),
        quan_id:quan_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var quan = res.data.quan[0];
        var status = res.data.status;
        if (status == 1) {
              that.setData({
                quanNo:quan.quanNo,
                quanNo_name:quan.quanNo_name,
                quanType:quan.quanType,
                use_Place:quan.use_Place,
                title_1:quan.title_1,
                title_2:quan.title_2,
                bgUrl_qunRight:quan.bgUrl_qunRight,
                bgUrl_qunLeft:quan.bgUrl_qunLeft,
                cpTypeBg:quan.cpTypeBg,
                useStatus:quan.useStatus,
                useName:quan.useName
              });  
        } else {
          wx.showToast({
            title: res.data.err,
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

  bindReceiveQuan:function() {
    var that = this;
   
    wx.request({
      url: app.d.hostUrl + '/Coupon_receive_Confirm.aspx',
      method: 'post',
      data: {
        user_id: wx.getStorageSync("userKeyID"),
        quan_id:that.data.quan_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var quan = res.data.quan[0];
        var status = res.data.status;
        if (status == 1) {
          that.loadQuan(that.data.quan_id);
          wx.showToast({
            title: quan.useStatus,
            duration: 2000
          }); 
        } else {
          wx.showToast({
            title: res.data.err,
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

  onShareAppMessage: function () {
    return {
      title: '大管家 送你六天五晚旅游券',
      path: '/pages/coupon/coupon_receive?quan_id=' + this.data.quan_id,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },

})