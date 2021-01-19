<template>
 <view class="my-contanier">
   <my-userinfo v-if='token'></my-userinfo>
   <my-login v-else></my-login>
 </view>
</template>

<script>
  // 导入自己封装的 mixin 模块
 import badgeMix from '@/mixins/tabbar-badge.js'
 
 import {mapState, mapMutations} from 'vuex'
  export default {
      // 将 badgeMix 混入到当前的页面中进行使用
      mixins: [badgeMix],
    data() {
      return {

      };
    },
    computed:{
      ...mapState('m_user',['token'])
    },
    methods:{
      ...mapMutations('m_user', ['updateRedirectInfo']),
    },
    // 当离开我的页面时,清空从结算页面获取的数据
    // 解决从结算页面跳到登录页面,如果没有立即登录,而是点击到其他tabbar页面。但由于本身是需要从结算到登录,登录成功后回到结算的。因为此时我们并没有立即登录,而是离开了我的页面,但是当回到我的页面时依旧会跳转到结算的页面的bug。按道理来说，没有立即登录，离开了我的，到了其他的tabbar如，首页，回到我的页面时，登录应该还是在我的页面
    onHide() {
      this.updateRedirectInfo(null)
    }
  }
</script>

<style lang="scss">
page,.my-contanier{
  height: 100%;
  background-color: white;
}
</style>
