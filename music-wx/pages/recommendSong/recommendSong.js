// pages/recommendSong/recommendSong.js
import getData from '../../until/api.js'
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    month:'',
    day:'',
    musicList:[], //每日推荐列表
    index:0,//用于切换歌曲的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(!wx.getStorageSync('userInfo')){
        wx.showToast({
          title:'请先登录',
          icon:'error',
          success(){
            wx.reLaunch('/pages/login/login')
          }
        })
      }


    this.setData({
      day: new Date().getDay(),
      month: new Date().getMonth() + 1
    })

      // 获取每日推荐
      this.getMusicList()

      // 订阅,获取上一首，还是下一首
      PubSub.subscribe('musicType',(msg,type)=>{
        let {index,musicList} = this.data
        let id 
        if('pre' === type){
          index === 0 && (index = musicList.length)
          index -= 1
        }else{
          index === musicList.length - 1 && (index = -1)
          index += 1                
        }    
        this.setData({
          index
        }) 
        id = musicList[index].id 
        PubSub.publish('getId',id)
      })
  },

  // 获取每日推荐
  async getMusicList(){
    let result = await getData('/recommend/songs')
    this.setData({
      musicList:result.data.dailySongs
    })
  },

  // 跳转到songDetail页面
  toSong(event){
    let {id,index} = event.currentTarget.dataset
    this.setData({
      index
    })
    wx.navigateTo({
         //传递的参数有限，对象会自动执行tostring
          url: '/pages/songDetail/songDetail?id=' + id,
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