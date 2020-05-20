// pages/function.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    connectedDeviceId: ''
  },


  /** 
   * 聊天函数
   */
  talk :function(){
    console.log(this.data.connectedDeviceId,this.data.name)
    wx.navigateTo({
      url: '../device/device?connectedDeviceId=' + this.data.connectedDeviceId + '&name=' + this.data.name
    })
  },

   /** 
   * 按键函数
   */
  button :function(){
    console.log(this.data.connectedDeviceId,this.data.name)
    wx.navigateTo({
      url: '../button/button?connectedDeviceId=' + this.data.connectedDeviceId + '&name=' + this.data.name
    })
  },

   /** 
   * 报警函数
   */
  alarm :function(){
    
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