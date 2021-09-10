import getData from '../../until/api.js'

// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },


  // 收集号码
  handleInput(event){
    let type = event.target.id
    this.setData({
      [type]:event.detail.value
    })
  },
  // 登录
  async login(){
    let {phone,password} = this.data

    // 前台验证
    if(!phone){
      wx.showToast({
        title: '手机号不能为空',
        icon:'error'
      })
      return
    }

    let isphone = /^1[3456789]\d{9}$/
    if(!isphone.test(phone)){
      wx.showToast({
        title: '手机号格式有误',
        icon:'error'
      })
      return
    }

    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon:'error'
      })
      return
    }

    // 后台验证
    let result =  await getData('/login/cellphone',{phone,password,isLogin:true})
    
    switch(result.code){
      case 200 : wx.showToast({
        title: '登录成功',
        icon:'success'
      })
      // 将用户存储到本地
      wx.setStorageSync('userInfo', JSON.stringify(result))
      // 跳转到个人中心
      wx.switchTab({
        url: '/pages/personal/personal',
      })
      break
      case 400 : wx.showToast({
        title: '手机号错误',
        icon:'error'
      })
      break
      case 502 : wx.showToast({
        title: '密码错误',
        icon:'error'
      })
      break
      default : wx.showToast({
        title: '登录失败',
        icon:'error'
      })
    }

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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