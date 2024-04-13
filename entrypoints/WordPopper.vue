<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/es/components/message/style/css' // 引入 ElMessage 的样式
import 'element-plus/es/components/message-box/style/css' // 引入 ElMessageBox 的样式
import { cloneDeep, isNil } from 'lodash-es'
import levenshtein from 'js-levenshtein-esm'
import { stemmer } from 'stemmer'
import { useVModel } from '@vueuse/core'
import type { Dict } from '@/utils/models'

defineOptions({ name: 'WordPopper' })
const props = defineProps<Props>()
interface Props {
  data: Dict
  showStyle: string
}
const baseData = useVModel(props, 'data')
const starFill = ref(browser.runtime.getURL('/svgs/star-fill.svg'))
const star = ref(browser.runtime.getURL('/svgs/star.svg'))
const volumeup = ref(browser.runtime.getURL('/svgs/volume-up.svg'))
const svg = computed(() => {
  return props.data.word_basic_info.__collected__ ? starFill.value : star.value
})
const chineseMeans = computed(() => {
  const dataMap: Record<string, string[]> = {}
  props.data.chn_means.forEach((it) => {
    let array = dataMap[it.mean_type]
    if (isNil(array))
      array = []
    array.push(it.mean)
    dataMap[it.mean_type] = array
  })
  return dataMap
})
const sentence = computed(() => {
  if (props.showStyle === 'simple')
    return null

  const element = props.data.sentences[0]
  if (isNil(element))
    return null

  return element
})
function favoriteWord() {
  console.log('on favorite word', props.data)
  const fn = props.data.word_basic_info?.__collected__ ? 'cancelCollectWord' : 'collectWord'
  const tips = props.data.word_basic_info?.__collected__ ? '取消收藏' : '收藏'
  const args = cloneDeep(props.data)
  const option = { action: fn, args }
  browser.runtime.sendMessage(undefined, option)
    .then((result) => {
      console.log('result', result, tips, baseData.value)
      baseData.value.word_basic_info.__collected__ = !baseData.value.word_basic_info.__collected__
      ElMessage.success(`${tips}成功`)
    })
    .catch((e) => {
      console.error(`${tips}异常`, e)
      ElMessageBox.confirm(
        `${tips}异常，请重新登录`,
        'Warning',
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

  // fn(props.data).then((response: unknown) => {
  //   if (response != null)
  //     baseData.value.word_basic_info.__collected__ = !baseData.value.word_basic_info.__collected__

  //   console.log(`${tips}失败`)
  // })
  //   .catch((e: any) => console.error(`${tips}异常`, e))
}
function highlight(sentence: Sentence, word: string) {
  if (sentence.highlight_phrase) {
    return sentence.sentence.replace(
      sentence.highlight_phrase,
      `<span style="color: #007bff;">${sentence.highlight_phrase}</span>`,
    )
  }

  const stemWord = stemmer(word)
  const highlightWord = sentence.sentence.split(/\s/)
    .map((s) => {
      const regex = /[\w-]+/

      if (regex.test(s)) {
        const term = s.match(regex)?.[0]
        const distance = levenshtein(term!, stemWord)
        const highlightable = term!.length < 7 ? distance <= 3 : distance <= 5

        if (highlightable)
          return [distance, term]
      }

      return null
    })
    .filter(pair => pair !== null)
    .reduce((a, b) => a![0]! < b![0]! ? a : b)

  if (!highlightWord)
    return sentence.sentence

  const replaceRegex = new RegExp(`\\b${highlightWord[1]}\\b`, 'g')

  return sentence.sentence.replace(replaceRegex, (match) => {
    return `<span style="color: #007bff;">${match}</span>`
  })
}
const sentenceHtml = computed(() => {
  if (isNil(sentence.value))
    return ''
  return highlight(sentence.value, props.data.word_basic_info.word)
})
const resourceDomain = 'https://7n.bczcdn.com'
const accentUkAudio = ref<HTMLAudioElement>()
const accentUsaAudio = ref<HTMLAudioElement>()
const sentenceAudio = ref<HTMLAudioElement>()
</script>

<template>
  <div class="webui-popover translate-content">
    <div class="webui-popover-inner">
      <a href="#" class="close" />
      <h3 class="webui-popover-title">
        <p class="title">
          <span class="word">{{ data.word_basic_info.word }}</span>
          <span id="starIcon" class="star" @click.stop="favoriteWord">
            <img :src="svg">
          </span>
        </p>
        <p class="accent">
          英&nbsp;{{ data.word_basic_info.accent_uk }}
          <span id="accentUkIcon" class="sound-size" @click.stop="accentUkAudio?.play()"><img :src="volumeup"></span>
          <audio id="accentUkAudio" ref="accentUkAudio" style="display: none;">
            <source :src="resourceDomain + data.word_basic_info.accent_uk_audio_uri">
          </audio>
          <template v-if="data.word_basic_info.accent_usa !== data.word_basic_info.accent_uk">
            美&nbsp;{{ data.word_basic_info.accent_usa }}
            <span id="accentUsaIcon" class="sound-size" @click.stop="accentUsaAudio?.play()"><img :src="volumeup"></span>
            <audio id="accentUsaAudio" ref="accentUsaAudio" style="display: none;">
              <source :src="resourceDomain + data.word_basic_info.accent_usa_audio_uri">
            </audio>
          </template>
        </p>
      </h3>
      <div class="webui-popover-content" style="min-width: 360px;">
        <table class="means-table">
          <tr v-for="(v, k) in chineseMeans" :key="k">
            <td class="data-cell-first">
              {{ k }}
            </td>
            <td>{{ v.join(';&nbsp;') }}</td>
          </tr>
        </table>
        <div v-if="sentence" class="sentence">
          <img class="sentence-img" :src="resourceDomain + sentence.img_uri">
          <p class="sentence-p">
            <span v-html="sentenceHtml" />
            <span id="sentenceIcon" class="sound-size" @click.stop="sentenceAudio?.play()">
              <img :src="volumeup">
            </span>
            <audio id="sentenceAudio" ref="sentenceAudio" style="display: none;">
              <source :src="resourceDomain + sentence.audio_uri">
            </audio>
          </p>
          <p class="sentence-p">
            {{ sentence.sentence_trans }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import url('./webui-popper.scss');
.translate-content {
  min-width: 240px;
}

.title {
  margin-bottom: 0px;
}

.word {
  color: black;
  font-size: 18px;
  line-height: 18px;
  font-weight: 700;
}

.accent {
  font-size: small;
  color: #606266;
  margin-top: 2px;
  white-space: nowrap;
  font-size: 14px;
}

.star {
  float: right;
  cursor: pointer;
  font-size: large;
}

.sound-size {
  cursor: pointer;
}

.means-table {
  table-layout: auto;
  border-collapse: separate;
  border-spacing: 0 2px;
}

.data-cell-first {
  text-align: left;
  min-width: 40px;
  padding-right: 5px;
  color: #636363;
  font-style: italic;
  font-weight: 400;
  font-size: 14px;
}

.data-cell {
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  font-size: 14px;
  font-weight: 400;
  color: black;
}

.sentence {
  padding-top: 2px;
}

.sentence-img {
  width: 180px;
}

.sentence-p {
  margin: 3px 0;
  font-size: 14px;
  font-weight: 400;
  color: black;
}
</style>
