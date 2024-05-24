import { cancelCollectWord, collectWord, getWordInfo, getWordVideo, translate } from '@/utils/api'
import storageModule from '@/utils/storages'

export const actions = {
  getWordInfo,
  getStorageInfo: storageModule.getStorageInfo,
  cancelCollectWord,
  collectWord,
  translate,
  getWordVideo,
} as const
