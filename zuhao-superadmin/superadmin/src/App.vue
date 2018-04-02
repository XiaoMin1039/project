<template>
  <div id="app">
    <div class="header" v-if="login">
      <div class="logo">
        <img src="./assets/logo.png" alt="">
      </div>
      <div class="tools">
        <el-button type="danger" @click="logout">注销</el-button>
      </div>
    </div>
    <div class="body">
      <Menu v-if="login"></Menu>
      <div class="main">
        <div class="bread" v-if="login">
          <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/' }">后台首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in bread" :key="item.name">{{item.name}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="route">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
import menuList from './router/menu'
export default {
  name: 'app',
  computed: {
    login() {
      return this.$route.name !== 'Login'
    }
  },
  data() {
    return {
      bread: []
    }
  },
  methods: {
    logout() {
      this.axios.get('/logout').then(() => {
        this.$router.replace({ path: '/login' })
      }).catch(err => {
        this.$message.error('服务器错误')
      })
    }
  },
  mounted() {
    const name = this.$route.name
    this.bread = []
    menuList.forEach(function (item, index) {
      if (item.children) {
        item.children.forEach(function (element) {
          if (element.value === name) {
            this.bread.push({
              name: item.name,
              path: ''
            }, {
                name: element.name,
                path: ''
              })
          }
        }, this);
      }
    }, this);
  },
  watch: {
    '$route'(to, from) {
      const path = to.name
      this.bread = []
      menuList.forEach(function (item, index) {
        if (item.children) {
          item.children.forEach(function (element) {
            if (element.value === path) {
              this.bread.push({
                name: item.name,
                path: ''
              }, {
                  name: element.name,
                  path: ''
                })
            }
          }, this);
        }
      }, this);
    }
  }
}
</script>

<style lang="less">
@import 'style/reset.less';
#app {
  display: flex;
  flex-direction: column;
  .header {
    padding-left: 60px;
    padding-right: 60px;
    background-color: #2A2F32;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 64px;
      background-color: #181A1C;
      width: 220px;
      img {
        height: 26px;
      }
    }
    .tools {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .body {
    display: flex;
    justify-content: center;
    padding-top: 10px;
    padding-left: 60px;
    padding-right: 60px;
    .main {
      margin-left: 20px;
      width: 1020px;
      .bread {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 10px 0 10px;
        border: 1px solid #eee;
        background-color: #fff;
      }
    }
  }
}
</style>
