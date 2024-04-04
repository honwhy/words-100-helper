<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import refresh from '/svgs/refresh.svg'
import volumeup from '/svgs/volume-up.svg'
import levenshtein from 'js-levenshtein-esm'
import { stemmer } from 'stemmer'
import type { Sentence } from '@/utils/models'

defineOptions({ name: 'Sentences' })

const props = defineProps<Props>()
interface Props {
  word: string
  data: Sentence[]
}
const resourceDomain = 'https://7n.bczcdn.com'
const index = ref(0)
const sentence = computed(() => {
  return props.data[index.value % props.data.length]
})
const sentenceHtml = computed(() => {
  return highlight(sentence.value, props.word)
})
const phraseAudio = ref<HTMLAudioElement>()
function onPlay() {
  nextTick(() => {
    phraseAudio.value?.play()
  })
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
function refreshSentence() {
  index.value = index.value + 1
}
const sourceUrl = computed(() => {
  return resourceDomain + sentence.value.audio_uri
})
</script>

<template>
  <div v-if="data.length > 0" class="section">
    <p class="section-title">
      图文例句
      <img class="refresh-icon" :src="refresh" title="刷新例句" @click="refreshSentence">
    </p>
    <div id="sentenceDiv">
      <span v-html="sentenceHtml" />
      <span id="phreaseAccentIcon" class="volume-up" @click="onPlay">
        <img :src="volumeup">
      </span>
      <audio id="phraseAudio" ref="phraseAudio" style="display: none;" :src="sourceUrl"><source :src="sourceUrl"></audio>
      <br>
      <p style="color: #6a6d71;">
        {{ sentence.sentence_trans }}
      </p>
      <img style="max-width: 200px;" :src="resourceDomain + sentence.img_uri">
    </div>
  </div>
</template>

<style scoped lang="scss">
.refresh-icon {
  float: right;
  cursor: pointer;
  width: 20px;
  margin-right: 15px;
}
</style>
