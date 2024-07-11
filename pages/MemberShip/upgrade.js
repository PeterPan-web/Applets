// pages/userCenter/userCenter.js
var app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page( {
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userId:{},
    from1:{},
    from2:{},
    reId:{},
    pageSort: {},
    TId:{},
    proList:[],
    loginPic:'',
    userType_Name:'',
    wxParseData: [],
    loadingText: '加载中...',
    loadingHidden: false, 
    wxParseData:[],
    content:'',
    giftNo:''
  },
  onLoad: function (option) {
    var that = this;
    that.setData({
      from1 : option.from1,
      from2 : option.from2,
      pageSort : option.pageSort,
      reId:option.reId,
      userType_Name:option.userType_Name
    });
    
    wx.request({
      url: app.d.hostUrl + '/members_Reg.aspx',
      method: 'post',
      data: {
        userType_Name:that.data.userType_Name
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("返回数据为：" + res.data);
        //var that2=this;
        var status = res.data.status;
        console.log('图片：' + res.data.modalContent[0].img);
        if (status == 1) {
          that.setData ({
            loginPic: res.data.modalContent[0].img,
            proList:res.data.proList,
            //content: WxParse.wxParse('content', 'html', proList[0].content, that, 5),
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

      console.log('Log:开始加载Log');
      console.log('userId:' + app.d.userKeyID);
      console.log('openId:' + app.d.openId);

  },


  loadUpgrade:function() {

  },

  gotoUpgrade:function () {
    console.log('开始跳转');
    wx.navigateTo({
      url: '../proSpecial/proSpecial?sort=810&title=创客专区',
      success: function(res) {
      },
      fail: function(res) {
      },
      complete: function(res) {
      },
     })
  },

  gotoUpgrade2:function () {
    console.log('开始跳转');
    wx.navigateTo({
      url: '../proSpecial/proSpecial?sort=811&title=理事专区',
      success: function(res) {
      },
      fail: function(res) {
      },
      complete: function(res) {
      },
     })
  },

  getSelectItem:function(e){
    var that = this;
    var itemWidth = e.detail.scrollWidth / that.data.proList.length;//每个商品的宽度
    var scrollLeft = e.detail.scrollLeft;//滚动宽度
    var curIndex = Math.round(scrollLeft / itemWidth);//通过Math.round方法对滚动大于一半的位置进行进位
    for (var i = 0, len = that.data.proList.length; i < len; ++i) {
        that.data.proList[i].selected = false;
    }
    that.data.proList[curIndex].selected = true;
    that.setData({
        proList: that.data.proList,
        giftNo: this.data.proList[curIndex].id
    });
  },
  
  selectProItem:function(e){
    console.log('当前值：'+e.currentTarget.dataset.id);
    if (this.data.userType_Name!='会员'&&this.data.userType_Name!='创客'){
      return;
    };
    
    wx.navigateTo({
      url: '../proSpecial/proSpecial?sort=811&title='+e.currentTarget.dataset.title,
      success: function(res) {
      },
      fail: function(res) {
      },
      complete: function(res) {
      },
     })
  }

})