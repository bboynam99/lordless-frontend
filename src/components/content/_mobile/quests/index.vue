<template>
  <div class="mobile-quests-box">
    <el-tabs
      class="mobile-quests-tabs"
      v-model="currentTab"
      stretch
      @tab-click="chooseTab">
      <el-tab-pane
        label="Bottoms up"
        name="bottoms">
      </el-tab-pane>
      <el-tab-pane
        class="relative"
        label="Bounty"
        name="bounty">
      </el-tab-pane>
      <el-tab-pane
        label="Reward"
        name="reward">
      </el-tab-pane>
    </el-tabs>
    <div id="mobile-quests-content-box" class="mobile-quests-content-box">
      <transition name="ld-hide-fade">
        <div v-if="currentTab === 'bottoms'" class="mobile-quests-bottoms">
          <transition name="ld-hide-fade" mode="out-in" @after-enter="afterEnter">
            <mobile-bottoms-up-skeletion class="quest-cnt-box" v-if="loading && !infos.bottoms.total"/>
            <div
              v-else-if="!loading && !infos.bottoms.total"
              class="d-flex f-auto-center mobile-quests-empty mobile-bounty-empty">
              <div class="quests-empty-container">
                <p class="quests-empty-icon">
                  <svg>
                    <use xlink:href="#icon-no-candy"/>
                  </svg>
                </p>
                <p class="quests-empty-desc">You have not claimed any candy.</p>
                <div class="quests-empty-btns">
                  <lordless-btn class="quests-empty-btn" theme="blue" inverse shadow @click="$router.push('/market')">Bottoms up</lordless-btn>
                </div>
              </div>
            </div>
            <div v-else ref="bottomsQuestCnt" class="quest-cnt-box quest-item-content">
              <ul>
                <li
                  class="quest-item"
                  v-for="(bottoms, index) of infos.bottoms.list" :key="index">
                  <mobile-quest-bounty
                    bottoms
                    :info="bottoms"/>
                </li>
              </ul>
              <div class="text-center quest-item-loadmore">
                <p v-if="loading && !infos.bottoms.noMore">
                  <i class="el-icon-loading"></i>
                </p>
                <p v-else-if="infos.bottoms.noMore">noMore datas</p>
              </div>
              <!-- <div class="quest-pagination-box">
                <lordless-pagination
                  :scrollE="bottomsPageScrollE"
                  :scrollOffset="150"
                  class="quest-pagination-pages"
                  :total="infos.bottoms.total"
                  :currentPage="infos.bottoms.pn"
                  :size="infos.bottoms.ps"
                  theme="blue"
                  background
                  @currentChange="changePage($event, 'bottoms')"/>
              </div> -->
            </div>
          </transition>
        </div>
        <div v-else-if="currentTab === 'bounty'" class="mobile-quests-bounty">
          <div class="d-flex tasks-sort-box">
            <mobile-sort-bar
              class="v-flex tasks-sort-bar"
              :sortItems="bountySortItems"
              static
              inheritHeight
              :showOrder="false"
              :showTotal="false"
              @sort="bountySortChange">
              <span class="tasks-sort-title">Filter by</span>
            </mobile-sort-bar>
          </div>
          <transition name="ld-hide-fade" mode="out-in" @after-enter="afterEnter">
            <mobile-bounty-skeletion class="quest-cnt-box" v-if="loading && !infos.bounty.total"/>
            <div
              v-else-if="!loading && !infos.bounty.total"
              class="d-flex f-auto-center mobile-quests-empty mobile-bounty-empty">
              <div class="quests-empty-container">
                <p class="quests-empty-icon">
                  <svg>
                    <use xlink:href="#icon-no-candy"/>
                  </svg>
                </p>
                <p class="quests-empty-desc">You have not apply any quests now.</p>
                <div class="quests-empty-btns">
                  <lordless-btn class="quests-empty-btn" theme="blue" inverse shadow @click="$router.push('/market')">Apply a quest</lordless-btn>
                </div>
              </div>
            </div>
            <div v-else ref="bountyQuestCnt" class="quest-cnt-box quest-item-content quest-tasks-content">
              <ul>
                <li
                  class="quest-item"
                  v-for="(bounty, index) of infos.bounty.list" :key="index">
                  <mobile-quest-bounty
                    :info="bounty"/>
                </li>
              </ul>
              <div class="text-center quest-item-loadmore">
                <p v-if="loading && !infos.bounty.noMore">
                  <i class="el-icon-loading"></i>
                </p>
                <p v-else-if="infos.bounty.noMore">noMore datas</p>
              </div>
              <!-- <div class="quest-pagination-box">
                <lordless-pagination
                  :scrollE="bountyPageScrollE"
                  :scrollOffset="150"
                  class="quest-pagination-pages"
                  :total="infos.bounty.total"
                  :currentPage="infos.bounty.pn"
                  :size="infos.bounty.ps"
                  theme="blue"
                  background
                  @currentChange="changePage($event, 'bounty')"/>
              </div> -->
            </div>
          </transition>
        </div>
        <div v-else-if="currentTab === 'reward'" class="mobile-quests-reward">
          <transition name="ld-hide-fade" mode="out-in" @after-enter="afterEnter">
            <mobile-reward-skeletion class="quest-cnt-box" v-if="loading && !infos.reward.total"/>
            <div
              v-else-if="!loading && !infos.reward.total"
              class="d-flex f-auto-center mobile-quests-empty mobile-bounty-empty">
              <div class="quests-empty-container">
                <p class="quests-empty-icon">
                  <svg>
                    <use xlink:href="#icon-no-candy"/>
                  </svg>
                </p>
                <p class="quests-empty-desc">You have no taverns now.</p>
                <div class="quests-empty-btns">
                  <lordless-btn class="quests-empty-btn" theme="blue" inverse shadow @click="$router.push('/market')">Buy a tavern</lordless-btn>
                </div>
              </div>
            </div>
            <div v-else ref="rewardQuestCnt" class="quest-cnt-box quest-item-content">
              <ul>
                <li
                  class="quest-item"
                  v-for="(reward, index) of infos.reward.list" :key="index">
                  <mobile-quest-reward
                    :info="reward"/>
                </li>
              </ul>
              <div class="text-center quest-item-loadmore">
                <p v-if="loading && !infos.reward.noMore">
                  <i class="el-icon-loading"></i>
                </p>
                <p v-else-if="infos.reward.noMore">noMore datas</p>
              </div>
              <!-- <div class="quest-pagination-box">
                <lordless-pagination
                  :scrollE="rewardPageScrollE"
                  :scrollOffset="150"
                  class="quest-pagination-pages"
                  :total="infos.reward.total"
                  :currentPage="infos.reward.pn"
                  :size="infos.reward.ps"
                  theme="blue"
                  background
                  @currentChange="changePage($event, 'reward')"/>
              </div> -->
            </div>
          </transition>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import MobileQuestBounty from '@/components/reuse/_mobile/card/quests/bounty'
