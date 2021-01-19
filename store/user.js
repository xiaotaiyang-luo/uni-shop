export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 数据存放的地方
  state: () => ({
    // 3. 读取本地的收货地址数据，初始化 address 对象
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
    token:uni.getStorageSync('token') || '',
    userinfo:JSON.parse(uni.getStorageSync('userinfo') || '{}'),
    redirectInfo:null
  }),
  mutations: {
    // 更新收货地址
    updateAddress(state, address) {
      state.address = address

      //  通过 this.commit() 方法，调用 m_user 模块下的 saveAddressToStorage 方法将 address 对象持久化存储到本地
      this.commit('m_user/saveAddressToStorage')
    },
    // 定义将 address 持久化存储到本地 mutations 方法
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    // 更新用户信息
    updateUserInfo(state,userinfo) {
      state.userinfo = userinfo
      this.commit('m_user/saveUserInfo')
    },
    // 持久化保存用户基本信息
    saveUserInfo(state){
     uni.setStorageSync('userinfo',JSON.stringify(state.userinfo))
    },
    upadateToken(state,token) {
      state.token = token
      this.commit('m_user/saveToken')
    },
    // 持久化存储token
    saveToken(state) {
      uni.setStorageSync('token',state.token)
    },
    // 更新结算跳转页面的信息
    updateRedirectInfo(state,info){
      state.redirectInfo = info
    }
  },
  getters: {
    // 收货详细地址的计算属性
    addstr(state) {
      if (!state.address.provinceName) return ''

      // 拼接 省，市，区，详细地址 的字符串并返回给用户
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    },
  },
}
