var app = getApp(), is_loading_more = !1, is_no_more = !1;;
Page({
  data:{
    page:1,
    productData:[],
  },
  onLoad:function(option){
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/SpecialPro_Get.aspx',
      method: 'post',
      data: {
        user_Id: wx.getStorageSync('userKeyID'),
        showSort: option.sort,
        pagesize: 100,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status=res.data.status;
        console.log('status:'+status);
        that.setData({
          productData: res.data.productData,
        });
        wx.setNavigationBarTitle({
          title: option.title,
        });
        //endInitData
      },
    });
  },

  sortClick: function (t) {
    var a = this, i = t.currentTarget.dataset.sort, o = null == t.currentTarget.dataset.default_sort_type ? -1 : t.currentTarget.dataset.default_sort_type, e = a.data.sort_type;
    if (a.data.sort == i) {
      if (-1 == o) return;
      e = -1 == a.data.sort_type ? o : 0 == e ? 1 : 0;
    } else e = o;
    a.setData({
      sort: i,
      sort_type: e
    }), a.reloadGoodsList();
  },

  reloadGoodsList: function () {
    var a = this;
    is_no_more = !1, a.setData({
      page: 1,
      goods_list: [],
      show_no_data_tip: !1
    });
    var t = a.data.cat_id || "", i = a.data.page || 1;
    wx.request({
      url: app.d.hostUrl + '/SpecialPro_Get.aspx',
      data: {
        cat_id: t,
        page: i,
        sort: a.data.sort,
        sort_type: a.data.sort_type,
        goods_id: a.data.goods_id
      },
      success: function (t) {
        0 == t.code && (0 == t.data.list.length && (is_no_more = !0), a.setData({
          page: i + 1
        }), a.setData({
          goods_list: t.data.list
        })), a.setData({
          show_no_data_tip: 0 == a.data.goods_list.length
        });
      },
      complete: function () { }
    });
  },

});