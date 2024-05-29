<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { isNil } from 'lodash-es'
import { useVModel } from '@vueuse/core'
import { ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/es/components/message/style/css' // 引入 ElMessage 的样式
import 'element-plus/es/components/message-box/style/css' // 引入 ElMessageBox 的样式
import Variants from './Variants.vue'
import Sentences from './Sentences.vue'
import starFill from '/svgs/star-fill.svg'
import star from '/svgs/star.svg'
import volumeup from '/svgs/volume-up.svg'
import ShortPhrases from './ShortPhrases.vue'
import Synonyms from './Synonyms.vue'
import Antonyms from './Antonyms.vue'
import SimilarWords from './SimilarWords.vue'
import EnglishParaphrases from './EnglishParaphrases.vue'
import type { WordDetail } from '@/utils/models'
import { cancelCollectWord, collectWord } from '@/utils/api'
import storageModule from '@/utils/storages'
import type { Settings } from '@/utils/types'
import { defaultWordDetailSettings } from '@/utils/config'

defineOptions({ name: 'WordDetail' })
const props = withDefaults(defineProps<Props>(), {
  showIcon: true,
})
interface Props {
  data: WordDetail
  showIcon?: boolean
  videoUrl?: string
}
const baseData = useVModel(props, 'data')
const basicInfo = computed(() => {
  return baseData.value.dict.word_basic_info
})
const starIconSvg = computed(() => {
  return basicInfo.value?.__collected__ ? starFill : star
})
function favoriteWord() {
  console.log('on favorite word', props.data)
  const fn = basicInfo.value?.__collected__ ? cancelCollectWord : collectWord
  const tips = basicInfo.value?.__collected__ ? '取消收藏' : '收藏'

  fn(baseData.value.dict).then((response: unknown) => {
    if (response != null) {
      baseData.value.dict.word_basic_info.__collected__ = !baseData.value.dict.word_basic_info.__collected__
      ElMessage({
        type: 'success',
        message: `${tips}成功`,
      })
      return
    }

    console.log(`${tips}失败`)
  })
    .catch((e: any) => {
      console.error(`${tips}异常`, e)
      ElMessageBox.confirm(
        `${tips}异常，请重新登录`,
        '提示',
        {
          confirmButtonText: '去登录',
          cancelButtonText: '关闭',
          type: 'warning',
          center: true,
        },
      )
        .then(() => {
          browser.runtime.openOptionsPage()
        })
        .catch(() => {})
    })
}
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
function handleKeydown(event: KeyboardEvent) {
  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 's')
    favoriteWord()
}
const settings = ref<Settings>(defaultWordDetailSettings)
function loadSettings() {
  storageModule.get('wordDetail')
    .then((wordDetailSettings) => {
      const settings1 = wordDetailSettings
        ? Object.assign(defaultWordDetailSettings, wordDetailSettings)
        : defaultWordDetailSettings
      settings.value = settings1 as Settings
    })
}
onMounted(() => {
  loadSettings()
})
</script>

<template>
  <div id="detailDiv">
    <div class="section">
      <span class="word">{{ basicInfo?.word }}</span>
      <span v-show="showIcon" id="starIcon" class="star" @click.stop="favoriteWord" @keydown="handleKeydown">
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
    <Variants v-if="data.dict.variant_info && settings.variantDisplay" :data="data.dict.variant_info" />
    <Sentences v-if="data.dict.sentences && settings.sentenceDisplay" :data="data.dict.sentences" :word="basicInfo.word" />
    <ShortPhrases v-if="data.dict.short_phrases && settings.shortPhrasesDisplay" :data="data.dict.short_phrases" />
    <Synonyms v-if="data.dict.synonyms && settings.synonymsDisplay" :data="data.dict.synonyms" />
    <Antonyms v-if="data.dict.antonyms && settings.antonymsDisplay" :data="data.dict.antonyms" />
    <SimilarWords v-if="data.similar_words && settings.similarWordsDisplay" :data="data.similar_words" />
    <EnglishParaphrases v-if="data.dict.en_means && settings.englishParaphraseDisplay" :data="data.dict.en_means" />
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
