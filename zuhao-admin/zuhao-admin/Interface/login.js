/**
 * Created by ching on 2017/11/7.
 */
getImg();
$(document).on('click','#login',function (e) {
    e.preventDefault();
    getLoginJson()
});
$(document).on('click','.change-yzm',function () {
    getImg()
});
$(document).keydown(function(e){
    if(e.keyCode == 13){
        if($('#login').hasClass('banClick')){
            return;
        }
        $('.form-content input').blur();
        if($('.form-content .error-box').length === 0) {
            getLoginJson()
        }
    }
});
function getLoginJson() {
    var data={
        agents_pass:$('#user_pwd').val(),
        agents_account:$('#loginName').val(),
        valid_code:$('#imgCode').val()
    };
    getFormData('login_admin',data,$('#login'),function (json) {
        if(json.content === 1){
            if(getQueryString('fromUrl') && getQueryString('query')){
                window.location.href = decodeURIComponent(getQueryString('fromUrl')) + '.html?' + decodeURIComponent(getQueryString('query'));
            }else if(getQueryString('fromUrl') && !getQueryString('query')){
                window.location.href = decodeURIComponent(getQueryString('fromUrl')) + '.html';
            }else{
                window.location.href = './index.html';
            }
        }else{
            getImg();
            $('#login').addClass('banClick')
            $('#imgCode').val('');
        }
        if(json.content !== 1){
            showInputError($('#errorBox'),returnError(json.content));
        }
    })
}