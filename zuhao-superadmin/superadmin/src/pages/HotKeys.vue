<template>
  <div class="hot-keys">
    <div class="search search-box">
      <el-form ref="search" label-width="120px">
        <el-col :span="12">
          <el-form-item label="关键词：">
            <el-input size="small" v-model="search.keywords" placeholder="请输入关键词"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="别名：">
            <el-input size="small" v-model="search.nickName" placeholder="请输入别名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="游戏类别：">
            <el-select v-model="search.game_id" placeholder="请选择" size="small">
              <el-option v-for="(item, index) in gameList" :label="item" :value="index" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      <el-col :span="24" class="line">
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
        <el-button style="margin-left: 10px;" type="info" @click="dialog = true">添加关键词</el-button>
        <!-- <el-button type="danger" v-if="selectArr.length" @click="filesDel" style="margin-left: 10px;">删除选中</el-button> -->
        <el-button style="margin-left: 10px;" type="success" @click="publish">发布关键词</el-button>
        <el-button style="margin-left: 10px;" type="warning" @click="sortGame">游戏排序</el-button>
      </el-col>
    </div>
    <el-table :data="list" v-loading="loading" style="width: 100%" tooltip-effect="dark">
      <el-table-column prop="hotEquipmentId" label="ID" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="游戏类型" show-overflow-tooltip>
        <template scope="scope">
          {{game(scope.row.gameId)}}
        </template>
      </el-table-column>
      <el-table-column prop="keywords" label="关键词" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="nickName" label="别名" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="显示位置" show-overflow-tooltip>
        <template scope="scope">
          {{scope.row.type == '1'? '左':'右'}}
        </template>
      </el-table-column>
      <el-table-column label="角标" show-overflow-tooltip>
        <template scope="scope">
          {{scope.row.tipType == '1'? 'HOT':scope.row.tipType == '2'? 'NEW':''}}
        </template>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip width="200">
        <template scope="scope">
          <el-button type="success" size="mini" @click="stick(scope.row.hotEquipmentId)">置顶</el-button>
          <el-button type="info" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="del(scope.row.hotEquipmentId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="nowPage" :page-count="totPage" layout="prev, pager, next, jumper">
      </el-pagination>
    </div>
    <el-dialog :title="`添加关键词`" :visible.sync="dialog" size="tiny" :before-close="dialogClose">
      <el-form label-position="left" label-width="100px" :model="addHot">

        <el-form-item label="关键词">
          <el-input v-model="addHot.keywords" placeholder="请输入关键词" size="small"></el-input>
        </el-form-item>
        <el-form-item label="别名">
          <el-input v-model="addHot.nick_name" placeholder="请输入关键词" size="small"></el-input>
        </el-form-item>
        <el-form-item label="游戏类别" v-show="!isEdit">
          <el-select v-model="addHot.game_id" placeholder="请选择" size="small">
            <el-option v-for="(item, index) in gameList" :label="item" :value="index" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词位置">
          <el-radio-group v-model="addHot.type">
            <el-radio label="1">左边</el-radio>
            <el-radio label="2">右边</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关键词标志">
          <el-radio-group v-model="addHot.tip_type">
            <el-radio label="0">无</el-radio>
            <el-radio label="1">HOT</el-radio>
            <el-radio label="2">NEW</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetDialog">重置</el-button>
        <el-button type="primary" @click="saveKey">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="排序" :visible.sync="sort" size="tiny">
      <draggable v-model="myArray">
        <transition-group>
          <div v-for="(item, index) in myArray" :key="item" class="gameList">
            {{game(item)}}
            <span>{{index + 1}}</span>
          </div>
        </transition-group>
      </draggable>
      <div slot="footer">
        <el-button type="primary" @click="saveGame">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: 'HotKeys',
  components: {
    draggable,
  },
  data() {
    return {
      loading: false,
      sort: false,
      search: {
        keywords: null,
        nickName: null,
        game_id: '0'
      },
      dialog: false,
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
      myArray: [1, 2, 3, 4, 5, 6],
      addHot: {
        game_id: '0',
        keywords: '',
        nick_name: '',
        type: '1',
        tip_type: '0'
      },
      type: [
        {
          label: '热门装备',
          value: '1'
        },
        {
          label: '热门人物',
          value: '2'
        }
      ],
      totPage: 0,
      list: [],
      editor: {},
      isEdit: false,
      nowPage: 0,
    }
  },
  methods: {
    resetDialog() {
      this.addHot.keywords = ''
      this.addHot.nick_name = ''
      this.addHot.type = '1'
      this.addHot.tip_type = '0'
      this.addHot.game_id = '0'
    },
    dialogClose(done) {
      done()
      if (this.editor.hotEquipmentId) {
        this.resetDialog()
      }
      this.editor = {}
      this.isEdit = false
    },
    edit(row) {
      this.editor = row
      this.isEdit = true
      this.addHot.keywords = row.keywords
      this.addHot.nick_name = row.nickName
      this.addHot.type = row.type.toString()
      this.addHot.tip_type = row.tipType.toString()
      this.dialog = true
    },
    saveGame() {
      const data = {
        is_sort: '1',
        sort: JSON.stringify(this.myArray)
      }
      this.axios.post('/admin/hot/equipment/sort', data).then(({ data }) => {
        if (data.content === 1) {
          this.$message.success('保存成功')
          this.sort = false
        } else this.$message.error('保存失败')
      })

    },
    sortGame() {
      this.axios.post('/admin/hot/equipment/sort', { is_sort: 0 }).then(({ data }) => {
        if (data.content === 1) {
          this.myArray = data.object
          this.sort = true
        } else this.$message.error('获取数据失败')
      })
    },
    stick(equipment_id) {
      this.axios.post('/admin/hot/equipment/stick', { equipment_id }).then(({ data }) => {
        if (data.content === 1) {
          this.$message.success('置顶成功')
          this.fetchData(1, true)
        } else this.$message.error('置顶失败')
      })
    },
    onReset() {
      this.search.keywords = null
      this.search.nickName = null
      this.search.game_id = '0'
      this.fetchData(1, true)
    },
    del(equipment_id) {
      this.$confirm('此操作不能还原，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('/admin/hot/equipment/delete', { equipment_id }).then(({ data }) => {
          if (data.content === 1) {
            this.$message.success('删除成功')
            this.fetchData(1, true)
          } else this.$message.error('删除失败')
        })
      }).catch(() => { })
    },
    onSearch() {
      this.fetchData(1, true)
    },
    handleCurrentChange(page) {
      this.fetchData(page)
    },
    publish() {
      this.axios.post('/admin/hot/equipment/publish').then(({ data }) => {
        if (data.content === 1)
          this.$notify({
            title: `发布关键词成功`,
            message: data.data,
            type: 'success'
          })
        else this.$error('发布失败')
      })
    },
    saveKey() {
      if (!this.isEdit) {
        this.addHot.keywords = this.addHot.keywords.replace(/(^\s+)|(\s+$)/g, "")
        this.axios.post('/admin/hot/equipment/add', this.addHot).then(({ data }) => {
          if (data.content === 1) {
            this.$message.success('添加搜索关键词成功')
            this.addHot.keywords = ''
            this.addHot.nick_name = ''
            this.fetchData(1, true)
          } else this.$message.error('添加失败')
        })
      } else {
        this.addHot.keywords = this.addHot.keywords.replace(/(^\s+)|(\s+$)/g, "")
        const data = {
          equipment_id: this.editor.hotEquipmentId,
          keywords: this.addHot.keywords,
          nickName: this.addHot.nick_name,
          tip_type: this.addHot.tip_type,
          type: this.addHot.type
        }
        this.axios.post('/admin/hot/equipment/edit', data).then(({ data }) => {
          if (data.content === 1) {
            this.$message.success('编辑成功')
            this.dialog = false
            this.fetchData(this.nowPage)
          } else this.$message.error('编辑失败')
        })
      }
    },
    game(id) {

      return this.gameList[id]
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
      this.axios.post('/admin/hot/equipment/gets', data).then(({ data }) => {
        if (data.content === 1) {
          this.loading = false
          if (first) this.totPage = data.countPage
          this.list = data.objects
        }
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    }
  },
  mounted() {
    console.log(1)
    this.fetchData(1, true)
  }
}
</script>
<style lang="less" scoped>
.hot-keys {
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
  .el-select {
    width: 100%;
  }
  .gameList {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    line-height: 24px;
    border: 1px solid #333;
    padding: 5px 10px 5px 10px;
    margin-top: 5px;
    border-radius: 4px;
    span {
      background-color: lightcoral;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
    }
  }
}
</style>
