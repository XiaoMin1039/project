var count_page;
$(function () {
    $('header').load('header.html',function () {
        //头部信息
        $.ajax({
            url: spliceUrl('agents/detail/info/num/get'),
            dataType: 'JSON',
            type: 'POST',
            xhrFields: {withCredentials: true}
        }).done(function (json) {
            //将模板数据填充到页面上
            json.window = window;
            var html = template('getHeader', json);
            $('header').html(html);
        }).fail(function (err) {
            console.log(err);
            if(err.status == 0){
                // window.location.href = "login.html";
            }
        });

    });
    $('footer').load('footer.html');
    $('.wrap>.nav').load('menu.html',function () {
        //跳转页面后菜单栏的样式变化
        if(sessionStorage['index']){
            $('.nav-main>li').eq(sessionStorage['index']).addClass('active');
        }
    });
    //menu移入移出
    menuChange();
    //tab切换-所有状态
    tabChange();

    //点击header店铺名
    $(document).on('click','header li:last-child',function () {
        $(this).addClass('user-info-wrap');
    });
    $(document).on('mouseleave', 'header li:last-child', function () {
        $(this).removeClass('user-info-wrap');
    });


    //键码获取esc 弹窗打开的状态，点击esc，关闭弹窗
    $(document).keydown(function (event) {
        if(event.keyCode == 27){
            var popShow=[],popZIndex=[];
            $.each($('.pop-bg'),function (index, val) {
                if(!$(val).hasClass('hide')){
                    popShow.push(val);
                    popZIndex.push(parseInt($(val).css('z-index')));
                }
            });
            var maxZIndex=Math.max.apply( Math,popZIndex)
            $.each(popShow,function (index,val) {
                if(parseInt($(val).css('z-index')) == maxZIndex){
                    $(val).addClass('hide');
                }
            })
        }
    });
    //如果是单框搜索，点击回车后可直接搜索
    $('#searchword').focus(function () {
        $(document).keydown(function (event) {
            if(event.keyCode == 13){
                $('#search').trigger('click');
            }
        });

    });
});
//获取url中携带的参数信息
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]);
    return null;
}
//时间插件
function timeFrame() {
    //日期范围
    laydate.render({
        elem: '#timeFrameBefore'
        , min: -15
        , max: 0
        , format: 'yyyy-MM-dd HH:mm:ss'
        , theme: '#1E9FFF'
        , range: '至'
        ,type: 'datetime'
    });

    laydate.render({
        elem: '#timeFrameAfter'
        , min: 0
        , max: '2099-12-31 23:59:59'
        , format: 'yyyy-MM-dd HH:mm:ss'
        , theme: '#1E9FFF'
        , range: '至'
        ,type: 'datetime'
        ,done:function () {
            if($("#timeFrameAfterTip").length === 1){
                $('#timeFrameAfterTip').removeClass('img-mistake').removeClass('img-notice').addClass('img-bingo');
                $("#timeFrameAfterTip")[0].testTip.setVerification({errType:[1],isShow:0,notAutoHide:1})
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
        ,done:function () {
            if($("#timeFrameSelectTip").length === 1){
                $('#timeFrameSelectTip').removeClass('img-mistake').removeClass('img-notice').addClass('img-bingo');
                $("#timeFrameSelectTip")[0].testTip.setVerification({errType:[1],isShow:0,notAutoHide:1})
            }
        }
    });
}

//判断是否存在
function isExist(variable) {
    if (typeof variable === 'string' && variable !== '') {
        return true;
    }
    return !(isNaN(variable) || typeof variable === 'undefined' || variable === null || variable === '');
}
//menu切换
function menuChange() {
    $(document).on('mouseover', '.nav-main>li:not(:first-child)', function () {
        $('.nav-main-item').css('display', 'none');
        $('.nav-main-item-bg').css('display', 'block');
        $(this).find('.nav-main-item').css('display', 'block')
    });
    $(document).on('mouseout', '.nav-main>li:not(:first-child)', function () {
        $('.nav-main-item-bg,.nav-main-item').css('display', 'none');
    });
    $(document).on('mouseover', '.nav-main>li:first-child', function () {
        $(this).find('a').css('color','#525252');
    });
    $(document).on('mouseout', '.nav-main>li:first-child', function () {
        $(this).find('a').css('color','#c8cbd1');
    });
}
//tab切换-所有状态
function tabChange() {
    // var w = $('.main>.status>ul>li.active').width() + 40;
    // var l = 0;
    // $('.main .status>ul>li').each(function (index) {
    //     if ($('.main .status>ul>li.active').index() > index) {
    //         l += $(this).width() + 40;
    //     }
    // });


    // $('.main .line').css({'width': w, 'left': l});
    //所有状态 tab
    $(document).on('click', '.main>.status>ul>li', function () {
        $('.main .status>ul>li').removeClass('active');
        $(this).addClass('active');
    });

    // $(document).on('mouseenter', '.main>.status>ul>li', function () {
    //     var w = $(this).width() + 40;
    //     var l = 0;
    //     var _this = $(this);
    //     $('.main .status>ul>li').each(function (index) {
    //         if (_this.index() > index) {
    //             l += $(this).width() + 40;
    //         }
    //     });
    //     $('.main .line').css({'width': w, 'left': l})
    // });
    //
    // $(document).on('mouseout', '.main>.status>ul>li', function () {
    //     var w = $('.main .status>ul>li.active').width() + 40;
    //     var l = 0;
    //     $('.main .status>ul>li').each(function (index) {
    //         if ($('.main .status>ul>li.active').index() > index) {
    //             l += $(this).width() + 40;
    //         }
    //     });
    //     $('.main .line').css({'width': w, 'left': l})
    // });
}
//点击弹窗中的“取消”按钮
$(document).on('click', '.cancel', function () {
    $('.pop-bg').addClass('hide');
});

//如果pop-bg下的，点击取消或者发布都会自动隐藏框
// $(document).on('click', '.pop-bg .button-group #cancel', function () {
//     $('.pop-bg').addClass('hide');
// });

/*拼装url——接口*/
function spliceUrl(urlLast) {
    //http://192.168.31.39
    //www.zudahao.com
    var url = 'http://www.zudahao.com/api/';
    return url + urlLast
}
/*确认是否在data中添加属性*/
function confirmAddProto(protoValue, data, protoName) {
    if (isExist(protoValue)) {
        data[protoName] = protoValue;
    }
}
/*判断是否将变量的值转换*/
function isChangeVariable(variable, change) {
    if (isExist(change) && change != 0) {
        return change
    } else return variable
}
// 将第二个对象的属性都赋值给第一个对象
function addRelativeFirst(data1,data2){
    $.each(data2,function (index, val) {
        data1[index]=val;
    })
}
//几分钟前或几小时前或几天前或者几个月前
function getDateDiff(dateTimeStamp){
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if(diffValue < 0){return;}
    var monthC =diffValue/month;
    var weekC =diffValue/(7*day);
    var dayC =diffValue/day;
    var hourC =diffValue/hour;
    var minC =diffValue/minute;
    if(monthC>=1){
        result="" + parseInt(monthC) + "月前";
    }
    else if(weekC>=1){
        result="" + parseInt(weekC) + "周前";
    }
    else if(dayC>=1){
        result=""+ parseInt(dayC) +"天前";
    }
    else if(hourC>=1){
        result=""+ parseInt(hourC) +"小时前";
    }
    else if(minC>=1){
        result=""+ parseInt(minC) +"分钟前";
    }else
        result="刚刚";
    return result;
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

/*时间戳*/
function getFullTimeF(time) {
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
function PrefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}
/**
 * 请求页面上的表格数据（非弹窗里的）
 * @param url 接口名
 * @param data 参数
 * @param func 其他操作方法
 */
function getTableData(url, data, func) {
    //加上此处判断，则没有分页的单条数据也可以模板生成
    if (count_page) {
        confirmAddProto(count_page, data, 'count_page');
    }
    $.ajax({
        url: spliceUrl(url),
        dataType: 'JSON',
        type: 'POST',
        data: data,
        xhrFields: {withCredentials: true},
        beforeSend: function () {
            //去掉页面上所有的undefined
            $('.undefined').remove();
            //隐藏页面上表格tbody内容
            $('#tbody').hide();
            //隐藏掉页面上的分页
            $('.main>.pop-pages').hide();
            //如果是第一次加载，就用小马
            //如果不是第一次加载，就用转转的效果
            // if ($('#tbody').height() == 0) {
                $('.table-wrap').getLoading();
            // } else {
            //     $('.table-wrap').getLoadingTable();
            // }

        }
    }).done(function (json) {
        $('.loading').remove();
        // 如果请求到数据
        if (json.content == 1) {
            count_page = isChangeVariable(count_page, json.countPage) || 0;//总页数
            //分页插入
            $('.main>.pop-pages').html('');
            if (count_page >= 2) {//如果分页大于2，插入数据显示分页框
                $('.main>.pop-pages').pagination({
                    pageCount: count_page,
                    jump: true,
                    coping: true,
                    current: data.page,
                    prevContent: '上一页',
                    nextContent: '下一页',
                    callback: function (api) {
                        data.page = api.getCurrent();
                        getTableData(url, data)
                    }
                });
                $('.main>.pop-pages').show();
            }
            //将模板数据填充到页面上
            json.window = window;
            var html = template('tbodyTemplate', json);
            $('#tbody').html(html);
            //显示tbody和分页
            $('#tbody').show();
        } else {//没有成功请求到数据
            $('.main').getUndefined({text: json.data || '哎呦喂，出错了'});
        }
        //其他的操作
        if (func) {
            func(json);
        }
    }).fail(function () {
        //去掉加载效果，显示服务器出错的手机图片
        $('.loading').remove();
        $('.main').getUndefined('服务器出错');
        //其他的操作
        if (func) {
            func()
        }
    });
}


/*获取图片验证码*/
function getImg() {
    $("#code_img").attr('src', '');
    var src = spliceUrl('valid/image/' + new Date().getTime());
    $("#code_img").attr('src', src);
}
/**
 * 往输入域中插入字符串(光标所在位置)
 * @param $t document.getElementById('fieldId')
 * @param myValue 要插入的值
 */
function addSplitToField($t, myValue) {
    if (document.selection) {
        $t.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
        $t.focus();
    } else if ($t.selectionStart || $t.selectionStart == '0') {
        var startPos = $t.selectionStart;
        var endPos = $t.selectionEnd;
        var scrollTop = $t.scrollTop;
        $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
        this.focus();
        $t.selectionStart = startPos + myValue.length;
        $t.selectionEnd = startPos + myValue.length;
        $t.scrollTop = scrollTop;
    } else {
        $t.value += myValue;
        $t.focus();
    }
}
/*将形如"2016-12-12"的字符串转换成标准格式unix时间戳*/
function changeTimeToUnix(timeStr) {
    var date = new Date(Date.parse(timeStr.replace(/-/g, "/")));
    return date.getTime();
}
/*过滤字符串首尾的特殊字符*/
function filtrate(val, isNeedInLast) {
    var reg = new RegExp(/[`~!@#\$%\^\&\*\(\)_\+\-< >\?:"\{\},\.\[\]\\\/;']/im);
    var chineseReg = new RegExp(/[\uff1b\uff0c\u3002\uff1f\u2018\u2019\uff1a\u3010\u3011\u3001]/);
    var flag = 0;
    for (; flag < val.length; flag++) {
        if (!reg.test(val[flag]) && !chineseReg.test(val[flag])) {
            val = val.substring(flag, val.length);
            break;
        }
    }
    if (isNeedInLast) {
        flag = val.length - 1;
        for (; flag > -1; flag--) {
            if (!reg.test(val[flag]) && !chineseReg.test(val[flag])) {
                val = val.substring(0, flag + 1);
                break;
            }
        }
    }
    return val;
}
/*表单的请求*/
function formGetData(id, limit, data, url, func) {
    $parent = $(id).parents('.form');
    $parent.find('input').blur();
    $parent.find('textarea').blur();
    if ($parent.find('[data-id="tipPop"].img-bingo').length === limit) {
        var $this = $(id);
        getFormData(url, data, $this, func);
    }
}
/*请求提示报错*/
function showErrorTip(n, id) {
    $(id)[0].errType[n] = 0;
    $(id).removeClass('img-bingo').addClass('img-mistake');
    $(id)[0].testTip.setVerification({errType: $(id)[0].errType, isShow: 1})
}
/**
 * 显示输入框限制字数
 * @param obj 输入框对象
 * @param maxlength 字符长度
 */
function setShowLength(obj, maxlength) {
    //一个汉字算两个字符
    function getByteLen(val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            var a = val.charAt(i);
            if (a.match(/[^\x00-\xff]/ig) != null) {
                len += 2;
            }
            else {
                len += 1;
            }
        }
        return len;
    }

    var rem = maxlength - getByteLen(obj.val());
    if (rem < 0) {
        rem = 0;
    }
    obj.next()
        .html("还能输入<i class='font-nums'>" + rem + "</i>个字符")
        .slideDown();
}
/*输入的金额正则处理*/
function moneyRegularTest(id) {
    id.keyup(function () {
        var reg = $(this).val().match(/\d+\.?\d{0,2}/);
        var txt = '';
        if (reg != null) {
            txt = reg[0];
        }
        $(this).val(txt);
    }).change(function () {
        $(this).keypress();
        var v = $(this).val();
        if (/\.$/.test(v)) {
            $(this).val(v.substr(0, v.length - 1));
        }
    });
}
/*输入的值进行1+1处理*/
function intRegularTest(id) {
    id.keyup(function () {
        var reg = $(this).val().match(/\d+\+?\d{0,}/);
        var txt = '';
        if (reg != null) {
            txt = reg[0];
        }
        $(this).val(txt);
    }).change(function () {
        $(this).keypress();
        var v = $(this).val();
        if (/\+$/.test(v)) {
            $(this).val(v.substr(0, v.length - 1));
        }
    });
}
/**
 * 获取手机验证码
 * @param _this 对象
 * @param url 接口名
 * @param data 参数
 * @param func 其他操作
 */
function getPicCode(_this, url, data, func) {
    var options = {
        confirm: function (val) {
            data.valid_code = val;
            if (val != '') getFormData(url, data, _this, function (json) {
                if (json.content === 1) {
                    getCountdown();
                    messageTip({state: 1, message: '发送验证码成功'})
                } else if (json.content === 6) {
                    var options1 = {
                        message: '图片验证码错误！',
                        state: 3,//1、cssDemo、3三种状态:1成功,2失败,3警告
                        callback: function () {
                            _this.getPicCodePop(options)
                        }
                    };
                    messageTip(options1);
                } else {
                    func(json)
                }
            })
        }
    };
    _this.getPicCodePop(options)
}
/*60秒倒计时*/
function getCountdown() {
    $("#fetchPhoneCode").addClass('hide');
    $('#getPhoneCode').removeClass('hide');
    var _time = 60;
    var timer = setInterval(function () {
        _time--;
        $('#getPhoneCode').html(_time + '秒');
        if (_time === 0) {
            clearInterval(timer);
            $("#fetchPhoneCode").removeClass('hide');
            $('#getPhoneCode').addClass('hide');
            $('#getPhoneCode').html('60秒');
        }
    }, 1000)
}

/*加载数据错误或没有数据——手机*/
$.fn.getUndefined = function (option) {
    if(this.find('.undefined').length === 0){
        var html = `
            <div class="undefined">
                <div class="serviceErr">
                    <div class="service"></div>
                    ${option.text}
                </div>
            </div>
        `;
        this.show();
        this.append(html);
    }
};
/*加载中动画——小牛*/
$.fn.getLoading = function () {
    if(this.find('.loading').length === 0){
        var html = `
            <div class="loading">
                <img src="http://zudahao.zudahao.com/agents2/images/loadding.gif" alt="加载动画">
            </div>
        `;
        this.show();
        this.append(html);
    }

};
/*加载中的动画——转转*/
$.fn.getLoadingTable = function () {
    if(this.find('.loading-start').length === 0){
        var html = `
            <div class="loading loading-start">
                <div class="spinner">
                    <div class="spinner-container container1">
                        <div class="circle1"></div>
                        <div class="circle2"></div>
                        <div class="circle3"></div>
                        <div class="circle4"></div>
                    </div>
                    <div class="spinner-container container2">
                        <div class="circle1"></div>
                        <div class="circle2"></div>
                        <div class="circle3"></div>
                        <div class="circle4"></div>
                    </div>
                    <div class="spinner-container container3">
                        <div class="circle1"></div>
                        <div class="circle2"></div>
                        <div class="circle3"></div>
                        <div class="circle4"></div>
                    </div>
                </div>
            </div>
        `;
        this.show();
        this.append(html);
    }

};
/**
 * 弹窗表格——目前只有 订单管理页面 需要这个方法
 * @param url 接口地址
 * @temp 模板地址id
 * @param data 数据
 * @param obj 弹出框对象，例如： $('#id')
 * @param func 其他操作
 */
function getTablePopData(url, temp, data, obj, func) {
    if (obj.count_page) {
        confirmAddProto(obj.count_page, data, 'count_page');
    }
    $.ajax({
        url: spliceUrl(url),
        dataType: 'JSON',
        type: 'POST',
        data: data,
        xhrFields: {withCredentials: true},
        beforeSend: function () {
            //动画
            $('.loading').remove();
            $('.undefined').remove();
            //动画
            obj.find('.template').hide();
            obj.find('.pop-pages').hide();
            $('.pop').getLoading();
        }
    }).done(function (json) {
        $('.loading').remove();
        if (json.content == 1) {
            obj.count_page = isChangeVariable(obj.count_page, json.countPage) || 0;//总页数
            obj.find('.pop-pages').html('');
            //分页插入
            if (obj.count_page >= 2) {
                obj.find('.pop-pages').pagination({
                    pageCount: obj.count_page,
                    jump: true,
                    coping: true,
                    current: data.page,
                    prevContent: '上一页',
                    nextContent: '下一页',
                    callback: function (api) {
                        data.page = api.getCurrent();
                        getTablePopData(url, temp, data, obj, func)
                    }
                });
                obj.find('.pop-pages').show();
            }
            json.window = window;
            var html = template(temp, json);
            //给弹窗显示数据
            obj.find('.template').html(html);
            obj.find('.template').show();
        } else {
            //获取不到数据
            obj.find('.pop').getUndefined({text: json.data || '哎呦喂，出错了'});
        }
        if (func) {
            func(json);
        }
    }).fail(function (err) {
        //去掉加载，显示服务器出错的手机图片
        $('.loading').remove();
        obj.find('.pop').getUndefined('服务器出错');
        if (func) {
            func(json);
        }
    });
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
        if(ele) ele.deleteButtonLoading();
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
        if(ele) ele.deleteButtonLoading();
        var options = {
            message: '数据错误，请重试。',
            state: 3//1、cssDemo、3三种状态:1成功,2失败,3警告
        };
        //显示页面上方小提示
        messageTip(options);
    })
}
/**
 * 表单提交
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

//重置所有搜索条件事件
$(document).on('click','[data-id="clearSearch"]',function () {
    window.location=window.location.pathname;
});

//点击菜单之后跳转 且 存session
$(document).on('click','.nav-main a',function(e){
    e.preventDefault();
    sessionStorage['index']=$(this).parents('.nav-main>li').index();
    location.href=$(this).attr('href');
});

$(function () {
    //点击 × 关闭弹窗
    $(document).on('click','.pop-title>.icon-close',function () {
        $(this).parents('.pop-bg').addClass('hide');
    });
    //点击阴影部分关闭弹框
    $(document).on('click','.pop-bg',function () {
        $(this).addClass('hide');
    });
    $(document).on('click','.pop-bg .pop',function (e) {
        e.stopPropagation();
    });
    // $(document).on('mouseenter','.icon-close',function () {
    //     $(this).toolTip({content:'点击弹出层灰色部分或者键盘的ESC可快速关闭'})
    // });
    $('.icon-close').attr('title','点击弹出层灰色部分或者键盘的ESC可快速关闭')
});