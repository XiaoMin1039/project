$(function () {
    $type=$('#type').dropDown({
        items: [
            {value: '1', label: '进程或模块拦截'},
            {value: '2', label: '窗口拦截'},
            {value: '3', label: '进程行为拦截'},
            {value: '4', label: '操作行为拦截'},
            {value: '5', label: 'PC端提示'}
        ]
    });
    $('#orderIdNotice').mouseenter(function () {
        $(this).toolTip({content:'搜索符合条件订单号码'})
    });
    $('#typeNotice').mouseenter(function () {
        $(this).toolTip({content:'具体的拦截情况请通过站内帮助中心进行学习和理解'})
    });

    $(document).on('mouseenter','[data-id="imagePathNotice"]',function () {
        var program=$(this).attr('data-msg');
        var lastIndex=program.lastIndexOf('\\');
        var programName=program.slice(lastIndex+1);
        var programPath=program.slice(0,lastIndex);

        var note=$(this).attr('data-note');

        var str = "";
        if(note){
            str = "<p>进程名称："+programName+"</p><p>进程路径："+programPath+"</p><p>进程描述："+note+"</p>"
        }else{
            str = "<p>进程名称："+programName+"</p><p>进程路径："+programPath+"</p>"
        }
        $(this).toolTip({content:str})
    })
});