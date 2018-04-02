<template>
  <div class="user-charge">
    <!-- <div class="search search-box">
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
                                </div> -->
    <div class="result" v-show="!(loading || unfind)">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="chongZhiId" label="充值ID" width="100">
        </el-table-column>
        <el-table-column label="充值类型" show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.role == 1 ? '用户' : '代理商'}}
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="充值金额" show-overflow-tooltip>
        </el-table-column>

        <el-table-column label="是否到账" show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.isMoneyTo == 0?'到账':'未到账'}}
          </template>
        </el-table-column>
        <el-table-column label="充值时间" show-overflow-tooltip>
          <template scope="scope">
            {{timeFormat(scope.row.createTime)}}
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
  name: 'UserCharge',
  data() {
    return {
      search: {
        rows: 10
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
    // onSearch() {

    // },
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
      this.axios.post('/admin/recharge/gets', data).then(({ data }) => {
        this.loading = false
        if (data.content != 1) this.$message.error('服务器错误')
        else {
          if (data.object.length === 0) this.unfind = true
          if (first) this.totPage = data.countPage
          this.list = data.object
        }
      }).catch(err => console.log(err))
    }
  },
  mounted() {
    this.fetchData(1, true)
  }
}
</script>
<style lang="less" scoped>
.user-charge {
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
