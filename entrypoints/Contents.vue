<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SelectionPopper from './SelectionPopper.vue'

defineOptions({ name: 'Contents' })
const TRIGGER_MODE = { SHOW_ICON: 'showIcon', DIRECT: 'direct', NEVER: 'never' }
const defaultTriggerMode = TRIGGER_MODE.SHOW_ICON
const triggerMode = ref(defaultTriggerMode)
const showStyle = ref('')
// const bingTranslateEnable = ref(false)
function sendRequest(option: { action: string, args: string[] }) {
  return new Promise((resolve, reject) => {
    browser.runtime.sendMessage(undefined, option)
      .then((result) => {
        if (typeof result === 'string' && result.startsWith('[Error]:'))
          return reject(new Error(result.substring(8)))
        resolve(result)
      })
      .catch(reject)
  })
}
interface Compo {
  key: string
  value: unknown
}
async function loadSetting() {
  return sendRequest({
    action: 'getStorageInfo',
    args: ['triggerMode', 'popoverStyle', 'theme', 'bingTranslateEnable'],
  })
    .then((res) => {
      console.log('loadSetting', res)
      const data = res as Compo[]
      triggerMode.value = data[0] != null && data[0].value != null ? (data[0].value as string) : defaultTriggerMode
      showStyle.value = data[1] != null && data[1].value != null ? (data[0].value as string) : 'simple'
      // theme = _theme || defaultTheme
      // bingTranslateEnable = _bingTranslateEnable || false

      // if (theme == THEME.AUTO) {
      //   const isSystemDarkTheme = window.matchMedia
      //     && window.matchMedia('(prefers-color-scheme: dark)').matches

      //   theme = isSystemDarkTheme ? THEME.DARK : THEME.LIGHT
      // }
    })
}
onMounted(() => {
  loadSetting()
})
</script>

<template>
  <div id="__baicizhanHelperSupportDiv__">
    <SelectionPopper v-if="triggerMode !== 'never'" :trigger-mode="triggerMode" :show-style="showStyle" />
  </div>
</template>
