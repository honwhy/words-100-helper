<script setup lang="ts">
import { onMounted } from 'vue'
import EventBus from '@/utils/bus'
import Events from '@/utils/events'

defineOptions({ name: 'SettingContent' })

function setup() {
  EventBus.on(Events.UNAUTHED, () => {
    console.log('SettingContent got UNAUTHED')
  })
  EventBus.on(Events.AUTHED, () => {
    console.log('SettingContent got AUTHED')
  })
}
onMounted(() => {
  setup()
})
</script>

<template>
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
</template>
