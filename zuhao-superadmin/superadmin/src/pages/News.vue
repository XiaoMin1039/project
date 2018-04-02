<template>
  <div class="news">
    <el-button type="primary" style="margin-top: 10px;" @click.native="dialog = true">添加类型</el-button>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="clickTabs" closable @tab-remove="delTabs">
        <el-tab-pane v-for="item in types" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="result">
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="title" label="标题">
        </el-table-column>
        <el-table-column label="时间" width="200">
          <template scope="scope">
            {{timeFormat(scope.row.pubTime)}}
          </template>
        </el-table-column>
        <el-table-column :render-header="controlRender" width="130">
          <template scope="scope">
            <el-button size="mini" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog size="tiny" :visible.sync="dialog" title="添加新闻类型">
      <el-input v-model="newType" placeholder="添加新闻类型"></el-input>
      <div slot="footer">
        <el-button type="primary" @click="addType">添加</el-button>
      </div>
    </el-dialog>
    <el-dialog size="small" @close="closePost" title="添加文章" :visible.sync="newsEdit" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-input placeholder="标题" v-model="title" style="margin-bottom: 20px;"></el-input>
      <div id="wangedit"></div>
      <div slot="footer">
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog>
    <el-pagination @current-change="CurrentChange" :page-count="totPage" layout="prev, pager, next, jumper" class="pagination">
    </el-pagination>
  </div>
</template>
<script>
import { filterNumber, timeFormat, toNow } from '../utils'
import E from 'wangeditor'
export default {
  name: 'News',
  data() {
    return {
      dialog: false,
      activeName: 'first',
      newType: '',
      types: [],
      baseUrl: 'http://www2017.zudahao.com:8080/api',
      list: [],
      loading: false,
      newsEdit: false,
      editor: {},
      firstOpen: true,
      title: '',
      poster: '',
      nowEdit: {},
      totPage: 0
    }
  },
  methods: {
    CurrentChange(page) {
      this.fetchNews(this.activeName, page)
    },
    edit(item) {
      this.axios.get(`${this.baseUrl}/weNews/detail/${item.id}`).then(({ data }) => {
        if (data) {
          this.newsEdit = true
          if (this.firstOpen) this.initEdit()
          this.nowEdit = data
          this.$nextTick(() => {
            this.editor.txt.html(data.detail)
            this.title = data.title
          })
        }
      })
    },
    del(item) {
      this.$confirm('是否删除此文章', '删除文章', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.get(`${this.baseUrl}/weNews/delete/${item.id}`).then(({ data }) => {
          if (data) {
            this.$message.success('删除成功')
            this.fetchNews(this.activeName, 1, true)
          } else this.$message.error('删除失败')
        })
      }).catch(() => { })
    },
    save() {
      if (!this.poster || !this.title) {
        this.$message.error('标题或内容不得为空')
        return
      }
      if (!this.nowEdit.id) {
        const data = {
          newsTypeId: this.activeName,
          title: this.title,
          detail: this.poster
        }
        this.axios.post(`${this.baseUrl}/weNews/news/add`, data).then(({ data }) => {
          if (data === 1) {
            this.$message.success('添加成功')
            this.fetchNews(this.activeName, 1, true)
            this.newsEdit = false
          }
        })
      } else {
        const data = {
          id: this.nowEdit.id,
          title: this.title,
          detail: this.poster
        }
        this.axios.post(`${this.baseUrl}/weNews/updateNews`, data).then(({ data }) => {
          if (data.message === 'success') {
            this.$message.success('修改成功')
            this.newsEdit = false
            this.fetchNews(this.activeName, 1, true)
          } else this.$message.error('修改失败')
        })
      }
    },
    setContent(html) {
      this.poster = html
    },
    closePost() {
      this.title = ''
      this.editor.txt.clear()
      this.nowEdit = {}
    },
    initEdit() {
      this.$nextTick(() => {
        this.editor.create()
        this.firstOpen = false
      })
    },
    addNews() {
      this.newsEdit = true
      if (this.firstOpen) this.initEdit()
    },
    controlRender(h, { column }) {
      return h('div', {}, [
        h('span', '操作 '),
        h('el-button', {
          attrs: {
            type: 'primary',
            size: 'mini'
          },
          on: {
            '!click': this.addNews
          }
        }, '添加新闻')
      ])
    },
    timeFormat(t) {
      return timeFormat(t)
    },
    addType() {
      this.axios.post(`${this.baseUrl}/weNews/addNewsType`, { newsTypeName: this.newType }).then(({ data }) => {
        if (data.message === 'success') {
          this.$message.success('添加成功')
          this.fetchData()
          this.newType = ''
          this.dialog = false
        } else {
          this.$message.error('添加失败')
        }
      })
    },
    clickTabs(tab) {
      this.fetchNews(tab.name, 1, true)
    },
    delTabs(tab) {
      this.$confirm('是否删除此新闻类型以及该类型下的文章', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post(`${this.baseUrl}/weNews/deleteNewsType/${tab}`).then(({ data }) => {
          if (data === 1) {
            this.$message.success('删除成功')
            this.fetchData()
          } else {
            this.$message.error('删除失败')
          }
        })
      }).catch(() => { })
    },
    fetchData() {
      this.axios.post(`${this.baseUrl}/weNews/news`).then(({ data }) => {
        this.types = data.map(item => ({ label: item.newsTypeName, name: item.id.toString() }))
        this.activeName = data[0].id.toString()
        this.fetchNews(this.activeName, 1, true)
      })
    },
    fetchNews(type, page, first) {
      this.loading = true
      const data = {
        newsTypeId: type,
        rows: 10,
        pageIndex: page
      }
      if (!first) data['size'] = this.totPage
      this.axios.post(`${this.baseUrl}/weNews/getNewsBySql`, data).then(({ data }) => {
        this.list = data.news
        this.loading = false
        if (first) this.totPage = data.pageSize
      })
    }
  },
  mounted() {
    this.editor = new E('#wangedit')

    this.editor.customConfig.onchange = html => {
      this.setContent(html)
    }
    this.editor.customConfig.uploadImgParams = {}
    this.editor.customConfig.uploadFileName = 'file'
    this.editor.customConfig.uploadImgServer = 'http://192.168.31.39/api/test/images/post'
    this.editor.customConfig.uploadImgHooks = {
      fail: function (xhr, editor, result) {
        console.log('文件插入失败')
      },
      error: function (xhr, editor) {
        console.log('文件上传失败')
      },
      customInsert: function (insertImg, result, editor) {
        result.data.map(item => insertImg(item))
      }
    }
    this.fetchData()
  }
}
</script>
<style lang="less" scoped>
.news {
  .tabs {
    margin-top: 15px;
    background-color: #fff;
  }
}
</style>
