// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'
import getData from '../../until/api.js'
const App = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,//是否播放
    songInfo:{},//歌曲信息
    musicTime:0,//歌曲时间进度条
    musicTotal:0,//音乐总长格式
    musicTotalSec:0,//音乐总长秒数
    musicActualTiem:"00:00",//音乐实时时间
  },

  // 控制播放
  swichPlay(){
    let isPlay = !this.data.isPlay
    this.setData({
      isPlay
    })
    // 播放或暂停
    this.playMusic(isPlay,this.data.songInfo.id)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取音乐信息
    this.getSongInfo(options.id)

    // 监听全局与局部的音乐
    this.musicPlayer = wx.getBackgroundAudioManager()

    if(App.globalData.isMusicPlay && App.globalData.mId === options.id){
      this.setIsPlay(true)
    }

    // 音频播放
    this.musicPlayer.onPlay(()=>{
      this.setIsPlay(true)
      this.setGlobalData(true)
      App.globalData.mId = options.id
    })
    // 音频暂停
    this.musicPlayer.onPause(()=>{
      this.setIsPlay(false)
      this.setGlobalData(false)
    })
     // 音频停止
    this.musicPlayer.onStop(()=>{
      this.setIsPlay(false)
      this.setGlobalData(false)
    })
    //音乐的播放状态
    this.musicPlayer.onTimeUpdate(()=>{
      let date = new Date
      date.setTime(this.musicPlayer.currentTime * 1000)
      let time = this.getMusicMS(date.getMinutes(),date.getSeconds())

      this.setData({
        musicActualTiem: time,
        musicTime: this.musicPlayer.currentTime / this.data.musicTotalSec * 100
      })
    })
    //音乐播完自动切换下一首
    this.musicPlayer.onEnded(()=>{
      console.log('xx')
      PubSub.publish('musicType','next')
      this.setData({
        usicTime:0
      })
    })
  },

  // 设置是否播放
  setIsPlay(isPlay){
    this.setData({
      isPlay
    })
  },

  // 设置全局播放设置
  setGlobalData(isPlay){
    App.globalData.isMusicPlay = isPlay
  },

  // 获取歌曲详细信息
  async getSongInfo(ids){
    let result = await getData('/song/detail',{ids})

    // 获取歌曲的时间
    let date = new Date
    date.setTime(result.songs[0].dt)
    let time = this.getMusicMS(date.getMinutes(),date.getSeconds())

    this.setData({
      songInfo:result.songs[0],
      musicTotal:time,
      musicTotalSec:(date.getMinutes() * 60) + (date.getSeconds() * 1)
    })
    wx.setNavigationBarTitle({
      title:this.data.songInfo.ar[0].name
    })
  },

  // 播放音乐
  async playMusic(isPlay,id){
    if(isPlay){
      let song = await getData('/song/url',{id})
      if(!song.data[0].url){
        wx.showToast({
          title: '暂无歌曲列表',
        })
        this.musicPlayer.stop()
        return
      }
      this.musicPlayer.src = song.data[0].url
      this.musicPlayer.title = this.data.songInfo.name
    }else{
      this.musicPlayer.pause()
    }
  },
  // 点击切换上一首或下一首
  swichMusic(event){
    this.musicPlayer.stop()
    PubSub.subscribe('getId',(msg,id)=>{
      this.getSongInfo(id)
      this.playMusic(true,id)
     PubSub.unsubscribe('getId')
    })

    // 发布是上一首还是下一首、、event.currentTarget.id 值为pre或next，表示上一首，下一首
    PubSub.publish('musicType', event.currentTarget.id)
  },

  // 包装时间
  getMusicMS(m,s){
    let min = m < 10 ? ("0" + m) : m 
    let sec = s < 10 ? ("0" + s) : s
    return min + ":" + sec
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