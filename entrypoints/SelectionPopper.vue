<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import {
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/vue'
import { onClickOutside } from '@vueuse/core'
import WordPopper from './WordPopper.vue'
import type { MyClientRect } from '@/utils/types'

defineOptions({ name: 'SelectionPopper' })
const props = defineProps<Props>()
interface Props {
  triggerMode: string
  bingTranslateEnable: boolean
  clientRect: MyClientRect
  content: string
}
const reference = ref({
  getBoundingClientRect: () => {
    return props.clientRect
  },
})
const floating = ref(null)
const { x, y, strategy, update } = useFloating(reference, floating, {
  placement: 'bottom-start',
  middleware: [offset(10), flip(), shift()],
})

const showIcon = ref(false)
// const showWordInfo = ref(false)
const iconSrc = ref(browser.runtime.getURL('/icon.png'))
// const target = ref(null)
type Fn = (val: boolean) => void
const setPopuped = inject('setPopuped') as Fn
// 比较鼠标位置是否在矩形内
function isPointerInRect(event: PointerEvent, rect: MyClientRect): boolean {
  const pointerX = event.clientX
  const pointerY = event.clientY
  return (
    pointerX >= rect.left
    && pointerX <= rect.right
    && pointerY >= rect.top
    && pointerY <= rect.bottom
  )
}
onClickOutside(floating, (event) => {
  if (isPointerInRect(event, props.clientRect)) {
    console.log('pointer in rect')
    return
  }
  setPopuped(false)
})

onMounted(() => {
  console.log('props.triggerMode', props.triggerMode)
  if (props.triggerMode === 'showIcon')
    showIcon.value = true
})
function isChineseWord(str: string) {
  return str.length <= 8
    && str.split('').every(char => /\p{Script=Han}/u.test(char))
}
function isEnglishWord(str: string) {
  const englishWordRegex = /^[a-zA-Z\\-]+$/
  return englishWordRegex.test(str)
}
function setup() {
  console.log('setup')
  reference.value = {
    getBoundingClientRect() {
      return props.clientRect
    },
  }
}

onMounted(() => {
  setup()
})
const showWordPopper = ref(false)
function popupWordWebuiPopover(word: string) {
  console.log('popupWordWebuiPopover', word)
  showWordPopper.value = true
  showIcon.value = false
  update()
}
function popupPhraseWebuiPopover(phrase: string) {
  console.log('popupPhraseWebuiPopover', phrase)
}
function onClick() {
  if (isChineseWord(props.content) || isEnglishWord(props.content))
    popupWordWebuiPopover(props.content)
  else if (props.bingTranslateEnable)
    popupPhraseWebuiPopover(props.content)
}
</script>

<template>
  <div ref="floating" :style="{ position: strategy, top: `${y}px`, left: `${x}px` }" style="position: absolute; z-index: 9999;">
    <!-- icon 区域 -->
    <div v-if="showIcon" name="__baicizhanHelperIconTips__" @click="onClick">
      <div style="width: 25px; height: 25px;">
        <img v-if="showIcon" :src="iconSrc" style="max-width: 25px; border-radius: 5px; opacity: 0.8; cursor: pointer;">
      </div>
    </div>
    <!-- 单词区域 -->
    <WordPopper v-if="showWordPopper" />
    <!-- bing翻译 -->
  </div>
</template>
