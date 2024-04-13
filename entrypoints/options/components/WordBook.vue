<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import WordDetailComp from '../../components/WordDetail.vue'
import { useWordBook } from './hooks'
import EventBus from '@/utils/eventBus'
import Events from '@/utils/events'
import storageModule from '@/utils/storages'
import WordbookStorage from '@/utils/wordbook-storage'
import { cancelCollectWordById, getBookWords, getWordDetail } from '@/utils/api'

defineOptions({ name: 'WordBook' })
const resourceDomain = 'https://7n.bczcdn.com'
const refresh = ref(browser.runtime.getURL('/svgs/refresh.svg'))
const englishMasked = ref(false)
const meansMasked = ref(true)
const searchMeanStyle = computed(() => {
  return {
    background: meansMasked.value ? '#6a6d71' : 'none',
  }
})
type Keys = 'collectTimeAscOrder' | 'collectTimeDescOrder' | 'firstLettersAscOrder' | 'firstLettersDescOrder'
type SortFn = () => number
const sortFns = {
  collectTimeAscOrder: (a: { created_at: number }, b: { created_at: number }) => a.created_at - b.created_at,
  collectTimeDescOrder: (a: { created_at: number }, b: { created_at: number }) => b.created_at - a.created_at,
  firstLettersAscOrder: (a: { word: string }, b: { word: string }) => {
    const aWord = a.word.toLowerCase()
    const bWord = b.word.toLowerCase()

    return aWord.charAt(0) > bWord.charAt(0) ? 1 : -1
  },
  firstLettersDescOrder: (a: { word: string }, b: { word: string }) => {
    const aWord = a.word.toLowerCase()
    const bWord = b.word.toLowerCase()

    return bWord.charAt(0) > aWord.charAt(0) ? 1 : -1
  },
} as Record<Keys, SortFn>

// interface UserBook {
//   user_book_id: string
//   book_name: string
//   word_num: number
// }
// interface UserBooks {
//   user_books: UserBook[]
// }
const { selectedBookId, options } = useWordBook()
// const selectedBookId = ref(0)
// onMounted(async () => {
//   const id = await storageModule.get('bookId')
//   selectedBookId.value = id as number
// })
// const options = ref<LabelOption[]>([])
// async function generateWordbooks(res: unknown) {
//   const data = res as UserBooks
//   options.value = data.user_books.map(book => ({
//     value: book.user_book_id,
//     label: `${book.book_name}(已收录 ${book.word_num} 词)`,
//   }))
// }
function loadFromServer(bookId: number) {
  return getBookWords(bookId).then((data) => {
    WordbookStorage.save(bookId, data)

    return data
  })
}

