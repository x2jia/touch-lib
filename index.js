var _$, _index, _obj, _visualtipId, _defops, _orientation

if(typeof $ !== 'undefined'){
  _$ = $
}

_index = 0
_obj = {}
_visualtipId = `jfsm-${(new Date()).getTime()}`
_defops = {
  scale: 1,
  /*
    -, |, -|, |-
    1, 2,  3, 4
  */
  orientation: 3,
  style: '',
  scrolling: false,
  tip: false,
  tolerance: 'default', /* infinite, default */
}
_orientation = ['^', '-', '|']

function newkey(){
  return `${++_index}${(new Date()).getTime()}`
}

function wrapfn(fn, k, type){
  return function(event){
    innerproc(k, type, event, fn)
  }
}

function appendhml(jParent, kvalue){
  if(!kvalue.option.tip){
    return
  }
  const html = `<p id="${_visualtipId}"
    style="user-select: none; font-size: 64px; color: #0f0; width: 100%; text-align: center; ${kvalue.option.style}">0</p>`
  jParent.append(html)
}

function updatehml(kvalue){
  if(!kvalue.option.tip){
    return
  }
  if(kvalue.context.orientation < 3){
    const currentpoint = kvalue.context.pointArr[kvalue.context.pointArr.length - 1]
    if(kvalue.context.orientation < 2){
      var progress = currentpoint.progressX
    }else{
      progress = currentpoint.progressY
    }
    _$(`#${_visualtipId}`).text(`${progress < 0 ? '-' : '+'}${(Math.abs(progress) * 100).toFixed(1)}%`)
  }
}

function clearpanel(){
  _$(`#${_visualtipId}`).remove()
}

function eventproc(event, options){
  if(!options.scrolling){
    event.preventDefault()
  }
}

function innerproc(k, type, event, fn){
  const it = _obj[k]
  if(!it){
    return
  }

  if(event.changedTouches.length < 1){
    return
  }

  if(it.id){
    var ele = _$(`#${it.id}`)
  }else{
    ele = _$(document.body)
  }

  const rawtouch = event.changedTouches[event.changedTouches.length - 1]
  const currentpoint = {
    clientX: rawtouch.clientX,
    clientY: rawtouch.clientY,
    pageX: rawtouch.pageX,
    pageY: rawtouch.pageY,
    radiusX: rawtouch.radiusX,
    radiusY: rawtouch.radiusY,
    screenX: rawtouch.screenX,
    screenY: rawtouch.screenY,
    type,
    progressX: 0,
    progressY: 0,
    deltaX: 0,
    deltaY: 0,
    orientation: it.context.orientation < 3 ? _orientation[it.context.orientation] : '-|'
  }
  const pointArr = it.context.pointArr

  if(type === 'touchstart'){
    if(it.context.status === 'idle'){
      it.context.status = 'busy'
      it.context.width  = ele.width()  > 0 ? ele.width()  : 1
      it.context.height = ele.height() > 0 ? ele.height() : 1
      pointArr.push(Object.assign({}, currentpoint))
      appendhml(ele, it)
      fn(currentpoint)
    }else{
      pointArr[pointArr.length - 1].type = 'touchend'
      fn(pointArr[pointArr.length - 1])
      it.context.status = 'idle'
      it.context.pointArr = []
      it.context.orientation = it.option.orientation
      clearpanel()
    }
  }else if(type === 'touchmove'){
    if(it.context.status === 'busy'){
      if(pointArr.length > 2){
        Object.assign(pointArr[pointArr.length - 2], pointArr[pointArr.length - 1])
        pointArr.pop()
      }
      const bginpnt = pointArr[0]
      const deltaX = currentpoint.pageX - bginpnt.pageX
      const deltaY = bginpnt.pageY - currentpoint.pageY
      if(it.context.orientation > 2){
        it.context.orientation = Math.abs(deltaY) > Math.abs(deltaX) ? 2 : 1
        currentpoint.orientation = _orientation[it.context.orientation]
      }
      currentpoint.progressX = (deltaX / it.context.width)  * it.option.scale
      currentpoint.progressY = (deltaY / it.context.height) * it.option.scale
      currentpoint.deltaX = ((currentpoint.pageX - pointArr[pointArr.length - 1].pageX) / it.context.width)  * it.option.scale
      currentpoint.deltaY = ((pointArr[pointArr.length - 1].pageY - currentpoint.pageY) / it.context.height) * it.option.scale
      pointArr.push(Object.assign({}, currentpoint))
      updatehml(it)
      fn(currentpoint)
    }
  }else if(type === 'touchend' || type === 'touchcancel'){
    if(it.context.status === 'busy'){
      pointArr[pointArr.length - 1].type = type
      fn(pointArr[pointArr.length - 1])
      it.context.status = 'idle'
      it.context.pointArr = []
      it.context.orientation = it.option.orientation
      clearpanel()
    }
  }
  eventproc(event, it.option)

}

