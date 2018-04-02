$(function(){
    // 搜索栏切换
    $('.search-tab-title li').on('click',function(){ //给a标签添加事件
        $('.search-tab-title li').removeClass('active');
        $(this).addClass('active');
        $('.search-tab-box>div').removeClass('active');
        $('.search-tab-box>div').eq($(this).index()).addClass('active');
    });

    // 公告栏切换
    $('.banner-info-news-title li').on('click',function(){ //给a标签添加事件
        $('.banner-info-news-title li').removeClass('active');
        $(this).addClass('active');
        $('.banner-info-news-box>ul').removeClass('active');
        $('.banner-info-news-box>ul').eq($(this).index()).addClass('active');
    });


    //游戏菜单
    $(document).on('mouseenter','.game-lists>li',function () {
        $('.game-zizone').eq($(this).index()).show();
    });
    $(document).on('mouseleave','.game-lists>li',function () {
        $('.game-zizone').eq($(this).index()).hide();
    });
    $(document).on('mouseenter','.game-zizone',function () {
        $(this).show();
        $('.game-lists>li').eq($(this).index()-2).addClass('game-lists-active');
    });
    $(document).on('mouseleave','.game-zizone',function () {
        $(this).hide();
        $('.game-lists>li').removeClass('game-lists-active');
    });
    $.getJSON("http://res.zudahao.com/file/gameZone.json", function(res) {
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
        $.each(sorted, function(index, item) {
            ulHtml += ("<li><span data-code=\"" + item + "\"><i class=\"iconfont icon-" + icon[item] + "\"></i>" + res[-1][item] + "</span></li>");
            var str = "<ul class=\"game-zizone\">";
            $.each(Object.keys(res[item]), function(index1, item1) {
                var str2 = ("<li><span data-code=\"" + item1 + "\">" + res[-1][item1] + "</span><ul>");
                $.each(Object.keys(res[item][item1]), function(index2, item2) {
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


    var imageArr=['image/banner/baner5.jpg_39','image/banner/baner0.jpg_29','image/banner/baner5.jpg_39','image/banner/baner0.jpg_29'];
    var colorArr=['#ff5004','pink','#ff5004','pink'];
    $('#carousel').carousel(imageArr,colorArr);
    // //搜索游戏列表
    // $.getJSON('http://datazudahao.oss-cn-shenzhen.aliyuncs.com/file/ziZone.json').then(function(data){
    //     $gameSelect=$('#game-select').getGameSelect(data);
    // });


});



//这是一个例子
// function aa() {
//     return new Promise(resolve => {
//         setTimeout(function() {
//             resolve("want-value");
//         }, 1000);
//     });
// }
//
// aa().then(v => console.log(v));
