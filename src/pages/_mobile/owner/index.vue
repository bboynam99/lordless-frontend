<template>
  <div class="mobile-main-page">
    <mobile-nav-bar
      v-show="(scrollOpt.show && (!connectModel || !web3Model)) || connectModel || web3Model"
      v-bind="scrollOpt"
      @history="$router.push('/owner/info')"/>
    <router-view v-show="pageShow" class="mobile-children-page"/>
    <div
      v-if="web3Model || connectModel || web3Loading"
      class="d-flex mobile-plugins-box">
      <div v-if="web3Loading" class="v-flex d-flex f-auto-center mobile-plugins-loading">
        <i class="el-icon-loading"></i>
      </div>
      <mobile-wallets
        class="v-flex"
        v-else-if="web3Model"/>
      <mobile-connect
        class="v-flex"
        v-else
        @connect="checkUser"/>
    </div>
    <Authorize
      ref="mobileOwnerAuthorize"
      :modelClose="false"
      :autoClose="false"
      @blurs="dialogSetBlurs"/>
  </div>
</template>

<script>
import MobileConnect from '@/components/reuse/_mobile/connect'
import MobileWallets from '@/components/reuse/_mobile/wallets'
import Authorize from '@/components/reuse/dialog/authorize'

import { dialogMixins, publicMixins } from '@/mixins'
import { mapState } from 'vuex'
export default {
  name: 'mobile-owner-index',
  mixins: [dialogMixins, publicMixins],
  data: () => {
    return {
      scrollOpt: {
        show: false,
        history: false,
        text: 'Candies',
        scroll: false,
        withdraw: false,
        scrollMark: 0
      },
      navbarTexts: [
        {
          text: 'Candies',
          match: /\/owner\/candy/,
          show: true,
          withdraw: true
        },
        {
          text: 'Quests',
          match: /\/owner\/quest/,
          show: false
        },
        {
          text: 'Me',
          match: /\/owner\/info/,
          show: false
        },
        {
          text: 'Activities',
          match: /\/owner\/activities/,
          show: true,
          history: true
        },
        {
          text: 'Taverns',
          match: /\/owner\/taverns/,
          show: true,
          history: true
        },
        {
          text: 'Authorization',
          match: /\/owner\/authorization/,
          show: true,
          history: true
        }
      ]
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),
    web3Loading () {
      return this.web3Opt.loading
    },
    web3Model () {
      const { loading, isConnected } = this.web3Opt
      return this.isMobile && !loading && !isConnected
    },
    connectModel () {
      return !this.userInfo.default && !this.userInfo._id
    },
    pageShow () {
      return !this.connectModel && !this.web3Model && !this.web3Loading
    }
  },
  watch: {
    '$route' (route) {
      this.checkRoute(route)
    },
    account (val, oVal) {
      this.$nextTick(() => this.checkUser())
    }
  },
  components: {
    Authorize,
    MobileConnect,
    MobileWallets
  },
  methods: {

    checkRoute (route = this.$route, navbarTexts = this.navbarTexts) {
      const opt = {
        show: false,
        history: false,
        text: 'Candies',
        scroll: false,
        scrollMark: 0
      }

      for (const item of navbarTexts) {
        if (route.path.match(item.match)) {
          this.$set(this, 'scrollOpt', Object.assign({}, opt, item))
          this.$nextTick(() => {
            console.log('check route', item, (this.scrollOpt.show && (!this.connectModel || !this.web3Model)) || this.connectModel || this.web3Model)
          })
          break
        }
      }
    },

    async checkUser () {
      this.$refs.mobileOwnerAuthorize.checkoutAuthorize()
    }
  },
  mounted () {
    this.$nextTick(() => this.checkRoute())
  }
}
</script>

<style lang="scss">
  .mobile-main-page {
    margin: 0 auto;
    max-width: 768px;
    // background-color: #f8f8f8;
    // @include viewport-unit(min-height, 100vh, 112px);
  }
  .mobile-plugins-box {
    // margin-top: 40px;
    // padding-bottom: 40px;
    @include viewport-unit(min-height, 100vh, 50px);
  }
  .mobile-plugins-loading {
    font-size: 30px;
    color: #999;
  }
  .mobile-children-page {
    // padding: 0 20px;
    // @include viewport-unit(min-height, 100vh, 60px);
  }
  .children-none-data-box {
    margin: 0 auto;
    width: 80%;
    text-align: center;
  }
  .children-none-data-container {

  }
  .children-none-data-icon {
    margin: 0 auto;
    width: 120px;
    height: 120px;
    line-height: 0;
    fill: #999;
  }
  .children-none-data-desc {
    margin-bottom: 36px;
    font-size: 16px;
    color: #999;
  }
  .children-none-data-btn {
    width: 100%;
    padding: 12px 0;
    &:not(:first-of-type) {
      margin-top: 12px;
    }
  }
</style>
