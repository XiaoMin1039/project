$(function () {

    //点击选择 类型 游戏服务器 时间价格区间
    $(document).on('click', '.select li ul li', function () {
        $(this).parent().find('li').removeClass('active');
        $(this).addClass('active');
    });

    //点击 默认排序 时间 价格 销量 评价
    $(document).on('click', '.product-title li', function () {
        var _this = $(this);
        //给选中的加上红色背景
        $('.product-title li').removeClass('active');
        $(this).addClass('active');
        switch ($(this).index()) {
            case 1:
                changeUpDown(_this);
                //清除 价格 的现在高亮情况
                $(this).siblings('li').find('.img-up-red').removeClass('img-up-red');
                $(this).siblings('li').find('.img-down-red').removeClass('img-down-red');
                //5 从晚到早 向下的那个箭头高亮 ，6 从早到晚 向上的箭头高亮
                $(this).find('.img-down').hasClass('img-down-red') ? $(this).attr('data-id', '5') : $(this).attr('data-id', '6');
                break;
            case 2:
                changeUpDown(_this);
                //清除 时间 的选择高亮情况
                $(this).siblings('li').find('.img-up-red').removeClass('img-up-red');
                $(this).siblings('li').find('.img-down-red').removeClass('img-down-red');
                //3 从低到高 向下的那个箭头高亮 ，4 从高到低 向上的箭头高亮
                $(this).find('.img-down').hasClass('img-down-red') ? $(this).attr('data-id', '3') : $(this).attr('data-id', '4');
                break;
            case 0 :
            case 3:
            case 4:
                //清除 时间和价格 的选择高亮情况
                $(this).parents('.product-title').find('.img-up-red').removeClass('img-up-red');
                $(this).parents('.product-title').find('.img-down-red').removeClass('img-down-red');
                break;
        }

        //切换 上下箭头 的高亮情况 默认从 下箭头高亮 开始
        function changeUpDown(obj) {
            if (obj.find('.img-up').hasClass('img-up-red')) {
                obj.find('.img-up').toggleClass('img-up-red');
                obj.find('.img-down').toggleClass('img-down-red');
            } else {
                //如果没有选择向下：1.还没开始选 2.已经点击多次刚才是向下
                obj.find('.img-down').removeClass('img-down-red');
                obj.find('.img-up').addClass('img-up-red');
                console.log(2)
            }
        }
    });

    //点击 游戏名称 显示对应的 游戏服务器
    $(document).on('click','#gameBox i',function () {
        $('#gameBox i').removeClass('active');
        $(this).addClass('active');
    });

});