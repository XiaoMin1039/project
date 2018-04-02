/**
 * Created by ching on 2017/10/20.
 */
(function($){
    function largeConfirm(ele,options) {
        this.$ele=ele;
        this.options=options;
        this.init();
    }
    largeConfirm.prototype.init=function () {
        var _self=this;
        var html=$(`
                    <div class="pop-bg opacity0" id="pop-delete">
                        <div class="delete-pop pop">
                            <div class="pop-title">
                                <i class="iconfont icon-close"></i>
                            </div>
                            <div class="pop-info">
                                <div class="pop-info-item">
                                    <i class="iconfont icon-alert"></i>
                                    <div class="alert-title">${_self.options.title||'确认是否删除？'}</div>
                                    <div class="alert-info">${_self.options.content||''}</div>
                                </div>
                            </div>
                            <div class="pop-button-group clearBoth">
                                <button class="button-event-middle-gray fl">取消</button><button class="button-event-middle-blue fr">确认</button>
                            </div>
                        </div>
                    </div>
            `);
        $('body').append(html);
        if(_self.options.width){
            $('body').find('#pop-delete').css({width:_self.options.width})
        }
        var _con=$('#pop-delete');
        _con.animate({opacity:1},'normal');
        // 点击其他地方，窗口消失
        $(document).mouseup(function(e){
            if(_con.is(e.target) && _con.has(e.target).length === 0){
                popHide()
            }
        });
        if(_self.options.btn) {
            _con.find('.button-event-middle-gray').text(_self.options.btn[1]);
            _con.find('.button-event-middle-blue').text(_self.options.btn[0]);
        }
        //确认回调
        _con.find('.button-event-middle-blue').on('click',function(){
            _self.options.yes();
            popHide()
        });
        //取消回调
        _con.find('.button-event-middle-gray').on('click',function(){
            _self.options.cancel();
            popHide()
        });
        //关闭
        _con.find('.icon-close').on('click',function(){
            popHide()
        });
        //无论确认还是取消、关闭的回调和弹框消失
        function popHide() {
            if(_self.options.end)_self.options.end();
            _con.fadeOut('normal',function () {
                _con.remove();
            })
        }
    };
    $.fn.largeConfirm=function(options){
        return new largeConfirm(this,options)
    }
})(jQuery)