<template>
  <div class="loading">
    <div class="load" v-if="loading">
      <img src="../assets/loadingone.gif" alt="">
      <span>正在为主人搜索中
        <br>~~~~~~~(>_
        <)~~~~~~~</span>
    </div>
    <div class="unfind" v-if="unfind">
      <img src="../assets/cry.svg" alt="">
      <span>没有搜索到任何信息
        <br>{{message||'主人可以尝试调整搜索条件.'}}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'loading',
  props: {
    loading: {
      required: false
    },
    unfind: {
      required: false
    },
    message: {
      required: false
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="less" scoped>
.loading {
  margin-top: 10px;
  background-color: #fff;
  padding: 20px 0px;
  .load {
    display: flex;
    justify-content: center;
    color: #ddd;
    span {
      margin-top: 15px;
      line-height: 30px;
      text-align: center;
    }
    img {
      height: 75px;
      width: 70px;
    }
  }
  .unfind {
    display: flex;
    justify-content: center;
    color: #000;
    span {
      line-height: 25px;
      text-align: center;
    }
    img {
      height: 50px;
      width: 50px;
    }
  }
}
</style>
