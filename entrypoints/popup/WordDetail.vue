<script lang="ts" setup>
import { computed, ref } from 'vue'
import { isNil } from 'lodash-es'
import Variants from './components/Variants.vue'
import Sentences from './components/Sentences.vue'
import type { WordDetail } from '@/utils/models'
import starFill from '/svgs/star-fill.svg'
import star from '/svgs/star.svg'
import volumeup from '/svgs/volume-up.svg'

defineOptions({ name: 'WordDetail' })
const props = withDefaults(defineProps<Props>(), {
  showIcon: true,
})
interface Props {
  data: WordDetail
  showIcon?: boolean
}
const basicInfo = computed(() => {
  return props.data.dict.word_basic_info
})
const starIconSvg = computed(() => {
  return basicInfo.value?.__collected__ ? starFill : star
})

const resourceDomain = 'https://7n.bczcdn.com'
const accentUkAudio = ref<HTMLAudioElement>()
const accentUsaAudio = ref<HTMLAudioElement>()
function playUk() {
  accentUkAudio.value!.play()
}
function playUsa() {
  accentUsaAudio.value!.play()
}
const chineseMeans = computed(() => {
  const dataMap: Record<string, string[]> = {}
  props.data.dict.chn_means.forEach((it) => {
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
  <div id="detailDiv">
    <div class="section">
      <span class="word">{{ basicInfo?.word }}</span>
      <span v-if="showIcon" id="starIcon" class="star">
        <img :src="starIconSvg">
      </span>
      <br>
      <span class="badge bg-info" style="color: white;">英</span>
      <span>{{ data.dict.word_basic_info.accent_uk }}</span>
      <span id="accentUkIcon" class="volume-up" @click="playUk">
        <img :src="volumeup">
      </span>
      <audio id="accentUkAudio" ref="accentUkAudio" style="display: none;">
        <source :src="resourceDomain + basicInfo.accent_uk_audio_uri">
      </audio>
      <template v-if="basicInfo.accent_uk !== basicInfo.accent_usa">
        <span class="badge bg-info" style="color: white;">美</span>
        <span>{{ basicInfo.accent_usa }}</span>
        <span id="accentUsaIcon" class="volume-up" @click="playUsa">
          <img :src="volumeup">
        </span>
        <audio id="accentUsaAudio" ref="accentUsaAudio" style="display: none;">
          <source :src="resourceDomain + basicInfo.accent_usa_audio_uri">
        </audio>
      </template>
      <table class="means-table">
        <tr v-for="(v, k) in chineseMeans" :key="k">
          <td><span class="badge bg-primary" style="color: white;">{{ k }}</span></td>
          <td>{{ v.join(';') }}</td>
        </tr>
      </table>
    </div>
    <Variants :data="data.dict.variant_info" />
    <Sentences :data="data.dict.sentences" :word="basicInfo.word" />
  </div>
</template>

<style scoped lang="scss">
.section {
  max-width: 450px;
  margin-bottom: 1rem;
  border: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.word {
  font-size: x-large;
  font-weight: bolder;
}
.star {
  cursor: pointer;
  float: right;
  margin-right: 10px;
}
.bg-info {
  background-color: #17a2b8 !important;
}
.badge {
  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}
.volume-up {
  cursor: pointer;
  font-size: large;
}
.means-table {
  table-layout: auto;
  border-collapse: separate;
  border-spacing: 0 8px;
}
.bg-primary {
  background-color: #007bff !important;
}
</style>
