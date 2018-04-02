(function($) {
  function sixDig(ele) {
    var _self = ele
    var input = $(
      '<input type="text" tabindex="1" id="payPassword"  oncontextmenu="return false" onpaste="return false" oncopy="return false" oncut="return false" autocomplete="off" value="" maxlength="6" minlength="6" style="outline: none; margin-left: -99999px;">'
    )
    _self.append(input)
    _self.append('<div id="mockInput" style="width: 221px;" tabindex="0"><span class="highLight"><i></i></span></div>')
    _self.find('.highLight').hide()
    ;(function() {
      for (var i = 0; i < 6; i++) {
        _self.find('#mockInput').append('<i style="width: 36px;"><b></b></i>')
      }
    })()
    var timer
    var active = 1
    function setActive() {
      if (active > 6) {
        _self.find('.highLight').hide()
        clearInterval(timer)
      } else {
        _self.find('.highLight').show()
        _self.find('.highLight').css('left', (active - 1) * 37 + 1 + 'px')
      }
      _self.find('i').removeClass('active')
      _self.find('i:nth-child(' + active + ')').addClass('active')
      _self.find('b').each(function(index, item) {
        if (index < active - 1) {
          $(item).addClass('active')
        } else {
          $(item).removeClass('active')
        }
      })
      setTimer()
    }
    function setTimer() {
      clearInterval(timer)
      timer = setInterval(function() {
        _self.find('.highLight i').hide()
        setTimeout(function() {
          _self.find('.highLight i').show()
        }, 400)
      }, 800)
    }
    _self.find('input').on('blur', function() {
      _self.find('.highLight').hide()
      _self.find('#mockInput').css('border-color', '#ebedf3')
      clearInterval(timer)
    })
    _self.find('#mockInput').on('click', function() {
      setActive()
      _self.find('input').focus()
    })
    _self.find('input').on('focus', function() {
      _self.find('#mockInput').css('border-color', '#1E9FFF')
    })
    _self.find('input').on('keydown', function(key) {
      var kc = key.keyCode
      if (kc == 8 || kc == 46) {
        active--
        if (active < 1) active = 1
      } else if ((kc >= 48 && kc <= 57) || (kc >= 96 && kc <= 105)) {
        active++
        if (active > 6) active = 7
      } else {
        return false
      }
      setActive()
    })
    this.getActive = function() {
      return active
    }
    this.getValue = function() {
      return _self.find('input').val()
    }
  }
  $.fn.sixDig = function() {
    return new sixDig(this)
  }
})(jQuery)
