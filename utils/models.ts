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
export interface Dict {
  word_basic_info: WordBasicInfo
  variant_info: VariantInfo
}
export interface WordDetail {
  dict: Dict
}
