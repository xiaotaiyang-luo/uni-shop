<template>
  <!-- v-if="goodsDetail.goods_name" 解决最开始加载时因goodsDetail为 {} 而导致的数据加载显示undefined的问题，当只有数据加载完成之后，才会显示内容，否则不进行显示，就不会出现这个闪烁的问题了 -->
  <view class="goods-detail" v-if="goodsDetail.goods_name">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,i) in goodsDetail.pics" :key="i">
        <image :src="item.pics_big" @click="previe(i)"></image>
      </swiper-item>
    </swiper>
    <!-- /轮播图区域 -->
    <!-- 商品描述信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="goods-price">&yen;{{goodsDetail.goods_price}}</view>
      <!--信息主体区域 -->
      <view class="goods-info-body">
        <!-- 商品标题 -->
        <view class="goods-title">
          {{goodsDetail.goods_name}}
        </view>
        <!-- 收藏 -->
        <view class="goods-collect">
          <uni-icons color='#999' type="star" size="20"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <view class="expressage">快递：免运费</view>
      <!-- /商品描述信息 -->
      <!-- /商品说明 -->
      <rich-text :nodes="goodsDetail.goods_introduce"></rich-text>
      <!-- 商品导航组件区域 -->
      <view class="goods-nav">
        <!-- fill 控制右侧按钮样式
         options 左侧按钮的片配置项
         buttonGroup 右侧按钮的配置项
         click 左侧按钮的点击事件处理函数
         buttonClick 右侧按钮的点击事件处理函数
         -->
        <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
      </view>
    </view>
  </view>

</template>

<script>
  import {
    mapState,
    mapMutations,
    mapGetters
  } from 'vuex'
  export default {
    computed: {
      ...mapGetters('m_cart', ['total'])
    },
    watch: {
      total: {
        handler(newVal) {
          const findResult = this.options.find(x => x.text === '购物车')
          if (findResult) {
            findResult.info = newVal
          }
        },
        // immediate 属性用来声明此侦听器，是否在页面初次加载完毕后立即调用
        immediate: true
      }
    },
    data() {
      return {
        // 商品详情数据
        goodsDetail: [],
        options: [{
          icon: 'shop',
          text: '店铺',
          infoBackgroundColor: '#007aff',
          infoColor: "red"
        }, {
          icon: 'cart',
          text: '购物车',
          info: 0
        }],
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ]
      };
    },
    onLoad(options) {
      console.log(options);
      const goodsId = options.goods_id
      this.getGoodsDetail(goodsId)
    },
    methods: {
      ...mapMutations('m_cart', ['addToCart']),
      async getGoodsDetail(goods_id) {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id: goods_id
        })
        if (res.meta.status !== 200) return uni.$showMsg()
        // 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ')
        this.goodsDetail = res.message
        console.log(res);
      },
      // 点击图片进行预览
      previe(index) {
        uni.previewImage({
          current: index,
          urls: this.goodsDetail.pics.map(item => item.pics_big)
        })
      },
      // 点击购物车,跳转到购物车页面
      onClick(e) {
        // 如果点击的按钮的文本为购物车，则进行相对应的操作
        if (e.content.text === '购物车') {
          // 操作tabbar跳转
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
      buttonClick(e) {
        if (e.content.text === '加入购物车') {
          const goods = {
            goods_id: this.goodsDetail.goods_id,
            goods_name: this.goodsDetail.goods_name,
            goods_price: this.goodsDetail.goods_price,
            goods_count: 1,
            goods_small_logo: this.goodsDetail.goods_small_logo,
            goods_state: true
          }
          this.addToCart(goods)
        }
      }
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 750rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .goods-detail {
    padding-bottom: 50px;

    .goods-info-box {
      padding: 10px;
      padding-right: 0;

      .goods-price {

        font-size: 20px;
        color: #C00000;
      }

      .goods-info-body {
        margin: 10px 0;
        display: flex;
        justify-content: space-between;

        .goods-title {
          border-right: 1px solid #eee;
          padding-right: 10px;
          font-size: 13px;
        }

        .goods-collect {
          width: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 12px;
          color: #999;
        }
      }

      .expressage {
        font-size: 12px;
        color: #999;
      }

      .goods-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
      }
    }
  }
</style>
