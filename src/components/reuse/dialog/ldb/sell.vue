<template>
  <el-dialog
    :visible.sync="sellModel"
    :custom-class="`inline-block lordless-dialog message-dialog center no-header transparent ${metaOpen ? 'blur' : ''}`"
    width="100%"
    append-to-body
    center
    top="0"
    :show-close="false"
    @open="$emit('open')"
    @close="$emit('close')">
    <div class="lordless-message-box">
      <span
        @click.stop="$emit('input', false)"
        class="inline-block line-height-1 lordless-message-close light">
        <i class="el-icon-close"></i>
      </span>
      <div class="text-center dialog-sell-cnt">
        <h1>Sell Tavern</h1>
        <p class="text-left"><span>#{{ ldbInfo.chain.tokenId }}</span> will be placed for auction. When time expires, you need to cancel the auction, and then <span>#{{ ldbInfo.chain.tokenId }}</span> will be set free for sale.</p>
        <div class="dialog-sell-middle">
          <ld-input
            v-model="sellInputs.price.model"
            type="text"
            number
            required
            :placeholder="sellInputs.price.placeholder"
            :symbol="sellInputs.price.symbol"
            :regex="sellInputs.price.regex"
            :regexError="sellInputs.price.regexError"
            @change="priceHandle"
            @blur="priceHandle">
          </ld-input>
          <ld-input
            v-model="sellInputs.duration.model"
            type="text"
            number
            required
            :placeholder="sellInputs.duration.placeholder"
            :symbol="sellInputs.duration.symbol"
            :regex="sellInputs.duration.regex"
            :regexError="sellInputs.duration.regexError"
            @change="durationHandle"
            @blur="durationHandle">
          </ld-input>
        </div>
        <div class="TTFontBolder ldb-sell-bottom">
          <div class="ldb-sell-btn">
            <lordless-btn
              class="TTFontBolder lordless-message-btn"
              theme="deep-blue"
              shadow
              :loading="sellPending"
              :disabled="metamaskChoose || sellPending"
              @click="submitSell">
              <span class="sell-confirm" v-if="!sellPending">Sell</span>
            </lordless-btn>
          </div>
          <div class="contract-pending-tip" v-show="sellPending">
            <p>contract is pending, waiting for few minutes</p>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import LdInput from '@/components/stories/input'

import { metamaskMixins, contractMixins } from '@/mixins'

export default {
  mixins: [metamaskMixins, contractMixins],
  props: {
    value: {
      type: Boolean,
      default: false
    },

    ldbInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },

    // 是否执行内部pending, 默认 true
    pending: {
      type: Boolean,
      default: false
    }
  },
  data: (vm) => {
    return {
      sellModel: vm.value,
      sellPending: false,
      sellInputs: {
        price: {
          model: vm.ldbInfo.chain.auction.price || 0,
          placeholder: 'Price',
          symbol: 'ETH',
          regex: /^[0-9.]+$/,
          regexError: 'Only integer is valid',
          required: true
        },
        duration: {
          model: 30,
          placeholder: 'Duration',
          symbol: 'Days',
          regex: /^[0-9]+$/,
          regexError: 'Only integer is valid',
          required: true
        }
      }
    }
  },
  computed: {

    sellRequired () {
      const { price, duration } = this.sellInputs
      return price.required && duration.required
    },

    account () {
      return this.$root.$children[0].web3Opt.address
    },

    metaOpen () {
      return this.$root.$children[0].metaOpen
    },

    web3Opt () {
      return this.$root.$children[0].web3Opt
    }
  },
  components: {
    LdInput
  },
  methods: {

    /**
     * price 表单事件
     */
    priceHandle ({ required }) {
      this.$set(this.sellInputs.price, 'required', required)
    },

    /**
     * duration 表单事件
     */
    durationHandle ({ required }) {
      this.$set(this.sellInputs.duration, 'required', required)
    },

    /**
     * 挂售提交
     */
    async submitSell ({ ldbInfo = this.ldbInfo, sellInputs = this.sellInputs, web3Opt = this.web3Opt, NFTsCrowdsale = this.NFTsCrowdsale } = {}) {
      const tokenId = ldbInfo.chain.tokenId
      if (!tokenId || !this.sellRequired) return

      const { web3js, gasPrice } = web3Opt

      // 获取表单信息
      const price = parseFloat(sellInputs.price.model)
      const duration = parseFloat(sellInputs.duration.model)

      const startTime = Math.floor(new Date().getTime() / 1000)
      const endTime = Math.floor(new Date().getTime() / 1000) + duration * 3600 * 24
      console.log('--- sale price', web3js.toWei(price), tokenId, startTime, endTime)

      this.metamaskChoose = true

      // 传输的合约参数
      const newAuction = {
        name: 'newAuction',
        values: [ web3js.toWei(price), tokenId, startTime, endTime ]
      }

      // 估算 gas，不准
      // const gas = (await NFTsCrowdsale.estimateGas(newAuction.name, newAuction.values)) || 400000
      const gas = 400000

      // 执行合约操作
      NFTsCrowdsale.methods(newAuction.name, newAuction.values.concat([{ gas, gasPrice }]))
        .then(tx => {
          this.sellPending = true
          this.metamaskChoose = false

          this.$emit('input', false)

          this.$nextTick(() => {
            this.$emit('pending', { tx, tokenId, price: web3js.toWei(price), action: newAuction.name, pending: true })
          })
          // 执行内部pending
          if (this.pending) {
            const loop = () => {
              // 轮询 tx 状态
              this.checkTxEvent({ tx, action: newAuction.name, tokenId }, ({ err, data }) => {
                if (err) return
                if (data.isPending) return loop()

                this.$emit('pending', { tx, tokenId, price: web3js.toWei(price), action: newAuction.name }, data)
              })
            }
            loop()
          }
        })
        .catch((err) => {
          console.log('err', err)
          this.metamaskChoose = false
        })
    }
  },
  watch: {
    value (val) {
      this.sellModel = val
      this.$emit('blurs', val)
      if (!val) this.sellPending = false
    },
    sellModel (val) {
      this.$emit('input', val)
    },
    account (val) {
      this.sellModel = false
    }
  }
}
</script>

<style lang="scss" scoped>

  .lordless-message-box {
    // padding-bottom: 60px;
  }
  .dialog-sell-cnt {
    // transform: translateY(-150px);
    // margin-top: -150px;
    >h1 {
      font-size: 36px;
    }
    >p {
      font-size: 16px;
      @include margin('top', 40px, 1);
      >span {
        font-size: 18px;
        font-family: $--font-TTNormsMedium;
      }
    }
  }
  .dialog-sell-middle {
    font-size: 18px;
    margin: 30px auto 0;
    width: 280px;
    line-height: 30px;
    font-size: 18px;
    overflow: hidden;
    >div {
      &:not(:first-of-type) {
        margin-top: 40px;
      }
    }
  }

  .ldb-sell-bottom {
    margin-top: 60px;
  }

  .ldb-sell-bottom {
    >p {
      font-size: 18px;
    }
  }

  .ldb-sell-btn {
  }
</style>
