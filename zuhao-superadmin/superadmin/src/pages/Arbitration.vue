<template>
  <div class="arbitration">
    <div class="order-info">
      <p>
        <span class="title">产品标题：</span>{{order.productTitle}}</p>
      <p>
        <span class="title">订单编号：</span>{{order.orderId}}</p>
      <p>
        <span class="title">订单状态：</span>{{orderStateComp(order.orderState)}}
      </p>
      <p>
        <span class="title">所属服务商：</span>{{order.shopName}}</p>
      <p>
        <span class="title">游戏大区：</span>{{order.zoneName}}
      </p>
      <p>
        <span class="title">角色名称：</span>{{order.roleName}}
      </p>
      <p>
        <span class="title">租金：</span>{{order.rental}}元
      </p>
      <p>
        <span class="title">押金：</span>{{order.deposit}}元
        <span class=""></span>
      </p>
    </div>
    <div class="order-notice">
      <p>售后状态：{{serverState}}</p>
      <p>处理时效：{{timeFormat(claim.claimCreateTime + 3 * 24 * 60 * 60 * 1000)}}前双方可以沟通举证，逾期将由平台仲裁。</p>
    </div>
    <div class="speak">
      <h3>沟通记录</h3>
      <ul>
        <li v-for="(item, index) in speaks" :key="index">
          <div class="head-icon">
            <img src="//img.qcloud.com/open_proj/proj_qcloud_v2/mc_2014/user-center/css/img/head-1.png" alt="">
          </div>
          <div class="recode" :class="item.speakRole == '1' ? 'user' : ''">
            <div class="title">
              <span>{{item.speakRole == '1' ? '用户' : '商家'}}</span>
              <span>{{timeFormat(item.speakTime)}}</span>
            </div>
            <div class="detail">
              {{item.speakContent}}
            </div>
            <div class="image" v-if="item.speakImageUrls">
              <img v-for="(item1, index1) in item.speakImageUrls.split(',')" :key="index1" :src="item1" alt="" @click="seeImg(item1)">
            </div>
          </div>
        </li>
      </ul>
    </div>
    </el-col>
    <div class="result" v-if="claim.claimState == 2">
      <el-col :span="24">
        <el-radio class="radio" v-model="radio" label="1">{{whois}}胜诉</el-radio>
        <el-radio class="radio" v-model="radio" label="0">{{whois}}败诉</el-radio>
      </el-col>
      <el-col :span="24">
        <el-input type="textarea" :rows="4" placeholder="请输入理由" v-model="textarea">
        </el-input>
      </el-col>
      <el-col :span="24" style="text-align: center;">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="goBack">返回</el-button>
      </el-col>
    </div>
    <el-dialog title="图片预览" :visible.sync="image" size="small">
      <img :src="img" alt="" style="width: 100%">
    </el-dialog>
  </div>
</template>
<script>
import { filterNumber, timeFormat, toNow } from '../utils'
export default {
  name: 'Arbitration',
  data() {
    return {
      claim: {},
      order_id: '',
      order: {},
      speaks: [],
      claimState: {
        '1': '交涉中',
        '2': '后台仲裁中',
        '3': '通过',
        '4': '失败',
        '5': '撤销'
      },
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
        }
      ],
      radio: '1',
      textarea: '',
      loading: false,
      unfind: false,
      img: '',
      image: false
    }
  },
  computed: {
    whois() {
      if (this.speaks[0].speakRole == 1) return '用户'
      return '商家'
    },
    serverState() {
      if (this.claim.claimState == 4) return '仲裁失败'
      if (this.claim.claimState == 3) return '仲裁成功'
      if (this.speaks.length == 6) return '等待平台仲裁售后'
      const length = this.speaks.length
      if (length == 0) return '服务器错误'
      if (this.speaks[length - 1].speakRole == 1) return '等待卖家处理售后'
      else return '等待买家继续举证'
    }
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'ArbitrationManage' })
    },
    submit() {
      if (this.textarea == '') {
        this.$message.error('请填写理由！')
        return false
      }
      const data = {
        order_id: this.order_id,
        is_pass: this.radio,
        note: this.textarea,
        admin_id: 2
      }
      this.axios.post('/admin/claim/handle', data).then(({ data, status }) => {
        if (data.content != 1) this.$message.error('服务器错误！')
        else this.$router.push({ name: 'ArbitrationManage' })
      })
    },
    seeImg(url) {
      this.img = ''
      this.img = url
      this.image = true
    },
    timeFormat(t) {
      return timeFormat(t)
    },
    orderStateComp(value) {
      let state
      this.orderState.forEach(item => {
        if (item.value == value) state = item.label
      })
      return state
    },
    fetchInfo() {
      this.loading = true
      this.axios.post('/admin/order/get', { order_id: this.order_id }).then(({ data, status }) => {
        if (data.content === 0) this.$message.error(data.data)
        this.order = data.order
        this.loading = false
      }).catch(err => {
        this.$message.error('服务器错误！')
      })
    },
    fetchSpeaks() {
      this.loading = true
      this.axios.post('/admin/speak/get', { order_id: this.order_id }).then(({ data, status }) => {
        if (data.content === 0) this.$message.error(data.data)
        this.speaks = data.speaks
        this.claim = data.claimOrderDto
        this.loading = false
      }).catch(err => {
        this.$message.error('服务器错误！')
      })
    }
  },
  mounted() {
    const id = this.$route.params.id
    this.order_id = id
    this.fetchInfo()
    this.fetchSpeaks()
  },
  watch: {
    '$route'(to, from) {
      this.mounted()
    }
  }
}
</script>
<style lang="less" scoped>
.arbitration {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  margin-top: 2px;
  padding-left: 10px;
  padding-right: 10px;
  .order-info {
    padding-top: 10px;
    padding-bottom: 10px;
    p {
      font-size: 13px;
      line-height: 25px;
      span {
        display: inline-block;
        width: 100px;
        text-align: right;
      }
    }
  }
  .order-notice {
    margin-bottom: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: #f0f4f7;
    border: 1px solid #dedfe0;
    p {
      padding-left: 60px;
      font-size: 12px;
      line-height: 25px;
      &:first-child {
        color: #2b425b;
        font-weight: bold;
      }
    }
  }
  .speak {
    border: 1px solid #dedfe0;
    border-radius: 2px;
    margin-bottom: 10px;
    h3 {
      padding-left: 20px;
      color: #454a51;
      line-height: 30px;
      font-size: 14px;
      background-color: #f0f4f7;
      border-bottom: 1px solid #dedfe0;
    }
    ul {
      padding: 20px;
      display: flex;
      list-style: none;
      flex-direction: column;
      li {
        padding-top: 20px;
        padding-bottom: 25px;
        border-top: 1px dashed #d3d3d3;
        color: #a2a2a2;
        font-size: 14px;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        &:first-child {
          border-top: none;
          padding-top: 0;
        }
        .head-icon {
          width: 55px;
        }
        .recode {
          display: flex;
          flex-direction: column;
          padding-top: 5px;
          width: 100%;
          color: #a2a2a2;
          .title {
            display: flex;
            justify-content: space-between;
            span {
              font-size: 14px;
              &:first-child {
                font-weight: 700;
              }
            }
          }
          .image {
            img {
              width: 60px;
              height: 60px;
            }
          }
        }
        .user {
          color: #171d25;
          .title {
            span:last-child {
              color: #a2a2a2;
            }
          }
        }
      }
    }
  }
  .result {
    display: flex;
    flex-direction: column;
    .el-col {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
