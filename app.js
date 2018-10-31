pinMode(B15, 'input_pullup');
pinMode(B3, 'input_pullup');
pinMode(B5, 'input_pullup');
pinMode(B7, 'input_pullup');

var DEFS={
  X: { // TIM3
    base: 0x40000400,
    dir: B3,
    step: B4
  },
  Y: { // TIM4
    base: 0x40000800,
    dir: B5,
    step: B6
  },
  Z: { // TIM1
    base: 0x40010000,
    dir: B7,
    step: A8
  }
};

function _f(data) {
  return { width : 15, height : 16, bpp : 1, transparent : 0, buffer : E.toArrayBuffer(atob(data)) };
}

const font={
  0: _f("D4A/gOOBgwcHDB4Y/DOYfjDwYcDBgwOOA/gD4AAA"),
  1: _f("DgB8AdgCMABgAMABgAMABgAMABgAMABgD/gf8AAA"),
  2: _f("HwB/AYYADgAcADgAYAHABwAcAHABwAcAD/wf+AAA"),
  3: _f("PwD/AQcADgAYADAHwA/AAcABgAMABgAcD/AfgAAA"),
  4: _f("A8AHgB8AfgDcAzgGcBjgYcDDg//H/4AcADgAcAAA"),
  5: _f("f8D/gYADAAYADAAfwD/AAcABgAMABgAcD/AfgAAA"),
  6: _f("B8A/gOADgAYADAA/4H/g8MGAwYGDBwcMB/AHwAAA"),
  7: _f("/8H/gAMADgAYAHAAwAOABgAcADAAYAGAAwAMAAAA"),
  8: _f("H4D/gYMDBgYMDzgHwA/Ae8DBw4OHBwYOD/gHwAAA"),
  9: _f("D4B/gMODAwYGDA4cPB/4H+AAwAGABwAcB/APgAAA"),
  X: _f("YHDgwOOAzgHYAfABwAOADwAfAHcBxgMGDg44DAAA"),
  Y: _f("4DjAYcHBgwOOAxgHYAfABwAOABgAMABgAMABgAAA"),
  Z: _f("f+D/wAOABgAYAHAAwAMABgAYAGAAwAMAD/4f/AAA"),
};


function init(tim) {
  const def=DEFS[tim];
  if ( !def ) {
    throw "Invalid timer!";
  }
  const BASE=def.base;

  // general control register
  var CCR = BASE;
  // slave mode control register
  var SMCR = BASE+0x0008;
  // event generation register
  var EGR = BASE+0x0014;
  // Capture compare mode register
  var CCMR1 = BASE+0x0018;
  // Capture/compare enable register
  var CCER = BASE+0x0020;
  // counter
  var CNT = BASE+0x0024;
  // prescaler
  var PSC = BASE+0x0028;
  // auto reload register
  var ARR = BASE+0x002C;

  // enable PWM on A8 (TIM1 CH1)
  analogWrite(def.step,0.5,{freq:10});
  // DIR = 1 (count down)
  poke16(CCR, peek16(CCR) | 0b00010000);
  // CC1E = 0 (Turn channel 1 off)
  poke16(CCER, peek16(CCER) & ~1);
  // CC1S[1:0]=01 (rising edge), IC1F[7:4]=0 (no filter)
  poke16(CCMR1, (peek16(CCMR1) & ~0b11110011) | (0b00000001));
  // CC1P=0, CC1NP=0 (detect rising edge), CC1E[0] = 1 (Turn channel 1 on)
  poke16(CCER, peek16(CCER) & ~(0b1011) | (0b0001));
  // SMS[2:0]=111 (ext clock), TS[6:4]=101 (CH1 as trigger)
  poke16(SMCR, (peek16(SMCR) & ~0b1110111) | 0b1010111);
  // Prescaler to 0 - use every transition
  poke16(PSC, 0);
  // auto-reload with the full range of values
  poke16(ARR, 65535);
  // poke the UG[0] bit to reset the counter and update the prescaler
  poke16(EGR, 1);

  var lastPeek=0;
  var total=0;
  poke16(CNT, 0);

  return {
    step: function() {
      var thisPeek=peek16(CNT);
//      if ( thisPeek < lastPeek ) {
        // overflow
//        total+=65536;
//      }
      lastPeek=thisPeek;
      return total + thisPeek;
    },
    dir: function() {
      if ( def.dir ) {
        return digitalRead(def.dir);
      }
      return 0;
    },
    reset: function() {
      lastPeek=0;
      total=0;
      poke16(CNT, 0);
    }
  };
}

function drawCnt(g, lbl, obj, y) {
  g.drawImage(font[lbl], 0, y);
  const txt=obj.step().toString();
  const dir=obj.dir();
  const offset=128 - txt.length * 14;
  for (var n=0; n< txt.length; n++) {
    g.drawImage(font[txt.charAt(n)], offset+n*14, y);
  }
  if ( dir ) {
    g.fillRect(14, y+12, 14+2, y+12+2);
  }
}

const native=E.compiledC(`
  // void dir(bool)
  unsigned char *addr=(unsigned char *) 0x40010000;
  void dir(bool state) {
    *addr = (*addr & ~0b00010000) | (state * 0b00010000);
  }
`);

function onInit() {
  var s = new SPI();
  s.setup({mosi: A6 /* D1 */, sck:A5 /* D0 */});
  var g = require("SH1106").connectSPI(s, B1 /* DC */, A7 /* RST - can leave as undefined */, function() {
    const Y=init("Y");
    const X=init("X");
    const Z=init("Z");

    setWatch(function(e) {
      X.reset();
      Y.reset();
      Z.reset();
    }, B15, { repeat: true });

    setWatch(native.dir, B7, {repeat: true, edge: "both", irq: true});

    function update(){
      g.clear();
      g.setRotation(2);

      drawCnt(g, "X", X, 0);
      drawCnt(g, "Y", Y, 20);
      drawCnt(g, "Z", Z, 40);

      g.flip(); 
    }

    setInterval(update, 200);
  });
}

// onInit();
