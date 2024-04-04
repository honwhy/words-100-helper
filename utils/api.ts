import type { WordDetail } from './models'
import storageModule from './storage'
import WordbookStorage from './wordbook-storage'

const defaultHost = '110.42.229.221'
const defaultPort = 8080
function loadRequestOptions(): Promise<[string, number, string]> {
  const keys = ['host', 'port', 'accessToken']

  return Promise.all(keys.map(k => storageModule.get(k)))
    .then(([host, port, accessToken]) => {
      return [String(host || defaultHost), Number(port || defaultPort), String(accessToken)]
    })
}
interface Options {
  url: string
  method: string
  headers: { [key: string]: string }
}
function sendRequest(options: Options) {
  return new Promise((resolve, reject) => {
    return fetch(options.url, {
      method: options.method,
      mode: 'cors',
      headers: options.headers,
    })
      .then(response => response.json())
      .then(responseJson => responseJson.code === 200
        ? resolve(responseJson.data)
        : reject(new Error(responseJson.message)),
      )
      .catch(e => reject(e))
  })
}
export function searchWord(word: string) {
  return loadRequestOptions().then(([host, port, accessToken]) => {
    const url = `http://${host}:${port}/search/word/${word}`

    return sendRequest({
      url,
      method: 'GET',
      headers: { access_token: accessToken },
    })
  })
}

export function getWordDetail(topicId: number) {
  return loadRequestOptions().then(([host, port, accessToken]) => {
    const url = `http://${host}:${port}/word/${topicId}`

    return sendRequest({
      url,
      method: 'GET',
      headers: { access_token: accessToken },
    })
  })
  // .then(fillCollectedField)
  // .then(console.log)
}
async function fillCollectedField(res: unknown) {
  const data = res as WordDetail
  const topicId = data.dict.word_basic_info.topic_id
  const bookId = (await getWordbookId()) as number
  const collected = await WordbookStorage.contains(bookId, topicId)

  data.dict.word_basic_info.__collected__ = collected as boolean

  return data
}
function getWordbookId() {
  return storageModule.get('bookId').then(bookId => bookId || 0)
}
