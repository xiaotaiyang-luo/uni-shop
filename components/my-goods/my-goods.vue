<!-- 商品item项组件 -->
<template>
  <view>
    <!-- 商品item项 -->
    <view class="goods-item">
      <!-- 左边图片区域 -->
      <view class="goods-itme-left">
        <radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="onclick"></radio>
        <image :src="goods.goods_small_logo || defaultImge" class="goods-img"></image>
      </view>
      <!-- 右边内容区域 -->
      <view class="goods-item-right">
        <!-- 商品标题 -->
        <view class="goods-title">{{goods.goods_name}}</view>
        <!-- 商品信息 -->
        <view class="goods-info-box">
          <!-- 商品价格 -->
          <view class="goods-price">&yen;{{goods.goods_price | tofixed}}</view>
          <!-- 商品数量 -->
          <uni-number-box @change="changeGoodsCount" v-if="showNum" :min="1" :value="goods.goods_count"></uni-number-box>
        </view>
      </view>
    </view>
    <!-- /商品item项 -->
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 默认图片
        defaultImge: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },
    filters: {
      // 在过滤器节点中 把数字处理为带两位小数点的数字
      tofixed(num) {
        return Number(num).toFixed(2) // 先转换为数组类型的数据，然后再处理为带两位小数点的数字
      }
    },
    props: {
      goods: {
        type: Object,
        default: {}
      },
      showRadio: {
        type: Boolean,
        default: false
      },
      showNum:{
        type: Boolean,
        default:false
      }
    },
    methods: {
      // 单击单选,触发事件传递数据给父组件，方便父组件调用store的方法修改数据
      onclick(e) {
        const goodsRadio = {
          goods_id: this.goods.goods_id,
          goods_state: !this.goods.goods_state
        }
        console.log(goodsRadio);
        this.$emit('radio-change', goodsRadio)
      },
      changeGoodsCount(e){
        console.log(e);
        const goodsCount = {
          goods_id:this.goods.goods_id,
          goods_count: +e
        }
         this.$emit('num-change',goodsCount)
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    display: flex;
    width: 750rpx;
    box-sizing: border-box;
    padding: 10px 5px;
    border-bottom: 1px solid #eee;

    .goods-itme-left {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-left: 5px;

      .goods-img {
        width: 100px;
        height: 100px;
        display: block;
      }
    }

    .goods-item-right {
      margin-left: 10px;
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;

      .goods-title {
        font-size: 12px;
      }

      .goods-info-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .goods-price {
          color: #C00000;
          font-size: 16px;
        }
      }
    }

  }
</style>
