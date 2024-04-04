export interface Word {
  word: string
  topic_id: number
  mean_cn: string
  accent: string
}
interface WordBasicInfo {
  word: string
  topic_id: number
  accent_uk: string
  accent_uk_audio_uri: string
  accent_usa: string
  accent_usa_audio_uri: string
  __collected__?: boolean
}
export interface VariantInfo {
  noun: string
  noun_topic_id: number
  verb: string
  verb_topic_id: number
  adj: string
  adj_topic_id: number
  pl: string
  pl_topic_id: number
  adv: string
  adv_topic_id: number
  est: string
  est_topic_id: number
  done: string
  done_topic_id: number
  past: string
  past_topic_id: number
  third: string
  third_topic_id: number
  er: string
  er_topic_id: number

}
interface ChnMean {
  accent_uk_audio_uri: string
  accent_usa: string
  accent_usa_audio_uri: string
  id: number
  mean: string
  mean_type: string
  setAccent_uk: boolean
  setAccent_uk_audio_uri: boolean
  setAccent_usa: boolean
  setAccent_usa_audio_uri: boolean
  setId: boolean
  setMean: boolean
  setMean_type: boolean
  setTopic_id: boolean
  topic_id: number
}
export interface Sentence {
  audio_uri: string
  chn_mean_id: number
  highlight_phrase: string
  id: number
  img_uri: string
  sentence: string
  sentence_trans: string
  setAudio_uri: boolean
  setChn_mean_id: boolean
  setHighlight_phrase: boolean
  setId: boolean
  setImg_uri: boolean
  setSentence: boolean
  setSentence_trans: boolean
  setTopic_id: boolean
  topic_id: number
}
export interface ShortPhrase {
  chn_mean_id: number
  id: number
  setChn_mean_id: boolean
  setId: boolean
  setShort_phrase: boolean
  setShort_phrase_topic_id: boolean
  setShort_phrase_trans: boolean
  setTopic_id: boolean
  short_phrase: string
  short_phrase_topic_id: number
  short_phrase_trans: string
  topic_id: number
}
export interface Dict {
  word_basic_info: WordBasicInfo
  variant_info: VariantInfo
  chn_means: ChnMean[]
  sentences: Sentence[]
  short_phrases: ShortPhrase[]
}
export interface WordDetail {
  dict: Dict
}
