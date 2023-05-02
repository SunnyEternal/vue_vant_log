<template>
  <div class="main-container">

    <!-- 头部 - 标题栏 -->
    <van-nav-bar title="研发部工作日志" stop-circle-o @click-right="onClickRight">
      <template #right>
        <van-icon name="stop-circle-o" size="18" />
      </template>
    </van-nav-bar>

    <!-- 中间 - 内容区 -->
    <router-view :addData="addData" :isEdit="isEdit" @editLog="getEditData" @showAddLog="showDialog"></router-view>

    <!-- 底部 - 导航 -->
    <div class="my-tabbar">
      <van-tabbar route :placeholder="true" :safe-area-inset-bottom="true">
        <van-tabbar-item icon="records" to="/home">记录</van-tabbar-item>
        <van-tabbar-item icon="completed" to="/list">日志列表</van-tabbar-item>
        <van-tabbar-item icon="add" class="my-icon" @click="addLog"></van-tabbar-item>
        <!-- <van-icon name="add" /> -->
        <van-tabbar-item icon="friends-o" to="/group">分组</van-tabbar-item>
        <van-tabbar-item icon="setting-o" to="/addTask">创建任务</van-tabbar-item>
      </van-tabbar>
    </div>

    <!-- 动作区域：添加log，编辑log -->
    <!-- <van-action-sheet v-model="showAction" cancel-text="取消" @cancel="onCancel">
      <child-handle @myClose="handleUpdate"></child-handle>
    </van-action-sheet> -->

    <!-- 动作区域：添加log，编辑log -->
    <van-action-sheet v-model="showAction" cancel-text="取消" @cancel="onCancel">
      <div class="handle-main">
        <van-field
          readonly
          name="calendar"
          :value="date"
          label="日期"
          @click="showCalendar = true"
        />
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
        <!-- <div class="btn-group">
          <van-button type="info" plain size="small" @click="saveLogFun">保 存</van-button>
        </div> -->
        <div class="fix-bottom">
          <van-button block plain type="info" native-type="submit">保存</van-button>
        </div>
      </div>
    </van-action-sheet>

  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import ChildHandle from './ChildHandle.vue'
export default {
  components: {
    ChildHandle
  },
  // props: ['myProp'],
  data() {
    return{
      showAction: false,

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
      title: '',
      module: '',
      codeId: '',

      // formData: {       // 每一条日志
      //   codeId: '',
      //   title: '',
      //   module: '',
      //   time: 1,
      //   detail: ''
      // },

      detail: '',

      logList: [],

      isEdit: false,

      addData: {},      // Main 组件向子组件 Home 传递【新写的log】

      showCalendar: true,
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

    this.isEdit = this.$route.query.isEdit ? this.$route.query.isEdit : false

  },
  mounted() {
    // this.displayEditData()
  },
  methods: {
    // 编辑 log，页面显示原数据
    getEditData(val) {
      // console.log('editData', val)
      this.showAction = true
      this.isEdit = true

      this.task = `${val.codeId}${val.title}`
      this.type = val.type
      this.time = val.time
      this.detail = val.detail

      this.codeId = val.codeId
      this.title = val.title

      localStorage.setItem('editData', JSON.stringify(val))
    },
    // 点击完 quickDate() 显示添加日志页面
    showDialog(val) {
      console.log('val:', val)
      this.showAction = val.show
      this.date = val.date

    },

    // 退出
    onClickRight() {
      // Toast('退出');
      Dialog.confirm({
        message: '确定退出吗？',
      }).then(() => {
        localStorage.clear()
        this.$router.push('/login')
      }).catch(() => {
        console.log('取消退出')
      });
    },
    // 添加日志
    addLog() {
      this.task = ''
      this.title = ''
      this.type = ''
      this.time = 1
      this.detail = ''
      this.codeId = ''


      this.showAction = true
    },
    // 取消添加日志
    onCancel() {
      this.showAction = false
    },

    // displayEditData() {
    //   const editData = JSON.parse(localStorage.getItem('editData'))
    //   if (this.isEdit) {
    //     this.task = `${editData.codeId}${editData.title}`
    //     this.type = editData.module
    //     this.time = editData.time
    //     this.detail = editData.detail
    //     // this.formData.codeId = editData.codeId
    //     // this.formData.title = editData.title
    //     this.codeId = editData.codeId
    //     this.title = editData.title
    //   }
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
      
      // this.formData.codeId = value.codeId
      // this.formData.title = value.title

      this.codeId = value.codeId
      this.title = value.title

      this.showTaskPicker = false;
    },
    // 确认选择类型
    onConfirmType(value) {
      // console.log(value)
      this.type = value.text;
      // this.formData.module = value.text
      this.showTypePicker = false;
    },
    // 确认用时
    onChangeTime(time) {
      // console.log('change time:', time, this.time)
      // this.formData.time = time
      this.time = time

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

      // 提取属性
      const { codeId, type, time, detail, title } = this
      // 构建数据
      let params = {
        codeId, type, time, detail, title
      }
      this.addData = params
      

      // 编辑 log 日志
      // if (this.isEdit) {
      //   console.log('111111')
      //   this.isEdit = false
      // } else {  // 添加 log 日志
      // console.log('222')
        
      // }


      this.showAction = false
      return

      
      if (!this.isEdit) {
        // const data = _.cloneDeep(this.formData)
        let logList = localStorage.getItem('logList')
        if (logList) {
          logList = JSON.parse(logList)
          // logList.push(data)
          logList.push(params)
          
          logList = this.setId(logList)
          // this.addData = logList[logList.]
          
          
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
        
        if (this.$route.path === '/home') {

        } else {
          this.$router.push('/home')
        }
        
      } else {
       
        // this.updateInfoById()
      }

      
      

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
    
  }
}
</script>

<style lang="less">
.my-icon .van-icon-add{
  font-size: 32px;
  top: -12px;
  border-radius: 50%;
  border: 1px solid #eee;
  padding: 4px;
  background-color: #fff;
  z-index: 10;
}
.my-icon .van-icon-add:before {
    content: '\e65d';
    color: #1989fa;
}
.main-container{
  .van-action-sheet{
    max-height: 100%!important;
    height: 94%!important;
  }
  .van-popup--bottom.van-popup--round {
    border-radius: 4px 4px 0 0;
  }
}
.fix-bottom{
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>
