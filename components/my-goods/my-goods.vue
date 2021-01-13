<!-- 商品item项组件 -->
<template>
	<view>
		<!-- 商品item项 -->
		<view class="goods-item"  >
		  <!-- 左边图片区域 -->
		 <view class="goods-itme-left">
		   <image :src="goods.goods_small_logo || defaultImge"  class="goods-img"></image>
		 </view>
		 <!-- 右边内容区域 -->
		  <view class="goods-item-right">
		    <!-- 商品标题 -->
		    <view class="goods-title">{{goods.goods_name}}</view>
		    <!-- 商品信息 -->
		    <view class="goods-info-box">
		      <!-- 商品价格 -->
		      <view class="goods-price">&yen;{{goods.goods_price | tofixed}}</view>
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
				defaultImge:'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
    filters:{
     // 在过滤器节点中 把数字处理为带两位小数点的数字
      tofixed(num) {
      return  Number(num).toFixed(2) // 先转换为数组类型的数据，然后再处理为带两位小数点的数字
      }
    },
    props:{
      goods:{
        type:Object,
        default:{}
      }
    },
    methods:{
      
    }
	}
</script>

<style lang="scss">
.goods-item{
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #eee;
    .goods-itme-left{
      .goods-img{
        width: 100px;
        height: 100px;
        display: block;
      }
    }
    .goods-item-right{
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .goods-title{
        font-size: 12px;
      }
      .goods-info-box{
        .goods-price{
          color:#C00000;
          font-size: 16px;
        }
      }
    }
    
  }
</style>
