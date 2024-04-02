<script lang="ts" setup>
import Variants from './components/Variants.vue'
import type { WordDetail } from '@/utils/models'

defineOptions({ name: 'WordDetail' })

defineProps<{
  data: WordDetail
}>()
</script>

<template>
  <div id="detailDiv">
    <div class="section">
      <span class="word">{{ data.dict.word_basic_info?.word }}</span>
      <!-- <span id="starIcon" class="star" style="display: ${showIcon ? 'block' : 'none'}">
        <img src="../svgs/${starIconSvg}">
      </span> -->
      <br>
    </div>
    <Variants :data="data.dict.variant_info" />
  </div>
</template>
