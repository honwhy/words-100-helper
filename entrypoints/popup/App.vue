<script lang="ts" setup>
import { provide, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'
import WordDetail from './WordDetail.vue'
import type { Dict, Word } from '@/utils/models'
import { getWordDetail, searchWord } from '@/utils/api'

const keyword = ref('')
const search = debounce(doSearch, 500)

const showDataList = ref(false)
const showDataDetail = ref(false)
const dataList = ref<Word[]>([])
const dataDetail = ref<Dict>()
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
  showDataDetail.value = false
  getWordDetail(topicId)
    .then((data) => {
      console.log(data)
      dataDetail.value = data
      showDataList.value = false
      showDataDetail.value = true
      // generateWordDetail(data, $('#detailDiv'), data.dict.word_basic_info.__collected__)
    })
    .catch((e) => {
      console.error(e)
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
            <span class="searchMeans" title="${data.mean_cn}">{{ data.mean_cn }}</span>
          </td>
        </tr>
        <tr v-if="dataList.length === 0">
          <td>查询失败，请稍候再试</td>
        </tr>
      </tbody>
    </table>
    <!-- 单词详情 -->
    <WordDetail v-if="showDataDetail" :data="dataDetail" />
  </div>
</template>

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
