$(function(){
    $state=$('#state').dropDown({
        items: [
            {value: '0', label: '所有状态'},
            {value: '100', label: '正常所有'},
            {value: '1', label: '正常可租'},
            {value: '2', label: '正常已租'},
            {value: '3', label: '待编辑'},
            {value: '4', label: '等待审核'},
            {value: '5', label: '下架'},
        ]
    });
    $accountType=$('#accountType').dropDown({
        items: [
            {value: '0', label: '所有类型'},
            {value: '1', label: '自建账号'},
            {value: '2', label: '签约账号'}
        ]
    });
    $.getJSON('http://datazudahao.oss-cn-shenzhen.aliyuncs.com/file/ziZone.json').then((data)=>{
        $gameSelect=$('#game-select').getGameSelect(data);
    });

    $('#keywordNotice').mouseenter(function () {
        $(this).toolTip({content:'支持多个条件搜索，您可以在产品编号、产品别名或产品标题，三者中任选其一。进行搜索。'})
    });
    $('#stateNotice').mouseenter(function () {
        $(this).toolTip({content:'搜索符合条件的产品状态'})
    });
    $('#gameNotice').mouseenter(function () {
        $(this).toolTip({content:'选择游戏的名称/区/服务器，不需要精确选择，可以组合选择，比如单单选择游戏分类，也可以游戏分类+大区'})
    });
    $('#accountTypeNotice').mouseenter(function () {
        $(this).toolTip({content:'自建账号：自己线下拥有的号源。平台签约：通过平台获得的号源'})
    });
    $('#gameAccountNotice').mouseenter(function () {
        $(this).toolTip({content:'输入游戏的登录账号可以进行搜索'})
    });
    $('#gameRoleNotice').mouseenter(function () {
        $(this).toolTip({content:'平台部分游戏支持自动获取角色名称，已经获取的角色名称可以进搜索'})
    });
    $('#userWayNotice').mouseenter(function () {
        $(this).toolTip({content:'非签约账号中，在发布产品中的号主信息一栏有号主联系电话，可以用这个参数进行搜索'})
    });
    $('#payAccountNotice').mouseenter(function () {
        $(this).toolTip({content:'非签约账号中，在发布产品中的号主信息一栏有号主支付账号，可以用这个参数进行搜索'})
    });
    $(document).on('mouseenter','#editNickname',function () {
        $(this).toolTip({content:'点击此处可以修改账号别名'})
    });
});