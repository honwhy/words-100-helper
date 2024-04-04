<script setup lang="ts">
import { isNil } from 'lodash-es'
import { computed } from 'vue'
import type { EnglishMean } from '@/utils/models'

defineOptions({ name: 'EnglishParaphrases' })
const props = defineProps<Props>()
interface Props {
  data: EnglishMean[]
}
const englishMeans = computed(() => {
  const dataMap: Record<string, string[]> = {}
  props.data.forEach((it) => {
    let array = dataMap[it.mean_type]
    if (isNil(array))
      array = []
    array.push(it.mean)
    dataMap[it.mean_type] = array
  })
  return dataMap
})
</script>

<template>
  <div v-if="data.length > 0" class="section">
    <p class="section-title">
      英文释义
    </p>
    <template v-for="(v, k) in englishMeans" :key="k">
      <span class="badge bg-primary" style="color: white;">{{ k }}</span><br>
      <ul style="padding-left: 15px;">
        <template v-for="m in v" :key="m">
          <li>{{ m }}</li>
        </template>
      </ul>
    </template>
  </div>
</template>
