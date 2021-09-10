import getData from '../../until/api.js'

let startSlideY = 0 //开始的滑动距离
let SlideY = 0 //滑动中距离
let slide = 0 //距离
// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TransLateY: 'translateY(0rpx)',
    Transition:'',
    userInfo:{},//用户数据
    weekData:[] //最近播放
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 开始点击
  handleTouchStart(event) {
    // 获取第一根手指在屏幕的位置
    startSlideY = event.touches[0].clientY
    this.setData({
      Transition:''
    })
  },
  // 拖动
  handleTouchMove(event) {
    SlideY = event.touches[0].clientY
    slide = SlideY - startSlideY
    if (slide < 0) {
      slide = 0
    } else if (slide > 80) {
      slide = 80
    }
    this.setData({
      TransLateY: `translateY(${slide}rpx)`
    })
  },
  // 放开
  handleTouchEnd() {
    slide = 0
    this.setData({
      TransLateY: `translateY(${slide}rpx)`,
      Transition:'all .5s linear'
    })
  },
  // 到登录
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
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
    // 获取保存的用户信息
    if(!wx.getStorageSync('userInfo')) return
    let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    
    if(userInfo){
      this.getLatelyPlay(userInfo.profile.userId)
      this.getLoginState(userInfo.profile.userId)
      this.setData({
        userInfo
      })
    }
  },
  // 获取最近播放
  async getLatelyPlay(uid){
    let result = await getData('/user/record',{uid,type:0})
    this.setData({
      weekData:result.allData.slice(0,10)
    })
  },
  // 查看登录状态
  async getLoginState(uid){
    let loginState =  await getData('/user/detail',{uid})
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