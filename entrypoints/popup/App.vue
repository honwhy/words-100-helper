<script lang="ts" setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'
import { searchWord } from '@/utils/api'

const keyword = ref('')
const search = debounce(doSearch, 500)

function doSearch() {
  const content = keyword.value.trim()
  if (!content)
    return
  searchWord(content)
    .then(console.log)
    // .then(generateWordList)
    .catch((e) => {
      console.error(e)
      // generateErrorTips($('#searchTable > tbody'));
    })
}
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
    <table id="searchTable" class="table table-hover">
      <tbody />
    </table>
    <!-- 单词详情 -->
    <div id="detailDiv" style="display: none;" />
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
</style>
