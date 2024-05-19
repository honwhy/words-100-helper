<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { URLPattern } from 'urlpattern-polyfill'
import SelectionPopper from './SelectionPopper.vue'
import type { Settings } from '@/utils/types'

defineOptions({ name: 'Contents' })
const TRIGGER_MODE = { SHOW_ICON: 'showIcon', DIRECT: 'direct', NEVER: 'never' }
const defaultTriggerMode = TRIGGER_MODE.SHOW_ICON
const triggerMode = ref(defaultTriggerMode)
const showStyle = ref('')
const settings = ref<Settings>(defaultWordDetailSettings)
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
    args: ['triggerMode', 'popoverStyle', 'theme', 'bingTranslateEnable', 'wordDetail'],
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
      settings.value = data[4] != null && data[4].value != null ? (data[4].value as Settings) : defaultWordDetailSettings
    })
}
function tryMatch() {
  const url = window.location.href
  console.log('url', url)
  const item = settings.value.blacklist.split('\n').map(it => it.trim()).find((it2) => {
    if (/^http(s)?:/.test(it2)) {
      console.log('http(s)')
      return new URLPattern(it2).test(url)
    }
    const a = (it2 as string).split('/')
    console.log('hostname,pathname', a)
    if (a.length >= 2) {
      const hostname = a[0]
      const pathname = (it2 as string).replace(hostname, '')
      return new URLPattern({ hostname, pathname }).test(url)
    }
    else {
      const pattern = new URLPattern({ hostname: it2 })
      return pattern.test(url)
    }
  })
  return item != null
}
const hideTranslate = computed(() => {
  return tryMatch()
})
onMounted(() => {
  loadSetting()
})
</script>

<template>
  <div id="__baicizhanHelper__lgelpdnoogahffdkigeeonhggglogabb">
    <SelectionPopper v-if="triggerMode !== 'never' && !hideTranslate" :trigger-mode="triggerMode" :show-style="showStyle" />
  </div>
</template>