function loadFromLocal(bookId: number) {
  return WordbookStorage.load(bookId)
}
const order = ref('collectTimeDescOrder')
interface MyWord {
  word: string
  created_at: number
  topic_id: number
  mean: string
  audio_uk: string
}
const words = ref<MyWord[]>([])
function generateWordbookTable(res: unknown) {
  // let englishMasked = $('#maskEnglishButton').prop('checked');
  // let meansMasked = $('#maskMeanButton').prop('checked');
  const data = res as MyWord[]
  const sortFn = sortFns[order.value as Keys] || sortFns.collectTimeDescOrder

  data.sort(sortFn)
  words.value = data
//   data.forEach((item, index) => generateWordRow(item, $tbody, index, englishMasked, meansMasked))
}
const loading = ref(false)
async function loadWordbookTable(focus: boolean) {
  const bookId = selectedBookId.value
    || await storageModule.get('bookId') || 0
  const id = bookId as number
  loading.value = true
  try {
    const wordbookData = focus
      ? await loadFromServer(id)
      : await loadFromLocal(id) || await loadFromServer(id)
    console.log('wordbookData', wordbookData)
    generateWordbookTable(wordbookData)
    if (focus)
      EventBus.emit(Events.BOOKS_LOADED)

    loading.value = false
  }
  catch (e) {
    console.error(`加载单词本 ${bookId} 内容错误`, e)
    loading.value = false
  }
}
function formatDate(timestamp: number) {
  const date = new Date(timestamp)
  const pad2 = (n: number) => {
    return (n < 10 ? '0' : '') + n
  }

  return `${date.getFullYear()}-${
               pad2(date.getMonth() + 1)}-${
               pad2(date.getDate())} ${
               pad2(date.getHours())}:${
               pad2(date.getMinutes())}:${
               pad2(date.getSeconds())}`
}
function clearStorageWords() {
  WordbookStorage.clear()
}
function setup() {
  EventBus.on(Events.UNAUTHED, () => {
    console.log('WordBook got UNAUTHED')
    clearStorageWords()
  })
  EventBus.on(Events.AUTHED, () => {
    console.log('WordBook got AUTHED')
    loadWordbookTable(false)
  })
  // EventBus.on(Events.BOOKS_LOADED, (data) => {
  //   console.log('WordBook got BOOKS_LOADED')
  //   generateWordbooks(data)
  // })
}
const audioContext = ref(new window.AudioContext())
onMounted(() => {
  setup()
})
const starFill = ref(browser.runtime.getURL('/svgs/star-fill.svg'))
async function removeWord(topicId: number, index: number) {
  let successful
  try {
    successful = await cancelCollectWordById(topicId)
  }
  catch (e) {
    successful = false
    console.error(`取消收藏单词 ${topicId} 异常`, e)
  }

  if (!successful)
    return ElMessage.warning('取消收藏单词失败')

  //   $(this).parent().parent().hide(500)
  words.value.splice(index, 1)
//   WordbookStorage.remove(topicId)
}
const volumeup = ref(browser.runtime.getURL('/svgs/volume-up.svg'))
let audioBinaryData: ArrayBuffer | null = null
let currentAudioSrc = ''
function getAudioContext() {
  return audioContext.value
}
function createAudioAndPlay(binaryData: ArrayBuffer) {
  const context = getAudioContext()
  const source = context!.createBufferSource()

  context!.decodeAudioData(binaryData, (buffer: any) => {
    source.buffer = buffer
    source.connect(context!.destination)
    source.start(0)
  })
}
function loadAndPlayAccent(data: MyWord) {
  const audioSrc = data.audio_uk.startsWith('http')
    ? data.audio_uk
    : resourceDomain + data.audio_uk
  if (currentAudioSrc !== audioSrc) {
    fetch(audioSrc, { method: 'GET', mode: 'cors' })
      .then(resp => resp.arrayBuffer())
      .then((arrayBuffer) => {
        currentAudioSrc = audioSrc
        audioBinaryData = arrayBuffer
        createAudioAndPlay(audioBinaryData.slice(0, audioBinaryData.byteLength))
      })
  }
  else if (audioBinaryData) {
    createAudioAndPlay(audioBinaryData.slice(0, audioBinaryData.byteLength))
  }
}
// 弹窗显示单词详情
const showDataDetail = ref(false)
const dataDetail = ref<WordDetail>()
function openDetail(topicId: number) {
  showDataDetail.value = false
  getWordDetail(topicId)
    .then((data) => {
      console.log(data)
      dataDetail.value = data as WordDetail
      showDataDetail.value = true
      // generateWordDetail(data, $('#detailDiv'), data.dict.word_basic_info.__collected__)
    })
    .catch((e) => {
      console.error(e)
      // generateErrorTips($('#detailDiv'))
    })
}
function onChange() {
  loadWordbookTable(true)
}
</script>

