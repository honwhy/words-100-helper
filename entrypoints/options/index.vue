<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { isEmpty } from 'lodash-es'

import { CaretBottom } from '@element-plus/icons-vue'
import Usage from './components/Usage.vue'
import SettingContent from './components/SettingContent.vue'
import WordBook from './components/WordBook.vue'
import LoginModal from './components/LoginModal.vue'
import storageModule from '@/utils/storage'
import Events from '@/utils/events'
import EventBus from '@/utils/eventBus'

const activeName = ref('wordbookTabContent')
function handleClick() {}
const nickname = ref('游客用户')
const githubMark = ref(browser.runtime.getURL('/github-mark.png'))
async function setup() {
  const accessToken = await storageModule.get('accessToken')
  if (isEmpty(accessToken))
    EventBus.emit(Events.UNAUTHED)
  else
    EventBus.emit(Events.AUTHED)

  EventBus.on('nickname', (data: unknown) => {
    // console.log('type,e', data)
    const name = data as string
    nickname.value = name
  })
}
onMounted(() => {
  setup()
})
</script>

<template>
  <div class="my-tabs">
    <el-tabs v-model="activeName" type="card" class="menu-tabs" @tab-click="handleClick">
      <el-tab-pane label="单词本" name="wordbookTabContent">
        <template #label>
          <el-button class="custom-tabs-label">
            单词本
          </el-button>
        </template>
      </el-tab-pane>
      <el-tab-pane label="系统设置" name="settingTabContent">
        <template #label>
          <el-button class="custom-tabs-label">
            系统设置
          </el-button>
        </template>
      </el-tab-pane>
    </el-tabs>
    <el-button text class="custom-tabs-label" :class="{ 'is-active': activeName === 'usage' }" @click="activeName = 'usage'">
      使用手册
    </el-button>
    <el-button text class="custom-tabs-label" :class="{ 'is-active': activeName === 'comments' }" @click="activeName = 'comments'">
      问题反馈
    </el-button>
    <el-dropdown trigger="click" style="min-width: 96px; margin-left: 12px; color: #007bff">
      <span class="el-dropdown-link">
        {{ nickname }}
        <el-icon class="el-icon--right"><CaretBottom /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item style="min-width: 100px;">
            <span>退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-button text class="custom-tabs-label">
      <a href="https://github.com/honwhy/words-100-helper" target="_blank" title="项目首页">
        <img style="width: 40px;" :src="githubMark">
      </a>
    </el-button>
  </div>
  <!-- tab内容 -->
  <div v-if="activeName === 'wordbookTabContent'" class="html-container">
    <WordBook />
  </div>
  <div v-if="activeName === 'settingTabContent'" class="html-container">
    <SettingContent />
  </div>
  <div v-if="activeName === 'usage'" class="html-container">
    <Usage />
  </div>
  <div v-if="activeName === 'comments'" class="html-container">
    <div style="padding-left: 8px;">
      <a target="_blank" href="http://110.42.229.221:8080/comments">查看更多</a>
    </div>
    <iframe
      id="commentIframe"
      src="http://110.42.229.221:8080/comments"
      frameborder="0"
      class="comment-iframe"
      scrolling="no"
    />
  </div>
  <!-- 登录模态框 -->
  <LoginModal />
</template>

<style scoped lang="scss">
.my-tabs {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
:deep(.el-tabs__header) {
  margin-bottom: 0;
  border: none !important;
}
:deep(.el-tabs__nav) {
  border: none !important;
}
:deep(.el-tabs__item) {
  border: none !important;
  padding: 0 !important;
}
.custom-tabs-label {
  height: 40px;
  padding: 8px 16px;
  border: none;
  border-radius: 0.25rem;
  font-size: 16px;
  font-weight: bold;
}
:deep(.el-tabs__item.is-active button) {
  color: #fff;
  background-color: #007bff;
}
.html-container {
  padding-left: calc((100% - 1000px) / 2);
  padding-right: calc((100% - 1000px) / 2);
  padding-bottom: 40px;
}
.comment-iframe {
  overflow-y: auto;
  width: 100%;
  min-height: 1000px;
}
</style>
@/utils/bus
