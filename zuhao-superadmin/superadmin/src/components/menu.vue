<template>
  <div class="menu">
    <div class="menu-top">
      <h1>管理后台</h1>
    </div>
    <div class="menu-panel" v-for="(item, index) in menuList" :key="index">
      <div class="menu-panel-title">
        <icon class="icon" :name="item.icon" v-if="item.icon != ''" scale="1.2"></icon>
        {{item.name}}
      </div>
      <a class="menu-item" v-for="(item1, index1) in item.children" :key="index1" v-if="!item1.hide" :href="item1.path">{{item1.name}}</a>
    </div>
  </div>
</template>
<script>
import menuItems from '../router/menu'
export default {
  name: 'menu',
  mounted() {
    // console.log(menuItems)
  },
  data() {
    return {
      menuList: menuItems
    }
  }
}
</script>
<style lang="less" scoped>
.menu {
  width: 220px;
  display: flex;
  flex-direction: column;
  .menu-top {
    background-color: #181A1C;
    padding: 0 15px;
    h1 {
      line-height: 40px;
      font-size: 13px;
      color: #fff;
    }
  }
  .menu-panel {
    background-color: #fff;
    padding: 15px 10px 10px 10px;
    border-bottom: 1px solid #eee;
    .menu-panel-title {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      color: #333;
      font-weight: bold;
      font-size: 13px;
      line-height: 25px;
      .icon {
        color: #2fa0de;
        margin-right: 10px;
      }
    }
    .menu-item {
      display: inline-block;
      color: #666;
      font-size: 12px;
      line-height: 25px;
      width: 100px;
      text-decoration: none;
      &:hover {
        color: #2fa0de;
        text-decoration: underline;
      }
    }
  }
}
</style>
