/**
 * 对日期进行格式化，
 * @param date 要格式化的日期
 * @param format 进行格式化的模式字符串
 *     支持的模式字母有：
 *     y:年,
 *     M:年中的月份(1-12),
 *     d:月份中的天(1-31),
 *     h:小时(0-23),
 *     m:分(0-59),
 *     s:秒(0-59),
 *     S:毫秒(0-999),
 *     q:季度(1-4)
 * @return String
 */
template.defaults.imports.dateFormat = function (date, format) {

    date = new Date(date); //新建日期对象

    /*日期字典*/
    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };

    /*正则替换*/
    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
        var v = map[t];
        if(v !== undefined){
            if(all.length > 1){
                v = '0' + v;
                v = v.substr(v.length-2);
            }
            return v;
        }
        else if(t === 'y'){
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });

    /*返回自身*/
    return format;
};

/**
 * 对字符串的分割
 * @param str 要分割的字符串
 * @param symbol 分割符号
 * @returns {Array}
 */
template.defaults.imports.stringSplit = function (str , symbol) {
    var attr = [];
    attr = str.split(symbol);
    return attr;
};

/**
 * 计算剩余天数
 * @param data 结束时间
 * @returns {number|*}
 */
template.defaults.imports.residueTime = function (date) {
    var now = new Date();
    date -=now.getTime();
    date = Math.ceil(date/1000/60/60/24);
    return date;
};

/**
 * 总时长
 * @param endTime 结束的时间
 * @param startTime 开始的时间
 * @returns {number}
 */
template.defaults.imports.timeLength = function (endTime,startTime) {
    var timeLength = endTime-startTime;
    var time=parseFloat(timeLength) / 1000 / 60 ;
    if (timeLength < 60 * 1000 * 60 * 24) {
        if(parseInt((parseFloat(time/60)-parseInt(time/60))*60) == 0){
            return parseInt(time/60)+'小时';
        }else{
            return parseInt(time/60)+'小时'+parseInt((parseFloat(time/60)-parseInt(time/60))*60) + "分钟";
        }
    } else {
        if(parseInt((parseFloat(time/60/24)-parseInt(time/60/24))*24) == 0){
            return parseInt(time/60/24)+'天';
        }else{
            if(parseInt((parseFloat(time/60)-parseInt(time/60))*60) == 0){
                return parseInt(time/60/24)+'天'+parseInt((parseFloat(time/60/24)-parseInt(time/60/24))*24) + "小时";
            }else{
                return parseInt(time/60/24)+'天'+parseInt((parseFloat(time/60/24)-parseInt(time/60/24))*24) + "小时"+parseInt((parseFloat(time/60)-parseInt(time/60))*60) + "分钟";
            }
        }

    }
};

/**
 * 几分钟前或几小时前或几天前或者几个月前
 * @param time
 * @returns {string|string|*}
 */
template.defaults.imports.getDateDiff = function (time) {
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - time;
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
};


/**
 * 剩余的时间数（ 1天 1小时 45分钟） 离现在还有多少天
 * @param endTime 结束的时间
 * @returns {number}
 */
template.defaults.imports.timeResidue = function (endTime) {
    var currentTime = new Date().getTime();
    var time=parseFloat(endTime - currentTime) / 1000 / 60 ;
    if (endTime - currentTime < 60 * 1000 * 60) {
        if(parseInt(time) < 0){
            return '结束'
        }else if(parseInt(time) == 0){
            return '不足1分钟'
        }else{
            return parseInt(time) + "分钟";
        }
    } else if (endTime - currentTime < 60 * 1000 * 60 * 24) {
        if(parseInt((parseFloat(time/60)-parseInt(time/60))*60) == 0){
            return parseInt(time/60)+'小时';
        }else{
            return parseInt(time/60)+'小时'+parseInt((parseFloat(time/60)-parseInt(time/60))*60) + "分钟";
        }
    } else {
        if(parseInt((parseFloat(time/60/24)-parseInt(time/60/24))*24) == 0){
            return parseInt(time/60/24)+'天';
        }else{
            return parseInt(time/60/24)+'天'+parseInt((parseFloat(time/60/24)-parseInt(time/60/24))*24) + "小时";
        }
    }
};

/**
 * 返回 （今天 14:36:57） 格式的时间
 * @param data 传入的时间戳
 * @returns {number|*}
 */
template.defaults.imports.todayTime = function (date) {
    date = new Date(date);
    /*日期字典*/

    //如果是同一天 今天 14:36:57

    //如果不是同一天 2017-10-25 15.47.25

};

template.defaults.imports.lastString = function (str) {
    var lastIndex=str.lastIndexOf('\\');
    return str.slice(lastIndex+1);
};
