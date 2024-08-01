// background.ts
import { actions } from '@/utils/actions'
import tryImport from '@/utils/tryImport'

function handleMessage(request: { action: string, args: any }, sender: any, _sendResponse: any) {
  console.log('request:', request, sender)
  for (const [fnName, fn] of Object.entries(actions)) {
    if (fnName === request.action) {
      console.log('action:', fnName, 'args:', request.args)
      return fn(request.args)
      //   .then(r => sendResponse(r))
      // // 由于 sendResponse 不能返回结果类型，所以约定 [Error]: 代表请求报错
      //   .catch(e => sendResponse(`[Error]:${e.message}`))
      // break
    }
  }
}
export default defineBackground({
  type: 'module',
  main() {
    console.log('service worker loaded')
    browser.runtime.onMessage.addListener(handleMessage)
    tryImport()
    // 插件首次安装或更新时触发
    browser.runtime.onInstalled.addListener((detail) => {
      if (detail.reason === 'install')
        browser.tabs.create({ url: 'https://100-words.pages.dev/welcome' })
      else if (detail.reason === 'update')
        browser.runtime.openOptionsPage()
    })
  },
})
