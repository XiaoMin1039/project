/**
 * Created by ching on 2017/10/14.
 */
(function(){
    theFading=function(obj,iTarget,event){
        if(obj) {
            clearInterval(obj.timer);
            obj.timer=setInterval(function (){
                var iSpeed=(iTarget-obj.alpha)/8;
                iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
                if(obj.alpha == iTarget)
                {
                    clearInterval(obj.timer);
                    if(event) event();
                }
                else
                {
                    obj.alpha+=iSpeed;
                    obj.style.opacity=obj.alpha/100;
                }
            }, 5);
        }
    }
})();