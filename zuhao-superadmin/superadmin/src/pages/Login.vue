<template>
  <div class="login">
    <div class="contain">
      <div class="left">
        <img src="../assets/face@2x.png" alt="">
      </div>
      <div class="right">
        <p class="title">
          <span>超级管理员登录</span>
        </p>
        <div class="input-group">
          <div class="input">
            <span>账号</span>
            <input type="text" placeholder="可输入绑定手机号或用户名" v-model="username">
          </div>
          <div class="input">
            <span>密码</span>
            <input type="password" placeholder="密码" v-model="password">
          </div>
          <div class="input code">
            <span>验证码</span>
            <input type="text" placeholder="验证码" v-model="code" @keyup.enter="submit">
            <img :src="codeUrl" alt="" @click="refresh">
          </div>
        </div>
        <div class="submit">
          <el-button type="primary" @click="submit">登陆</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      code: '',
      timestamp: ''
    }
  },
  computed: {
    codeUrl() {
      return 'http://192.168.31.39:8080/api/image/' + this.timestamp
      // return 'http://www2017.zudahao.com:8080/api/image/' + this.timestamp
    }
  },
  mounted() {
    this.timestamp = new Date().getTime()
  },
  methods: {
    refresh() {
      this.timestamp = new Date().getTime()
    },
    submit() {
      if (!this.username) {
        this.$message.error('请填写用户名')
        return
      }
      if (!this.password) {
        this.$message.error('请填写密码')
        return
      }
      if (!this.code) {
        this.$message.error('请填写验证码')
        return
      }
      const data = {
        valid_code: this.code,
        account: this.username,
        pass: this.password
      }
      this.axios.post('/login', data).then(({ data }) => {
        if (data.content != 1) {
          this.$message.error(data.data)
          this.refresh()
        } else {
          const redirect = this.$route.query.redirect || '/'
          this.$router.replace({ path: redirect })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  .contain {
    display: flex;
    flex-direction: row;
    width: 960px;
    height: 770px;
    box-shadow: 1px 1px 5px #ddd;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    .left {
      img {
        width: 480px;
      }
    }
    .right {
      padding-top: 60px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      width: 340px;
      padding-left: 70px;
      padding-right: 70px;
      height: 370px;
      .title {
        width: 100%;
        text-align: center;
        border-bottom: 1px solid #DDDDDD;
        padding-bottom: 8px;
        span {
          font-size: 22px;
          color: #6FB0EF;
          padding-bottom: 10px;
          border-bottom: 2px solid #6FB0EF;
        }
      }
      .input-group {
        height: 180px;
        .input {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 60px;
          border-bottom: 1px solid rgb(221, 221, 221);
          span {
            padding-left: 20px;
            font-size: 14px;
          }
          input {
            width: 250px;
            border: none;
            &::-webkit-input-placeholder {
              /* WebKit browsers */
              color: #999;
            }
            &:-moz-placeholder {
              /* Mozilla Firefox 4 to 18 */
              color: #999;
            }
            &::-moz-placeholder {
              /* Mozilla Firefox 19+ */
              color: #999;
            }
            &:-ms-input-placeholder {
              /* Internet Explorer 10+ */
              color: #999;
            }
          }
        }
        .code {
          input {
            width: 100px;
          }
        }
      }
      .submit {
        text-align: center;
        margin-top: 30px;
      }
    }
  }
}
</style>


