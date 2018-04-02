<template>
  <div class="buyer-news">
    <div class="tree">
      <el-tree :data="data" :props="props" accordion @node-click="handleNodeClick" highlight-current :render-content="renderTree">
      </el-tree>
    </div>
    <div class="post" v-loading="loading">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="title" label="标题" width="420">
        </el-table-column>
        <el-table-column prop="address" :render-header="render">
          <template scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog size="tiny" :visible.sync="addTree" title="添加菜单">
      <el-input placeholder="菜单名称" v-model="input"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTree = false">取 消</el-button>
        <el-button type="primary" @click="addMenu">添加</el-button>
      </span>
    </el-dialog>
    <el-dialog size="tiny" :visible.sync="editTree" title="编辑菜单">
      <el-input placeholder="菜单名称" v-model="input"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveMenu">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="addPoster" @close="closePost" title="添加文章" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-input placeholder="标题" v-model="title" style="margin-bottom: 20px;"></el-input>
      <div id="wangedit"></div>
      <div slot="footer">
        <el-button @click="save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import E from 'wangeditor'
export default {
  name: 'SellerNews',
  data() {
    return {
      baseUrl: 'http://www2017.zudahao.com:8080/api',
      data: [],
      props: {
        label: 'title',
        children: 'child'
      },
      addTree: false,
      nowOpen: false,
      input: '',
      loading: false,
      list: [],
      addPoster: false,
      poster: '',
      editor: {},
      firstOpen: true,
      title: '',
      edit: {},
      editTree: false,
      editItem: {},
      nowAdd: 0,
      nowRead: 0
    }
  },
  methods: {
    handleNodeClick(node) {
      if (node.id === -1) {
        this.nowAdd = node.parentId
        this.addTree = true
      } else {
        this.nowRead = node.id
        this.fetchList(node.id)
      }
    },
    fetchList(id) {
      this.loading = true
      this.axios.get(`/viewHelp/getArticles/${id}`).then(({ data }) => {
        this.list = data
        this.loading = false
      })
    },
    editMenu(item) {
      console.log(item)
      this.editItem = item
      this.editTree = true
      this.input = item.title
    },
    delMenu(item) {
      this.$confirm('此操作将删除该菜单以及下面的文章，是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post(`${this.baseUrl}/viewHelp/deleteOrder`, { id: item.id }).then(({ data }) => {
          if (data === 'success') {
            this.fetchList(this.nowRead)
            this.fetchData()
            this.$message.success('删除成功')
          } else this.$message.error('服务器错误')
        })
      })
    },
    renderTree(h, { node }) {
      const _self = this
      if (node.data.id === -1) {
        return h('span', node.data.title)
      } else {
        return h('span', {}, [
          node.data.title,
          h('p', {
            style: {
              float: 'right',
              margin: '0px 10px 0px 0px'
            }
          }, [
              h('el-button', {
                attrs: {
                  type: 'primary',
                  size: 'mini'
                },
                nativeOn: {
                  click: function (event) {
                    event.stopPropagation()
                    _self.editMenu(node.data)
                  }
                }
              }, '编辑'),
              h('el-button', {
                attrs: {
                  type: 'danger',
                  size: 'mini'
                },
                nativeOn: {
                  click: function (event) {
                    event.stopPropagation()
                    _self.delMenu(node.data)
                  }
                }
              }, '删除')
            ])
        ])
      }
    },
    saveMenu() {
      const data = {
        id: this.editItem.id,
        title: this.input
      }
      this.axios.post(`${this.baseUrl}/viewHelp/updateOrder`, data).then(({ data }) => {
        if (data === 'success') {
          this.$message.success('保存成功')
          this.fetchData()
          this.input = ''
          this.editTree = false
        } else this.$message.error('保存失败')
      })
    },

    save() {
      if (!this.title || !this.poster) {
        this.$message.error('标题或内容不允许为空')
        return
      }
      if (!this.edit.id) {
        const data = {
          parentId: this.nowRead,
          typeId: 1,
          title: this.title,
          detail: this.poster,
          isMenu: 0
        }
        this.axios.post(`${this.baseUrl}/viewHelp/addOrder`, data).then(({ data }) => {
          if (data === 'success') {
            this.$message.success('添加成功')
            this.fetchList(this.nowRead)
            this.title = ''
            this.editor.txt.clear()
            this.addPoster = false
          }
        }).catch(err => this.$message.error('服务器错误'))
      } else {
        const data = {
          id: this.edit.id,
          title: this.title,
          detail: this.poster
        }
        this.axios.post(`${this.baseUrl}/viewHelp/updateOrder`, data).then(({ data }) => {
          if (data === 'success') {
            this.$message.success('保存成功')
            this.fetchList(this.nowRead)
            this.title = ''
            this.editor.txt.clear()
            this.addPoster = false
          } else this.$message.error('保存失败')
        })
      }
    },
    closePost() {
      this.title = ''
      this.editor.txt.clear()
      this.edit = {}
    },
    setContent(html) {
      this.poster = html
    },
    render(h, { col, $index }) {
      return h('el-button', {
        attrs: {
          type: 'primary',
          size: 'mini'
        },
        on: {
          '!click': this.addPost
        }
      }, '添加', )
    },
    addPost() {
      this.addPoster = true
      this.$nextTick(() => {
        if (this.firstOpen) this.editor.create()
        this.firstOpen = false
      })
    },
    handleEdit(row) {
      this.axios.post(`${this.baseUrl}/viewHelp/help/${row.id}`).then(({ data }) => {
        if (data.id) {
          this.edit = data
          this.poster = true
          this.addPost()
          this.$nextTick(() => {
            this.title = data.title
            this.editor.txt.html(data.datail)
          })
        } else this.$message.error('服务器错误')
      }).catch(err => {
        console.log(err)
        this.$message.error('服务器错误')
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将删除该文章，不可恢复，是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post(`${this.baseUrl}/viewHelp/deleteOrder`, { id: row.id }).then(({ data }) => {
          if (data === 'success') {
            this.fetchList(this.nowRead)
          } else this.$message.error('服务器错误')
        })
      })
    },
    addMenu() {
      const data = {
        parentId: this.nowAdd,
        typeId: 1,
        title: this.input,
        isMenu: 1
      }
      this.axios.post(`${this.baseUrl}/viewHelp/addOrder`, data).then(({ data }) => {
        if (data === 'success') {
          this.$message.success('添加成功')
          this.fetchData()
          this.addTree = false
          this.input = ''
        }
        else this.$message.error('添加失败')
      })
    },
    nodeClick(node) {
      if (node.id === -1) {
        this.input = ''
        this.nowOpen = node
        this.addTree = true
      } else {
        if (node.parent === 0) {
          this.nowOpen = node
          this.loading = true
          this.axios.get(`${this.baseUrl}/viewHelp/help?parentId=${node.id}&typeId=1&index=1`).then(({ data }) => {
            this.loading = false
            this.list = data
          })
        }
      }

    },
    fetchData() {
      this.axios.get(`${this.baseUrl}/viewHelp/help?typeId=1`).then(({ data }) => {
        this.data = data
        function dfs(obj) {
          obj.forEach(item => {
            if (!item.child) item.child = []
            if (item.child.length != 0) dfs(item.child)
            item.child.push({
              title: '添加子菜单',
              id: -1,
              child: [],
              parentId: item.id
            })
          })
        }
        dfs(this.data)
        this.data.push({
          title: '添加子菜单',
          id: -1,
          child: [],
          parentId: 0
        })
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
    this.editor.customConfig.uploadImgServer = 'http://www2017.zudahao.com:8080/api/admin/help/image/add'
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
.buyer-news {
  background-color: #fff;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  .tree {
    width: 320px; // border: 1px solid #dfe6ec;
    // ul {
    //   list-style: none;
    //   li {
    //     padding-left: 10px;
    //     line-height: 30px;
    //     cursor: pointer;
    //     &:hover {
    //       background-color: #e4e8f1;
    //     }
    //   }
    // }
  }
  .post {
    width: 570px;
  }
}
</style>
