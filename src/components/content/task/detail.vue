<template>
  <div class="relative">
    <transition name="ld-suspension-hide-fade">
      <div v-if="loading" class="ld-task-skeletion">
        <div class="d-flex col-flex f-auto-center task-skeletion-header">
          <div class="skeletion-header-container skeletion-breath">
            <h2></h2>
            <div class="d-flex f-align-center">
              <p></p>
              <div>
                <p></p>
                <p></p>
              </div>
            </div>
          </div>
        </div>
        <div class="task-skeletion-cnt skeletion-breath">
          <h1></h1>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <div class="d-flex">
            <div>
              <p></p>
              <p></p>
            </div>
            <div class="v-flex">
              <p></p>
              <p></p>
            </div>
            <div class="v-flex">
              <p></p>
              <p></p>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="ld-hide-fade">
      <div v-if="!loading && taskInfo" class="ld-task-box" :class="{ 'dialog': dialog }">
        <div class="d-flex f-auto-center task-detail-header">
          <div class="detail-header-cnt">
            <h2>{{ taskInfo.reward.candy.symbol }} Task Announcement</h2>
            <div class="d-flex f-align-center header-cnt-desc">
              <div class="inline-block header-coin-svg">
                <svg>
                  <use :xlink:href="`#coin-${taskInfo.reward.candy.symbol.toLowerCase()}`"/>
                </svg>
              </div>
              <div class="v-flex inline-block header-coin-desc">
                <p>{{ taskInfo.reward.candy.desc }}</p>
                <a class="coin-href hover-underline" :href="taskInfo.reward.candy.website" target="_blank">{{ taskInfo.reward.candy.website }}</a>
              </div>
            </div>
          </div>
        </div>
        <div class="task-detail-cnt">
          <div class="container md">
            <div class="task-status-box">
              <div class="task-cnt-section task-status-top">
                <span class="status-top-bg">
                  <svg>
                    <use :xlink:href="`#icon-task-status-${taskInfo.status}`"/>
                  </svg>
                </span>
                <h1 v-if="taskInfo.ldbTaskType.taskType === 2"><link-symbol :href="taskInfo.ldbTaskType.url" target="_blank">{{ taskInfo.ldbTaskType.name }}</link-symbol></h1>
                <h1 v-else>{{ taskInfo.ldbTaskType.name }}</h1>
                <p class="d-flex f-align-center task-status-serial">
                  <span>#{{ taskInfo._id }}</span>
                  <span class="inline-block">·</span>
                  <span v-if="taskInfo.status === 0">Under way</span>
                  <span v-else-if="taskInfo.status === 1">Completed</span>
                  <span v-else>Over Due</span>
                </p>
                <p>
                  <span>Task detail</span>
                  <span class="task-tip" v-if="taskInfo.ldbTaskType.taskType === 1">Daily</span>
                  <span class="task-tip" v-if="taskInfo.ldbTaskType.taskType !== 1">Telegram</span>
                </p>
                <p class="TTFontNormal">{{ taskInfo.ldbTaskType.desc }}</p>
                <div class="task-status-cnt">
                  <lordless-btn
                    v-if="taskInfo.status === 0 && owner"
                    class="TTFontBolder task-start-btn"
                    @click="startTask">
                    Getting started
                  </lordless-btn>
                  <h3 v-if="taskInfo.status !== 0" class="d-flex f-align-center">
                    <span class="inline-block line-height-0">
                      <svg>
                        <use xlink:href="#icon-bell"/>
                      </svg>
                    </span>
                    <span v-if="!owner && taskInfo.status !== 1">Remaining.</span>
                    <span v-else-if="taskInfo.status === 1">Congratulations.</span>
                    <span v-else>Task has been over due.</span>
                  </h3>
                </div>
              </div>
              <div class="d-flex sm-col-flex task-cnt-section task-status-bottom">
                <div class="v-flex task-status-date task-status-remaining">
                  <p v-if="taskInfo.status === 0">Time remaining</p>
                  <p v-else-if="taskInfo.status === 1">Completed on</p>
                  <p v-else>Over due on</p>
                  <countdown v-if="taskInfo.status === 0" class="task-status-time" :time="new Date(taskInfo.entAt) - new Date()" :interval="1000" tag="p">
                    <template slot-scope="props">{{ parseInt(props.days) }}d : {{ props.hours }}h : {{ props.minutes }}m : {{ props.seconds }}s</template>
                  </countdown>
                  <p v-else>{{ taskInfo.update_at | dateFormat }}</p>
                </div>
                <div class="task-status-date">
                  <p>Create on</p>
                  <p>{{ new Date(taskInfo.created_at) | dateFormat }}</p>
                </div>
                <div class="task-status-date">
                  <p>Due on</p>
                  <p>{{ new Date(taskInfo.entAt) | dateFormat }}</p>
                </div>
              </div>
            </div>
            <div class="task-cnt-section task-rewards-box">
              <h1>Rewards</h1>
              <p class="TTFontBolder">If the swordman wants to claim candy or get rewards of the task from the Tavern, you need to battle with the LORD. The final reward is  based on the result of the battle.</p>
              <div class="d-flex f-justify-between sm-col-flex text-center rewards-cards-box">
                <span class="rewards-vs-svg sm-hidden">
                  <svg>
                    <use xlink:href="#icon-gradient-vs"/>
                  </svg>
                </span>
                <div class="v-flex rewards-cards-item rewards-cards-left">
                  <div class="d-flex f-align-center rewards-small-card blue">
                    <div class="v-flex">
                      <p>Total <span class="text-upper">{{ taskInfo.reward.candy.symbol }}</span> reward</p>
                      <p>{{ taskInfo.reward.count | formatDecimal({ len: 8 }) }}</p>
                    </div>
                    <div class="v-flex">
                      <p>Action point cost</p>
                      <p>{{ taskInfo.apCost }}</p>
                    </div>
                  </div>
                  <div class="rewards-big-card red">
                    <div class="big-card-top">
                      <span class="big-card-svg">
                        <svg>
                          <use xlink:href="#icon-sword"/>
                        </svg>
                      </span>
                      <div class="card-top-cnt">
                        <div class="rewards-user-avatar">
                          <lordless-blockies
                            jump
                            :scale="12"
                            theme="light"
                            :seed="taskInfo.executor.info">
                          </lordless-blockies>
                        </div>
                        <p>Swordsman</p>
                        <p><link-symbol :to="taskInfo.executor.info">{{ taskInfo.executor.info | splitAddress }}</link-symbol></p>
                        <div class="card-user-level">
                          <p class="text-upper">LEVEL {{ taskInfo.executor.level }}</p>
                          <strong>{{ taskInfo.executor.reward.percentage | formatDecimal({ len: 3, percentage: true }) }}<span>%</span></strong>
                        </div>
                      </div>
                    </div>
                    <div class="big-card-bottom">
                      <p class="text-upper">{{ taskInfo.reward.candy.symbol }}</p>
                      <h1>+{{ taskInfo.executor.reward.count | formatDecimal({ len: 6 }) }}</h1>
                      <p>Prestige</p>
                      <h1>+{{ taskInfo.executor.activeness }}</h1>
                    </div>
                  </div>
                </div>
                <div class="sm-mar-t5 v-flex rewards-cards-item rewards-cards-right">
                  <div class="rewards-big-card yellow">
                    <div class="big-card-top">
                      <span class="big-card-svg crown">
                        <svg>
                          <use xlink:href="#icon-crown"/>
                        </svg>
                      </span>
                      <div class="card-top-cnt">
                        <div class="rewards-user-avatar">
                          <lordless-blockies
                            jump
                            :scale="12"
                            theme="light"
                            :seed="taskInfo.lord.info">
                          </lordless-blockies>
                        </div>
                        <p>LORD</p>
                        <p><link-symbol :to="taskInfo.lord.info">{{ taskInfo.lord.info | splitAddress }}</link-symbol></p>
                        <div class="card-user-level">
                          <p class="text-upper">LEVEL {{ taskInfo.lord.level }}</p>
                          <strong>{{ taskInfo.lord.reward.percentage | formatDecimal({ len: 3, percentage: true }) }}<span>%</span></strong>
                        </div>
                      </div>
                    </div>
                    <div class="big-card-bottom">
                      <p class="text-upper">{{ taskInfo.reward.candy.symbol }}</p>
                      <h1>+{{ taskInfo.lord.reward.count | formatDecimal({ len: 6 }) }}</h1>
                      <p>Prestige</p>
                      <h1>+{{ taskInfo.lord.activeness }}</h1>
                    </div>
                  </div>
                  <div class="rewards-small-card blue">
                    <p>Related Tavern</p>
                    <p>+{{ taskInfo.ldb.activeness }} ac.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getTaskById } from 'api'
