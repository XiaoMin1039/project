(function($){
    function dropDown(ele,options){
        this.$ele=ele;
        this.options=options;
        this.init()
    }
    dropDown.prototype.init=function(){
        var _self=this,_html=[];
        _html.push('<ul class="select_ul borderBottom">');
        $.each(_self.options.items,function(index,val){
            if(index == 0){
                _html.push(`<li data-value="${val.value}" class="cur">${val.label}</li>`);
                _self.$ele.find('div').text(val.label).attr('data-value',val.value);
            } else _html.push(`<li data-value="${val.value}">${val.label}</li>`)
        });
        _html.push('</ul>');
        _self.$ele.append(_html.join('')).addClass('select');
        var _con=_self.$ele;
        _self.$ele.click(function(){
            if(_con.hasClass('borderAll')) _con.removeClass('borderAll').addClass('borderTop');
            _self.$ele.find(".select_ul").slideToggle('fast',function(){
                if($(this).css('display') == 'none')  _con.removeClass('borderTop').addClass('borderAll');
            });
        });
        _self.bindClick();

        // 点击其他地方，窗口消失
        $(document).mouseup(function(e){
            if(!_self.$ele.is(e.target) && _self.$ele.has(e.target).length === 0){
                _self.$ele.find(".select_ul").slideUp('fast',function(){
                    _con.removeClass('borderTop').addClass('borderAll')
                });
            }
        });
    };
    dropDown.prototype.bindClick=function(event){
        this.$ele.on('click','li',function(){
            $(this).addClass('cur').siblings('li').removeClass('cur');
            $(this).parent().prev().text($(this).text()).attr('data-value',$(this).attr('data-value'));
            if(event) event();
        });
    };
    dropDown.prototype.selected=function(event){
        this.bindClick(event)
    };
    dropDown.prototype.getValue=function(){
        return this.$ele.find('div').attr('data-value');
    };
    dropDown.prototype.setLabel=function (val) {
        var _con=this.$ele.find('li').eq(val)
        _con.addClass('cur').siblings('li').removeClass('cur');
        _con.parent().prev().text(_con.text()).attr('data-value',_con.attr('data-value'))
    };
    $.fn.dropDown=function(options){
        return new dropDown(this,options)
    }
})(jQuery);
