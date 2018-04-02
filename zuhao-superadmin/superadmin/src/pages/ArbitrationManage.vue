<template>
  <div class="arbitration-manage">
    <div class="search search-box">
      <el-form ref="search" :model="search" label-width="80px">
        <el-col :span="12">
          <el-form-item label="订单ID：">
            <el-input size="small" v-model="search.order_id" placeholder="请输入订单ID"></el-input>
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
    <div class="result" v-show="!(loading || unfind)">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="orderId" label="订单编号" width="180">
        </el-table-column>
        <el-table-column label="投诉方" width="100">
          <template scope="scope">
            {{scope.row.claimRole == '1' ? '用户' : '代理商'}}
          </template>
        </el-table-column>
        <el-table-column label="投诉原因" width="180">
          <template scope="scope">
            {{claimType[scope.row.claimType]}}
          </template>
        </el-table-column>
        <el-table-column label="投诉时间">
          <template scope="scope">
            {{timeFormat(scope.row.claimCreateTime)}}
          </template>
        </el-table-column>
        <el-table-column label="处理状态" width="140">
          <template scope="scope">
            {{claimState[scope.row.claimState]}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template scope="scope">
            <el-button type="primary" size="mini" @click="check(scope.row.orderId, scope.row.claimState)">{{scope.row.claimState != '2' ? '查看' : '仲裁'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" :page-count="totPage" layout="prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
    <loading message="----------" :loading="loading" :unfind="unfind" v-if="loading || unfind"></loading>
  </div>
</template>
<script>
import { filterNumber, timeFormat, toNow } from '../utils'
export default {
  name: 'ArbitrationManage',
  data() {
    return {
      loading: false,
      unfind: false,
      activeName: '2',
      state: [
        {
          label: '所有状态',
          value: '0'
        },
        {
          label: '交涉中',
          value: '1'
        },
        {
          label: '后台仲裁中',
          value: '2'
        },
        {
          label: '通过',
          value: '3'
        },
        {
          label: '失败',
          value: '4'
        },
        {
          label: '撤销',
          value: '5'
        }

      ],
      search: {
        order_id: null,
        state: '2',
        rows: 15
      },
      list: [],
      totPage: 0,
      claimType: {
        '1': '产品描述不符',
        '2': '卖家骚扰',
        '3': '密码错误',
        '4': '无法正常登录',
        '5': '撤单',
        '6': '其他'
      },
      claimState: {
        '1': '交涉中',
        '2': '后台仲裁中',
        '3': '通过',
        '4': '失败',
        '5': '撤销'
      }
    }
  },
  methods: {
    onSearch() {
      this.fetchData(1, true)
    },
    check(id, state) {
      this.search.order_id = ''
      if (state != 2) {
        this.$router.push({ name: 'Arbitration', params: { id } })
      } else {
        this.axios.post('/admin/claim/check', { order_id: id, admin_id: '2' }).then(({ data, status }) => {
          if (data.content == 1) {
            this.$router.push({ name: 'Arbitration', params: { id } })
          } else if (data.content == 411) {
            this.$message.error('该订单正在仲裁')
          }
        }).catch(err => {
          this.$message.error('服务器发生错误！')
        })
      }
    },
    handleCurrentChange(val) {
      this.fetchData(val)
    },
    timeFormat(t) {
      return timeFormat(t)
    },
    handleClick(val) {
      this.search.state = val.name
      this.activeName = val.name
      this.fetchData(1, true)
    },
    fetchData(page, first) {
      this.loading = true
      this.unfind = false
      const data = {
        ...this.search,
        page
      }
      console.log(data);
      if (!first) data['countPage'] = this.totPage
      this.axios.post('/admin/claim/gets', data).then(({ data, status }) => {
        this.loading = false
        if (data.content === 1) {
          if (data.claimOrderList.length === 0) this.unfind = true
          this.list = data.claimOrderList
          if (first) this.totPage = data.countPage
        } else {
          this.$message.error(data.data)
        }
      }).catch(err => {
        this.$message.error('服务器错误')
      })
    }
  },
  mounted() {
    this.search.order_id = this.$route.query.id || ''
    if (this.$route.query.id) {
      this.activeName = '0'
      this.search.state = '0'
    }
    this.fetchData(1, true)
  }
}
</script>
<style lang="less" scoped>
.arbitration-manage {
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
  .result {
    margin-top: 20px;
  }
}
</style>
