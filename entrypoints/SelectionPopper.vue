<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import type { ElPopper } from 'element-plus'
import { ElMessage } from 'element-plus'
import { cloneDeep, isEmpty } from 'lodash-es'
import { stemmer } from 'stemmer'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import WordPopper from './WordPopper.vue'
import PhrasePopover from './PhrasePopover.vue'
import 'element-plus/es/components/message/style/css' // 引入 ElMessage 的样式
import 'element-plus/es/components/message-box/style/css' // 引入 ElMessageBox 的样式

defineOptions({ name: 'SelectionPopper' })
const props = defineProps<Props>()
interface Props {
  triggerMode: string
  showStyle: string
}
// 响应式变量
const popoverRef = ref<InstanceType<typeof ElPopper>>()
const selectedTextRef = ref<HTMLElement>()
const isPopoverVisible = ref(false)
const selectedText = ref('')

const showIcon = ref(false)
const showWordPopper = ref(false)
const showPhrasePopper = ref(false)
const showArrow = ref(false)
const holdingWidth = ref(15)
const bingTranslateEnable = ref(true)
// 展示icon还是直接展示翻译-根据配置来
// 如果是单词单字就采用百词斩翻译否则使用bing翻译
// bing翻译并没有用上
function handleSelection() {
  console.log('handleSelection')
  if (isPopoverVisible.value) {
    console.log('handleSelection=>still in the last on popper')
    return
  }
  if (isChineseWord(selectedText.value) || isEnglishWord(selectedText.value)) {
    if (props.triggerMode === 'showIcon') {
      showIcon.value = true
      showArrow.value = false
      holdingWidth.value = 15
      isPopoverVisible.value = true
    }
    else {
      popupWordWebuiPopover(selectedText.value)
    }
  }
  else if (bingTranslateEnable.value) {
    if (props.triggerMode === 'showIcon') {
      showIcon.value = true
      showArrow.value = false
      holdingWidth.value = 15
      isPopoverVisible.value = true
    }
    else {
      popupPhraseWebuiPopover(selectedText.value)
    }
  }
}
// 监听鼠标抬起事件以检测是否进行了文本选择
function handleMouseUp(event: MouseEvent) {
  event.stopPropagation()
  console.log('handleMouseUp', event)
  if (isPopoverVisible.value) {
    console.log('handleMouseUp=>still in the last on popper')
    return
  }
  const selection = window.getSelection()
  if (selection && selection.type === 'Range') {
    // 如果存在非空的选择范围
    const value = selection.toString().trim()
    if (isEmpty(value)) {
      console.log('selection is Empty')
      return
    }
    const range = selection!.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    selectedText.value = value
    selectedTextRef.value!.getBoundingClientRect = () => {
      // const selection = window.getSelection()
      // 考虑滚动偏移
      // rect.x += window.scrollX
      // rect.y += window.scrollY
      return rect
    }
    handleSelection()
  }
  else {
    // 无有效选择时，关闭弹窗
    // isPopoverVisible.value = false
    cleanup()
  }
}

// const showWordInfo = ref(false)
const iconSrc = ref(browser.runtime.getURL('/icon.png'))
// 在弹出层出现前更新其位置，确保跟随所选文本附近的鼠标位置
function onBeforeEnter() {
  console.log('onBeforeEnter', popoverRef, selectedTextRef)
  console.log('onBeforeEnter', showIcon.value, showWordPopper.value, selectedText.value)
}

// 弹出层消失后重置相关状态
function onBeforeLeave() {
  resetInner()
}

// 在组件挂载时添加必要的监听器
onMounted(() => {
  document.addEventListener('mouseup', handleMouseUp)
})

// 在组件卸载时移除监听器以避免内存泄漏
onUnmounted(() => {
  document.removeEventListener('mouseup', handleMouseUp)
})
function isChineseWord(str: string) {
  return str.length <= 8
    && str.split('').every(char => /\p{Script=Han}/u.test(char))
}
function isEnglishWord(str: string) {
  const englishWordRegex = /^[a-zA-Z\\-]+$/
  return englishWordRegex.test(str)
}

