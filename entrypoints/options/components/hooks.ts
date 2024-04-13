import { onMounted, ref } from 'vue'
import storageModule from '@/utils/storages'
import EventBus from '@/utils/eventBus'
import Events from '@/utils/events'
import { getBooks } from '@/utils/api'

export interface UserBook {
  user_book_id: string
  book_name: string
  word_num: number
}
export interface UserBooks {
  user_books: UserBook[]
}
const selectedBookId = ref(0)
onMounted(async () => {
  const id = await storageModule.get('bookId')
  selectedBookId.value = id as number
})
const options = ref<LabelOption[]>([])
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
// async function generateWordbooks(res: unknown) {
//   const data = res as UserBooks
//   options.value = data.user_books.map(book => ({
//     value: book.user_book_id,
//     label: `${book.book_name}(已收录 ${book.word_num} 词)`,
//   }))
// }

EventBus.on(Events.BOOKS_LOADED, () => {
  console.log('WordBook got BOOKS_LOADED')
  loadWordbook()
})
export function useWordBook() {
  return {
    selectedBookId,
    options,
  }
}
