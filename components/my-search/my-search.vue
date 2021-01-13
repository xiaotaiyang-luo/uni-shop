<template>
  <view class="search-container" :style="{'background-color':bgcolor}" @click="searchHandler">
    <view class="search-box" :style="{'border-radius':radius + 'px'}">
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    
    data() {
      return {

      }
    },
    // 利用props自定义组件的属性值,也就是接收过来的值作为动态绑定的属性值
    props:{
      // 背景颜色
      bgcolor: {
        type: String,
        default: "#C00000"
      },
      // 圆角尺寸
      radius: {
        type: Number,
        // 单位是 px
        default: 18
      }
    },
    methods:{
      // 点击搜索框样式的盒子时
      searchHandler(){
        // 自定义一个事件,传递给父组件,从而在父组件中监听这个事件，再通过监听这个事件的函数触发想要实现的效果
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
  .search-container {
    height: 50px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    .search-box {
      height: 36px;
      background-color: #ffffff;
      // border-radius: 15px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .placeholder {
        font-size: 15px;
        margin-left: 5px;
      }
    }
  }
</style>
