<template>
  <view class="userinfo-container">
    <!-- 头像昵称区域 -->
    <view class="top-box">
      <image :src="userinfo.avatarUrl"  class="avatar"></image>
      <view class="nickname">{{userinfo.nickName}}</view>
    </view>
    <!-- /头像昵称区域 -->
    <!-- 功能区域 -->
    <view class="panel-list">
      <!-- 第一版块收藏店铺等区域 -->
      <view class="panel">
       <view class="panel-body">
         <view class="panel-item">
           <view class="panel-itme-num">8</view>
           <view class="panel-item-text">收藏的店铺</view>
         </view>
         <view class="panel-item">
           <view class="panel-itme-num">18</view>
           <view class="panel-item-text">收藏的商品</view>
         </view>
         <view class="panel-item">
           <view class="panel-itme-num">8</view>
           <view class="panel-item-text">关注的商品</view>
         </view>
         <view class="panel-item">
           <view class="panel-itme-num">61</view>
           <view class="panel-item-text">足迹</view>
         </view>
       </view>
      </view>
    
      <!-- /收藏店铺等区域 -->
      <!-- 第二版块我的订单区域 -->
     <view class="panel">
        <view class="title">我的订单</view>
        <view class="panel-body">
          <view class="panel-item">
            <image src="../../static/my-icons/icon1.png" class="icons-img" ></image>
            <view class="panel-item-text">代付款</view>
          </view>
          <view class="panel-item">
            <image src="../../static/my-icons/icon2.png" class="icons-img" ></image>
            <view class="panel-item-text">待收货</view>
          </view>
          <view class="panel-item">
            <image src="../../static/my-icons/icon3.png" class="icons-img"></image>
            <view class="panel-item-text">退款/退货</view>
          </view>
          <view class="panel-item">
            <image src="../../static/my-icons/icon4.png" class="icons-img" ></image>
            <view class="panel-item-text">全部订单</view>
          </view>
        </view>
      </view>
      <!-- /我的订单区域 -->
      <!-- 第三板块 -->
    <view class="panel">
        <view class="panel-list-item">
          <view class="panel-item-text">收货地址</view>
          <uni-icons type="arrowright" size="18"></uni-icons>
        </view>
        <view class="panel-list-item">
          <view class="panel-item-text">联系客服</view>
          <uni-icons type="arrowright" size="18"></uni-icons>
        </view>
        <view class="panel-list-item" @click="exitHandler">
          <view class="panel-item-text">退出登录</view>
          <uni-icons type="arrowright" size="18"></uni-icons>
        </view>
      </view>
      <!-- 第三板块 -->
    </view>
    <!-- /功能区域 -->
  </view>
</template>

<script>
  import {
    mapState,mapMutations
  } from 'vuex'
  export default {
    data() {
      return {
      
      };
    },
    computed: {
      ...mapState('m_user', ['userinfo'])
    },
    methods:{
      ...mapMutations('m_user',['upadateToken','updateUserInfo','updateAddress']),
     async exitHandler() {
       // 询问用户是否退出登录
      const [err,res]= await uni.showModal({
          title:'提示',
          content:'确认退出登录吗?',
        }).catch(err => err)
       
        
        
        // console.log(res);
        // // if(err) return
        // // 用户确认退出,清空相关数据
        if(res && res.confirm) {
          this.upadateToken('')
          this.updateUserInfo({})
          this.updateAddress({})
        }
      }
    }
    
  }
</script>

<style lang="scss">
  page,.userinfo-container {
    background-color: #eeeeee;
    height: 100%;
    .top-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 180px;
      background-color: #C00000;
  
      .avatar {
        width: 80px;
        height: 80px;
        background-color: #C00000;
        border-radius: 100%;
        margin-bottom: 10px;
        border: 2px solid #fff;
      }
  
      .nickname {
        color: white;
      }
    }
  
    // 第一面板样式
    .panel-list {
      position: relative;
      top: -10px;
      border-radius: 10rpx;
      margin-bottom: 10px;
      padding: 0 10px;
    }
    .panel{
      background-color: white;
      border-radius: 10rpx;
      .panel-body{
        display: flex;
        justify-content: space-around;
        margin-bottom: 20rpx;
       .panel-item{
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         font-size: 14px;
         padding: 10px 0;
         .icons-img{
           width: 60rpx;
           height: 60rpx;
         }
       }
      }
    }
   
    .title{
      line-height: 90rpx;
      padding-left: 20rpx;
      border-bottom: 1px solid #eeeeee;
      font-size: 15px;
    }
    .panel-list-item{
      display: flex;
      justify-content: space-between;
      line-height: 90rpx;
      padding: 0 20rpx;
    }
  }
</style>
