<template>
  <view class="my-address">
    <!-- 选择地址 -->
    <view class="address-choose" v-if='JSON.stringify(address) === "{}"'>
      <button size="mini" type="primary" @click="chooseAddress">请选择收获地址+</button>
    </view>
    <!-- /选择地址 -->
    <!-- 地址 -->
    <view class="address-info-box" v-else @click="chooseAddress">
      <view class="row1">
        <view class="row1-left">
          <view class="usename">收货人：{{address.userName}}</view>
        </view>
        <view class="row1-right">
          <view class="phone">电话：{{address.telNumber}}</view>
          <uni-icons type="arrowright"></uni-icons>
        </view>
      </view>

      <view class="row2">
        <view class="row2-left">收货地址：</view>
        <view class="row2-right">{{addstr}}</view>
      </view>
    </view>
    <!-- /地址 -->
    <!-- 分割线 -->
    <image class="address-solid" src="../../static/cart_border@2x.png" mode="widthFix"></image>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        address: JSON.parse(uni.getStorageSync('address') || '{}')
      };
    },
    computed: {
      addstr() {
        if (!this.address.provinceName) return
        return this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo
      }
    },
    methods: {
      async chooseAddress() {
        const [err, succ] = await uni.chooseAddress().catch(err => err)
        // console.log(succ);
        if (succ && succ.errMsg === "chooseAddress:ok") {
          this.address = succ
        }
        console.log(err);
        if (err && (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response')) {
          this.reAuth() // 调用 this.reAuth() 方法，向用户重新发起授权申请
        }
        this.saveAddress()
      },
      saveAddress() {
        uni.setStorageSync('address', JSON.stringify(this.address))
      },
      async reAuth() {
        const [err, confirmResult] = await uni.showModal({
          content: '检测到您没打开地址权限，是否去设置打开？',
          confirmText: '确认',
          cancelText: '取消'
        })

        // console.log(confirmResult);
        if (err) return
        if (confirmResult.cancel) return uni.$showMsg('您取消了授权')
        if (confirmResult.confirm) return uni.openSetting({
          success(settingResult) {
            console.log(settingResult);
            // 3.4.2 地址授权的值等于 true，提示用户 “授权成功”
            if (settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功！请选择地址')
            // 3.4.3 地址授权的值等于 false，提示用户 “您取消了地址授权”
            if (!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权！')
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .my-address {
    .address-choose {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 90px;
    }

    .address-solid {
      display: block;
      width: 100%;
      height: 5px;
    }

    .address-info-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 15px 10px;
      font-size: 14px;
      height: 90px;

      .row1 {
        display: flex;
        justify-content: space-between;
        margin: 15px 0;

        .row1-right {
          display: flex;
        }
      }

      .row2 {
        display: flex;
        align-items: center;

        .row2-left {
          white-space: nowrap;
        }

      }
    }
  }
</style>
