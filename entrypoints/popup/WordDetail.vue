<script lang="ts" setup>
import { computed, ref } from 'vue'
import { isNil } from 'lodash-es'
import Variants from './components/Variants.vue'
import Sentences from './components/Sentences.vue'
import starFill from '/svgs/star-fill.svg'
import star from '/svgs/star.svg'
import volumeup from '/svgs/volume-up.svg'
import ShortPhrases from './components/ShortPhrases.vue'
import Synonyms from './components/Synonyms.vue'
import Antonyms from './components/Antonyms.vue'
import SimilarWords from './components/SimilarWords.vue'
import EnglishParaphrases from './components/EnglishParaphrases.vue'
import type { WordDetail } from '@/utils/models'

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
    <ShortPhrases :data="data.dict.short_phrases" />
    <Synonyms :data="data.dict.synonyms" />
    <Antonyms :data="data.dict.antonyms" />
    <SimilarWords :data="data.similar_words" />
    <EnglishParaphrases :data="data.dict.en_means" />
  </div>
</template>

<style scoped lang="scss">
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
.volume-up {
  cursor: pointer;
  font-size: large;
}
.means-table {
  table-layout: auto;
  border-collapse: separate;
  border-spacing: 0 8px;
}
</style>
