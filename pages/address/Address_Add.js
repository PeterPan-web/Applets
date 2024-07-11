var app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    shengArr: [],//省级数组
    shengId: [],//省级id数组
    shiArr: [],//城市数组
    shiId: [],//城市id数组
    quArr: [],//区数组
    shengIndex: 0,
    shiIndex: 0,
    quIndex: 0,
    mid: 0,
    sheng:0,
    city:0,
    area:0,
    code:0,
    cartId:{},
    from1: {},
    from2: {},
    orderNo:{}
  },
  formSubmit: function (e) {
    var that = this;
    var adds = e.detail.value;
    //var cartId = that.data.cartId;
    console.log('1:' + wx.getStorageSync('userKeyID'));
    console.log('2:' + adds.name);
    console.log('3:' + adds.phone);
    console.log('4:' + this.data.sheng);
    console.log('5:' + this.data.city);
    console.log('6:' + this.data.area);
    console.log('7:' + adds.address);
 
    if (adds.name.length<2){
      wx.showModal({
        title: "提示",
        content: "请正确添加姓名!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };

    if (adds.phone.length!=11){
      wx.showModal({
        title: "提示",
        content: "请正确添加手机!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };

    if (this.data.sheng==0){
      wx.showModal({
        title: "提示",
        content: "请选择省份或市!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };

    if (this.data.city==0){
      wx.showModal({
        title: "提示",
        content: "请选择市或区!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };

    if (this.data.area==0){
      wx.showModal({
        title: "提示",
        content: "请选择区或县!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };


    if (adds.address.length<5){
      wx.showModal({
        title: "提示",
        content: "请填写详细地址!",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
           return;
          } 
        }
      })
      return;
    };


    wx.request({
      url: app.d.hostUrl + '/Address_add.aspx',
      data: {
        user_id:wx.getStorageSync('userKeyID'),
        receiver: adds.name,
        tel: adds.phone,
        sheng: this.data.sheng,
        city: this.data.city,
        quyu: this.data.area,
        adds: adds.address,
        //code: this.data.code,
      },
      method: 'POST', 
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        console.log('sql:'+res.data.sql);
        if(status==1){
          wx.showToast({
            title: '保存成功！',
            duration: 2000
          });
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
        wx.redirectTo({
          url: '../' + that.data.from1 + '/' + that.data.from2 +'?orderNo='+that.data.orderNo,
        });
        //wx.redirectTo({
        //  url: '../order/ShopPay?cartId=' + cartId
        //});
      },
      fail: function () {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this;
     that.setData ({
       from1 : options.from1,
       from2 : options.from2,
       cartId : options.cartId,
       orderNo : options.orderNo,
     })
    
    
    console.log('cartId:' + that.cartId);
    console.log('from1:' + that.data.from1);
    console.log('from2:' + that.data.from2);
    console.log('orderNo:' + that.data.orderNo);

    //获取省级城市
    wx.request({
      url: app.d.hostUrl + '/AddGet_Province.aspx',
      data: {},
      method: 'POST',
      success: function (res) {
        var status = res.data.status;
        var province = res.data.list;
        var sArr = [];
        var sId = [];
        sArr.push('请选择');
        sId.push('0');
        for (var i = 0; i < province.length; i++) {
          sArr.push(province[i].name);
          sId.push(province[i].id);
        }
        that.setData({
          shengArr: sArr,
          shengId: sId
        })
      },
      fail: function () {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

  },

  bindPickerChangeshengArr: function (e) {
    this.setData({
      shengIndex: e.detail.value,
      shiArr: [],
      shiId: [],
      quArr:[],
      quiId: []
    });
    var that = this;
    console.log('省：' + that.data.shengId[e.detail.value]);
    wx.request({
      url: app.d.hostUrl + '/AddGet_City.aspx',
      data: { sheng: that.data.shengId[e.detail.value]},
      method: 'POST',
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        var city = res.data.city_list;

        var hArr = [];
        var hId = [];
        hArr.push('请选择');
        hId.push('0');
        for (var i = 0; i < city.length; i++) {
          hArr.push(city[i].name);
          hId.push(city[i].id);
        }
        that.setData({
          sheng: that.data.shengArr[e.detail.value],
          shiArr: hArr,
          shiId: hId
        })
      },
      fail: function () {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },

    })
  },

  bindPickerChangeshiArr: function (e) {
    this.setData({
      shiIndex: e.detail.value,
      quArr:[],
      quiId: []
    })
    var that = this;
    console.log('市：' + that.data.shiId[e.detail.value]);
    wx.request({
      url: app.d.hostUrl + '/AddGet_Area.aspx',
      data: {
        city: that.data.shiId[e.detail.value],
        sheng:this.data.sheng
      },
      method: 'POST',
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        var area = res.data.area_list;

        var qArr = [];
        var qId = [];
        qArr.push('请选择');
        qId.push('0');
        for (var i = 0; i < area.length; i++) {
          qArr.push(area[i].name)
          qId.push(area[i].id)
        }
        that.setData({
          city: that.data.shiArr[e.detail.value],
          quArr: qArr,
          quiId: qId
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  bindPickerChangequArr: function (e) {
    console.log(this.data.city)
    this.setData({
      quIndex: e.detail.value
    });
    var that = this;

    that.setData({
      area: that.data.quArr[e.detail.value],
    })
  },


  getLocation: function () {
    var that2 = this;

    wx.showModal({
      title: "提示",
      content: "你确认要通过定位获取当前地址？",
      success: function (res) {
        if (res.cancel) {
          return;
        }
        else{

          // 实例化腾讯地图API核心类
          qqmapsdk = new QQMapWX({
            key: 'ZVQBZ-DFDCV-QNOPG-USV5M-GRWUJ-2NF4U' // 必填
          });
          //qqmapsdk.search({
          //  keyword: '宾馆',
          //  success: function (res) {
          //    console.log(res);
          //  },
          //  fail: function (res) {
          //    console.log(res);
          //  },
          //  complete: function (res) {
          //    console.log(res);
          //  }
          //});
          //1、获取当前位置坐标
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
              console.log('经度：' + res.latitude, '纬度：' + res.longitude),
                //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
                qqmapsdk.reverseGeocoder({
                  location: {
                    latitude: res.latitude,
                    longitude: res.longitude
                  },
                  success: function (addressRes) {
                    var address2 = addressRes.result.formatted_addresses.recommend;
                    console.log(addressRes.result.address_component);
                    console.log(addressRes.result.address_component.province);
                    console.log(addressRes.result.address_component.city);
                    console.log(addressRes.result.address_component.district);
                    console.log(addressRes.result.address_component.street);

                    that2.setData({
                      localSite: address2,
                    });
                    that2.setArea(addressRes.result.address_component.province, addressRes.result.address_component.city, addressRes.result.address_component.district);
                  }
                })
            },
          })

        }
      }
    })


    
  },

  setArea: function (strProvince,strCity,strArea) {
    var that5=this;
    wx.request({
      url: app.d.hostUrl + '/Add_Set.aspx',
      data: {
        province: strProvince,
        city: strCity,
        area: strArea,
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that5.setData({
          sheng: strProvince,
          shengIndex: res.data.provinceIndex,
        });

        var city = res.data.city;
        //console.log('city:'+city);
        var hArr = [];
        var hId = [];
        hArr.push('请选择');
        hId.push('0');
        for (var i = 0; i < city.length; i++) {
          hArr.push(city[i].name);
          hId.push(city[i].id);
        }

        that5.setData({
          shiArr: hArr,//城市数组
          shiId: hId,//城市id数组
          city:strCity,
          shiIndex: res.data.cityIndex,
        });

        var area = res.data.area;
        var qArr = [];
        var qId = [];
        qArr.push('请选择');
        qId.push('0');
        for (var i = 0; i < area.length; i++) {
          qArr.push(area[i].name)
          qId.push(area[i].id)
        }
        that5.setData({
          quArr: qArr,
          quiId: qId,
          quIndex:res.data.areaIndex,
          area: strArea,
        })

      },
      fail: function () {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

})