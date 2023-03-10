const path = require('path')
const fs = require('fs')
const oniguruma = require('vscode-oniguruma')
const vsctm = require('vscode-textmate')

const machineSyntaxes = 'source.typingmachine'
function readFile(p) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, p), (error, data) => error ? reject(error) : resolve(data))
  })
}
async function tokenizeFile(filePath, scope) {
  const content = await readFile(filePath)
  const lines = content.toString().split(/\r\n|\r|\n/)

  const wasmBin = await readFile('../node_modules/vscode-oniguruma/release/onig.wasm')
  const vscodeOnigurumaLib = oniguruma.loadWASM(wasmBin.buffer).then(() => {
    return {
      createOnigScanner(patterns) {
        return new oniguruma.OnigScanner(patterns)
      },
      createOnigString(s) {
        return new oniguruma.OnigString(s)
      },
    }
  })

  // Create a registry that can create a grammar from a scope name.
  const registry = new vsctm.Registry({
    onigLib: vscodeOnigurumaLib,
    loadGrammar: async (scopeName) => {
      let grammarPath = null
      try {
        if (scopeName === machineSyntaxes)
          grammarPath = path.resolve(__dirname, '..', 'syntaxes/tmLanguage.json')
        else if (scopeName === 'source.yaml')
          grammarPath = path.resolve(__dirname, '..', 'syntaxes/yaml.json')
        if (grammarPath) {
          const res = await readFile(grammarPath)
          return vsctm.parseRawGrammar(res.toString(), grammarPath)
        }
      }
      catch (e) {
        console.error(e)
        return null
      }
      console.log(`Unknown scope name: ${scopeName}`)
      return null
    },
  })

  // Load the JavaScript grammar and any other grammars included by it async.
  const grammar = await registry.loadGrammar(scope)
  if (!grammar)
    return

  const onigurumaTime = tokenize(grammar, lines)
  console.log(`TOKENIZING ${content.length} lines using grammar ${scope}`)
  console.log(`Oniguruma: ${onigurumaTime} ms.`)
}
// 序列化
function tokenize(grammar, lines) {
  const start = Date.now()
  let ruleStack = vsctm.INITIAL
  const stack = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineTokens = grammar.tokenizeLine(line, ruleStack)
    stack.push(`\nTokenizing line: ${line}`)

    for (let j = 0; j < lineTokens.tokens.length; j++) {
      const token = lineTokens.tokens[j]
      stack.push(` - token from ${token.startIndex} to ${token.endIndex} `
        + `【${line.substring(token.startIndex, token.endIndex)}】 `
        + `\n -【${token.scopes.join(', ')}】`)
    }
    ruleStack = lineTokens.ruleStack
  }

  fs.writeFileSync(path.resolve(__dirname, './syntaxes.temp'), stack.join('\n'), 'utf8')
  return Date.now() - start
}

tokenizeFile('../../../example/main.js.typingmachine', machineSyntaxes)
