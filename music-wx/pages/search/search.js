// pages/search/search.js
import getData from '../../until/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    placehoderText: '', //基础文本显示
    HotBor: [], //热搜列表
    searchList: [], //搜索列表
    inputText: '', //输入框内容
    searchCont: '', //搜索内容
    historyList: [] //历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotBor()
    this.basicText()
    this.getAgeHistory()
  },
  // 清除文本
  clearText() {
    this.setData({
      inputText: '',
      searchList: []
    })
  },
  //搜索防抖
  searchText(e) {
    if (this.T) {
      clearTimeout(this.T)
    }
    this.T = setTimeout(() => {
      this.getSearch(e.detail.value)
    }, 1000)
  },
  // 搜索
  async getSearch(keywords) {
    this.setData({
      inputText: keywords
    })

    if (!keywords) {
      this.setData({
        searchList: []
      })
      return
    }

    let result = await getData('/search', {
      keywords,
      limit: 10
    })
    if (result.code === 400) return

    // 添加历史记录
    let {
      historyList,
      inputText
    } = this.data
    let ageHistory = wx.getStorageSync('historys')

    if (ageHistory) {
      let ageIndex = ageHistory.findIndex((item) => {
        return item === inputText
      })
      if (ageIndex !== -1) {
        historyList.splice(ageIndex, 1)
      }
    }

    historyList.unshift(inputText)

    wx.setStorageSync('historys', historyList)

    this.setData({
      searchList: result.result.songs,
      searchCont: keywords,
      historyList
    })
  },

  // 异步请求热搜列表
  async getHotBor() {
    let result = await getData('/search/hot/detail')
    this.setData({
      HotBor: result.data
    })
  },

  // 默认搜索关键字
  async basicText() {
    let result = await getData('/search/default')
    this.setData({
      placehoderText: result.data.showKeyword
    })
  },
  // 获取历史记录
  getAgeHistory() {
    let historyList = wx.getStorageSync('historys')
    if (!historyList) return
    this.setData({
      historyList
    })
  },

  // 删去历史记录
  deleteHistorys() {
    wx.showModal({
      content: '您确定要清空历史记录吗？',
      success:() => {
        this.setData({
          historyList: []
        })
        wx.removeStorageSync('historys')
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