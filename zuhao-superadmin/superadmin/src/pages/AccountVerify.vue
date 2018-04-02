<template>
  <div class="account-verify">
    <div class="search search-box">
      <el-form ref="search" :model="search" label-width="120px">
        <el-col :span="12">
          <el-form-item label="用户账号:">
            <el-input size="small" v-model="search.user_account" placeholder="请输入用户账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="代理商账号:">
            <el-input size="small" v-model="search.agents_account" placeholder="请输入代理商账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="游戏分类和大区:">
            <Gamepick :defaultValue="zizone" @onChange="gameChange"></Gamepick>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="游戏账号:">
            <el-input size="small" v-model="search.game_account" placeholder="请输入游戏账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="line">
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-col>
      </el-form>
    </div>
    <div class="result" v-show="!(loading || unfind)">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="productId" label="产品编号" width="120">
        </el-table-column>
        <el-table-column label="提交时间" width="200">
          <template scope="scope">
            {{timeFormat(scope.row.lastCheckTime)}}
          </template>
        </el-table-column>
        <el-table-column label="游戏分类" width="120">
          <template scope="scope">
            {{scope.row.ziZoneName.split('/')[0]}}
          </template>
        </el-table-column>
        <el-table-column label="游戏大区" width="120">
          <template scope="scope">
            {{scope.row.ziZoneName.split('/')[1] || ''}}
          </template>
        </el-table-column>
        <el-table-column label="游戏子区" width="120">
          <template scope="scope">
            {{scope.row.ziZoneName.split('/')[2] || ''}}
          </template>
        </el-table-column>
        <el-table-column prop="userAccount" label="用户/商家账号">
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template scope="scope">
            <el-button size="mini" type="primary" @click="verify(scope.row.productId)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" :page-count="totPage" layout="prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
    <loading :loading="loading" :unfind="unfind" v-if="loading || unfind"></loading>
  
  </div>
</template>
<script>
import { filterNumber, timeFormat, toNow } from '../utils'
export default {
  name: 'AccountVerify',
  data() {
    return {
      search: {
        user_account: null,
        agents_account: null,
        game_account: null,
        rows: 15,
        zizone: 0
      },
      zizone: 0,
      loading: false,
      unfind: false,
      totPage: 0,
      list: []
    }
  },
  methods: {
    verify(id) {
      this.axios.post('/admin/product/check', { product_id: id }).then(({ data }) => {
        if (data.content != 1) this.$message.error('服务器错误')
        else this.$router.push({ name: 'Verify', params: { id } })
      })
    },
    handleCurrentChange(val) {
      this.fetchData(val)
    },
    timeFormat(t) {
      return timeFormat(t)
    },
    gameChange(val) {
      this.zizone = val
      this.search.zizone = val
    },
    onSearch() {
      this.fetchData(1, true)
    },
    onReset() {
      const keys = Object.keys(this.search)
      keys.forEach(function (item) {
        this.search[item] = null
      }, this);
      this.search.rows = 15
      this.search.zizone = 0
      this.zizone = 0
      this.fetchData(1, true)
    },
    fetchData(page, first) {
      this.unfind = false
      this.loading = true
      const data = {
        ...this.search,
        page
      }
      if (!first) data['countPage'] = this.totPage
      this.axios.post('/admin/product/getAudit', data).then(({ data }) => {
        this.loading = false
        if (data.content != 1) this.$message.error('服务器错误')
        else {
          this.list = data.products
          if (first) this.totPage = data.countPage
          if (data.products.length == 0) this.unfind = true
        }
      }).catch(err => {
        this.loading = false
      })
    }
  },
  mounted() {
    this.fetchData(1, true)
  }
}
</script>
<style lang="less" scoped>
.account-verify {
  @import '../style/search.less';
  display: flex;
  flex-direction: column;
}
</style>
