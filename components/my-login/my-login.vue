<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color='#afafaf'></uni-icons>
    <button class="login-btn" type="primary" open-type='getUserInfo' @getuserinfo='getUserInfo'>一键登录</button>
    <view class="login-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
  import {mapMutations,mapState} from 'vuex'
  export default {
    data() {
      return {
      
      };
    },
    computed:{
      ...mapState('m_user',['redirectInfo']),
    },
    methods:{
      ...mapMutations('m_user',['updateUserInfo','upadateToken','updateRedirectInfo']),
      getUserInfo(e) {
        console.log(e);
        this.updateUserInfo(e.detail.userInfo)
        this.getToken(e.detail)
      },
     async getToken(info) {
      const [err,succ] = await uni.login()
      console.log(succ);
      if(err || succ.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')
      const query ={
        code:succ.code,
        encryptedData:info.encryptedData,
        iv:info.iv,
        rawData:info.rawData,
        signature:info.signature
      }
      // 这个接口无法使用,所以下面就自己设置了一个假的token
     // const { data: loginResult }= await uni.$http.post('/api/public/v1/users/wxlogin',query)
     // if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
     // this.upadateToken(loginResult.message.token)
     // 假的token
     this.upadateToken('456456456sdasdsadas464')
     this.navigateBack()
      },
      navigateBack() {
        // redirectInfo 不为 null，并且导航方式为 switchTab
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          // 调用小程序提供的 uni.switchTab() API 进行页面的导航
          uni.switchTab({
            // 要导航到的页面地址
            url: this.redirectInfo.from,
            // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }    
  }
</script>

<style lang="scss">
  .login-container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 750rpx;
    background-color: #F8F8F8;
    &::after{
      content: '';
      display: block;
      width: 100%;
      height: 10%;
      background-color: white;
      border-radius: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      transform: translateY(50%);
    }
    .login-btn {
      width: 90%;
      font-size: 16px;
      border-radius: 20px;
      background-color: #C00000;
      color: white;
      margin: 10px 0;
    }
    .login-text{
      font-size: 12px;
      color: #afafaf;
    }
  }
</style>
