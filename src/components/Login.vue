<template>
  <div>
    <!-- 导航 -->
    <van-nav-bar title="研发部工作日志"/>

    <!-- 登录 -->
    <van-form @submit="onSubmit">
      <van-field
        v-model="username"
        name="username"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div class="btn-margin">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>

      {{myDate}}
    </van-form>
  </div>
</template>

<script>
import { Toast } from 'vant';

export default {
  data() {
    return {
      username: '',
      password: '',
      myDate: new Date()

      // !官方文档还有 校验规则，我没添加呢……
    };
  },
  created() {

    
  },
  mounted() {
    let my =  this.$formatDate()
    console.log('feifei:', my)
    let you = this.$sixDays()
    console.log('riqi:', you)
  },
  methods: {
    onSubmit(values) {
      // console.log('submit', values);
      if (values.username === 'feifei' && values.password === '123') {
        localStorage.setItem('username', 'feifei')
        this.$router.push('/home')
      } else if (values.username === 'admin' && values.password === '123') {
        localStorage.setItem('username', 'admin')
        this.$router.push('/home')
      } else {
        Toast('尚无登录权限，请联系管理员')
        // Notify({ type: 'primary', message: index }); 
      }
    },
  },
}
</script>

<style lang='less'>
.van-nav-bar__content{
  background-color: #1989fa;
}
.van-nav-bar__title{
  color: #fff!important;
}
.van-form{
  margin-top: 45%;
}

.btn-margin{
  margin: 16px;
}
</style>
