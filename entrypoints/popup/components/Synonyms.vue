<script setup lang="ts">
import type { Synonym } from '@/utils/models'

interface Props {
  data: Synonym[]
}
defineOptions({ name: 'Synonyms' })
defineProps<Props>()
</script>

<template>
  <div v-if="data.length > 0" class="section">
    <p class="section-title">
      近义词
    </p>
    <p class="p-words">
      <span v-for="synonym in data" :key="synonym.syn_ant_topic_id">
        <a
          href="#" tabIndex="-1" :data-topic-id="synonym.syn_ant_topic_id"
        >{{ synonym.syn_ant }}</a>
        &nbsp;&nbsp;
      </span>
    </p>
  </div>
</template>
