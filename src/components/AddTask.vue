<template>
  <div class="addTask-container">
    <!-- 导航 -->
    <van-nav-bar title="研发部工作日志" stop-circle-o @click-right="onClickRight">
      <template #right>
        <van-icon name="stop-circle-o" size="18" />
      </template>
    </van-nav-bar>

    <!-- 创建任务 -->
    <van-form @submit="taskSubmit">
      <van-field
        v-model="taskName"
        name="任务"
        label="任务名称"
        placeholder="请添加任务描述"
      />
      <!-- :rules="[{ required: true, message: '请添加任务' }]" -->
      <div style="margin: 16px;">
        <van-button plain block type="info" native-type="submit">创建任务</van-button>
      </div>
    </van-form>

    <!-- <van-divider /> -->

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
          <van-cell v-for="item in taskList" :key="item" :title="item" />
        </van-list>
      </van-tab>
    </van-tabs>
    

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
import { Notify } from 'vant';

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
      tabActive: 0,
      active: 3,

      taskName: '',
      taskList: [],

      error: false,
      loading: false,

      finished: false
    }
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
    // 添加任务
    taskSubmit(values) {
      console.log('submit', values);
      // 1. 调第一个接口，添加任务

      // 2. 调第二个接口，获取任务列表
      Notify({ type: 'success', message: '创建任务成功！' });
      this.taskName = ''
    },
    // 
    onLoad() {

      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.taskList.push(this.taskList.length + 1);
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.taskList.length >= 40) {
          this.finished = true;
        }
      }, 1000);

      // fetchSomeThing().catch(() => {
      //   this.error = true;
      // });
    },
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
}

</style>
