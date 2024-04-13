import { storage } from 'wxt/storage'
import { WordDetail } from './models'
/**
 * 静态方法实现，则每次读取全部的 storage 内容（并回写）
 * 缺点：数据写入写出频繁，效率低
 * 优点：开发简单，无数据不一致性问题
 *
 * 对象实现，需要考虑对象的生命周期，以及数据一致性问题
 * 缺点：开发难度稍大，存在数据不一致的问题
 * 优点：效率有一定提升
 *
 * 当前不考虑效率问题，使用静态方法实现
 */

const KEY_PREFIX = 'baicizhan-helper.wordbook'

const load = function (bookId: number) {
  return loadWordbook(bookId)
}

function loadWordbook(bookId: number) {
  const key = `local:${KEY_PREFIX}${bookId}`

  return storage.getItem(key)
}

const save = function (bookId: number, data: any) {
  return saveWordbook(bookId, data)
}

function saveWordbook(bookId: number, data: any) {
  const key = `local:${KEY_PREFIX}${bookId}`

  return storage.setItem(key, data)
}

const add = function (bookId: number, word: any) {
  if (!word)
    return

  word.created_at = new Date().getTime()

  return new Promise((resolve) => {
    load(bookId)
      .then((wordbook) => {
        const wordList = wordbook as unknown as Word[]
        const topicIdSet = new Set(wordList.map(word => word.topic_id))

        if (!topicIdSet.has(word.topic_id)) {
          wordList.push(word)
          save(bookId, wordbook)
        }

        resolve(true)
      })
  })
}

const remove = function (bookId: number, topicId: number) {
  if (!topicId)
    return

  return new Promise((resolve) => {
    load(bookId)
      .then((wordbook) => {
        const wordList = wordbook as unknown as Word[]
        const filteredWordbook = wordList.filter(word => word.topic_id !== topicId)

        save(bookId, filteredWordbook)
        resolve(true)
      })
  })
}

const contains = function (bookId: number, topicId: number) {
  return new Promise((resolve) => {
    load(bookId)
      .then((wordbook) => {
        if (!wordbook) {
          resolve(false)
          return
        }
        const wordList = wordbook as unknown as Word[]
        const data = wordList.map((it) => {
          const word = it as unknown as Word
          return word.topic_id
        })
        const topicIdSet = new Set(data)

        resolve(topicIdSet.has(topicId))
      })
  })
}

const clear = function () {
  browser.storage.local.get().then((res) => {
    Object.keys(res).forEach((key) => {
      console.log(key)
      if (key.startsWith(KEY_PREFIX))
        browser.storage.local.remove(key)
    })
  })
}

const WordbookStorage = { load, save, add, remove, contains, clear }
export default WordbookStorage
