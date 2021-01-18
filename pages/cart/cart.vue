<template>
  
  
  <!-- 有商品时显示的区域 -->
  <view class="cart-container" v-if="cart.length !== 0">
    <!-- 地址 -->
    <my-address></my-address>
    <!-- /地址 -->
    
    <!-- 购物车列表 -->
    <view class="cart-list">
      <!-- 标题 -->
      <view class="cart-title">
        <!-- 左侧图标 -->
        <uni-icons type="shop" size="18"></uni-icons>
        <!-- 右侧标题 -->
        <view class="title">购物车</view> 
      </view>
      <!-- 商品列表 -->
      <view class="goods-list">
        <!-- @click="gotogoodsDetail(goods)" -->

        <uni-swipe-action>
          <block v-for="(goods,i) in cart" :key='i'>
            <uni-swipe-action-item :options="options" @click="removeGoodsItem(goods)">
              <my-goods :goods='goods' :show-radio='true' :show-num='true' @radio-change='changeRadio' @num-change='numberChangeHandler'></my-goods>
            </uni-swipe-action-item>
          </block>
        </uni-swipe-action>
      </view>
    </view>
    <!-- /购物车列表 -->
    <my-settle></my-settle>
  </view>
  <!-- 没有商品时显示的区域 -->
  <view class="cart-none" v-else>
    <image class="empty-img" src="../../static/cart_empty@2x.png" mode="widthFix" ></image>
    <text>购物车空空如也</text>
  </view>
  <!-- /没有商品时显示的区域 -->
</template>

<script>
  // 导入自己封装的 mixin 模块
  import badgeMix from '@/mixins/tabbar-badge.js'
  import {
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins: [badgeMix],
    computed: {
      ...mapState('m_cart', ['cart'])
    },
    data() {
      return {
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#c00000'
          }
        }]
      };
    },
    methods: {
      ...mapMutations('m_cart', ['updateChecked', 'updateGoodsCount','removeGoodsItemData']),
      changeRadio(e) {
        // console.log(e);
        // 调用store的方法,传递需要修改的数据的值
        this.updateChecked(e)
      },

      gotogoodsDetail(goods) {
        // console.log(1,goods);
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
        })
      },
      // 修改购物每个商品数量
      numberChangeHandler(goods) {
        this.updateGoodsCount(goods)
      },
      // 删除商品
      removeGoodsItem(goods) {
        this.removeGoodsItemData(goods)
      }
    }

  }
</script>

<style lang="scss">
  .cart-container {
    padding-bottom: 50px;
    .cart-list {
      .cart-title {
        display: flex;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #eee;

        .title {
          margin-left: 10px;
          font-size: 14px;
        }
      }
    }
  }
  .cart-none{
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    color: #999999;
    padding-top: 150px;
    .empty-img{
      width: 90px;
      // height: 90px;
      margin-bottom: 10px;
    }
  }
</style>
