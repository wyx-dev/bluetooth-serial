// pages/check/check.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    alarmFlag: false,
    targetFlag: false,
    stop: false,


    name: '',
    connectedDeviceId: '',
    services: {},
    characteristics: {},
    connected: true
  },

  /**
   * 停止报警按键函数
   */
  stop: function () {
    this.setData({
      stop : !this.data.stop
    })
  },

  /**
   * 查看设置温度回调函数 
   */
  seeTemp: function (e) {
    var that = this
    var argument = "Hi"
    if (that.data.connected) {
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
    
    // var tempFilePath = '../../sound/10686.mp3'
    console.log(options)
    that.setData({
      name: options.name,
      connectedDeviceId: options.connectedDeviceId
    })
    // wx.playVoice({
    //   filePath: tempFilePath,
    //   complete () {
    //     console.log('lalalaa')
    //   }
    // })
    /**
     * 初始化音频播放实例
    */    
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.loop = false
    innerAudioContext.src = 'http://downsc.chinaz.net/Files/DownLoad/sound1/201810/10686.mp3'
    // innerAudioContext.src = '../../sound/10686.mp3'
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

    /**
     * 获取蓝牙设备所有服务(service)。
    */
    wx.getBLEDeviceServices({
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        that.setData({
          services: res.services
        })

        /**
         * 获取蓝牙设备某个服务中所有特征值(characteristic)。
        */
        wx.getBLEDeviceCharacteristics({
          deviceId: options.connectedDeviceId,
          serviceId: res.services[2].uuid,//此处用特征值为FFE0开头的UUID才可通信.通过小程序调试可知那个特征值支持notify 或者 indicate
          success: function (res) {
            console.log(res.characteristics)
            that.setData({
              characteristics: res.characteristics
            })

            /**
             * 启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。注意：必须设备的特征值支持 notify 或者 indicate 才可以成功调用。

另外，必须先启用 notifyBLECharacteristicValueChange 才能监听到设备 characteristicValueChange 事件
            */
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
 
    /**
     * 监听低功耗蓝牙连接状态的改变事件。包括开发者主动连接或断开连接，设备丢失，连接异常断开等等
    */
    wx.onBLEConnectionStateChange(function (res) {
      console.log(res.connected)
      
      that.setData({
        connected: res.connected
      })
      
      if(!res.connected)
      {
        wx.navigateTo({
          url: '../search/search'
        })
      }
    })
    /**
     * 蓝牙接收回调函数
    */
    wx.onBLECharacteristicValueChange(function (res) {
    var receiveText = app.buf2string(res.value)
    console.log(receiveText)
    if(that.data.stop)
      innerAudioContext.stop()
    switch(receiveText.charAt(0))
    {
      case '1':
        console.log('报警~~~~')
        if(!that.data.stop)
          innerAudioContext.play()
        that.setData({
          alarmFlag : true
        })
        break
      case '0':
        innerAudioContext.stop()
        console.log('正常~~~')
        that.setData({
          alarmFlag : false
        })
        break
      case '2':
        that.setData({
          targetFlag : true
        })
        break
      case '3':
        that.setData({
          targetFlag : false
        })
        break
      case 'A':
        var arr = receiveText.substr(1, (receiveText.length-1)).split(";")
        console.log(arr)
        that.setData({
          targetTemp : arr[0],
          alarmTemp : arr[1]
        })
        break
      case 'C':
        var str = receiveText.substr(1, 4)
        that.setData({
          currentTmp : str
        })
        break
    }
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