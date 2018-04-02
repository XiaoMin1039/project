<template>
  <div class="program-admin">
    <div class="search search-box">
      <el-form ref="search" :model="search" label-width="120px">
        <el-col :span="12">
          <el-form-item label="文件名：">
            <el-input size="small" v-model="search.file_name" placeholder="请输入文件名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件信息：">
            <el-input size="small" v-model="search.file_info" placeholder="请输入文件信息"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="md5：">
            <el-input size="small" v-model="search.md5" placeholder="请输入文件信息"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="日期:">
            <el-date-picker v-model="search.time" type="date" placeholder="选择日期" size="small">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form>
      <el-col :span="24" class="line">
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" v-if="activeName !== 'unknownFile'" style="margin-left: 20px;" @click="addFile">添加{{stateName}}程序</el-button>
        <el-dropdown v-if="selectArr.length" style="margin-left: 10px;">
          <el-button type="warning">
            移动选中
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="filesOp(4)" v-if="activeName === 'unknownFile'">移动到白名单</el-dropdown-item>
            <el-dropdown-item @click.native="filesOp(3)" v-if="activeName === 'unknownFile'">移动到黑名单</el-dropdown-item>
            <el-dropdown-item @click.native="filesOp(1)" v-if="activeName === 'blackList'">移动到白名单</el-dropdown-item>
            <el-dropdown-item @click.native="filesOp(2)" v-if="activeName === 'whiteList'">移动到黑名单</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="danger" v-if="selectArr.length && activeName !== 'unknownFile'" @click="filesDel" style="margin-left: 10px;">删除选中</el-button>
        <el-button style="margin-left: 10px;" type="success" v-if="activeName !== 'unknownFile'" @click="publish">发布{{stateName}}</el-button>
      </el-col>
    </div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in state" :key="item.value" :label="item.label" :name="item.value"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="result" v-show="!(loading || unfind )">
      <el-table ref="unknown" :data="list" tooltip-effect="dark" style="width: 100%" v-loading="loading" v-show="activeName === 'unknownFile'" @selection-change="tableSel">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="expand">
          <template scope="props">
            <div class="expand">
  
              <p>文件路径：{{ props.row.imagePath }}</p>
              <p>MD5：{{ props.row.md5 }}</p>
              <p>公司：{{ props.row.productCompany }}</p>
              <p>描述：{{ props.row.productDescrip }}</p>
              <p>名称：{{ props.row.productName }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="imagePath" label="文件路径" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="md5" label="MD5" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="创建时间" show-overflow-tooltip>
          <template scope="scope">{{timeFormat(scope.row.createTime)}}</template>
        </el-table-column>
      </el-table>
      <el-table ref="normal" :data="list" tooltip-effect="dark" style="width: 100%" v-loading="loading" v-show="activeName !== 'unknownFile'" @selection-change="tableSel">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="expand">
          <template scope="props">
            <div class="expand">
              <p>文件路径：{{ props.row.fileName }}</p>
              <p>MD5：{{ props.row.md5 }}</p>
              <p>公司：{{ props.row.companyName }}</p>
              <p>描述：{{ props.row.description }}</p>
              <p>名称：{{ props.row.productName }}</p>
              <p>时间：{{timeFormat(props.row.lastChangeTimeStamp)}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="pcBlackListId" label="ID" width="80" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="fileName" label="文件路径" width="280" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="md5" label="MD5" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="最近操作时间" show-overflow-tooltip>
          <template scope="scope">{{timeFormat(scope.row.lastChangeTimeStamp)}}</template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" :page-count="totPage" layout="prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
    <loading :loading="loading" :unfind="unfind" v-if="loading || unfind"></loading>
    <el-dialog :title="`添加${stateName}程序`" :visible.sync="dialog" size="tiny">
      <el-form label-position="left" label-width="80px" :model="files">
        <el-form-item label="文件名">
          <el-input v-model="files.fileName" placeholder="请输入文件名" size="small"></el-input>
        </el-form-item>
        <el-form-item label="MD5" placeholder="MD5">
          <el-input v-model="files.md5" size="small"></el-input>
        </el-form-item>
        <el-form-item label="文件类型" placeholder="请输入文件类型">
          <el-select v-model="files.type" placeholder="请选择" size="small">
            <el-option label="exe" value="1">
            </el-option>
            <el-option label="dll" value="2">
            </el-option>
            <el-option label="sys" value="3">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司">
          <el-input v-model="files.companyName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="files.productName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="files.description" size="small"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="saveFile">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { timeFormat } from '../utils'
export default {
  name: 'ProgramAdmin',
  computed: {
    stateName() {
      let ans
      this.state.forEach((item, index) => {
        if (item.value === this.activeName) ans = item
      })
      return ans.label
    }
  },
  data() {
    return {
      search: {
        file_name: null,
        file_info: null,
        md5: null,
        time: null,
        start_time: null,
        end_time: null
      },
      files: {
        md5: null,
        type: '1',
        gameId: '0',
        fileName: null,
        productName: null,
        companyName: null,
        description: null
      },
      state: [
        {
          label: '未知',
          value: 'unknownFile',
          arr: 'pcUnknownFiles'
        },
        {
          label: '白名单',
          value: 'whiteList',
          arr: 'pcWhiteLists'
        },
        {
          label: '黑名单',
          value: 'blackList',
          arr: 'pcBlackLists'
        }
      ],
      activeName: 'unknownFile',
      totPage: 0,
      loading: false,
      unfind: false,
      list: [],
      selectArr: [],
      dialog: false
    }
  },
  methods: {
    publish() {
      this.axios.post(`/admin/pc/${this.activeName}/publish`).then(({ data }) => {
        if (data.content === 1)
          this.$notify({
            title: `发布${this.stateName}成功`,
            message: data.data,
            type: 'success'
          })
        else this.$error('发布失败')
      })
    },
    saveFile() {
      const data = {
        data: JSON.stringify([this.files])
      }
      this.axios.post(`/admin/pc/${this.activeName}/add`, data).then(({ data }) => {
        if (data.content === 1) {
          this.$message.success('添加成功')
          this.dialogReset()
          this.fetchData(1, true)
          this.dialog = false
        } else this.$message.error('添加失败')
      })
    },
    dialogReset() {
      Object.keys(this.files).map(item => this.files[item] = null)
      this.files.type = '1'
      this.gameId = '0'
    },
    timeFormat(t) {
      return timeFormat(t)
    },
    addFile() {
      this.dialog = true
    },
    handleCurrentChange(val) {
      this.fetchData(val)
    },
    tableSel(val) {
      this.selectArr = val
    },
    handleClick(tab) {
      this.fetchData(1, true)
      this.totPage = 0
      this.$refs.unknown.clearSelection()
      this.$refs.normal.clearSelection()
      this.dialogReset()
    },
    onSearch() {
      this.fetchData(1, true)
    },
    onReset() {
      Object.keys(this.search).map(item => this.search[item] = null)
      this.fetchData(1, true)
    },
    fetchData(page, first) {
      this.unfind = false
      this.loading = true
      const data = {
        ...this.search,
        rows: 10,
        page
      }
      if (this.search.time) {
        let nowTime = new Date(this.search.time).getTime()
        data.start_time = nowTime
        data.end_time = nowTime + 24 * 60 * 60 * 1000
      }
      if (!first) data['countPage'] = this.totPage
      if (first) this.totPage = 0
      this.axios.post(`/admin/pc/${this.activeName}/gets`, data).then(({ data }) => {
        this.loading = false
        this.list = data.objects
        if (data.objects === 0) this.unfind = true
        if (first) this.totPage = data.countPage
      })
    },
    filesOp(option) {
      let arr = this.selectArr.map(item => this.activeName === 'unknownFile' ? item.unknownFileId : item.pcBlackListId)
      const data = {
        option,
        data: JSON.stringify(arr)
      }
      this.axios.post('/admin/pc/files/option', data).then(({ data }) => {
        this.$notify({
          title: '操作成功',
          message: data.data,
          type: 'success'
        })
        this.fetchData(1, true)
      })
    },
    filesDel() {
      let arr = this.selectArr.map(item => item.pcBlackListId)
      const data = {
        data: JSON.stringify(arr)
      }
      console.log(arr,data)
      this.$confirm('此操作不能还原，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post(`/admin/pc/${this.activeName}/delete`, data).then(({ data }) => {
          this.$notify({
            title: '删除成功',
            message: data.data,
            type: 'success'
          })
          this.fetchData(1, true)
        })
      }).catch(() => { })
    }
  },
  mounted() {
    this.fetchData(1, true)
  }
}
</script>
<style lang="less" scoped>
.program-admin {
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
  .el-date-editor {
    width: 100%;
  }
  .expand {
    p {
      line-height: 22px;
    }
  }
}
</style>
