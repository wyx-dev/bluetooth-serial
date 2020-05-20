// pages/button/button.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputText_ADD: 'SXMADDQ',
    inputText_SET: 'SXMSETQ',
    inputText_SUB: 'SXMSUBQ',

    alarmTemp:"38.0",
    targetTemp:"28.0",

    setType: 'OFF',

    name: '',
    connectedDeviceId: '',
    services: {},
    characteristics: {},
    connected: true
  },

  bindInput_ADD: function (e) {
    this.setData({
      inputText_ADD: e.detail.value
    })
    console.log(e.detail.value)
  },

  bindInput_SET: function (e) {
    this.setData({
      inputText_SET: e.detail.value
    })
    console.log(e.detail.value)
  },

  bindInput_SUB: function (e) {
    this.setData({
      inputText_SUB: e.detail.value
    })
    console.log(e.detail.value)
  },

 /**
  * 发送数据按钮回调函数
  */

  send: function (e) {
    var that = this
    var argument = "Hi"
    if (that.data.connected) {
      switch(e.currentTarget.id)
      {
        case 1:
          argument = that.data.inputText_ADD
          break
        case 2:
          argument = that.data.inputText_SET
          break
        case 3:
          argument = that.data.inputText_SUB
          break
      }
      var buffer = new ArrayBuffer(e.currentTarget.id.length)
      var dataView = new Uint8Array(buffer)
      console.log(buffer)
      for (var i = 0; i < e.currentTarget.id.length; i++) {
        dataView[i] = e.currentTarget.id.charCodeAt(i)
        console.log(dataView[i],'dataView[i]')
      }
      wx.writeBLECharacteristicValue({
        deviceId: that.data.connectedDeviceId,
        serviceId: that.data.services[2].uuid,//此处用特征值为FFE0开头的UUID才可通信.通过小程序调试可知那个特征值支持notify 或者 indicate
        characteristicId: that.data.characteristics[0].uuid,
        value: buffer,
        success: function (res) {
          console.log('发送成功')
        },
        fail: function (res) {
          console.log('发送失败',res)
        }
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '蓝牙已断开',
        showCancel: false,
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    that.setData({
      name: options.name,
      connectedDeviceId: options.connectedDeviceId
    })
    wx.getBLEDeviceServices({
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        that.setData({
          services: res.services
        })
        wx.getBLEDeviceCharacteristics({
          deviceId: options.connectedDeviceId,
          serviceId: res.services[2].uuid,//此处用特征值为FFE0开头的UUID才可通信.通过小程序调试可知那个特征值支持notify 或者 indicate
          success: function (res) {
            console.log(res.characteristics)
            that.setData({
              characteristics: res.characteristics
            })
            wx.notifyBLECharacteristicValueChange({
              state: true,
              deviceId: options.connectedDeviceId,
              serviceId: that.data.services[2].uuid,
              characteristicId: that.data.characteristics[0].uuid,
              success: function (res) {
                console.log('启用notify成功')
              },
              fail: function (res) {
                console.log('启用notify失败',res)
                console.log(that.data.characteristics[0].uuid)
              }
            })
          },
          fail: function (res) {
            console.log('fail',res)
          }
        })
      },
      fail: function (res) {
        console.log('fail',res)
      }
    })
    wx.onBLEConnectionStateChange(function (res) {
      console.log(res.connected)
      that.setData({
        connected: res.connected
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})