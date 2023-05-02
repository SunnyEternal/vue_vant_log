<template>
  <div class="home-container">

    <!-- 展示区 -->
    <!-- :show-confirm="false" 日历有快捷选择 -->
    <div class="handle-field">
      <div class="flex-cont">
        <van-field readonly :label="username" :border="false" />
        <van-field
          readonly
          clickable
          name="calendar"
          :value="date"
          label=""
          @click="showCalendar = true"
        />
      </div>
      
      <van-calendar v-model="showCalendar" @confirm="onConfirmDate" color="#1989fa" :min-date="minDate" :max-date="maxDate" :formatter="formatter" />
    </div>

    <!-- <div v-show="!finish"> -->
    <div>
      <!-- 写好的日志 --> 
      <div class="completed-log" v-show="!noData">
        <van-swipe-cell class="handle-btns" :class="[item.id === editId && isEdit ? 'higlight' : '' ]" v-for="(item, i) in logList" :key="i">
          <van-cell-group @click="editLogFun(item)">
            <div class="logBox">
              <div class="logTitle">
                <h3>
                  <span class="code">{{item.codeId}}</span> 
                  {{item.title}}
                </h3>
                <span class="evaluate">{{item.type}}</span>
              </div>
              <div class="logDetail">
                <p>{{item.detail}}</p>
                <span class="time">{{item.time}}</span>
              </div>
            </div>
          </van-cell-group>
          <template #right>
            <van-button square type="danger" text="删除" @click="deleteLogFun(item.id)" />
          </template>
        </van-swipe-cell>
         <van-field
          v-show="!showSubmitBtn"
          v-model="mark"
          readonly
          rows="1"
          autosize
          label="备注"
          type="textarea"
          placeholder="今日未处理开发工作"
        />
      </div>

      

      <!-- 操作区 -->
      <!-- <div class="btn-group" v-show="addBtnVisible">
        <van-button icon="plus" type="info" size="small" plain block @click="handleBtnFun">添加事务</van-button>
      </div> -->

      <div class="handle-mark" >
        
        <van-field
          v-show="showSubmitBtn"
          v-model="mark"
          rows="1"
          autosize
          label="备注"
          type="textarea"
          placeholder="今日未处理开发工作"
        />
        <div v-show="noData" style="display: flex; justify-content: center; margin-top: 10px;
    background: #fff; padding-top: 30px; padding-bottom: 10px">
          <p>{{defaultText}}</p>
        </div>
        <div class="btn-group" v-show="showSubmitBtn">
          <van-button type="info" block @click="submitLogFun">提 交</van-button>
        </div>
        
      </div>
    </div>

    <!-- 7天内日志提交情况 -->
    <div class="tag-group">
      <div style="display: inline-block;" v-for="(tagObj, k) in weekLogs.sevenDayLog" :key="k">
        <van-tag v-if="!tagObj.todo" type="warning" round size="large" @click="quickDate(tagObj.day)">
          {{tagObj.day}}日{{tagObj.text}}
        </van-tag>
         <van-tag v-else type="success" round size="large">
          {{tagObj.day}}日{{tagObj.text}}
        </van-tag>
      </div>
    </div>

    <!-- <button @click="sentMain">发给 Main 组件</button> -->

  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import _ from 'lodash';

