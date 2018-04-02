<template>
  <div class="commodity-manage">
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
          <el-form-item label="订单状态:">
            <el-select size="small" v-model="search.product_state" placeholder="请选择" @>
              <el-option v-for="item in productState" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品关键词:">
            <el-input size="small" v-model="search.product_keywords" placeholder="请输入产品关键词"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户产品状态:">
            <el-select size="small" v-model="search.user_state" placeholder="请选择">
              <el-option v-for="item in userState" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="游戏账号:">
            <el-input size="small" v-model="search.game_account" placeholder="请输入游戏账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="账号类型:">
            <el-select size="small" v-model="search.product_type" placeholder="请选择">
              <el-option v-for="item in productType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色名称:">
            <el-input size="small" v-model="search.role_name" placeholder="请输入角色名称"></el-input>
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
        <el-tab-pane v-for="item in productState" :key="item.value" :label="item.label" :name="item.value"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="result" v-show="!(loading || unfind)">
      <div class="result-top">
        <ul>
          <li class="account">产品信息</li>
          <li class="payment">产品价格</li>
          <li class="status">销售记录</li>
          <li class="time">即时信息</li>
          <li class="operation">操作</li>
        </ul>
      </div>
      <div class="order-form-item" v-for="(item, index) in orderList" :key="index" :class="item.state != '5'?'active':''">
        <div class="order-item-top">
          <ul>
            <li>产品编号:
              <span>{{item.productId}}</span>
              产品状态:
              <span>{{orderStateComp(item.state)}}</span>
            </li>
            <li v-if="item.userNickName !== null">用户：
              <span>{{item.userNickName}}
              </span>
            </li>
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
                <span class="lightblue">{{item.ziZoneName}}</span>
              </p>
              <p>产品编号：{{item.productId}}</p>
              <p>账号别名：{{item.nickName}}</p>
              <p>下单方式：
                <span class="tag-span" :class="item.productType == 1 ? 'byuser' : 'byagent'">
                  {{item.productType == 1 ? '商家自建' : '平台签约'}}
                </span>
              </p>
              <p>角色名称：{{item.roleName}}</p>
            </li>
            <li class="payment">
              <p>代理商时租：{{item.adminHrental}}元</p>
              <p>号主时租：{{item.hrental}}元</p>
              <p>包夜：{{item.nrental}}元
                <!-- <span v-if="item.depositRetTime !== 0" class="green">已解冻</span> -->
              </p>
              <p>包天：{{item.drental}}元</p>
              <p>押金：{{item.deposit}}元</p>
              <p>代理商分成：{{item.rate}}%</p>
              <p>号主分成：{{item.ownerRate}}%</p>
            </li>
            <li class="status">
              <p>出租次数：{{item.totalTimes}} 次</p>
              <p>出租小时：{{item.totalTimeLength}} 次</p>
              <p>收藏次数：{{item.totalCollect}}次</p>
              <p>累计收益{{item.totalMoney}}元</p>
              <p>商家累计获利：{{item.totalMoney - item.userGetMoney}}元</p>
              <p>号主累计获利：{{item.userGetMoney}}元</p>
            </li>
            <li class="time">
              <p>当前订单状态：{{orderStateComp(item.state)}}</p>
            </li>
            <li class="operation"></li>
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
  name: 'commodityManage',
  data() {
    return {
      loading: false,
      unfind: false,
      activeName: '0',
      orderList: [],
      totPage: 0,
      productState: [
        {
          label: '所有状态',
          value: '0'
        },
        {
          label: '正常可租',
          value: '1'
        },
        {
          label: '正常已租',
          value: '2'
        },
        {
          label: '待编辑',
          value: '3'
        },
        {
          label: '等待审核',
          value: '4'
        },
        {
          label: '下架',
          value: '5'
        },
        {
          label: '异常状态',
          value: '11'
        },
        {
          label: '正常所有',
          value: '100'
        }
      ],
      userState: [
        {
          label: '所有状态',
          value: '0'
        },
        {
          label: '待编辑',
          value: '1'
        },
        {
          label: '等待审核',
          value: '2'
        },
        {
          label: '下架',
          value: '3'
        },
        {
          label: '等待签约',
          value: '4'
        },
        {
          label: '已签约',
          value: '5'
        }
      ],
      productType: [
        {
          label: '所有类型',
          value: '0'
        },
        {
          label: '商家自建',
          value: '1'
        },
        {
          label: '平台签约',
          value: '2'
        }
      ],
      search: {
        agents_account: null,
        user_account: null,
        zizone: 0,
        product_state: '0',
        user_state: '0',
        product_keywords: null,
        game_account: null,
        product_type: '0',
        role_name: null,
        rows: 10,
      },
      zizone: 0
    }
  },
  methods: {
    gameChange(val) {
      this.zizone = val
      console.log(val)
      this.search.zizone = val
    },
    orderStateComp(value) {
      let state
      this.productState.forEach(item => {
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
      this.search.product_state = tab.name
      this.fetchData(1, true)
    },
    onSearch() {
      this.activeName = this.search.product_state
      this.fetchData(1, true)
    },
    onReset() {
      const keys = Object.keys(this.search)
      keys.forEach(function (item) {
        this.search[item] = null
      }, this);
      this.search['product_state'] = '0'
      this.search['user_state'] = '0'
      this.search['product_type'] = '0'
      this.zizone = 0
      this.fetchData(1, true)
    },
    handleCurrentChange(val) {
      this.fetchData(val)
    },
    productChange(select) {
      this.activeName = select
      this.search.product_state = select
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
      if (!first) data['countPage'] = this.totPage
      this.axios.post('/admin/product/gets', data).then(({ data, status }) => {
        this.loading = false
        if (data.content === 0) {
          this.$message.error(data.data)
        } else {
          this.orderList = data.products
          if (first) this.totPage = data.countPage
          if (data.products.length === 0) this.unfind = true
        }
      }).catch(err => {
        this.$message.error('服务器发生错误')
      })
    },

  },
  mounted() {
    this.fetchData(1, true)
  }
}
</script>
<style lang="less" scoped>
.commodity-manage {
  display: flex;
  flex-direction: column;
  @import '../style/search.less';
  .result {
    .payment {
      width: 160px;
    }
    .status {
      width: 182px;
    }
    .time {
      width: 182px;
    }
    .order-form-item {
      .order-item-bottom {
        ul {
          .payment {
            color: #333;
          }
        }
      }
    }
  }
}
</style>