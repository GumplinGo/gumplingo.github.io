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
      random = -0.3 + Math.random() * 0.5;
      return function(x:number) {
        return x + 0.5 * random - 1;
      };
    case 'fny':
      random = 0.5 + Math.random() * 0.7
      return function(y:number) {
        return y + random;
      };
    case 'fnr':
      random = Math.random() * 0.01;
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

class Gold {
  x: number;
  y: number;
  s: number;
  r: number;
  fn: Fn;
  img: HTMLImageElement;
  baseSize: number = 40;
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
    cxt.translate(this.x, this.y);
    cxt.rotate(this.r);
    let img = this.img;
    // 保持图片比例
    const width = img.width;
    const height = img.height;
    const rate = width / height;
    const baseSize = this.baseSize;
    if (rate > 1) {
      cxt.drawImage(img, 0, 0, baseSize * this.s, baseSize / rate * this.s)
    } else {
      cxt.drawImage(img, 0, 0, baseSize * rate * this.s, baseSize * this.s)
    }
    cxt.restore();
  }

  update() {
    this.x = this.fn.x(this.x);
    this.y = this.fn.y(this.y);
    this.r = this.fn.r(this.r);
    const baseSize = this.baseSize;
    if(this.x > window.innerWidth + baseSize ||
      this.x < -baseSize ||
      this.y > window.innerHeight + baseSize ||
      this.y < -baseSize
    ) {
      if(Math.random() > 0.4) {
        this.x = getRandom('x');
        this.y = -baseSize;
        this.s = getRandom('s');
        this.r = getRandom('r');
      } else {
        this.x = window.innerWidth + baseSize;
        this.y = getRandom('y');
        this.s = getRandom('s');
        this.r = getRandom('r');
      }
    }
  }

}

class GoldList {
  list: Gold[];
  constructor() {
    this.list = [];
  }

  push(gold: Gold) {
    this.list.push(gold);
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

const loadImg= (src: string) => {
  return new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image()
    img.src = src;
    img.onload = () => {
      res(img)
    }
    img.onerror = () => {
      rej('load img failed')
    }
  })
}

async function startGold() {
  const imgPaths = [
    '/images/fall-icon/clover.png',
    // '/fall-icon/gold.png',
    '/images/fall-icon/petal.png',
    // '/fall-icon/wealth-god.png',
    // '/fall-icon/god-wealth.png',
  ]
  const imgs = await Promise.all(imgPaths.map(path => loadImg(path)))
  const requestAnimationFrame = window.requestAnimationFrame
  const canvas = document.createElement('canvas')
  isPlaying = true;
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.setAttribute('style', 'position: fixed;left: 0;top: 0;pointer-events: none;');
  canvas.setAttribute('id', 'canvas_gold');
  document.getElementsByTagName('body')[0].appendChild(canvas);
  const cxt = canvas.getContext('2d')!;
  const goldList = new GoldList();
  for(let i = 0; i < 50; i++) {
    const img = imgs[Math.floor(Math.random() * imgs.length)]
    var gold, randomX, randomY, randomS, randomR, randomFnx, randomFny, randomFnR;
    randomX = getRandom('x');
    randomY = getRandom('y');
    randomR = getRandom('r');
    randomS = getRandom('s');
    randomFnx = getRandom('fnx');
    randomFny = getRandom('fny');
    randomFnR = getRandom('fnr');
    gold = new Gold(randomX, randomY, randomS, randomR, {
      x: randomFnx,
      y: randomFny,
      r: randomFnR
    }, img);
    gold.draw(cxt);
    goldList.push(gold);
  }
  stopId = requestAnimationFrame(function loop() {
    cxt.clearRect(0, 0, canvas.width, canvas.height);
    goldList.update();
    goldList.draw(cxt);
    stopId = requestAnimationFrame(loop);
  })

  window.onresize = function() {
    var canvasSnow = document.getElementById('canvas_gold') as HTMLCanvasElement;
    canvasSnow.width = window.innerWidth;
    canvasSnow.height = window.innerHeight;
  }
}


function stopGold() {
  if(isPlaying) {
    var child = document.getElementById("canvas_gold")!;
    child.parentNode!.removeChild(child);
    window.cancelAnimationFrame(stopId);
    isPlaying = false;
  }
}

export default {
  startGold,
  stopGold
}