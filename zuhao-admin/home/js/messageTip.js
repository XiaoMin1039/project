
/**
 * Created by ching on 2017/10/20.
 */
(function($){
    function messageTipBox(ele,options){
        this.$ele=ele;
        this.options=options;
        this.init();
    }
    messageTipBox.prototype.init=function () {
        var _self=this;
        var html=$(`
                <div class="message fixed" id="messageTipBox" style="margin-top:-70px;top:10px;left:50%;">
                    <i class="iconfont"></i>
                    <span class="message-content"></span>
                </div>
            `);
        if($('body').find('#messageTipBox') != 0)$('body').find('#messageTipBox').remove();
        $('body').append(html);
        if(typeof (_self.options) == 'string'){
            $('body').find('#messageTipBox>.message-content').text(_self.options);
            $('body').find('#messageTipBox>.iconfont').addClass('icon-correct');
        }else if(typeof (_self.options) == 'object'){
            $('body').find('#messageTipBox>.message-content').text(_self.options.message);
            if(_self.options.state == 1) $('body').find('#messageTipBox>.iconfont').addClass('icon-correct');
            else if(_self.options.state == 2) $('body').find('#messageTipBox>.iconfont').addClass('icon-wrong');
            else if(_self.options.state == 3) $('body').find('#messageTipBox>.iconfont').addClass('icon-warning');
        }
        var _con=$('body').find('#messageTipBox');
        _con.css('margin-left',-_con[0].offsetWidth/2);
        _con[0].marginTop=-70;
        theSliding(_con[0],0);
        setTimeout(function(){
            theSliding(_con[0],-70,function () {
                _con.remove();
                if(_self.options.callback) _self.options.callback();
            });
        },_self.options.time || 3000)
    };

    messageTip=function(options){
        return new messageTipBox(this,options)
    }
})(jQuery)