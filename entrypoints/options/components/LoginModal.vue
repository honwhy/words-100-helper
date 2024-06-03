<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css' // 引入 ElMessage 的样式
import { debounce, isEmpty } from 'lodash-es'
import IconQ from '~/assets/icon-qq.svg'
import IconWechat from '~/assets/icon-wechat.svg'
import EventBus from '@/utils/eventBus'
import Events from '@/utils/events'
import { getUserInfo, loginWithEmail } from '@/utils/api'
import storageModule from '@/utils/storages'

defineOptions({ name: 'LoginModal' })

interface UserInfo {
  nickname: string
}
function loadUserInfo() {
  getUserInfo().then((res) => {
    console.log('getUserInfo', res)
    const data = res as UserInfo[]
    const nickname = data.length ? data[0].nickname : '游客用户'
    EventBus.emit('nickname', nickname)
  })
    .catch(e => console.error(`获取用户信息失败`, e))
}
const dialogVisible = ref(false)
function setup() {
  EventBus.on(Events.UNAUTHED, () => {
    console.log('LoginModal got UNAUTHED')
    storageModule.remove(['accessToken'])
    EventBus.emit('nickname', '游客用户')
    dialogVisible.value = true
  })
  EventBus.on(Events.AUTHED, () => {
    console.log('LoginModal got AUTHED')
    loadUserInfo()
  })
}
const loginMode = ref('phone')
function myAlert() {
  ElMessage({
    message: '请先绑定手机再使用短信方式进行登录',
    type: 'warning',
  })
}
const title = ref('短信登录')
const showSendButton = ref(true)
function toggleEmailMode() {
  showSendButton.value = false
  title.value = '邮箱登录'
  loginMode.value = 'email'
}

function togglePhoneMode() {
  showSendButton.value = true
  title.value = '短信登录'
  loginMode.value = 'phone'
}
const phoneForm = reactive({
  phone: '',
  verifyCode: '',
})
const mailForm = reactive({
  email: '',
  password: '',
})
interface LoginData {
  access_token: string
}
function loginSuccessful(res: unknown) {
  const data = res as LoginData
  console.log('loginSuccessful', data)
  // access_token 写入 storage
  storageModule.set('accessToken', data.access_token)
  // 禁止点击
  // $('#loginButton').off('click').prop('disabled', true)
  // 登录模态框隐藏
  dialogVisible.value = false
  // 显示用户信息，支持退出
  loadUserInfo()
  ElMessage.success('登录成功')
  EventBus.emit(events.AUTHED)
}

function loginFailure(e: Error) {
  console.error(`登录失败`, e)
  ElMessage.warning('登录失败，请稍候再试')
}
function loginByPhone() {
  if (isEmpty(phoneForm.phone) || isEmpty(phoneForm.verifyCode)) {
    ElMessage.warning('手机号码或验证码不能为空')
    return
  }
  loginWithPhone(phoneForm.phone, phoneForm.verifyCode)
    .then(loginSuccessful)
    .catch(loginFailure)
}
function loginByEmail() {
  if (isEmpty(mailForm.email) || isEmpty(mailForm.password)) {
    ElMessage.warning('请输入邮箱和密码')
    return
  }
  loginWithEmail(mailForm.email, mailForm.password)
    .then(loginSuccessful)
    .catch(loginFailure)
}
const onLogin = debounce(() => {
  loginMode.value === 'phone' ? loginByPhone() : loginByEmail()
})
let countdown: number
const sendButtonText = ref('发送验证码')
const sendButtonDisabled = ref(false)
function resetCountdown() {
  if (countdown)
    clearInterval(countdown)
  sendButtonDisabled.value = false
  sendButtonText.value = '发送验证码'
}
function startCountdown() {
  let time = 60
  sendButtonText.value = `${time}秒后重新发送`
  countdown = setInterval(() => {
    time--
    if (time <= 0)
      resetCountdown()
    else
      sendButtonText.value = `${time}秒后重新发送`
  }, 1000) as unknown as number
}
const sendVerifyCode = debounce(() => {
  if (isEmpty(phoneForm.phone)) {
    ElMessage.warning('手机号码不能为空')
    return
  }
  if (sendButtonDisabled.value)
    return
  getVerifyCode(phoneForm.phone).then(() => {
    ElMessage.success('验证码发送成功')
    sendButtonDisabled.value = true
    startCountdown()
  })
    .catch((e) => {
      console.error(`向 ${phoneForm.phone} 发送验证码失败`, e)
      ElMessage.warning('发送验证码失败，请稍候再试')
    })
})
onMounted(() => {
  setup()
})
onUnmounted(() => {
  resetCountdown()
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="500"
    :show-close="false"
    style="padding: 0"
    top="30px"
    append-to-body
  >
    <template #header>
      <div class="modal-header">
        <h5 id="loginModelLabel" class="modal-title">
          {{ title }}
        </h5>
      </div>
    </template>
    <template #footer>
      <div class="modal-footer">
        <span>其他登录:</span>
        <a href="#" class="icon-wechat" @click.stop="myAlert">
          <img :src="IconWechat">
        </a>
        <a href="#" class="icon-qq" @click.stop="myAlert">
          <img :src="IconQ">
        </a>
        <a id="phoneLoginLink" title="短信登录" href="#" @click.stop="togglePhoneMode">短信</a>
        <a id="emailLoginLink" title="邮箱登录" href="#" @click.stop="toggleEmailMode">邮箱</a>
        <button id="loginButton" type="button" class="btn btn-primary" @click="onLogin">
          登录
        </button>
      </div>
    </template>
    <div class="modal-content">
      <div class="modal-body">
        <el-form v-if="loginMode === 'phone'" id="phoneLoginForm" :model="phoneForm" label-width="85px" style="padding: 1rem">
          <el-form-item label="手机号码：">
            <el-input v-model="phoneForm.phone" style="line-height: 1.5;height: 38px;" />
          </el-form-item>
          <el-form-item label="验证码：">
            <el-input v-model="phoneForm.verifyCode" style="line-height: 1.5;height: 38px">
              <template #append>
                <el-button
                  :disabled="sendButtonDisabled"
                  size="small"
                  @click="sendVerifyCode"
                >
                  {{ sendButtonText }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        <el-form v-if="loginMode === 'email'" id="emailLoginForm" :model="mailForm" label-width="85px" style="padding: 1rem">
          <el-form-item label="邮箱地址：">
            <el-input v-model="mailForm.email" style="line-height: 1.5;height: 38px;" />
          </el-form-item>
          <el-form-item label="密码：">
            <el-input v-model="mailForm.password" type="password" style="line-height: 1.5;height: 38px" />
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.modal-header {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: start;
  align-items: flex-start;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 1rem 1rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
}

.modal-footer {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: end;
  justify-content: flex-end;
  padding: 0.75rem;
  border-top: 1px solid #dee2e6;
  border-bottom-right-radius: calc(0.3rem - 1px);
  border-bottom-left-radius: calc(0.3rem - 1px);
  a {
    color: #007bff;
    text-decoration: none;
    background-color: transparent;
  }
}
.modal-footer > * {
  margin: 0.25rem;
}
.modal-footer {
  a {
    img {
      width: 32px;
    }
    &.icon-wechat {
      background: #04d268;
      border-radius: 50%;
    }
    &.icon-qq {
      background: #12b7f5;
      border-radius: 50%;
    }
  }
}
</style>
