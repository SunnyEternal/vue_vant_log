<template>
  <div id="app">
    <van-nav-bar title="研发部工作日志" stop-circle-o @click-right="onClickRight">
      <template #right>
        <van-icon name="stop-circle-o" size="18" />
      </template>
    </van-nav-bar>

    <router-view/>

    <!-- 底部导航 -->
    <div class="my-tabbar">
      <van-tabbar v-model="active" :placeholder="true" :safe-area-inset-bottom="true" :before-change="beforeChange">
        <!-- <van-tabbar-item icon="records" to="/home">记录</van-tabbar-item>
        <van-tabbar-item icon="completed" to="/list">日志列表</van-tabbar-item>
        <van-tabbar-item icon="friends-o" to="/group">分组</van-tabbar-item>
        <van-tabbar-item icon="setting-o" to="/addTask">创建任务</van-tabbar-item> -->
        
        <van-tabbar-item icon="records">记录</van-tabbar-item>
        <van-tabbar-item icon="completed">日志列表</van-tabbar-item>
        <van-tabbar-item icon="friends-o">分组</van-tabbar-item>
        <van-tabbar-item icon="setting-o">创建任务</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
import { Dialog } from 'vant';
export default {
  data() {
    return{
      active: 0
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
    // 切换底部 tabbar 栏
    beforeChange(newIndex, oldIndex) {
      console.log('newIndex:', newIndex, 'oldIndex:',oldIndex)
      if (this.active === 0) {
        Dialog.confirm({
          message: '编辑内容会丢失，确定离开吗？',
        }).then(() => {
          this.active = newIndex
          if (newIndex === 1) {
            this.$router.push('/list')
          } else if (newIndex === 2) {
            this.$router.push('/group')
          } else if (newIndex === 3) {
            this.$router.push('/addTask')
          }
          return true;
        }).catch(() => {
          this.active = 0;
          console.log('取消离开')
          return false;
        });
      } else {
        this.active = newIndex
        if (newIndex === 1) {
          this.$router.push('/list')
        } else if (newIndex === 2) {
          this.$router.push('/group')
        } else if (newIndex === 3) {
          this.$router.push('/addTask')
        } else if (newIndex === 0) {
          this.$router.push('/home')
        }
      }
      return

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
  }
}
</script>

<style>

</style>
