type Fn = {
  x: (x: number) => number,
  y: (y: number) => number,
  r: (r: number) => number
}

// 提取Fn的value类型
type ValueOfFn = Fn[keyof Fn]
type FnByKey<K extends 'fnx' | 'fny' | 'fnr'> = K extends `fn${infer R}`
  ? R extends keyof Fn
    ? Fn[R]
    : never
  : never

function getRandom(key: 'x' | 'y' | 's' | 'r' ): number;
function getRandom<K extends 'fnx' | 'fny' | 'fnr'>(key: K): FnByKey<K>;
function getRandom(key: 'x' | 'y' | 's' | 'r' | 'fnx' | 'fny' | 'fnr'): number | ValueOfFn {
  let random:number;
  switch(key) {
    case 'x':
      return Math.random() * window.innerWidth;
    case 'y':
      return Math.random() * window.innerHeight;
    case 's':
      return Math.random();
    case 'r':
      return Math.random() * 6;
    case 'fnx':
      random = -0.5 + Math.random() * 1;
      return function(x:number) {
        return x + 0.5 * random - 1.7;
      };
    case 'fny':
      random = 1.5 + Math.random() * 0.7
      return function(y:number) {
        return y + random;
      };
    case 'fnr':
      random = Math.random() * 0.03;
      return function(r:number) {
        return r + random;
      };
    default:
      const exhaustiveCheck: never = key
      return exhaustiveCheck
  }
}
let stopId: number;
let isPlaying = false;

class Sakura {
  x: number;
  y: number;
  s: number;
  r: number;
  fn: Fn;
  img: HTMLImageElement;
  constructor(x:number, y:number, s:number, r:number, fn: Fn, img: HTMLImageElement) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.r = r;
    this.fn = fn;
    this.img = img;
  }

  draw (cxt: CanvasRenderingContext2D) {
    cxt.save();
    var xc = 40 * this.s / 4;
    cxt.translate(this.x, this.y);
    cxt.rotate(this.r);
    cxt.drawImage(this.img, 0, 0, 40 * this.s, 40 * this.s)
    cxt.restore();
  }

  update() {
    this.x = this.fn.x(this.x);
    this.y = this.fn.y(this.y);
    this.r = this.fn.r(this.r);
    if(this.x > window.innerWidth ||
      this.x < 0 ||
      this.y > window.innerHeight ||
      this.y < 0
    ) {
      if(Math.random() > 0.4) {
        this.x = getRandom('x');
        this.y = 0;
        this.s = getRandom('s');
        this.r = getRandom('r');
      } else {
        this.x = window.innerWidth;
        this.y = getRandom('y');
        this.s = getRandom('s');
        this.r = getRandom('r');
      }
    }
  }

}

class SakuraList {
  list: Sakura[];
  constructor() {
    this.list = [];
  }

  push(sakura: Sakura) {
    this.list.push(sakura);
  }

  update() {
    const len = this.size();
    for(let i = 0; i < len; i++) {
      this.list[i].update();
    }
  }

  draw(cxt:CanvasRenderingContext2D) {
    const len = this.size()
    for(let i = 0; i < len; i++) {
      this.list[i].draw(cxt);
    }
  }

  get(i:number) {
    return this.list[i];
  }

  size () {
    return this.list.length;
  }
}

function startSakura(img: HTMLImageElement) {

  const requestAnimationFrame = window.requestAnimationFrame
  const canvas = document.createElement('canvas')
  isPlaying = true;
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.setAttribute('style', 'position: fixed;left: 0;top: 0;pointer-events: none;');
  canvas.setAttribute('id', 'canvas_sakura');
  document.getElementsByTagName('body')[0].appendChild(canvas);
  const cxt = canvas.getContext('2d') as CanvasRenderingContext2D;
  const sakuraList = new SakuraList();
  for(let i = 0; i < 50; i++) {
    var sakura, randomX, randomY, randomS, randomR, randomFnx, randomFny, randomFnR;
    randomX = getRandom('x') as number;
    randomY = getRandom('y') as number;
    randomR = getRandom('r') as number;
    randomS = getRandom('s') as number;
    randomFnx = getRandom('fnx') as ValueOfFn;
    randomFny = getRandom('fny') as ValueOfFn;
    randomFnR = getRandom('fnr') as Fn['r'];
    sakura = new Sakura(randomX, randomY, randomS, randomR, {
      x: randomFnx,
      y: randomFny,
      r: randomFnR
    }, img);
    sakura.draw(cxt);
    sakuraList.push(sakura);
  }
  stopId = requestAnimationFrame(function loop() {
    cxt.clearRect(0, 0, canvas.width, canvas.height);
    sakuraList.update();
    sakuraList.draw(cxt);
    stopId = requestAnimationFrame(loop);
  })

  window.onresize = function() {
    var canvasSnow = document.getElementById('canvas_snow') as HTMLCanvasElement;
    canvasSnow.width = window.innerWidth;
    canvasSnow.height = window.innerHeight;
  }
}


function stopSakura() {
  if(isPlaying) {
    var child = document.getElementById("canvas_sakura")!;
    child.parentNode!.removeChild(child);
    window.cancelAnimationFrame(stopId);
    isPlaying = false;
  }
}

export default {
  startSakura,
  stopSakura
}