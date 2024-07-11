var app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data:{
    QuanId:0,
    nullHouse: true,  //先设置隐藏
    src: null,
    bcbh:0,
    staffBH:'',
    userList:[],
    orderNo:'',
    tj_money: 0
  },

  onLoad:function(options){
    var that=this;
    that.setData({
      QuanId:options.QuanId,
    })

    console.log('userId:' + wx.getStorageSync('userKeyID'));
    if (wx.getStorageSync('userKeyID') == "1") {
      wx.navigateTo({
        url: '../MemberShip/userLogin?from1=coupon&from2=useQuan',
      });
    };

    that.storeList();
  },

  storeList: function () {
    var that=this;
    wx.request({
      url: app.d.hostUrl + '/API8/getStoreList.aspx',
      method: 'post',
      data: {
        userName: app.d.openid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("返回数据为：" + res.data);
        var status = res.data.status;
        var userList = res.data.userList;//获取Json数组
        if (status == 1) {
          that.setData({
            userList: userList,
          });
        }; 
        
        that.setData({
          userList: userList,
        });
      },

    });

    
  },

  // 参数点击响应事件
  userListTap: function (e) {//e是获取e.currentTarget.dataset.id所以是必备的，跟前端的data-id获取的方式差不多
    var that = this;
    var this_checked = e.currentTarget.dataset.staffbh;
    

    that.setData({
      staffBH: this_checked,
    });
    console.log('充值选定值：' + that.data.staffBH);

    var userList = this.data.userList;//获取Json数组

    for (var i = 0; i < userList.length; i++) {
      //console.log('值' + i + '：' + userList[i].staffBH + '  选定的值：' + this_checked);

      if (userList[i].staffBH == this_checked) {
        userList[i].checked = true;
      }
      else {
        userList[i].checked = false;
      }
      //userList[0].checked = true;
    };
    that.setData({
      userList: userList,
    });
  },


  //微信支付创建订单
  confirmUseQuan: function (e) {
    var that = this;

    wx.request({
      url: app.d.hostUrl + '/Api8/Coupon_CheckOut.aspx',
      method: 'post',
      data: {
        user_id: app.d.openid,
        storeId: that.data.staffBH,
        QuanId:that.data.QuanId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          //wx.showToast({
          //  title: '提交成功！',
          //  duration: 2000
          //});
          wx.showModal({
            title: '恭喜你',
            content: '兑换成功',
            showCancel: false
          });
          wx.setStorageSync('orderNo', '');//成功付款，清空记录
          setTimeout(function () {
            wx.redirectTo({
              url: '../order/orderDish_Detail?orderNo=' + res.data.orderNo,
            });
          }, 2000)

        }else if (status == 2) {
          wx.showToast({
            title: '重复提交！',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: '提交失败！',
            duration: 2000
          });
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },

});