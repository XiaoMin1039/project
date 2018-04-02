<template>
  <div class="banner">
    <div class="upload">
      <el-form ref="search" label-width="120px">
        <el-col :span="12">
          <el-form-item label="标题：">
            <el-input size="small" v-model="file.title" placeholder="请输入标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="内容：">
            <el-input size="small" v-model="file.content" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="URL：">
            <el-input size="small" v-model="file.click_url" placeholder="请输入URL"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="line">
          <el-upload action="http://www2017.zudahao.com:8080/api/admin/image/banner/add" accept="image/*" :data="file" :show-file-list="false" :on-success="uploadSuccess" :on-error="uploadError">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-col>
      </el-form>
    </div>
    <el-table :data="list" v-loading="loading" style="width: 100%" tooltip-effect="dark" @row-click="rowClick">
      <el-table-column prop="bannerImageId" label="ID" show-overflow-tooltip width="120">
      </el-table-column>
      <el-table-column prop="title" label="标题" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="url" label="文件路径" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="clickUrl" label="URL" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="置顶" show-overflow-tooltip width="80">
        <template scope="scope">
          {{scope.row.isStick === 1 ? '是' : ''}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template scope="scope">
          <el-button type="primary" size="mini" @click.stop="edit(scope.row)">编辑</el-button>
          <el-button type="info" v-show="scope.row.isStick === 1" size="mini" @click.stop="unstick(scope.row.bannerImageId)">取消置顶</el-button>
          <el-button type="success" v-show="scope.row.isStick !== 1" size="mini" @click.stop="stick(scope.row.bannerImageId)">置顶</el-button>
          <el-button type="danger" size="mini" @click.stop="del(scope.row.bannerImageId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :page-count="totPage" layout="prev, pager, next, jumper">
      </el-pagination>
    </div>
    <el-dialog title="图片预览" :visible.sync="dialog" size="tiny">
      <img :src="`http://res.zudahao.com/${image}`" style="width: 100%" alt="">
    </el-dialog>
    <el-dialog title="图片预览" :visible.sync="editDialog" size="tiny">
      <el-form label-width="120px">
        <el-col :span="24">
          <el-form-item label="标题：">
            <el-input size="small" v-model="editor.title" placeholder="请输入标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="内容：">
            <el-input size="small" v-model="editor.content" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="URL：">
            <el-input size="small" v-model="editor.click_url" placeholder="请输入URL"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Banner',
  data() {
    return {
      list: [],
      loading: false,
      totPage: 0,
      file: {
        title: '',
        content: '',
        click_url: ''
      },
      image: '',
      dialog: false,
      editor: {
        banner_id: '',
        title: '',
        content: '',
        click_url: ''
      },
      editDialog: false,
      nowPage: 1
    }
  },
  methods: {
    saveEdit() {
      this.axios.post('/admin/image/banner/update', this.editor).then(({ data }) => {
        if (data.content != 1) {
          this.$message.error('保存失败')
        } else {
          this.$message.success('保存成功')
          this.fetchData(this.nowPage)
          this.editDialog = false
        }
      })
    },
    edit(row) {
      this.editor.banner_id = row.bannerImageId
      this.editor.click_url = row.clickUrl
      this.editor.title = row.title
      this.editor.content = row.content
      this.editDialog = true
    },
    rowClick(row) {
      console.log(row)
      this.image = ''
      this.image = row.url
      this.dialog = true
    },
    uploadSuccess(file) {
      if (file.content === 1) {
        this.$message.success('上传成功')
        this.fetchData(1, true)
        this.file.title = ''
        this.file.content = ''
        this.file.click_url = ''
      }
      else this.$message.error('上传失败')
    },
    uploadError(file) {
      this.$message.error('上传失败')
    },
    handleCurrentChange(page) {
      this.nowPage = page
      this.fetchData(page)
    },
    unstick(id) {
      const data = {
        banner_id: id,
        is_stick: '0'
      }
      this.axios.post('/admin/image/banner/stick', data).then(({ data }) => {
        if (data.content === 1) {
          this.$message.success('取消置顶成功')
          this.fetchData(1, true)
        } else this.$message.error('取消置顶失败')
      })
    },
    stick(id) {
      const data = {
        banner_id: id,
        is_stick: '1'
      }
      this.axios.post('/admin/image/banner/stick', data).then(({ data }) => {
        if (data.content === 1) {
          this.$message.success('置顶成功')
          this.fetchData(1, true)
        } else this.$message.error('置顶失败')
      })
    },
    del(id) {
      this.axios.post('/admin/image/banner/delete', { banner_id: id }).then(({ data }) => {
        if (data.content === 1) {
          this.$message.success('删除成功')
          this.fetchData(1, true)
        } else this.$message.error('删除失败')
      })
    },
    fetchData(page, first) {
      this.loading = true
      const data = {
        page,
        rows: 10
      }
      if (first) this.totPage = 0
      if (!first) data['countPage'] = this.totPage
      this.axios.post('/admin/image/banner/gets', data).then(({ data }) => {
        this.loading = false
        if (data.content === 1) {
          this.list = data.object
          if (first) this.totPage = data.countPage
        } else this.$message.error('获取失败')
      })
    }
  },
  mounted() {
    this.fetchData(1, true)
  }
}
</script>
<style lang="less" scoped>
.banner {
  display: flex;
  flex-direction: column;
  .upload {
    margin-top: 10px;
    padding: 10px;
    background-color: #fff;
  }
  .line {
    display: flex;
    justify-content: center;
    border-top: 1px solid #e2e2e2;
    padding-top: 15px;
  }
  .search {
    margin-top: 10px;
  }
  .el-select {
    width: 100%;
  }
}
</style>
