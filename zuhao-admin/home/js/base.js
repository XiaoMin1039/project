$(function () {

    //最顶端nav的hover事件
    $('.header-nav>ul>li').hover(function () {
        $(this).find('.header-nav-info').css('display', 'block')
    }, function () {
        $(this).find('.header-nav-info').css('display', 'none')
    });


    //搜索游戏列表
    $.getJSON('http://datazudahao.oss-cn-shenzhen.aliyuncs.com/file/ziZone.json').then(function (data) {
        $gameSelect = $('#game-select').getGameSelect(data);
    });

    //游戏菜单
    $(document).on('mouseenter', '.game-lists>li', function () {
        $('.game-zizone').eq($(this).index()).show();
    });
    $(document).on('mouseleave', '.game-lists>li', function () {
        $('.game-zizone').eq($(this).index()).hide();
    });
    $(document).on('mouseleave', '#bannerList', function () {
        $('.game-lists').css('display', 'none');
    });
    $(document).on('mouseenter', '.game-zizone', function () {
        $(this).show();
        $('.game-lists>li').eq($(this).index() - 2).addClass('game-lists-active');
    });
    $(document).on('mouseleave', '.game-zizone', function () {
        $(this).hide();
        $('.game-lists>li').removeClass('game-lists-active');
    });
    $.getJSON("http://res.zudahao.com/file/gameZone.json", function (res) {
        var sorted = [9, 3, 6, 7, 8, 5];
        var icon = {
            9: "lol",
            3: "cf",
            6: "nizhan",
            7: "qiang",
            8: "shou",
            5: "cs"
        };
        var ulHtml = "",
            liHtml = '';
        $.each(sorted, function (index, item) {
            ulHtml += ("<li><span data-code=\"" + item + "\"><i class=\"iconfont icon-" + icon[item] + "\"></i>" + res[-1][item] + "</span></li>");
            var str = "<ul class=\"game-zizone\">";
            $.each(Object.keys(res[item]), function (index1, item1) {
                var str2 = ("<li><span data-code=\"" + item1 + "\">" + res[-1][item1] + "</span><ul>");
                $.each(Object.keys(res[item][item1]), function (index2, item2) {
                    str2 += ("<li><span data-code=\"" + (parseInt(item2) + 100) + "\">" + res[item][item1][item2] + "</span></li>");
                });
                str2 += "</ul></li>";
                str += str2;
            });
            str += "</ul>";
            liHtml += str;
        });
        $(".banner-lists>.game-lists").html(ulHtml);
        $('.banner-lists').append(liHtml);
    });

    //点击所有游戏列表
    $(document).on('click', '#bannerAllGame', function () {
        $('.game-lists').css('display', 'block')
    });


});


/*拼装url——接口*/
function spliceUrl(urlLast) {
    //192.168.31.39
    //www.zudahao.com
    var url = 'http://192.168.31.39/api/';
    return url + urlLast
}
//获取url中携带的参数信息
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]);
    return null;
}
//时间插件
function timeFrame() {
    //从现在开始的日期时间选择
    laydate.render({
        elem:'#timeFrameNow'
        ,min: new Date().getTime()
        , max: '2099-12-31 23:59:59'
        , format: 'yyyy-MM-dd HH:mm:ss'
        , theme: '#d7063b'
        , btns: ['now', 'confirm']
        , type: 'datetime'
    });
    //日期范围
    laydate.render({
        elem: '#timeFrameBefore'
        , min: -15
        , max: 0
        , format: 'yyyy-MM-dd HH:mm:ss'
        , theme: '#1E9FFF'
        , range: '至'
        , type: 'datetime'
    });
    laydate.render({
        elem: '#timeFrameAfter'
        , min: 0
        , max: '2099-12-31 23:59:59'
        , format: 'yyyy-MM-dd HH:mm:ss'
        , theme: '#1E9FFF'
        , range: '至'
        , type: 'datetime'
        , done: function () {
            if ($("#timeFrameAfterTip").length === 1) {
                $('#timeFrameAfterTip').removeClass('img-mistake').removeClass('img-notice').addClass('img-bingo');
                $("#timeFrameAfterTip")[0].testTip.setVerification({errType: [1], isShow: 0, notAutoHide: 1})
            }
        }
    });
    //具体到时分秒，但是要自己选择
    laydate.render({
        elem: '#timeFrameSelect'
        , type: 'datetime'
        , min: 0
        , max: '2099-12-31 23:59:59'
        , theme: '#1E9FFF'
        , btns: ['now', 'confirm']
        , done: function () {
            if ($("#timeFrameSelectTip").length === 1) {
                $('#timeFrameSelectTip').removeClass('img-mistake').removeClass('img-notice').addClass('img-bingo');
                $("#timeFrameSelectTip")[0].testTip.setVerification({errType: [1], isShow: 0, notAutoHide: 1})
            }
        }
    });
}
/*将形如"2016-12-12"的字符串转换成标准格式unix时间戳*/
function changeTimeToUnix(timeStr) {
    var date = new Date(Date.parse(timeStr.replace(/-/g, "/")));
    return date.getTime();
}

