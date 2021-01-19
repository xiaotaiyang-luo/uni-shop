// 1.导入vue和vuex
import vue from 'vue'
import Vuex from 'vuex'
import moduleCart from './cart.js'
import moduleUser from './user.js'
//2. 将vuex安装为vue的插件
vue.use(Vuex)

// 3.创建store实例对象
const store = new Vuex.Store({
  modules:{
    // 挂载购物车的 vuex 模块，模块内成员的访问路径被调整为 m_cart，例如：
        //    购物车模块中 cart 数组的访问路径是 m_cart/cart
        m_cart: moduleCart,
        m_user:moduleUser,
  }
})
// 4.共享store对象
export default store