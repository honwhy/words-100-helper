<script setup lang="ts">
import type { ShortPhrase } from '@/utils/models'

defineOptions({ name: 'ShortPhrases' })
defineProps<Props>()
interface Props {
  data: ShortPhrase[]
}
</script>

<template>
  <div v-if="data.length > 0" class="section">
    <p class="section-title">
      短语
    </p>
    <ul style="padding-left: 15px;">
      <li v-for="shortPhrase in data" :key="shortPhrase.id">
        <span>{{ shortPhrase.short_phrase }}</span>
        <p style="margin-bottom: 2px; color: #6a6d71;">
          {{ shortPhrase.short_phrase_trans }}
        </p>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
ol,
ul,
dl {
  margin-top: 0;
  margin-bottom: 1rem;
}
</style>
