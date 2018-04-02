$(function(){
    //页面高级搜索栏
    $state=$('#state').dropDown({
        items: [
            {value: '0', label: '所有状态'},
            {value: '1', label: '租赁中'},
            {value: '2', label: '租赁结束'},
            {value: '3', label: '客户申诉'},
            {value: '4', label: '代理商申诉'},
            {value: '5', label: '订单异常关闭'},
            {value: '6', label: '撤单成功'},
            {value: '7', label: '已预约'},
            {value: '8', label: '取消预约'}
        ]
    });
    $screenState=$('#screenState').dropDown({
        items: [
            {value: '0', label: '所有订单'},
            {value: '1', label: '危险截图'},
            {value: '2', label: '待核对截图'}
        ]
    });
    $userPayWay=$('#userPayWay').dropDown({
        items: [
            {value: '0', label: '所有订单'},
            {value: '1', label: '支付宝'},
            // {value: '2', label: '微信'},
            // {value: '3', label: '财付通'},
            // {value: '4', label: '余额'}
        ]
    });

    //点击 让 单个搜索 显示
    $(document).on('click', '#single-search', function () {
        $('.multi-search').css('display', 'none');
        $('.single-search').css('display', 'block');
    });
    //点击 让 高级搜索 显示
    $(document).on('click', '#multi-search', function () {
        $('.single-search').css('display', 'none');
        $('.multi-search').css('display', 'block');
        //获取游戏大区子区
        $.getJSON('http://datazudahao.oss-cn-shenzhen.aliyuncs.com/file/ziZone.json').then((data)=>{
            $gameSelect=$('#game-select').getGameSelect(data);
        });
        //获取时间插件
        timeFrame();
    });
    //单个搜索
    $('#searchNotice').mouseenter(function () {
        $(this).toolTip({content:'支持多个条件搜索，您可以在订单编号、上号激活码或产品标题，三者中任选其一。进行快速搜索。'})
    });
    //高级搜索
    $('#orderKeywordsNotice').mouseenter(function () {
        $(this).toolTip({content:'支持多个条件搜索，您可以在订单编号、上号激活码或产品标题，三者中任选其一。进行快速搜索。'})
    });
    $('#productKeywordsNotice').mouseenter(function () {
        $(this).toolTip({content:'可以在产品编号或者产品别名中任选其一进行搜索。'})
    });
    $('#zizoneNotice').mouseenter(function () {
        $(this).toolTip({content:'选择游戏的名称/区/服务器，不需要精确选择，可以组合选择，比如单单选择游戏分类，也可以游戏分类+大区'})
    });
    $('#stateNotice').mouseenter(function () {
        $(this).toolTip({content:'搜索的符合条件的订单状态'})
    });
    $('#linkWayNotice').mouseenter(function () {
        $(this).toolTip({content:'非签约账号中，在发布产品中的号主信息一栏有号主联系电话，可以用这个参数进行搜索 '})
    });
    $('#userPayWayNotice').mouseenter(function () {
        $(this).toolTip({content:'非签约账号中，在发布产品中的号主信息一栏有号主支付账号，可以用这个参数进行搜索'})
    });
    $('#screenStateNotice').mouseenter(function () {
        $(this).toolTip({content:'危险截图：租客开启的程序已经触发了发外挂机制。待核对截图：租客开启的程序可能会到游戏的账号安全有害。需要人工看图进行校对处理。'})
    });
    $('#timeFrameNotice').mouseenter(function () {
        $(this).toolTip({content:'搜索符合条件的下单时间，通过鼠标左键先选择开始时间，然后可以选择结束时间。'})
    });
    // $('#userAccountNotice').mouseenter(function () {
    //     $(this).toolTip({content:'可输入要搜索的标题'})
    // });
    //点击订单详情 图片和文字信息切换
    $(document).on('click','.change-img-info',function () {
        if($(this).parents('.pic-item').find('.pic-box-img').hasClass('hide')){
            $(this).parents('.pic-item').find('.pic-box-img').removeClass('hide');
            $(this).parents('.pic-item').find('.pic-box-info').addClass('hide');
        }else{
            $(this).parents('.pic-item').find('.pic-box-img').addClass('hide');
            $(this).parents('.pic-item').find('.pic-box-info').removeClass('hide');
        }
    });

    //点击弹窗里的状态栏
    var w = $('#tradeDiaryTemplate .status>ul>li.active').width() + 40;
    var l = 0;
    $('#tradeDiaryTemplate  .status>ul>li').each(function (index) {
        if ($('#tradeDiaryTemplate  .status>ul>li.active').index() > index) {
            l += $(this).width() + 40;
        }
    });
    $('#tradeDiaryTemplate  .line').css({'width': w, 'left': l});
    //所有状态 tab
    $(document).on('click', '#tradeDiaryTemplate .status>ul>li', function () {
        $('#tradeDiaryTemplate  .status>ul>li').removeClass('active');
        $(this).addClass('active');
        // $('#tbody').getLoadingTable();
    });

    $(document).on('mouseenter', '#tradeDiaryTemplate  status>ul>li', function () {
        var w = $(this).width() + 40;
        var l = 0;
        var _this = $(this);
        $('#tradeDiaryTemplate  .status>ul>li').each(function (index) {
            if (_this.index() > index) {
                l += $(this).width() + 40;
            }
        });
        $('#tradeDiaryTemplate  .line').css({'width': w, 'left': l})
    });

    $(document).on('mouseout', '#tradeDiaryTemplate .status>ul>li', function () {
        var w = $('#tradeDiaryTemplate  .status>ul>li.active').width() + 40;
        var l = 0;
        $('#tradeDiaryTemplate  .status>ul>li').each(function (index) {
            if ($('#tradeDiaryTemplate  .status>ul>li.active').index() > index) {
                l += $(this).width() + 40;
            }
        });
        $('#tradeDiaryTemplate  .line').css({'width': w, 'left': l})
    });

    var enjoySharingOption=[
        {
            value: '0',
            label: '享受',
            type: 'primary'
        },{
            value: '1',
            label: '不享受',
            type: 'primary'
        }
    ]
    $enjoySharing=$('#enjoySharing').select(enjoySharingOption,'0')

    moneyRegularTest($("#goOnRent #rentMoney"));
    intRegularTest($('#goOnRent #rentTime'));
});