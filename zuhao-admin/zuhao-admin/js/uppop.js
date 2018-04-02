/**
 * Created by jiyue004 on 2017/10/24.
 */
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