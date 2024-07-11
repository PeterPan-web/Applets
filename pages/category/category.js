// import ApiList from  '../../config/api';
// import request from '../../utils/request.js';
//获取应用实例  
var app = getApp();
Page({
    data: {
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      circular: true,
        //typeTree: {}, // 数据缓存
      currType: 177 ,
        // 当前类型
      currType2: 0,
        // 当前类型
      types: [],
      proTree: [],
      sortTree: [],
      sortTree_have:false,
      loadingStatus:false,
    },
        
    onLoad: function (option){
        var that = this;
        wx.request({
          url: app.d.hostUrl + '/Category_Get.aspx',
            method:'post',
            data: {
              userKeyID:wx.getStorageSync('userKeyID')
            },
            header: {
              'Content-Type':  'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log("返回数据为：" + res.data);
              var status = res.data.status;
                if(status==1) { 
                  var list = res.data.list;
                  var catList = res.data.catList;
                  var currType = res.data.currType;
                    that.setData({
                      types:list,
                      proTree:catList,
                      currType: currType,
                    });
                } else {
                    wx.showToast({
                        title:res.data.err,
                        duration:2000,
                    });
                };

              that.getSortTree(that.data.currType);
            },
            error:function(e){
                wx.showToast({
                    title:'网络异常！',
                    duration:2000,
                });
            },

        });

    },    
 

    //#左侧分类按钮事件开始
    tapType: function (e){
        var that = this;
        const currType = e.currentTarget.dataset.sortid;
        that.setData({
            currType: currType
        });
        that.setData({
          loadingStatus: true,
        });
        console.log('当前类型:'+currType);
        wx.request({
          url: app.d.hostUrl + '/Category_Sort_Get.aspx',
            method:'post',
            data: {
              showSort:currType,
              userKeyID:wx.getStorageSync('userKeyID')
              },
            header: {
                'Content-Type':  'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var status = res.data.status;
                if(status==1) { 
                  var catList = res.data.productData;
                  var sortTree=res.data.sortTree;
                  
                  that.setData({
                    sortTree: sortTree,
                    proTree: catList,
                  })
                    
                } else {
                    wx.showToast({
                        title:res.data.err,
                        duration:2000,
                    });
                }
            },
            error:function(e){
                wx.showToast({
                    title:'网络异常！',
                    duration:2000,
                });
            }
        });
      that.setData({
        loadingStatus: false,
      });
    },
    //#左侧分类按钮事件结束

    //#左侧分类按钮事件开始
    tapSort: function (e) {
      var that = this;
      const currType2 = e.currentTarget.dataset.sortid;
      console.log('二级分类：'+currType2);
      that.setData({
       currType2: currType2,
      });
      that.getProTree(that.data.currType2);
    },


    //#左侧分类按钮事件开始
    getSortTree: function (currType) {
      var that = this;
      that.setData({
        currType: currType
      });
      console.log('当前类型:' + currType);
      wx.request({
        url: app.d.hostUrl + '/Category_Sort_Get.aspx',
        method: 'post',
        data: {
         showSort: currType,
         userKeyID:wx.getStorageSync('userKeyID')
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var status = res.data.status;
          if (status == 1) {
            var catList = res.data.productData;
            var sortTree = res.data.sortTree;

            that.setData({
              sortTree: sortTree,
              proTree: catList,
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
        }
      });
    },
    //#左侧分类按钮事件结束

    //#左侧分类按钮后事件开始
    getProTree: function (currType) {
      var that = this;
      wx.request({
        url: app.d.hostUrl + '/Category_Pro_Get.aspx',
        method: 'post',
        data: {
         showSort: currType,
         userKeyID:wx.getStorageSync('userKeyID')
        },
        header: {
         'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var status = res.data.status;
          if (status == 1) {
            var catList = res.data.productData;
            that.setData({
              proTree: catList
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
        }
      });
    },
    //#左侧分类按钮事件结束

})