const dict = ref<Dict>()
interface Response { dict: Dict }
function sendRequest(option: { action: string, args: string }) {
  return new Promise((resolve, reject) => {
    browser.runtime.sendMessage(option).then((result: unknown) => {
      // 以 [Error]: 开头代表请求报错
      if (typeof result === 'string' && result.startsWith('[Error]:'))
        return reject(new Error(result.substring(8)))
      resolve(result)
    })
  })
}
const appendElement = computed(() => {
  return document.querySelector('words-100-helper')!.shadowRoot!.querySelector('body')
})
function popupWordWebuiPopover(word: string) {
  console.log('popupWordWebuiPopover', word)
  // 词干提取，如：words -> word
  // const stemWord = stemmer(word)

  sendRequest({ action: 'getWordInfo', args: word }).then((response) => {
    if (!response)
      return
    const data = response as Response
    dict.value = data.dict as Dict
    showIcon.value = false
    showArrow.value = true
    nextTick(() => {
      isPopoverVisible.value = true
      showWordPopper.value = true
      showArrow.value = true
      holdingWidth.value = 391
    })
  })
    .catch((e) => {
      console.error(e)
      // $supportElement.$el.css('display', 'none')
      // $supportElement.$el.trigger('baicizhanHelper:alert', ['查询失败，稍后再试'])
      ElMessage({
        message: '查询失败，稍后再试',
        type: 'warning',
        appendTo: appendElement.value!,
      })
    })
}
interface TranslateResponse {
  translation: string
}
const translation = ref('')
function popupPhraseWebuiPopover(phrase: string) {
  console.log('popupPhraseWebuiPopover', phrase)
  sendRequest({ action: 'translate', args: phrase }).then((response) => {
    if (!response)
      return
    const data = response as TranslateResponse
    translation.value = data.translation
    showIcon.value = false
    showArrow.value = true
    nextTick(() => {
      isPopoverVisible.value = true
      showPhrasePopper.value = true
      showArrow.value = true
      holdingWidth.value = 391
    })
  })
    .catch((e) => {
      console.error(e)
      // $supportElement.$el.css('display', 'none')
      // $supportElement.$el.trigger('baicizhanHelper:alert', ['查询失败，稍后再试'])
      ElMessage({
        message: '查询失败，稍后再试',
        type: 'warning',
        appendTo: appendElement.value!,
      })
    })
}
function onClick() {
  if (isChineseWord(selectedText.value) || isEnglishWord(selectedText.value))
    popupWordWebuiPopover(selectedText.value)
  else if (bingTranslateEnable.value)
    popupPhraseWebuiPopover(selectedText.value)
}
// 比较鼠标位置是否在矩形内
function isPointerInRect(event: PointerEvent, rect: DOMRect | undefined): boolean {
  if (rect === undefined)
    return false
  const pointerX = event.clientX
  const pointerY = event.clientY
  return (
    pointerX >= rect.left
    && pointerX <= rect.right
    && pointerY >= rect.top
    && pointerY <= rect.bottom
  )
}
function resetInner() {
  showIcon.value = false
  showWordPopper.value = false
  showPhrasePopper.value = false
  // selectedText.value = ''
  // selectedTextRef.value!.getBoundingClientRect = () => {
  //   const rect = document.body.getBoundingClientRect()
  //   const cloned = cloneDeep(rect)
  //   Object.assign(cloned, {
  //     x: 0,
  //     y: 0,
  //     top: 0,
  //     left: 0,
  //     bottom: 0,
  //     right: 0,
  //     width: 0,
  //     height: 0,
  //   })
  //   return cloned
  // }
}
function cleanup() {
  console.log('clean outside and cleanup')
  isPopoverVisible.value = false
}
const iconRef = ref<HTMLDivElement>()
const wordPopperRef = ref<HTMLDivElement>()
const phrasePopoverRef = ref<HTMLDivElement>()
onClickOutside(popoverRef, (event) => {
  if (selectedText.value === '')
    return
  if (isPointerInRect(event, selectedTextRef.value?.getBoundingClientRect())) {
    console.log('pointer on top of selected text')
    return
  }
  const iconElement = iconRef.value
  const rect = iconElement?.getBoundingClientRect()
  if (isPointerInRect(event, rect)) {
    console.log('pointer on top of icon element')
    return
  }
  const wordPopperElement = wordPopperRef.value
  const rect2 = wordPopperElement?.getBoundingClientRect()
  if (isPointerInRect(event, rect2)) {
    console.log('pointer on top of word popper element')
    return
  }
  const phrasePopoverElement = phrasePopoverRef.value
  const rect3 = phrasePopoverElement?.getBoundingClientRect()
  if (isPointerInRect(event, rect3)) {
    console.log('pointer on top of phrase popper element')
    return
  }
  cleanup()
})
</script>

<template>
  <!-- el-popover 组件 -->
  <el-popover
    ref="popoverRef"
    :visible="isPopoverVisible"
    placement="bottom-start"
    :popper-class="{ customPopperClass: showIcon }"
    :show-arrow="showArrow"
    :hide-after="0"
    transition="none"
    :width="holdingWidth"
    :teleported="false"
    style="overflow: hidden;"
    @before-enter="onBeforeEnter"
    @before-leave="onBeforeLeave"
  >
    <!-- icon 区域 -->
    <div v-if="showIcon" ref="iconRef" name="" @click="onClick">
      <div style="width: 25px; height: 25px;">
        <img :src="iconSrc" style="max-width: 25px; border-radius: 5px; opacity: 0.8; cursor: pointer;">
      </div>
    </div>
    <!-- 单词区域 -->
    <div v-if="showWordPopper && dict" ref="wordPopperRef">
      <WordPopper :data="dict" :show-style="showStyle" />
    </div>
    <!-- bing翻译 -->
    <div v-if="showPhrasePopper && translation" ref="phrasePopoverRef">
      <PhrasePopover :data="translation" />
    </div>
    <template #reference>
      <!-- 触发弹出层的元素 -->
      <span ref="selectedTextRef" style="display: none;">{{ selectedText }}</span>
    </template>
  </el-popover>
</template>
