<template>
  <div class="list-container">
    <!-- 导航 -->
    <van-nav-bar title="研发部工作日志" stop-circle-o @click-right="onClickRight">
      <template #right>
        <van-icon name="stop-circle-o" size="18" />
      </template>
    </van-nav-bar>

    <!-- :show-confirm="false" 日历有快捷选择 -->
    <!-- 展示区 -->
    <div class="handler-field">
      <div class="flex-cont">
        <van-field readonly :label="username" :border="false" />
        <van-field
          readonly
          clickable
          name="calendar"
          :value="date"
          label="日历"
          @click="showCalendar = true"
        />
      </div>
      
      <van-calendar v-model="showCalendar" @confirm="onConfirmDate" color="#1989fa" :min-date="minDate" :max-date="maxDate" />
    </div>

    <!-- 日志列表 -->
    <div class="completed-log">
      <van-swipe-cell class="handle-btns" v-for="(item) in logList" :key="item.id">
        <van-cell-group>
          <div class="logBox">
            <div class="logTitle">
              <h3>
                <span class="code">{{item.codeId}}</span> 
                {{item.title}}
              </h3>
              <span class="evaluate">{{item.module}}</span>
            </div>
            <div class="logDetail">
              <p>{{item.detail}}</p>
              <span class="time">{{item.time}}</span>
            </div>
          </div>
        </van-cell-group>
      </van-swipe-cell>
    </div>

    <!-- 底部导航 -->
    <div>
      <van-tabbar v-model="active">
        <van-tabbar-item icon="records" to="/home">记录</van-tabbar-item>
        <van-tabbar-item icon="completed" to="/list">日志列表</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '刘飞飞',
      date: this.$formatDate(),    // 默认日历显示当前日期，日历时间可修改
      currDate: this.$formatDate(),// 当前日期
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(),
      showCalendar: false,// 显示日历

      logList: [],        // 日志列表

      active: 1,          // 底部导航

    };
  },
  created() {
    const myObjStr = localStorage.getItem('localLogs')
    const myObj = JSON.parse(myObjStr)
    this.logList = myObj.logs
    this.mark = myObj.mark
    console.log(this.logList)
  },
  methods: {
    // 退出
    onClickRight() {
      Toast('退出');
    },
    // 在日历上选择日期
    onConfirmDate(date) {
      this.date = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      this.getLogByDate()
      this.showCalendar = false;
    },
    // 切换日期，显示对应日期的日志
    getLogByDate() {
      // 1. 传参日期
      // 2. 根据日期调接口获得数据
      //    - 一周内的日志可修改
      //    - 超出一周的禁止修改
      console.log('日期：', this.date)

      // if () {

      // }

    }
  }
}
</script>

<style lang='less'>
.list-container{
  background: rgb(246, 247, 247);
}
.completed-log{
  margin-top: 10px;
}
</style>
