$(function () {
    //页面高级搜索栏
    $productState = $('#productState').dropDown({
        items: [
            {value: '0', label: '所有状态'},
            {value: '1', label: '租赁中'},
            {value: '2', label: '租赁结束'},
            {value: '3', label: '客户申诉'},
            {value: '4', label: '代理商申诉'},
            {value: '6', label: '订单异常关闭'},
            {value: '9', label: '撤单成功'},
            {value: '11', label: '已预约'},
            {value: '12', label: '取消预约'}
        ]
    });
    $productType = $('#productType').dropDown({
        items: [
            {value: '0', label: '所有订单'},
            {value: '1', label: '预订订单'},
            {value: '2', label: '即时订单'}
        ]
    });
    $payWay = $('#payWay').dropDown({
        items: [
            {value: '0', label: '所有订单'},
            {value: '1', label: '平台订单'},
            {value: '2', label: '自建订单'}
        ]
    });


    //搜索框 单个 高级 切换
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
        $.getJSON('http://datazudahao.oss-cn-shenzhen.aliyuncs.com/file/ziZone.json').then((data) => {
            $gameSelect = $('#game-select').getGameSelect(data);
        });
        //获取时间插件
        timeFrame();
    });
    //单个搜索
    $('#searchNotice').mouseenter(function () {
        $(this).toolTip({content: '支持多个条件搜索，您可以在订单编号、上号激活码或产品标题，三者中任选其一。进行快速搜索。'})
    });
    //高级搜索
    $('#orderKeywordsNotice').mouseenter(function () {
        $(this).toolTip({content: '支持多个条件搜索，您可以在订单编号、上号激活码或产品标题，三者中任选其一。进行快速搜索。'})
    });
    $('#productKeywordsNotice').mouseenter(function () {
        $(this).toolTip({content: '可以在产品编号或者产品别名中任选其一进行搜索。'})
    });
    $('#zizoneNotice').mouseenter(function () {
        $(this).toolTip({content: '选择游戏的名称/区/服务器，不需要精确选择，可以组合选择，比如单单选择游戏分类，也可以游戏分类+大区'})
    });
    $('#productStateNotice').mouseenter(function () {
        $(this).toolTip({content: '搜索的符合条件的订单状态'})
    });
    $('#timeFrameNotice').mouseenter(function () {
        $(this).toolTip({content: '搜索符合条件的下单时间，通过鼠标左键先选择开始时间，然后可以选择结束时间。'})
    });
    $('#productTypeNotice').mouseenter(function () {
        $(this).toolTip({content: '即时订单:付款后立即开始的订单，预定订单：付款后定时开始的订单。'})
    });
    $('#gameAccountNotice').mouseenter(function () {
        $(this).toolTip({content: '输入游戏的登录账号可以进行搜索'})
    });
    $('#roleNameNotice').mouseenter(function () {
        $(this).toolTip({content: '平台部分游戏支持自动获取角色名称，已经获取的角色名称可以进搜索'})
    });
    $('#linkWayNotice').mouseenter(function () {
        $(this).toolTip({content: '非签约账号中，在发布产品中的号主信息一栏有号主联系电话，可以用这个参数进行搜索 '})
    });
    $('#userPayWayNotice').mouseenter(function () {
        $(this).toolTip({content: '非签约账号中，在发布产品中的号主信息一栏有号主支付账号，可以用这个参数进行搜索'})
    });
    $('#payWayNotice').mouseenter(function () {
        $(this).toolTip({content: '平台订单：平台注册用户通过平台下的订单，自己流水走平台的。自建订单：自己生成的激活码订单，或者是VIP自助下单，均为自建订单。'})
    });
    $('#userAccountNotice').mouseenter(function () {
        $(this).toolTip({content: '只支持平台订单搜索，平台订单每个用户都有自己的登录账号。这里可以用平台的登录账号进行搜索。'})
    });
    $(document).on('mouseenter', '#filter', function () {
        $(this).toolTip({content: '搜索同一用户的所有订单'})
    });
    $(document).on('mouseenter', '#toBlack', function () {
        $(this).toolTip({content: '将该用户的账号加入到店铺黑名单'})
    });


    $(document).on('click', '#activation', function () {
        //跳出弹窗
        $('#upCode').removeClass('hide');
        $('.opacity-pop').css({
            marginTop: -$('.opacity-pop')[0].offsetHeight / 2,
            marginLeft: -$('.opacity-pop')[0].offsetWidth / 2
        });
        //复制按钮
        $('#copyBtn').mouseenter(function () {
            $(this).toolTip({content: '若有修改快捷短语内容，<br>可点击该按钮进行复制。'})
        });
        //选择按钮-这是动态生成的按钮
        $('#upCodeTBody').on('mouseenter', '#copy', function () {
            $(this).toolTip({content: '点击选择后，会自动复制。<br>若无修改，可直接粘贴。'})
        });

    });

    var enjoySharingOption = [
        {
            value: '0',
            label: '享受',
            type: 'primary'
        }, {
            value: '1',
            label: '不享受',
            type: 'primary'
        }
    ]
    $enjoySharing = $('#enjoySharing').select(enjoySharingOption, '0')

    moneyRegularTest($("#goOnRent #rentMoney"));
    intRegularTest($('#goOnRent #rentTime'));

});