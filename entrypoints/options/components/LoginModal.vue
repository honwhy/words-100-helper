<script setup lang="ts">
import { onMounted } from 'vue'
import EventBus from '@/utils/bus'
import Events from '@/utils/events'

defineOptions({ name: 'LoginModal' })

function setup() {
  EventBus.on(Events.UNAUTHED, () => {
    console.log('LoginModal got UNAUTHED')
  })
  EventBus.on(Events.AUTHED, () => {
    console.log('LoginModal got AUTHED')
  })
}
onMounted(() => {
  setup()
})
</script>

<template>
  <div id="loginModel" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="loginModelLabel" class="modal-title">
            短信登录
          </h5>
        </div>
        <div class="modal-body">
          <form id="phoneLoginForm" style="display: block;">
            <div class="form-group row">
              <label for="phoneNumInput" class="col-sm-3 col-form-label">手机号码：</label>
              <div class="col-sm-8">
                <input id="phoneNumInput" type="text" class="form-control">
              </div>
            </div>
            <div class="form-group row">
              <label for="verifyCodeInput" class="col-sm-3 col-form-label">验证码：</label>
              <div class="col-sm-8">
                <input id="verifyCodeInput" type="text" class="form-control">
              </div>
            </div>
          </form>

          <form id="emailLoginForm" style="display: none;">
            <div class="form-group row">
              <label for="emailInput" class="col-sm-3 col-form-label">邮箱地址：</label>
              <div class="col-sm-8">
                <input id="emailInput" type="text" class="form-control">
              </div>
            </div>
            <div class="form-group row">
              <label for="passwordInput" class="col-sm-3 col-form-label">密码：</label>
              <div class="col-sm-8">
                <input id="passwordInput" type="text" class="form-control">
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <a id="wechatLoginLink" title="微信登录" href="#">微信</a>
          <a id="qqLoginLink" title="QQ登录" href="#">QQ</a>
          <a id="phoneLoginLink" title="短信登录" href="#">短信</a>
          <a id="emailLoginLink" title="邮箱登录" href="#">邮箱</a>
          <button id="sendVerifyButton" type="button" class="btn btn-secondary">
            发送验证码
          </button>
          <button id="loginButton" type="button" class="btn btn-primary">
            登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
