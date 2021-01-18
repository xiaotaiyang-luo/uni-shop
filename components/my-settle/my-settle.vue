<template>
  <view class="settle-container">
    <!-- 全选按钮 -->
    <label class="radio" @click="checkAllState">
      <radio color="#C00000" :checked="isFullCheck">全选</radio>
    </label>
    <!-- 合计 -->
    <view class="settle-total">
      <text>合计:</text>
      <view class="settle-total-num">&yen;{{checkGoodsAmount}}</view>
    </view>
    <!-- 结算按钮 -->
    <view class="settle-account">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  export default {
    data() {
      return {

      };
    },
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total','checkGoodsAmount']),
      // 全选状态
      isFullCheck() {
         // 如果所有商品总数等于结算总数，那么就表示为全选
        return this.total === this.checkedCount
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      // 全选/反选
      checkAllState() {
        // console.log(this.isFullCheck);
        this.updateAllGoodsState(!this.isFullCheck)
      }

    }
  }
</script>

<style lang="scss">
  .settle-container {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 50px;
    line-height: 50px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;
    font-size: 14px;
    box-sizing: border-box;
    background-color: white;

    .settle-total {
      display: flex;
      justify-content: center;
      align-items: center;

      .settle-total-num {
        color: #C00000;
      }
    }

    .settle-account {
      background-color: #C00000;
      padding: 0 10px;
      min-width: 100px;
      text-align: center;
      color: white;
    }
  }
</style>
