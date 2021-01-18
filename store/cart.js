// 初始化vuex的数据
export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的state数据
  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),
  // 模块的 mutations 方法
  mutations: {
    // 添加商品
    addToCart(state, goods) {
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      console.log(findResult);
      if (!findResult) {
        state.cart.push(goods)
      } else {
        findResult.goods_count += goods.goods_count
      }
      this.commit('m_cart/saveToStorage')
    },
    // 持久化商品数据
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 修改数据的勾选状态
    updateChecked(state, goods) {
      // 查找state中的数据中是否有传递过来的数据，有则返回这个数据，并将相关数据修改为接收过来的数据
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_state = goods.goods_state
        this.commit('m_cart/saveToStorage')
      }
    },
    // 更新商品数量
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_count = goods.goods_count
        this.commit('m_cart/saveToStorage')
      }
    },
    // 删除操作商品
    removeGoodsItemData(state, goods) {
      state.cart = state.cart.filter(item => item.goods_id !== goods.goods_id)
      this.commit('m_cart/saveToStorage')
    },
    // 更新商品的选中状态，实现全选反选
    updateAllGoodsState(state, newState) {
      state.cart.forEach(x => x.goods_state = newState)
      this.commit('m_cart/saveToStorage')
    }
  },

  // 模块的 getters 属性
  getters: {
    // 统计购物车中商品的总数量
    total(state) {
      // let c = 0
      // state.cart.forEach(goods => c += goods.goods_count)
      // return c
    return  state.cart.reduce((total,item) => total += item.goods_count,0)
    },
    // 选择商品的数量
    checkedCount(state) {
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)

    },
    // 计算选中商品价格
    checkGoodsAmount(state) {
    return  state.cart.filter(x => x.goods_state).reduce((total,item) => total += item.goods_count * item.goods_price,0)
    }
  },
}
