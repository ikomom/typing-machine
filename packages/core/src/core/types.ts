export interface InsertPatch {
  type: 'insert'
  // 删除开始位置
  cursor: number
  content: string
}
export interface RemovalPatch {
  type: 'removal'
  // 删除开始位置
  cursor: number
  length: number
}

export type Patch = InsertPatch | RemovalPatch

export interface AnimatorStepInsert {
  type: 'insert'
  cursor: number
  content: string
  char: string
}

export interface AnimatorStepInsertCommon {
  type: 'insert-start' | 'insert-end'
  cursor: number
  content: string
}

export interface AnimatorStepRemoval {
  type: 'removal' | 'removal-start' | 'removal-end'
  cursor: number
  content: string
}
export interface AnimatorStepInit {
  type: 'init'
  content: string
}

export interface AnimatorStepPatch {
  type: 'new-patch'
  patch: Patch
  index: number
}
export interface AnimatorStepSnap {
  type: 'new-snap'
  snap: Snapshot
  index: number
}

export interface AnimatorFinish {
  type: 'animator-finish'
  content: string
}

export type AnimatorStep = AnimatorFinish | AnimatorStepInsert | AnimatorStepInsertCommon | AnimatorStepRemoval | AnimatorStepInit | AnimatorStepPatch | AnimatorStepSnap

export interface Snapshot {
  content: string
  options?: SnapshotOptions
}

export interface SnapshotOptions {
  // 等待时间
  wait?: number
  pause?: boolean
}
