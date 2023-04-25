<template>
  <div class="handle-container">
    <!-- <van-button square type="danger" text="删除" @click="sendData" /> -->
    <!-- <div class="handle-main" v-show="!addBtnVisible"> -->
    <div class="handle-main">
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

  </div>
</template>

<script>
import { Toast } from 'vant'
// ComponentA.vue
import { eventBus } from '../main.js'
export default {
  data() {
    return{
      finish: false,
      username: '',
      date: this.$formatDate(),    // 默认日历显示当前日期，日历时间可修改
      task: '',         // 选择任务
      showTaskPicker: false,
      rawTask: [],      // 任务原始数据

      type: '',         // 选择类型            
      showTypePicker: false,
      typeSlots: [],    //? 类型原始数据

      time: 1,          // 选择用时

      formData: {       // 每一条日志
        id: 0,
        codeId: '',
        title: '',
        module: '',
        time: 1,
        detail: ''
      },

      detail: '',

      logList: [],
      numId: 0
    }
  },
  computed: {
    taskSlots() {
      return this.addText(this.rawTask);
    },
  },
  created() {
    this.username = localStorage.getItem('username')

    this.getTaskFun()
    this.getTypeFun()

  },
  methods: {
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
    // 给 rawTask 数组数据添加【text】属性，用于 vant ui 绘制弹出选择列表
    addText(arr) {
      arr.forEach(function(obj) {
        obj.text = `${obj.codeId}${obj.title}`;
      });
      return arr;
    },

    sendData() {
      const data = {
        "id": 12,
        "name": "Mia"
      }
      // eventBus.$emit('my-event', data)
      // this.$router.push('/home')
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
        let logList = localStorage.getItem('logList')
        console.log('logList:',logList)
        if (logList) {
          logList = JSON.parse(logList)
          logList.push(data)
          console.log('logList:', logList)
          localStorage.setItem('logList', JSON.stringify(logList))
          
        } else {
          let log = []
          log.push(data)
          console.log('log:', log)
          localStorage.setItem('logList', JSON.stringify(log))
          
        }

        this.task = ''
        this.type = ''
        this.time = 1
        this.detail = ''

        this.$router.push('/home')
        
      } else {
       
        this.updateInfoById()
      }

      
      this.isEdit = false
      this.addBtnVisible = true

    },
    // 取消 已写的日志
    cancelLogFun() {
      // this.addBtnVisible = true
      // this.isEdit = false
      this.$router.push('/home')
    },
  }
}

</script>
