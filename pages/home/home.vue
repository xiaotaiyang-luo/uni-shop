<template>
  <view>
    <view class="search-box">
      <my-search :radius="18" @click="gotoSearch"></my-search>
    </view>
    <!-- 轮播图区域 -->
    <!-- indicator-dots 表示是否开启小圆点
     autoplay 表示是否开启自动轮播
     interval 表示轮播时长
     duration 表示每张图轮播所需的时长
     circular 表示是否进行衔接轮播
     -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <!-- 循环渲染轮播图 item 项 -->
      <swiper-item v-for="(item,index) in swiperList" :key="index">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?godds_id='+ item.goods_id">
          <!-- 动态绑定图片的 src 属性 -->
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- /轮播图区域 -->
    <!-- 分类导航 -->

    <view class="nav">
      <view class="nav-item" v-for="(item,i) in navList" :key="i" @click="onCatePage(item)">
        <image :src="item.image_src" class="nav-img"></image>
      </view>
    </view>
    <!-- /分类导航 -->
    <!-- 楼层数据 -->
    <view class="floor-list">
      <!-- 楼层的每一项 -->
      <view class="floor-item" v-for="(item,index) in floorList" :key="index">
        <!-- 楼层标题 -->
        <image class="floor-title" :src="item.floor_title.image_src"></image>
        <!-- 楼层图片区域 -->
        <view class="floor-img-box">
          <!-- 左边的图片 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width:item.product_list[0].image_width +'rpx'}" mode="widthFix"></image>
          </navigator>
          <!-- 右边的图片 -->
          <view class="right-img-box">
            <navigator :url="item2.url" class="right-img-item" v-for="(item2,i) in item.product_list" :key="i" v-if="i !== 0">
              <image :src="item2.image_src" :style="{width:item2.image_width +'rpx'}" mode="widthFix"></image>
            </navigator>
          </view>

        </view>
      </view>
    </view>
    <!-- /楼层数据 -->
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 轮播图的数据列表
        swiperList: [],
        // 分类的数据
        navList: [],
        // 楼层数据展示的数据
        floorList: []

      };
    },
    onLoad() {
      this.getSwiperList()
      this.getnavList()
      this.getFoolrList()
    },
    methods: {
      // 获取轮播图数据
      async getSwiperList() {
        // 发起请求,获取数据
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata')
        if (res.meta.status !== 200) return uni.$showMsg()
        this.swiperList = res.message
        // console.log(this.swiperList);
      },

      // 获取分类导航数据
      async getnavList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems')
        // console.log(res);
        if (res.meta.status !== 200) return uni.$showMsg()
        this.navList = res.message
      },
      // 点击分类导航的分类项,进行页面跳转
      onCatePage(item) {
        if (item.name === '分类') {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      },
      // 获取楼层数据
      async getFoolrList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/floordata')
        if (res.meta.status !== 200) return uni.$showMsg()
        console.log(res)
        const data = res.message
        data.forEach(floor => {
          floor.product_list.forEach(item => {
            item.url = '/subpkg/goods-list/goods-list?' + item.navigator_url.split('?')[1]
          })
        })
        this.floorList = res.message
      },
      // 点击搜索组件,跳转到搜索页面
      gotoSearch() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    }
  }
</script>

<style lang="scss">
  .search-box{
    position: sticky;
    top: 0;
    z-index: 999;
  }
  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  .nav {
    display: flex;
    justify-content: space-around;
    margin: 15rpx 0;

    .nav-img {
      width: 128rpx;
      height: 124rpx;
    }
  }

  .floor-list {
    .floor-title {
      height: 60rpx;
      width: 100%;
      display: flex;
    }

    .floor-img-box {
      display: flex;
      padding-left: 10rpx;

      .right-img-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
      }
    }
  }
</style>
