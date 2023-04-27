<template>
  <div class="addTask-container">

    <!-- 手动输入【任务编号】 -->
    <van-field
      v-model="taskId"
      name="任务"
      label="任务编号"
      placeholder="请添加任务编号"
      maxlength="4"
    />

    <!-- 选产品 -->
    <van-field name="prodCheckboxGroup" label="请选产品">
      <template #input>
        <van-checkbox-group v-model="prodCheckboxGroup" direction="horizontal">
          <van-checkbox name="dbes" shape="square">dbes</van-checkbox>
          <van-checkbox name="asi" shape="square">asi</van-checkbox>
        </van-checkbox-group>
      </template>
    </van-field>

    <!-- 选任务类别 -->
    <van-field
    readonly
    clickable
    label="任务类别"
    :value="category"
    placeholder="请选择类别"
    @click="showCategoryPicker = true"
    />
    <van-popup v-model="showCategoryPicker" round position="bottom">
      <van-picker
      show-toolbar
      :columns="cateList"
      @cancel="showCategoryPicker = false"
      @confirm="confirmCategory"
      />
    </van-popup>

    <!-- 选任务来源 -->
    <van-field
    readonly
    clickable
    label="任务来源"
    :value="source"
    placeholder="请选择来源"
    @click="showSourcePicker = true"
    />
    <van-popup v-model="showSourcePicker" round position="bottom">
      <van-picker
      show-toolbar
      :columns="sourList"
      @cancel="showSourcePicker = false"
      @confirm="confirmSource"
      />
    </van-popup>

    <!-- 添加备注 -->
    <van-field
      v-model="desc"
      name="备注"
      label="备注"
      placeholder="添加备注内容"
      maxlength="10"
    />

    <!-- 创建任务同时将任务分配给各个小组 -->
    <van-field name="teamCheckboxGroup" label="分配小组">
      <template #input>
        <van-checkbox-group v-model="teamCheckboxGroup" direction="horizontal">
          <van-checkbox name="1" shape="square">小组 1</van-checkbox>
          <van-checkbox name="2" shape="square">小组 2</van-checkbox>
        </van-checkbox-group>
      </template>
    </van-field>

    <!-- 创建任务按钮 -->
    <!-- :rules="[{ required: true, message: '请添加任务' }]" -->
    <div style="margin: 16px;">
      <van-button plain block type="info" native-type="submit" @click="taskSubmit">创建任务</van-button>
    </div>

    <!-- 任务列表区域： -->
    <van-tabs v-model="tabActive">
      <van-tab title="任务列表">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          @load="onLoad"
        >
          <van-cell v-for="(item, k) in taskList" :key="k" :title="(k+1) + ' ' + item.taskId + '@' + item.source + '-#' + item.desc">
            <template #right-icon>
              <van-icon name="cross" class="cross-icon" @click="removeTask(item)" />
            </template>
          </van-cell>
        </van-list>
      </van-tab>
    </van-tabs>
    
  </div>
</template>

<script>
import { Notify, Dialog } from 'vant';

// todo: 局部注册
// export default {
//   components: {
//     [Notify.Component.name]: Notify.Component,
//   },
// };
// todo: end

export default{
  components: {
    [Notify.Component.name]: Notify.Component,
  },
  data() {
    return{
      tabActive: 0,   // tab 高亮

      taskId: '',     // 手动输入任务编号

      prodCheckbox: false,          // 分配给小组任务的复选框 // todo: UI 样式修改下……
      prodCheckboxGroup: [],  

      category: '',   // 选中的任务类别
      cateList: [],   // 任务类别列表
      showCategoryPicker: false,    // 显示选类别的弹框

      source: '',     // 任务来源
      sourList: [],   // 任务来源列表
      showSourcePicker: false,      // 显示任务来源

      teamCheckbox: false,          // 分配给小组任务的复选框 // todo: UI 样式修改下，分配给小组，但不属于创建小组
      teamCheckboxGroup: [],        // 选中要分配给的小组

      desc: '',       // 备注

      taskList: [],   // 任务列表
      error: false,
      loading: false,
      finished: false
    }
  },
  created() {
     let proList = [{
        "id":1,
        "name":"dbes",
        "desc":"数据库加密"
      },
      {
        "id":2,
        "name":"asi",
        "desc":"api 审计"
      }]
      // console.log('prodList:', this.prodList)

      let catList = [{
        "name":"coding",
        "desc":"代码编写"
      },
      {
        "name":"test",
        "desc":"版本测试"
      }]
      this.cateList = this.addText(catList)
      // console.log('catList:', this.cateList)

      let souList = [{
        "name":"pm2",
        "desc":"研发任务管理平台"
      },
      {
        "name":"pm",
        "desc":"研发 Bug 库"
      },
      {
        "name":"jira",
        "desc":"产品需求管理库"
      }]
      this.sourList = this.addText(souList)
      console.log('souList', this.sourList)
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
    // 工具 给数组添加【text】属性
    addText(arr) {
      arr.forEach(function(obj) {
        obj.text = `${obj.name}${obj.desc}`;
      });
      return arr;
    },

    // 确认选择任务类别
    confirmCategory(value) {
      this.category = value.text;
      this.showCategoryPicker = false;
    },

    // 确认选择任务来源
    confirmSource(value) {
      this.source = value.text;
      this.showSourcePicker = false;
    },


    // 创建任务
    taskSubmit(values) {
      console.log('submit', values);
      // 1. 调第一个接口，添加任务

      // 2. 调第二个接口，获取任务列表

      // 提取属性值
      const { taskId, prodCheckboxGroup, category, source, desc, teamCheckboxGroup } = this

      // 构建参数对象
      const params = {
        taskId,
        prodCheckboxGroup,
        category,
        source,
        desc,
        teamCheckboxGroup
      }
      // console.log('params', params)
      
      Dialog.confirm({
        message: '确定创建任务？',
      }).then(() => {
        let taskList = localStorage.getItem('taskList') ? localStorage.getItem('taskList') : []
        // if (taskList.length === 0) {
        //   this.taskList.unshift(params)
        // } else {
        //   this.taskList.unshift(params)
        // }
        this.taskList.unshift(params)
        localStorage.setItem('task', JSON.stringify(params))

        this.taskId = ''
        this.prodCheckbox = false
        this.prodCheckboxGroup = []
        this.category = ''
        this.cateList = []
        this.showCategoryPicker = false
        this.source = ''
        this.sourList = []
        this.showSourcePicker = false
        this.teamCheckbox = false
        this.teamCheckboxGroup = []
        this.desc = ''
        Notify({ type: 'success', message: '创建任务成功！' });
      }).catch(() => {
        console.log('取消创建任务')
      });
      
    },
    // 
    onLoad() {

      this.taskList = [{
        taskId: '1292',
        source: 'pm研发 Bug 库',
        desc: '昨天已经修复闪退问题'
      },
      {
        taskId: '1294',
        source: "pm2研发任务管理平台",
        desc: '进行开发记录日志项目'
      }]

      // 加载状态结束
      this.loading = false;
    },

    removeTask(item) {
      console.log('item:',item)
      Notify({ type: 'success', message: '删除成功！假数据！！！' });
    }
  }
}
</script>

<style lang='less'>
.addTask-container{
  .van-form{
    margin-top: 0;
  }
  .van-field__label{
    width: 4.4em!important;
  }
  .cross-icon{
    top: 5px;
  }
}

</style>
