<template>
  <div class="home-container">
    <!-- 导航 -->
    <van-nav-bar title="研发部工作日志" stop-circle-o @click-right="onClickRight">
      <template #right>
        <van-icon name="stop-circle-o" size="18" />
      </template>
    </van-nav-bar>

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
          label="日历"
          @click="showCalendar = true"
        />
      </div>
      
      <van-calendar v-model="showCalendar" @confirm="onConfirmDate" color="#1989fa" :min-date="minDate" :max-date="maxDate" :formatter="formatter" />
    </div>

    <div v-show="!finish">
      <!-- 写好的日志 --> 
      <div class="completed-log">
        <van-swipe-cell class="handle-btns" :class="[item.id === editId && isEdit ? 'higlight' : '' ]" v-for="(item) in logList" :key="item.id">
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
          <template #right>
            <van-button square type="danger" text="删除" @click="deleteLogFun(item.id)" />
            <van-button square type="info" text="编辑" @click="editLogFun(item)" />
          </template>
        </van-swipe-cell>
      </div>

      <!-- 操作区 -->
      <div class="handle-main" v-show="!addBtnVisible">
        <van-field
          readonly
          clickable
          label="任务"
          :value="task"
          placeholder="选择任务"
          @click="showTaskPicker = true"
        />
        <van-popup v-model="showTaskPicker" round position="bottom">
          <van-picker
            show-toolbar
            :columns="taskSlots"
            @cancel="showTaskPicker = false"
            @confirm="onConfirmTask"
          />
        </van-popup>

        <van-field
          readonly
          clickable
          label="类型"
          :value="type"
          placeholder="选择类型"
          @click="showTypePicker = true"
        />
        <van-popup v-model="showTypePicker" round position="bottom">
          <van-picker
            show-toolbar
            :columns="typeSlots"
            @cancel="showTypePicker = false"
            @confirm="onConfirmType"
          />
        </van-popup>

        <!-- <van-cell title="用时"> -->
          <!-- <van-stepper v-model.number="time" step="0.5" min="0.5" max="12" default-value="2" @change="onChangeTime" disable-input theme="round" /> -->
        <!-- </van-cell> -->
        <div class="flex-time">
          <van-field readonly label="时间" :border="false" />
          <van-slider v-model="time" :step="0.5" :min="0.5" :max="12">
            <template #button>
              <div class="custom-button">{{time}}</div>
            </template>
          </van-slider>
        </div>

        <van-field
          v-model="detail"
          rows="1"
          autosize
          label="描述"
          type="textarea"
          placeholder="请填写事物描述"
        />
        <div class="btn-group">
          <van-button type="info" plain size="small" @click="saveLogFun">保 存</van-button>
          <van-button color="#ef4f4f" plain size="small" @click="cancelLogFun">取 消</van-button>
        </div>
      </div>

      <div class="btn-group" v-show="addBtnVisible">
        <van-button icon="plus" type="info" size="small" plain block @click="handleBtnFun">添加事务</van-button>
      </div>

      <div class="handle-mark">
        <van-field
          v-model="mark"
          rows="1"
          autosize
          label="备注"
          type="textarea"
          placeholder="今日未处理开发工作"
        />
        <div class="btn-group">
          <van-button type="info" block @click="submitLogFun">提 交</van-button>
        </div>
        
      </div>
    </div>

    <div v-show="finish">
      <van-empty description="日志已提交" />
    </div>
    

    <!-- 底部导航 -->
    <div class="my-tabbar">
      <van-tabbar v-model="active" :placeholder="true" :safe-area-inset-bottom="true" :before-change="beforeChange">
        <van-tabbar-item icon="records">记录</van-tabbar-item>
        <van-tabbar-item icon="completed">日志列表</van-tabbar-item>
        <van-tabbar-item icon="friends-o">分组</van-tabbar-item>
        <van-tabbar-item icon="setting-o">创建任务</van-tabbar-item>
      </van-tabbar>
    </div>

  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import _ from 'lodash';

