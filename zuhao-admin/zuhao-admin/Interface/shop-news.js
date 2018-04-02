var rows = 10; //一页条数
var count_page = null;//总页数
var data = {};

$(function () {
    data = {
        page:1,
        rows:rows
    };
    //获取数据
    getTableData('agents/news/gets',data);
});

//点击状态栏
$(document).on('click','.status li',function () {
    count_page = null;
    data = {
        page:1,
        rows:rows,
        news_state:$(this).index(),
        news_title:$('#searchword').val()
    };
    //获取数据
    getTableData('agents/news/gets',data);
});


//点击删除店铺新闻
$(document).on('click','#delete',function(){
    var _this = $(this);
    var options={
        content:'确认删除该店铺公告',
        yes:function(){
            //获取增删改查的数据
            _this.getButtonLoading();
            data = {
                news_id:_this.parents('tr').attr('data-id')
            };
            getChangeData('agents/news/delete',data,_this,function () {
                _this.deleteButtonLoading();
                _this.parents('tr').addClass('deleted');
            });
        }
    };
    $(this).minConfirmBox(options);
});


//点击查看或者编辑店铺公告
$(document).on('click','#edit,#look',function(){
    //让弹窗出现
    $('.pop-bg').removeClass('hide');
    $('.message-pop').css({marginTop:-$('.message-pop')[0].offsetHeight/2,marginLeft:-$('.message-pop')[0].offsetWidth/2})
    data = {
        news_id:$(this).parents('tr').attr('data-id')
    };

    //如果是edit，把数据填充进去
    //如果是look，把数据填充进去，然后所有的不可修改

    //获取数据
    $.ajax({
        url:spliceUrl('agents/news/get'),
        dataType:'JSON',
        type:'POST',
        xhrFields:{withCredentials:true},
        data:data
    }) .done(function (json) {
        $("#shopNewsTitle").val(json.agentsNews[0].newsTitle);
        $("#shopNewsContent").text(json.agentsNews[0].content);
        if (json.agentsNews[0].startTime && json.agentsNews[0].endTime) {
            $("#timeFrameAfter").val(getFullTimeF(json.agentsNews[0].startTime)+' 至 '+getFullTimeF(json.agentsNews[0].endTime))
        }
    }).fail(function () {
        var options={
            message:'数据错误，请重试。',
            state:3,
        };
        messageTip(options);
    });
    //不可修改
    if($(this).attr('id') == 'look'){
        $('.pop-bg input,.pop-bg textarea').attr('disabled','disabled');
        $('#shopNewsTitleTip').addClass('opacity0');
        $("#shopNewsContentTip").addClass('opacity0');
        $('#timeFrameAfterTip').addClass('opacity0');
    }else{
        $('.pop-bg input,.pop-bg textarea').removeAttr('disabled');
        $('#shopNewsTitleTip').removeClass('opacity0').removeClass('img-bingo').removeClass('img-mistake').addClass('img-notice');
        $("#shopNewsContentTip").removeClass('opacity0').removeClass('img-bingo').removeClass('img-mistake').addClass('img-notice');
        $('#timeFrameAfterTip').removeClass('opacity0').removeClass('img-bingo').removeClass('img-mistake').addClass('img-notice');
        $("#shopNewsContentTip")[0].testTip.setVerification({errType:[2,2],isShow:0});
        $("#timeFrameAfterTip")[0].testTip.setVerification({errType:[2],isShow:0});
        $("#shopNewsTitleTip")[0].testTip.setVerification({errType:[2,2],isShow:0});
    }
    $('#confirm').attr('data-id',$(this).attr('id'));
});

//确定添加店铺公告
$(document).on('click','#confirm',function () {
    var data = {
        publishId:1,
        content:$('#shopNewsContent').val(),
        newsTitle:$('#shopNewsTitle').val()
    };
    if ($("#timeFrameAfter").val()) {
        var time = $("#timeFrameAfter").val().split("至");
        data.startTime = changeTimeToUnix(time[0]);
        data.endTime = changeTimeToUnix(time[1]);
    }
    if($(this).attr('data-id')==='look'){
        $('.pop-bg').addClass('hide')
    }else if($(this).attr('data-id') === 'edit'){
        formGetData('#confirm',3,data,'agents/news/edit',  function (json) {
            if(json.content === 1){
                messageTip({state:1,message:'编辑新闻成功',callback:function () {
                    history.go(0);
                }});
            }else{
                messageTip({state:3,message:'编辑新闻失败，请重试！'})
            }
        });
    }else{
        formGetData('#confirm',3,data,'agents/news/add',  function (json) {
            if(json.content === 1){
                messageTip({state:1,message:'创建新闻成功',callback:function () {
                    history.go(0);
                }});
            }else{
                messageTip({state:3,message:'创建新闻失败，请重试！'})
            }
        });
    }

});

//点击搜索店铺新闻
$(document).on('click','#search',function () {
    count_page = null;
   data={
       page:1,
       rows:rows,
       news_title:$('#searchword').val()
   };
   //获取数据
    getTableData('agents/news/gets',data);
});