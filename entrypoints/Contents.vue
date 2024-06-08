<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
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
const settingKey = 'local:baicizhan-helper.wordDetail'
const showKey = 'local:selected.translation'
const show = ref(true)
const shortcut = ref('')

onMounted(async () => {
  const val = await storage.getItem<Settings>(settingKey)
  shortcut.value = val?.translationShortcut ?? 'Ctrl+Alt+B'
  const val2 = await storage.getItem<boolean>(showKey)
  show.value = val2 ?? true
})
const unwatch = storage.watch<Settings>(settingKey, (newVal, oldVal) => {
  console.log('settingKey value changed:', { newVal, oldVal })
  if (newVal)
    settings.value = newVal
  shortcut.value = newVal?.translationShortcut ?? ''
})
const unwatch2 = storage.watch<boolean>(showKey, (newVal, oldVal) => {
  console.log('showKey value changed:', { newVal, oldVal })
  show.value = newVal ?? true
})
const shortcutKeys = computed(() => {
  const array = shortcut.value.split('+')
  return {
    ctrlKey: array.includes('Ctrl'),
    altKey: array.includes('Alt'),
    shiftKey: array.includes('Shift'),
    key: array.filter(t => !['Ctrl', 'Alt', 'Shift'].includes(t))?.[0] ?? '',
  }
})
function setupKeyEventListener() {
  document.addEventListener('keydown', async (event) => {
    // 检查快捷键组合，例如Ctrl+Alt+B
    console.log('key pressed, Ctrl, Alt, Shift, key', event.ctrlKey, event.altKey, event.shiftKey, event.key)
    console.log('settings', shortcutKeys.value, shortcut.value)
    if (event.ctrlKey === shortcutKeys.value.ctrlKey
      && event.altKey === shortcutKeys.value.altKey
      && event.shiftKey === shortcutKeys.value.shiftKey) {
      // 全等
      if (shortcutKeys.value.key) {
        if (shortcutKeys.value.key.toLocaleLowerCase() === event.key.toLocaleLowerCase())
          await storage.setItem(showKey, !show.value)
      }
      else {
        await storage.setItem(showKey, !show.value)
      }
    }
  })
}
onMounted(() => {
  loadSetting()
  setupKeyEventListener()
})
onUnmounted(() => {
  unwatch()
  unwatch2()
})
</script>

<template>
  <div id="__baicizhanHelper__lgelpdnoogahffdkigeeonhggglogabb">
    <SelectionPopper v-if="triggerMode !== 'never' && !hideTranslate && show" :trigger-mode="triggerMode" :show-style="showStyle" />
  </div>
</template>
