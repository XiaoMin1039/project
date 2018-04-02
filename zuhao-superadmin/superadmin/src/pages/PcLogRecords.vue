<template>
    <div class="pc-log-records">
        <div class="search search-box">
            <el-form label-width="120px">
                <el-col :span="12">
                    <el-form-item label="订单ID号：">
                        <el-input size="small"  placeholder="请输入订单ID号" v-model="search.order_id"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24" class="line">
                    <el-button type="primary" @click="onSearch">搜索</el-button>
                </el-col>
            </el-form>
        </div>
        <div class="table" v-show="!(loading || unfind)">
            <el-table :data="tableData" style="width:100%">
                <el-table-column prop="orderId" label="订单ID" align='center' width="130"></el-table-column>
                <el-table-column prop="historyId" label="历史上号ID"  width="130" align='center'></el-table-column>
                <el-table-column label="处理时间" align="center" show-overflow-tooltip>
                    <template scope="scope">
                         {{timeFormat(scope.row.timeStamp)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align='center' show-overflow-tooltip>
                    <template scope="scope">
                         {{getOperation(scope.row.operation)}}
                    </template>
                </el-table-column>
                 <el-table-column prop="error" label="异常信息说明" show-overflow-tooltip></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" :page-size="search.rows" layout="prev,pager,next,jumper" :page-count="totPage" :current-page.sync="nowPage"></el-pagination>
            </div>
        </div>
        <loading :loading="loading" :unfind="unfind" v-if="loading || unfind"></loading> 
    </div>
</template>
<script>
    import {timeFormat} from '../utils'
    export default{
        name:'PcLogRecords',
        data(){
            return{
                search:{
                    rows:10,
                    order_id:''
                },
                totPage:0,
                nowPage:1,
                loading:false,
                unfind:false,
                tableData:[]
            }
        },
        methods:{
            timeFormat(t){
                return timeFormat(t)
            },
            getOperation(type){
                if(type == 1) return '账号登录'
                else if(type == 2) return 'CDK验证成功'
                else if(type == 3) return '开始扫描窗口'
                else if(type == 4) return '扫描窗口完成'
                else if(type == 5) return '开始扫描进程'
                else if(type == 6) return '扫描进程完成'
                else if(type == 7) return '开启进程防护'
                else if(type == 8) return '开启截图监控'
                else if(type == 9) return '开启心跳请求'
                else if(type == 10) return '打开游戏'
                else if(type == 11) return '鼠标锁定'
                else if(type == 12) return '解除鼠标锁定'
                else if(type == 13) return '开始输入账号密码'
                else if(type == 14) return '账号密码输入完成'
                else if(type == 15) return '关闭游戏'
                else if(type == 16) return '用户中途打开杀毒软件'
                else if(type == 40) return '遇到非法窗口，执行重启电脑操作'
                else if(type == 41) return '遇到非法窗口，执行蓝屏操作'
                else if(type == 50) return '关闭上号器'
                else if(type == 100) return '驱动加载失败'
            },
            handleCurrentChange:function(val){
                this.fetchData(val,false)
            },
            onSearch(){
                this.nowPage=1;
                this.fetchData(1,false)
            },
            fetchData:function(page,first){
                this.loading=true
                this.unfind=false
                const data={
                    ...this.search,
                    page
                }
                if(!first) data['countPage']=this.totPage
                this.axios.post('admin/screen/order/process/operation/gets',data).then(({data})=>{
                    this.loading=false
                    if(data.content != 1) this.$message.error('服务器错误')
                    else{
                        if(data.object.length == 0) this.unfind = true
                        else{
                            if(first) this.totPage=data.countPage
                            this.tableData = data.object
                        }
                    }
                })
            }
        },
        mounted(){
            this.fetchData(1,true)
        }
    }
</script>
<style lang="less" scoped>
    .pc-log-records{
        display:flex;
        flex-direction:column;
        .search{
            margin-top:15px;
            .line{
                border-top:1px solid #e2e2e2;
                padding-top:15px;
                padding-left:50px;
            }
        }
        .table{
            margin-top:10px;
            padding:0;
        }
    }

</style>