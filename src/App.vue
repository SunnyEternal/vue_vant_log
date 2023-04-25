<template>
  <div id="app">
    <!-- 头部-标题栏 -->
    <van-nav-bar title="研发部工作日志" stop-circle-o @click-right="onClickRight">
      <template #right>
        <van-icon name="stop-circle-o" size="18" />
      </template>
    </van-nav-bar>

    <!-- 中间-视图 -->
    <router-view/>

    <!-- 底部-导航 -->
    <!-- :before-change="beforeChange" -->
    <div class="my-tabbar">
      <van-tabbar route :placeholder="true" :safe-area-inset-bottom="true">
        <van-tabbar-item icon="records" to="/home">记录</van-tabbar-item>
        <van-tabbar-item icon="completed" to="/list">日志列表</van-tabbar-item>
        <van-tabbar-item icon="plus" to="/handle" class="my-icon"></van-tabbar-item>
        <van-tabbar-item icon="friends-o" to="/group">分组</van-tabbar-item>
        <van-tabbar-item icon="setting-o" to="/addTask">创建任务</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
import { Dialog } from 'vant';
export default {
  data() {
    return{

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
    }
  }
}
</script>

<style>
.my-icon .van-icon-plus{
  font-size: 32px;
  top: -12px;
  border-radius: 50%;
  border: 1px solid #eee;
  padding: 4px;
  background-color: #fff;
  z-index: 10;
}
</style>
