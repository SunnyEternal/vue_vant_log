<template>
  <div class="addTask-container">
    <!-- 头部导航 -->
    <van-nav-bar title="研发部工作日志" stop-circle-o @click-right="onClickRight">
      <template #right>
        <van-icon name="stop-circle-o" size="18" />
      </template>
    </van-nav-bar>

    <van-tree-select
      :items="items"
      :active-id.sync="activeIds"
      :main-active-index.sync="activeIndex"
    />

    <div style="margin: 16px;">
      <van-button plain block type="info" native-type="submit">创建分组</van-button>
    </div>

    <van-tabs v-model="tabActive">
      <van-tab title="已有小组">
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

export default{
  components: {
    [Notify.Component.name]: Notify.Component,
  },
  data() {
    return{
      tabActive: 0,

      active: 2,

      taskName: '',
      taskList: [],

      error: false,
      loading: false,

      finished: false,

      // items: [{
      //   // 导航名称
      //   text: '浙江',
      //   // 导航名称右上角徽标，2.5.6 版本开始支持
      //   // badge: 3,
      //   // 是否在导航名称右上角显示小红点
      //   // dot: true,
      //   // 导航节点额外类名
      //   className: 'my-class',
      //   // 该导航下所有的可选项
      //   children: [
      //     {
      //       // 名称
      //       text: '温州',
      //       // id，作为匹配选中状态的标识符
      //       id: 1,
      //       // 禁用选项
      //       disabled: true,
      //     },
      //     {
      //       text: '杭州',
      //       id: 2,
      //     },
      //     {
      //       text: '宁波',
      //       id: 3,
      //     },
      //     {
      //       text: '义乌',
      //       id: 4,
      //     },
      //   ],
      // },
      // {
      //   text: '江苏',
      //   className: 'my-class',
      //   // 该导航下所有的可选项
      //   children: [
      //     {
      //       // 名称
      //       text: '南京',
      //       // id，作为匹配选中状态的标识符
      //       id: 11,
      //       // 禁用选项
      //       disabled: true,
      //     },
      //     {
      //       text: '无锡',
      //       id: 12,
      //     },
      //     {
      //       text: '徐州',
      //       id: 13,
      //     },
      //   ],
      // },
      // {
      //   text: '福建',
      //   className: 'my-class',
      //   disabled: true,
      //   // 该导航下所有的可选项
      //   children: [
      //     {
      //       // 名称
      //       text: '南京',
      //       // id，作为匹配选中状态的标识符
      //       id: 21,
      //       // 禁用选项
      //       disabled: true,
      //     },
      //     {
      //       text: '无锡',
      //       id: 22,
      //     },
      //     {
      //       text: '徐州',
      //       id: 23,
      //     },
      //   ],
      // }],
      items: [{
        // 导航名称
        text: '前端',
        // 导航名称右上角徽标，2.5.6 版本开始支持
        // badge: 3,
        // 是否在导航名称右上角显示小红点
        // dot: true,
        // 导航节点额外类名
        className: 'my-class',
        // 该导航下所有的可选项
        children: [
          {
            // 名称
            text: '王伟珍',
            // id，作为匹配选中状态的标识符
            id: 1,
            // 禁用选项
            disabled: true,
          },
          {
            text: '刘飞飞',
            id: 2,
          },
          {
            text: '汪大鹏',
            id: 3,
          },
          {
            text: '影影',
            id: 4,
          },
          {
            text: '宋沁萱',
            id: 5,
          },
          {
            text: '宋艺',
            id: 6,
          },
          {
            text: '吴迪',
            id: 7,
          },
          {
            text: '蒋莱',
            id: 8,
          },
          {
            text: '李敏镐',
            id: 9,
          },
        ],
      },
      {
        text: '后端',
        className: 'my-class',
        // 该导航下所有的可选项
        children: [
          {
            // 名称
            text: '宋辉',
            // id，作为匹配选中状态的标识符
            id: 11,
            // 禁用选项
            disabled: true,
          },
          {
            text: '大飞',
            id: 12,
          },
          {
            text: '大侠',
            id: 13,
          },
        ],
      },
      {
        text: '测试',
        className: 'my-class',
        // disabled: true,
        // 该导航下所有的可选项
        children: [
          {
            // 名称
            text: '小明',
            // id，作为匹配选中状态的标识符
            id: 21,
            // 禁用选项
            disabled: true,
          },
          {
            text: '小小丫',
            id: 22,
          },
          {
            text: '天天',
            id: 23,
          },
        ],
      }],
      activeIds: [1, 2],
      activeIndex: 0,

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

<style>

</style>
