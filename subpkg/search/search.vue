<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box">
      <uni-search-bar cancelButton="none" :radius="100" @input="input" placeholder="请输入关键词" @confirm="search"></uni-search-bar>
    </view>
    <!-- /搜索框 -->
    <!-- 建议列表 -->
    <view class="sugg-list" v-if="searchResult.length !== 0">
      <view class="sugg-item" v-for="(item,index) in searchResult" :key='index' @click="gotoGoods(item)">
        <view class="sugg-text">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="17"></uni-icons>
      </view>
    </view>
    <!-- /建议列表 -->
    <!-- 搜索历史 -->
    <view class="search-history" v-else>
      <!-- 历史标题 -->
      <view class="history-title">
        <view class="title">搜索历史</view>
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <!-- 搜索历史标签 -->
      <view class="history-tab">
        <uni-tag v-for="(query,i) in history" :key='i' :text="query" type="default" @click="gotoGoodsList(query)"></uni-tag>
      </view>
    </view>
    <!-- /搜索历史 -->
  </view>
</template>

<script>
  export default {
    data() {
      return {
        timer: null, // 防抖的定时器，用于清除延时器与启动赋值
        query: '', // 搜索关键词
        searchResult: [], // 搜索结果列表
        historyList: [] // 搜索历史
      };
    },
    onLoad() {
      // 页面进行渲染前,先获取到本地存储的历史记录
      // 这里巧妙的使用了 '[]' 一个字符串的数组,好处是简化了代码的书写,因为JSON.parse是将字符串转换为对象,所以直接使用字符串格式的,这样就不需要再进行if的判断了,直接利用短路逻辑非去判断是否有本地存储,有就输出本地存储的值,没有就为一个空数组
      this.historyList = JSON.parse(uni.getStorageSync('query') || '[]')
    },
    methods: {
      input(e) {
        // 当500毫秒内多次时，清除其余延时器
        clearTimeout(this.timer)
        // 重新开启延时器，直到500毫秒内没有任何输入动作时，输出结果
        this.timer = setTimeout(() => {
          this.query = e.value.trim()
          // console.log(this.query);
          this.getSearchList()
        }, 500)
      },
      async getSearchList() {
        if (this.query === '') {
          return this.searchResult = []
        }

        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.query
        })
        // console.log(res);
        if (res.meta.status !== 200) return uni.$showMsg()
        this.searchResult = res.message
        this.saveHistory()
      },
      // 点击搜索建议,跳转到商品详情
      gotoGoods(item) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      // 保存搜索历史记录
      saveHistory() {
        // this.historyList.push(this.query)
        // 利用set 集合中的元素唯一性,解决搜索历史重复的问题
        const set = new Set(this.historyList)
        // 先把集合对象中原先的重复值删除掉，如果输入的内容原先有的话
        set.delete(this.query)
        // 再将新的关键词传入到对象的后面
        set.add(this.query)
        // 将set对象利用Array.from()转换为数组,并转存给data中的historyList
        this.historyList = Array.from(set)
        // 转存到data数据中只是暂时的,下次进行重新编译时数据会被重置,无法实现持久化存储
        // 利用setStorageSync将数据存储到本地，进行数据持久化处理
        uni.setStorageSync('query', JSON.stringify(this.historyList))
      },
      // 删除历史记录
      cleanHistory() {
        this.historyList = []
        uni.setStorageSync('query','[]')
      },
      // 点击历史记录标签,跳转到商品列表页面
      gotoGoodsList(query) {
        uni.navigateTo({
          url:'/subpkg/goods-list/goods-list?query=' + query
        })
      }
    },
    computed: {
      // 利用监听器监听历史记录的变化,并将数组进行翻转，让最新输入的值显示在第一个
      history() {
        // 这里进行翻转的数组不能直接使用this.historyList，因为 reverse 方法会改变原数组
        //所以需要先进行解构放在一个数组中，然后再调用 reverse 方法进行翻转操作
        return [...this.historyList].reverse()
      }
    }
  }
</script>

<style lang="scss">
  .sugg-list {
    padding: 0 10px;

    .sugg-item {
      display: flex;
      justify-content: space-between;
      align-content: center;
      padding: 13px 0;
      font-size: 12px;
      border-bottom: 1px solid #eee;

      .sugg-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .search-history {
    padding: 0 10px;

    .history-title {
      display: flex;
      justify-content: space-between;
      align-content: center;
      padding: 15px 0;
      border-bottom: 1px solid #eee;
    }

    .history-tab {
      display: flex;
      flex-wrap: wrap;

      .uni-tag {
        margin: 5px;
        padding: 0 10px;
      }
    }
  }
</style>
