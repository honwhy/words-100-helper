<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { isEmpty } from 'lodash-es'
import type { UserBooks } from './hooks'
import { useWordBook } from './hooks'
import { defaultHost, defaultPort } from '@/utils/config'
import EventBus from '@/utils/eventBus'
import Events from '@/utils/events'
import storageModule from '@/utils/storage'
import { getBooks } from '@/utils/api'

defineOptions({ name: 'SettingContent' })
const { selectedBookId, options } = useWordBook()
function clearStorageBookId() {
  storageModule.remove(['bookId'])
}

function loadWordbook() {
  return getBooks().then((res: unknown) => {
    const data = res as UserBooks
    options.value = data.user_books.map(book => ({
      value: book.user_book_id,
      label: `${book.book_name}(已收录 ${book.word_num} 词)`,
    }))
  })
    .catch(e => console.error('加载单词本失败', e))
}
const popoverStyle = ref('simple')
const triggerMode = ref('triggerMode')
const host = ref('')
const port = ref(8080)
interface Settings {
  variantDisplay: boolean
  sentenceDisplay: boolean
  shortPhrasesDisplay: boolean
  synonymsDisplay: boolean
  antonymsDisplay: boolean
  similarWordsDisplay: boolean
  englishParaphraseDisplay: boolean
}
const defaultWordDetailSettings = {
  variantDisplay: false,
  sentenceDisplay: true,
  shortPhrasesDisplay: false,
  synonymsDisplay: false,
  antonymsDisplay: false,
  similarWordsDisplay: false,
  englishParaphraseDisplay: false,
}
const settings = ref<Settings>(defaultWordDetailSettings)
function loadSettings() {
  storageModule.get('popoverStyle')
    .then((popoverStyle1) => {
      if (!popoverStyle1)
        return
      popoverStyle.value = popoverStyle1 as string
    })
  storageModule.get('triggerMode')
    .then((triggerMode1) => {
      if (!triggerMode1)
        return
      triggerMode.value = triggerMode1 as string
    })
  // storageModule.get('bingTranslateEnable')
  //   .then(bingTranslateEnable => $('#bingTransalteCheck').prop('checked', !!bingTranslateEnable))
  // storageModule.get('theme')
  //   .then((theme) => {
  //     if (!theme)
  //       return
  //     $('input[name="theme"]').filter(`[value=${theme}]`).prop('checked', true)
  //   })
  storageModule.get('host')
    .then((host1) => {
      if (isEmpty(host1))
        host.value = defaultHost
      else
        host.value = host1
    })
  storageModule.get('port')
    .then((port1) => {
      if (!port1)
        port.value = defaultPort
      else
        port.value = port1
    })
  storageModule.get('wordDetail')
    .then((wordDetailSettings) => {
      const settings1 = wordDetailSettings
        ? Object.assign(defaultWordDetailSettings, wordDetailSettings)
        : defaultWordDetailSettings
      settings.value = settings1 as Settings
      // if (settings.variantDisplay)
      //   $('#showVariantCheck').prop('checked', true)
      // if (settings.sentenceDisplay)
      //   $('#showSentenceCheck').prop('checked', true)
      // if (settings.shortPhrasesDisplay)
      //   $('#showShortPhrasesCheck').prop('checked', true)
      // if (settings.synonymsDisplay)
      //   $('#showSynonymsCheck').prop('checked', true)
      // if (settings.antonymsDisplay)
      //   $('#showAntonymsCheck').prop('checked', true)
      // if (settings.similarWordsDisplay)
      //   $('#showSimilarWordsCheck').prop('checked', true)
      // if (settings.englishParaphraseDisplay)
      //   $('#showEnglishParaphraseCheck').prop('checked', true)
    })
}
function setup() {
  EventBus.on(Events.UNAUTHED, () => {
    console.log('SettingContent got UNAUTHED')
    clearStorageBookId()
  })
  EventBus.on(Events.AUTHED, () => {
    console.log('SettingContent got AUTHED')
    loadWordbook().finally(loadSettings)
  })
}
onMounted(() => {
  setup()
})
</script>

<template>
  <div id="settingTabContent" class="tab-pane" role="tabpanel" aria-labelledby="settingTab">
    <div class="container">
      <div class="row">
        <div class="col-sm-8 offset-sm-2">
          <form id="settingForm">
            <div class="form-group row">
              <label for="collectWordbookSelect" class="col-sm-3 col-form-label">单词本</label>
              <div class="col-sm-9">
                <el-select
                  id="wordbookSelect"
                  v-model="selectedBookId"
                  placeholder=""
                  style="padding: 0; height: 38px;width: 240px;"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <small class="form-text text-muted">
                  选中单词本用于后续单词收藏
                </small>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">弹窗样式</label>
              <div class="col-sm-9">
                <el-radio-group v-model="popoverStyle">
                  <el-radio value="simple">
                    精简模式
                  </el-radio>
                  <el-radio value="richStyle">
                    图文模式
                  </el-radio>
                </el-radio-group>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">翻译时机</label>
              <div class="col-sm-9">
                <el-radio-group v-model="triggerMode" direction="vertical">
                  <el-radio value="showIcon">
                    显示图标，点击翻译
                  </el-radio>
                  <el-radio value="directRadio">
                    直接翻译
                  </el-radio>
                  <el-radio value="never">
                    永不翻译
                  </el-radio>
                </el-radio-group>
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
                <div class="form-check" style="padding-left: 0;">
                  <div class="checkbox-row">
                    <el-checkbox v-model="settings.showVariant" label="单词变形" />
                  </div>
                  <div class="checkbox-row">
                    <el-checkbox v-model="settings.showExample" label="图文例句" />
                  </div>
                  <div class="checkbox-row">
                    <el-checkbox v-model="settings.shortPhrasesDisplay" label="短语" />
                  </div>
                  <div class="checkbox-row">
                    <el-checkbox v-model="settings.synonymsDisplay" label="近义词" />
                  </div>
                  <div class="checkbox-row">
                    <el-checkbox v-model="settings.antonymsDisplay" label="反义词" />
                  </div>
                  <div class="checkbox-row">
                    <el-checkbox v-model="settings.similarWordsDisplay" label="形近词" />
                  </div>
                  <div class="checkbox-row">
                    <el-checkbox v-model="settings.englishParaphraseDisplay" label="英文释义" />
                  </div>
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
                <div class="form-check" style="padding-left: 0;">
                  <p><kbd>Tab</kbd> 切换单词</p>
                </div>
                <div class="form-check" style="padding-left: 0;">
                  <p><kbd>Enter</kbd> 查看单词详情</p>
                </div>
                <div class="form-check" style="padding-left: 0;">
                  <p><kbd>Esc</kbd> 退出单词详情</p>
                </div>
                <div class="form-check" style="padding-left: 0;">
                  <p><kbd>Ctrl+Shift+S</kbd>收藏/取消收藏单词（仅搜索场景）</p>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <div style="margin: 0 auto; text-align: center; margin-top: 20px">
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
</template>

<style scoped lang="scss">
.container {
  padding-top: 40px;
}
.form-group.row {
  margin-top: 10px;
}
.checkbox-row {
  height: 28px;
}
</style>