<template>
  <div class="verify">
    <div class="info">
      <ul>
        <li>
          <span>订单编号：</span>{{product.productId}}
        </li>
        <li>
          <span>游戏分类和大区：</span>{{product.ziZoneName}}
        </li>
        <li>
          <span>分成：</span>{{product.rate}}%
        </li>
        <li>
          <span>用户/代理商账号：</span>{{product.userAccount}}
        </li>
        <li>
          <span>游戏账号：</span>{{product.gameAccount}}
          <el-button type="primary" size="mini" :data-clipboard-text="product.gameAccount" class="copy">复制</el-button>
        </li>
        <li>
          <span>游戏密码：</span>{{product.gamePasswd}}
          <el-button type="primary" size="mini" :data-clipboard-text="product.gamePasswd" class="copy">复制</el-button>
        </li>
        <li>
          <span>是否允许排位：</span>{{gameLimit(0)}}
        </li>
        <li>
          <span>是否允许使用金币：</span>{{gameLimit(1)}}
        </li>
        <li>
          <span>是否允许挂机：</span>{{gameLimit(2)}}
        </li>
        <li>
          <span>是否允许送人头：</span>{{gameLimit(3)}}
        </li>
      </ul>
    </div>
    <div class="result">
      <el-col :span="24" class="radio">
        <el-radio class="radio" v-model="radio" label="1">审核通过</el-radio>
        <el-radio class="radio" v-model="radio" label="0">审核失败</el-radio>
      </el-col>
      <el-col :span="12">
        <el-input size="small" v-model="role_name" placeholder="请输入角色名称" style="margin-bottom: 10px;">
        </el-input>
      </el-col>
      <el-input type="textarea" :autosize="{ minRows: 2}" placeholder="请输入理由" v-model="note">
      </el-input>
      <el-col :span="24" style="margin-top: 20px;text-align: center;">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="goBack">返回</el-button>
      </el-col>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Verify',
  data() {
    return {
      product_id: '',
      product: {
        gameLimits: '0000'
      },
      radio: '1',
      note: '',
      role_name: ''
    }
  },
  methods: {
    submit() {
      if (!this.note) {
        this.$message.error('请填写理由')
        return
      }
      const data = {
        product_id: this.product_id,
        result: this.radio,
        note: this.note,
        role_name: this.role_name
      }
      this.axios.post('/admin/product/audit/set', data).then(({ data }) => {
        if (data.content != 1) this.$message.error('服务器错误')
        else {
          this.$message.success('提交成功')
          this.$router.go(-1)
        }
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    gameLimit(i) {
      return this.product.gameLimits[i] == '0' ? '否' : '是'
    },
    fetchData() {
      this.axios.post('/admin/product/audit/get', { product_id: this.product_id }).then(({ data }) => {
        if (data.content != 1) this.$message.error('服务器错误')
        else this.product = data.product
      })
    }
  },
  mounted() {
    this.product_id = this.$route.params.id
    this.fetchData()
    const cli = new Clipboard('.copy')
    cli.on('success', (e) => {
      this.$message.success('复制成功')
    })
    cli.on('error', () => {
      this.$message.error('复制失败')
    })
  }
}
</script>
<style lang="less" scoped>
.verify {
  background-color: #fff;
  margin-top: 10px;
  padding: 20px 20px 20px 20px;
  ul {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    list-style: none;
    li {
      width: 50%;
      line-height: 30px;
      span {
        display: inline-block;
        width: 160px;
        text-align: right;
      }
    }
  }
  .radio {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .result {
    display: flex;
    flex-direction: column;
  }
}
</style>
