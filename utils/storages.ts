// utils/storages.ts
const namespace = 'baicizhan-helper'

function get(arg: string | string[]) {
  return Array.isArray(arg) ? getMulit(arg) : getSingle(arg)
}

function getSingle(key: string) {
  const completeKey = `local:${namespace}.${key}`
  return storage.getItem(completeKey)
}

function getMulit(keys: string[]) {
  const completeKeys = keys.map(key => `local:${namespace}.${key}`)
  return storage.getItems(completeKeys)
}

function set(key: string, value: unknown) {
  const completeKey = `local:${namespace}.${key}`
  // if (typeof value === 'object') {
  //     value = JSON.stringify(value)
  // }
  return storage.setItem(completeKey, value)
}

function remove(keys: string[]) {
  const completeKeys = keys.map(key => `local:${namespace}.${key}`)

  return storage.removeItems(completeKeys)
}

// alias
const getStorageInfo = get

const storageModule = { set, get, getStorageInfo, remove }
export default storageModule
