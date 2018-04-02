
//重写的选择插件
(function ($) {
    function select(element, options, active) {
        active = active || '-1';
        this.$ele = element;
        this.options = options;
        this.activeName = active;
        this.activeValue = null;
        this.defaultActive = active;
        this.init();
        if (active !== '-1'){
            this.setActive(this.activeName);
        }
    }
    select.prototype.init = function () {
        var _self = this;
        $.each(_self.options, function (index, item) {
            _self.append(item);
        });
        _self.$ele.on('click','span', function (e) {
            e.stopPropagation();
            if ($(this).attr('data-type') === 'unit') {
                var _con=$(this).children('.event-input-sel');
                _con[0].alpha=_con.css('opacity')*100;
                $.each($('.event-input-sel'),function (index, val) {
                    theFading(val,0,function () {
                        $(val).addClass('hide')
                    });
                });
                _con.removeClass('hide');
                theFading(_con[0],100);

                // $(this).children('.event-input-sel').show();
                $(this).find('[data-id="confirm"]').on('click', function (e) {
                    e.stopPropagation();
                    var val = $(this).siblings('input').val();
                    var name = $(this).parents('span').attr('data-value');

                    theFading(_con[0],0,function () {
                        _con.addClass('hide')
                    });
                    if(_self.options[name].yes) {
                        _self.options[name].yes(val);
                    }
                    if (val && _self.options[name].type == 'unit') {
                        _self.setActive(name);
                        _self.activeValue = val;
                        var unit = _self.getUnit(name);
                        $(this).parent().siblings('p').text((unit.prefix || '') + val + unit.unit);
                    }
                });

                $(this).find('[data-id="clear"]').on('click', function (e) {
                    e.stopPropagation();
                    var val = $(this).siblings('input').val('');
                    var name = $(this).parents('span').attr('data-value');
                    // var name = $(this).parents('.select-label').attr('data-value');
                    if(_self.options[name].type == 'unit'){
                        _self.setActive(_self.defaultActive);
                    }
                    // $(this).parent().siblings('p').text(_self.getUnit(name).min + _self.getUnit(name).unit);
                    theFading(_con[0],0,function () {
                        _con.addClass('hide')
                    });
                });
                $(this).find('i:not(.icon-ellipsis)').on('click', function (e) {
                    e.stopPropagation();
                    var val = $(this).text();
                    $(this).siblings('input').val(val);
                });
                $(this).find('input').bind('input propertychange', function (e) {
                    e.stopPropagation();
                    var name = $(this).parents('span').attr('data-value');
                    var unit = _self.getUnit(name);
                    var val = $(this).val();
                    if (unit.decimal) {
                        if (val[val.length - 1] === '.' && val.indexOf('.') === val.length - 1) return;
                        if (isNaN(parseFloat(val))) $(this).val('');
                        else {
                            if (parseFloat(val) > unit.max) $(this).val(unit.max);
                            else if (parseFloat(val) < unit.min) $(this).val(unit.min);
                            else if (val.indexOf('.') !== -1) {
                                var t = parseFloat(val).toString();
                                if (val.split('.')[1].length > unit.digit) {
                                    $(this).val(val.slice(0, val.length - 1));
                                } else $(this).val(parseFloat(val) == val ? val : parseFloat(val));
                            } else $(this).val(parseFloat(val));
                        }
                    } else {
                        if (isNaN(parseInt(val))) $(this).val('');
                        else {
                            if (parseInt(val) > unit.max) $(this).val(unit.max);
                            else if (parseInt(val) < unit.min) $(this).val(unit.min);
                            else $(this).val(parseInt(val));
                        }
                    }
                });
            } else {
                if(_self.options[0].type != "hRent"){
                    $.each($('.event-input-sel'),function (index, val) {
                        theFading(val,0,function () {
                            $(val).addClass('hide')
                        });
                    });
                    _self.setActive($(this).attr('data-value'));
                }
                
            }
            // _self.$ele.children('span').each(function() {
            //   $(this).removeClass('select-label-active');
            // });
            // $(this).addClass('select-label-active');
            // _slef.activeName = $(this).attr('data-value');
        });
        if(_self.options[0].type == "hRent"){
            _self.$ele.find('span').trigger('click');
        }
        $(document).on('click', function (e) {
            e.stopPropagation();
            // $('.event-input-sel').hide();
            $.each($('.event-input-sel'),function (index, val) {
                theFading(val,0,function () {
                    $(val).addClass('hide')
                });
            });

        });
    };
    select.prototype.setValue = function (name, value) {
        var t = ''
        var _self = this
        _self.activeValue = value
        if (_self.getType(name) === 'unit') {
            var unit = _self.getUnit(name)
            t = (unit.prefix || '') + value + unit.unit
            _self.setActive(name)
            _self.$ele.children('span[data-value="' + name + '"]').children('p').text(t)
        }
    }
    select.prototype.getUnit = function (value) {
        var _self = this;
        var result;
        $.each(_self.options, function (index, item) {
            if (item.value === value) result = item;
        });
        return result.unit;
    };
    select.prototype.getType = function (value) {
        var _self = this;
        var result;
        $.each(_self.options, function (index, item) {
            if (item.value === value) result = item;
        });
        return result.type;
    };
    select.prototype.getLabel = function (value) {
        var _self = this;
        var result;
        $.each(_self.options, function (index, item) {
            if (item.value === value) result = item;
        });
        return result.label;
    };
    select.prototype.getValue = function () {
        return this.activeValue;
    };
    select.prototype.setActive = function (value) {
        if (typeof value !== 'string') throw Error('The value must be a string');
        var _self = this;
        _self.$ele.children('span').each(function () {
            var val = $(this).attr('data-value');
            $(this).removeClass('select-label-active');
            $(this).children('p[data-value="name"]').text(_self.getLabel(val));
        });
        _self.$ele.children('span[data-value="' + value + '"]').addClass('select-label-active');
        var type = _self.getType(value);
        if (type === 'unit') {
            var unit = _self.getUnit(value);
            _self.$ele
                .children('span[data-value="' + value + '"]')
                .children('p[data-value="name"]')
                .text((unit.prefix || '') + unit.min + unit.unit);
        } else {
            _self.activeValue = null;
        }
        _self.activeName = value;
    };
    select.prototype.append = function (option) {
        if(option.type == 'hRent'){
            var arrs = '',pHtml = '';
            if (option.unit.array) {
                $.each(option.unit.array, function (index, item) {
                    arrs += '<i>' + item + '</i>';
                });
            } else {
                var step = parseInt((option.unit.max - option.unit.min) / option.unit.quantity);
                var left = option.unit.min;
                for (var i = 0; i < option.unit.quantity; i++) {
                    arrs += '<i>' + left + '</i>';
                    left += step;
                }
            }
            if(option.unit.content) pHtml='<p>'+option.unit.content+'</p>';
            if(this.$ele.find('i.icon-ellipsis').length !== 0){
                var top=this.$ele.find('i.icon-ellipsis')[0].offsetHeight+3+'px';
                var arrowLeft=this.$ele.find('i.icon-ellipsis')[0].offsetWidth;
                var left=0;
            }else{
                var left=-this.$ele.children('span')[0].offsetLeft+'px';
                var arrowLeft=this.$ele[0].offsetWidth-16;
                var top=this.$ele[0].offsetHeight+8+'px';
            }
            if(this.$ele.children('span').find('aside').length === 0){
                this.$ele.children('span').append(`
                    <aside class="event-popup event-input-sel absolute opacity0 hide" style="left:${left};top:${top}" data-garnish="event-popup-top">
                        <em class="down" style="left:${arrowLeft/2+'px'}"></em><span class="up" style="left:${arrowLeft/2+'px'}"></span>
                        <input type="text" placeholder="" ime-mode="disabled">
                        <button class="button-event-small-white" data-id="clear">清除</button>
                        <button class="button-event-small-blue" data-id="confirm">确认</button>
                       ${pHtml+arrs}
                         </aside> 
                `).attr('data-type','unit').attr('data-value',option.value).css('position','relative');
            }
        }else{
            this.$ele.append(
                '<span style="display:inline-block;margin-right:20px;" class="select-label" data-type="' +
                option.type +
                '" data-value="' +
                option.value +
                '"><p data-value="name"> ' +
                option.label +
                '</p><i></i></span>'
            );
            if (option.type === 'unit') {
                var arrs = '',pHtml = '';
                if (option.unit.array) {
                    $.each(option.unit.array, function (index, item) {
                        arrs += '<i>' + item + '</i>';
                    });
                } else {
                    var step = parseInt((option.unit.max - option.unit.min) / option.unit.quantity);
                    var left = option.unit.min;
                    for (var i = 0; i < option.unit.quantity; i++) {
                        arrs += '<i>' + left + '</i>';
                        left += step;
                    }
                }
                if(option.unit.content) pHtml='<p>'+option.unit.content+'</p>';
                var top=this.$ele.children('span:last')[0].offsetHeight+10+'px';
                var arrowLeft=this.$ele.children('span:last')[0].offsetWidth;
                this.$ele
                    .children('span:last')
                    .append(`
                        <div class="event-popup event-input-sel absolute opacity0 hide" style="left:0;top:${top}" data-garnish="event-popup-top">
                            <em class="down" style="left:${arrowLeft/2-8+'px'}"></em><span class="up" style="left:${arrowLeft/2-8+'px'}"></span>
                            <input type="text" placeholder="1212" ime-mode="disabled">
                            <button class="button-event-small-white" data-id="clear">清除</button>
                            <button class="button-event-small-blue" data-id="confirm">确认</button>
                           ${pHtml+arrs}
                             </div> 
                    `);
            }
        }
    };
    select.prototype.getActive = function () {
        return this.activeName;
    };
    $.fn.select = function (options, active) {
        return new select(this, options, active);
    };
})(jQuery);
