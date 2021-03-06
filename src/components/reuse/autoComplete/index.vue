<template>
  <div class="auto-complete-box" :class="{ 'shadow': shadow }">
    <div class="auto-complete-container">
      <div class="complete-input">
        <el-autocomplete
          ref="ld_autocomplete"
          v-model="searchText"
          popper-class="lordless-autocomplete hide-arrow redius-bottom"
          :fetch-suggestions="handleSearch"
          :placeholder="placeholder"
          @select="handleSelect">
          <span
            class="color-secondary ld-auto-icon"
            slot="suffix"
            @click="iconClick">
            <svg>
              <use :xlink:href="`#icon-${searchText ? 'close' : 'search'}`"/>
            </svg>
          </span>
          <!-- <i
            class="el-input__icon ld-auto-icon color-secondary"
            :class="`el-icon-${searchText ? 'close' : 'search'}`"
            slot="suffix"
            @click="iconClick">
          </i> -->
          <div class="d-inline-flex f-auto-center complete-icon" slot="prefix">
            <svg>
              <use xlink:href="#icon-logo-image"/>
            </svg>
          </div>
          <template slot-scope="{ item }">
            <div class="popper-trending" v-if="item.trending">
              <p>Footprint</p>
              <div class="d-flex f-align-center">
                <div class="v-flex d-flex col-flex popper-trending-item"
                  v-for="(trend, index) of item.list"
                  :key="index">
                  <div class="popper-trending-container">
                    <div
                      class="popper-trending-poster"
                      :class="`building-popularity-${trend.chain.popularity}`"
                      @click.stop="$emit('trend', trend)">
                      <lordless-img
                        alt="tavern preview"
                        type="span"
                        absolute
                        :src="trend.ldbIcon.source.preview | reldbIcon('map')"/>
                        <span class="building-sale-bg" :style="`background-image: url(${originSource('/svg/sale-bg.svg', { size: -1 })})`"></span>
                        <img alt="tavern curve" class="ldb-curve" :src="'/svg/curve.svg' | originSource({ size: -1 })">
                    </div>
                    <div class="text-center popper-trending-text">
                      {{ trend.name.zh }}
                      <!-- <span>
                        <svg class="popper-trending-svg">
                          <use xlink:href="#icon-hot"/>
                        </svg>
                      </span>
                      <span class="popper-trending-name">{{ trend.name.zh }}</span> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex popper-record" :class="{ 'theme-gray': !item.id, 'margin': item.localFirst }" v-if="!item.trending">
              <div class="d-inline-flex f-auto-center popper-record-icon color-secondary">
                <!-- <i :class="`el-icon-${item.id ? (item.history ? 'time' : 'location') : 'location-outline'} color-secondary`"></i> -->
                <svg>
                  <use :xlink:href="`#icon-${item.history ? 'search-history' : 'location'}`"/>
                </svg>
              </div>
              <div class="v-flex popper-record-text" :class="{ 'bottom-border': searchText, 'no-border': searchText && item.last }">
                <span class="d-inline-block record-name">{{ item.name.zh }}</span>
                <!-- <span class="d-inline-block record-area">{{ item.address }}</span> -->
              </div>
            </div>
          </template>
        </el-autocomplete>
      </div>
      <!-- <div class="complete-search">
        <i class="el-icon-search"></i>
      </div> -->
    </div>
  </div>
</template>

<script>
import { originSource } from 'utils/tool'
export default {
  props: {

    placeholder: {
      type: String,
      default: 'Search Somthing'
    },

    shadow: {
      type: Boolean,
      default: true
    }
  },
  data: () => {
    return {
      searchText: ''
    }
  },
  methods: {
    originSource () {
      return originSource(...arguments)
    },

    handleSearch (string, cb) {
      this.$emit('handleSearch', string, cb)
    },

    handleSelect (item) {
      this.$emit('handleSelect', item)
    },

    iconClick () {
      if (this.searchText) this.searchText = ''
      else this.$refs.ld_autocomplete.focus()
      this.$emit('iconClick')
    }
  }
}
</script>

