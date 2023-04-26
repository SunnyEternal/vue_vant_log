<template>
  <div class="list-container">

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
    <van-tabs v-model="tabActive" class="completed-log" v-if="resData.length !== 0">
      <van-tab v-for="(item,i) in resData" :title="item.username" :key="i">
        <div v-if="item.list.length !== 0">
          <van-swipe-cell class="handle-btns" v-for="(obj, j) in item.list" :key="j">
            <van-cell-group>
              <div class="logBox">
                <div class="logTitle">
                  <h3>
                    <span class="code">{{obj.codeId}}</span> 
                    {{obj.title}}
                  </h3>
                  <span class="evaluate">{{obj.module}}</span>
                </div>
                <div class="logDetail">
                  <p>{{obj.detail}}</p>
                  <span class="time">{{obj.time}}</span>
                </div>
              </div>
            </van-cell-group>
          </van-swipe-cell>

          <van-field
            v-if="item.mark !== ''"
            v-model="item.mark"
            rows="1"
            autosize
            readonly
            :disabled="true"
            label="备注"
            type="textarea"
          />
        </div>
        
        <div v-show="item.list.length === 0">
          <van-empty class="empty1" description="没有日志记录" />
        </div>
      </van-tab>
      
    </van-tabs>
    <div v-if="resData.length === 0">
      <van-empty class="empty2" description="没有组员提交日志记录" />
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      addBtnVisible: true,
      username: '',
      date: this.$formatDate(),    // 默认日历显示当前日期，日历时间可修改
      currDate: this.$formatDate(),// 当前日期
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(),
      showCalendar: false,// 显示日历

      logList: [],        // 日志列表

      tabActive: 0,          // 

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

      // const datesBefore = this.getDatesBefore()
      // this.addBtnVisible = this.checkDateInArray(this.date, datesBefore)
      this.showCalendar = false;
    },
    // 获取历史日志
    getHistoryLogs() {
      // API 传 userId 和 date
      this.resData = [
        {
          username: 'feifei',
          list: [{
            codeId: 1294,
            detail: "添加的日志",
            module: "需求设计",
            time: 1,
            title: "【中安星云】数据安全平台##V1.7.0功能开发"
          },
          {
            codeId: 1299,
            detail: "项目进度正常",
            module: "功能开发",
            time: 1,
            title: "【中安星云】数据安全平台##V1.7.0功能开发"
          }],
          mark: "下午16点之后外出参加会议"
        },
        {
          username: '宋辉',
          list: [],
          mark: ""
        },
        {
          username: '嘟嘟',
          list: [{
            codeId: 1292,
            detail: "需求与操作逻辑有冲突，需要重新确定在继续",
            module: "需求设计",
            time: 1,
            title: "【中安星云】数据安全平台##V1.7.0功能开发"
          }],
          mark: ""
        },
        {
          username: '兰兰',
          list: [{
            codeId: 1391,
            detail: "突然增加的紧急任务，今天加班完成了",
            module: "需求设计",
            time: 12,
            title: "【中安星云】数据安全平台##V1.8.0需求设计"
          },
          {
            codeId: 1299,
            detail: "项目进度正常",
            module: "需求设计",
            time: 1,
            title: "【中安星云】数据安全平台##V1.7.0功能开发"
          },
          {
            codeId: 1294,
            detail: "延期",
            module: "需求设计",
            time: 3,
            title: "【中安星云】数据安全平台##V1.7.0功能开发"
          }],
          mark: "开了一天的会，下班后加班3小时完成的"
        },
        {
          username: 'Mia',
          list: [],
          mark: ""
        },
        {
          username: 'Amy',
          list: [],
          mark: ""
        },
        {
          username: '安迪',
          list: [{
            codeId: 1292,
            detail: "项目正常，完成了【创建用户】和【创建小组】功能开发",
            module: "功能开发",
            time: 8,
            title: "【中安星云】数据安全平台##V1.7.0功能开发"
          }],
          mark: ""
        }
      ]
    },
    // 切换日期，显示对应日期的日志
    getLogByDate(date) {
      if (date === this.$formatDate()) {
        this.getHistoryLogs()
      } else {
        this.resData = []
      }

      // let myO = this.resData.find((obj) => {
      //   let date1 = new Date(obj.date)
      //   let date2 = new Date(date)
      //   if (date1.getTime() === date2.getTime()) {
      //     return obj
      //   } else {
      //     this.addBtnVisible = false
      //     return null
      //   }
      // });
      // this.logList = myO ? myO.log.list : []
      // this.detail = myO ? myO.log.mark : ''

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
  }
  .empty2{
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
