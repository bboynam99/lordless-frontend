<template>
  <div class="lordless-status-box">
    <div class="page-container md">
      <div class="lordless-status-header text-center">
        <h1 class="TTFontBolder">Getting started</h1>
        <p class="text-color-secondary">Unsure how to get going on EVERMORE? WE'll help you out.</p>
      </div>
      <div class="lordless-status-content">
        <ul>
          <li class="status-cnt-item">
            <div class="d-flex status-cnt-container">
              <div class="d-flex f-align-end status-cnt-symbol">
                <span class="lordless-symbol-icon lg" :class="browserStatus">
                  <i :class="`el-icon-${browserStatus}`"></i>
                </span>
                <span class="inline-block mar-l1 text-upper text-color-third">STEP1</span>
              </div>
              <div class="v-flex status-cnt-left">
                <h2>Use a supported browser</h2>
                <p class="text-color-secondary mar-t2">You'll need to use Chrome or Firefox as your internet browser because this will allow you to user Metamask(your digital wallet)</p>
                <p class="no-install-browser" v-if="unBrowser">Install <a target="_blank" href="https://www.google.com/chrome/">Google Chrome</a> or <a target="_blank" href="https://www.mozilla.org/en-US/firefox/new/">Mozilla Firefox</a></p>
              </div>
              <div class="d-flex f-auto-center sm-hidden text-center status-cnt-right">
                <img class="browser" :src="'/img/guide/guide-browsers.png' | originSource"/>
              </div>
            </div>
          </li>
          <li class="status-cnt-item">
            <div class="d-flex status-cnt-container">
              <div class="d-flex f-align-end status-cnt-symbol">
                <span class="lordless-symbol-icon lg" :class="metaMaskStatus">
                  <i :class="`el-icon-${metaMaskStatus}`"></i>
                </span>
                <span class="inline-block mar-l1 text-upper text-color-third">STEP2</span>
              </div>
              <div class="v-flex status-cnt-left">
                <h2>Install and unlock MetaMask</h2>
                <p class="text-color-secondary mar-t2">You'll need to use Chrome or Firefox as your internet browser because this will allow you to user Metamask(your digital wallet)</p>
                <p class="no-install-metamask" v-if="unBrowser && unMetamask">Install extension for <a target="_blank" href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn">Google Chrome</a> or <a target="_blank" href="https://addons.mozilla.org/zh-CN/firefox/addon/ether-metamask/">Mozilla Firefox</a></p>
                <p class="unlock-wallet" v-if="!unMetamask && lockedMetamask">Your wallet is locked. Please unlock it.</p>
              </div>
              <div class="d-flex f-auto-center sm-hidden text-center status-cnt-right">
                <img :src="'/img/guide/guide-metamask.png' | originSource"/>
                <!-- <svg>
                  <use xlink:href="#color-icon-metamask"/>
                </svg> -->
              </div>
            </div>
          </li>
          <li class="status-cnt-item">
            <div class="d-flex status-cnt-container">
              <div class="d-flex f-align-end status-cnt-symbol">
                <span class="lordless-symbol-icon lg" :class="ethBalanceStatus">
                  <i :class="[`el-icon-${ethBalanceStatus}`]"></i>
                </span>
                <span class="inline-block mar-l1 text-upper text-color-third">STEP3</span>
              </div>
              <div class="v-flex status-cnt-left">
                <h2>Own some Ethereum</h2>
                <p class="text-color-secondary mar-t2">You'll need to use Chrome or Firefox as your internet browser because this will allow you to user Metamask(your digital wallet)</p>
              </div>
              <div class="d-flex f-auto-center sm-hidden text-center status-cnt-right">
                <!-- <svg>
                  <use xlink:href="#color-coin-eth"/>
                </svg> -->
                <img :src="'/img/guide/guide-ethereum.png' | originSource"/>
              </div>
            </div>
          </li>
        </ul>
        <div class="text-center status-start-box" v-if="finishStatus">
          <h2>It seems that you're fully prepared!</h2>
          <lordless-btn class="TTFontBolder text-upper start-btn" @click="$router.push('market')">START</lordless-btn>
        </div>
      </div>
      <div class="text-center lordless-status-questions">
        <h2>Common questions</h2>
        <div class="status-questions-cnt">
          <ul class="text-left d-flex sm-col-flex">
            <li class="v-flex questions-cnt-item">
              <div class="questions-cnt-header">
                Why do you need my mobile phone number?
              </div>
              <div class="v-flex text-color-secondary questions-cnt-body">
                We use your email to send you notifications around collectible activity such as ones you buy and sell.
                If you plan to access Fan Bits across multiple platforms with different Ethereum addresses,your email let's
                us streamline your experience and the collectibles you own.
              </div>
            </li>
            <li class="v-flex questions-cnt-item">
              <div class="questions-cnt-header">
                Why do you need my mobile phone number?
              </div>
              <div class="v-flex text-color-secondary questions-cnt-body">
                We use your email to send you notifications around collectible activity such as ones you buy and sell.
                If you plan to access Fan Bits across multiple platforms with different Ethereum addresses,your email let's
                us streamline your experience and the collectibles you own.
              </div>
            </li>
            <li class="v-flex questions-cnt-item">
              <div class="questions-cnt-header">
                Why do you need my mobile phone number?
              </div>
              <div class="v-flex text-color-secondary questions-cnt-body">
                We use your email to send you notifications around collectible activity such as ones you buy and sell.
                If you plan to access Fan Bits across multiple platforms with different Ethereum addresses.
              </div>
            </li>
          </ul>
          <p class="text-color-secondary">Learn more in <span>FAQs</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => {
    return {}
  },
  computed: {
    ...mapState('status', [
      'browser'
    ]),
    ...mapState('web3', [
      'web3Opt'
    ]),

    unBrowser () {
      return !this.browser.Chrome && !this.browser.Firefox
    },

    browserStatus () {
      const browser = this.browser
      switch (true) {
        case browser.default: return 'loading'
        case this.unBrowser: return 'close'
        default: return 'check'
      }
    },

    unMetamask () {
      const web3Opt = this.web3Opt
      return !web3Opt.web3js || !web3Opt.networkId || !web3Opt.isConnected
    },

    lockedMetamask () {
      const web3Opt = this.web3Opt
      return !web3Opt.address
    },

    metaMaskStatus () {
      const web3Opt = this.web3Opt
      switch (true) {
        case web3Opt.loading: return 'loading'
        case this.unMetamask || this.lockedMetamask: return 'close'
        default: return 'check'
      }
    },

    unOwnEthBalance () {
      const web3Opt = this.web3Opt
      return !web3Opt.balance
    },

    ethBalanceStatus () {
      const web3Opt = this.web3Opt
      switch (true) {
        case web3Opt.loading: return 'loading'
        case this.unOwnEthBalance: return 'close'
        default: return 'check'
      }
    },

    finishStatus () {
      return !this.unBrowser && !this.unMetamask && !this.lockedMetamask && !this.unOwnEthBalance
    }
  }
}
</script>

