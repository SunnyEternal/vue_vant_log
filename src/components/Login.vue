<template>
  <div>

    <!-- 头部-标题栏 -->
    <van-nav-bar title="研发部工作日志"></van-nav-bar>

    <img src="../assets/logo.png" class="logo" alt="">

    <!-- 登录 -->
    <van-form @submit="loginFun">
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
        <van-button block type="info" native-type="submit">提交</van-button>
      </div>

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

      // !官方文档还有 校验规则，我没添加呢……
    };
  },
  created() {
    
  },
  mounted() {

  },
  methods: {
    // 登录
    loginFun(values) {
      // console.log('submit', values);
      if (values.username === 'feifei' && values.password === '123') {
        localStorage.setItem('username', 'feifei')

        const userData = {"data": {"data":{"userId":2,"username":"feifei","token":"18938477","isSysAdmin":false,"isGroupAdmin":true,"groups":[{"groupId":1,"isAdmin":false},{"groupId":2,"isAdmin":true}]},"meta":{"msg":"OK","status":200}}}
        localStorage.setItem('userData', JSON.stringify(userData))

        this.$router.push('/main')
      } else if (values.username === 'admin' && values.password === '123') {
        localStorage.setItem('username', 'admin')

        const userData = {"data": {"data":{"userId":1,"username":"admin","token":"18938498","isSysAdmin":true,"isGroupAdmin":true,"groups":[{"groupId":1,"isAdmin":true},{"groupId":2,"isAdmin":false}]},"meta":{"msg":"OK","status":200}}}
        localStorage.setItem('userData', JSON.stringify(userData))

        this.$router.push('/main')
      } else if (values.username === 'Mia' && values.password === '123') {
        localStorage.setItem('username', 'Mia')

        const userData = {"data": {"data":{"userId":3,"username":"Mia","token":"18938466","isSysAdmin":false,"isGroupAdmin":false,"groups":[{"groupId":1,"isAdmin":false},{"groupId":2,"isAdmin":false}]},"meta":{"msg":"OK","status":200}}}
        localStorage.setItem('userData', JSON.stringify(userData))

        this.$router.push('/main')
      } else {
        // Toast('尚无登录权限，请联系管理员')

        localStorage.setItem('username', this.username)

        const userData = {"data": {"data":{"userId":3,"username": this.username,"token":"18938466","isSysAdmin":false,"isGroupAdmin":false,"groups":[{"groupId":1,"isAdmin":false},{"groupId":2,"isAdmin":false}]},"meta":{"msg":"OK","status":200}}}
        localStorage.setItem('userData', JSON.stringify(userData))

        this.$router.push('/main')
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
  margin-top: 30%;
}

.btn-margin{
  margin: 16px;
}

.logo{
  display: block;
  margin: 60px auto;
  width: 115px;
}
</style>
