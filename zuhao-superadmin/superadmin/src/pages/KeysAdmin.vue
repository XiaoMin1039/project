<template>
  <div class="keys-admin">
  
    <div class="search search-box">
      <el-form ref="search" label-width="120px">
        <el-col :span="12">
          <el-form-item label="关键词：">
            <el-input size="small" v-model="keywords" placeholder="请输入关键词"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <el-col :span="24" class="line">
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button style="margin-left: 10px;" type="info" @click="dialog = true">添加关键词</el-button>
        <el-button type="danger" v-if="selectArr.length" @click="filesDel" style="margin-left: 10px;">删除选中</el-button>
        <el-button style="margin-left: 10px;" type="success" @click="publish">发布关键词</el-button>
      </el-col>
    </div>
    <el-table :data="list" v-loading="loading" style="width: 100%" tooltip-effect="dark" @selection-change="tableSel">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="pcBlackKeywordsId" label="ID" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="游戏类型" show-overflow-tooltip>
        <template scope="scope">
          {{game(scope.row.gameId)}}
        </template>
      </el-table-column>
      <el-table-column prop="keywords" label="关键词" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="address" label="操作时间" show-overflow-tooltip>
        <template scope="scope">{{timeFormat(scope.row.lastChangeTimeStamp)}}</template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :page-count="totPage" layout="prev, pager, next, jumper">
      </el-pagination>
    </div>
    <el-dialog :title="`添加关键词`" :visible.sync="dialog" size="tiny">
      <el-form label-position="left" label-width="80px" :model="keys">
        <el-form-item label="关键词">
          <el-input v-model="keys.keywords" placeholder="请输入关键词" size="small"></el-input>
        </el-form-item>
        <el-form-item label="文件类型" placeholder="请输入文件类型">
          <el-select v-model="keys.gameId" placeholder="请选择" size="small">
            <el-option v-for="(item, index) in gameList" :label="item" :value="index" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="saveKey">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { timeFormat } from '../utils'
export default {
  name: 'KeysAdmin',
  data() {
    return {
      keywords: '',
      totPage: 0,
      list: [],
      loading: false,
      selectArr: [],
      gameList: {
        '0': '所有游戏',
        '1': 'QQ飞车',
        '2': 'QQ炫舞',
        '3': '穿越火线',
        '4': '地下城与勇士',
        '5': '反恐精英OL',
        '6': '逆战',
        '7': '枪神纪',
        '8': '守望先锋',
        '9': '英雄联盟'
      },
      dialog: false,
      keys: {
        keywords: '',
        gameId: '0'
      }
    }
  },
  methods: {
    saveKey() {
      const data = {
        data: JSON.stringify([this.keys])
      }
      this.axios.post('/admin/pc/blackKeywords/add', data).then(({ data }) => {
        if (data.content === 1) {
          this.$message.success('添加关键词成功')
          this.dialog = false
          this.fetchData(1, true)
          this.keys.keywords = ''
          this.keys.gameId = '0'
        } else this.$message.error('添加关键词失败')
      })
    },
    filesDel() {
      let arr = this.selectArr.map(item => item.pcBlackKeywordsId)
      const data = {
        data: JSON.stringify(arr)
      }
      this.axios.post('/admin/pc/pcBlackKeywords/delete', data).then(({ data }) => {
        if (data.content === 1) {
          this.$message.success('删除成功')
          this.fetchData(1, true)
        } else this.$message.error('删除失败')
      })
    },
    publish() {
      this.axios.post('/admin/pc/blackKeywords/publish').then(({ data }) => {
        if (data.content === 1)
          this.$notify({
            title: `发布关键词成功`,
            message: data.data,
            type: 'success'
          })
        else this.$error('发布失败')
      })
    },
    tableSel(val) {
      this.selectArr = val
    },
    game(id) {

      return this.gameList[id]
    },
    timeFormat(t) {
      return timeFormat(t)
    },
    handleCurrentChange(page) {
      this.fetchData(page)
    },
    onSearch() {
      this.fetchData(1, true)
    },
    fetchData(page, first) {
      this.loading = true
      const data = {
        keywords: this.keywords,
        rows: 10,
        page
      }
      if (!first) data['countPage'] = this.totPage
      if (first) this.totPage = 0
      this.axios.post('/admin/pc/blackKeywords/gets', data).then(({ data }) => {
        this.loading = false
        if (data.content === 1) {
          this.list = data.objects
          if (first) this.totPage = data.countPage
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
.keys-admin {
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
