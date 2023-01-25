import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  declaration: true,
  clean: true,
  externals: [
    // 'diff-match-patch-typescript',
  ],
  rollup: {
    emitCJS: true,
    // inlineDependencies: true,
  },
})
