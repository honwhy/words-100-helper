<script setup lang="ts">
import { inject } from 'vue'
import type { SimilarWord } from '@/utils/models'

defineOptions({ name: 'SimilarWords' })
defineProps<Props>()
interface Props {
  data: SimilarWord[]
}
type Fn = (topicId: number) => void
const refreshWordDetail = inject('refreshWordDetail') as Fn
</script>

<template>
  <div v-if="data.length > 0" class="section">
    <p class="section-title">
      形近词
    </p>
    <p class="p-words">
      <span v-for="similarWord in data" :key="similarWord.topic_id">
        <a
          href="#" tabIndex="-1" :data-topic-id="similarWord.topic_id"
          @click="refreshWordDetail(similarWord.topic_id)"
        >{{ similarWord.word }}</a>
        &nbsp;&nbsp;
      </span>
    </p>
  </div>
</template>

<style lang="scss" scoped>
div {
  display: block;
}
</style>
