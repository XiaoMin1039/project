<template>
  <div class="option">
      <div class="search search-box">
          <el-row :gutter="4">
              <el-col :span="4">
                用户账号：
              </el-col>
              <el-col :span="8">
                  <el-input v-model="search.userAccount" placeholder="请输入内容"></el-input>
              </el-col>
              <el-col :span="4">
                代理商账号：
              </el-col>
              <el-col :span="8">
                  <el-input v-model="search.agentsAccount" placeholder="请输入内容"></el-input>
              </el-col>
          </el-row>
          <el-row :gutter="4">
              <el-col :span="4">
                订单ID：
              </el-col>
              <el-col :span="8">
                  <el-input v-model="search.orderId" placeholder="请输入内容"></el-input>
              </el-col>
              <el-col :span="4">
                订单状态：
              </el-col>
              <el-col :span="8">
                <el-select v-model="search.orderState" placeholder="请选择">
                    <el-option v-for="item in orderState" :key="item.value" :label="item.label" :value="item.value"></el-option>   
                </el-select>
              </el-col>
          </el-row>
          <el-row :gutter="4">
              <el-col :span="4">
                产品ID：
              </el-col>
              <el-col :span="8">
                  <el-input v-model="search.productId" placeholder="请输入内容"></el-input>
              </el-col>
              <el-col :span="4">
                上号激活码CDK：
              </el-col>
              <el-col :span="8">
                  <el-input v-model="search.orderCdk" placeholder="请输入内容"></el-input>
              </el-col>
          </el-row>
          <el-row :gutter="4">
              <el-col :span="4">
                开始时间：
              </el-col>
              <el-col :span="8">
                  <el-date-picker v-model="search.startTime" type="datetime" placeholder="选择开始时间" :picker-options="pickerOptions0"></el-date-picker>
              </el-col>
              <el-col :span="4">
                结束时间：
              </el-col>
              <el-col :span="8">
                  <el-date-picker v-model="search.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
              </el-col>
          </el-row>
          <el-row class="line">
              <el-col :span="3">
                <el-button type="primary" @click="onSearch">搜索</el-button>
              </el-col>
              <el-col :span="3">
                  <el-button @click="onReset">重置</el-button>
              </el-col>
          </el-row>
      </div>
      <div class="tabs">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="item in orderState" :key="item.value" :label="item.label" :name="item.value"></el-tab-pane> 
          </el-tabs>
      </div>
      <div class="result" v-show="!loading&&!unfind">
            <div class="result-top">
                <ul>
                    <li class="account">账号信息</li>
                    <li class="payment">实付款</li>
                    <li class="status">交易状态</li>
                    <li class="time">租赁时间</li>
                    <li class="operation">交易操作</li>
                </ul>
            </div>
            <div class="order-form-item" v-for="(item,index) in list" :key="index">
                <div class="order-item-top">
                    <ul>
                        <li class="account">上号激活码
                            <span>{{ item.orderCdk }}</span>
                        </li>
                        <li class="payment">用户
                            <span> {{ item.userAccount }}</span>
                        </li>
                        <li class="status">商家
                            <span>{{ item.agentsAccount }}</span>
                        </li>
                        <li class="time">店铺名称
                            <span>{{ item.shopName }}</span>
                        </li>
                        <li class="operation">
                            <span style="display: relative; display: flex;align-items: center" @click="jumpControl(item.orderId)">
                                <el-tooltip class="item" effect="dark" content="查看监控" placement="top">
                                    <icon name="laptop" scale="1.4"></icon>
                                </el-tooltip>
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="order-item-bottom">
                    <ul>
                        <li class="accout">
                            <p>
                                <a :href="'http://www.zudahao.com/product/'+item.productId+'.html'">{{ item.productTitle }}</a>
                            </p>
                            <p>游戏分类和大区
                                <span class="lightblue">{{ item.zoneName}}</span>
                            </p>
                            <p>订单编号：
                                <span>{{ item.orderId }}</span>
                            </p>
                            <p>产品编号：
                                <span>{{ item.productId}}</span>
                            </p>
                            <p>下单方式：
                                <span class="tag-span" :class="item.orderType == 1 ? 'byuser' : 'byagent'">
                                    {{ item.orderType == 1 ? '用户下单' : '商家自建' }}
                                </span>
                            </p>
                        </li>
                        <li class="payment">
                            <p>支付租金：
                                <span>{{ item.rental }}元</span>
                            </p>
                            <p>支付押金：
                                <span>{{ item.deposit }}元</span>
                            </p>
                            <p>商家获利：
                                <span>{{ item.customRate }}%</span>
                            </p>
                            <p>用户获利：
                                <span>{{ 100-item.customRate}}%</span>
                            </p>
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

                        </li>
                    </ul>
                </div>
            </div>
            <div class="pagination">
                <el-pagination layout="prev, pager,next" :page-count="num" @current-change="changePage"></el-pagination>
            </div>
      </div>
      <loading :loading="loading" :unfind="unfind" v-if="loading || unfind"></loading>
  </div>
</template>

<script>
import { filterNumber, timeFormat, toNow } from '../utils'
export default {
  name:'option',
  data(){
      return{
        orderState: [{
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
        
        
        pickerOptions0: {
            disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
        }
        },
        search:{
            userAccount: null,
            agentsAccount: null,
            orderState: '0',
            startTime: null,
            endTime: null,
            orderCdk: null,
            productId: null,
            orderId: null
        },
        activeName:'0',
        loading:false,
        unfind:false,
        num:0,
        list:[],
      }
  },
  methods:{
      timeFormat(timestamp){
          return timeFormat(timestamp)
      },
      toNow(endtime){
          return toNow(endtime)
      },
      orderStateComp(value) {
        let state
        this.orderState.forEach(item => {
            if (item.value == value) state = item.label
        })
            return state
      },
      handleClick(){
          this.search.orderState=this.activeName;
          this.getOrder(1,false);
      },
      getOrder(page,first){
          this.loading=true;
          this.unfind=false;
          const data={
              ...this.search,
              page:page,
              rows:10
          }
          if(isNaN( data['startTime'])) data['startTime']=null;
          if(isNaN( data['endTime'])) data['endTime']=null;
          data['startTime'] = new Date(data['startTime']).getTime();
          data['endTime'] = new Date(data['endTime']).getTime();
          this.axios.post('/admin/order/gets',data).then(
              (res)=>{
                  if(first)this.num=res.data.countPage;
                  if(res.data.content == 1){
                      this.loading=false;
                      this.unfind=false;
                      this.list=res.data.orders;
                      if(this.list.length == 0)this.unfind = true; 
                  }else if(res.data.content == 0){
                      this.$message.error(data.data)
                  }
              }
          ).catch(err => {
             this.$message.error('服务器发生错误')
          }) 
      },
      changePage(val){
          this.getOrder(val,false);
      },
      onSearch(){
          this.getOrder(1,false)
      },
      onReset(){
           this.search={
                userAccount: null,
                agentsAccount: null,
                orderState: '0',
                startTime: null,
                endTime: null,
                orderCdk: null,
                productId: null,
                orderId: null
            }
            this.activeName='0';
            this.getOrder(1,false);
      },
      jumpControl(id){
          this.$router.push({path:'/orderControl?id='+id});
      }
  },
  mounted(){
      this.search.orderId=this.$route.query.id||'';
      this.getOrder(1,true);
  }
}
</script>

<style lang="less" scoped>
.option {
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