export default {
  props: {
    isEdit: {
      type: Boolean,
      required: true
    },
    addData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      finish: false,
      username: '',
      date: this.$formatDate(),    // 默认日历显示当前日期，日历时间可修改
      minDate: new Date(this.$sixDays()),
      maxDate: new Date(),
      showCalendar: false,

      value: 1,

      mark: '',

      logList: [],      // 已写好的所有日志
      addBtnVisible: false,// 是否显示添加【事物按钮】

      weekLogs: {
        month: 1,
        sevenDayLog: []
      },
      // isEdit: false,
      editId: 0,

      noData: false,
      defaultText: '点击 ➕ 号开始记录',

      showSubmitBtn: false,
    };
  },
  created() {
    this.username = localStorage.getItem('username')

    // todo：1. 获取7天内日志提交情况，如果当天没提交，显示7天内没提交的【日期 tag 】，如果当天的提交了，显示当天的，并展示未提交的【日期 tag】。
    // todo：2. 如果当天提交日志了，获取并展示。 this.getDayLog()

    this.getDayLog()

    this.showSubmitBtn = localStorage.getItem('showSubmitBtn') ? JSON.parse(localStorage.getItem('showSubmitBtn')) : false

    let list = localStorage.getItem('logList')
    if (list && list !== 'undefined') {
      this.noData = false
      this.logList = JSON.parse(list)
    } else {
      if (typeof(list) === 'string') {
        localStorage.removeItem('logList')
      }
      // 还没有添加日志记录
      this.noData = true
      this.logList = []
    }
      

    

    this.getSevenDayDate()

  },
  watch: {
    // isEdit: function(val) {
    //   console.log(val);   // 接收父组件的值
    //   // 编辑 log
    //   if (val) {
    //     this.updateInfoById()
    //   }
    // },
    addData: {
      handler(newVal, oldVal) {
        console.log('addData changed!', newVal);
        console.log('isEdit:', this.isEdit)
        if (this.isEdit) {
          this.updateInfoById(this.addData)
        } else {
          // 添加 log
          let storeData = localStorage.getItem('logList') ? JSON.parse(localStorage.getItem('logList')) : []
          storeData.push(newVal)
          storeData = this.setId(storeData)
          localStorage.setItem('logList', JSON.stringify(storeData))

          this.logList = storeData
        }
        
      },
      deep: true
    },
  },
  methods: {
    sentMain() {
      this.$emit('getMessage', "传值给父组件")
    },
    updateInfoById(obj) {
      
      const editData = JSON.parse(localStorage.getItem('editData'))
      const editId = editData.id
      let logList = JSON.parse(localStorage.getItem('logList'))

      let temp = []

      temp = logList.map(item => {
        if (item.id === editId) {
          item.time = obj.time
          item.detail = obj.detail
          item.type = obj.type
          item.codeId = obj.codeId
          item.title = obj.title
        }
        return item
      })
      localStorage.setItem('showSubmitBtn', true)
      localStorage.setItem('logList', JSON.stringify(temp))
      this.logList = temp
    },

    // 工具 为数组中每个对象添加 id
    setId(arr) {
      return arr = arr.map((item, index) => {
        return {
          ...item,
          id: index + 1
        }
      })
    },

    // 在日历上选择日期
    onConfirmDate(date) {
      this.date = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      // const currDay = Number(this.date.split('/')[2])
      // console.log(currDay, this.date) // ! 注意字符串 和 数字 间的转换

      // const foundArr =  this.weekLogs.sevenDayLog.filter((obj) => obj.day === currDay);
      // this.finish = foundArr.length != 0 ? foundArr[0].todo : false
      
      this.showCalendar = false;
    },
    // 在日期上显示日志提交情况 // ! html 里没有传 day，但是方法里怎么可以用呢？
    formatter(day) {
      const month = day.date.getMonth() + 1;
      const date = `${day.date.getFullYear()}/${day.date.getMonth() + 1}/${day.date.getDate()}`;

      if(this.weekLogs.month === month) {
        this.weekLogs.sevenDayLog.forEach((item) => {
          if (item.day === date) {
            day.topInfo = item.text
          }
        })
      }
      return day;
    },
    // // 获取过去一周日志提交情况，如：今天13号，获得7、8、9、10、11、12、13，七天的日志提交情况
    getSevenDayDate() {
      // const currDay = this.$formatDate().split('/')[2]
      // const currDay = this.date.split('/')[2]
      // console.log(currDay)
      const currDay = Number(this.date.split('/')[2])
      this.weekLogs = {
        month: 4,
        sevenDayLog: [{
          day: "2023/4/26",
          todo: false,
          text: '未提交'
        },{
          day: "2023/4/25",
          todo: false,
          text: '未提交'
        },
        {
          day: "2023/4/24",
          todo: false,
          text: '未提交'
        },
        {
          day: "2023/4/23",
          todo: true,
          text: '完成'
        },
        {
          day: "2023/4/22",
          todo: false,
          text: '未提交'
        },
        {
          day: "2023/4/21",
          todo: true,
          text: '完成'
        },
        {
          day: "2023/4/20",
          todo: true,
          text: '完成'
        }]
      }
      if (currDay === this.weekLogs.sevenDayLog[0].day) {
        this.finish = this.weekLogs.sevenDayLog[0].todo
      } else {
        this. finish = false
      }
      
    },
    // 获取当天日志
    getDayLog() {
      // API 传 userId 和 date // todo: 记得回显mark
      // console.log(this.date === this.$formatDate())
    
      if (this.date === this.$formatDate()) {
        let myData = localStorage.getItem('logList') ? JSON.parse(localStorage.getItem('logList')) : []
        this.logList = myData
      } else {
        this.logList = []
      }
    },
    // 编辑 点击每条「日志」进行
    editLogFun(obj) {
      // console.log('编辑对象：', obj)
      localStorage.setItem('editData', JSON.stringify(obj))
      console.log('feifei',JSON.stringify(obj))
      this.$emit('editLog', obj)
      // this.$emit('closeAction', false)
      
      


      // this.$router.push({
      //   path: '/handle',
      //   query: {
      //     isEdit: true
      //   }
      // })
    },
    
    // editLogById() { // todo: 没有调用这个方法
    //   const target = this.logList.find(item => item.id === this.editId)
    //   console.log('logList:', this.logList)
    //   console.log('target:', target)
    //   if (target) {
    //     console.log('feifieifei ')
    //     const obj = _.cloneDeep(this.formData)
    //     target.task = this.task
    //     target.type = this.module
    //     target.time = this.time
    //     target.detail = this.detail
    //   }
    //   console.log('logList:', this.logList)
    // },

    // 删除 已写的日志
    deleteLogFun(id) {
      // console.log('删除id：', id)
      Dialog.confirm({
        message: '确定删除吗？',
      }).then(() => {
        this.logList = this.logList.filter(item => item.id !== id)
        localStorage.setItem('logList', JSON.stringify(this.logList))
      }).catch(() => {
        console.log('取消删除')
      });
    },

    // 提交 整个日志表单
    submitLogFun() {
      if (this.logList.length === 0) {
        return Toast('请先填写日志')
      }
      Dialog.confirm({
        message: '确定提交吗？',
      }).then(() => {
        // console.log('提交日志：', this.logList)
        // console.log('备注：', this.mark)

        // API 返回成功，则操作如下：
        // localStorage.removeItem('logList')
        const myObjStr = JSON.stringify({logs: this.logList, mark: this.mark})
        localStorage.setItem('localLogs', myObjStr)

        this.showSubmitBtn = false
        localStorage.setItem('showSubmitBtn', this.showSubmitBtn)
      }).catch(() => {
        console.log('取消提交')
      });
    },
    // 点击7天内未提交日志的 tag 标签，快速选择日期并进入编写 日志 的页面
    quickDate(day) {
      this.date = day
      const obj = {'date': this.date, 'show': true}
      this.$emit('showAddLog', obj)
    }
  }
}
</script>

