import storageModule from '@/utils/storages'

export default function tryImport() {
  try {
    const url = browser.runtime.getURL('/env.txt')
    console.log('url:', url)
    fetch(url).then(res => res.text())
      .then((res) => {
        console.log('token:', res)
        storageModule.set('accessToken', res)
      }).catch(e => console.log('token error:', e))
  }
  catch (e) {
    console.log('token error:', e)
  }
}
