(function($) {
    function getButtonLoading(ele){
        var _self=ele;
        ele[0].text=ele.text();
        var html=$(`
                <div class="m-load">
                    <div class="line">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div class="circlebg"></div>
                </div>
            `);
            _self.addClass('btn-loading').attr("disabled","disabled");
            _self.html(html);
    }

    function  deleteButtonLoading(ele) {
        var _self=ele;
        _self.removeClass('btn-loading').removeAttr("disabled");
        _self.html(ele[0].text);
    }

    $.fn.getButtonLoading=function(){
        return new getButtonLoading(this);
    };

    $.fn.deleteButtonLoading = function () {
        return new deleteButtonLoading(this);
    };
})(jQuery);