<style lang='less'>
.van-field__label{
  width: 3.8em!important;
}
.completed-log .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
    border-width: 0!important;
}
.home-container{
  background: rgb(246, 247, 247);
  .van-cell{
    color: #646566;
  }
  .van-empty{
    background-color: #fff;
    margin-top: 10px;
  }
}
.van-nav-bar .van-icon, .van-nav-bar .van-nav-bar__text {
    color: #fff!important;
}
.flex-cont{
  display: flex;
  justify-content: space-between;
  .van-field__control{
    text-align: right!important;
  }
}
.flex-time{
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  align-items: center;
  padding-right: 15px;
}
.flex-time .van-field{
  width: 90px!important;
}
.handle-main{
  padding: 10px 0;
  box-sizing: border-box;
  height: 100%;
  position: relative;
}
.btn-group{
  padding: 20px 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  background-color: #fff;

  // position: fixed;
  // width: 100%;
  // top: 200px;
}

.completed-log{
  margin-top: 10px;
}
.handle-btns{
  border-bottom: 1px solid #ebedf0;
}
.handle-btns .van-button{
  height: inherit!important;
}
.logBox{
  font-size: 16px;
  line-height: 20px;
  padding: 10px 16px;
  box-sizing: border-box;
}
.logTitle{
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-bottom: 2px;
  h3{
    width: 290px;
    color: #333;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .code{
    color: #A30014;
    font-weight: 500;
  }
  .evaluate{
    width: 60px;
    color: #777777;
    font-size: 14px;
    text-align: right;
  }
}
.logDetail{
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  p{
    width: 290px;
  }
  .time{
    width: 60px;
    font-weight: 500;
    color: #A30014;
    text-align: right;
  }
}

.my-tabbar .van-tabbar__placeholder {
  background-color: #fff;
}

.custom-button {
  width: 26px;
  color: #fff;
  font-size: 10px;
  line-height: 18px;
  text-align: center;
  background-color: #1989fa;
  border-radius: 100px;
}


.tag-group{
  background: #fff; 
  margin-top: 10px;
  .van-tag{
    margin: 10px 10px 0 10px!important;
    font-size: 14px;
  }
}

</style>
