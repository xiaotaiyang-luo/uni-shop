<template>
  <view>
    <my-search @click="gotoSearch" :radius="18"></my-search>
    <!-- 分类内容区域 -->
    <view class="scroll-view-container">
      <!-- 左边一级分类滚动视图区域 -->
      <scroll-view scroll-y class="cate-left" :style="{height:wh+'px'}">
        <block v-for="(item,i) in cateList" :key="i">
          <view :class="['cate-item',active === i ? 'active':'']" @click="activeChange(i)">
            {{item.cat_name}}
          </view>
        </block>
      </scroll-view>
      <!-- /左边一级分类滚动视图区域 -->
      <!-- 右边二三级分类滚动视图区域 -->
      <!-- scroll-top表示滚动区域距离顶部的距离，将其进行动态绑定，让每次切换一级分类时，当前的二三级滚动区域能够回到顶部
       
       -->
      <scroll-view scroll-y class="cate-right" :style="{height:wh+'px'}" :scroll-top="scrollTop">
      
        <view class="cate-item-right" v-for="(item2,index) in cateLevel2" :key="index">
          <!-- 二级分类标题 -->
         <view class="cate-right-title">/ {{item2.cat_name}} /</view>
         <!-- 三级分类区域 -->
        <view class="cate-item3">
          <view class="cate-right-img" v-for="(item3,ii) in item2.children" :key="ii" @click="getGoodsList(item3)">
            <!-- 三级分类图片 -->
            <image :src="item3.cat_icon" ></image>
            <!-- 三级分类标题 -->
            <text>{{item3.cat_name}}</text>
          </view>
        </view>
        </view>
      </scroll-view>
      <!-- /右边二三级分类滚动视图区域 -->
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 所有分类的数据  
        cateList: [],
        // 当前选中的一级分类的项
        active: 0,
        // 当前页面可操作的区域高度
        wh: 0,
        // 二级分类和三级分类的数据
        cateLevel2:[],
        // 二三级分类滚动区域距离顶部的距离
          scrollTop:0
      };
    },
    onLoad() {
      // 获取当前页面的信息
      const sysInfo = uni.getSystemInfoSync()
      // 根据当前页面的信息获取当前页面可操作区域的高度，这样获取的好处是可以动态的得到当前页面的可操作区域的高度
      //当前页面的可操作区域就是减去顶部区域，底部tabbar区域的高度所剩区域的高度
      this.wh = sysInfo.windowHeight - 50
      // 调用请求,获取数据
      this.getCateList()
    },
    methods: {
      // 发起网络请求,获取分类数据
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        console.log(res);
        // 请求失败,弹出信息
        if(res.meta.status !== 200) return uni.$showMsg()
        // 将分类数据转存给到data中的数据
        this.cateList = res.message
        // 将二三及分类的数据转存到data数据中
        this.cateLevel2=this.cateList[0].children
      },
      // 点击一级分类,切换索对应的项
      activeChange(i) {
        this.active = i
        // 根据切换的索引切换对应的二三级分类数据
        this.cateLevel2=this.cateList[i].children
        // 之所以要让这个滚动条距离顶部距离动态绑定的值在1 和0 之间切换,是因为如果这个值不发生变化,这个滚动区域不会被重新进行渲染。
        this.scrollTop = this.scrollTop === 0 ? 1:0
      },
    // 点击三级分类项,跳转到对应的商品列表页面
    getGoodsList(item) {
      uni.navigateTo({
        url:'/subpkg/goods-list/goods-list?cid=' + item.cat_id
      })
    },
    // 点击搜索组件,跳转到搜索页面
    gotoSearch() {
      uni.navigateTo({
        url:'/subpkg/search/search'
      })
    }
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;
    // 一级分类样式
    .cate-left {
      width: 120px;

      .cate-item {
        line-height: 60px;
        background-color: #f7f7f7;
        text-align: center;
        font-size: 12px;

        &.active {
          position: relative;
          background-color: #FFFFFF;

          &::before {
            content: ' ';
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            display: block;
            width: 2px;
            height: 30px;
            background-color: #D11200;
          }
        }
      }
    }
    // 二三级分类样式
    .cate-right{
      font-size: 12px;
      
      .cate-right-title {
        font-weight: bold;
        text-align: center;
        padding: 15px 0;
      }
      .cate-item3{
        display: flex;
        flex-wrap: wrap;
        .cate-right-img{
          width: 33.3%;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          margin-bottom: 10px;
          image{
            width: 60px;
            height: 60px;
          }
        }
      }
    }
  }
</style>
