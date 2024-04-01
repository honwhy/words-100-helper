<script lang="ts" setup>
import Variants from './components/Variants.vue'
import type { Dict } from '@/utils/models'

defineOptions({ name: 'WordDetail' })

defineProps<{
  data: Dict
}>()
</script>

<template>
  <div id="detailDiv">
    <div class="section">
      <span class="word">{{ data.word_basic_info?.word }}</span>
      <!-- <span id="starIcon" class="star" style="display: ${showIcon ? 'block' : 'none'}">
        <img src="../svgs/${starIconSvg}">
      </span> -->
      <br>
    </div>
    <Variants :data="data.variant_info" />
  </div>
</template>
