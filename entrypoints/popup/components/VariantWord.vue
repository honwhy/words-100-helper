<script lang="ts" setup>
import { inject } from 'vue'

defineOptions({
  name: 'VariantWord',
})
defineProps<Props>()
interface Props {
  title: string
  word: string
  topicId: number
}
const refreshWordDetail = inject('refreshWordDetail')
</script>

<template>
  <span style="color: #6a6d71;">{{ title }}</span> &nbsp;&nbsp;
  <a href="#" tabIndex="-1" :data-topic-id="topicId" @click="refreshWordDetail(topicId)">{{ word }}</a>
  <br>
</template>