<template>
  <div id="wordbookTabContent" class="tab-pane fade show active" role="tabpanel" aria-labelledby="wordbookTab">
    <div class="container">
      <div class="row">
        <div class="col-sm-8">
          <div class="row" style="margin: 20px 0;">
            <div class="col-sm-5" style="padding: 0">
              <el-select
                id="wordbookSelect"
                v-model="selectedBookId"
                placeholder=""
                style="padding: 0; height: 38px;"
                @change="onChange"
              >
                <el-option v-if="options.length === 0" :value="0" label=" " disabled />
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>

            <button
              id="wordbookRefreshButton" type="button" class="btn btn-primary"
              style="margin-left: 10px; height: 36px; width: 36px; padding: 0"
              data-toggle="tooltip" title="刷新单词本显示最新内容"
              @click="loadWordbookTable(true)"
            >
              <img style="width: 20px;" :src="refresh">
            </button>
            <div class="col-sm-4 offset-sm-2">
              <el-checkbox id="maskEnglishButton" v-model="englishMasked" label="隐藏英文" size="large" />
              <el-checkbox id="maskMeanButton" v-model="meansMasked" label="隐藏释义" size="large" />
            </div>
          </div>

          <div id="orderBtns" style="margin-bottom: 5px;">
            <el-button-group class="ml-4">
              <el-button
                id="collectTimeDescOrderBtn" class="btn"
                :class="{ 'btn-outline-primary': order === 'collectTimeDescOrder', 'btn-outline-secondary': order !== 'collectTimeDescOrder' }"
                @click="order = 'collectTimeDescOrder'"
              >
                时间倒序
              </el-button>
              <el-button
                id="collectTimeAscOrderBtn" class="btn"
                :class="{ 'btn-outline-primary': order === 'collectTimeAscOrder', 'btn-outline-secondary': order !== 'collectTimeAscOrder' }"
                @click="order = 'collectTimeAscOrder'"
              >
                时间顺序
              </el-button>
              <el-button
                id="firstLettersAscOrderBtn" class="btn"
                :class="{ 'btn-outline-primary': order === 'firstLettersAscOrder', 'btn-outline-secondary': order !== 'firstLettersAscOrder' }"
                @click="order = 'firstLettersAscOrder'"
              >
                首字母顺序
              </el-button>
              <el-button
                id="firstLettersDescOrderBtn" class="btn"
                :class="{ 'btn-outline-primary': order === 'firstLettersDescOrder', 'btn-outline-secondary': order !== 'firstLettersDescOrder' }"
                @click="order = 'firstLettersDescOrder'"
              >
                首字母倒序
              </el-button>
            </el-button-group>
          </div>

          <table id="wordbookContentTable" class="table table-hover">
            <tbody v-if="words.length > 0">
              <tr v-for="(data, index) in words" :key="data.word" :tabIndex="index + 1">
                <td>
                  <span name="starIcon" style="cursor: pointer;" @click="removeWord(data.topic_id, index)">
                    <img :src="starFill">
                  </span>
                </td>
                <td>
                  <span
                    name="wordSpan" :class="{ 'word-row-hidden': englishMasked, 'word-row': !englishMasked }"
                    :data-masked="englishMasked"
                  >{{ data.word }}</span> &nbsp;&nbsp;
                  <span name="accentIcon" style="cursor: pointer;" @click="loadAndPlayAccent(data)">
                    <img :src="volumeup">
                  </span>
                  <span style="font-size: x-small; color: #a1a5ab;">收藏时间：{{ formatDate(data.created_at) }}</span>
                  <a name="detailLink" href="#" :data-topic-id="data.topic_id" style="float: right; color: #606266;" @click="openDetail(data.topic_id)">
                    详情 >
                  </a> <br>
                  <span
                    name="searchMeansSpan" class="searchMeans" :data-masked="meansMasked"
                    :style="searchMeanStyle"
                  >{{ data.mean }}</span>
                </td>
              </tr>
            </tbody>
            <tbody v-if="words.length === 0 && !loading">
              <tr>
                <!-- <td>加载失败，请稍后重试</td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <!-- 单词详情 -->
  <div class="container">
    <WordDetailComp v-if="showDataDetail && dataDetail" :data="dataDetail" />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-select__wrapper) {
  height: 38px;
}
img {
  vertical-align: middle;
  border-style: none;
}
:deep(.el-button-group) {
  .el-button {
    width: 90px;
    height: 36px;
    margin-right: 4px;
  }
}
.btn {
  border-radius: 4px !important;
}
.btn-outline-primary {
  color: #007bff;
  border-color: #007bff;
}
</style>
