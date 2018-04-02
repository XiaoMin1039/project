<template>
  <div class="banner">
    <div class="upload">
      <el-form ref="search" label-width="120px">
        <el-col :span="12">
          <el-form-item label="标题：">
            <el-input size="small" v-model="search.title" placeholder="请输入标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="链接：">
            <el-input size="small" v-model="search.url" placeholder="*号为通配符"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="图片页面：">
            <el-input size="small" v-model="search.imagePage" placeholder="*号为通配符"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="line">
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button type="info" @click="addImage">添加图片</el-button>
        </el-col>
      </el-form>
    </div>
    <el-table :data="list" v-loading="loading" style="width: 100%" tooltip-effect="dark" @row-click="rowClick">
      <el-table-column prop="imageItemId" label="ID" show-overflow-tooltip width="120">
      </el-table-column>
      <el-table-column prop="title" label="标题" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="imageUrl" label="路径" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="page" label="页面" show-overflow-tooltip width="120">
      </el-table-column>
      <el-table-column prop="content" label="备注" show-overflow-tooltip width="120">
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template scope="scope">
          <el-button type="primary" size="mini" @click.stop="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click.stop="del(scope.row.imageItemId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="nowPage" :page-count="totPage" layout="prev, pager, next, jumper">
      </el-pagination>
    </div>
    <el-dialog title="图片预览" :visible.sync="dialog" size="tiny">
      <img :data-clipboard-text="`http://res.zudahao.com/${image}`" class="copy" :src="`http://res.zudahao.com/${image}`" style="width: 100%" alt="">
    </el-dialog>
    <el-dialog :visible.sync="isEdit" size="tiny">
      <el-form ref="search" label-width="120px">
        <el-col :span="24">
          <el-form-item label="标题：">
            <el-input size="small" v-model="imageInfo.title" placeholder="请输入标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input size="small" v-model="imageInfo.content" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="图片页面：">
            <el-input size="small" v-model="imageInfo.page" placeholder="例如：test.html"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-show="!editRow.imageItemId">
          <el-form-item label="选取文件：">
            <el-upload ref="upload" action="http://www2017.zudahao.com:8080/api/admin/image/add" :data="imageInfo" :auto-upload="false" :on-success="upSuccess" :multiple="false" accept="image/*">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="saveToServe" v-show="editRow.imageItemId">保存</el-button>
        <el-button type="primary" @click="postToServe" v-show="!editRow.imageItemId">上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'ImageAdmin',
  data() {
    return {
      nowPage: 0,
      fileList: [],
      list: [],
      loading: false,
      totPage: 0,
      file: {
        title: '',
        content: ''
      },
      image: '',
      dialog: false,
      search: {
        title: null,
        url: null,
        imagePage: null
      },
      isEdit: false,
      editRow: {},
      imageInfo: {
        title: null,
        content: null,
        page: null
      }
    }
  },
  methods: {
    onSearch() {
      this.fetchData(1, true)
    },
    upSuccess(file) {
      if (file.content === 1) {
        this.$message.success('上传成功')
        this.imageInfo.title = null
        this.$refs.upload.clearFiles()
        this.fetchData(1, true)
      } else {
        this.$message.error('上传失败')
        this.$refs.upload.clearFiles()
      }
    },
    edit(row) {
      this.editRow = row
      this.imageInfo.title = row.title
      this.imageInfo.content = row.content
      this.imageInfo.page = row.page
      this.isEdit = true
    },
    saveToServe() {
      const data = {
        image_id: this.editRow.imageItemId,
        content: this.imageInfo.content,
        page: this.imageInfo.page
      }
      this.axios.post('/admin/image/update', data).then(({ data }) => {
        if (data.content === 1) {
          this.$message.success('编辑成功')
          this.fetchData(1, true)
          this.isEdit = false
        } else this.$message.error('编辑失败')
      })
    },
    postToServe() {
      this.$refs.upload.submit()
    },
    addImage() {
      this.imageInfo = {
        title: null,
        content: null,
        page: null
      }
      this.editRow = {}
      this.isEdit = true
    },
    rowClick(row) {
      this.image = ''
      this.image = row.imageUrl
      this.dialog = true
    },
    uploadError(file) {
      this.$message.error('上传失败')
    },
    handleCurrentChange(page) {
      this.fetchData(page)
    },
    del(id) {
      this.axios.post('/admin/image/delete', { image_id: id }).then(({ data }) => {
        if (data.content === 1) {
          this.$message.success('删除成功')
          this.fetchData(1, true)
        } else this.$message.error('删除失败')
      })
    },
    fetchData(page, first) {
      this.loading = true
      const data = {
        ...this.search,
        page,
        rows: 10
      }
      if (first) this.totPage = 0
      if (!first) data['countPage'] = this.totPage
      this.axios.post('/admin/image/gets', data).then(({ data }) => {
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
