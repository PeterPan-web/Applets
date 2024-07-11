module.exports = {
    currentPage: null,
    onLoad: function(a) {
        this.currentPage = a;
        var t = this;
        if (a.options) {
            var e = 0;
            if (a.options.user_id) e = a.options.user_id; else if (a.options.scene) if (isNaN(a.options.scene)) {
                var i = decodeURIComponent(a.options.scene);
                i && (i = getApp().utils.scene_decode(i)) && i.uid && (e = i.uid);
            } else e = a.options.scene;
            e && wx.setStorageSync("parent_id", e);
        }
        if (void 0 === a.openWxapp && (a.openWxapp = getApp().openWxapp), void 0 === a.showToast && (a.showToast = function(e) {
            t.showToast(e);
        }), void 0 === a._formIdFormSubmit) {
            t = this;
            a._formIdFormSubmit = function(e) {
                t.formIdFormSubmit(e);
            };
        }
        getApp().setNavigationBarColor(), this.setPageNavbar(a), a.naveClick = function(e) {
            getApp().navigatorClick(e, a);
        }, this.setDeviceInfo(), this.setPageClasses(), this.setUserInfo(), void 0 === a.showLoadling && (a.showLoading = function(e) {
            t.showLoading(e);
        }), void 0 === a.hideLoading && (a.hideLoading = function(e) {
            t.hideLoading(e);
        }), this.setWxappImg();
    },
    onReady: function(e) {
        this.currentPage = e;
    },
    onShow: function(e) {
        this.currentPage = e, getApp().order_pay.init(e, getApp());
    },
    onHide: function(e) {
        this.currentPage = e;
    },
    onUnload: function(e) {
        this.currentPage = e;
    },
    showToast: function(e) {
        var a = this.currentPage, t = e.duration || 2500, i = e.title || "", s = (e.success, 
        e.fail, e.complete || null);
        a._toast_timer && clearTimeout(a._toast_timer), a.setData({
            _toast: {
                title: i
            }
        }), a._toast_timer = setTimeout(function() {
            var e = a.data._toast;
            e.hide = !0, a.setData({
                _toast: e
            }), "function" == typeof s && s();
        }, t);
    },
    formIdFormSubmit: function(e) {},
    setDeviceInfo: function() {
        var e = this.currentPage, a = [ {
            id: "device_iphone_5",
            model: "iPhone 5"
        }, {
            id: "device_iphone_x",
            model: "iPhone X"
        } ], t = wx.getSystemInfoSync();
        if (t.model) for (var i in 0 <= t.model.indexOf("iPhone X") && (t.model = "iPhone X"), 
        a) a[i].model == t.model && e.setData({
            __device: a[i].id
        });
    },
    setPageNavbar: function(s) {
        var a = this, e = wx.getStorageSync("_navbar");
        e && n(e);
        var t = !1;
        for (var i in this.navbarPages) if (s.route == this.navbarPages[i]) {
            t = !0;
            break;
        }
        function n(e) {
            var a = !1, t = s.route || s.__route__ || null;
            for (var i in e.navs) e.navs[i].url === "/" + t ? a = e.navs[i].active = !0 : e.navs[i].active = !1;
            a && s.setData({
                _navbar: e
            });
        }
        t && getApp().request({
            url: getApp().api.default.navbar,
            success: function(e) {
                0 == e.code && (n(e.data), wx.setStorageSync("_navbar", e.data), a.setPageClasses());
            }
        });
    },
    navbarPages: [ "pages/index/index", "pages/cat/cat", "pages/cart/cart", "pages/user/user", "pages/list/list", "pages/search/search", "pages/topic-list/topic-list", "pages/video/video-list", "pages/miaosha/miaosha", "pages/shop/shop", "pages/pt/index/index", "pages/book/index/index", "pages/share/index", "pages/quick-purchase/index/index", "mch/m/myshop/myshop", "mch/shop-list/shop-list", "pages/integral-mall/index/index", "pages/integral-mall/register/index", "pages/article-detail/article-detail", "pages/article-list/article-list" ],
    setPageClasses: function() {
        var e = this.currentPage, a = e.data.__device;
        e.data._navbar && e.data._navbar.navs && 0 < e.data._navbar.navs.length && (a += " show_navbar"), 
        a && e.setData({
            __page_classes: a
        });
    },
    setUserInfo: function() {
        var e = this.currentPage, a = wx.getStorageSync("user_info");
        a && e.setData({
            __user_info: a
        });
    },
    showLoading: function(e) {
        this.currentPage.setData({
            _loading: !0
        });
    },
    hideLoading: function(e) {
        this.currentPage.setData({
            _loading: !1
        });
    },
    setWxappImg: function(e) {
        var a = this.currentPage, t = wx.getStorageSync("wxapp_img");
        t && a.setData({
            __wxapp_img: t
        });
    }
};