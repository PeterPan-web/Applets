var app = getApp();
// pages/userCenter/shoucang.js
Page({
  data:{
    page:1,
    productData:[],
  },
  onLoad:function(options){
    this.loadProductData();
  },
  onShow:function(){
    // 页面显示
    this.loadProductData();
  },

  
//加载
  loadProductData:function(){
    var that = this;
    //console.log(this.data);
    wx.request({
      url: app.d.hostUrl + '/UserFavorite_Get.aspx',
      method:'post',
      data: {
        user_Id: wx.getStorageSync('userKeyID'),
        // pageindex: that.data.page,
        // pagesize:100,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //console.log(res.data.status);
        var favorite=res.data.favorite;
        //--init data
        //var data = res.data.data;
        //that.initProductData(data);
        that.setData({
          //productData:that.data.productData.concat(data),//concat 增加数组元素
          productData:favorite,
        });
        //endInitData
      },
    });
  },

//初始化
  initProductData: function (data){
    for(var i=0; i<data.length; i++){
      //console.log(data[i]);
      var item = data[i];

      item.Price = item.Price/100;
      item.ImgUrl = app.d.hostImg + item.ImgUrl;

    }
  },

//移除
  removeFavorites: function (e) {
    var that = this;
    var ccId = e.currentTarget.dataset.favId;

    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function (res) {

        res.confirm && wx.request({
          url: app.d.hostUrl + '/UserFavorite_Del.aspx',
          method: 'post',
          data: {
            ccId: ccId,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var data = res.data;
            console.log('删除Id：' + ccId);
            //todo
            if (data.result == 'ok') {
              console.log('删除成功');
              //that.data.productData.length =0;??
              that.loadProductData();
            }
          },
        });

      }
    });
  },

});