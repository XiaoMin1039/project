<template>
  <div class="agent-manage">
    <div class="search search-box">
      <el-form ref="search" :model="search" label-width="120px">
        <el-col :span="12">
          <el-form-item label="代理商账号：">
            <el-input size="small" v-model="search.account" placeholder="请输入代理商账号"></el-input>
          </el-form-item>
        </el-col>
  
        <el-col :span="12">
          <el-form-item label="状态:">
            <el-select size="small" v-model="search.account_state" placeholder="请选择">
              <el-option v-for="item in state" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      <el-col :span="24" class="line">
        <el-button type="primary" @click="onSearch">搜索</el-button>
      </el-col>
    </div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in state" :key="item.value" :label="item.label" :name="item.value"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="result" v-show="!(loading || unfind )">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="agentsId" label="ID" width="100">
        </el-table-column>
        <el-table-column prop="agentsAccount" label="账号" width="180">
        </el-table-column>
        <el-table-column prop="shopName" label="店铺名称">
        </el-table-column>
        <el-table-column prop="phoneNumber" label="手机号">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="primary" size="mini" v-if="scope.row.accountState == 1" @click.native="agree(scope.row.agentsId)">通过</el-button>
            <el-button type="primary" size="mini" v-if="scope.row.accountState == 1">拒绝</el-button>
            <el-button type="primary" size="mini" v-if="scope.row.accountState == 2" @click.native="frozen(scope.row.agentsId)">冻结</el-button>
            <el-button type="primary" size="mini" v-if="scope.row.accountState == 3" @click.native="unfrozen(scope.row.agentsId)">解冻</el-button>
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
export default {
  name: 'AgentManage',
  data() {
    return {
      activeName: '0',
      search: {
        account: null,
        account_state: '0',
        rows: 15
      },
      totPage: 0,
      state: [
        {
          label: '所有',
          value: '0'
        },
        {
          label: '审核',
          value: '1'
        },
        {
          label: '正常',
          value: '2'
        },
        {
          label: '锁定',
          value: '3'
        }
      ],
      loading: false,
      unfind: false,
      totPage: 0,
      list: []
    }
  },
  methods: {
    handleCurrentChange(page) {
      this.fetchData(page)
    },
    agree(id) {
      this.$confirm(`是否通过代理商ID为${id}的审核?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('/admin/agentsAccount/audit', { agents_id: id, result: '1', note: '1' }).then(({ data }) => {
          if (data.content != 1) this.$message.error('服务器错误')
          else {
            this.$message.success(`通过代理商${id}的审核`)
            this.list = this.list.map(item => {
              const t = item
              if (item.agentsId == id) t.accountState = 2
              return t
            })
          }
        })
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    frozen(id) {
      console.log(id)
      this.axios.post('/admin/agentsAccount/freeze', { agents_id: id }).then(({ data }) => {
        if (data.content != 1) this.$message.error('服务器错误')
        else {
          this.$message.success('冻结成功')
          this.list = this.list.map(item => {
            const t = item
            if (item.agentsId == id) t.accountState = 3
            return t
          })
        }
      })
    },
    unfrozen(id) {
      this.axios.post('/admin/agentsAccount/cancle_freeze', { agents_id: id }).then(({ data }) => {
        if (data.content != 1) this.$message.error('服务器错误')
        else {
          this.$message.success('解冻成功')
          this.list = this.list.map(item => {
            const t = item
            if (item.agentsId == id) t.accountState = 2
            return t
          })
        }
      })
    },
    onSearch() {
      this.activeName = this.search.account_state
      this.fetchData(1, true)
    },
    handleClick(tab) {
      this.search.account_state = tab.name
      this.activeName = tab.name
      this.fetchData(1, true)
    },
    fetchData(page, first) {
      this.loading = true
      this.unfind = false
      const data = {
        ...this.search,
        page
      }
      if (!first) data['countPage'] = this.totPage
      this.axios.post('/admin/agentsAccount/gets', data).then(({ data }) => {
        this.loading = false
        if (data.content != 1) this.$message.error('服务器错误')
        else {
          if (first) this.totPage = data.countPage
          if (data.agentsList.length == 0) this.unfind = true
          this.list = data.agentsList
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
.agent-manage {
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
  .tabs {
    background-color: #fff;
    margin-top: 10px;
    padding: 0;
  }
  .el-select {
    width: 100%;
  }
}
</style>
