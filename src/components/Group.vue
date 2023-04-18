<template>
  <div class="addTask-container">
    <!-- 导航 -->
    <van-nav-bar title="研发部工作日志" stop-circle-o @click-right="onClickRight">
      <template #right>
        <van-icon name="stop-circle-o" size="18" />
      </template>
    </van-nav-bar>

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
export default{
  data() {
    return{
      active: 2
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
  }
}
</script>

<style>

</style>
