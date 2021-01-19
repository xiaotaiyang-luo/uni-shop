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
    <view class="settle-account" @click="settlement">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    data() {
      return {
        seconds: 3,
        timer: null,
      };
    },
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkGoodsAmount']),
      ...mapGetters('m_user', ['addstr']),
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart']),
      // 全选状态
      isFullCheck() {
        // 如果所有商品总数等于结算总数，那么就表示为全选
        return this.total === this.checkedCount
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),
      // 全选/反选
      checkAllState() {
        // console.log(this.isFullCheck);
        this.updateAllGoodsState(!this.isFullCheck)
      },
      // 点击结算按钮
      settlement() {
        // 要结算,要确保有选择地址,有选中的商品,有进行登录,有一条不满足,就不能进行结算

        // 1. 先判断是否勾选了要结算的商品
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')

        // 2. 再判断用户是否选择了收货地址
        if (!this.addstr) return uni.$showMsg('请选择收货地址！')

        // 3. 最后判断用户是否登录了
        if (!this.token) return this.gotoLogin()
        
        // 所有的消息都填完整,就开始结算
        this.payOrder()
      },
      // 未登录时点击结算,跳转到登录页面
      gotoLogin() {
        this.seconds = 3 // 每次调用方法时，重置倒计时时间
        this.showTips(this.seconds)
        this.timer = setInterval(() => {
          this.seconds--
          if (this.seconds <= 0) {
            clearInterval(this.timer)
            uni.switchTab({
              url: '/pages/my/my',
              success: () => {
                this.updateRedirectInfo({
                  // 跳转的方式
                  openType: 'switchTab',
                  // 从哪个页面跳转过去的
                  from: '/pages/cart/cart'
                })
              }
            })
            return
          }
          this.showTips(this.seconds)
        }, 1000)

      },
      // 展示倒计时的提示消息
      showTips(n) {
        // 调用 uni.showToast() 方法，展示提示消息
        uni.showToast({
          // 不展示任何图标
          icon: 'none',
          // 提示的消息
          title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
          // 为页面添加透明遮罩，防止点击穿透
          mask: true,
          // 1.5 秒后自动消失
          duration: 1500
        })
      },
      // 发起支付请求
     async payOrder(){
        // 1.准备创建订单需要的参数
        const orderInfo = {
          // order_price:this.checkGoodsAmount,
          order_price:0.01,
          consignee_addr:this.addstr,
          goods:this.cart.filter(x => x.goods_state).map(x => ({goods_id:x.goods_id,goods_number:x.goods_count,goods_price:x.goods_price}))
        }
        //2. 请求创建订单的API接口,发起请求创建订单
       const {data:res} = await uni.$http.post('/api/public/v1/my/orders/create',orderInfo)
       // console.log(res);
       // 如果状态码不等于200,表示创建订单失败
       if(res.mate.status !== 200) return uni.$showMsg('创建订单失败！')
       // 如果等于200,表示订单创建成功,将数据进行转存
       const orderNumber = res.message.order_number
       // 3.根据创建订单暂存的数据,发起订单与支付的请求
     const {data:res2} = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder',{order_number:orderNumber})
            // 如果状态码不等于200,表示预支付失败
     if(res2.mate.status !== 200 ) return uni.$showMsg('预支付订单失败！')
     // 如果等于200,表示预支付成功,将数据进行转存
     const payInfo = res2.message.pay
     
      // 4.根据预支付订单暂存的数据发起支付请求
      // 4.1调用微信的api发起支付请求，并结构其返回的数据
     const [err,succ] = await uni.requestPayment(payInfo) 
     // 如果返回数据中有错误对象,表示支付失败
     if(err) return uni.$showMsg('订单支付失败')
     // 4.2没有返回错误对象,则发起查询订单支付结果的请求,查询支付是否成功
     // 注:微信官方返回的支付结果不能作为支付是否成功的唯一凭证,所以还是需要调用后端的接口进行查询是否支付成功
     const {data:res3} = await uni.$http.post('/api/public/v1/my/orders/chkOrder',{order_number:orderNumber})
     // 4.3如果请求状态码不等于200,表示支付失败
     if(res3.mate.status !== 200) return uni.$showMsg('订单未支付')
     // 反之则表示支付成功,弹出提示框,提示用户支付成功
     uni.showToast({
       title:"支付完成",
       icon:'success'
     })
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
