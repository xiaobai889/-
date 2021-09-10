import getData from '../../until/api.js'

// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    NavList:[],
    navId:'',//nav列表的id用于切换标识
    videoList:[],
    vId:0, //视频的id
    playAges:[],
    isRefresher:false,//是否正在下拉刷新
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoNavList()
  },

  // 点击变换active,导航回调
  setActivity(event){
    this.setData({
      navId:event.target.dataset.id,
      videoList:[]
    })

    // 加载
    wx.showLoading({
      title: '正在加载',
    })
    // 动态显示导航视频
    this.getVideoList(this.data.navId)
  },

 // 获取视频nav列表,初始化
  async getVideoNavList(){
    let result = await getData('/video/group/list')
    this.setData({
      NavList:result.data.slice(0,14),
      navId:result.data[0].id
    })

    // 等nav加载完拿id
    this.getVideoList(this.data.navId)
  },

  // 获取视频/需登录，需cookie
  async getVideoList(navId){
    let result = await getData('/video/group',{id:navId})
    wx.hideLoading()
    this.setData({
      videoList:result.datas,
      // 加载完成取消加载效果
      isRefresher:false
    })
  },

  // 点击开始播放当前，暂停上一次
  isPlay(event){
    let vid = event.currentTarget.id
    // this.vid !== vid && this.videoCont && this.videoCont.stop()
    this.videoCont = wx.createVideoContext(vid)
    let videoItem = this.data.playAges.find(item => {
      return item.vid === vid
    })
    
    if(videoItem) {
      this.videoCont.seek(videoItem.vTime)
    }
    // this.vid = vid
    this.setData({
      vId:vid
    })
    
  },

  // 再次播放时，进度在上一次
  videoAge(event){
    let {playAges} = this.data //播放历史列表
    let videoAge = {vid:event.currentTarget.id,vTime:event.detail.currentTime}
    let isHave = playAges.find(item => item.vid === event.currentTarget.id)
    if(isHave){
      isHave.vTime = event.detail.currentTime
    }else{
      playAges.push(videoAge)
    }

    this.setData({
        playAges
      })
  },

  // 视频结束删除播放记录
  vEnd(event){
    let newArr = this.data.playAges.filter(item => item.vid !== event.currentTarget.id)
    this.setData({
      playAges:newArr
    })
  },

  // 下拉刷新
  handleRefresh(){
    this.setData({
      isRefresher:true
    })
    this.getVideoList(this.data.navId)
  },

  // 上拉加载
  handleOnLode(){
    // 虚假数据，目前无后端数据,(后端分页，发送需要的数量，后台返回)(前端分页，后端数据全返回，前端分)
    let newVideoList = this.data.videoList
    let list = this.data.videoList
    newVideoList.push(...list)
    this.setData({
      videoList:newVideoList
    })
  },

  // 去到搜索列表
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
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