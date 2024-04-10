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

const activeName = ref('')
function handleClick() {}
const nickname = ref('游客用户')
const githubMark = ref(browser.runtime.getURL('/github-mark.png'))
const refresh = ref(browser.runtime.getURL('/svgs/refresh.svg'))
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

  <ul id="myTab" class="nav nav-pills justify-content-center" role="tablist">
    <li class="nav-item" role="presentation">
      <button
        id="wordbookTab" class="nav-link active" data-toggle="tab" data-target="#wordbookTabContent"
        type="button" role="tab" aria-controls="wordbookTabContent" aria-selected="true"
      >
        单词本
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <button
        id="settingTab" class="nav-link" data-toggle="tab" data-target="#settingTabContent" type="button"
        role="tab" aria-controls="settingTabContent" aria-selected="true"
      >
        系统设置
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <a class="nav-link" href="https://gitee.com/mamotz/baicizhan-helper/wikis/%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C" target="_blank">使用手册</a>
    </li>
    <li class="nav-item" role="presentation">
      <a class="nav-link" href="http://110.42.229.221:8080/comments" target="_blank" title="反馈使用中遇见的问题">问题反馈</a>
    </li>
    <li class="nav-item dropdown">
      <a
        id="username" class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button"
        aria-expanded="false"
      >guest</a>
      <div class="dropdown-menu">
        <a id="exit" class="dropdown-item" href="#">退出</a>
      </div>
    </li>
    <li class="nav-item" role="presentation">
      <a href="https://github.com/marmot-z/baicizhan-helper" target="_blank" title="项目首页">
        <img style="width: 40px;" :src="githubMark">
      </a>
    </li>
  </ul>

  <div id="myTabContent" class="tab-content">
    <div id="wordbookTabContent" class="tab-pane fade show active" role="tabpanel" aria-labelledby="wordbookTab">
      <div class="container">
        <div class="row">
          <div class="col-sm-8 offset-sm-2">
            <div class="row" style="margin: 20px 0;">
              <select id="wordbookSelect" class="form-control col-sm-5" tabIndex="-1" />
              <button
                id="wordbookRefreshButton" type="button" class="btn btn-primary"
                style="margin-left: 10px;" data-toggle="tooltip" title="刷新单词本显示最新内容" tabIndex="-1"
              >
                <img style="width: 20px;" :src="refresh">
              </button>
              <div class="col-sm-4 offset-sm-2">
                <input id="maskEnglishButton" type="checkbox" tabIndex="-1">
                <label class="form-check-label" for="maskEnglishButton">
                  隐藏英文
                </label>
                <input id="maskMeanButton" type="checkbox" tabIndex="-1" checked>
                <label class="form-check-label" for="maskMeanButton">
                  隐藏释义
                </label>
              </div>
            </div>

            <div id="orderBtns" style="margin-bottom: 5px;">
              <button id="collectTimeDescOrderBtn" data-order="collectTimeDescOrder" type="button" class="btn btn-outline-primary" tabIndex="-1">
                时间倒序
              </button>
              <button id="collectTimeAscOrderBtn" data-order="collectTimeAscOrder" type="button" class="btn btn-outline-secondary" tabIndex="-1">
                时间顺序
              </button>
              <button id="firstLettersAscOrderBtn" data-order="firstLettersAscOrder" type="button" class="btn btn-outline-secondary" tabIndex="-1">
                首字母顺序
              </button>
              <button id="firstLettersDescOrderBtn" data-order="firstLettersDescOrder" type="button" class="btn btn-outline-secondary" tabIndex="-1">
                首字母倒序
              </button>
            </div>

            <table id="wordbookContentTable" class="table table-hover">
              <tbody />
            </table>
          </div>
        </div>
      </div>
    </div>
    <div id="settingTabContent" class="tab-pane fade" role="tabpanel" aria-labelledby="settingTab">
      <div class="container" style="margin-top: 40px;">
        <div class="row">
          <div class="col-sm-2" />
          <form id="settingForm">
            <div class="form-group row">
              <label for="collectWordbookSelect" class="col-sm-3 col-form-label">单词本</label>
              <select id="collectWordbookSelect" class="form-control col-sm-4" />
                            &nbsp;
              <small class="form-text text-muted">
                选中单词本用于后续单词收藏
              </small>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">弹窗样式</label>
              <div class="col-sm-9">
                <div class="form-check form-check-inline">
                  <input
                    id="simleStyleRadio" class="form-check-input" type="radio"
                    name="popoverStyle" value="simple" checked
                  >
                  <label class="form-check-label" for="simleStyle">精简模式</label>
                </div>
                <div class="form-check form-check-inline">
                  <input
                    id="richStyleRadio" class="form-check-input" type="radio" name="popoverStyle"
                    value="rich"
                  >
                  <label class="form-check-label" for="richStyle">图文模式</label>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">翻译时机</label>
              <div class="col-sm-9">
                <div class="form-check">
                  <input
                    id="showIconRadio" class="form-check-input" type="radio" name="triggerMode"
                    value="showIcon" checked
                  >
                  <label class="form-check-label" for="showIconRadio">显示图标，点击翻译</label>
                </div>
                <div class="form-check">
                  <input
                    id="directRadio" class="form-check-input" type="radio" name="triggerMode"
                    value="direct"
                  >
                  <label class="form-check-label" for="directRadio">直接翻译</label>
                </div>
                <div class="form-check">
                  <input
                    id="neverRadio" class="form-check-input" type="radio" name="triggerMode"
                    value="never"
                  >
                  <label class="form-check-label" for="neverRadio">永不翻译</label>
                </div>
              </div>
            </div>
            <div class="form-group row" style="display: none;">
              <label class="col-sm-3 col-form-label">bing翻译</label>
              <div class="col-sm-9">
                <div class="custom-control custom-switch">
                  <input id="bingTransalteCheck" type="checkbox" class="custom-control-input" name="bingTranslateEnable">
                  <label class="custom-control-label" for="bingTransalteCheck">默认不开启</label>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">单词详情内容</label>
              <div class="col-sm-9">
                <div class="form-check">
                  <input id="showVariantCheck" class="form-check-input" type="checkbox">
                  <label class="form-check-label" for="showVariantCheck">
                    单词变形
                  </label>
                </div>
                <div class="form-check">
                  <input id="showSentenceCheck" class="form-check-input" type="checkbox" checked disabled>
                  <label class="form-check-label" for="showSentenceCheck">
                    图文例句
                  </label>
                </div>
                <div class="form-check">
                  <input id="showShortPhrasesCheck" class="form-check-input" type="checkbox">
                  <label class="form-check-label" for="showShortPhrasesCheck">
                    短语
                  </label>
                </div>
                <div class="form-check">
                  <input id="showSynonymsCheck" class="form-check-input" type="checkbox">
                  <label class="form-check-label" for="showSynonymsCheck">
                    近义词
                  </label>
                </div>
                <div class="form-check">
                  <input id="showAntonymsCheck" class="form-check-input" type="checkbox">
                  <label class="form-check-label" for="showAntonymsCheck">
                    反义词
                  </label>
                </div>
                <div class="form-check">
                  <input id="showSimilarWordsCheck" class="form-check-input" type="checkbox">
                  <label class="form-check-label" for="showSimilarWordsCheck">
                    形近词
                  </label>
                </div>
                <div class="form-check">
                  <input id="showEnglishParaphraseCheck" class="form-check-input" type="checkbox">
                  <label class="form-check-label" for="showEnglishParaphraseCheck">
                    英文释义
                  </label>
                </div>
              </div>
            </div>
            <div class="form-group row" style="display: none;">
              <label class="col-sm-3 col-form-label">代理服务器</label>
              <div class="col-sm-9 row">
                <div class="col-sm-8">
                  <div class="input-group mb-2">
                    <div class="input-group-prepend">
                      <div class="input-group-text">
                        http://
                      </div>
                    </div>
                    <input
                      id="hostInput" type="text" class="form-control" value="110.42.229.221"
                      placeholder="默认不需要修改"
                    >
                  </div>
                </div>
                :
                <div class="col-sm-3">
                  <input
                    id="portInput" type="text" class="form-control mb-2" value="8080"
                    placeholder="默认不需要修改"
                  >
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">快捷键</label>
              <div class="col-sm-9">
                <div class="form-check">
                  <p><kbd>Tab</kbd> 切换单词</p>
                </div>
                <div class="form-check">
                  <p><kbd>Enter</kbd> 查看单词详情</p>
                </div>
                <div class="form-check">
                  <p><kbd>Esc</kbd> 退出单词详情</p>
                </div>
                <div class="form-check">
                  <p><kbd>Ctrl+Shift+S</kbd>收藏/取消收藏单词（仅搜索场景）</p>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <div style="margin: 0 auto">
                <button id="resetButton" type="button" class="btn btn-warning">
                  重置
                </button>
                                &nbsp;&nbsp;
                <button id="submitButton" type="button" class="btn btn-primary">
                  保存
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div v-show="activeName === 'wordbookTabContent'" class="html-container">
    <WordBook />
  </div>
  <div v-show="activeName === 'settingTabContent'" class="html-container">
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

  <div id="wordDetailModal" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            单词详情
          </h5>
        </div>
        <div class="modal-body" style="padding-top: 0;" />
      </div>
    </div>
  </div>
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
