<script setup lang="ts">
import { isEmpty } from 'lodash-es'
import { onMounted, provide, ref } from 'vue'
import SelectionPopper from './SelectionPopper.vue'

defineOptions({ name: 'Contents' })
const TRIGGER_MODE = { SHOW_ICON: 'showIcon', DIRECT: 'direct', NEVER: 'never' }
const defaultTriggerMode = TRIGGER_MODE.SHOW_ICON
const triggerMode = ref(defaultTriggerMode)
// 选中文字的部分
const clientRect = ref<MyClientRect>({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  height: 0,
  width: 0,
  x: 0,
  y: 0,
})
// 是否正在弹窗中
const popuped = ref(false)
const show = ref(false)
function setPopuped(value: boolean) {
  popuped.value = value
  if (!value)
    show.value = false
}
provide('setPopuped', setPopuped)

const bingTranslateEnable = ref(false)
function prepopup() {
  const selection = window.getSelection()
  const range = selection!.getRangeAt(0)
  const rect = range.getBoundingClientRect()
  // 考虑滚动偏移
  rect.x += window.scrollX
  rect.y += window.scrollY
  clientRect.value = rect
  show.value = true
}
const content = ref('')
async function selectWordHandler(e: MouseEvent) {
  e.preventDefault()

  // if event not left click, omit
  if (e.which !== 1)
    return
  if (popuped.value)
    return
  const selectedContent = window.getSelection()?.toString().trim() ?? ''

  if (isEmpty(selectedContent) || selectedContent.length > 300)
    return
  content.value = selectedContent
  // 计算弹窗位置
  prepopup()
}

onMounted(() => {
  window.addEventListener('mouseup', selectWordHandler)
})
</script>

<template>
  <div id="__baicizhanHelperSupportDiv__">
    <SelectionPopper
      v-if="show"
      :client-rect="clientRect"
      :trigger-mode="triggerMode"
      :bing-translate-enable="bingTranslateEnable"
      :content="content"
    />
  </div>
</template>
