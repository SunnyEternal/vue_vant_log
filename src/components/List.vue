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
    <div v-show="this.logList.length !== 0">
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

        <van-field
          v-if="detail !== ''"
          v-model="detail"
          rows="1"
          autosize
          readonly
          :disabled="true"
          label="备注"
          type="textarea"
        />
      </div>
    </div>
    
    <div v-show="this.logList.length === 0">
      <van-empty description="没有日志记录" />
      <div class="btn-group" v-show="addBtnVisible">
        <van-button icon="plus" type="info" size="small" plain block @click="addLogPage">添加事物</van-button>
      </div>
    </div>

    <!-- 底部导航 -->
    <div class="my-tabbar">
      <van-tabbar v-model="active" :placeholder="true" :safe-area-inset-bottom="true">
        <van-tabbar-item icon="records" to="/home">记录</van-tabbar-item>
        <van-tabbar-item icon="completed" to="/list">日志列表</van-tabbar-item>
        <van-tabbar-item icon="friends-o" to="/group">分组</van-tabbar-item>
        <van-tabbar-item icon="setting-o" to="/addTask">创建任务</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      finish: false,
      addBtnVisible: true,
      username: '',
      date: this.$formatDate(),    // 默认日历显示当前日期，日历时间可修改
      currDate: this.$formatDate(),// 当前日期
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(),
      showCalendar: false,// 显示日历

      logList: [],        // 日志列表

      active: 1,          // 底部导航

      detail: '',

      resData: [],           // 历史日志数据

    };
  },
  created() {
    this.username = localStorage.getItem('username')
    const myObjStr = localStorage.getItem('localLogs')
    const myObj = JSON.parse(myObjStr)
    this.logList = myObj.logs
    this.mark = myObj.mark
    
    // console.log(this.logList)

    this.getHistoryLogs()
  },
  methods: {
    // 退出
    onClickRight() {
      Toast('退出');
    },
    // 在日历上选择日期
    onConfirmDate(date) {
      this.date = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      this.getLogByDate(this.date)
      const datesBefore = this.getDatesBefore()
      console.log('this.date:', this.date, datesBefore)
      console.log(this.checkDateInArray(this.date, datesBefore))
      this.addBtnVisible = this.checkDateInArray(this.date, datesBefore)
      this.showCalendar = false;
    },
    // 获取历史日志
    getHistoryLogs() {
      this.resData = [
        {
          date: '2023/04/07',
          log: {
            list: [],
            mark: ''
          },
          edit: false
        },
        {
          date: '2023/04/08',
          log: {
            list: [],
            mark: ''
          },
          edit: true
        },
        {
          date: '2023/04/09',
          log: {
            list: [],
            mark: ''
          },
          edit: true
        },
        {
          date: '2023/04/10',
          log: {
            list: [{
              codeId: 1294,
              detail: "4月10日添加的日志",
              id: 1,
              module: "需求设计",
              time: 1,
              title: "【中安星云】数据安全平台##V1.7.0功能开发"
            },
            {
              codeId: 1299,
              detail: "4月10日添加的日志",
              id: 2,
              module: "功能开发",
              time: 1,
              title: "【中安星云】数据安全平台##V1.7.0功能开发"
            }],
            mark: "下午16点之后外出参加会议",
          },
          edit: true
        },
        {
          date: '2023/04/11',
          log: {
            list: [],
            mark: ''
          },
          edit: true
        },
        {
          date: '2023/04/12',
          log: {
            list: [],
            mark: ''
          },
          edit: true
        },
        {
          date: '2023/04/13',
          log: {
            list: [{
              codeId: 1294,
              detail: "4月13日添加的日志",
              id: 3,
              module: "需求设计",
              time: 1,
              title: "【中安星云】数据安全平台##V1.7.0功能开发"
            },
            {
              codeId: 1299,
              detail: "4月13日添加的日志",
              id: 4,
              module: "功能开发",
              time: 1,
              title: "【中安星云】数据安全平台##V1.7.0功能开发"
            }],
            mark: "下午16点之后外出参加会议",
          },
          edit: true
        },
        {
          date: '2023/04/14',
          log: {
            list: [{
              codeId: 9999,
              detail: "4月14日添加的日志",
              id: 5,
              module: "需求设计",
              time: 1,
              title: "【中安星云】数据安全平台##V1.7.0功能开发"
            },
            {
              codeId: 1299,
              detail: "4月14日添加的日志",
              id: 6,
              module: "功能开发",
              time: 1,
              title: "【中安星云】数据安全平台##V1.7.0功能开发"
            }],
            mark: "下午16点之后外出参加会议"
          },
          edit: true
        }]

        const getLastItem = (arr) => {
          return arr[arr.length - 1];
        };

        const lastObj = getLastItem(this.resData)

        this.logList = lastObj ? lastObj.log.list : []
        this.detail = lastObj ? lastObj.log.mark : ''
        // console.log('logList:', this.logList)

    },
    // 切换日期，显示对应日期的日志
    getLogByDate(date) {
      // 1. 传参日期
      // 2. 根据日期调接口获得数据
      //    - 一周内的日志可修改
      //    - 超出一周的禁止修改
      // console.log('日期：', this.date)
      // this.logList = this.data.

      // const currentDate = new Date();
      // const currentMonth = currentDate.getMonth() + 1;
      // const changeMonth = date.split('/')[1]
      console.log('date:', date)
      // console.log('date:', currentMonth, changeMonth)
      // console.log(currentMonth === changeMonth)

      // 先判断当前月份，然后获取该月份的所有日子
      // if (currentMonth === changeMonth) { // 月份
      // if (true) {
        let myO = this.resData.find((obj) => {
          let date1 = new Date(obj.date)
          let date2 = new Date(date)
          console.log(date1.getTime() === date2.getTime())
          if (date1.getTime() === date2.getTime()) {
            return obj
          } else {
            this.addBtnVisible = false
            return null
          }
        });
        this.logList = myO ? myO.log.list : []
        this.detail = myO ? myO.log.mark : ''
        console.log('logList:', this.logList)
      // }

    },

    // 跳转到写日志页面
    addLogPage() {
      this.$router.push({
        path: '/home',
        query: {
          edit: true,
          date: this.date
        }
      })
    },

    // 校验，查看的日期没有写日志，但超过7天了，不能在添加，也就是没有【添加事物】按钮
    // 如果是当前月份，那日期比今天小 6 天（包含6）的，显示【添加事物】按钮
    // 如果是前一个月份
    
    // 一周内的日期，包括今天
    // ! 日期有两种 2023/04/12 和 2023/4/12，方法写的强壮点！！！
    getDatesBefore() {
      const datesBefore = [];
      const currentDate = new Date();

      for (let i = 1; i <= 6; i++) {
        const date = new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000);
        // const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`; // ! 不要删，好好学下
        const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString()}/${date.getDate().toString()}`;
        datesBefore.push(formattedDate);
      }

      return datesBefore;
    },

    checkDateInArray(date, arr) {
      const index = arr.findIndex(item => item === date);
      return index !== -1;
    },

  }
}
</script>

<style lang='less'>
.list-container{
  background: rgb(246, 247, 247);
  .van-empty{
    background-color: #fff;
    margin-top: 10px;
  }
}
.completed-log{
  margin-top: 10px;
  // .van-field--disabled .van-field__label, .van-field__control:disabled {
  .van-field--disabled .van-field__label{
    color: #323233;
  }
}
// .van-field__control:disabled{
//   color: #323233!important;
// } //!不生效

.btn-group{
  padding: 20px 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  background-color: #fff;
}

.my-tabbar .van-tabbar__placeholder {
  background-color: #fff;
}
</style>
