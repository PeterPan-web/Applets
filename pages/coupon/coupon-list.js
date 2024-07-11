//var api = require("../../api.js"),
var app = getApp(), share_count = 0;

Page({
    data: {},
    onLoad: function(t) {
        app.pageOnLoad(this);
        var o = this;
        wx.showLoading({
            mask: !0
        }), wx.request({
          url: app.d.hostUrl + '/Coupon_List.aspx',
            success: function(t) {
                1 == t.data.status && o.setData({
                    coupon_list: t.data.quan
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    receive: function(t) {
        var n = this, o = t.target.dataset.index;
        wx.showLoading({
            mask: !0
        }), n.hideGetCoupon || (n.hideGetCoupon = function(t) {
            var o = t.currentTarget.dataset.url || !1;
            n.setData({
                get_coupon_list: null
            }), o && wx.navigateTo({
                url: o
            });
        }), wx.request({
          url: app.d.hostUrl + '/coupon_receive.aspx',
            data: {
              id: o,
              user_id: wx.getStorageSync('userKeyID'),
            },
            success: function(t) {
                1 == t.data.status && n.setData({
                    //get_coupon_list: t.data.list,
                    coupon_list: t.data.coupon_list
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    goodsList: function(t) {
        var o = t.currentTarget.dataset.goods, n = [];
        for (var a in o) n.push(o[a].id);
        wx.navigateTo({
            url: "/pages/list/list?goods_id=" + n,
            success: function(t) {},
            fail: function(t) {}
        });
    }
});