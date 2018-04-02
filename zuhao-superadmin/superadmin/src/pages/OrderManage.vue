<template>
  <div class="order-manage">
    <div class="search search-box">
      <el-form ref="search" :model="search" label-width="120px">
        <el-col :span="12">
          <el-form-item label="用户账号:">
            <el-input size="small" v-model="search.userAccount" placeholder="请输入用户账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="代理商账号:">
            <el-input size="small" v-model="search.agentsAccount" placeholder="请输入代理商账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单ID:">
            <el-input size="small" v-model="search.orderId" placeholder="请输入订单ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单状态:">
            <el-select size="small" v-model="search.orderState" @change="selectChange" placeholder="请选择">
              <el-option v-for="item in orderState" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品ID:">
            <el-input size="small" v-model="search.productId" placeholder="请输入产品ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上号激活码CDK:">
            <el-input size="small" v-model="search.orderCdk" placeholder="请输入上号激活码cdk"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开始时间:">
            <el-date-picker size="small" v-model="search.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间:">
            <el-date-picker size="small" v-model="search.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="line">
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-col>
      </el-form>
    </div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="tabOnClick">
        <el-tab-pane v-for="item in orderState" :key="item.value" :label="item.label" :name="item.value"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="result" v-show="!(loading || unfind)">
      <div class="result-top">
        <ul>
          <li class="account">账号信息</li>
          <li class="payment">实付款</li>
          <li class="status">交易状态</li>
          <li class="time">租赁时间</li>
          <li class="operation">交易操作</li>
        </ul>
      </div>
      <div class="order-form-item" v-for="(item, index) in orderList" :key="index" :class="item.orderState == '1'?'active':''">
        <div class="order-item-top">
          <ul>
            <li>上号激活码：
              <span>{{item.orderCdk}}</span>
            </li>
            <li v-if="item.userAccount !== null">用户：
              <span>{{item.userAccount}}
              </span>
            </li>
            <li v-if="item.agentsAccount !== null">商家：
              <span>{{item.agentsAccount}}
              </span>
            </li>
            <li v-if="item.shopName !== null">店铺名称：
              <span>{{item.shopName}}
              </span>
            </li>
            <span style="display: relative; display: flex;align-items: center">
              <el-tooltip class="item" effect="dark" content="查看监控" placement="top">
                <icon name="laptop" scale="1.4" @click.native="control(item.orderId)"></icon>
              </el-tooltip>
            </span>
          </ul>
        </div>
        <div class="order-item-bottom">
          <ul>
            <li class="account">
              <p>
                <a :href="`http://www.zudahao.com/product/${item.productId}.html`" target="_blank">
                  {{item.productTitle}}
                </a>
              </p>
              <p>游戏分类和大区：
                <span class="lightblue">{{item.zoneName}}</span>
              </p>
              <p>订单编号：{{item.orderId}}</p>
              <p>产品编号：{{item.productId}}</p>
              <p>下单方式：
                <span class="tag-span" :class="item.orderType == 1 ? 'byuser' : 'byagent'">
                  {{item.orderType == 1 ? '用户下单' : '商家自建'}}
                </span>
              </p>
              <!-- <p>账号别名：{{item.roleName}}</p> -->
            </li>
            <li class="payment">
              <p>支付租金：{{item.rental}}元</p>
              <p>支付押金：{{item.deposit}}元
                <span v-if="item.depositRetTime !== 0" class="green">已解冻</span>
              </p>
              <p>商家获利：{{item.customRate}}%</p>
              <p>用户获利：{{100 - item.customRate}}%</p>
            </li>
            <li class="status">
              <p>累计激活次数：{{item.activateCount}} 次</p>
              <p>累计激活设备：{{item.activateEquipCount}} 次</p>
              <p>违规操作：{{item.doneViolation}}次</p>
              <p>远程截图：{{item.screenShotCount}}</p>
              <p>待审核截图：{{item.unAuditScrShot}}</p>
            </li>
            <li class="time">
              <p>状态：{{orderStateComp(item.orderState)}}</p>
              <p v-if="item.orderCdkState === 3" class="cdkState">(CDK冻结)</p>
              <p>开始：{{timeFormat(item.startTime)}}</p>
              <p>结束：{{timeFormat(item.endTime)}}</p>
              <p>时长：{{item.totalTime}} 小时</p>
              <p>剩余时长: {{toNow(item.endTime)}} 分钟</p>
            </li>
            <li class="operation">
              <el-button size="mini" type="primary" v-if="item.orderState == 3 || item.orderState == 4" @click.native="artitra(item.orderId)">查看申诉</el-button>
            </li>
          </ul>
        </div>
      </div>
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
  name: 'OrderManage',
  data() {
    return {
      loading: false,
      unfind: false,
      activeName: '0',
      search: {
        userAccount: null,
        agentsAccount: null,
        orderState: '0',
        startTime: null,
        endTime: null,
        orderCdk: null,
        productId: null,
        orderId: null
      },
      orderList: [],
      totPage: 0,
      orderState: [
        {
          value: '0',
          label: '所有状态'
        },
        {
          value: '1',
          label: '租赁中'
        },
        {
          value: '2',
          label: '租赁结束'
        },
        {
          value: '3',
          label: '客户申诉'
        }, {
          value: '4',
          label: '代理商申诉'
        }, {
          value: '6',
          label: '订单异常关闭'
        }, {
          value: '9',
          label: '撤单成功'
        }, {
          value: '11',
          label: '预约中'
        }, {
          value: '12',
          label: '取消预约'
        }],

    }
  },
  methods: {
    artitra(id) {
      this.$router.push({ name: 'ArbitrationManage', query: { id } })
    },
    control(id) {
      this.$router.push({ name: 'OrderControl', query: { id } })
    },
    orderStateComp(value) {
      let state
      this.orderState.forEach(item => {
        if (item.value == value) state = item.label
      })
      return state
    },
    timeFormat(timestamp) {
      return timeFormat(timestamp)
    },
    toNow(endtime) {
      return toNow(endtime)
    },
    tabOnClick(tab) {
      this.search.orderState = tab.name
      this.fetchData(1, true);
    },
    onSearch() {
      this.search.orderId = filterNumber(this.search.orderId);
      console.log(this.search.orderId);
      this.search.productId = filterNumber(this.search.productId)
      this.fetchData(1, true)
    },
    onReset() {
      const keys = Object.keys(this.search)
      keys.forEach(function (item) {
        this.search[item] = null
      }, this);
      this.search['orderState'] = '0'
      this.fetchData(1, true)
    },
    handleCurrentChange(val) {
      this.fetchData(val)
    },
    selectChange(select) {
      this.activeName = select
      this.search.orderState = select
      this.fetchData(1, true)
    },
    fetchData(page, first) {
      this.unfind = false
      this.loading = true
      const data = {
        ...this.search,
        page,
        rows: 10
      }
      const startTime = data['startTime']
      const endTime = data['endTime']
      if (isNaN(startTime)) data['startTime'] = null
      if (isNaN(endTime)) data['endTime'] = null
      if (startTime != null) data['startTime'] = new Date(startTime).getTime();
      if (endTime != null) data['endTime'] = new Date(endTime).getTime();
      if (!first) data['countPage'] = this.totPage;
      this.axios.post('/admin/order/gets', data).then(({ data, status }) => {
        this.loading = false;
        if (data.content === 0) {
          this.$message.error(data.data)
        } else {
          this.orderList = data.orders;
          if (first) this.totPage = data.countPage;
          if (data.orders.length === 0) this.unfind = true
        }
      }).catch(err => {
        this.$message.error('服务器发生错误')
      })
    },

  },
  mounted() {
    this.search.orderId = this.$route.query.id || '';
    this.fetchData(1, true)
  }
}
</script>
<style lang="less" scoped>
.order-manage {
  display: flex;
  flex-direction: column;
  @import '../style/search.less';
  .order-item-bottom {
    .operation {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
