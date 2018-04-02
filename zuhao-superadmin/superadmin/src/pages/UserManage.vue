<template>
  <div class="user-manage">
    <div class="search search-box">
      <el-form ref="search" :model="search" label-width="120px">
        <el-col :span="12">
          <el-form-item label="用户账号：">
            <el-input size="small" v-model="search.account" placeholder="请输入用户账号"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <el-col :span="24" class="line">
        <el-button type="primary" @click="onSearch">搜索</el-button>
      </el-col>
    </div>
    <div class="result" v-show="!(loading || unfind)">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="userId" label="ID" width="100">
        </el-table-column>
        <el-table-column prop="userAccount" label="账号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="phoneNumber" label="手机号" width="130">
        </el-table-column>
        <el-table-column label="QQ" width="80">
          <template scope="scope">
            {{scope.row.qqOpenId ? '是' : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="totalMoney" label="余额">
        </el-table-column>
        <el-table-column prop="unUsableMoney" label="不可用余额">
        </el-table-column>
        <el-table-column label="身份证" width="80">
          <template scope="scope">
            {{scope.row.isIDCard ? '是' : ''}}
          </template>
        </el-table-column>
        <el-table-column label="实名" width="80">
          <template scope="scope">
            {{scope.row.realName || ''}}
          </template>
        </el-table-column>
        <el-table-column label="注册时间" show-overflow-tooltip>
          <template scope="scope">
            {{timeFormat(scope.row.registerTime)}}
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
import { timeFormat } from '../utils'
export default {
  name: 'UserManage',
  data() {
    return {
      search: {
        rows: 10,
        account: null
      },
      totPage: 0,
      loading: false,
      unfind: false,
      list: []
    }
  },
  methods: {
    timeFormat(t) {
      return timeFormat(t)
    },
    onSearch() {
      this.fetchData(1, true)
    },
    handleCurrentChange(val) {
      this.fetchData(val)
    },
    fetchData(page, first) {
      this.loading = true
      this.unfind = false
      const data = {
        ...this.search,
        page
      }
      if (!first) data['countPage'] = this.totPage
      this.axios.post('/admin/userAccount/gets', data).then(({ data }) => {
        this.loading = false
        if (data.content != 1) this.$message.error('服务器错误')
        else {
          if (data.users.length === 0) this.unfind = true
          if (first) this.totPage = data.countPage
          this.list = data.users
        }
      })
    }
  },
  mounted() {
    this.fetchData(1, true)
  }
}
</script>
<style lang="less" scoped>
.user-manage {
  display: flex;
  flex-direction: column;
  .line {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    border-top: 1px solid #e2e2e2;
    padding-top: 15px;
  }
  .search {
    margin-top: 10px;
  }
}
</style>