/*判断是否将变量的值转换*/
function isChangeVariable(variable, change) {
    if (isExist(change) && change != 0) {
        return change
    } else return variable
}

/*确认是否在data中添加属性*/
function confirmAddProto(protoValue, data, protoName) {
    if (isExist(protoValue)) {
        data[protoName] = protoValue;
    }
}
//判断是否存在
function isExist(variable) {
    if (typeof variable === 'string' && variable !== '') {
        return true;
    }
    return !(isNaN(variable) || typeof variable === 'undefined' || variable === null || variable === '');
}


/*加载数据错误或没有数据——三角形*/
// $.fn.getUndefined = function (option) {
//     if (this.find('.undefined').length === 0) {
//         var html = `
//         <div class="product-undefined">
//             <i class="img img-undefined"></i>
//             <div>
//                 <p>没有找到于 <i>“绝地求生” </i>相关的账号信息。</p>
//                 <p>您可以尝试更换游戏，或者修改搜索的关键词。</p>
//                 <p>您若有限制的游戏账号资源，也可以进行将账号托管到平台 ： <a href="" target="_blank">点击进行放号操作</a></p>
//             </div>
//         </div>
//         `;
//         this.show();
//         this.append(html);
//     }
// };


/**
 * 请求页面上的表格数据（非弹窗里的）
 * @param url 接口名
 * @param data 参数
 * @param func 其他操作方法
 */
function getTableData(url, data, func) {
    $.ajax({
        url: spliceUrl(url),
        dataType: 'JSON',
        type: 'POST',
        data: data,
        xhrFields: {withCredentials: true},
        beforeSend: function () {
            //去掉页面上所有的undefined
            // $('.undefined').remove();
            //隐藏页面上表格tbody内容
            // $('#tbody').hide();
            //隐藏掉页面上的分页
            // $('.pop-pages').hide();
            //小牛
            // $('.table-wrap').getLoading();
        }
    }).done(function (json) {
        // $('.loading').remove();
        // 如果请求到数据
        if (json.content == 1) {
            count_page = isChangeVariable(count_page, json.countPage) || 0;//总页数
            //分页插入
            $('.pop-pages').html('');
            if (count_page >= 2) {//如果分页大于2，插入数据显示分页框
                $('.pop-pages').pagination({
                    pageCount: count_page,
                    jump: true,
                    coping: true,
                    current: data.page,
                    prevContent: '上一页',
                    nextContent: '下一页',
                    callback: function (api) {
                        data.page = api.getCurrent();
                        //加上此处判断，则没有分页的单跳数据也可以模板生成
                        if (count_page) {
                            confirmAddProto(count_page, data, 'count_page');
                        }
                        getTableData(url, data)
                    }
                });
                $('.pop-pages').show();
            }
            //将模板数据填充到页面上
            json.window = window;
            var html = template('tbodyTemplate', json);
            $('#tbody').html(html);
            //显示tbody和分页
            $('#tbody').show();
        } else {//没有成功请求到数据
            // $('.main').getUndefined({text: json.data || '哎呦喂，出错了'});
        }
        //其他的操作
        if (func) {
            func(json);
        }
    }).fail(function () {
        //去掉加载效果，显示服务器出错的手机图片
        // $('.loading').remove();
        // $('.main').getUndefined('服务器出错');
        // //其他的操作
        // if (func) {
        // }
    });
}
/**
 * 请求数据或表单提交
 * @param url 提交的接口
 * @param data 参数
 * @param ele 对象 $()
 * @param func 其他操作
 */