import MobileQuestReward from '@/components/reuse/_mobile/card/quests/reward'

import MobileSortBar from '@/components/reuse/_mobile/sortBar'

import MobileBottomsUpSkeletion from '@/components/skeletion/_mobile/quests/bottomsUp'
import MobileBountySkeletion from '@/components/skeletion/_mobile/quests/bounty'
import MobileRewardSkeletion from '@/components/skeletion/_mobile/quests/reward'

import { getUserTasks } from 'api'
import { historyState } from 'utils/tool'

import { publicMixins } from '@/mixins'
export default {
  name: 'mobile-quest-content',
  mixins: [publicMixins],
  props: {
    type: {
      type: String,
      default: 'bottoms'
    }
  },
  data: (vm) => {
    return {
      popstateModel: false,
      tabFilters: {
        bottoms: 'candy',
        bounty: 'tasks',
        reward: 'lord'
      },

      // 当前 tab 区域,默认为地址栏参数
      currentTab: vm.$route.query.type || 'bottoms',

      // 上一个历史的 tab 区域
      prevTab: vm.$route.query.type || 'bottoms',

      loading: true,

      infos: {
        bottoms: {
          pn: 1,
          ps: 10,
          list: [],
          total: 0,
          more: true
        },
        bounty: {
          pn: 1,
          ps: 10,
          list: [],
          total: 0,
          more: true
        },
        reward: {
          pn: 1,
          ps: 10,
          list: [],
          total: 0,
          more: true
        }
      },

      // sortBar options
      bountyStatus: -2,
      bountyStatusFilters: {
        'all': -2,
        'under': 0,
        'approved': 1,
        'rejected': -1
      },
      bountySortItems: {
        'all': 'All',
        'under': 'Under way',
        'approved': 'Approved',
        'rejected': 'Rejected'
      },

      // scroll options
      scrollHandle: null
    }
  },
  computed: {
    bottomsPageScrollE () {
      return this.$refs.bottomsQuestCnt
    },
    bountyPageScrollE () {
      return this.$refs.bountyQuestCnt
    },
    rewardPageScrollE () {
      return this.$refs.rewardQuestCnt
    }
  },
  watch: {
    popstateModel (val) {
      if (val) {
        this.currentTab = this.$route.query.type || 'bottoms'
        this.popstateModel = false
      }
    },
    account () {
      this.initQuest()
    }
  },
  components: {
    MobileQuestReward,
    MobileQuestBounty,
    MobileSortBar,

    MobileBottomsUpSkeletion,
    MobileBountySkeletion,
    MobileRewardSkeletion
  },
  methods: {
    afterEnter () {
      console.log('afterEnter', this.currentTab)
      this.scrollListenerFunc()
    },

    // async changePage (page, type = 'bottoms') {
    //   console.log('changePage')
    //   if (page === this.infos[type].pn) return

    //   this.$set(this.infos[type], 'pn', page)
    //   this.$nextTick(async () => {
    //     const data = await this.getTasks(this.infos[type])
    //     data && this.$set(this.infos, type, data)
    //   })
    //   console.log('page', page, this.infos[type].pn)
    // },

    /**
     * bounty sort 事件
     */
    async bountySortChange (status) {
      this.bountyStatus = status
      const data = await this.getTasks({ status })
      data && this.$set(this.infos, this.currentTab, data)
    },

    /**
     * 根据 type 初始化 quest
     */
    async initQuest (type = this.currentTab) {
      const data = await this.getTasks(Object.assign({}, this.infos[type], { type }))
      data && this.$set(this.infos, type, data)
    },

    /**
     * choose tab
     */
    async chooseTab () {
      const _currentTab = this.currentTab
      if (this.prevTab === _currentTab) return

      // 切换 tab 之后，在数据还未修改之前，将之前tab的 scrollTop 进行存储
      const _prevTab = this.prevTab
      const _scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      console.log('chooseTab _scrollTop', _scrollTop)
      this.$set(this.infos[_prevTab], 'scrollTop', _scrollTop)

      // 将 scrollTop 复位 为0
      document.documentElement.scrollTop = 0

      historyState(`/owner/quest?type=${_currentTab}`)
      this.prevTab = _currentTab
      this.bountyStatus = -2

      // 切换tab之前，判断当前tab是否含有历史数据，如果有，就不请求
      if (!this.infos[_currentTab].total) {
        const data = await this.getTasks(this.infos[_currentTab])
        data && this.$set(this.infos, _currentTab, data)
      }

      // 如果切换 tab 之前，待切换 tab 数据已存在，重新绑定 scroll 事件
      this.$nextTick(async () => {
        if (this.infos[_currentTab].total) {
          this.scrollListenerFunc()
        }
      })
    },

    /**
     * 获取 task 基础事件
     */
    async getTasks ({ pn = this.infos[this.currentTab].pn, ps = this.infos[this.currentTab].ps, status = this.bountyStatus, type = this.currentTab } = {}) {
      // 根据选择器的key，过滤后端对应sort字符
      const _type = this.tabFilters[type]
      const _status = this.bountyStatusFilters[status]

      this.currentTab = type

      this.loading = true

      const params = { pn, ps, type: _type, status: _status }

      let data = null
      try {
        const res = await getUserTasks(params)
        if (res.code === 1000 && res.data) {
          data = res.data
        }
        this.loading = false
      } catch (err) {
        this.loading = false
      }

      return data
    },

    // 获取更多 tasks
    async loadMoreTasks (cb) {
      const currentTab = this.currentTab
      const info = this.infos[currentTab]
      const pn = info.pn + 1
      const { list, ps, total } = await this.getTasks({ pn })

      let noMore = false
      if (list && list.length < ps) {
        noMore = true
      }
      this.$set(this.infos, currentTab, Object.assign({}, info, {
        list: info.list.concat(list),
        pn,
        ps,
        total,
        noMore
      }))

      return cb && cb()
    },

    /**
     * scroll 监听事件
     */
    scrollListenerFunc ({ bool = false, bottom = 80, pHeight = document.body.offsetHeight } = {}) {
      this.scrollHandle && document.removeEventListener('scroll', this.scrollHandle)
      this.scrollHandle = null

      console.log(' --- scroll')
      const box = document.getElementById('mobile-quests-content-box')
      let bHeight = box.offsetHeight
      // 如果 bHeight 不存在或者 bHeight - bottom 小于 pHeight, return
      if (!bHeight || bHeight - bottom < pHeight) return

      const _currentTab = this.currentTab

      // 将 scrollTop 修改为当前 tab 的scrollTop值
      const _cScrollTop = this.infos[_currentTab].scrollTop || 0
      console.log('_cScrollTop', _cScrollTop)
      document.documentElement.scrollTop = _cScrollTop

      const handleFunc = () => {
        if (bool || this.infos[_currentTab].noMore) return
        if (!bHeight) bHeight = box.offsetHeight
        const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop

        // 如果页面上滑到达指定条件位置
        // 读取更多数据
        if (scrollTop + pHeight + bottom > bHeight) {
          bool = true
          this.loadMoreTasks(() => {
            this.$nextTick(() => {
              bool = false
              bHeight = box.offsetHeight
            })
          })
        }
      }
      handleFunc()

      this.scrollHandle = handleFunc

      this.$nextTick(() => {
        document.addEventListener('scroll', this.scrollHandle)
      })
    },

    questsTabFunc () {
      const questTabs = document.querySelector('.mobile-quests-tabs')
      document.body.appendChild(questTabs)
      this.$once('hook:beforeDestroy', () => {
        document.body.removeChild(questTabs)
      })
    },

    /**
     * window popstate 监听事件
     */
    popstateListener () {
      if (this.popstateModel) return
      this.popstateModel = true
    }
  },
  beforeDestroy () {
    window.removeEventListener('popstate', this.popstateListener)

    // remove scroll listener
    this.scrollHandle && document.removeEventListener('scroll', this.scrollHandle)
    this.scrollHandle = null
  },
  mounted () {
    this.questsTabFunc()
    // 监听 popstate 事件，主要用于 pushState 监听
    window.addEventListener('popstate', this.popstateListener)
    this.$nextTick(() => {
      const type = this.$route.query.type
      this.initQuest(type)
    })
  }
}
</script>

