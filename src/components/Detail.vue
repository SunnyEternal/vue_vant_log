<template>
  <div>
    <!-- 导航 -->
    <van-nav-bar title="研发部工作日志" stop-circle-o left-arrow @click-left="onClickLeft" @click-right="onClickRight">
      <template #right>
        <van-icon name="stop-circle-o" size="18" />
      </template>
    </van-nav-bar>

    <!-- 操作区 -->
    <div>
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

      <van-cell-group>
        <van-cell title="用时" value="内容">
          <van-stepper v-model="time" step="0.5" min="0.5" max="12"/>
        </van-cell>
      </van-cell-group>

      <van-field
        v-model="detail"
        rows="1"
        autosize
        label="描述"
        type="textarea"
        placeholder="请填写事物描述"
      />
      <div class="btn-group">
        <van-button type="info" plain size="small">保 存</van-button>
        <van-button color="#ef4f4f" plain size="small">取 消</van-button>
      </div>
    </div>

  </div>
</template>

<script>
export default{
  data() {
    return{
      date: this.$formatDate(),
      showCalendar: false,

      task: '',         // 选择任务
      showTaskPicker: false,
      taskSlots: [{
        id: 1,
        text: '1318【中安星云】数据安全平台##异常登录，数据泄露检测调研'
      },
      {
        id: 2,
        text: '1292【中安星云】数据安全平台##V1.5.0功能开发'
      },
      {
        id: 3,
        text: '1248【中安星云】数据安全平台##V1.4.0功能开发'
      },
      {
        id: 4,
        text: '1044【中安星云】数据安全平台##日志分析模块开发'
      },
      {
        id: 5,
        text: '（无 PM2 任务单）'
      }],

      type: '',         // 选择类型            
      showTypePicker: false,
      typeSlots: [{
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
      }],

      time: 1, 

      detail: '',
      mark: '',
    }
  },
  methods: {
    onClickLeft() {
      this.$router.push('/home')
    },
    onClickRight() {
      Toast('退出');
    },
    onConfirmDate(date) {
      this.date = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      this.showCalendar = false;
    },
    onConfirmTask(value) {
      console.log(value)
      this.task = value.text;
      this.showTaskPicker = false;
    },
    onConfirmType(value) {
      console.log(value)
      this.type = value.text;
      this.showTypePicker = false;
    },
    onChangeTime(value) {
      Toast('当前值：' + value);
    },
  }
}
</script>
