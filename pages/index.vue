<template>
  <div class="wrap" ref="el" @mouseleave="handleMouseLeave">
    <div class="home" ref="home" :style="{ backgroundPosition: bgPosition }"></div>
    <div class="content" ref="content" :style="{ transform: rotateTransform, '--angle': computedAngle }">
      <h1 class="title">小江大浪的个人空间</h1>
      <p>昵称：小江大浪， 英文名：Gumplin Go</p>
      <p>大学一本本科，毕业于2019年， 至今已经搬砖 {{ year }} 年了</p>
      <p>自学编程的非科班前端开发，有一个全栈目标</p>
      <p>熟悉Vue2， Vue3，了解Node(在学Nest.js)、React</p>
      <p>间歇性奋发图强学习和健身，持续性看动漫、打王者</p>
      <hr class="hr">
      <p>Life is a fucking movie! 人生如戏，明天面对的的永远不知道是惊吓还是惊喜</p>
      <p>人真的很渺小，顺势而为， 努力生活</p>
    </div>
  </div>

</template>

<script setup lang="ts">
import goldFall from '~/lib/GoldFall'

useHead({
  title: '主页',
})

onMounted(() => {
  goldFall.startGold();
})

onUnmounted(() => {
  goldFall.stopGold()
})

const el = ref(null)
const home = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)

const { width, height } = useElementSize(el)
const { x, y } = useMouse()
const bgPosition = computed(() => {
  const xAxis = 50 + (x.value / width.value - 0.5) * 3
  const yAxis = 50 + (y.value / height.value - 0.5) * 3
  return `${xAxis}% ${yAxis}%`
})

function getMouseAngle(x: number, y: number) {
  const radians = Math.atan2(y, x);
  let angle = radians * (180 / Math.PI);

  if (angle < 0) {
    angle += 360;
  }

  return angle;
}

const computedAngle = computed(() => {
  const angle = getMouseAngle(-(y.value / height.value * 10 - 5), x.value / width.value * 10 - 5);
  return `${-angle}deg`;
})

const rotateTransform = computed(() => {
  return `translate(-50%, -50%) rotateX(${5 - y.value / height.value * 10}deg) rotateY(${x.value / width.value * 10 - 5}deg)`
  // return `rotateX(15deg) rotateY(30deg) rotateZ(0);`
})

const handleMouseLeave = () => {
  home.value!.style.backgroundPosition = '50% 50%';
  content.value!.style.transform = 'translate(-50%, -50%) rotateX(0deg) rotateY(0deg)';
}

// 计算距离2019.6到现在的年数，保留以为小数
const now = new Date();
const start = new Date('2019-06-01');
const diff = now.getTime() - start.getTime();
const year = (diff / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);




</script>

<style lang="scss">
@property --angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: -45deg;
}

.wrap {
  height: 100vh;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 500px;
  position: relative;
  .home {
    height: 100vh;
    background: url('/images/bg/home-bg.jpg') no-repeat 50% 50% / auto 110% border-box;
    color: white;
    position: absolute;
    inset: 0;
  }
  .content {
    padding: 20px;
    --angle: 45deg;
    box-sizing: border-box;
    width: 67%;
    aspect-ratio: 8/5 auto;
    backdrop-filter: blur(7px);
    background: linear-gradient(var(--angle), rgba(255, 255, 255, 0.07), rgba(0, 0, 0, 0.4));
    mask: linear-gradient(var(--angle), rgba(255, 255, 255, .2), #fff);
    box-shadow: 0 20px 40px 1px rgba(0, 0, 0, 0.12);
    position: absolute;
    inset: 50%;
    border-radius: 8px;
    /* transition: translate 0.3s, --angle 0.3s; */
    transform: translate(-50%, -50%);
    transform-style: preserve-3d;
    box-shadow: 0 20px 40px 1px rgba(0, 0, 0, 0.12),
        inset 0 -10px 20px -5px rgba(0, 0, 0, 0.3),
        0 150px 100px -80px rgba(0, 0, 0, 0.4),
        inset 0 1px 4px hsla(0, 0%, 100%, 0.6),
        inset 0 -1px 1px 1px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p {
      margin-bottom: 15px;
    }

    .hr {
      width: 67%;
    }
  }

  .title {
    font-size: 2.5rem;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    margin: 0;
    padding: 0;
    margin-bottom: 20px;
  }

}
</style>