export default {
  data() {
    return {
      finish: false,
      username: '',
      date: this.$formatDate(),    // 默认日历显示当前日期，日历时间可修改
      minDate: new Date(this.$sixDays()),
      maxDate: new Date(),
      showCalendar: false,

      task: '',         // 选择任务
      showTaskPicker: false,
      rawTask: [],      // 任务原始数据

      type: '',         // 选择类型            
      showTypePicker: false,
      typeSlots: [],    //? 类型原始数据

      time: 1,          // 选择用时
      value: 1,

      active: 0,        // 底部选中导航

      detail: '',       // 事物描述
      mark: '',

      formData: {       // 每一条日志
        id: 0,
        codeId: '',
        title: '',
        module: '',
        time: 1,
        detail: ''
      },
      numId: 0,         // 给写好的日志生成 id

      logList: [],      // 已写好的所有日志
      addBtnVisible: false,// 是否显示添加【事物按钮】

      weekLogs: {
        month: 1,
        sevenDayLog: []
      },
      isEdit: false,
      editId: 0,
    };
  },
  created() {
    console.log('编辑页过来', this.$route.query.edit, this.$route.query.date)
    if (this.$route.query.edit) {
      this.date = this.$route.query.date ? this.$route.query.date : this.$formatDate
    }

    this.username = localStorage.getItem('username')
    this.getTaskFun()
    this.getTypeFun()

    this.getSevenDayDate()
  },
  mounted() {

  },
  computed: {
    taskSlots() {
      return this.addText(this.rawTask);
    },
    // logList() {
    //   return this.addLogObject(this.arr);
    // }
  },
  methods: {
    // 退出
    onClickRight() {
      // Toast('退出');
      Dialog.confirm({
        message: '确定退出吗？',
      }).then(() => {
        this.$router.push('/login')
      }).catch(() => {
        console.log('取消退出')
      });
    },
    // 在日历上选择日期
    onConfirmDate(date) {
      this.date = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      const currDay = Number(this.date.split('/')[2])
      console.log(currDay) // ! 注意字符串 和 数字 间的转换

      const foundArr =  this.weekLogs.sevenDayLog.filter((obj) => obj.day === currDay);
      this.finish = foundArr.length != 0 ? foundArr[0].todo : false
      console.log(this.weekLogs.sevenDayLog)
      console.log('foundArr:', foundArr)
      console.log(this.finish, 'currDay:', currDay)
      
      this.showCalendar = false;
    },
    // 在日期上显示日志提交情况 // ! html 里没有传 day，但是方法里怎么可以用呢？
    formatter(day) {
      const month = day.date.getMonth() + 1;
      const date = day.date.getDate();
      console.log('month:', month)

      if(this.weekLogs.month === month) {
        this.weekLogs.sevenDayLog.forEach((item) => {
          if (item.day === date) {
            day.topInfo = item.text
          }
        })
      }
      return day;
    },
    // 获取过去一周日志提交情况，如：今天13号，获得7、8、9、10、11、12、13，七天的日志提交情况
    getSevenDayDate() {
      // const currDay = this.$formatDate().split('/')[2]
      // const currDay = this.date.split('/')[2]
      // console.log(currDay)
      const currDay = Number(this.date.split('/')[2])
      this.weekLogs = {
        month: 4,
        sevenDayLog: [{
          day: 14,
          todo: true,
          text: '完成'
        },{
          day: 13,
          todo: false,
          text: '未提交'
        },
        {
          day: 12,
          todo: false,
          text: '未提交'
        },
        {
          day: 11,
          todo: true,
          text: '完成'
        },
        {
          day: 10,
          todo: false,
          text: '未提交'
        },
        {
          day: 9,
          todo: true,
          text: '完成'
        },
        {
          day: 8,
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
    
    // 获取 task 任务
    getTaskFun() {
      this.rawTask = [{
        id: 1,
        codeId: 1292,
        title: '【中安星云】数据安全数据安全数据安全平台##V1.5.0功能开发',
      },
      {
        id: 2,
        codeId: 1294,
        title: '【中安星云】数据安全平台##V1.7.0功能开发',
      },
      {
        id: 3,
        codeId: 1391,
        title: '【中安星云】数据加密##V0.5.0功能开发',
      }]
    },
    // 给 rawTask 数组数据添加【text】属性，用于 vant ui 绘制弹出选择列表
    addText(arr) {
      arr.forEach(function(obj) {
        obj.text = `${obj.codeId}${obj.title}`;
      });
      return arr;
    },

    // 获取 type 类别
    getTypeFun() {
      // this.rawType
      this.typeSlots = [{
        id: 11,
        text: '需求与目标管理'
      },
      {
        id: 12,
        text: '需求评估'
      },
      {
        id: 13,
        text: '需求分析'
      },
      {
        id: 14,
        text: '需求设计'
      },
      {
        id: 15,
        text: '版本规划'
      }]
    },

    // 确认选择任务
    onConfirmTask(value) {
      // console.log(value)
      this.task = value.text;
      // ! 应该有更好的写法  赋值给 this.formData
      
      this.formData.codeId = value.codeId
      this.formData.title = value.title
      this.showTaskPicker = false;
    },
    // 确认选择类型
    onConfirmType(value) {
      // console.log(value)
      this.type = value.text;
      this.formData.module = value.text
      this.showTypePicker = false;
    },
    // 确认用时
    onChangeTime(time) {
      console.log('change time:', time, this.time)
      this.formData.time = time

      // ! 看文档，看是否需要异步关闭
    },

    // 保存 已写的日志
    saveLogFun() {
      if (this.task === '' || this.type === '' || this.detail === '') {
        return Toast('请填写日志')
      }
      this.formData.time = this.time
      this.formData.detail = this.detail

      
      
      console.log('this.isEdit:', this.isEdit)
      if (!this.isEdit) {
        this.numId = this.numId + 1
        const data = _.cloneDeep(this.formData)
        data.id = this.numId
        // console.log('numId', this.numId)
        // console.log('data:', data)
        this.logList.push(data)

        this.task = ''
        this.type = ''
        this.time = 1
        this.detail = ''
        
      } else {
       
        this.updateInfoById()
      }

      
      this.isEdit = false
      this.addBtnVisible = true

      // this.formData.module = ''
      // this.formData.time = ''
      // this.formData.detail = ''
       
    },
    // 取消 已写的日志
    cancelLogFun() {
      this.addBtnVisible = true
      this.isEdit = false
    },
    // 是否显示【+添加事物】按钮
    handleBtnFun() {
      this.addBtnVisible = !this.addBtnVisible
      this.formData.codeId = ''
      this.formData.title = ''
      this.formData.module = ''
      this.detail = ''
      this.task = ''
      this.type = ''
      this.time = 1
    },

    // 编辑 已写的日志
    editLogFun(obj) {
      console.log('编辑对象：', obj)
      this.editId = obj.id
      // this.logList = this.logList.filter(item => item.id !== obj.id)
      this.isEdit = true

      this.task = `${obj.codeId}${obj.title}`
      this.type = obj.module
      this.time = obj.time
      this.detail = obj.detail
      this.formData.codeId = obj.codeId
      this.formData.title = obj.title
      console.log('this.formData:', this.formData)
      
      this.addBtnVisible = false

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
    updateInfoById() {
      console.log(this.task, ',', this.time, ',', this.detail)
      const id = this.editId
      return this.logList.map(item => {
        if (item.id === id) {
          console.log('item:', item)
          item.task = this.task
          item.time = this.time
          item.detail = this.detail
          item.codeId = this.formData.codeId
          item.module = this.formData.module
          item.title = this.formData.title
        }
        return item
      })
    },

    // 删除 已写的日志
    deleteLogFun(id) {
      Dialog.confirm({
        message: '确定删除吗？',
      }).then(() => {
        this.logList = this.logList.filter(item => item.id !== id)
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
        const myObjStr = JSON.stringify({logs: this.logList, mark: this.mark})
        localStorage.setItem('localLogs', myObjStr)
        this.$router.push('/list')
      }).catch(() => {
        console.log('取消提交')
      });
    },

    // 切换底部 tabbar 栏
    beforeChange(newIndex, oldIndex) {
      console.log('newIndex:', newIndex)
      if (newIndex === 1) {
        if (this.logList.length !== 0 || this.detail !== '') {
          // 禁止切换到设置标签
          Dialog.confirm({
            message: '正在编辑日志，确定离开吗？',
          }).then(() => {
            this.active = 1
            this.$router.push('/list')
            return true;
          }).catch(() => {
            this.active = 0;
            console.log('取消离开')
            return false;
          });
        } else {
          console.log('newIndex:', newIndex)
          this.$router.push('/list')
        }
      } else if(newIndex === 2) {
        this.$router.push('/group')
      } else if(newIndex === 3) {
        this.$router.push('/addTask')
      }
      // 允许切换到其他标签
      return true;
    },
  },
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
  margin: 10px 0;
}
.btn-group{
  padding: 20px 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  background-color: #fff;
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
.higlight{
  border: 1px solid #1989fa;
}
</style>
