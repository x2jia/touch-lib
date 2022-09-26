browser-touchlib
===

| **browser-touchlib**
| [browser-touchlib](https://github.com/x2jia/touch-lib)

![](./gif/horizon.gif)

```html
<!DOCTYPE html>
<html>
  <head>
  <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport"/>
  <meta charset='utf-8'>
  <script type="text/javascript" charset="utf-8" src="http://cdn.staticfile.org/jquery/1.12.4/jquery.min.js"></script>
  <script type="text/javascript" charset="utf-8" src="./../index.js"></script>
  <title>test</title>
  <style>
    html, body {
      background-color: #fff;
      background-repeat: no-repeat;
      -webkit-font-smoothing: antialiased;
      height: 100%;
      font-size: 14px;
    }
    .area {
      background-color: #ccc;
      width: 300px;
      height: 300px;
      margin: auto;
    }
  </style>
  <script type="text/javascript">
    $(function(){
      const id1 = window.jFingerSlideMob.register(null, {
        handler(event){
          console.log(event.type, event)
        },
        option: {
          scale: 1,
          orientation: '-|',
          style: 'font-size: 54px',
          tip: true
        }
      })
      setTimeout(() => {
        window.jFingerSlideMob.unregister(id1)
      }, 5000)

    })
  </script>
</head><body>
  <div id="area" class="area" style="touch-action: none;" >
    hello
  </div>
</body></html>
```

![](./gif/vertical.gif)

```js
    const jFingerSlideMob = require('browser-touchlib')($)

    const moveid = jFingerSlideMob.register('midea-wrapper', {
      handler: (event) => {
        if(event.type !== 'touchmove'){
          this.state.currentTime = -1;
        }else{
          const duration = myPlayer.duration()
          if(typeof duration === 'number' && duration > 0){
            if(this.state.currentTime < 0){
              this.state.currentTime = myPlayer.currentTime()
            }

            var progress = Math.floor(this.state.currentTime + event.progressX * duration)
            if(progress > duration){
              progress = duration
            }
            if(progress < 0){
              progress = 0
            }
            myPlayer.currentTime(progress)
          }
        }
      },
      option: {
        scale: 0.7,
        orientation: '-',
        style: 'font-size: 54px; color: #fe9; position: absolute; top: 0; right: 0;',
        tip: true,
      }
    })
```

### API

**register(id, object)**

***id***, string,  An html element id or null

***object*** :

```
{
  handler, A callback function,  (event) => {}
  option: {
    scale, number,  (0, ∞)
    style, string
    tip, boolean
    orientation, string,  {"-","|","-|"}
  }
}
```

***event***

```
{
    "clientX": 221.41177368164062,  raw event value
    "clientY": 131.2941131591797,
    "pageX": 221.41177368164062,
    "pageY": 131.2941131591797,
    "radiusX": 13.529411315917969,
    "radiusY": 13.529411315917969,
    "screenX": 267.20001220703125,
    "screenY": 281.6000061035156,
    "type": "touchmove", string  {"touchstart", "touchmove", "touchend", "touchcancel"}
    "progressX": 0.4831373087565104, number  Relative to starting point  X direction
    "progressY": -0.47058815002441406, number  Relative to starting point  Y direction
    "deltaX": 0.01882364908854167, number  Relative to previous point  X direction
    "deltaY": -0.006274464925130208, number  Relative to previous point  Y direction
    "orientation": "|"
}
```

***return value***
A unique value，unregister will use it

**unregister(return_value)**

***return_value***, A unique value returned by register

### License

996ICU License
