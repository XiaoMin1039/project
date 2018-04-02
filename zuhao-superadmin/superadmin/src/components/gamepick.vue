<template>
  <div class="gamepick" id="tags">
    <div class="input" @click.stop="showTabs = !showTabs">
      <i class="el-icon-caret-bottom arrow" :class="{'arrow-up': showTabs}"></i>
      <div class="list">
        <div class="items" v-for="(item, index) in labels" :key="index">
          <span @click.stop="itemClick(index)">{{item}}</span>
          {{labels[index + 1] != '' && typeof labels[index + 1] != 'undefined' ? '/' : ''}}
        </div>
      </div>
    </div>
    <transition name="el-zoom-in-top">
      <div v-show="showTabs" class="tabs">
        <el-tabs type="border-card" :value="activeTab" @tab-click="tabClick">
          <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item" :value="index">
            <span v-for="(span, index1) in list[index]" :key="span.value" @click.stop="showNext(index, span.children, span.value, span.label)" :class="{'active': currentItems[index] === span.value}">{{span.label}}</span>
          </el-tab-pane>
        </el-tabs>
      </div>
    </transition>
  </div>
</template>
<script>
const json = require('../assets/zone.json');
export default {
  name: 'gamepick',
  props: {
    defaultValue: {
      type: Number,
      require: false
    }
  },
  data() {
    return {
      options: [],
      value: this.defaultValue,
      showTabs: false,
      activeTab: '0',
      list: [],
      currentItems: [],
      labels: ['', '', ''],
      tabs: ['游戏', '大区', '区']
    }
  },
  mounted() {
    this.init()
    this.options = json
    document.addEventListener('click', (event) => {
      let flag = false
      event.path.forEach((item) => {
        if (item.id == 'tags') flag = true
      })
      if (!flag) this.showTabs = false
    })
  },
  computed: {},
  methods: {
    showNext(index, children, value, label) {
      this.value = value
      if (this.labels[index] != label) {
        for (let i = index + 1; i < this.tabs.length; i++) {
          this.labels[i] = ''
          this.currentItems[i] = ''
        }
      }
      this.labels[index] = label
      this.currentItems[index] = value
      if (index === this.tabs.length - 1) {
        this.showTabs = false
        return false
      }
      this.list[index + 1] = children
      this.activeTab = (index + 1).toString()
    },
    itemClick(index) {
      this.activeTab = index.toString()
      this.showTabs = true
    },
    tabClick(tab) {
      this.activeTab = tab.index
    },
    init() {
      this.options = json
      this.list[0] = this.options
      this.list[1] = this.options[0].children
      this.list[2] = this.options[0].children[0].children
      const options = this.options
      let labels = []
      let items = []
      const value = this.defaultValue
      options.forEach(function (item, index) {
        if (item.children) {
          item.children.forEach(function (item1, index1) {
            if (item1.children) {
              item1.children.forEach(function (item2, index2) {
                if (item2.value === value) {
                  labels = [item.label, item1.label, item2.label]
                  items = [item.value, item1.value, item2.value]
                }
              }, this);
            }
            if (item1.value === value) {
              labels = [item.label, item1.label]
              items = [item.value, item1.value]
            }
          }, this);
        }
        if (item.value === value) {
          labels = [item.label]
          items = [item.value]
        }
      }, this);
      this.currentItems = items
      this.labels = labels
    }
  },
  watch: {
    defaultValue(val) {
      if (this.defaultValue != this.value) this.init()
    },
    value(val) {
      this.$emit("onChange", val)
    }
  }
}
</script>
<style lang="less" scoped>
.gamepick {
  position: relative;
  .input {
    position: relative;
    height: 30px;
    width: 284px;
    padding: 0 25px 0 10px;
    border: 1px solid #bfcbd9;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
    .arrow {
      transition: 0.5s;
      position: absolute;
      color: #bfcbd9;
      line-height: 30px;
      right: 14px;
    }
    .arrow-up {
      transition: 0.5s;
      transform: rotate(180deg);
    }
    .list {
      display: flex;
      flex-direction: row;
      line-height: 30px;
      .items {
        padding-left: 4px;
        span {
          border-radius: 3px;
          line-height: 30px;
          padding: 2px 4px 2px 4px;
          &:hover {
            background-color: #bfcbd9;
          }
        }
      }
    }
  }
  .tabs {
    position: absolute;
    width: 600px;
    top: 40px;
    z-index: 999;
    span {
      padding: 5px 10px 5px 10px;
    }
    .active {
      background-color: #1D8CE0;
      color: #fff;
    }
    .el-tab-pane {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      span {
        line-height: 20px;
      }
    }
  }
}
</style>

