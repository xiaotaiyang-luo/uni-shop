import { mapGetters } from 'vuex'

// 导出一个 mixin 对象
export default {
  computed: {
    ...mapGetters('m_cart', ['total']),
    
  },
  watch:{
    // 利用侦听器实时检测总数的变化,让tabbar的购物车的小标中的商品数量动态变化
    total() {
      this.setBadge()
    }
  } ,
  // onShow在加载当前页面时调用一次,所以tabbar的购物车的小标中的商品数量不会动态变化
  onShow() {
    // 在页面刚展示的时候，设置数字徽标
    this.setBadge()
  },
  methods: {
    setBadge() {
      // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
      uni.setTabBarBadge({
        index: 2,
        text: this.total + '', // 注意：text 的值必须是字符串，不能是数字
      })
    },
  },
}