var rows = 10; //一页条数
var count_page = null;//总页数
var data = {};

$(function () {
    data = {
        page:1,
        rows:rows
    };
    //获取数据
    getTableData('agents/short_cut/gets',data);
});

//点击search
$(document).on('click','#search',function () {
    count_page = null;
    var _this = $(this);
    _this.getButtonLoading();
    data = {
        page:1,
        rows:rows,
        order_id:$('#orderId').val(),
        product_id:$('#productId').val()
    };
    //获取数据
    getTableData('agents/money/out_money_change/gets',data,function () {
        _this.deleteButtonLoading();
    });
});

//快捷单词
var shortcuts = [
    {
        "content":"zoneName-name",
        "text":"游戏名称"
    },{
        "content":"zoneName-par",
        "text":"游戏大区"
    },{
        "content":"zoneName-chi",
        "text":"游戏子区"
    },{
        "content":"productTitle",
        "text":"账号标题"
    },{
        "content":"nickName",
        "text":"账号别名"
    },{
        "content":"createTime",
        "text":"订单开始时间"
    },{
        "content":"endTime",
        "text":"订单结束时间"
    },{
        "content":"totalTime",
        "text":"订单时长"
    },{
        "content":"orderCdk",
        "text":"激活码"
    },{
        "content":"shopName",
        "text":"店铺名"
    },{
        "content":"orderId",
        "text":"产品编号"
    },{
        "content":"roleName",
        "text":"角色名"
    }];

//点击删除术语
$(document).on('click','#delete',function(){
    var _this = $(this);
    var options={
        content:'确认删除该术语？',
        yes:function(){
            _this.getButtonLoading();
            data = {
                agents_short_cut_id:_this.parents('tr').attr('data-id')
            };
            getChangeData('agents/short_cut/delete',data,_this,function () {
                _this.deleteButtonLoading();
                _this.parents('tr').addClass('deleted');
            });
        }
    };
    $(this).minConfirmBox(options);
});

//创建新术语

//确定增加新的术语
$(document).on('click','#confirm',function(){
    var data = {
        //获取select值！！未完待续！
        nick_name:$("#shopNewsTitle").val(),
        content:$("#shopNewsContent").val()
    };
    if($(this).attr('data-id')==='look'){
        $('.pop-bg').addClass('hide')
    }else if($(this).attr('data-id') === 'edit'){
        data.agents_short_cut_id=$(this).attr('data-new_id');
        formGetData('#confirm',2,data,'agents/short_cut/update',  function (json) {
            if(json.content === 1){
                messageTip({message:'创建新术语成功',state:1,callback:function(){
                    history.go(0);
                }});
            }else{
                messageTip({message:'数据错误，请重试！',state:2})
            }
        });
    }else{
        formGetData('#confirm',2,data,'agents/short_cut/add',  function (json) {
            if(json.content === 1){
                messageTip({message:'创建新术语成功',state:1,callback:function(){
                    history.go(0);
                }});
            }else{
                messageTip({message:'数据错误，请重试！',state:2})
            }
        });
    }


});

//编辑术语和查看术语
$(document).on('click','#edit,#look',function() {
//加载按钮
    $("#shortcut-box").html('');
    $.each(shortcuts, function (index, s) {
        $("#shortcut-box").append("<button data-id=" + s.content + " class='button-event-small-blue'>" + s.text + "</button>")
    });

    var _this = $(this);
    var id = _this.parents('tr').attr("data-id");

    //让弹窗出现
    $('.pop-bg').removeClass('hide');
    $('.message-pop').css({marginTop:-$('.message-pop')[0].offsetHeight/2,marginLeft:-$('.message-pop')[0].offsetWidth/2})
    data = {
        news_id: $(this).parents('tr').attr('data-id')
    };

    //如果是edit，把数据填充进去
    //如果是look，把数据填充进去，然后所有的不可修改

    //获取数据
    $.ajax({
        url: spliceUrl('agents/short_cut/' + id),
        dataType: 'JSON',
        type: 'GET',
        xhrFields: {withCredentials: true},
        data: data
    }).done(function (json) {
        $("#shopNewsTitle").val(json.object.nickName);
        $("#shopNewsContent").val(json.object.content);
        $('#confirm').attr('data-new_id',id)
    }).fail(function () {
        var options = {
            message: '数据错误，请重试。',
            state: 3,
        };
        messageTip(options);
    });
    if ($(this).attr('id') == 'look') {//如果是查看状态
        $('.pop-bg input,.pop-bg textarea').attr('disabled', 'disabled');
        $('#shortcut-boxTip').addClass('opacity0');
        $("#shopNewsTitleTip").addClass('opacity0');
        $('#shopNewsContentTip').addClass('opacity0');
        $('#shortcut-box button').addClass('ban');
    } else {//如果时编辑状态
        $('.pop-bg input,.pop-bg textarea').removeAttr('disabled');
        $('#shortcut-boxTip').removeClass('opacity0');
        $("#shopNewsTitleTip").removeClass('opacity0').removeClass('img-bingo').removeClass('img-mistake').addClass('img-notice');
        $('#shopNewsContentTip').removeClass('opacity0').removeClass('img-bingo').removeClass('img-mistake').addClass('img-notice');
        $("#shopNewsTitleTip")[0].testTip.setVerification({errType:[2],isShow:0});
        $("#shopNewsContentTip")[0].testTip.setVerification({errType:[2],isShow:0});
        $('#shortcut-box button').removeClass('ban');
    }
    $('#confirm').attr('data-id',$(this).attr('id'));
});
//快捷按钮被点击
$(document).on('click','#shortcut-box button',function () {
    addSplitToField(document.getElementById('shopNewsContent'),"{"+$(this).text()+"} ");
});
