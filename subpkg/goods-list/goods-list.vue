<template>
  <view class="goods-list">
  <view v-for="(item,index) in goodsList" :key='index' @click="gotoGoodsDetail(item)">
    <!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
    <my-goods :goods="item"></my-goods>
  </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObject: {
          query: '', // 查询关键词
          cid: '', // 商品分类id
          pagenum: 1, // 页码
          pagesize: 10 // 每页显示数据的条数        
        },
        goodsList: [] ,// 商品列表
        total:0 ,// 商品总数
       isLoading:false // 节流阀
        
      }
    },
    onLoad(options) {
      // 将跳转到本页面时传递的参数中相关的数据转存到data数据中
      this.queryObject.query = options.query || ''
      this.queryObject.cid =  options.cid || ''
      this.getGoodsList()
    },
    
    methods: {
      // 获取商品列表数据
      async getGoodsList(cd) { 
        // 开启节流阀
        this.isLoading =true
        const {
          data: res 
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObject)
        // 关闭节流阀
        this.isLoading = false
          cd && cd()
        if (res.meta.status !== 200) return uni.$showMsg()
        this.goodsList = [...this.goodsList,...res.message.goods]
        this.total = res.message.total
        // console.log(res);
        
      
      },
      // 点击跳转到商品详情页面
      gotoGoodsDetail(item){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id='+ item.goods_id
        })
      }
    },
    // 上拉加载
    onReachBottom() {
      if(this.queryObject.pagenum*this.queryObject.pagesize >= this.total) return uni.$showMsg('数据加载完成')
      console.log(1);
      // 上拉加载时 判断节流阀是否开启，如果开启，表示数据加载中，则不做任何动作
      if(this.isLoading) return
      this.queryObject.pagenum++
      this.getGoodsList()
    },
    // 下拉刷新
    onPullDownRefresh() {
      // 重置相关的数据
      this.queryObject.pagenum = 1,
      this.total = 0
      this.isLoading = false
      this.goodsList = []
      // 重新发起请求获取数据 并传入一个箭头函数，调用stopPullDownRefresh方法，关闭下拉刷新的界面
      this.getGoodsList(() => uni.stopPullDownRefresh())
    }
  }
</script>

<style lang="scss">

  

</style>
