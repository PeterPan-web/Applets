var app = getApp();
const QR =require('../../utils/weapp-qrcode.js');
Page({
  data:{
    userId:0,
    paytype:'weixin',//0线下1微信
    remark:'',
    btnDisabled:false,
    visit_have:false,
    visit2_have:false,
    visit3_have:false,
    visit:[],
    visit2:[],
    visit3:[],
    quan:[],
    quan_id:0,
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
    QrCodeURL:'', // 二维码图片路径
    mark:'',
  },
  
  onLoad:function(options){
    var uid = wx.getStorageSync('userKeyID');
    console.log('quan_id:'+options.quan_id);
    this.setData({
      quan_id: options.quan_id,
      userId: uid,
      userType:wx.getStorageSync('userType'),
    });
    
    this.loadProductDetail();
    //this.drawImg(this.data.mark);
  },

  loadProductDetail:function(){
    var that = this;
    //console.log('1:'+that.data.cartId + '0');
    wx.request({
      url: app.d.hostUrl + '/coupon_more.aspx',
      method:'post',
      data: {
        quan_id: that.data.quan_id,
        uid: wx.getStorageSync('userKeyID'),
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('status:'+res.data.status);
        var quan =res.data.quan;
        var visit =res.data.visit;
        var visit2 =res.data.visit2;
        var visit3 =res.data.visit3;
        //console.log('地址0:' + adds.id);
        if (quan.length>0){
          console.log('统计1：'+quan.length);
          that.setData({
            quan: quan[0],
            mark:quan[0].mark
          });
         
        };

        if (visit.length>0){
          console.log('统计2：'+visit.length);
          that.setData({
            visit_have: true,
            visit: visit,
          });
        };
        if (visit2.length>0){
          console.log('统计2：'+visit2.length);
          that.setData({
            visit2_have: true,
            visit2: visit2,
          });
        };
        if (visit3.length>0){
          console.log('统计2：'+visit.length);
          that.setData({
            visit3_have: true,
            visit3: visit3,
          });
        };

      },
    });
  },



  remarkInput:function(e){
    this.setData({
      remark: e.detail.value,
    })
  },

  drawImg: function (mark){
    let that = this,
        params = mark;// "https://www.baidu.com/";  // 二维码参数 
    var imgData = QR.drawImg(params, {
        typeNumber: 4,          // 密度
        errorCorrectLevel: 'H', // 纠错等级
        size: 800,              // 白色边框
    })
    that.setData({
        qrcodeURL: imgData
    })
  },

  //点击一键复制
copyBtn: function (e) {
  var that = this;

  wx.setClipboardData({
    //准备复制的数据内容
    data: that.data.quan.quanNo+'|'+that.data.quan.pass,
    success: function (res) {
      wx.showToast({
        title: '复制成功',
      });
    }
  });
},

});