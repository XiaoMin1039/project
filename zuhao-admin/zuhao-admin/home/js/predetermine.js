(function($) {
  $.fn.Predetermine = function(obj) {
    var _this = $(this),
      timeLength = 0,
      theDay,
      theMonth,
      win = $(window),
      doc = $('html body'),
      marginLeft = 0,
      blockWidth, //每个小时正方形方格宽高
      _currentTime;

    var options = $.extend(
      {
        currentTime: '2017-16-18 14:41:47', //当前时间
        dataArray: [],
        perWidth: 2, //1px对应几分钟
        oneBlockLength: 30, //一小时分为几格
        oneLineShow: 20, //一行显示几个1小时
        titleWidth: 80,
        timePanelBlockNum: 24,
        blockBgColor: '#2fa0de', //可预定区块背景色
        blockColor: '#fff', //文字颜色
        perBgColor: '#ec797d', //已预定区块背景色
        titleColor: '#aaa', //标题标识文字颜色
        pannelColor: '#f1f1f1', //标题标识区块背景颜色
        borderColor: 'rgb(238, 238, 238)', //时间区块描边颜色
        noticePanelColor: '#009688' //tips弹出层背景色
      },
      obj
    );

    _currentTime = options.currentTime;
    _currentHour = getHour(options.currentTime);
    theMonth = getMonth(options.currentTime);
    theDay = getDay(options.currentTime);
    blockWidth = 1 / options.perWidth * 60;
    //获取月份
    function getMonth(data) {
      return new Date(data).getMonth() + 1;
    }
    //获取日期
    function getDay(data) {
      return new Date(data).getDate();
    }
    //获取小时数
    function getHour(data) {
      return new Date(data).getHours();
    }
    //获取分钟数
    function getMinute(data) {
      return new Date(data).getMinutes();
    }
    //获取下一天的时间
    function getNextDay(currentTime, _currentTime) {
      var day = (_currentTime - currentTime) / 1000 / 60 / 60 / 24;
      if (day == 0) {
        return '今日';
      } else if (day == 1) {
        return '明日';
      } else if (day == 2) {
        return '后天';
      } else {
        return '3天及以后';
      }
    }
    //返回时间区间的分钟数
    function getTimeAria(start, end) {
      var aria = end - start;
      return Math.floor(aria / 1000 / 60);
    }

    function getXDistance(elem, mouseX) {
      return Math.floor(mouseX - elem.offset().left);
    }
    //创建今日日期panel
    _this.append(
      '<div class="top-time-panel"><span class="predetermine-panel-title">日期</span><span class="time-title">' +
        getMonth(options.currentTime) +
        '月' +
        getDay(options.currentTime) +
        '日(今日)' +
        '</span>'
    );
    //创建今日时间段panel
    _this.append(
      '<div class="time-block-panel"><span class="predetermine-panel-title">时间</span><div class="block-panel"><span class="br-panel">' +
        '<span class="data-tag">' +
        theMonth +
        '月' +
        theDay +
        '日</span></span></div></div>'
    );

    //预定窗口样式
    _this.css({
      width: blockWidth * options.oneLineShow + options.titleWidth + 1,
      border: '1px solid ',
      'border-color': 'rgb(238, 238, 238)'
    });
    //预定窗口左侧标题样式
    _this.find('.predetermine-panel-title').css({
      position: 'relative',
      display: 'inline-block',
      position: 'relative',
      'line-height': blockWidth + 'px',
      width: options.titleWidth,
      height: blockWidth,
      color: options.titleColor,
      'text-align': 'center',
      'background-color': '#fff'
    });
    //预定窗口日期panel样式
    _this.find('.top-time-panel').css({
      position: 'relative',
      display: 'inline-block',
      width: blockWidth * options.oneLineShow + options.titleWidth + 1,
      height: 38,
      'line-height': '38px',
      'background-color': options.pannelColor,
      'border-bottom': '1px solid rgb(238, 238, 238)',
      color: options.titleColor
    });
    _this.find('.time-title').css({
      height: 38,
      'line-height': '38px',
      property2: 'value2'
    });
    _this.find('.top-time-panel .predetermine-panel-title').css({
      'background-color': options.pannelColor,
      color: options.titleColor,
      height: 38,
      'line-height': '38px'
    });
    //预定窗口时间panel样式
    _this.find('.time-block-panel').css({
      width: blockWidth * options.oneLineShow + options.titleWidth + 1
    });
    _this.find('.block-panel').css({
      'border-left': '1px solid rgb(238, 238, 238)',
      width: blockWidth * options.oneLineShow
    });
    _this.find('.br-panel').css({
      width: blockWidth * options.oneLineShow
    });
    _this.find('.time-title').css({
      position: 'relative',
      width: blockWidth * options.oneLineShow,
      height: 38
    });
    var oneBlock = '';
    for (var n = 0; n < options.oneBlockLength; n++) {
      oneBlock +=
        '<i class="per" data-left="' + n * (1 / options.perWidth) * (60 / options.oneBlockLength) + '" title=""></i>';
    }

    //添加今日时间段区块
    var nowTime = new Date(_currentTime);
    var timestamp = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate()).getTime();
    timestamp += _currentHour * 60 * 60 * 1000;
    for (var i = 0; i < options.timePanelBlockNum; i++) {
      var titleHeight = _this.find('.br-panel').height();

      if (_currentHour == 24) {
        _currentTime = _currentTime + 1000 * 60 * 60 * 24;
        _this
          .find('.br-panel')
          .append('<span class="data-tag">' + getMonth(_currentTime) + '月' + getDay(_currentTime) + '日' + '</span>');
        _this
          .find('.time-title')
          .append(
            ' - ' +
              getMonth(_currentTime) +
              '月' +
              getDay(_currentTime) +
              '日(' +
              getNextDay(options.currentTime, _currentTime) +
              ')'
          );
        _currentHour = 0;
        if (_this.find('.time-title').text().length > 36) {
          _this
            .find('.time-title')
            .text(getMonth(options.currentTime) + '月' + getDay(options.currentTime) + '日(今日)——(三天以后)');
        }
      }
      _this
        .find('.br-panel')
        .append(
          '<i class="one-hour" data-time="' +
            (i != 0 ? timestamp : _currentTime) +
            '">' +
            _currentHour +
            '<i class="one-hour-num">' +
            _currentHour +
            '</i>' +
            oneBlock +
            '</i>'
        );
      _this.find('.time-block-panel .predetermine-panel-title').css({
        height: titleHeight + 'px',
        'line-height': titleHeight + 'px'
      });
      timestamp += 60 * 60 * 1000;
      _currentHour++;
    }

    _this.find('.data-tag').css({
      position: 'relative',
      display: 'inline-block',
      top: 0,
      color: options.titleColor,
      'background-color': options.pannelColor,
      width: blockWidth * 2,
      height: blockWidth
    });
    _this.find('.one-hour').css({
      position: 'relative',
      display: 'inline-block',
      width: blockWidth,
      height: blockWidth,
      'border-color': options.borderColor,
      color: 'transparent',
      'background-color': options.blockBgColor,
      'z-index': 10
    });
    _this.find('.one-hour-num').css({
      position: 'absolute',
      cursor: 'pointer',
      display: 'inline-block',
      border: 'none',
      'font-weight': 'normal',
      left: 0,
      'box-sizing': 'border-box',
      'font-style': 'normal',
      width: blockWidth,
      height: blockWidth,
      color: options.blockColor,
      'background-color': 'transparent',
      'z-index': 10
    });
    _this.find('.one-hour-num.on').css({
      color: options.perColor
    });
    //时间区块划分的数量
    _this.find('.per').each(function(index, el) {
      $(this).css({
        display: 'inline-block',
        'text-align': 'left',
        position: 'absolute',
        width: blockWidth / options.oneBlockLength,
        height: blockWidth,
        left: $(this).attr('data-left') + 'px',
        'z-index': 5,
        'box-sizing': 'border-box',
        'border-bottom': '1px solid',
        'border-color': options.borderColor
      });
    });
    //创建今日预定信息
    if (JSON.stringify(options.dataArray) != '[]') {
      options.dataArray.forEach(function(val, index) {
        //iterate through array or object
        var sd, //预定开始时间与订单创立时间间距
          ed, //预定结束时间与订单创立时间间距
          a, //预定时间分钟数
          m, //订单创立时间整时后的分钟数
          startIndex, //预定开始时间下标
          endIndex; //预定结束时间下标

        m = getMinute(options.currentTime);
        a = getTimeAria(val.startTime, val.endTime);
        sd = getTimeAria(options.currentTime, val.startTime);
        startIndex = Math.round((sd + m) / (60 / options.oneBlockLength));
        ed = getTimeAria(options.currentTime, val.endTime);
        endIndex = Math.round((ed + m) / (60 / options.oneBlockLength));
        for (var i = startIndex; i < endIndex; i++) {
          _this.find('.per').eq(i).addClass('on');
          var dataTitle = _this.find('.per').eq(i).attr('title'),
            titleInfo = '起:' + getFullTimeCN(val.startTime) + '</br>止:' + getFullTimeCN(val.endTime) + '</br>';
          dataTitle += titleInfo;
          _this.find('.per').eq(i).attr('title', dataTitle);
        }
      });
    }

    //预定信息hover效果
    // _this.find('.one-hour-num').hover(
    //   function(event) {
    //     var content; //要hover的内容
    //     var mX = event.pageX,
    //       $elem = $(this).parent(),
    //       hoverIndex; //要hover对象的下标
    //     hoverIndex = Math.round(getXDistance($elem, mX) / (options.perWidth / (60 / options.oneBlockLength)));
    //     if (hoverIndex < 0) {
    //       hoverIndex = 0;
    //     }
    //     content = $elem.find('.per').eq(hoverIndex).attr('title');
    //     if (content != '' && content != undefined) {
    //       layer.tips('该预定订单起止时间：</br>' + content, $(this), {
    //         tips: [1, options.noticePanelColor],
    //         area: ['280px', 'auto'],
    //         time: 10000
    //       });
    //     }
    //   },
    //   function() {
    //     layer.closeAll('tips');
    //   }
    // );
  };
})(jQuery);
