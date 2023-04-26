<template>
  <div class="handle-container">
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
// ComponentB.vue
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

      // editObj: {},
      isEdit: false
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

    // eventBus.$once('event-editLog', (obj) => {
    //   this.editObj = obj
    //   console.log('bian:', this.editObj)
    // })

    this.isEdit = this.$route.query.isEdit ? this.$route.query.isEdit : false

  },
  mounted() {
    this.displayEditData()
  },
  methods: {
    displayEditData() {
      const editData = JSON.parse(localStorage.getItem('editData'))
      if (this.isEdit) {
        this.task = `${editData.codeId}${editData.title}`
        this.type = editData.module
        this.time = editData.time
        this.detail = editData.detail
        this.formData.codeId = editData.codeId
        this.formData.title = editData.title
      }
    },
    // handleEvent(obj) {
    //   // console.log('obj:', obj)
    //   // this.task = `${obj.codeId}${obj.title}`
    //   // console.log(this.task)
    //   // this.type = obj.module
    //   // this.time = obj.time
    //   // this.detail = obj.detail
    //   // this.formData.codeId = obj.codeId
    //   // this.formData.title = obj.title
    //   console.log('this.formData:', this.formData)
    // },
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
    // 保存 已写的日志
    saveLogFun() {
      if (this.task === '' || this.type === '' || this.detail === '') {
        return Toast('请填写日志')
      }
      this.formData.time = this.time
      this.formData.detail = this.detail
      
      if (!this.isEdit) {
        const data = _.cloneDeep(this.formData)
        let logList = localStorage.getItem('logList')
        // console.log('logList:',logList)
        if (logList) {
          logList = JSON.parse(logList)
          logList.push(data)
          
          logList = this.setId(logList)
          // console.log('logList:', logList)
          
          
          localStorage.setItem('logList', JSON.stringify(logList))
          
        } else {
          let log = []
          log.push(data)
          log = this.setId(log)
          // console.log('log:', log)
          localStorage.setItem('logList', JSON.stringify(log))
          
        }

        this.task = ''
        this.type = ''
        this.time = 1
        this.detail = ''

        localStorage.setItem('showSubmitBtn', true)
        this.$router.push('/home')
        
      } else {
       
        this.updateInfoById()
      }

      
      this.isEdit = false
      this.addBtnVisible = true

    },

    updateInfoById() {
      console.log(this.task, ',', this.time, ',', this.detail, ',', this.type)
      
      const editData = JSON.parse(localStorage.getItem('editData'))
      const editId = editData.id
      let logList = JSON.parse(localStorage.getItem('logList'))

      let temp = []

      temp = logList.map(item => {
        if (item.id === editId) {
          item.task = this.task
          item.time = this.time
          item.detail = this.detail
          item.module = this.type
          item.codeId = this.formData.codeId
          item.title = this.formData.title
        }
        return item
      })
      localStorage.setItem('showSubmitBtn', true)
      localStorage.setItem('logList', JSON.stringify(temp))
      this.$router.push('/home')
    },

    // 取消 已写的日志
    cancelLogFun() {
      this.$router.push('/home')
    },

    // 工具 为数组中每个对象添加 id
    setId(arr) {
      return arr = arr.map((item, index) => {
        return {
          ...item,
          id: index + 1
        }
      })
    }
  }
}

</script>
