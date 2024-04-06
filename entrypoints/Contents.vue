<script setup lang="ts">
import { ref } from 'vue'
import SelectionPopper from './SelectionPopper.vue'

defineOptions({ name: 'Contents' })
const TRIGGER_MODE = { SHOW_ICON: 'showIcon', DIRECT: 'direct', NEVER: 'never' }
const defaultTriggerMode = TRIGGER_MODE.SHOW_ICON
const triggerMode = ref(defaultTriggerMode)
const showStyle = ref('')
// const bingTranslateEnable = ref(false)
</script>

<template>
  <div id="__baicizhanHelperSupportDiv__">
    <SelectionPopper v-if="triggerMode !== 'never'" :trigger-mode="triggerMode" :show-style="showStyle" />
  </div>
</template>
