var app = getApp();
// pages/order/downline.js
Page({
  data:{
    orderId:0,
    basket_id:0,
    reason:'',
    remark:'',
    orderStatus: '',
            total: 0,
            truePay: 0,
            orderNo:'',
            orderDate:'',
            CartID:'',
            ProID:'',
            proNum:'', 
            ProductName:'', 
            price:'',
            specification:'',
            BuyCount:'', 
            unit:'', 
            proDepart:'', 
            score_Deduct:'', 
            ImgUrl:'', 
            priceType:'', 
            priceType_Name:'', 
            num_refund:'', 
            money_refund:'', 
            reason_refund:'', 
  },
  onLoad:function(options){
    this.setData({
      basket_id: options.basket_id,
    });
    this.loadComsume();
  },

  loadComsume: function (){
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/userOrder_Refund.aspx',
      method:'post',
      data: {
        basket_id: that.data.basket_id,
        user_id:wx.getStorageSync('userKeyID')
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if(status==1){
          //var carts = res.data.detail;
          var order = res.data.detail[0];
          that.setData({
            orderData: order.orderDate,
            orderStatus: order.orderStatus,
            total: order.total,
            truePay: order.truePay,
            orderNo:order.orderNo,
            orderId: order.orderNo,
            //CartID: order.CartID，
            ProID: order.ProID,
            proNum: order.proNum, 
            ProductName: order.ProductName, 
            price: order.price,
            specification: order.specification,
            BuyCount: order.BuyCount, 
            unit: order.unit, 
            proDepart: order.proDepart, 
            score_Deduct: order.score_Deduct, 
            ImgUrl: order.ImgUrl, 
            priceType: order.priceType, 
            priceType_Name: order.priceType_Name, 
            num_refund: order.num_refund, 
            money_refund: order.money_refund, 
            reason_refund: order.reason_refund, 
          });
          
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
          // fail
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
      }
    });
  },

  submitReturnData:function(){
    //console.log(this.data);
    //数据验证
    if(!this.data.remark){
      wx.showToast({
        title: '请填写退款原因及数量',
        icon: 'success',
        duration: 2000
      });
      return;
    }
    // if(!this.data.remark){
    //   wx.showToast({
    //     title: '请填写退货描述',
    //     icon: 'success',
    //     duration: 2000
    //   });
    //   return;
    // }
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/UserOrder_Deal.aspx',
      method:'post',
      data: {
        orderSN: that.data.orderNo,
        basket_id: that.data.basket_id,
        OpType:'refund',
        back_remark:that.data.remark,
        //imgUrl:that.data.imgUrl,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var status = res.data.status;
        if(status == 1){
          wx.showToast({
            title: '您的申请已提交审核！',
            duration: 2000
          });
          wx.navigateTo({
            url: '../order/order_Detail?orderNo='+that.data.orderNo,
          });
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
    });

  },
  reasonInput:function(e){
    this.setData({
      reason: e.detail.value,
    });
  },
  remarkInput:function(e){
    this.setData({
      remark: e.detail.value,
    });
  },
  uploadImgs:function(){

    wx.chooseImage({
      success: function(res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'http://example.com/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData:{
            'user': 'test'
          },
          success: function(res){
            var data = res.data
            //do something
          }
        })
      }
    });
  },
})