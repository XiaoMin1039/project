<template>
  <div class="order-control">
    <div class="search search-box">
      <el-form ref="search" :model="search" label-width="120px">
        <el-col :span="12">
          <el-form-item label="用户账号:">
            <el-input size="small" v-model="search.user_acount" placeholder="请输入用户账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="代理商账号:">
            <el-input size="small" v-model="search.agents_account" placeholder="请输入代理商账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单ID:">
            <el-input size="small" v-model="search.order_id" placeholder="请输入订单ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单状态:">
            <el-select size="small" v-model="search.state" @change="selectChange" placeholder="请选择">
              <el-option v-for="item in orderState" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品ID:">
            <el-input size="small" v-model="search.product_id" placeholder="请输入产品ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="截图状态:">
            <el-select size="small" v-model="search.screen_state" @change="screenChange" placeholder="请选择">
              <el-option v-for="item in screenState" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开始时间:">
            <el-date-picker size="small" v-model="search.start_time" type="datetime" placeholder="选择开始时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间:">
            <el-date-picker size="small" v-model="search.end_time" type="datetime" placeholder="选择结束时间"></el-date-picker>
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
        <el-tab-pane v-for="item in screenState" :key="item.value" :label="item.label" :name="item.value"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="result" v-show="!(loading || unfind)">
      <div class="pics">
        <div class="imgs" v-for="(item, index) in screenShots" :key="index">
          <div class="top">
            <img :data-id="index" :src="(item.screenShotUrl  || 'http://zudahao.zudahao.com/images/null.jpg' ) + '?x-oss-process=image/resize,m_fixed,h_160,w_290'" alt="">
            <ul class="control-data">
              <li>总截图：{{item.screenShotCount}}</li>
              <li>危险：{{item.unAuditScrShot}}</li>
            </ul>
          </div>
          <div class="control">
            <p>{{item.orderState == '1' ? `剩余时长：${toNow(item.endTime)} 分钟` : orderStateComp(item.orderState)}} 激活次数：{{item.activateCount}}</p>
            <div class="btn">
              <div>
                <el-button type="primary" size="mini" @click.native="openShot(item.orderId)">截图</el-button>
                <el-button type="primary" size="mini" @click.native="openProcess(item.orderId)">进程</el-button>
                <el-button type="primary" size="mini" @click.native="openHistory(item.orderId)">历史</el-button>
              </div>
              <div>
                <!-- <el-button type="primary" size="mini">停卡</el-button> -->
                <el-button type="primary" size="mini" @click="goOrderManage(item.orderId)">查单</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" :page-count="totPage" layout="prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="订单截图" :visible.sync="shotDialog.open" size="small" class="dialog" :before-close="shotClose">
      <div class="shot-dialog">
        <el-tabs v-model="shotAll.type" @tab-click="tabOnClickDialog">
          <el-tab-pane v-for="item in screenState" :key="item.value" :label="item.label" :name="item.value"></el-tab-pane>
        </el-tabs>
        <div class="result" v-show="!(shotDialog.loading || shotDialog.unfind)">
          <div class="pics" id="pics">
            <a class="items" v-for="(item, index) in shotDialog.list" :key="index" :data-src="item.screenShotUrl">
              <img :src="item.screenShotUrl + '?x-oss-process=image/resize,m_fixed,h_160,w_290'" alt="">
            </a>
          </div>
          <div class="pagination">
            <el-pagination @current-change="shotCurrentChange" :page-count="shotDialog.totPage" layout="prev, pager, next, jumper">
            </el-pagination>
          </div>
        </div>
        <loading :loading="shotDialog.loading" :unfind="shotDialog.unfind" v-if="shotDialog.loading || shotDialog.unfind"></loading>
      </div>
    </el-dialog>
    <el-dialog title="上号记录" :visible.sync="historyDialog.open" size="small">
      <div class="result" v-show="!(historyDialog.loading || historyDialog.unfind)">
        <el-table :data="historyDialog.list" style="width: 100%">
          <el-table-column prop="historyId" label="历史上号记录ID" width="180">
          </el-table-column>
          <el-table-column prop="orderId" label="订单编号" width="180">
          </el-table-column>
          <el-table-column prop="loginIp" label="登录IP">
          </el-table-column>
          <el-table-column label="登录时间">
            <template scope="scope">
              {{timeFormat(scope.row.loginTime)}}
            </template>
          </el-table-column>
          <el-table-column label="是否冻结">
            <template scope="scope">
              {{scope.row.isFreeze == 1 ? '已冻结' : '未冻结'}}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="historyCurrentChange" :page-count="historyDialog.totPage" layout="prev, pager, next, jumper" class="pagination">
        </el-pagination>
      </div>
      <loading :loading="historyDialog.loading" :unfind="historyDialog.unfind" message="------------------"></loading>
    </el-dialog>
    <el-dialog title="进程记录" :visible.sync="processDialog.open" size="small">
      <div class="result" v-show="!(processDialog.loading || processDialog.unfind)">
        <el-table :data="processDialog.list" style="width: 100%">
          <el-table-column prop="historyId" label="ID" width="110">
          </el-table-column>
          <el-table-column label="路径" width="280">
            <template scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.imagePath" placement="top-start">
                <p style="white-space: nowrap;display: inline-block;width: 270px;overflow: hidden;text-overflow: ellipsis;">{{split(scope.row.imagePath)}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="文件名" width="160">
            <template scope="scope">
              {{fileName(scope.row.imagePath)}}
            </template>
          </el-table-column>
          <el-table-column label="处理结果" width="100">
            <template scope="scope">
              {{scope.row.handleResult == '1' ? '拦截成功' : '放行'}}
            </template>
          </el-table-column>
          <el-table-column label="处理时间">
            <template scope="scope">
              {{timeFormat(scope.row.timeStamp)}}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="processCurrentChange" :page-count="processDialog.totPage" layout="prev, pager, next, jumper" class="pagination">
        </el-pagination>
      </div>
      <loading :loading="processDialog.loading" :unfind="processDialog.unfind" message="------------------"></loading>

    </el-dialog>
    <loading :loading="loading" :unfind="unfind" v-if="loading || unfind"></loading>
  </div>
</template>
<script>
import { filterNumber, timeFormat, toNow, split } from '../utils'
let $pics
export default {
  name: 'OrderControl',
  data() {
    return {
      search: {
        agents_account: null,
        user_acount: null,
        order_id: null,
        product_id: null,
        state: '0',
        start_time: null,
        end_time: null,
        screen_state: '0',
      },
      screenState: [
        {
          label: '所有',
          value: '0'
        },
        {
          label: '待核对',
          value: '1'
        },
        {
          label: '危险',
          value: '2'
        }
      ],
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
        },
        {
          value: '4',
          label: '代理商申诉'
        },
        {
          value: '6',
          label: '订单异常关闭'
        },
        {
          value: '9',
          label: '撤单成功'
        },
        {
          value: '11',
          label: '预约中'
        },
        {
          value: '12',
          label: '取消预约'
        }
      ],
      screenShots: [],
      loading: false,
      unfind: false,
      totPage: 0,
      activeName: '',
      shotDialog: {
        open: false,
        loading: false,
        unfind: false,
        list: [],
        totPage: 0
      },
      shotAll: {
        order_id: '',
        rows: 9,
        type: '0'
      },
      historyDialog: {
        open: false,
        loading: false,
        unfind: false,
        list: [],
        totPage: 0
      },
      historyAll: {
        order_id: '',
        rows: 10
      },
      processDialog: {
        open: false,
        loading: false,
        unfind: false,
        list: [],
        totPage: 0
      },
      processAll: {
        order_id: '',
        rows: 10
      }
    }
  },
  methods: {
    shotClose(done) {
      $('#pics').data('lightGallery').destroy(true)
      done()
    },
    fileName(str) {
      const arr = str.split('\\')
      return arr[arr.length - 1]
    },
    split(str) {
      return split(30, str)
    },
    goOrderManage(id) {
      this.$router.push({ name: 'OrderManage', query: { id } })
    },
    showImage() {
      const screenShots = this.screenShots.map(item => {
        return {
          src: item.screenShotUrl || 'http://zudahao.zudahao.com/images/null.jpg',
          downloadUrl: item.screenShotUrl,
          poster:0
        }
      })
      $('.top>img').each(function () {
        $(this).unbind('click')
      })
      $('.top>img').each(function () {
        $(this).on("click", function () {
          var index = $(this).attr("data-id")
          var $lg = $(this).lightGallery({
            dynamic: true,
            dynamicEl: screenShots,
            index,
            thumbnail: false
          })
          $lg.on("onAfterOpen.lg", function () {
            $lg.data("lightGallery").slide(index)
          })
        });
      })
    },
    processCurrentChange(val) {
      this.processFetch(val)
    },
    openProcess(id) {
      this.processDialog.totPage = 0
      this.processAll.order_id = id
      this.processDialog.open = true
      this.processFetch(1, true)
    },
    processFetch(page, first) {
      this.processDialog.loading = true
      this.processDialog.unfind = false
      const data = {
        ...this.processAll,
        page
      }
      if (!first) data['count_page'] = this.processDialog.totPage
      this.axios.post('/admin/screen/order/process/gets', data).then(({ status, data }) => {
        this.processDialog.loading = false;
        if (data.content === 0) {
          this.$message.error(data.data)
        } else {
          this.processDialog.list = data.pcProcesses
          if (first) this.processDialog.totPage = data.countPage
          if (data.pcProcesses.length === 0) this.processDialog.unfind = true
        }
      }).catch(err => {
        this.processDialog.loading = false
        this.$message.error('服务器错误！')
      })
    },
    historyCurrentChange(val) {
      this.historyFetch(val)
    },
    timeFormat(timestamp) {
      return timeFormat(timestamp)
    },
    toNow(endtime) {
      return toNow(endtime)
    },
    openHistory(id) {
      this.historyDialog.totPage = 0
      this.historyAll.order_id = id
      this.historyDialog.open = true
      this.historyFetch(1, true)
    },
    historyFetch(page, first) {
      this.historyDialog.loading = true
      this.historyDialog.unfind = false
      const data = {
        ...this.historyAll,
        page
      }
      if (!first) data['count_page'] = this.historyDialog.totPage
      this.axios.post('/admin/screen/order/history/get', data).then(({ status, data }) => {
        this.historyDialog.loading = false
        if (data.content === 0) {
          this.$message.error(data.data)
        } else {
          this.historyDialog.list = data.pcLoginHistories
          if (first) this.historyDialog.totPage = data.countPage
          if (data.pcLoginHistories.length === 0) this.historyDialog.unfind = true
        }
      }).catch(err => {
        this.historyDialog.loading = false
        this.$message.error('服务器错误！')
      })
    },
    orderStateComp(value) {
      let state
      this.orderState.forEach(item => {
        if (item.value == value) state = item.label
      })
      return state
    },
    tabOnClickDialog(val) {
      this.shotAll.type = val.name
      this.shotFetch(1, true)
    },
    openShot(id) {
      this.shotAll.order_id = id
      this.shotDialog.open = true
      this.shotDialog.totPage = 0
      this.shotFetch(1, true)
    },
    shotFetch(page, first) {
      this.shotDialog.loading = true
      this.shotDialog.unfind = false
      const data = {
        ...this.shotAll,
        page
      }
      if (!first) data['count_page'] = this.shotDialog.totPage
      this.axios.post('/admin/screen/order/get', data).then(({ status, data }) => {
        this.shotDialog.loading = false
        if (data.content === 0) {
          this.$message.error(data.data)
        } else {
          this.shotDialog.list = data.screenShotDtos
          if (first) this.shotDialog.totPage = data.countPage
          if (data.screenShotDtos.length === 0) this.shotDialog.unfind = true
          this.$nextTick(() => {
            if (!first) $('#pics').data('lightGallery').destroy(true)
            $('#pics').lightGallery({
              thumbnail: true,
              animateThumb: false
            })
          })
        }
      }).catch(err => {
        this.shotDialog.loading = false
        this.$message.error('服务器错误！')
      })
    },
    tabOnClick(tab) {
      this.search.screen_state = tab.name
      this.fetchData(1, true)
    },
    shotCurrentChange(val) {
      this.shotFetch(val)
    },
    handleCurrentChange(val) {
      this.fetchData(val)
    },
    onSearch() {
      this.search.order_id = filterNumber(this.search.order_id)
      this.search.product_id = filterNumber(this.search.product_id)
      this.fetchData(1, true)
    },
    onReset() {
      const keys = Object.keys(this.search)
      keys.forEach(function (item) {
        this.search[item] = null
      }, this);
      this.search['state'] = '0'
      this.search['screen_state'] = '0'
      this.fetchData(1, true)
    },
    screenChange(val) {
      this.activeName = val
      this.onSearch()
    },
    selectChange(select) {
      this.search.orderState = select
      this.fetchData(1, true)
    },
    fetchData(page, first) {
      this.unfind = false
      this.loading = true
      const data = {
        ...this.search,
        page,
        rows: 9
      }
      const startTime = data['start_time']
      const endTime = data['end_time']
      if (isNaN(startTime)) data['startTime'] = null
      if (isNaN(endTime)) data['endTime'] = null
      if (startTime != null) data['start_time'] = new Date(startTime).getTime()
      if (endTime != null) data['end_time'] = new Date(endTime).getTime()
      if (!first) data['countPage'] = this.totPage
      this.axios.post('/admin/screen/order/get_all', data).then(({ data, status }) => {
        this.loading = false
        if (data.content === 0) {
          this.$message.error(data.data)
        } else {
          this.screenShots = data.screenShots
          if (first) this.totPage = data.countPage
          if (data.screenShots.length === 0) this.unfind = true
        }
      }).catch(err => {
        this.loading = false;
        this.$message.error('服务器发生错误')
      })
    },

  },
  mounted() {
    this.search.order_id = this.$route.query.id || ''
    this.fetchData(1, true)
    $pics = $('#pics')
    this.$nextTick(() => {
      $pics.lightGallery()
    })
  },
  computed: {

  },
  watch: {
    screenShots() {
      this.$nextTick(() => {
        this.showImage()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.order-control {
  display: flex;
  flex-direction: column;
  .search {
    margin-top: 15px;
    .el-select,
    .el-date-editor {
      width: 100%;
    }
    .line {
      display: flex;
      justify-content: center;
      border-top: 1px solid #e2e2e2;
      padding-top: 15px;
    }
  }
  .tabs {
    background-color: #fff;
    margin-top: 10px;
    padding: 0;
    .el-tabs {
      .el-tabs__header {
        margin-bottom: 0px;
      }
    }
  }
  .result {
    display: flex;
    flex-direction: column;
    .pics {
      padding-left: 10px;
      padding-right: 10px;
      margin-top: 10px;
      background-color: #fff;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      .imgs {
        width: 290px;
        height: 230px;
        background-color: #333333;
        margin-top: 10px;
        margin-left: 20px;
        margin-right: 20px;
        margin-bottom: 10px;
        .top {
          position: relative;
          img {
            width: 290px;
            height: 160px;
          }
          ul {
            list-style: none;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 999;
            li {
              color: #fff;
              background-color: #000;
              border-radius: 3px;
              margin-top: 3px;
              padding: 2px 5px;
              font-size: 12px;
            }
          }
        }
        .control {
          font-size: 12px;
          color: #fff;
          p {
            padding: 5px 10px;
          }
          .btn {
            padding: 5px 10px;
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
  }
  .shot-dialog {
    display: flex;
    flex-direction: column;
    .result {
      .pics {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        img {
          margin: 10px 17px 0px 17px;
          width: 290px;
          height: 160px;
        }
      }
    }
  }
}
</style>