function register(...values){
  const k = newkey()
  var touchstart, touchmove, touchend, touchcancel, id
  var touchfn_, option_
  if(values.length === 1){
    if(typeof values[0] === 'object'){
      touchfn_ = values[0].handler
      option_ = values[0].option
    }
  }else if(values.length === 2){
    if(typeof values[0] === 'string'){
      id = values[0]
    }
    if(typeof values[1] === 'object'){
      touchfn_ = values[1].handler
      option_ = values[1].option
    }
  }else{
    return null
  }

  if(id){
    var ele = document.getElementById(id)
  }else{
    ele = document.body
  }

  if(!(ele && ele.addEventListener) || !(typeof touchfn_ === 'function')){
    return null
  }

  touchstart  = wrapfn(touchfn_, k, 'touchstart')
  touchmove   = wrapfn(touchfn_, k, 'touchmove')
  touchend    = wrapfn(touchfn_, k, 'touchend')
  touchcancel = wrapfn(touchfn_, k, 'touchcancel')

  ele.addEventListener('touchstart', touchstart, { passive: false })
  ele.addEventListener('touchmove', touchmove, { passive: false })
  ele.addEventListener('touchend', touchend, { passive: false })
  ele.addEventListener('touchcancel', touchcancel, { passive: false })

  if(typeof option_ === 'object'){
    if(typeof option_.scale === 'number'){
      if(!(option_.scale > 0)){
        option_.scale = _defops.scale
      }
    }else{
      option_.scale = _defops.scale
    }

    if(typeof option_.orientation === 'string'){
      const h_ = option_.orientation.indexOf('-')
      const v_ = option_.orientation.indexOf('|')
      let orientation = 0
      orientation = h_ < 0 ? orientation : (orientation + 1)
      orientation = v_ < 0 ? orientation : (orientation + 2)
      if(v_ < h_ && orientation > 2){
        orientation += 1
      }
      if(orientation < 1){
        orientation = 3
      }
      option_.orientation = orientation
    }else{
      option_.orientation = 3
    }

    if(!(option_.tolerance === 'infinite' || option_.tolerance === 'default')){
      option_.tolerance = 'default'
    }

    if(!(typeof option_.style === 'string' && option_.style.length > 0)){
      option_.style = _defops.style
    }

    option_.scrolling = !!(option_.scrolling)

    option_.tip = !!(option_.tip)

  }else{
    option_ = _defops
  }

  _obj[k] = {
    id: id ? id : null,
    touchstart,
    touchmove,
    touchend,
    touchcancel,
    option: option_,
    context: {
      status: 'idle',
      orientation: option_.orientation,
      pointArr: [],
      width:  1,
      height: 1
    }
  }

  return k

}

function unregister(k){
  if(!k){
    return
  }
  const it = _obj[k]
  if(!it){
    return
  }

  if(!it.id){
    var ele = document.body
  }else{
    ele = document.getElementById(it.id)
  }

  if(ele && ele.removeEventListener){
    ele.removeEventListener('touchstart', it.touchstart);
    ele.removeEventListener('touchmove', it.touchmove);
    ele.removeEventListener('touchend', it.touchend);
    ele.removeEventListener('touchcancel', it.touchcancel);
    clearpanel()
    delete _obj[k]
  }

}

const _exports = {
  register,
  unregister
}

if(typeof module === 'object' && module.exports){
  module.exports = function(o){
    _$ = o
    return _exports
  }
}else if(typeof window === 'object'){
  window.jFingerSlideMob = _exports
}
