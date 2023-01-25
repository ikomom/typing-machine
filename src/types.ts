export interface InsertPatch {
  type: 'insert'
  // 删除开始位置
  from: number
  text: string
}
export interface RemovalPatch {
  type: 'removal'
  // 删除开始位置
  from: number
  length: number
}

export type Patch = InsertPatch | RemovalPatch
