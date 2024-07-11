var app = getApp();
Page({
  data:{
    focus:true,
    hotKeyShow:true,
    historyKeyShow:true,
    searchValue:'',
    page:0,
    productData:[],
    historyKeyList:[],
    hotKeyList:[],
    count_search:'',
    uid:'',
    username:'',
    user_namec:'',
    user_type:''
  },
  onLoad:function(){
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/coupon_search.aspx',
      method:'post',
      data: {
        uid:wx.getStorageSync('userKeyID'),
        searchKey: ''
        },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          productData: res.data.productData,
          count_search:res.data.count_search
        });
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },
  onReachBottom:function(){
      //下拉加载更多多...
      this.setData({
        page:(this.data.page+10)
      })
      
      this.searchProductData();
  },

  doSearch:function(){
    var searchKey = this.data.searchValue;
    if (!searchKey) {
        this.setData({
            focus: true,
            hotKeyShow:true,
            historyKeyShow:true,
        });
        return;
    };

    this.setData({
      hotKeyShow:false,
      historyKeyShow:false,
    })
    
    //this.data.productData.length = 0;
    this.searchUserData();

    //this.getOrSetSearchHistory(searchKey);
  },

  getOrSetSearchHistory:function(key){
    var that = this;
    wx.getStorage({
      key: 'historyKeyList',
      success: function(res) {
          console.log(res.data);

          //console.log(res.data.indexOf(key))
          if(res.data.indexOf(key) >= 0){
            return;
          }

          res.data.push(key);
          wx.setStorage({
            key:"historyKeyList",
            data:res.data,
          });

          that.setData({
            historyKeyList:res.data
          });
      }
    });
  },
  searchValueInput:function(e){
    var value = e.detail.value;
    this.setData({
      searchValue:value,
    });
    if(!value && this.data.productData.length == 0){
      this.setData({
        hotKeyShow:true,
        historyKeyShow:true,
      });
    }
  },

  searchUserData:function(){
    var that = this;
    console.log('keyword2:' + that.data.searchValue);
    wx.request({
      url: app.d.hostUrl + '/user_my_search.aspx',
      method:'post',
      data: {
        searchKey:that.data.searchValue,
        uid: wx.getStorageSync('userKeyID'),
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) { 
        console.log('status:' + res.data.status);
        console.log(res.data.productData);  
        var user = res.data.productData[0];
        that.setData({
          //productData:that.data.productData.concat(data),
          productData: res.data.productData,
          uid:user.ID,
          username:user.username,
          user_namec:user.user_namec,
          user_type:user.user_type
        });
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },

  doSwitch:function(){
    var that=this;
    wx.setStorageSync('userKeyID', that.data.uid),
    wx.setStorageSync('openId', that.data.username)
    wx.showModal({
      title: '恭喜你',
      content: '切换成功',
      showCancel: false
    });
    wx.switchTab({
      url: '../userCenter/userCenter',
    })

  }

});