import { mapState } from 'vuex'
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      loading: true,
      taskInfo: null
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),
    owner () {
      return this.userInfo && this.userInfo._id === this.taskInfo.executor.info
    }
  },
  methods: {
    /**
     * 初始化组件
     */
    init (taskId) {
      this.getTaskInfo({ taskId })
    },
    async getTaskInfo ({ taskId = this.taskId } = {}) {
      this.loading = true
      const res = await getTaskById({ taskId })
      if (res.code === 1000 && res.data) {
        this.taskInfo = res.data
      }
      console.log('--get task Info', taskId)
      this.$nextTick(() => {
        this.loading = false
      })
    },
    async startTask (taskInfo = this.taskInfo) {
      console.log('taskInfo', taskInfo)
      window.open(taskInfo.ldbTaskType.url)
    },
    destory () {
      this.taskInfo = null
      this.loading = true
    }
  },
  beforeDestroy () {
    this.destory()
  }
}
</script>

<style lang="scss" scoped>
  /**
   *  ld-task-skeletion
   */
  .ld-task-skeletion {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    background-color: $--skeletion-light;
    border-radius: 10px;
    overflow: hidden;
  }
  .task-skeletion-header {
    @include padding('top', 180px, 1.2);
    @include padding('bottom', 100px, 1.2);
  }
  .skeletion-header-container {
    >h2 {
      margin: 0 auto;
      width: 300px;
      height: 40px;
      background-color: $--skeletion-dark;
    }
    >div {
      margin-top: 20px;
      >p {
        width: 100px;
        height: 100px;
        border-radius: 10px;
        background-color: $--skeletion-dark;
      }
      >div {
        margin-left: 20px;
        >p {
          width: 150px;
          height: 20px;
          background-color: $--skeletion-dark;
          &:nth-of-type(2) {
            margin-top: 15px;
          }
        }
      }
    }
  }
  .task-skeletion-cnt {
    @include padding-around(50px, 74px, 0, 74px, -2);
    @include padding-around(25px, 20px, 0, 20px, 1, -2);
    >h1 {
      width: 400px;
      height: 50px;
      background-color: $--skeletion-dark;
    }
    >p {
      background-color: $--skeletion-dark;
      &:nth-of-type(1) {
        margin-top: 15px;
        height: 25px;
      }
      &:nth-of-type(2) {
        margin-top: 20px;
        height: 20px;
      }
      &:nth-of-type(3) {
        margin-top: 15px;
        height: 20px;
      }
      &:nth-of-type(4) {
        margin-top: 20px;
        width: 150px;
        height: 45px;
        border-radius: 5px;
      }
    }
    >div {
      padding-top: 40px;
      padding-bottom: 40px;
      >div {
        &:nth-of-type(1) {
          width: 100%;
          max-width: 300px;
        }
        &:not(:first-of-type) {
          margin-left: 35px;
        }
        >p {
          height: 25px;
          background-color: $--skeletion-dark;
          &:nth-of-type(1) {
            width: 100px;
          }
          &:nth-of-type(2) {
            margin-top: 20px;
            width: 200px;
          }
        }
      }
    }
  }

  // ld-task-box
  .ld-task-box {
    background-color: #f2f2f2;
    @include padding('bottom', 50px, 1);
    h1 {
      font-size: 36px;
    }
    h2 {
      font-size: 30px;
    }
    h3 {
      font-size: 24px;
    }
    &.dialog {
      padding-bottom: 0;
      border-radius: 5px;
      .task-detail-header {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }
      .task-status-box {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
      .task-rewards-box {
        margin-top: 0;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
      .task-status-bottom {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }

  .task-cnt-section {
    @include padding-around(50px, 74px, 0, 74px, -2);
    @include padding-around(25px, 20px, 0, 20px, 1, -2);
  }

  /**
   *  task-detail-header  -- begin
   */

  .task-detail-header {
    color: #fff;
    background-image: linear-gradient(45deg, #F46AA0, #FFB397);
    @include padding('top', 180px, 1.2);
    @include padding('bottom', 180px, 1.2);
    @include padding('left', 20px, 1, -2);
    @include padding('right', 20px, 1, -2);
  }
  .header-cnt-desc {
    width: 100%;
    max-width: 450px;
    @include margin('top', 20px, 1);
  }
  .header-coin-svg {
    fill: #fff;
    border-radius: 10px;
    background-image: linear-gradient(45deg, #16222A, #3A6073);
    @include width(100px, 1.2);
    @include height(100px, 1.2);
    @include padding(-1, 22px, 1.2);
  }
  .header-coin-desc {
    margin-left: 15px;
    @include fontSize(18px, 1.2);
    >a {
      display: inline-block;
      color: #fff;
    }
  }
  .coin-href {
    margin-top: 10px;
    font-size: 16px;
  }

  /**
   *  task-detail-header  -- end
   */

  .task-detail-cnt {
    margin-top: -80px;
  }

  /**
   *  task-status-box  -- begin
   */
  .task-status-box {
    color: #fff;
    border-radius: 5px;
    background-color: $--text-blue-color;
    box-shadow: 0 2px 15px 0 #4586FC;
  }
  .task-tip {
    display: inline-block;
    padding: 4px 6px;
    font-size: 12px;
    color: #fff;
    background-color: $--text-deep-blue-color;
    border-radius: 5px;
    @include margin('left', 5px, 1);
  }

  // task-status-top
  .task-status-top {
    position: relative;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    overflow: hidden;
    @include padding('bottom', 35px, 1);
    >p {
      font-size: 16px;
      &:nth-of-type(2) {
        color: #ddd;
        @include margin('top', 24px, 1);
      }
      &:nth-of-type(3) {
        @include margin('top', 10px, 1);
      }
    }
  }
  .status-top-bg {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 100%;
    z-index: 0;
    >svg {
      width: 150%;
      height: 150%;
      fill: rgba(255, 255, 255, .2);
      transform: rotate(45deg) translateX(-50%);
      transform-origin: 25% 100%;
    }
  }
  .task-status-serial {
    @include margin('top', 10px, 1);
    >span {
      &:nth-of-type(1) {
        font-size: 24px;
        font-weight: 500;
        color: #ddd;
      }
      &:nth-of-type(2) {
        line-height: 0;
        font-size: 54px;
        @include margin('left', 5px, 1);
        @include margin('right', 5px, 1);
      }
      &:nth-of-type(3) {
        font-size: 16px;
      }
    }
  }
  .task-status-cnt {
    margin-top: 20px;
    color: #fff;
    svg {
      margin-right: 10px;
      width: 24px;
      height: 24px;
      fill: #fff;
    }
    >h3 {
      padding-top: 15px;
    }
  }
  .task-start-btn {
    padding: 10px 15px;
    font-size: 18px;
    color: $--text-blue-color;
    box-shadow: 2.5px 5px 10px 0 rgba(255, 255, 255, .25);
  }

  // task-status-bottom

  .task-status-bottom {
    padding-top: 30px;
    padding-bottom: 30px;
    background-color: rgba(0, 170, 255, 0.5);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    box-shadow: 0px 2px 5px 0 rgba(0, 0, 0, .25) inset;
  }
  .task-status-remaining {
    >p {
      font-size: 16px;
      @include margin('bottom', 10px, 1);
    }
    .task-status-time {
      font-size: 24px;
    }
  }
  .task-status-date {
    @include margin('top', 20px, 1, -2);
    &:not(.task-status-remaining) {
      @include margin('left', 30px, -2);
    }
    >p {
      &:nth-of-type(1) {
        font-size: 16px;
      }
      &:nth-of-type(2) {
        font-size: 18px;
        @include margin('top', 10px, 1);
      }
    }
  }
  /**
   *  task-status-box  -- end
   */

  /**
   *  task-rewards-box  -- end
   */
  .task-rewards-box {
    background-color: #fff;
    color: #777;
    border-radius: 5px;
    box-shadow: 0px 2px 10px 0 rgba(0, 0, 0, .15);
    @include margin('top', 100px, 1);
    @include padding('bottom', 80px, 1);
    >p {
      color: #999;
      font-size: 16px;
      @include margin('top', 40px, 1);
    }
  }

  .rewards-cards-left {
    @include margin('right', 35px, -2);
    .rewards-big-card {
      @include margin('top', 24px, 1);
    }
  }
  .rewards-cards-right {
    @include margin('left', 35px, -2);
    .rewards-small-card {
      @include margin('top', 24px, 1);
    }
  }

  .rewards-cards-box {
    position: relative;
    @include margin('top', 65px, 1);
  }

  .rewards-vs-svg {
    width: 300px;
    height: 280px;

    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-5deg);
    z-index: 1;
  }

  .rewards-small-card {
    padding-top: 19px;
    padding-bottom: 19px;
    font-family: $--font-TTNormsMedium;
    color: #fff;
    border-radius: 5px;
    box-shadow: 0px 2px 10px 0 rgba(0, 0, 0, .25);
    >p {
      &:nth-of-type(1) {
        font-size: 18px;
      }
      &:nth-of-type(2) {
        margin-top: 5px;
        font-size: 24px;
      }
    }
    >div {
      >p {
        &:nth-of-type(1) {
        font-size: 16px;
        }
        &:nth-of-type(2) {
          margin-top: 5px;
          font-size: 24px;
        }
      }
    }
    &.blue {
      background-color: $--text-blue-color;
    }
    &.green {
      background-color: $--text-green-color;
    }
  }

  .rewards-big-card {
    font-family: $--font-TTNormsMedium;
    border-radius: 5px;
    box-shadow: 0px 2px 20px 0 rgba(0, 0, 0, .35);
    // @include padding('top', 48px, 1);
    // @include padding('bottom', 15px, 1);
    &.red {
      color: #fff;
      background-color: $--text-red-color;
    }
    &.yellow {
      color: #555;
      background-color: $--text-yellow-color;
    }
  }
  .big-card-top {
    position: relative;
    @include padding('top', 48px, 1);
    @include padding('bottom', 15px, 1);
    >p {
      &:nth-of-type(1) {
        font-size: 18px;
      }
      &:nth-of-type(2) {
        font-size: 16px;
        @include margin('top', 5px, 1);
      }
    }
  }
  .card-top-cnt {
    position: relative;
    z-index: 1;
  }
  .big-card-svg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    fill: rgba(0, 0, 0, .1);
    >svg {
      position: relative;
      left: -15%;
      top: 0;
      width: 120%;
      height: 120%;
    }
    &.crown {
      fill: rgba(255, 255, 255, .2);
      >svg {
        left: -20%;
        transform: rotate(45deg);
      }
    }
  }
  .rewards-user-avatar {
    @include margin('bottom', 15px, 1);
  }

  .card-user-level {
    @include margin('top', 25px, 1);
    >p {
      font-family: $--font-TTNormsBold;
      font-size: 20px;
    }
    >strong {
      font-family: $--font-TTNormsBlack;
      @include fontSize(72px, 1.2);
      >span {
        font-family: $--font-TTNormsBold;
        @include fontSize(36px, 1.2);
      }
    }
  }

  .big-card-bottom {
    box-shadow: 0px 2px 5px 0 rgba(0, 0, 0, .25) inset;
    @include padding('top', 35px, 1);
    @include padding('bottom', 35px, 1);
    >p {
      font-family: $--font-TTNormsMedium;
      @include fontSize(20px, 1);
    }
  }


  /**
   *  task-rewards-box -- end
   */


</style>
