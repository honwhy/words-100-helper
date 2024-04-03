<script lang="ts" setup>
import { inject } from 'vue'

defineOptions({
  name: 'VariantWord',
})
defineProps<Props>()
interface Props {
  title: string
  word: string | null
  topicId: number
}
type Fn = (topicId: number) => void
const refreshWordDetail = inject('refreshWordDetail') as Fn
</script>

<template>
  <div>
    <span style="color: #6a6d71;">{{ title }}</span> &nbsp;&nbsp;
    <a href="#" tabIndex="-1" :data-topic-id="topicId" @click="refreshWordDetail(topicId)">{{ word }}</a>
    <br>
  </div>
</template>