<style lang="scss" scoped>

  .lordless-status-box {
    padding-top: 80px;
  }
  .no-install-browser, .no-install-metamask {
    margin-top: 20px;
    >a {
      color: #4E47D3;
      text-decoration: none;
    }
  }
  .unlock-wallet {
    margin-top: 20px;
    @include margin('top', 20px, 1);
  }
  .lordless-status-header {
    margin-top: 50px;
    margin-bottom: 100px;
    >h1 {
      font-size: 36px;
    }
    >p {
      margin-top: 18px;
      font-size: 20px;
    }
  }
  .status-cnt-item {
    border-radius: 10px;
    // border: 1px solid #eee;
    box-shadow: 5px 5px 20px 0 rgba(0, 0, 0, .3);
    &:not(:first-of-type) {
      @include margin('top', 60px, 1.2);
    }
  }
  .status-cnt-container {
    position: relative;
    padding: 60px 0 30px 60px;
  }
  .status-cnt-symbol {
    position: absolute;
    top: -20px;
    left: 31px;
    font-size: 14px;
  }
  .status-cnt-left {
    >h2 {
      font-size: 22px;
    }
    >p {
      font-size: 16px;
    }
  }
  .status-cnt-right {
    padding: 0 30px;
    width: 30%;
    max-width: 350px;
    height: 120px;
    box-sizing: border-box;
    img {
      height: 100%;
      pointer-events: none;
      &.browser {
        width: 100%;
        height: auto;
      }
    }
  }

  .status-start-box {
    margin-top: 60px;
    padding-top: 40px;
    padding-bottom: 30px;
    position: relative;
    color: #fff;
    background-color: transparent;
    @include TTFontBolder();
    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      height: 100%;
      background-color: #4E47D3;
      transform: translateX(-50%);
      z-index: -1;
      @include viewport-unit(width, 100vw);
    }
    >h2 {
      font-family: inherit;
      font-size: 26px;
    }
  }
  .start-btn {
    margin-top: 30px;
    padding: 10px 30px;
    color: #4E47D3;
    font-size: 24px;
  }

  .lordless-status-questions {
    margin-top: 40px;
    margin-bottom: 80px;
    @include TTFontBolder();
    >h2 {
      font-family: inherit;
      font-size: 28px;
    }
  }
  .status-questions-cnt {
    margin-top: 50px;
    >p {
      margin-top: 50px;
      font-size: 20px;
      @include TTFontNormal();
      >span {
        text-decoration: underline;
        cursor: pointer;
        @include TTFontBolder();
      }
    }
  }
  .questions-cnt-item {
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 5px 5px 20px 0 rgba(0, 0, 0, .15);
    &:not(:first-of-type) {
      @include margin('left', 40px, -2);
      @include margin('top', 20px, 1, -2);
    }
  }
  .questions-cnt-header {
    padding: 32px 22px;
    color: #fff;
    font-size: 18px;
    background-color: #4E47D3;
  }
  .questions-cnt-body {
    padding: 24px 22px;
    font-size: 16px;
    @include TTFontNormal();
  }

  @media screen and (max-width: 768px) {
    .lordless-status-box {
      padding-left: 15px;
      padding-right: 15px;
    }
    .status-cnt-item {
      box-shadow: 0px 5px 10px 0 rgba(0, 0, 0, 0.3);
    }
  }
</style>
