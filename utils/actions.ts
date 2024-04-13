import { cancelCollectWord, collectWord, getWordInfo, translate } from '@/utils/api'
import storageModule from '@/utils/storages'

export const actions = {
  getWordInfo,
  getStorageInfo: storageModule.getStorageInfo,
  cancelCollectWord,
  collectWord,
  translate,
} as const
