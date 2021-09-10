
// pages/index/index.js
import getData from '../../until/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    recommendList:[],
    rankList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取轮播图
   let bannerList = await getData('/banner',{type:2})

  //  获取推荐歌单
   let recommendList = await getData('/personalized',{limit:10})

   this.setData({
     bannerList:bannerList.banners,
     recommendList:recommendList.result
   })

  //  获取排行榜
   let index = 0
   let rankList = []
   while(index < 5){
    let ranks = await getData('/top/list',{idx:index++})
    let rank = {rankName:ranks.playlist.name,tracks:ranks.playlist.tracks.slice(0,3)}
    rankList.push(rank)
   }
   this.setData({
     rankList
   })
  },
  // 到每日推荐页面
  toRecommend(){
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
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