<style lang="scss" scoped>

.mobile-quests-box {
  padding-top: 44px;
}
.quest-cnt-box {
  padding: 24px 20px;
  box-sizing: border-box;
}
.mobile-quests-content-box {

}
.quest-item-content {
  // @include overflow();
  @include viewport-unit(min-height, 100vh, 112px);
}
.quest-item {
  box-shadow: 0 0 10px 3px rgba(200, 200, 200, .35);
  &:not(:first-of-type) {
    margin-top: 18px;
  }
}
.quest-item-loadmore {
  margin-top: 20px;
  font-size: 16px;
  color: #999;
}
.quest-tasks-content {
  padding-top: 59px;
  box-sizing: border-box;
}

/deep/ {
  .el-tabs__header {
    margin: 0;
    padding: 0 20px;
    height: 44px;
    line-height: 44px;
    background-color: #4586FC;
    color: #fff;
  }
  .el-tabs__active-bar {
    bottom: 5px;
    background-color: #fff;
  }
  .el-tabs__nav-wrap::after {
    bottom: 5px;
    background-color: transparent;
  }
  .el-tabs__item {
    font-family: $--font-TTNormsBold;
    font-size: 16px;
    color: #fff;
    &.is-active {
      color: #fff;
    }
  }
  .el-tabs__content {
    // padding: 0 20px;
  }
}

.tasks-sort-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.tasks-sort-title {
  margin-right: 15px;
  font-size: 16px;
  color: #999;
}
// .tasks-sort-bar {
//   margin-left: 12px;
// }

/**
 *  mobile-quests-empty -- begin
 */

 // 此处style可以和其他组件复用，eg：connect
.mobile-quests-empty {
  @include viewport-unit(min-height, 100vh, 112px);
}
.quests-empty-container {
  margin: 0 auto;
  max-width: 300px;
  font-size: 16px;
}
.quests-empty-icon {
  margin: 0 auto;
  width: 120px;
  height: 120px;
  line-height: 0;
  fill: #999;
}
.quests-empty-desc {
  margin-top: 12px;
  color: #999;
}
.quests-empty-btns {
  margin-top: 36px;
}
.quests-empty-btn {
  padding: 12px 0;
  width: 100%;
  &:not(:first-of-type) {
    margin-top: 12px;
  }
}
/**
 *  mobile-quests-empty -- end
 */

.quest-pagination-box {
  margin-top: 35px;
}
</style>
