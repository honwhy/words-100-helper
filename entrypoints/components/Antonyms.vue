<script setup lang="ts">
import { inject } from 'vue'
import type { Antonym } from '@/utils/models'

interface Props {
  data: Antonym[]
}
defineOptions({ name: 'Antonyms' })
defineProps<Props>()
  type Fn = (topicId: number) => void
const refreshWordDetail = inject('refreshWordDetail') as Fn
</script>

<template>
  <div v-if="data.length > 0" class="section">
    <p class="section-title">
      反义词
    </p>
    <p class="p-words">
      <span v-for="antonym in data" :key="antonym.syn_ant_topic_id">
        <a
          href="#" tabIndex="-1" :data-topic-id="antonym.syn_ant_topic_id"
          @click="refreshWordDetail(antonym.syn_ant_topic_id)"
        >{{ antonym.syn_ant }}</a>
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
