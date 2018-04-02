/**
 * Created by ching on 2017/10/21.
 */
(function(){
    theSliding=function(obj,iTarget,event){
        clearInterval(obj.timer);
        obj.timer=setInterval(function (){
            var iSpeed=(iTarget-obj.marginTop)/8;
            iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);

            if(obj.marginTop==iTarget)
            {
                clearInterval(obj.timer);
                if(event) event();
            }
            else
            {
                obj.marginTop+=iSpeed;
                obj.style.marginTop=obj.marginTop+'px';
            }
        }, 30)
    }
})();