<script setup lang="ts">
import type { AsyncHintFunction, HintFunction, HintFunctionResolver } from 'codemirror/index'
import { useCodeMirror } from '../logics/codemirror'

const props = defineProps<{
  modelValue: string
  mode?: string
  readOnly?: boolean
  matched?: Set<string> | string[]
  getHint?: HintFunction | AsyncHintFunction | HintFunctionResolver
}>()
// import 'codemirror/addon/hint/show-hint'
const emit = defineEmits<{ (input: any): void }>()

const textarea = ref<HTMLTextAreaElement>()
const input = useVModel(props, 'modelValue', emit, { passive: true })

const modeMap: Record<string, any> = {
  html: 'htmlmixed',
  vue: 'htmlmixed',
  svelte: 'htmlmixed',
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: { name: 'javascript', typescript: true },
  mts: { name: 'javascript', typescript: true },
  cts: { name: 'javascript', typescript: true },
  jsx: { name: 'javascript', jsx: true },
  tsx: { name: 'javascript', typescript: true, jsx: true },
}

onMounted(() => {
  const cm = useCodeMirror(textarea, input, {
    ...props,
    mode: modeMap[props.mode || ''] || props.mode,
    ...props.getHint
      ? {
          extraKeys: {
            'Ctrl-Space': 'autocomplete',
            'Ctrl-.': 'autocomplete',
            'Cmd-Space': 'autocomplete',
            'Cmd-.': 'autocomplete',
            'Tab': 'autocomplete',
          },
          hintOptions: {
            hint: props.getHint,
          },
        }
      : {},
  })
  if (props.getHint) {
    cm.on('keyup', (editor, event) => {
      if (event.key.match(/^[\w:-]$/))
        editor.execCommand('autocomplete')
    })
  }
  setTimeout(() => cm.refresh(), 100)

  const decorations: CodeMirror.TextMarker<CodeMirror.MarkerRange>[] = []

  function mark(start: number, end: number) {
    decorations.push(cm.markText(
      cm.posFromIndex(start),
      cm.posFromIndex(end),
      { className: 'highlighted' },
    ))
  }
})
</script>

<template>
  <div
    relative
    font-mono
    text-sm
  >
    <textarea ref="textarea" />
  </div>
</template>

<style lang="postcss">
@import "codemirror-theme-vars/base.css";

.CodeMirror {
  width: 100%;
  height: 100%;
}

.cm-s-vars .cm-tag {
  color: var(--cm-keyword);
}

:root {
  --cm-font-family: 'Fira Code', monospace;
  --cm-foreground: #393a3480;
  --cm-background: #fffff;
  --cm-comment: #a0ada0;
  --cm-string: #b56959;
  --cm-literal: #2f8a89;
  --cm-number: #296aa3;
  --cm-keyword: #1c6b48;
  --cm-function: #6c7834;
  --cm-boolean: #1c6b48;
  --cm-constant: #a65e2b;
  --cm-deleted: #a14f55;
  --cm-class: #2993a3;
  --cm-builtin: #ab5959;
  --cm-property: #b58451;
  --cm-namespace: #b05a78;
  --cm-punctuation: #8e8f8b;
  --cm-decorator: #bd8f8f;
  --cm-regex: #ab5e3f;
  --cm-json-property: #698c96;
  /* scrollbars colors */
  --cm-ttc-c-thumb: #eee;
  --cm-ttc-c-track: white;
  --cm-line-number-gutter: #fdfdfd;

}

html.dark {
  --cm-scheme: dark;
  --cm-foreground: #d4cfbf;
  --cm-background: #080808;
  --cm-comment: #758575;
  --cm-string: #d48372;
  --cm-literal: #429988;
  --cm-keyword: #4d9375;
  --cm-boolean: #1c6b48;
  --cm-number: #6394bf;
  --cm-variable: #c2b36e;
  --cm-function: #a1b567;
  --cm-deleted: #a14f55;
  --cm-class: #54b1bf;
  --cm-builtin: #e0a569;
  --cm-property: #dd8e6e;
  --cm-namespace: #db889a;
  --cm-punctuation: #858585;
  --cm-decorator: #bd8f8f;
  --cm-regex: #ab5e3f;
  --cm-json-property: #6b8b9e;
  --cm-line-number: #888888;
  --cm-line-number-gutter: #444444;
  --cm-line-highlight-background: #444444;
  --cm-selection-background: #444444;
}
</style>