function getFormData(url, data, ele, func) {
    //点击时，鼠标的菊花事件
    if (ele) ele.getButtonLoading();
    $.ajax({
        url: spliceUrl(url),
        dataType: 'JSON',
        type: 'POST',
        xhrFields: {withCredentials: true},
        async: false,
        data: data || ''
    }).done(function (json) {
        //请求成功，去掉鼠标的菊花事件
        if (ele) ele.deleteButtonLoading();
        func(json);

        //成功为啥不提示呢？！！！！！！！！！！


    }).fail(function () {
        //请求失败，去掉鼠标的菊花事件
        if (ele) ele.deleteButtonLoading();
        var options = {
            message: '数据错误，请重试。',
            state: 3//1、cssDemo、3三种状态:1成功,2失败,3警告
        };
        //页面上方显示表单提交的警告小提示
        messageTip(options);
    })
}
/**
 * 表格里数据的增删改查（弹窗和非弹窗）
 * @param url 接口
 * @param data 参数
 * @param ele 要修改的对象$()
 * @param func 其他方法
 */
function getChangeData(url, data, ele, func) {
    $.ajax({
        url: spliceUrl(url),
        dataType: 'JSON',
        type: 'POST',
        xhrFields: {withCredentials: true},
        data: data
    }).done(function (json) {
        ele.deleteButtonLoading();
        if (json.content == 1) {
            //删除成功
            var options = {
                message: ele.text() + '成功',
                state: 1,//1、cssDemo、3三种状态:1成功,2失败,3警告
            };
            //如果成功的话，可能使用这里面的数据做一些操作
            if(func) func(json);
        } else {
            //失败
            var options = {
                message: returnError(json.content),//ele.text() + '失败',
                state: 2,//1、cssDemo、3三种状态:1成功,2失败,3警告
            };
            //删除的错误是随意报的？如果是删除是不是需要些 “删除失败”！！！！
        }
        //显示页面上方小提示
        messageTip(options);
    }).fail(function () {
        ele.deleteButtonLoading();
        var options = {
            message: '数据错误，请重试。',
            state: 3//1、cssDemo、3三种状态:1成功,2失败,3警告
        };
        //显示页面上方小提示
        messageTip(options);
    })
}
/*获取时间字符串*/

function getFullTimeCN(time) {
    var returnTime = new Date(time);
    return (
        parseInt(returnTime.getMonth()) +
        1 +
        "月" +
        PrefixInteger(returnTime.getDate(), 2) +
        "日 " +
        PrefixInteger(returnTime.getHours(), 2) +
        ":" +
        PrefixInteger(returnTime.getMinutes(), 2) +
        ":" +
        PrefixInteger(returnTime.getSeconds(), 2)
    );
}

function getFullTimeEN(time) {
    var returnTime = new Date(time);
    return (
        parseInt(returnTime.getFullYear()) +
        "-" +
        (parseInt(returnTime.getMonth()) + 1) +
        "-" +
        PrefixInteger(returnTime.getDate(), 2) +
        " " +
        PrefixInteger(returnTime.getHours(), 2) +
        ":" +
        PrefixInteger(returnTime.getMinutes(), 2) +
        ":" +
        PrefixInteger(returnTime.getSeconds(), 2)
    );
}
function getFullTimeF(time) {
    var returnTime = new Date(time);
    return (
        parseInt(returnTime.getFullYear()) +
        "年" +
        (parseInt(returnTime.getMonth()) + 1) +
        "月" +
        PrefixInteger(returnTime.getDate(), 2) +
        "日 " +
        PrefixInteger(returnTime.getHours(), 2) +
        ":" +
        PrefixInteger(returnTime.getMinutes(), 2) +
        ":" +
        PrefixInteger(returnTime.getSeconds(), 2)
    );
}
function getFullTimeH(time) {
    var returnTime = new Date(time);
    return (
        PrefixInteger(returnTime.getHours(), 2) +
        ":" +
        PrefixInteger(returnTime.getMinutes(), 2) +
        ":" +
        PrefixInteger(returnTime.getSeconds(), 2)
    );
}

function PrefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}

function getFullYearSec(time) {
    var returnTime = new Date(time);
    return (
        returnTime.getFullYear() +
        "年" +
        (parseInt(returnTime.getMonth()) + 1) +
        "月" +
        PrefixInteger(returnTime.getDate(), 2) +
        "日 "
    );
}

function getFullYearThr(time) {
    var returnTime = new Date(time);
    return (
        returnTime.getFullYear() +
        "年" +
        (parseInt(returnTime.getMonth()) + 1) +
        "月" +
        PrefixInteger(returnTime.getDate(), 2) +
        "日 " +
        PrefixInteger(returnTime.getHours()) +
        "时"
    );
}
//数组去重
var arrRemoveRepeat=function(arr){
    var res=[];
    var json={};
    var length=arr.length;
    for(var i=0;i<length;i++){
        if(!json[arr[i]]){
            res.push(arr[i]);
            json[arr[i]] = 1;
        }
    }
    return res;
};

//轮播引入
jQuery.fn.carousel = function(arr,color){
    var that=$(this);
    var cur = 0;  //当前显示的图片的序号
    var next = 1; //下次即将要显示的图片的序号
    var interval=3000;//轮播时间
    var li='',b='';
    that.html('<ul class="carousel"></ul>' +
        '<div class="carousel_pager_box"><div class="carousel_pager"></div></div>' +
        '<div class="carousel_button hide"><a class="prev"><</a><a class="next">></a></div>').addClass('carouselBox');
    $.each(arr,function(index,val){
        li+='<li><img src="http://res.zudahao.com/'+val+'"></li>';
        b+='<b></b>'
    });
    $('#carousel .carousel').html(li);
    $('#carousel .carousel li:first-child').addClass('curr');
    $('#carousel .carousel_pager').html(b);
    $('#carousel .carousel_pager b:first-child').addClass('curr');
    if(color) $('.banner').css('background',color[0]);
    if($('#carousel .carousel_pager').find('b').length == 1){
        $('#carousel .carousel_pager').find('b').remove();
        $('#carousel .carousel_button').remove();
    }
    var $imgList = that.find('li'); //所有的img组成的类数组对象
    var $liList = that.find('b'); //所有的li组成的类数组对象
    //为每个li添加事件监听，单击后直接显示指定的图片
    $(this).on('click','b',function(){
        //cur 0    next 1       点击4后
        //cur 0    next 4
        var i = $liList.index(this);//点击的li在所有li中的序号
        next = i;
        lunHuan();
    });
    //开启一个定时器，每隔interval时长启动一次轮换
    if(color){
        var timer=setInterval(function(){
            lunHuan();
        }, interval);
    }
    $(this).on('mouseenter',function () {
        $(this).find('.carousel_button').removeClass('hide');
        if(color) {
            clearInterval(timer);
            timer=null;
        }
    }).on('mouseleave',function () {
        $(this).find('.carousel_button').addClass('hide')
        if(color) {
            timer=setInterval(function(){
                lunHuan();
            }, interval);
        }
    });
    $(this).on('click','.prev',function(){
        var i=that.find('li.curr').index();
        next=i-1;
        if(next<0) next=$imgList.length-1;
        lunHuan();
    });
    $(this).on('click','.next',function(){
        var i=that.find('li.curr').index();
        next=i+1;
        if(next>$imgList.length-1) next=0;
        lunHuan();
    });
    function lunHuan(){
        //让第next个li圆饼添加.active，其兄弟删除.active
        $liList.eq(next).addClass('curr').siblings('.curr').removeClass('curr');
        $imgList.eq(cur).removeClass('curr');
        $imgList.eq(next).addClass('curr');
        //修改cur和next变量的值,第cur张移走后next张移入
        cur = next;  //<=0     <=1
        next++;
        if(color) $('.banner').css('background-color',color[cur]);
        if(next>=$imgList.length){
            next = 0;
        }
    }
};