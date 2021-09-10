export default (url,data={},method="GET") =>  {
  return new Promise((resolve,reject)=>{
    wx.request({
        url: 'http://localhost:3000' + url,
        data,
        header:{
          cookie:wx.getStorageSync('cookie')
        },
        method,
        success:(res)=>{
          if(data.isLogin){
            wx.setStorageSync('cookie', res.cookies.find((value)=>{
              return value.indexOf('MUSIC_U') !== -1
            }))
          }
          resolve(res.data)
        },
        fail:(err)=>{
          reject(err)
        }
      })
  })
}