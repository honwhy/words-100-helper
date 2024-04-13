import { cancelCollectWord, collectWord, getWordInfo } from '@/utils/api'
import storageModule from '@/utils/storages'

export const actions = {
  getWordInfo,
  getStorageInfo: storageModule.getStorageInfo,
  cancelCollectWord,
  collectWord,
} as const
