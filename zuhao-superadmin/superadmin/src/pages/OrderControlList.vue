<template>
    <div class="order-control-list">
        <div class="search search-box">
            <el-form label-width="120px">
                <el-col :span="12">
                    <el-form-item label="订单号：">
                        <el-input size="small"  placeholder="请输入订单号" v-model="search.order_id"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="操作记录类型：">
                        <el-select size="small" @change="selectChange" v-model="type" placeholder="进程拦截">
                            <el-option v-for="item in operationState" :label="item.val" :key="item.type" :value="item.type"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="代理商：">
                        <el-input size="small"  placeholder="请输入代理商ID" v-model="search.agents_id"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24" class="line">
                    <el-button type="primary" @click="onSearch">搜索</el-button>
                </el-col>
                
            </el-form>
        </div>
        <div class="tabs">
            <el-tabs v-model="search.type" @tab-click="changeTab">
                <el-tab-pane v-for="item in operationState" :label="item.val" :key="item.type" :name="item.type"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="table" v-show="!(loading || unfind)">
            <el-table :data="tableData" style="width:100%" v-show="isUserOperation">
                <el-table-column prop="historyId" label="上号ID" align='center' width="80"></el-table-column>
                <el-table-column prop="imagePath" label="路径"  show-overflow-tooltip></el-table-column>
                <el-table-column label="防护进程"  align='center' width="95">
                    <template scope="scope" width="80">
                         {{getSecureState(scope.row.secureState)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作进程" align='center'>
                    <template scope="scope">
                         {{getOperation(scope.row.type,scope.row.operation)}}
                    </template>
                </el-table-column>
                <el-table-column label="处理结果" align='center'>
                    <template scope="scope">
                         {{getHandleResult(scope.row.handleResult)}}
                    </template>
                </el-table-column>
                <el-table-column label="类型"  align='center'>
                    <template scope="scope">
                         {{getProcessType(scope.row.processType)}}
                    </template>
                </el-table-column>
                <el-table-column label="游戏在线" align='center' width="95">
                     <template scope="scope">
                         {{scope.row.isOnline == 1?'在线':'不在线'}}
                    </template>
                </el-table-column>
                <el-table-column label="是否放行" align='center' width="95">
                    <template scope="scope">
                         {{scope.row.isPass == 0?'放行':'不放行'}}
                    </template>
                </el-table-column>
                <el-table-column label="是否隐藏" align='center' width="95">
                    <template scope="scope">
                         {{scope.row.isHide == 0?'否':'是'}}
                    </template>
                </el-table-column>
                <el-table-column label="处理时间"  show-overflow-tooltip>
                    <template scope="scope">
                         {{timeFormat(scope.row.registerTime)}}
                    </template>
                </el-table-column>
            </el-table>
            <el-table :data="tableData" style="width:100%" v-show="sisUserOperation">
                <el-table-column prop="historyId" label="上号ID" align='center' width="80"></el-table-column>
                <el-table-column label="操作进程" align='center'>
                    <template scope="scope">
                         {{getOperation(scope.row.type,scope.row.operation)}}
                    </template>
                </el-table-column>
                <el-table-column label="处理结果" align='center'>
                    <template scope="scope">
                         {{getHandleResult(scope.row.handleResult)}}
                    </template>
                </el-table-column>
                <el-table-column label="游戏在线" align='center' width="95">
                     <template scope="scope">
                         {{scope.row.isOnline == 1?'在线':'不在线'}}
                    </template>
                </el-table-column>
                <el-table-column label="是否放行" align='center' width="95">
                    <template scope="scope">
                         {{scope.row.isPass == 0?'放行':'不放行'}}
                    </template>
                </el-table-column>
                <el-table-column label="是否隐藏" align='center' width="95">
                    <template scope="scope">
                         {{scope.row.isHide == 0?'否':'是'}}
                    </template>
                </el-table-column>
                <el-table-column label="处理时间"  show-overflow-tooltip>
                    <template scope="scope">
                         {{timeFormat(scope.row.registerTime)}}
                    </template>
                </el-table-column>
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
    name:'OrderControlList',
    data(){
        return{
            operationState:[
                {type:'1',val:'进程拦截'},
                {type:'2',val:'窗口拦截'},
                {type:'3',val:'用户操作行为'},
                {type:'4',val:'进程行为监控'}
            ],
            activeName:1,
            totPage:0,
            loading:false,
            unfind:false,
            tableData:[],
            search:{
                rows:10,
                type:'1',
                order_id:'',
                agents_id:''
            },
            type:'1',
            isUserOperation:true,
            nowPage:1
        }
    },
    methods:{
        timeFormat(t){
            return timeFormat(t)
        },
        getProcessType(type){
            if(type == 1)return '未知进程'
            else if(type == 2)return '全局黑名单'
            else if(type == 3)return '商家黑名单'
            else if(type == 4)return '普通进程'
            else if(type == 5)return '系统进程'
            else if(type == 6)return '全局白名单'
            else if(type == 7)return '商家白名单'
        },
        getHandleResult(type){
            if(type == 0)return '不是进程或者窗口'
            else if(type == 1)return '拦截成功'
            else if(type == 2)return '放行'
            else if(type == 3)return '处理中'
        },
        getSecureState(state){
            if(state==1)return '进程扫描'
            else if(state==2)return '防护阶段'
        },
        getOperation(type,operation){
            if(type == 1||type == 2){
                if(operation == 0)return '不进行操作'
                else if(operation == 1)return '冻结CDK'
                else if(operation == 2)return '重启'
                else if(operation == 3)return '蓝屏'
                else if(operation == 4)return '强制关闭上号器'
            }else if(type == 3){
                if(operation == 1)return 'CDK验证成功'
                else if(operation == 2)return '打开游戏'
                else if(operation == 3)return '开始输入账号密码'
                else if(operation == 4)return '账号密码输入完成'
                else if(operation == 5)return '关闭游戏'
                else if(operation == 6)return '关闭上号器'
            }else if(type == 4){
                if(operation == 1)return '进程创建'
                else if(operation == 2)return '远线程注入'
                else if(operation == 3)return '输入法注入'
            }
        },
        changeTab:function(tab,event){
            this.type=tab.name
            this.nowPage=1;
            this.fetchData(1,false);
        },
        handleCurrentChange:function(val){
            this.fetchData(val,false)
        },
        fetchData:function(page,first){
            this.loading = true
            this.unfind= false
            const data={
                ...this.search,
                page
            }
            if(!first) data['countPage']=this.totPage;
            this.axios.post('admin/screen/order/process/gets',data).then(({data})=>{
                this.loading=false
                if(data.content != 1)this.$message.error('服务器错误')
                else{
                    if(data.pcProcesses.length == 0)this.unfind = true;
                    if(first) this.totPage=data.countPage;
                    this.tableData = data.pcProcesses
                }
            })
        },
        selectChange:function(select){
            this.type=select
        },
        onSearch:function(){
            this.search.type=this.type
            this.nowPage=1;
            this.fetchData(1,false)
        }
    },
    mounted(){
         this.fetchData(1,true)
    },
    watch:{
        type:function(val,oldVal){
             if(val == 3)this.isUserOperation=false;
            else this.isUserOperation=true;
        }
    }
}
</script>
<style lang="less" scoped>
    .order-control-list{
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
        .tabs{
           background-color: #fff;
            margin-top: 10px;
            padding: 0; 
            .el-tabs {
                .el-tabs__header {
                    margin-bottom: 0px;
                }
            }
        }
    }

</style>