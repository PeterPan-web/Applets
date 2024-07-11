var app = getApp();
Page({
  data:{
    page:1,
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
    carts: [],
    userName_Top:''
  },

  // #加载购物车里的数据开始
  loadProductData: function (strUserName) {
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/userTree_Get.aspx',
      method: 'post',
      data: {
        userName: strUserName
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var cart = res.data.userList;
        that.setData({
          carts:cart,
          score_balance:res.data.score,
          user_type: res.data.user_type,
          curUserName:res.data.curUserName,
          userParent:res.data.userParent,
          market_tj:res.data.market_tj,
          self_tj:res.data.self_tj
        });
      },
    });
  },
  //#加载购物车里的数据结束


  onLoad:function(options){
    var that=this;
    that.setData({
      userName_Top:wx.getStorageSync('openId')
    });
    that.loadProductData(wx.getStorageSync('openId'));
  },

  onShow:function(){
    var that=this;
    that.setData({
      userName_Top:wx.getStorageSync('openId')
    });
    //that.loadProductData(wx.getStorageSync('openId'));
  },
 
  goView:function(e){
    var that=this;
    var cur=e.currentTarget.dataset.cur;
    var zt_count=e.currentTarget.dataset.count;
    console.log('当前值：'+cur);
    if (zt_count!='0'){
      that.loadProductData(cur);
    }
  },
  goBack:function(e){
    var that=this;
    console.log('当前值：'+that.data.userParent);
      that.loadProductData(that.data.userParent);
  },

})