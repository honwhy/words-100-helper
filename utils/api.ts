import { isEmpty, isNil } from 'lodash-es'
import type { Dict, WordDetail } from './models'
import storageModule from './storages'
import WordbookStorage from './wordbook-storage'
import { defaultHost, defaultPort } from './config'

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
  console.log('getWordDetail->topicId', topicId)
  return loadRequestOptions().then(([host, port, accessToken]) => {
    const url = `http://${host}:${port}/word/${topicId}`

    return sendRequest({
      url,
      method: 'GET',
      headers: { access_token: accessToken },
    })
  })
    .then(fillCollectedField)
    // .then(console.log)
}
async function fillCollectedField(res: unknown) {
  const data = res as WordDetail
  const topicId = data.dict.word_basic_info.topic_id
  const bookId = (await getWordbookId()) as number
  const collected = await WordbookStorage.contains(bookId, topicId)

  data.dict.word_basic_info.__collected__ = collected as boolean
  console.log('fillCollectedField->data', data)
  return data
}
async function getWordbookId() {
  const bookId = await storageModule.get('bookId').then(bookId => bookId || 0)
  return bookId as number
}

export function getWordInfo(word: string) {
  return searchWord(word).then((res) => {
    console.log('getWordInfo->searchWord.return', res)
    const data = (res ?? []) as Word[]
    const bestMatch = data[0]
    const topicId = bestMatch?.topic_id

    return topicId
      ? getWordDetail(topicId)
      : Promise.resolve(null)
  })
}

export function getUserInfo() {
  return loadRequestOptions().then(([host, port, accessToken]) => {
    const url = `http://${host}:${port}/userInfo`

    return sendRequest({
      url,
      method: 'GET',
      headers: { access_token: accessToken },
    })
  })
}

export function loginWithEmail(email: string, password: string) {
  return loadRequestOptions().then(([host, port]) => {
    const url = `http://${host}:${port}/loginWithEmail?email=${encodeURIComponent(email)}&password=${password}`

    return sendRequest({
      url,
      method: 'POST',
      headers: {},
    })
  })
}

export function loginWithPhone(phoneNum: string, verifyCode: string) {
  return loadRequestOptions().then(([host, port]) => {
    const url = `http://${host}:${port}/login/${phoneNum}/${verifyCode}`

    return sendRequest({
      url,
      method: 'POST',
      headers: {},
    })
  })
}

export function getVerifyCode(phoneNum: string) {
  return loadRequestOptions().then(([host, port]) => {
    const url = `http://${host}:${port}/login/sendSmsVerifyCode/${phoneNum}`

    return sendRequest({
      url,
      method: 'POST',
      headers: {},
    })
  })
}

export function getBookWords(bookId: number) {
  return loadRequestOptions().then(([host, port, accessToken]) => {
    const url = `http://${host}:${port}/book/${bookId}/words`

    return sendRequest({
      url,
      method: 'GET',
      headers: { access_token: accessToken },
    })
  })
}

async function removeWord(data: unknown, topicId: number) {
  WordbookStorage.remove(await getWordbookId(), topicId)

  return data
}
async function addWord(word: Dict, data: unknown) {
  const wordInfo = word.word_basic_info
  const chineseMeans: Record<string, string[]> = {}
  word.chn_means.forEach((it) => {
    let array = chineseMeans[it.mean_type]
    if (isNil(array))
      array = []
    array.push(it.mean)
    chineseMeans[it.mean_type] = array
  })
  const meanString = Object.entries(chineseMeans)
    .map(([k, v]) => `${k} ${v.join('；')}`)
    .join('； ')
  const bookId = await getWordbookId()

  WordbookStorage.add(bookId, {
    audio_uk: wordInfo.accent_uk_audio_uri,
    audio_us: wordInfo.accent_usa_audio_uri,
    book_id: bookId,
    mean: meanString,
    setAudio_uk: true,
    setAudio_us: true,
    setBook_id: true,
    setCreated_at: true,
    setMean: true,
    setTopic_id: true,
    setWord: true,
    topic_id: wordInfo.topic_id,
    word: wordInfo.word,
  })

  return data
}
export function collectWord(word: Dict) {
  console.log('collectWord', word)
  const topicId = word.word_basic_info.topic_id

  return Promise.all([
    loadRequestOptions(),
    getWordbookId(),
  ])
    .then(([[host, port, accessToken], bookId]) => {
      const url = `http://${host}:${port}/book/${bookId}/word/${topicId}`

      return sendRequest({
        url,
        method: 'PUT',
        headers: { access_token: accessToken },
      })
    })
    .then(async data => addWord(word, data))
}
export function cancelCollectWordById(topicId: number) {
  return Promise.all([
    loadRequestOptions(),
    getWordbookId(),
  ])
    .then(([[host, port, accessToken], bookId]) => {
      const url = `http://${host}:${port}/book/${bookId}/word/${topicId}`

      return sendRequest({
        url,
        method: 'DELETE',
        headers: { access_token: accessToken },
      })
    })
    .then(async data => removeWord(data, topicId))
}
export function cancelCollectWord(word: Dict) {
  console.log('cancelCollectWordById', word)
  const topicId = word.word_basic_info.topic_id
  return cancelCollectWordById(topicId)
}

export function getBooks() {
  return loadRequestOptions().then(([host, port, accessToken]) => {
    const url = `http://${host}:${port}/books`

    return sendRequest({
      url,
      method: 'GET',
      headers: { access_token: accessToken },
    })
  })
}

export function translate(phrase: string) {
  return loadRequestOptions().then(([host, port, accessToken]) => {
    const encodePrharse = encodeURIComponent(phrase)
    const url = `http://${host}:${port}/translate?text=${encodePrharse}`

    return sendRequest({
      url,
      method: 'GET',
      headers: { access_token: accessToken },
    })
  })
}

interface Args {
  topicId: number
  bookId?: number
}
export function getWordVideo(params: Args) {
  console.log('getWordVideo->topicId,bookId', params)
  return loadRequestOptions().then(async ([host, port, accessToken]) => {
    console.log(host, port)
    if (isEmpty(accessToken) || accessToken === 'null')
      return null

    const url = `https://words-100-api.honwhy.wang/api/resource/xMode`
    const raw = {
      bookId: params.bookId ?? 621, // 11
      topicIds: [params.topicId],
    }
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(raw),
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken,
        // 'Referer': 'https://learn.baicizhan.com/',
        // 'Origin': 'https://learn.baicizhan.com',
      },
    })
    return response.json()
  })
}
