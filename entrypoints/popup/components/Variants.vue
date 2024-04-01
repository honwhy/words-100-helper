<script setup lang="ts">
import VariantWord from './VariantWord.vue'
import type { VariantInfo } from '@/utils/models'

defineOptions({ name: 'Variants' })
defineProps<{
  data: VariantInfo
}>()
</script>

<template>
  <div class="section">
    <p class="section-title">
      单词变形
    </p>
    <VariantWord v-show="data.noun" title="名词" :word="data.noun" :topic-id="data.noun_topic_id" />
    <VariantWord v-show="data.verb" title="动词" :word="data.verb" :topic-id="data.verb_topic_id" />
    <VariantWord v-show="data.adj" title="形容词" :word="data.adj" :topic-id="data.adj_topic_id" />
    <VariantWord v-show="data.pl" title="复数" :word="data.pl" :topic-id="data.pl_topic_id" />
    <VariantWord v-show="data.adv" title="副词" :word="data.adv" :topic-id="data.adv_topic_id" />
    <VariantWord v-show="data.est" title="现在分词" :word="data.est" :topic-id="data.est_topic_id" />
    <VariantWord v-show="data.done" title="过去分词" :word="data.done" :topic-id="data.done_topic_id" />
    <VariantWord v-show="data.past" title="过去式" :word="data.past" :topic-id="data.past_topic_id" />
    <VariantWord v-show="data.third" title="第三人称单数" :word="data.third" :topic-id="data.thrid_topic_id" />
    <VariantWord v-show="data.er" title="比较级" :word="data.er" :topic-id="data.er_topic_id" />
  </div>
</template>
