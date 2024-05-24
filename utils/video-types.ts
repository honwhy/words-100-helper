interface Word {
  topicId: number
  word: string
  wordSplit: string
  accentUs: string
  accentUk: string
  audioUs: string
  audioUk: string
  exam?: any // Consider replacing 'any' with a more specific type if known
}

interface Mnemonic {
  type: number
  content: string
  imgContent?: null | string // Assuming 'null' or a string could be present
}

interface CnMean {
  mId: number
  meanType: string
  mean: string
  percent?: string | null // Percent can be a string or null
}

interface EnMean {
  mId: number
  meanType: string
  mean: string
  percent?: null // Assuming percent is always null based on the sample
}

interface Sentence {
  sId: number
  sentenceEn: string
  translate: string
  audio: string
  image?: string // Image URL can be optional
  origin?: string // Origin can be optional
  phrase?: string // Phrase can be optional
}

interface Phrase {
  pId: number
  phrase: string
  mean: string
}

interface Variant {
  vId: number
  type: string
  variant: string
}

interface Derivation {
  dId: number
  word: string
  mean: string
}

interface Resource {
  word: Word
  mnemonic: Mnemonic
  cnMean: CnMean[]
  enMean: EnMean[]
  sentences: Sentence[]
  phrases: Phrase[]
  variant: Variant[]
  derivations: Derivation[]
  tvInfo?: null // Assuming tvInfo is always null based on the sample
  synonyms?: null // Assuming synonyms is always null based on the sample
  antonyms?: null // Assuming antonyms is always null based on the sample
  similars?: any[] // Consider replacing 'any' with a more specific type if known
}

interface Wiki {
  cnMean: {
    examOrder: number[]
    meanOrder: string[]
  }
  pages: {
    meanId: number
    sentenceIds: number[]
  }[]
  extension: {
    order: number[]
    bold: never[] // Assuming 'bold' is an empty array or should be defined more specifically
  }
}

interface XModeTopic {
  id: number
  topicId: number
  bookId: number
  chnMean: string
  sentence: string
  sentenceTrans: string
  sentenceAudio: string
  sentenceImg?: string // Image URL can be optional
  // 视频地址
  video?: string // Video URL can be optional
  videoImg?: string // Video thumbnail URL can be optional
  optionChn: {
    text: string
  }[]
}

interface SimilarWord {
  topicId: number
  word: string
  meanType: string
  mean: string
}

interface DataItem {
  resource: Resource
  wiki: Wiki
  // 视频内容
  xModeTopic: XModeTopic
  similarWordList: SimilarWord[]
  collected: boolean
}

export interface ResponseData {
  data: DataItem[]
  message?: null // Assuming message is always null based on the sample
  code: number
}
