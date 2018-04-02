/**
 * Created by ching on 2017/11/4.
 */
var uploader;
function getWebUploader(id,url,data,num,func) {
    //上传图片
    $parents=$(id).parents('.form-item-box');
    $parent=$(id).parent();
    $widthHeight={
        width:$parent[0].offsetWidth,
        height:$parent[0].offsetHeight
    };
    uploader = WebUploader.create({
        auto: true,
        swf: 'http://zudahao.zudahao.com/agentes/js/Uploader.swf',
        server: url,
        pick: id,
        resize: false,
        formData:data,
        xhrFields:{withCredentials:true},
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/jpg,image/jpeg,image/png'
        },
        fileVal: 'files',
        fileNumLimit:num,
        duplicate:true
    });
    uploader.on('fileQueued',function(file){
        var $div=$(`
                    <div class="img-update">
                            <div class="picContainer"></div>
                            <i class="iconfont icon-enlarge hide" id="lookLargePic" title="点击看大图"></i>
                            <div class="img-opacity" id="${file.id+'picker'}"><i class="iconfont icon-delete"></i>${  !num ? '更换图片' : '删除图片'}</div>
                        </div>
        `);
        var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail" style="height:100%">' +
                '<img style="width:100%;height:100%;">' +
                '</div>'
            );
        // if($parents.find('.picContainer').length === 1){
        //     console.log($parents.find('.picContainer>div'))
        //     uploader.removeFile( $parents.find('.picContainer>div').attr('id') ,true);
        //     $parents.find('.img-update').remove();
        // }
        // $parents.find('.picContainer').parent().remove()
        $div.insertBefore($parent).find('.picContainer').append($li);
        if(!num){
            $parent.remove();
        }else{
            if($parents.find('.img-update').length === 6){
                $parents.find('.img-update:last-child').hide()
            }else{
                $parents.find('.img-update:last-child').show()
            }
        }
        $img = $parents.find('#'+file.id+' img');
        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        uploader.makeThumb(
            file,
            function(error, src) {
                if (error) {
                    $img.replaceWith('<span>不能预览</span>');
                    return
                }
                $img.attr('src', src)
            },
            $widthHeight.width,
            $widthHeight.height
        );
    });
// 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id );
        $percent = $('<div class="progress"><i class="nums-update"></i><p class="img-opacity" data-id="cancel"><i class="iconfont icon-cancel"></i>取消上传</p></div>')
            .appendTo( $li )
            .find('i.nums-update');
        $percent.text(  percentage * 100 + '%' );
        $li.find('.progress').css('width','100%').css('height',$widthHeight.height);
        $parents.on('click','[data-id="cancel"]',function () {
            uploader.removeFile( file ,true);
            $(this).parents('.img-update').remove();
            if(!num) $parents.prepend(`
                <div class="img-update">
                                <div id="picker"><img src="http://zudahao.zudahao.com/agents/images/plus.png" style="width: 100%;height:100%"></div>
                            </div>
            `);
            $parents.find('.img-update:last-child').show()
        });
        if(percentage === 1){
            $( '#'+file.id ).find('.progress').remove();
            var pId= '#'+file.id +'picker';
            $(pId).removeClass('hide').prev().removeClass('hide');
            if(!num){
                getWebUploader(pId,url,data,num,func)
            }else{
                $(pId).click(function () {
                    var _this=$(this)
                    var options={
                        content:'确认移除吗？',
                        yes:function(){
                            messageTip({message:'删除成功',state:1})
                            uploader.removeFile( file ,true);
                            _this.parents('.img-update').remove();
                            $parents.find('.img-update:last-child').show()
                        }
                    };
                    $(this).minConfirmBox(options);
                })
            }
        }
    });
// 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on( 'uploadSuccess', function( file ) {
        $( '#'+file.id ).find('.progress').remove();
        $( '#'+file.id ).parents('.img-update').find('.img-opacity').removeClass('hide').prev().removeClass('hide');
    });


    //上传返回数据
    uploader.on('uploadAccept',function (file, response) {
        if(response.content == 0){
            var options = {
                message: '数据错误，请重试。',
                state: 3//1、cssDemo、3三种状态:1成功,2失败,3警告
            };
            messageTip(options);
        }else if(response.content == 1){
            if(func) func();
            console.log(file,file.file);
            $('#'+file.file.id).parents('.img-update').attr('data-url',response.data);
        }
    });
    //点击看大图
    $parents.on('click','#lookLargePic',function (e) {
        e.stopPropagation()
        var html=$(`
                    <div class="pop-bg" id="pop-pic">
                        <div style="position: fixed;top:50%;left:50%;transform:translate(-50%,-50%)">
                            <img src="" alt="" style="width:400px;">
                        </div>
                    </div>
            `);
        $('body').append(html);
        $('body').find('#pop-pic img').attr('src',$(this).prev().find('img').attr('src'));
        var _con=$('body').find('#pop-pic>div');
        // 点击其他地方，窗口消失
        $(document).mouseup(function(e){
            if(!_con.is(e.target) && _con.has(e.target).length === 0){
                _con.parent().remove();
            }
        });
    })
}