<style lang="scss" scoped>
  .auto-complete-box {
    width: inherit;
    height: 70px;
    padding: 15px 0;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 3px;
    &.redius-top {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
    &.shadow {
      box-shadow: 2.5px 5px 20px 0 rgba(0, 0, 0, .25);
    }
  }
  .auto-complete-container {
    /deep/ .el-autocomplete {
      width: 100%;
      .el-input {
        font-size: 16px;
      }
      .el-input__inner {
        padding-left: 80px;
        padding-right: 43px;
        font-size: 18px;
        font-family: $--font-TTNormsMedium;
        border: none;
        outline: none;
        &::placeholder {
          font-size: 16px;
          font-weight: 500;
          color: #999;
        }
      }
      // .el-input__suffix {
      //   margin-right: 8px;
      //   font-size: 22px;
      //   font-weight: bold;
      //   color: #aaa;
      // }
      .el-input__prefix {
        top: 50%;
        left: 20px;
        height: initial;
        transform: translateY(-50%);
      }
      .el-input__suffix {
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
      }
    }
  }
  .ld-auto-icon {
    // font-weight: bolder;
    width: 23px;
    height: 23px;
    cursor: pointer;
    >svg {
      width: 23px;
    }
  }
  .complete-icon {
    padding: 8px;
    // margin-left: 13px;
    width: 44px;
    height: 44px;
    background-color: $--map-blue-pink-color;
    border-radius: 5px;
    >svg {
      fill: #fff;
      width: 100%;
      height: 100%;
    }
  }

  // popper-trending
  .popper-trending {
    padding: 0 10px;
    >p {
      padding-left: 10px;
      margin-bottom: 10px;
      font-size: 14px;
      color: #bbb;
    }
    // border-bottom: 1px solid #eee;
    &.margin {
      margin-bottom: 15px;
    }
  }
  .popper-trending-container {
    padding: 0 10px 10px;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    &:hover {
      background-color: #f5f7fa;
    }
  }
  .popper-trending-item {
    width: 33%;
  }
  .popper-trending-poster {
    margin-bottom: 10px;
    position: relative;
    width: 100%;
    padding-top: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 5px 0px rgba(0, 0, 0, .25);
    >.image-box {
      z-index: 2;
    }
  }
  .trending-ldb-level {
    position: absolute;
    top: -15px;
    right: -15px;
    width: 80px;
    height: 80px;
    z-index: 3;
    >img {
      width: 100%;
    }
  }
  .building-sale-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    // background-image: url('~static/svg/single/sale-bg.svg');
    background-size: 200%;
    background-position-x: 50%;
    background-position-y: 45%;
    opacity: .3;
    background-repeat: no-repeat;
  }
  .ldb-curve {
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    z-index: 3;
  }
  .popper-trending-text {
    margin: 0 auto;
    font-size: 14px;
    font-weight: 500;
    max-width: 96px;
    overflow: hidden;
    color: #999;
  }
  .popper-trending-svg {
    margin-right: 6px;
    width: 16px;
    height: 16px;
    fill: #FAD054;
  }
  .popper-trending-name {
    display: inline-block;
    width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  // popper-record
  .popper-record {
    padding-right: 20px;
    &.theme-gray {
      .popper-record-icon {
        fill: #aaa;
        // i {
        //   color: #aaa;
        // }
      }
      .record-name {
        color: #aaa;
      }
    }
    &.margin {
      margin-top: 15px;
    }
    &:hover {
      background-color: #f5f7fa;
    }
  }
  .popper-record-icon {
    padding-left: 25px;
    padding-right: 18px;
    // padding: 0 15px;
    // font-size: 22px;
    >svg {
      width: 22px;
      height: 22px;
    }
  }
  .popper-record-text {
    padding: 18px 0;
    color: #555;
    font-size: 16px;
    font-weight: 500;
    border-top: 2px solid #f2f2f2;
    &.bottom-border {
      border-top: none;
      border-bottom: 2px solid #f2f2f2;
    }
    &.no-border {
      border: none;
    }
    // .record-area {
    //   margin-left: 5px;
    //   color: #555;
    //   font-weight: bold;
    // }
  }
</style>
