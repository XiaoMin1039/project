var rows = 10; //一页条数
var count_page = null;//总页数
var data = {
    page: 1,
    rows: rows,
    zizone: 0,//选择的游戏
    order_type: 1,//排序类型
    prices: '0,100000',//价格区间
    deposit: 2,//押金
    isKeepPlay: 2,//到是是否下线
    keyword: ''
};

/**
 *  （时租价格区间 == 默认排序 时间 价格 销量 评价 无押金 到时间不下线 == 类型 > 游戏名称 > 游戏服务器） > 翻页
 *   点击后面 不影响前面选择，点击前面 后面选择清空
 */
$(function () {
    //获取数据
    getTableData('product/equip_keyword', data, function (json) {
        pageChange(json);
    });
});

//点击搜索 (清空其他所有的选择)
$(document).on('click', '#search', function () {
    //清空其他所有的选择
    data = {
        page: 1,
        rows: rows,
        zizone: 0,//选择的游戏
        order_type: 1,//排序类型
        prices: '0,100000',//价格区间
        deposit: 2,//押金
        isKeepPlay: 2,//到时是否下线
        keyword: ''
    };
    data.zizone = $gameSelect.getValue();
    data.keyword = $('.search-tab-box').find('.active').find('input').val();
    getTableData('product/equip_keyword', data, function (json) {
        pageChange(json);
    });
});

//类型(目前只有电脑游戏类型，所以没什么代码)
//游戏名称
$(document).on('click', '#gameBox i', function () {
    var _this = $(this);
    //没错就是要加这么多个0
    data.zizone = _this.attr('data-id')+'0000000';
    console.log(data.zizone )
    var html = '<li data-id="'+_this.attr('data-id')+'0000000" class="active">所有服务器</li>';
    getTableData('product/equip_keyword', data, function (json) {
        pageChange(json);
    });
    //输出选择的游戏的所有服务器
    $.getJSON("http://res.zudahao.com/file/gameZone.json", function (json) {
        $.each(json, function (index, element) {
            if (_this.attr('data-id') == index) {
                $.each(element, function (ind, ele) {
                    $.each(ele, function (i, el) {
                        html += '<li data-id=' + i + '>' + el + '</li>';
                    });
                });
            }
        });
        $('#gameZone').html(html);
    });
});

//游戏服务器
$(document).on('click', '#gameZone li', function () {
    data.zizone = $(this).attr('data-id');
    //获取数据
    getTableData('product/equip_keyword', data, function (json) {
        pageChange(json);
    });
});

//选择价格区间
$(document).on('click', '#price li', function () {
    data.page = 1;
    //0默认排序 1总时长 2销量  3时租价格：从低到高 4时租价格：从高到低 5上架时间：从晚到早 6上架时间：从早到晚
    data.order_type = $('.product-title li.active').attr('data-id');
    switch ($(this).index()) {
        case  0:
            data.prices = '0,100000';
            break;
        case  1:
            data.prices = '0,3';
            break;
        case  2:
            data.prices = '3,5';
            break;
        case  3:
            data.prices = '5,10';
            break;
        case  4:
            data.prices = '10,100000';
            break;
    }
    //获取数据
    getTableData('product/equip_keyword', data, function (json) {
        pageChange(json);
    });
});
//点击确定价格区间 input
$(document).on('click', '#priceQuery', function () {
    data.page = 1;
    var startPrice, endPrice;
    startPrice = $('#startPrice').val() || 0;
    endPrice = $('#endPrice').val() || 10000;
    data.prices = startPrice + ',' + endPrice;
    getTableData('product/equip_keyword', data, function (json) {
        pageChange(json);
    });
});
//点击默认排序 时间 价格 销量 评价!!!
$(document).on('click', '.product-title li', function () {
    data.page = 1;
    //0默认排序 1总时长 2销量  3时租价格：从低到高 4时租价格：从高到低 5上架时间：从晚到早 6上架时间：从早到晚
    data.order_type = $(this).attr('data-id');
    //获取数据
    getTableData('product/equip_keyword', data, function (json) {
        pageChange(json);
    });
});
//无押金
$(document).on('click', '#moneyMortgage', function () {
    data.page = 1;
    //0 无押金 1 有押金 2 两个
    if ($(this).is(':checked')) {
        data.deposit = 0;
    } else {
        data.deposit = 2;
    }
    //获取数据
    getTableData('product/equip_keyword', data, function (json) {
        pageChange(json);
    });
});
//到时不下线
$(document).on('click', '#timeEnd', function () {
    data.page = 1;
    // 0 只要下线 1 不下线  2 都要
    if ($(this).is(':checked')) {
        data.isKeepPlay = 1;
    } else {
        data.isKeepPlay = 2;
    }
    //获取数据
    getTableData('product/equip_keyword', data, function (json) {
        pageChange(json);
    });
});
//点击 共多少商品 旁边的 上一页 下一页
$(document).on('click', '.product-title-num i', function () {
    var _this = $(this);
    data.page = _this.attr('id') == 'prePage' ? data.page - 1 : data.page = data.page + 1;
    //获取数据
    getTableData('product/equip_keyword', data, function (json) {
        pageChange(json);
    });
});
//改变 共多少商品 旁边的分页情况
function pageChange(json) {
    if (data.page <= 1) {
        $('#prePage').addClass('ban');
    } else {
        $('#prePage').removeClass('ban');
    }
    //如果已经是最后一页
    if (data.page >= json.countPage) {
        $('#nextPage').addClass('ban');
        if (json.countPage == 0) {
            data.page = 0;
        }
    } else {
        $('#nextPage').removeClass('ban');
    }
    $('#productSize').text(json.productSize);
    $('#nowPage').text(data.page);
    $('#totolPage').text(json.countPage);
}












