<script lang="ts" setup>
import { provide, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'
import WordDetailComp from '../components/WordDetail.vue'
import type { Word, WordDetail } from '@/utils/models'
import { getWordDetail, searchWord } from '@/utils/api'

const keyword = ref('')
const search = debounce(doSearch, 500)

const showDataList = ref(false)
const showDataDetail = ref(false)
const dataList = ref<Word[]>([])
const dataDetail = ref<WordDetail>()
function doSearch() {
  const content = keyword.value.trim()
  if (!content)
    return
  showDataList.value = false
  searchWord(content)
    // .then(generateWordList)
    .then((res) => {
      dataList.value = (res ?? []) as Word[]
      showDataDetail.value = false
      showDataList.value = true
    })
    .catch((e) => {
      console.error(e)
      // generateErrorTips($('#searchTable > tbody'));
      dataList.value = []
      showDataDetail.value = false
      showDataList.value = true
    })
}
function refreshWordDetail(topicId: number) {
  console.log('refreshWordDetail.topicId=>', topicId)
  showDataDetail.value = false
  getWordDetail(topicId)
    .then((data) => {
      console.log('getWordDetail', data)
      dataDetail.value = data as WordDetail
      showDataList.value = false
      showDataDetail.value = true
      // generateWordDetail(data, $('#detailDiv'), data.dict.word_basic_info.__collected__)
    })
    .catch((e) => {
      console.error('getWordDetail', e)
      // generateErrorTips($('#detailDiv'))
    })
}
provide('refreshWordDetail', refreshWordDetail)
</script>

<template>
  <div class="container popup-body">
    <div class="input-group mb-3">
      <el-input
        v-model="keyword"
        style="height: 38px;"
        placeholder="请输入要查询的中文或英文"
        @keydown.enter="search"
      >
        <template #append>
          <el-button :icon="Search" style="width: 42px;" @click="search" />
        </template>
      </el-input>
    </div>
    <!-- 搜索结果 -->
    <table v-show="showDataList" id="searchTable" class="table table-hover">
      <tbody>
        <tr
          v-for="(data, index) in dataList"
          :key="data.topic_id" style="cursor: pointer;"
          :tabIndex="index + 1"
          :data-topic-id="data.topic_id"
          @click="refreshWordDetail(data.topic_id)"
        >
          <td>
            <span class="searchWord">{{ data.word }}</span> &nbsp;&nbsp;
            <span class="searchAccent">{{ data.accent }}</span>
            <span class="searchMeans" :title="data.mean_cn">{{ data.mean_cn }}</span>
          </td>
        </tr>
        <tr v-if="dataList.length === 0">
          <td>查询失败，请稍候再试</td>
        </tr>
      </tbody>
    </table>
    <!-- 单词详情 -->
    <WordDetailComp v-if="showDataDetail && dataDetail" :data="dataDetail" />
  </div>
</template>

<style lang="scss">
/* 移除 hover 状态下的边框 */
.el-button:hover {
  border-color: transparent !important;
}

/* 移除 focus 状态下的边框 */
.el-button:focus {
  outline: none !important; /* 可能还需要调整 box-shadow 或 border-color */
}

/* 移除 active 状态下的边框 */
.el-button:active {
  border-color: transparent !important;
}
/* 美化滚动条整体样式 */
::-webkit-scrollbar {
  width: 12px; /* 滚动条宽度 */
  height: 12px; /* 垂直滚动条高度 */
}

/* 美化滚动条轨道（滑动轨道） */
::-webkit-scrollbar-track {
  background-color: #f1f1f1; /* 轨道背景色 */
  border-radius: 6px; /* 圆角 */
}

/* 美化滚动条滑块（滚动 thumb） */
::-webkit-scrollbar-thumb {
  background-color: #ccc; /* 滑块背景色 */
  border-radius: 6px; /* 圆角 */
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); /* 阴影效果 */

  /* 滚动状态下的滑块样式 */
  &:hover,
  &-active {
    width: 14px;
    background-color: #888; /* 滚动时滑块背景色 */
  }
}
</style>

<style scoped lang="scss">
.popup-body {
  min-width: 400px;
  scroll-behavior: auto;
  margin-top: 20px;
}
.container {
  width: 100%;
  box-sizing: border-box;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}
.mb-3 {
  margin-bottom: 1rem !important;
}
.input-group {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;
}
.table {
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
}
.table th,
.table td {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}
.searchWord {
  font-weight: bolder;
}
.searchAccent {
  font-size: small;
  color: #606266;
}
.searchMeans {
  color: #6a6d71;
  width: 20em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}
</style>
