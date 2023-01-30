function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}
export function replaceAll(str: string, match: string, replacement = '') {
  return str.replace(new RegExp(escapeRegExp(match), 'g'), () => replacement)
}

export function replaceEOL(str: string) {
  return replaceAll(replaceAll(str, '\n'), '\r')
}
