<template>
  <div class="withdraw-cash">
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in states" :key="item.value" :label="item.label" :name="item.value"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="result" v-show="!(loading || unfind)">
      <el-table :data="list" style="width: 100%" :row-class-name="tableRowClassName">
        <el-table-column prop="rechargeId" label="提现编号" width="100">
        </el-table-column>
        <el-table-column label="提现金额" width="120">
          <template scope="scope">
            {{-scope.row.addMoney}}元
          </template>
        </el-table-column>
        <el-table-column label="代理商账号" width="160">
          <template scope="scope">
            {{scope.row.agentsAccount}}
          </template>
        </el-table-column>
        <el-table-column prop="checkPerson" label="处理客服编号" width="160">
        </el-table-column>
        <el-table-column label="申请时间">
          <template scope="scope">
            {{timeFormat(scope.row.creatTime)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template scope="scope">
            <el-button type="primary" @click="check(scope.row)" size="mini" v-if="scope.row.financeState == 1">处理</el-button>
            <el-button type="primary" @click="uncheck(scope.row)" size="mini" v-if="scope.row.financeState == 2">解锁</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" :page-count="totPage" layout="prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
    <el-dialog class="dialog" :title="`处理代理商：${info.agentsAccount} 的提现`" :visible.sync="dialog" size="tiny" :before-close="dialogClose">
      <p>提现金额：
        <span>{{-info.addMoney}}</span>元
      </p>
      <p>提现方式：{{rechargeWay[info.rechargeWay]}}
      </p>
      <p>提现账号：{{info.rechargeAccount}}
        <el-button :data-clipboard-text="info.rechargeAccount || '-1'" class="copy" type="primary" size="mini">复制</el-button>
      </p>
      <p>实名信息：{{info.realName}}</p>
      <p>
        <el-radio class="radio" v-model="radio" label="1">提现成功</el-radio>
        <el-radio class="radio" v-model="radio" label="0">提现失败</el-radio>
      </p>
      <p :class="!orderNumber ? 'disabled' : '' " v-if="radio == 1">
        流水号：
        <input v-model="orderNumber" type="text" placeholder="请填写流水号/订单号">
      </p>
      <p :class="!errorInput ? 'disabled' : '' " v-if="radio != 1">
        原因：
        <input v-model="errorInput" type="text" placeholder="请填写原因">
      </p>
      <div style="text-align: center;margin-top: 10px;">
        <el-button type="primary" :disabled="(radio == '1' && orderNumber == '') || (radio != '1' && errorInput == '')" @click="submitResult">提交</el-button>
      </div>
    </el-dialog>
    <loading :loading="loading" :unfind="unfind" v-if="loading || unfind" message="------------"></loading>
  </div>
</template>
<script>
import { filterNumber, timeFormat, toNow } from '../utils'
export default {
  name: 'WithdrawCash',
  data() {
    return {
      states: [
        {
          label: '所有申请',
          value: '0'
        },
        {
          label: '待审核',
          value: '1'
        },
        {
          label: '审核中',
          value: '2'
        },
        {
          label: '提现成功',
          value: '4'
        },
        {
          label: '提现失败',
          value: '5'
        }
      ],
      activeName: '0',
      loading: false,
      unfind: false,
      list: [],
      info: {},
      dialog: false,
      totPage: 0,
      input: '',
      rechargeWay: {
        '0': '未知',
        '1': '支付宝'
      },
      orderNumber: '',
      radio: '1',
      errorInput: ''
    }
  },
  methods: {
    submitResult() {
      const data = {
        recharge_id: this.info.rechargeId,
        result: this.radio,
        serial_id: this.orderNumber,
        note: this.errorInput,
        admin_id: 1
      }
      this.axios.post('/admin/withdraw/agents/result', data).then(({ data }) => {
        if (data.content != 1) this.$message.error('服务器发生错误')
        else {
          this.$message.success('处理成功')
          this.list = this.list.map(item => {
            let t = item
            if (item.rechargeId == this.info.rechargeId) t.financeState = (this.radio == '1' ? '4' : '5')
            return t
          })
          this.radio = '1'
          this.errorInput = ''
          this.orderNumber = ''
          this.dialog = false
        }
      })
    },
    uncheck(row) {
      this.axios.post('/admin/withdraw/agents/cancle_check', { recharge_id: row.rechargeId, admin_id: 1 }).then(({ data }) => {
        if (data.content !== 1) this.$message.error('服务器发生错误')
        else {
          this.list = this.list.map(item => {
            let t = item
            if (item.rechargeId == row.rechargeId) t.financeState = 1
            return t
          })
        }
      })
    },
    dialogClose(done) {
      this.axios.post('/admin/withdraw/agents/cancle_check', { recharge_id: this.info.rechargeId, admin_id: 1 }).then(({ data }) => {
        if (data.content !== 1) this.$message.error('服务器发生错误')
        else {
          this.list = this.list.map(item => {
            let t = item
            if (item.rechargeId == this.info.rechargeId) t.financeState = 1
            return t
          })
          this.radio = '1'
          this.errorInput = ''
          this.orderNumber = ''
          done()
        }
      })
    },
    check(row) {
      this.info = row
      this.axios.post('/admin/withdraw/agents/check', { recharge_id: row.rechargeId }).then(({ data, status }) => {
        if (data.content != 1) {
          if (data.content == 652) this.$message.warning('此提现正在处理')
          else this.$message.error('发生错误')
        } else {
          this.list = this.list.map(item => {
            let t = item
            if (item.rechargeId == row.rechargeId) t.financeState = 2
            return t
          })
          this.info = data.agentsRechargeDto
          this.dialog = true
        }
      })
    },
    tableRowClassName(row, index) {
      if (row.financeState === 2) return 'info-row'
      // if (row.financeState === 4) return 'success-row'
      // if (row.financeState === 5) return 'error-row'
    },
    timeFormat(t) {
      return timeFormat(t)
    },
    handleCurrentChange(val) {
      this.fetchData(val)
    },
    handleClick(tab) {
      this.activeName = tab.name
      this.fetchData(1, true)
    },
    fetchData(page, first) {
      this.loading = true
      this.unfind = false
      const data = {
        page,
        rows: 15,
        state: this.activeName
      }
      if (!first) data['count_page'] = this.totPage
      this.axios.post('/admin/withdraw/agents/gets', data).then(({ data, status }) => {
        this.loading = false
        if (data.content !== 1) {
          this.$message.error('服务器错误！')
        } else {
          this.list = data.agentsRecharges
          if (first) this.totPage = data.countPage
          if (data.agentsRecharges.length == 0) this.unfind = true
        }
      }).catch(err => {
        this.$message.error('服务器错误！')
      })
    }
  },
  mounted() {
    this.fetchData(1, true)
    const cli = new Clipboard('.copy')
    cli.on('success', (e) => {
      if (e.text == -1) this.$message.error('复制失败')
      else this.$message.success('复制成功')
    })
    cli.on('error', () => {
      this.$message.error('复制失败')
    })
  }
}
</script>
<style lang="less" scoped>
.withdraw-cash {
  .tabs {
    background-color: #fff;
    margin-top: 10px;
    padding: 0;
  }
  .result {
    margin-top: 20px;
    .el-table {
      .info-row {
        background-color: #c9e5f5;
      }
      .success-row {
        background-color: #e2f0e4;
      }
      .error-row {
        background-color: lighten(#FF4949, 0.5);
      }
    }
  }
  .dialog {
    p {
      padding-left: 20px;
      line-height: 40px;
      font-size: 16px;
      &:first-child {
        background-color: #333;
        font-size: 20px;
        color: #fff;
        padding-bottom: 5px;
        padding-top: 5px;
        span {
          font-size: 50px;
          margin-left: 30px;
          margin-right: 10px;
        }
      }
      input {
        border: 1px solid #333;
        width: 300px;
        font-size: 16px;
        padding-left: 5px;
      }
    }
    .disabled {
      background-color: lighten(#FF4949, 25%);
    }
  }
}
</style>
